/**
 * AI Try-On service using Puter.js (free, no API key).
 *
 * Combines mannequin plate + product image into a canvas,
 * sends to Google Gemini via Puter.js for image-to-image editing,
 * and caches results in localStorage.
 */

declare global {
  interface Window {
    puter: {
      ai: {
        txt2img: (
          prompt: string,
          options: {
            model: string;
            input_image: string; // base64 data URL
            input_image_mime_type: string;
          }
        ) => Promise<string>; // returns base64 data URL
      };
    };
  }
}

const PUTER_MODELS = ['google/gemini-2.5-flash-image', 'google/gemini-2.0-flash-exp', 'stabilityai/stable-diffusion-xl-1024-v1-0'];
const CACHE_PREFIX = 'tubhyam_tryon_';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CacheEntry {
  dataUrl: string;
  timestamp: number;
}

/** Get cached generated image if available and not expired. */
export const getCachedTryOn = (productId: string, modelId: string): string | null => {
  try {
    const key = `${CACHE_PREFIX}${productId}_${modelId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return entry.dataUrl;
  } catch {
    return null;
  }
};

/** Cache a generated image. */
const setCachedTryOn = (productId: string, modelId: string, dataUrl: string): void => {
  try {
    const key = `${CACHE_PREFIX}${productId}_${modelId}`;
    const entry: CacheEntry = { dataUrl, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
};

/**
 * Load an image from URL and return as HTMLImageElement.
 */
const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

/**
 * Combine mannequin plate and product image into a side-by-side canvas.
 * Layout: plate on left (70%), product on right (30%).
 */
const createCombinedCanvas = async (
  plateUrl: string,
  productUrl: string
): Promise<string> => {
  const [plateImg, productImg] = await Promise.all([
    loadImage(plateUrl),
    loadImage(productUrl),
  ]);

  const canvas = document.createElement('canvas');
  const width = 1024;
  const height = 1024;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  // White background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Draw plate on left (70% width, full height, contain)
  const plateAspect = plateImg.width / plateImg.height;
  const plateTargetH = height;
  const plateTargetW = plateTargetH * plateAspect;
  const plateMaxW = width * 0.7;
  const plateFinalW = Math.min(plateTargetW, plateMaxW);
  const plateFinalH = plateFinalW / plateAspect;
  const plateX = (width * 0.7 - plateFinalW) / 2;
  const plateY = (height - plateFinalH) / 2;
  ctx.drawImage(plateImg, plateX, plateY, plateFinalW, plateFinalH);

  // Draw product on right (30% width, full height, contain)
  const prodAspect = productImg.width / productImg.height;
  const prodTargetH = height;
  const prodTargetW = prodTargetH * prodAspect;
  const prodMaxW = width * 0.3;
  const prodFinalW = Math.min(prodTargetW, prodMaxW);
  const prodFinalH = prodFinalW / prodAspect;
  const prodX = width * 0.7 + (width * 0.3 - prodFinalW) / 2;
  const prodY = (height - prodFinalH) / 2;
  ctx.drawImage(productImg, prodX, prodY, prodFinalW, prodFinalH);

  return canvas.toDataURL('image/jpeg', 0.9);
};

/**
 * Generate AI try-on image using Puter.js.
 *
 * @param plateUrl - Mannequin plate image URL
 * @param productUrl - Product image URL
 * @param productName - Product name for the prompt
 * @param garmentType - Type of garment (formal/jeans/track)
 * @param onProgress - Optional progress callback
 * @returns Generated image as data URL
 */
export const generateTryOn = async (
  plateUrl: string,
  productUrl: string,
  productName: string,
  garmentType: 'formal' | 'jeans' | 'track',
  onProgress?: (msg: string) => void
): Promise<string> => {
  onProgress?.('Combining images...');

  const combinedImage = await createCombinedCanvas(plateUrl, productUrl);

  onProgress?.('Generating AI try-on...');

  const prompt = `Transform this image: The person on the left (wearing a black bodysuit) should now be wearing the ${garmentType} pants/garment shown on the right. Make it look natural and realistic — proper fit, correct length, natural fabric drape. Keep the person's pose, body shape, and skin tone exactly the same. Only change the lower body garment. High-quality fashion photography, professional lighting, clean background. The garment should be "${productName}".`;

  if (!window.puter?.ai?.txt2img) {
    throw new Error('Puter.js not available — please refresh the page');
  }

  let result: string;
  let lastError: Error | null = null;
  
  // Try multiple models in case one is unavailable
  for (const model of PUTER_MODELS) {
    try {
      onProgress?.(`Trying ${model.split('/')[1]}...`);
      result = await window.puter.ai.txt2img(prompt, {
        model,
        input_image: combinedImage,
        input_image_mime_type: 'image/jpeg',
      });
      onProgress?.('Processing result...');
      
      // Validate result
      if (!result || typeof result !== 'string') {
        throw new Error('Invalid response from AI');
      }
      
      // If result is a URL (not base64), fetch it
      if (result.startsWith('http')) {
        onProgress?.('Downloading generated image...');
        const response = await fetch(result);
        const blob = await response.blob();
        result = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
      
      // Success — break out of loop
      lastError = null;
      break;
    } catch (err: unknown) {
      console.error(`Model ${model} failed:`, err);
      lastError = new Error(String((err as Record<string, unknown>)?.message || 'Generation failed'));
      // Continue to next model
    }
  }
  
  // If all models failed, throw the last error
  if (lastError) {
    throw lastError;
  }

  onProgress?.('Done!');

  return result;
};

/**
 * Main entry: get try-on image (cached or generate fresh).
 */
export const getTryOnImage = async (
  productId: string,
  modelId: string,
  plateUrl: string,
  productUrl: string,
  productName: string,
  garmentType: 'formal' | 'jeans' | 'track',
  onProgress?: (msg: string) => void
): Promise<string> => {
  // Check cache first
  const cached = getCachedTryOn(productId, modelId);
  if (cached) {
    onProgress?.('Loaded from cache');
    return cached;
  }

  // Generate fresh
  const result = await generateTryOn(plateUrl, productUrl, productName, garmentType, onProgress);

  // Cache the result
  setCachedTryOn(productId, modelId, result);

  return result;
};
