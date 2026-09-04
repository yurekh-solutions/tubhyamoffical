"""
Tubhyam AI Virtual Try-On Service
FastAPI backend for photorealistic virtual try-on using IDM-VTON
"""

import os
import io
import base64
import logging
from pathlib import Path
from typing import Optional
from contextlib import asynccontextmanager

import torch
import numpy as np
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global model variables
model = None
device = None

# Model cache directory
MODEL_CACHE = Path(__file__).parent / "models"
MODEL_CACHE.mkdir(exist_ok=True)


class TryOnRequest(BaseModel):
    """Request model for try-on"""
    color: Optional[str] = "original"
    product_name: Optional[str] = None


class TryOnResponse(BaseModel):
    """Response model for try-on"""
    success: bool
    image: Optional[str] = None  # base64 encoded
    message: Optional[str] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load model on startup"""
    global model, device
    logger.info("Loading AI Try-On model...")
    try:
        device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Using device: {device}")
        
        # Load IDM-VTON model
        model = load_idm_vton_model()
        logger.info("Model loaded successfully!")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        model = None
    
    yield
    
    # Cleanup on shutdown
    if model is not None:
        del model
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        logger.info("Model unloaded")


app = FastAPI(
    title="Tubhyam AI Virtual Try-On",
    description="Photorealistic virtual try-on powered by IDM-VTON",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_idm_vton_model():
    """
    Load IDM-VTON model for virtual try-on
    Uses diffusers pipeline for image generation
    """
    try:
        from diffusers import StableDiffusionPipeline, AutoencoderKL
        
        # Model ID - using a virtual try-on specific model
        # Options:
        # 1. "yisol/idm-vton" - IDM-VTON official
        # 2. "levihsu/OOTDiffusion" - OOTDiffusion
        # 3. Custom fine-tuned model
        
        model_id = "yisol/idm-vton"
        model_path = MODEL_CACHE / "idm-vton"
        
        # Check if model is already downloaded
        if not model_path.exists():
            logger.info(f"Downloading model to {model_path}...")
            # Model will be downloaded on first use
        
        # Load pipeline
        pipe = StableDiffusionPipeline.from_pretrained(
            model_id if not model_path.exists() else str(model_path),
            torch_dtype=torch.float16 if device == "cuda" else torch.float32,
            safety_checker=None,
            requires_safety_checker=False
        )
        
        pipe = pipe.to(device)
        
        # Enable optimizations
        if device == "cuda":
            pipe.enable_attention_slicing()
            # pipe.enable_xformers_memory_efficient_attention()  # Optional
        
        return pipe
        
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        # Fallback to simpler approach
        return None


def preprocess_images(person_img: Image.Image, garment_img: Image.Image):
    """
    Preprocess person and garment images for the model
    """
    # Resize to model input size
    target_size = (768, 1024)  # Width, Height
    
    # Process person image
    person_resized = person_img.resize(target_size, Image.LANCZOS)
    
    # Process garment image - extract just the clothing
    garment_resized = garment_img.resize(target_size, Image.LANCZOS)
    
    return person_resized, garment_resized


def apply_color_tint(image: Image.Image, color_hex: str) -> Image.Image:
    """
    Apply color tint to garment image
    """
    if color_hex == "original":
        return image
    
    # Convert to numpy array
    img_array = np.array(image).copy()
    
    # Parse color
    r = int(color_hex[1:3], 16)
    g = int(color_hex[3:5], 16)
    b = int(color_hex[5:7], 16)
    
    # Apply tint while preserving luminosity
    for i in range(img_array.shape[0]):
        for j in range(img_array.shape[1]):
            pixel = img_array[i, j]
            if pixel[3] > 0:  # If not transparent
                # Calculate luminosity
                luminosity = (pixel[0] * 0.299 + pixel[1] * 0.587 + pixel[2] * 0.114) / 255.0
                
                # Blend with target color
                img_array[i, j, 0] = int(r * luminosity + pixel[0] * (1 - luminosity) * 0.3)
                img_array[i, j, 1] = int(g * luminosity + pixel[1] * (1 - luminosity) * 0.3)
                img_array[i, j, 2] = int(b * luminosity + pixel[2] * (1 - luminosity) * 0.3)
    
    return Image.fromarray(img_array)


def generate_tryon(person_img: Image.Image, garment_img: Image.Image, color: str = "original"):
    """
    Generate virtual try-on result
    """
    global model, device
    
    # Apply color tint if needed
    if color != "original":
        garment_img = apply_color_tint(garment_img, color)
    
    # Preprocess
    person_processed, garment_processed = preprocess_images(person_img, garment_img)
    
    # If model is loaded, use AI generation
    if model is not None:
        try:
            # Create prompt for the model
            prompt = "photorealistic, high quality, professional fashion photography, perfect fit"
            negative_prompt = "blurry, low quality, distorted, unrealistic, bad anatomy"
            
            # Generate image
            result = model(
                prompt=prompt,
                image=person_processed,
                control_image=garment_processed,
                negative_prompt=negative_prompt,
                num_inference_steps=30,
                guidance_scale=2.5,
                strength=0.8
            )
            
            return result.images[0]
            
        except Exception as e:
            logger.error(f"AI generation failed: {e}")
            # Fallback to overlay method
            return fallback_overlay(person_img, garment_img)
    
    else:
        # Fallback to overlay method if model not loaded
        logger.info("Using fallback overlay method")
        return fallback_overlay(person_img, garment_img)


def fallback_overlay(person_img: Image.Image, garment_img: Image.Image) -> Image.Image:
    """
    Fallback method: overlay garment on person using simple compositing
    This is used when AI model is not available
    """
    # Create a copy of person image
    result = person_img.copy().convert("RGBA")
    
    # Resize garment to fit lower body
    width, height = result.size
    garment_resized = garment_img.resize((width, height), Image.LANCZOS)
    
    # Crop garment to lower body (approximately)
    garment_array = np.array(garment_resized)
    
    # Create mask for lower body (simple rectangle for now)
    mask = np.zeros((height, width), dtype=np.uint8)
    mask[int(height * 0.4):, :] = 255  # Lower 60% of image
    
    # Apply mask to garment
    garment_array[:, :, 3] = mask
    
    # Composite
    garment_pil = Image.fromarray(garment_array)
    result = Image.alpha_composite(result, garment_pil)
    
    return result.convert("RGB")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "device": str(device) if device else "cpu"
    }


@app.post("/api/try-on", response_model=TryOnResponse)
async def virtual_try_on(
    person_image: UploadFile = File(..., description="User's photo"),
    garment_image: UploadFile = File(..., description="Product image"),
    color: str = Form("original", description="Color to apply")
):
    """
    Virtual Try-On endpoint
    
    Accepts:
    - person_image: User's full body photo
    - garment_image: Product (pants/trousers) image
    - color: Color to apply (original, black, navy, beige, grey, olive, brown, white)
    
    Returns:
    - base64 encoded result image
    """
    try:
        # Validate files
        if not person_image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="person_image must be an image")
        if not garment_image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="garment_image must be an image")
        
        # Read images
        person_data = await person_image.read()
        garment_data = await garment_image.read()
        
        # Open with PIL
        person_img = Image.open(io.BytesIO(person_data)).convert("RGBA")
        garment_img = Image.open(io.BytesIO(garment_data)).convert("RGBA")
        
        logger.info(f"Processing try-on: person={person_img.size}, garment={garment_img.size}, color={color}")
        
        # Generate try-on
        result_img = generate_tryon(person_img, garment_img, color)
        
        # Convert to base64
        buffer = io.BytesIO()
        result_img.save(buffer, format="PNG", quality=95)
        result_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
        
        logger.info("Try-on completed successfully")
        
        return TryOnResponse(
            success=True,
            image=f"data:image/png;base64,{result_base64}",
            message="Try-on generated successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Try-on failed: {e}")
        raise HTTPException(status_code=500, detail=f"Try-on failed: {str(e)}")


@app.post("/api/try-on/batch")
async def batch_try_on(
    person_image: UploadFile = File(...),
    garment_images: list[UploadFile] = File(...),
    color: str = Form("original")
):
    """
    Batch try-on with multiple garments
    """
    try:
        person_data = await person_image.read()
        person_img = Image.open(io.BytesIO(person_data)).convert("RGBA")
        
        results = []
        for garment in garment_images:
            garment_data = await garment.read()
            garment_img = Image.open(io.BytesIO(garment_data)).convert("RGBA")
            
            result_img = generate_tryon(person_img, garment_img, color)
            
            buffer = io.BytesIO()
            result_img.save(buffer, format="PNG", quality=95)
            result_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
            
            results.append({
                "garment": garment.filename,
                "image": f"data:image/png;base64,{result_base64}"
            })
        
        return {"success": True, "results": results}
        
    except Exception as e:
        logger.error(f"Batch try-on failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
