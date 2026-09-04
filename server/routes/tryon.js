const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Python AI service URL
const AI_SERVICE_URL = process.env.AI_TRYON_URL || 'http://localhost:8000';

/**
 * POST /api/try-on
 * Proxy request to Python AI service
 */
router.post('/', upload.fields([
  { name: 'personImage', maxCount: 1 },
  { name: 'garmentImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const { personImage, garmentImage } = req.files;
    const { color } = req.body;

    if (!personImage || !garmentImage) {
      return res.status(400).json({
        success: false,
        message: 'Both personImage and garmentImage are required'
      });
    }

    // Create form data
    const formData = new FormData();
    formData.append('person_image', personImage[0].buffer, {
      filename: 'person.png',
      contentType: personImage[0].mimetype
    });
    formData.append('garment_image', garmentImage[0].buffer, {
      filename: 'garment.png',
      contentType: garmentImage[0].mimetype
    });
    formData.append('color', color || 'original');

    // Forward to Python service
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/try-on`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 60000, // 60 seconds timeout
        maxContentLength: 50 * 1024 * 1024 // 50MB
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Try-on proxy error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'AI service is not running. Please start the Python service.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Try-on failed',
      error: error.message
    });
  }
});

/**
 * GET /api/try-on/health
 * Check AI service health
 */
router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/health`, {
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

/**
 * POST /api/try-on/batch
 * Batch try-on with multiple garments
 */
router.post('/batch', upload.fields([
  { name: 'personImage', maxCount: 1 },
  { name: 'garmentImages', maxCount: 10 }
]), async (req, res) => {
  try {
    const { personImage, garmentImages } = req.files;
    const { color } = req.body;

    if (!personImage || !garmentImages) {
      return res.status(400).json({
        success: false,
        message: 'personImage and garmentImages are required'
      });
    }

    const formData = new FormData();
    formData.append('person_image', personImage[0].buffer, {
      filename: 'person.png',
      contentType: personImage[0].mimetype
    });

    garmentImages.forEach((img, index) => {
      formData.append('garment_images', img.buffer, {
        filename: `garment_${index}.png`,
        contentType: img.mimetype
      });
    });

    formData.append('color', color || 'original');

    const response = await axios.post(
      `${AI_SERVICE_URL}/api/try-on/batch`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 120000, // 2 minutes for batch
        maxContentLength: 100 * 1024 * 1024
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Batch try-on error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Batch try-on failed',
      error: error.message
    });
  }
});

module.exports = router;
