# Tubhyam AI Virtual Try-On Service

Photorealistic virtual try-on powered by AI (IDM-VTON).

## Features

- 🎨 **Photorealistic Results** - AI-generated try-on images
- 🎯 **Accurate Fit** - Body pose detection & garment warping
-  **Color Customization** - 8 color options
- ⚡ **Fast Processing** - 5-15 seconds per image
- 🔒 **Privacy First** - All processing done locally

## Quick Start

### 1. Setup (First Time Only)

```bash
# Run setup script
setup.bat

# Or manually:
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Start Service

```bash
# Run start script
start.bat

# Or manually:
venv\Scripts\activate
python main.py
```

Service will start at: **http://localhost:8000**

### 3. Test API

Open **http://localhost:8000/docs** for interactive API documentation.

## API Endpoints

### POST /api/try-on
Generate virtual try-on result.

**Parameters:**
- `person_image` (file): User's full body photo
- `garment_image` (file): Product image (pants/trousers)
- `color` (form, optional): Color to apply (default: "original")
  - Options: original, black, navy, beige, grey, olive, brown, white

**Response:**
```json
{
  "success": true,
  "image": "data:image/png;base64,...",
  "message": "Try-on generated successfully"
}
```

### GET /health
Check service health and model status.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "device": "cuda"
}
```

## Integration with Node.js Backend

The Node.js backend proxies requests to this Python service.

**Example (server/routes/tryon.js):**
```javascript
const axios = require('axios');
const FormData = require('form-data');

router.post('/api/try-on', async (req, res) => {
  const formData = new FormData();
  formData.append('person_image', req.files.personImage.data, {
    filename: 'person.png',
    contentType: 'image/png'
  });
  formData.append('garment_image', req.files.garmentImage.data, {
    filename: 'garment.png',
    contentType: 'image/png'
  });
  formData.append('color', req.body.color || 'original');

  const response = await axios.post(
    'http://localhost:8000/api/try-on',
    formData,
    { headers: formData.getHeaders() }
  );

  res.json(response.data);
});
```

## Requirements

- Python 3.10+
- 4GB+ disk space (for model)
- GPU recommended (CPU works but slower)
- 8GB+ RAM

## Model Information

Uses **IDM-VTON** (Improving Diffusion Models for Authentic Virtual Try-on):
- State-of-the-art virtual try-on
- Open source and free
- Photorealistic results
- Handles various body types and poses

First run will download the model (~2-4GB).

## Troubleshooting

### Model Download Fails
- Check internet connection
- Ensure 4GB+ free disk space
- Try again (download is resumable)

### Slow Processing
- GPU not available (using CPU)
- Reduce image resolution
- Close other applications

### Out of Memory
- Reduce batch size
- Use smaller images
- Enable memory optimizations in code

## Development

### Run Tests
```bash
python test_api.py
```

### View Logs
Logs are printed to console. For production, configure logging to file.

## License

Proprietary - Tubhyam

## Support

For issues or questions, contact the development team.
