"""
Tubhyam AI Virtual Try-On Service
Powered by Stable Diffusion 1.5 + IP-Adapter — 100% Free & Open Source

Two generation modes:
  1. /api/try-on/ai-model  -> Generates an AI fashion model (body type + skin tone
                              controlled via prompt) wearing the given garment
                              (IP-Adapter garment conditioning).
  2. /api/try-on           -> Person photo try-on: masks the torso region and
                              inpaints the garment onto the person (inpainting
                              pipeline, lazily loaded & swapped with the base one).

Designed for low-VRAM GPUs (>= 4GB) via fp16 + attention slicing.
"""

import io
import base64
import gc
import threading
import traceback

import torch
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from PIL import Image

app = FastAPI(title="Tubhyam AI Try-On", version="2.0.0")

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Globals
# ---------------------------------------------------------------------------
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
LOW_VRAM = (
    DEVICE.type == "cuda"
    and torch.cuda.get_device_properties(0).total_memory < 8 * 1024 ** 3
)

# NOTE: these original IDs 307-redirect to the community mirrors on HF and
# huggingface_hub follows redirects automatically — keep them consistent with
# any pre-downloaded cache (cache keys use the requested repo id).
BASE_MODEL_ID = "runwayml/stable-diffusion-v1-5"
INPAINT_MODEL_ID = "runwayml/stable-diffusion-inpainting"
IP_ADAPTER_REPO = "h94/IP-Adapter"
IP_ADAPTER_WEIGHT = "ip-adapter_sd15.bin"

_txt2img_pipe = None        # SD1.5 + IP-Adapter (ai-model mode)
_inpaint_pipe = None        # SD1.5-inpainting (person photo mode)
_active_pipe = None         # which pipeline currently resides on GPU
_model_lock = threading.Lock()

MODEL_LOADED = False
MODEL_ERROR = ""


# ---------------------------------------------------------------------------
# Prompt builders
# ---------------------------------------------------------------------------
BODY_PROMPTS = {
    "slim": "slim body, slender fit figure",
    "average": "average body, natural healthy figure",
    "plus-size": "plus size body, curvy fuller figure",
}

SKIN_PROMPTS = {
    "fair": "fair skin tone",
    "medium": "medium wheatish skin tone",
    "dark": "dusky deep skin tone",
}

NEGATIVE_PROMPT = (
    "deformed, distorted, disfigured, bad anatomy, extra limbs, missing limbs, "
    "mutation, mutated hands, extra fingers, poorly drawn face, blurry, "
    "low quality, worst quality, watermark, signature, text, cropped, "
    "out of frame, jpeg artifacts"
)


def _build_model_prompt(body_type: str, skin_tone: str) -> str:
    body = BODY_PROMPTS.get(body_type, BODY_PROMPTS["average"])
    skin = SKIN_PROMPTS.get(skin_tone, SKIN_PROMPTS["medium"])
    return (
        f"full body fashion photography of a beautiful indian woman, {body}, {skin}, "
        f"wearing the exact outfit shown in the reference image, standing pose, "
        f"front facing, professional studio lighting, fashion magazine quality, "
        f"photorealistic, highly detailed fabric, elegant, 8k"
    )


# ---------------------------------------------------------------------------
# Model loading / swapping helpers
# ---------------------------------------------------------------------------
def _move_to_device(pipe):
    """Activate a cached pipeline without exceeding the available GPU memory."""
    global _active_pipe

    if LOW_VRAM:
        # Accelerate moves only the active module to the GPU during inference.
        # This is required for the RTX 3050 Ti's 4 GB VRAM.
        if _active_pipe is not None and _active_pipe is not pipe:
            _active_pipe.maybe_free_model_hooks()
            gc.collect()
            torch.cuda.empty_cache()
        _active_pipe = pipe
        return pipe

    if _active_pipe is not None and _active_pipe is not pipe:
        _active_pipe = _active_pipe.to("cpu")
        gc.collect()
        if DEVICE.type == "cuda":
            torch.cuda.empty_cache()
    pipe.to(DEVICE)
    _active_pipe = pipe
    return pipe


