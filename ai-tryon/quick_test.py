"""
Quick test to verify FastAPI service can start (without full model)
"""

import sys
import importlib

def check_dependencies():
    """Check if all required packages are installed"""
    packages = [
        'fastapi',
        'uvicorn',
        'PIL',
        'torch',
        'numpy'
    ]
    
    print("Checking dependencies...")
    all_ok = True
    
    for package in packages:
        try:
            importlib.import_module(package)
            print(f"  [OK] {package}")
        except ImportError:
            print(f"  [MISSING] {package}")
            all_ok = False
    
    return all_ok

def test_fastapi_import():
    """Test if FastAPI app can be imported"""
    print("\nTesting FastAPI import...")
    try:
        # Add parent directory to path
        sys.path.insert(0, '.')
        from main import app
        print("  [OK] FastAPI app imported successfully")
        return True
    except Exception as e:
        print(f"  [FAIL] Import failed: {e}")
        return False

def main():
    print("=" * 50)
    print("Tubhyam AI Try-On - Quick Test")
    print("=" * 50)
    
    # Check dependencies
    deps_ok = check_dependencies()
    
    if not deps_ok:
        print("\n[FAIL] Some dependencies are missing!")
        print("Please run: setup.bat")
        return
    
    # Test import
    import_ok = test_fastapi_import()
    
    if import_ok:
        print("\n[PASS] All tests passed!")
        print("\nNext steps:")
        print("1. Run: setup.bat (if not done already)")
        print("2. Run: start.bat")
        print("3. Open: http://localhost:8000/docs")
    else:
        print("\n[FAIL] Import test failed!")
        print("Please check the error messages above.")

if __name__ == "__main__":
    main()
