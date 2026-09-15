const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');
const multer = require('multer');

// Accept any multipart fields — the Python service defines the canonical names
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB per file
  }
});

// Python AI service URL (ai-tryon-service/server.py)
const AI_SERVICE_URL = process.env.AI_TRYON_URL || 'http://localhost:8000';

// AI generation is slow (30-90s on consumer GPUs; first call also loads the model)
const GEN_TIMEOUT_MS = 180000;   // single generation
const BATCH_TIMEOUT_MS = 300000; // batch generation

/**
 * Pick the first uploaded file matching any of the given field names.
 * multer.any() puts files in an array sorted by upload order.
 */
function pickFile(files, candidates) {
  if (!Array.isArray(files)) return null;
  for (const name of candidates) {
    const found = files.find(f => f.fieldname === name);
    if (found) return found;
  }
  return null;
}

/**
 * Forward an already-built FormData to the Python service and stream the
 * response back verbatim (PNG images are returned binary, errors as JSON).
 */
async function forward(res, path, formData, timeoutMs) {
  const response = await axios.post(`${AI_SERVICE_URL}${path}`, formData, {
    headers: formData.getHeaders(),
    timeout: timeoutMs,
    responseType: 'arraybuffer',
    maxContentLength: 100 * 1024 * 1024,
  });

  res.set('Content-Type', response.headers['content-type'] || 'application/octet-stream');
  if (response.headers['x-body-type']) res.set('X-Body-Type', response.headers['x-body-type']);
  if (response.headers['x-skin-tone']) res.set('X-Skin-Tone', response.headers['x-skin-tone']);
  if (response.headers['x-device']) res.set('X-Device', response.headers['x-device']);
  if (response.headers['x-garment-count']) res.set('X-Garment-Count', response.headers['x-garment-count']);
  return res.send(Buffer.from(response.data));
}

function tryOnError(res, error, label) {
  console.error(`${label} proxy error:`, error.message);

  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    return res.status(503).json({
      success: false,
      message: 'AI service is not running. Start it from ai-tryon-service/start.bat'
    });
  }
  if (error.code === 'ECONNABORTED') {
    return res.status(504).json({
      success: false,
      message: 'AI generation timed out. Try again.'
    });
  }
  res.status(500).json({
    success: false,
    message: `${label} failed`,
    error: error.message
  });
}

/**
 * POST /api/try-on
 * Person-photo try-on -> Python /api/try-on (returns PNG)
 */
router.post('/', upload.any(), async (req, res) => {
  try {
    const person = pickFile(req.files, ['person_image', 'personImage']);
    const garment = pickFile(req.files, ['garment_image', 'garmentImage']);

    if (!person || !garment) {
      return res.status(400).json({
        success: false,
        message: 'Both person_image and garment_image are required'
      });
    }

    const formData = new FormData();
    formData.append('person_image', person.buffer, {
      filename: 'person.png',
      contentType: person.mimetype
    });
    formData.append('garment_image', garment.buffer, {
      filename: 'garment.png',
      contentType: garment.mimetype
    });
    formData.append('body_type', req.body.body_type || 'average');
    formData.append('skin_tone', req.body.skin_tone || 'medium');

    await forward(res, '/api/try-on', formData, GEN_TIMEOUT_MS);
  } catch (error) {
    tryOnError(res, error, 'Try-on');
  }
});

/**
 * POST /api/try-on/ai-model
 * Generate an AI fashion model wearing the garment -> Python /api/try-on/ai-model (returns PNG)
 */
router.post('/ai-model', upload.any(), async (req, res) => {
  try {
    const garment = pickFile(req.files, ['garment_image', 'garmentImage']);

    if (!garment) {
      return res.status(400).json({
        success: false,
        message: 'garment_image is required'
      });
    }

    const formData = new FormData();
    formData.append('garment_image', garment.buffer, {
      filename: 'garment.png',
      contentType: garment.mimetype
    });
    formData.append('body_type', req.body.body_type || 'average');
    formData.append('skin_tone', req.body.skin_tone || 'medium');

    await forward(res, '/api/try-on/ai-model', formData, GEN_TIMEOUT_MS);
  } catch (error) {
    tryOnError(res, error, 'AI model try-on');
  }
});

/**
 * POST /api/try-on/batch
 * Multiple garments -> Python /api/try-on/batch (returns JSON with base64 images)
 */
router.post('/batch', upload.any(), async (req, res) => {
  try {
    const garments = Array.isArray(req.files)
      ? req.files.filter(f => ['garment_images', 'garmentImages', 'garment_image'].includes(f.fieldname))
      : [];

    if (garments.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one garment_images file is required'
      });
    }

    const formData = new FormData();
    garments.forEach((img, index) => {
      formData.append('garment_images', img.buffer, {
        filename: `garment_${index}.png`,
        contentType: img.mimetype
      });
    });
    formData.append('body_type', req.body.body_type || 'average');
    formData.append('skin_tone', req.body.skin_tone || 'medium');

    const response = await axios.post(`${AI_SERVICE_URL}/api/try-on/batch`, formData, {
      headers: formData.getHeaders(),
      timeout: BATCH_TIMEOUT_MS,
      maxContentLength: 100 * 1024 * 1024
    });

    res.json(response.data);
  } catch (error) {
    tryOnError(res, error, 'Batch try-on');
  }
});

/**
 * POST /api/try-on/multi-garment
 * Fitting Room layering — multiple garments -> single AI model photo (returns PNG)
 */
router.post('/multi-garment', upload.any(), async (req, res) => {
  try {
    const garments = Array.isArray(req.files)
      ? req.files.filter(f => ['garment_images', 'garmentImages', 'garment_image'].includes(f.fieldname))
      : [];

    if (garments.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one garment_images file is required'
      });
    }

    const formData = new FormData();
    garments.forEach((img, index) => {
      formData.append('garment_images', img.buffer, {
        filename: `garment_${index}.png`,
        contentType: img.mimetype
      });
    });
    formData.append('body_type', req.body.body_type || 'average');
    formData.append('skin_tone', req.body.skin_tone || 'medium');

    await forward(res, '/api/try-on/multi-garment', formData, GEN_TIMEOUT_MS);
  } catch (error) {
    tryOnError(res, error, 'Multi-garment try-on');
  }
});

/**
 * GET /api/try-on/health
 * Mirrors the Python service health endpoint
 */
router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/api/try-on/health`, {
      timeout: 5000
    });
    res.json(response.data);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      model_loaded: false,
      error: 'AI service not available'
    });
  }
});

module.exports = router;