def _configure_low_vram(pipe):
    if LOW_VRAM:
        pipe.enable_attention_slicing()
        # enable_vae_slicing() removed in newer diffusers versions
    return pipe


def _activate_new_pipeline(pipe):
    """Put a newly loaded pipeline in the appropriate memory mode."""
    global _active_pipe
    if LOW_VRAM:
        pipe.enable_model_cpu_offload()
    else:
        pipe.to(DEVICE)
    _active_pipe = pipe
    return pipe


def get_txt2img_pipe():
    """Load (once) the SD1.5 text-to-image pipeline with IP-Adapter."""
    global _txt2img_pipe, MODEL_LOADED, MODEL_ERROR
    if _txt2img_pipe is not None:
        return _move_to_device(_txt2img_pipe)

    with _model_lock:
        if _txt2img_pipe is not None:
            return _move_to_device(_txt2img_pipe)
        try:
            from diffusers import StableDiffusionPipeline

            dtype = torch.float16 if DEVICE.type == "cuda" else torch.float32
            pipe = StableDiffusionPipeline.from_pretrained(
                BASE_MODEL_ID,
                torch_dtype=dtype,
                safety_checker=None,
                requires_safety_checker=False,
            )

            # Garment conditioning MUST be loaded before any attention slicing,
            # otherwise SlicedAttnProcessor causes IP-Adapter loading to fail.
            pipe.load_ip_adapter(IP_ADAPTER_REPO, subfolder="models", weight_name=IP_ADAPTER_WEIGHT)

            _activate_new_pipeline(pipe)
            _txt2img_pipe = pipe
            MODEL_LOADED = True
            MODEL_ERROR = ""
            print(f"[try-on] text2img + IP-Adapter ready on {DEVICE}")
            return pipe
        except Exception:
            MODEL_ERROR = traceback.format_exc()
            print(f"[try-on] FAILED to load text2img pipeline:\n{MODEL_ERROR}")
            raise


def get_inpaint_pipe():
    """Load (once) the SD1.5 inpainting pipeline; swaps GPU memory with txt2img."""
    global _inpaint_pipe
    if _inpaint_pipe is not None:
        return _move_to_device(_inpaint_pipe)

    with _model_lock:
        if _inpaint_pipe is not None:
            return _move_to_device(_inpaint_pipe)
        try:
            from diffusers import StableDiffusionInpaintPipeline

            dtype = torch.float16 if DEVICE.type == "cuda" else torch.float32
            pipe = StableDiffusionInpaintPipeline.from_pretrained(
                INPAINT_MODEL_ID,
                torch_dtype=dtype,
                safety_checker=None,
                requires_safety_checker=False,
            )
            _configure_low_vram(pipe)
            # NOTE: inpainting pipeline also gets the IP-Adapter so the garment
            # image can steer what is painted inside the mask.
            pipe.load_ip_adapter(IP_ADAPTER_REPO, subfolder="models", weight_name=IP_ADAPTER_WEIGHT)
            _activate_new_pipeline(pipe)
            _inpaint_pipe = pipe
            print(f"[try-on] inpainting + IP-Adapter ready on {DEVICE}")
            return pipe
        except Exception:
            print(f"[try-on] FAILED to load inpainting pipeline:\n{traceback.format_exc()}")
            raise


# ---------------------------------------------------------------------------
# Image helpers
# ---------------------------------------------------------------------------
def _read_image(upload: UploadFile, size=None) -> Image.Image:
    img = Image.open(io.BytesIO(upload.file.read())).convert("RGB")
    if size:
        img = img.resize(size)
    return img


