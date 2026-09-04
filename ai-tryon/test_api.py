"""
Test script for AI Try-On API
Run this after starting the service to verify everything works
"""

import requests
import base64
from PIL import Image
import io

# API endpoint
BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("Testing /health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_tryon():
    """Test try-on endpoint with sample images"""
    print("\nTesting /api/try-on endpoint...")
    
    # Create sample images for testing
    # Person image (placeholder - in real use, this would be user's photo)
    person_img = Image.new('RGBA', (768, 1024), color=(200, 180, 160, 255))
    person_buffer = io.BytesIO()
    person_img.save(person_buffer, format='PNG')
    person_buffer.seek(0)
    
    # Garment image (placeholder - in real use, this would be product image)
    garment_img = Image.new('RGBA', (768, 1024), color=(100, 100, 150, 255))
    garment_buffer = io.BytesIO()
    garment_img.save(garment_buffer, format='PNG')
    garment_buffer.seek(0)
    
    # Prepare files
    files = {
        'person_image': ('person.png', person_buffer, 'image/png'),
        'garment_image': ('garment.png', garment_buffer, 'image/png')
    }
    data = {
        'color': 'original'
    }
    
    print("Sending request...")
    response = requests.post(f"{BASE_URL}/api/try-on", files=files, data=data)
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Success: {result['success']}")
        print(f"Message: {result['message']}")
        
        # Save result image
        if result.get('image'):
            # Extract base64 data
            base64_data = result['image'].split(',')[1] if ',' in result['image'] else result['image']
            image_data = base64.b64decode(base64_data)
            
            # Save to file
            with open('test_result.png', 'wb') as f:
                f.write(image_data)
            print("Result saved to: test_result.png")
        
        return True
    else:
        print(f"Error: {response.text}")
        return False

def test_color_change():
    """Test color change functionality"""
    print("\nTesting color change...")
    
    colors = ['original', 'black', 'navy', 'beige', 'grey']
    
    for color in colors:
        print(f"Testing color: {color}")
        
        # Create sample images
        person_img = Image.new('RGBA', (768, 1024), color=(200, 180, 160, 255))
        person_buffer = io.BytesIO()
        person_img.save(person_buffer, format='PNG')
        person_buffer.seek(0)
        
        garment_img = Image.new('RGBA', (768, 1024), color=(100, 100, 150, 255))
        garment_buffer = io.BytesIO()
        garment_img.save(garment_buffer, format='PNG')
        garment_buffer.seek(0)
        
        files = {
            'person_image': ('person.png', person_buffer, 'image/png'),
            'garment_image': ('garment.png', garment_buffer, 'image/png')
        }
        data = {'color': color}
        
        response = requests.post(f"{BASE_URL}/api/try-on", files=files, data=data)
        
        if response.status_code == 200:
            print(f"  ✓ {color} - Success")
        else:
            print(f"  ✗ {color} - Failed: {response.status_code}")

def main():
    print("=" * 50)
    print("Tubhyam AI Try-On API Test")
    print("=" * 50)
    
    # Check if service is running
    try:
        requests.get(f"{BASE_URL}/health", timeout=2)
    except requests.exceptions.ConnectionError:
        print("ERROR: Service not running!")
        print("Please start the service first: python main.py")
        return
    
    # Run tests
    health_ok = test_health()
    
    if health_ok:
        tryon_ok = test_tryon()
        if tryon_ok:
            test_color_change()
    
    print("\n" + "=" * 50)
    print("Tests completed!")
    print("=" * 50)

if __name__ == "__main__":
    main()
