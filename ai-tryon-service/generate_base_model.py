"""Generate a base AI model (without specific garment) for approval."""
import requests
from PIL import Image
import io

# Use a simple neutral garment image (we'll create a placeholder)
# The AI will generate a model, and we'll use this as the base template

# Create a simple white rectangle as placeholder garment
img = Image.new('RGB', (512, 512), color='white')
buf = io.BytesIO()
img.save(buf, format='JPEG')
garment_bytes = buf.getvalue()

print("Generating base AI model...")
print("This will create a professional Indian female fashion model.")
print("Body type: slim, Skin tone: medium")
print()

try:
    r = requests.post(
        'http://localhost:8000/api/try-on/ai-model',
        files={'garment_image': ('garment.jpg', garment_bytes, 'image/jpeg')},
        data={
            'body_type': 'slim',
            'skin_tone': 'medium',
        },
        timeout=300
    )
    
    if r.ok and r.headers.get('content-type', '').startswith('image/'):
        with open('base_model_slim_medium.jpg', 'wb') as f:
            f.write(r.content)
        print("[OK] Base model saved to: base_model_slim_medium.jpg")
        print()
        print("Check the image and approve if it looks good!")
    else:
        print(f"[ERROR] HTTP {r.status_code}")
        print(r.text[:500])
        
except Exception as e:
    print(f"[ERROR] {e}")
    print()
    print("Make sure the AI service is running on port 8000")