def _png_response(img: Image.Image, extra_headers: dict = None) -> Response:
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    headers = extra_headers or {}
    return Response(content=buf.read(), media_type="image/png", headers=headers)


def _torso_mask(width: int, height: int) -> Image.Image:
    """
    Heuristic clothing mask: covers the torso/dress area of a front-facing
    standing photo. 255 = repaint region, 0 = keep.
    """
    mask = Image.new("L", (width, height), 0)
    from PIL import ImageDraw
    draw = ImageDraw.Draw(mask)
    left = int(width * 0.12)
    right = int(width * 0.88)
    top = int(height * 0.18)     # below the neck/face
    bottom = int(height * 0.92)  # down to ankles (covers full outfit)
    draw.rounded_rectangle([left, top, right, bottom], radius=int(width * 0.06), fill=255)
    return mask


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/")
async def root():
    return {"message": "Tubhyam AI Try-On Service", "version": "2.0.0", "status": "running"}


@app.get("/health")
@app.get("/api/try-on/health")  # alias so the Express proxy can mirror the same path
async def health_check():
    return {
        "status": "healthy",
        "device": str(DEVICE),
        "model_loaded": _txt2img_pipe is not None,
        "inpaint_loaded": _inpaint_pipe is not None,
        "error": MODEL_ERROR or None,
    }


@app.post("/api/try-on/ai-model")
async def ai_model_try_on(
    garment_image: UploadFile = File(...),
    body_type: str = Form("average"),
    skin_tone: str = Form("medium"),
    seed: int = Form(-1),
):
    """
    Generate an AI fashion model with the requested body type + skin tone,
    wearing the uploaded garment (IP-Adapter conditioned).
    """
    try:
        pipe = get_txt2img_pipe()

        garment = _read_image(garment_image, size=(512, 512))

        generator = None
        if seed >= 0:
            generator = torch.Generator(device=DEVICE).manual_seed(seed)

        pipe.set_ip_adapter_scale(0.9)
        result = pipe(
            prompt=_build_model_prompt(body_type, skin_tone),
            negative_prompt=NEGATIVE_PROMPT,
            ip_adapter_image=garment,
            num_inference_steps=28,
            guidance_scale=7.5,
            height=768,
            width=512,
            generator=generator,
        ).images[0]

        return _png_response(result, {
            "X-Body-Type": body_type,
            "X-Skin-Tone": skin_tone,
            "X-Device": str(DEVICE),
        })
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"AI generation failed: {e}")


@app.post("/api/try-on")
async def virtual_try_on(
    person_image: UploadFile = File(...),
    garment_image: UploadFile = File(...),
    body_type: str = Form("average"),
    skin_tone: str = Form("medium"),
):
    """
    Person-photo try-on: inpaints the garment onto the person's photo.
    The torso region is masked and repainted with IP-Adapter garment guidance.
    """
    try:
        pipe = get_inpaint_pipe()

        person = _read_image(person_image, size=(512, 768))
        garment = _read_image(garment_image, size=(512, 512))
        mask = _torso_mask(512, 768)

        body = BODY_PROMPTS.get(body_type, BODY_PROMPTS["average"])
        skin = SKIN_PROMPTS.get(skin_tone, SKIN_PROMPTS["medium"])
        prompt = (
            f"a photo of the same indian woman, {body}, {skin}, now wearing the exact "
            f"outfit shown in the reference image, photorealistic, seamless, detailed fabric"
        )

        pipe.set_ip_adapter_scale(0.85)
        result = pipe(
            prompt=prompt,
            negative_prompt=NEGATIVE_PROMPT,
            image=person,
            mask_image=mask,
            ip_adapter_image=garment,
            num_inference_steps=28,
            guidance_scale=7.5,
            strength=0.99,
            generator=None,
        ).images[0]

        return _png_response(result, {
            "X-Body-Type": body_type,
            "X-Skin-Tone": skin_tone,
            "X-Device": str(DEVICE),
        })
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"AI generation failed: {e}")


@app.post("/api/try-on/batch")
async def batch_ai_model_try_on(
    garment_images: list[UploadFile] = File(...),
    body_type: str = Form("average"),
    skin_tone: str = Form("medium"),
):
    """Generate AI-model try-ons for multiple garments at once (base64 results)."""
    results = []
    pipe = get_txt2img_pipe()
    pipe.set_ip_adapter_scale(0.9)
    prompt = _build_model_prompt(body_type, skin_tone)

    for garment_upload in garment_images:
        try:
            garment = _read_image(garment_upload, size=(512, 512))
            img = pipe(
                prompt=prompt,
                negative_prompt=NEGATIVE_PROMPT,
                ip_adapter_image=garment,
                num_inference_steps=28,
                guidance_scale=7.5,
                height=768,
                width=512,
            ).images[0]

            buf = io.BytesIO()
            img.save(buf, format="PNG")
            results.append({
                "garment": garment_upload.filename,
                "image": base64.b64encode(buf.getvalue()).decode(),
            })
        except Exception as e:
            results.append({"garment": garment_upload.filename, "error": str(e)})

    return {"results": results}


@app.post("/api/try-on/multi-garment")
async def multi_garment_try_on(
    garment_images: list[UploadFile] = File(...),
    body_type: str = Form("average"),
    skin_tone: str = Form("medium"),
):
    """
    Fitting Room multi-garment layering: generates a single AI model photo
    wearing all uploaded garments combined (top + bottom + outerwear).

    With SD1.5 + IP-Adapter we condition on the *primary* (first) garment
    image and weave the remaining pieces into the text prompt so the model
    composes a cohesive layered look.
    """
    try:
        if len(garment_images) == 0:
            raise HTTPException(status_code=400, detail="At least one garment image is required")

        pipe = get_txt2img_pipe()

        # Read all garments — primary drives IP-Adapter, rest steer the prompt
        garments = []
        garment_labels = []
        for g in garment_images[:3]:  # cap at 3
            garments.append(_read_image(g, size=(512, 512)))
            garment_labels.append(g.filename or "garment")

        primary = garments[0]

        # Build a layered prompt that mentions every piece
        body = BODY_PROMPTS.get(body_type, BODY_PROMPTS["average"])
        skin = SKIN_PROMPTS.get(skin_tone, SKIN_PROMPTS["medium"])
        pieces = ", ".join(garment_labels)
        prompt = (
            f"full body fashion photography of a beautiful indian woman, {body}, {skin}, "
            f"wearing {pieces}, layered outfit, standing pose, front facing, "
            f"professional studio lighting, fashion magazine quality, "
            f"photorealistic, highly detailed fabric, elegant, 8k"
        )

        pipe.set_ip_adapter_scale(0.9)
        result = pipe(
            prompt=prompt,
            negative_prompt=NEGATIVE_PROMPT,
            ip_adapter_image=primary,
            num_inference_steps=28,
            guidance_scale=7.5,
            height=768,
            width=512,
        ).images[0]

        return _png_response(result, {
            "X-Body-Type": body_type,
            "X-Skin-Tone": skin_tone,
            "X-Device": str(DEVICE),
            "X-Garment-Count": str(len(garments)),
        })
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Multi-garment generation failed: {e}")


if __name__ == "__main__":
    import uvicorn

    print("=" * 56)
    print("Tubhyam AI Try-On Service v2.0 (SD1.5 + IP-Adapter)")
    print("=" * 56)
    print(f"Device : {DEVICE}")
    if DEVICE.type == "cuda":
        props = torch.cuda.get_device_properties(0)
        print(f"GPU    : {props.name} ({props.total_memory / (1024**3):.1f} GB)")
    print("Server : http://localhost:8000")
    print("Docs   : http://localhost:8000/docs")
    print("=" * 56)

    uvicorn.run(app, host="0.0.0.0", port=8000)
