import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  X, Upload, Camera, Sparkles, Download, RotateCcw, Loader2,
  Star, Heart, Search, ChevronRight, Check, User, Users,
  ArrowRight, Image as ImageIcon, Shield, Zap, Eye,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { products as allProducts } from '@/data/products';

/* ------------------------------------------------------------------ */
/*  MediaPipe type stubs                                               */
/* ------------------------------------------------------------------ */
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Pose: any;
  }
}

interface Landmark {
  x: number; y: number; z: number; visibility: number;
}

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
interface AIVirtualTryOnProps {
  open?: boolean;
  onClose?: () => void;
  standalone?: boolean;
  productImage?: string;
  productName?: string;
  productCategory?: string;
}

/* ------------------------------------------------------------------ */
/*  Store products — from full catalog                                 */
/* ------------------------------------------------------------------ */
const STORE_PRODUCTS = allProducts
  .filter(p => p.id !== 'test-001') // exclude test product
  .map(p => ({
    id: p.id,
    name: p.name,
    price: `₹${p.price.toLocaleString('en-IN')}`,
    img: p.image,
    rating: p.rating || 4.5,
    category: p.category,
    badge: p.isBestSeller ? 'Bestseller' : p.isNew ? 'New' : '',
  }));

const UPLOAD_TIPS = [
  { icon: '', text: 'Full body photo' },
  { icon: '💡', text: 'Good lighting' },
  { icon: '', text: 'Stand straight' },
  { icon: '👖', text: 'Fitted clothes' },
];

const AI_AVATARS = [
  { id: 'fair', label: 'Fair', skin: '#F5D0B0', img: '/images/avatar-fair.png' },
  { id: 'medium', label: 'Medium', skin: '#C68E5B', img: '/images/avatar-medium.png' },
  { id: 'dark', label: 'Deep', skin: '#8B5E3C', img: '/images/avatar-dark.png' },
];

// Available colors for try-on (with hex values for tinting)
const TRYON_COLORS = [
  { id: 'original', label: 'Original', hex: null },
  { id: 'black', label: 'Black', hex: '#1a1a1a' },
  { id: 'navy', label: 'Navy', hex: '#1e3a5f' },
  { id: 'beige', label: 'Beige', hex: '#c9a882' },
  { id: 'grey', label: 'Grey', hex: '#6b6b6b' },
  { id: 'olive', label: 'Olive', hex: '#556b2f' },
  { id: 'brown', label: 'Brown', hex: '#5c4033' },
  { id: 'white', label: 'White', hex: '#f5f5f5' },
];

/* ------------------------------------------------------------------ */
/*  Color tinting function                                             */
/* ------------------------------------------------------------------ */
const applyColorTint = (sourceCanvas: HTMLCanvasElement, colorHex: string): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = sourceCanvas.width;
  canvas.height = sourceCanvas.height;
  const ctx = canvas.getContext('2d')!;

  // Draw original
  ctx.drawImage(sourceCanvas, 0, 0);

  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Parse target color
  const r = parseInt(colorHex.slice(1, 3), 16);
  const g = parseInt(colorHex.slice(3, 5), 16);
  const b = parseInt(colorHex.slice(5, 7), 16);

  // Apply color tint while preserving luminosity
  for (let i = 0; i < data.length; i += 4) {
    const pixelR = data[i];
    const pixelG = data[i + 1];
    const pixelB = data[i + 2];
    const alpha = data[i + 3];

    if (alpha > 0) {
      // Calculate luminosity
      const luminosity = (pixelR * 0.299 + pixelG * 0.587 + pixelB * 0.114) / 255;

      // Blend with target color based on luminosity
      data[i] = Math.round(r * luminosity + pixelR * (1 - luminosity) * 0.3);
      data[i + 1] = Math.round(g * luminosity + pixelG * (1 - luminosity) * 0.3);
      data[i + 2] = Math.round(b * luminosity + pixelB * (1 - luminosity) * 0.3);
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const AIVirtualTryOn = ({
  open = true,
  onClose,
  standalone = false,
  productImage,
  productName,
  productCategory,
}: AIVirtualTryOnProps) => {
  const { isLight } = useTheme();

  const [selectedProduct, setSelectedProduct] = useState(STORE_PRODUCTS[0]);
  const [selectedColor, setSelectedColor] = useState<string>('original');
    const [selectedBodyType, setSelectedBodyType] = useState<'slim' | 'average' | 'plus-size'>('slim');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [poseReady, setPoseReady] = useState(false);
  const [poseLoading, setPoseLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'formal' | 'jeans' | 'track'>('all');
  const [dragOver, setDragOver] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [uploadMode, setUploadMode] = useState<'photo' | 'avatar'>('photo');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  // Get full product data with tryOnBodyVariants
  const fullProduct = allProducts.find(p => p.id === selectedProduct.id);

  // Update result image when product or body type changes
  useEffect(() => {
    if (fullProduct?.tryOnBodyVariants) {
      const variant = fullProduct.tryOnBodyVariants.find(v => v.bodyType === selectedBodyType);
      if (variant && variant.images.length > 0) {
        // Show pre-generated AI model photo
        setResultImage(variant.images[0]);
      }
    }
  }, [selectedProduct.id, selectedBodyType, fullProduct]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const poseRef = useRef<any>(null);

  /* ---- Theme tokens ---- */
  const T = {
    bg:          isLight ? '#FAF5EF' : '#0F0D0B',
    surface:     isLight ? '#FFFFFF' : '#1C1714',
    surfaceAlt:  isLight ? '#F5EDE4' : '#241E18',
    surfaceHover:isLight ? '#EDE4D8' : '#2E2620',
    border:      isLight ? '#E0D5C8' : 'rgba(255,211,172,0.08)',
    borderActive:isLight ? '#C9A882' : 'rgba(255,211,172,0.25)',
    text:        isLight ? '#1A1410' : '#FFF5EB',
    textSec:     isLight ? '#6B5E52' : 'rgba(255,211,172,0.7)',
    textMuted:   isLight ? '#9B8E82' : 'rgba(255,211,172,0.35)',
    accent:      '#8B5E3C',
    accentLight: '#FFD3AC',
    gradient:    'linear-gradient(135deg, #8B5E3C 0%, #A0714D 40%, #C9A882 100%)',
    gradientWarm:'linear-gradient(135deg, #A0714D 0%, #D4A574 100%)',
    glass:       isLight ? 'rgba(255,255,255,0.7)' : 'rgba(28,23,20,0.8)',
  };

  /* ---- MediaPipe loader ---- */
  const loadMediaPipe = useCallback(async () => {
    if (poseRef.current) return true;
    if (poseLoading) return false;
    setPoseLoading(true);
    try {
      const scripts = [
        'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
        'https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js',
        'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
        'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js',
      ];
      for (const src of scripts) {
        if (!document.querySelector(`script[src="${src}"]`)) {
          await new Promise<void>((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src; s.async = true;
            s.onload = () => resolve();
            s.onerror = () => reject(new Error(`Failed: ${src}`));
            document.head.appendChild(s);
          });
        }
      }
      let attempts = 0;
      while (!window.Pose && attempts < 50) { await new Promise(r => setTimeout(r, 200)); attempts++; }
      if (!window.Pose) throw new Error('MediaPipe failed');

      const pose = new window.Pose({
        locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${f}`
      });
      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      poseRef.current = pose;
      setPoseReady(true);
      setPoseLoading(false);
      return true;
    } catch { setError('AI model failed to load. Please refresh.'); setPoseLoading(false); return false; }
  }, [poseLoading]);

  /* ---- Detect pose using MediaPipe with proper callback handling ---- */
  const detectPose = (imageSource: HTMLImageElement | HTMLCanvasElement): Promise<{ poseLandmarks?: Landmark[] } | null> => {
    return new Promise((resolve) => {
      if (!poseRef.current) { resolve(null); return; }
      const pose = poseRef.current;
      let settled = false;

      pose.onResults((results: { poseLandmarks?: Landmark[] }) => {
        if (!settled) { settled = true; resolve(results); }
      });

      // Send image — send() returns a promise but onResults fires after
      pose.send({ image: imageSource }).catch(() => {
        if (!settled) { settled = true; resolve(null); }
      });

      // Timeout after 15 seconds
      setTimeout(() => {
        if (!settled) { settled = true; resolve(null); }
      }, 15000);
    });
  };

  /* ---- Process photo ---- */
  const processPhoto = useCallback(async (imgSrc: string, isAvatar = false) => {
    setDetecting(true); setError(null); setResultImage(null);

    const img = new Image(); img.crossOrigin = 'anonymous'; img.src = imgSrc;
    await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(new Error('fail')); });

    const canvas = canvasRef.current; if (!canvas) return;
    const maxDim = 600;
    const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    let tT: number, tB: number, tL: number, tR: number;
    let poseResults: { poseLandmarks?: Landmark[] } | null = null;

    if (isAvatar) {
      // For AI avatars: use pre-calculated body proportions
      tT = 0.38; tB = 0.97; tL = 0.30; tR = 0.70;
    } else {
      // For real photos: use MediaPipe pose detection
      const ready = await loadMediaPipe();
      if (!ready || !poseRef.current) { setDetecting(false); return; }

      // Warm-up call: send canvas once to initialize the model
      await detectPose(canvas);
      await new Promise(r => setTimeout(r, 500));

      // Now detect on the actual image — try up to 2 times
      poseResults = await detectPose(img);

      // Retry once if no landmarks detected
      if (!poseResults?.poseLandmarks?.length) {
        await new Promise(r => setTimeout(r, 300));
        poseResults = await detectPose(img);
      }

      if (!poseResults?.poseLandmarks?.length) {
        setError('No body detected. Please use a clear full-body photo with good lighting.');
        setDetecting(false); return;
      }

      const lm: Landmark[] = poseResults.poseLandmarks;
      const lHip = lm[23], rHip = lm[24], lAnkle = lm[27], rAnkle = lm[28];
      if (!lHip || !rHip || !lAnkle || !rAnkle) {
        setError('Could not detect lower body. Please stand straight in the photo.');
        setDetecting(false); return;
      }

      const hipY = Math.min(lHip.y, rHip.y);
      const ankleY = Math.max(lAnkle.y, rAnkle.y);
      const hipXL = Math.min(lHip.x, rHip.x);
      const hipXR = Math.max(lHip.x, rHip.x);
      tT = hipY - 0.02;
      tB = ankleY + 0.03;
      tL = hipXL - 0.04;
      tR = hipXR + 0.04;
    }

    // Load product image
    const gImg = new Image(); gImg.crossOrigin = 'anonymous'; gImg.src = selectedProduct.img;
    await new Promise<void>((res, rej) => { gImg.onload = () => res(); gImg.onerror = () => rej(new Error('fail')); });

    // === APPLY COLOR TINT IF SELECTED ===
    let productImgToUse = gImg;
    if (selectedColor !== 'original') {
      const colorOption = TRYON_COLORS.find(c => c.id === selectedColor);
      if (colorOption?.hex) {
        // Create temp canvas for product image
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = gImg.width;
        tempCanvas.height = gImg.height;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.drawImage(gImg, 0, 0);

        // Apply color tint
        const tintedCanvas = applyColorTint(tempCanvas, colorOption.hex);

        // Create new image from tinted canvas
        const tintedImg = new Image();
        tintedImg.src = tintedCanvas.toDataURL();
        await new Promise<void>((res, rej) => { tintedImg.onload = () => res(); tintedImg.onerror = () => rej(new Error('fail')); });
        productImgToUse = tintedImg;
      }
    }

    // === REALISTIC PANTS OVERLAY ===
    // Instead of rectangle paste, create body-shaped mask with smooth edges

    const W = canvas.width;
    const H = canvas.height;

    // Create offscreen canvas for the pants layer
    const pantsCanvas = document.createElement('canvas');
    pantsCanvas.width = W;
    pantsCanvas.height = H;
    const pCtx = pantsCanvas.getContext('2d')!;

    // Extract pants region from product image (bottom 70%, skip top torso)
    const pCropY = Math.round(productImgToUse.height * 0.28);
    const pCropH = productImgToUse.height - pCropY;
    const pCropX = Math.round(productImgToUse.width * 0.08);
    const pCropW = productImgToUse.width - pCropX * 2;

    // Draw product pants onto the pants canvas, scaled to body region
    const gx = tL * W;
    const gy = tT * H;
    const gw = (tR - tL) * W;
    const gh = (tB - tT) * H;
    pCtx.drawImage(productImgToUse, pCropX, pCropY, pCropW, pCropH, gx, gy, gw, gh);

    // Create body-shaped mask using MediaPipe landmarks
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = W;
    maskCanvas.height = H;
    const mCtx = maskCanvas.getContext('2d')!;

    if (!isAvatar && poseResults && poseResults.poseLandmarks) {
      // Use actual body landmarks for precise mask
      const lm = poseResults.poseLandmarks;
      const lShoulder = lm[11], rShoulder = lm[12];
      const lHip = lm[23], rHip = lm[24];
      const lKnee = lm[25], rKnee = lm[26];
      const lAnkle = lm[27], rAnkle = lm[28];

      const toX = (p: Landmark) => p.x * W;
      const toY = (p: Landmark) => p.y * H;

      // Create smooth body outline path
      mCtx.beginPath();

      // Top edge: curve from left hip to right hip (waistline)
      const waistY = Math.min(toY(lHip), toY(rHip)) - H * 0.02;
      const waistLX = toX(lHip) - W * 0.02;
      const waistRX = toX(rHip) + W * 0.02;
      mCtx.moveTo(waistLX, waistY);
      mCtx.quadraticCurveTo((waistLX + waistRX) / 2, waistY - H * 0.01, waistRX, waistY);

      // Right side: hip → knee → ankle (outer right leg)
      const rKneeX = toX(rKnee) + W * 0.03;
      const rKneeY = toY(rKnee);
      const rAnkleX = toX(rAnkle) + W * 0.025;
      const rAnkleY = toY(rAnkle) + H * 0.02;
      mCtx.quadraticCurveTo(rKneeX + W * 0.02, (waistY + rKneeY) / 2, rKneeX, rKneeY);
      mCtx.quadraticCurveTo(rAnkleX + W * 0.01, (rKneeY + rAnkleY) / 2, rAnkleX, rAnkleY);

      // Bottom: curve across ankles
      const lAnkleX = toX(lAnkle) - W * 0.025;
      const lAnkleY = toY(lAnkle) + H * 0.02;
      mCtx.quadraticCurveTo((rAnkleX + lAnkleX) / 2, rAnkleY + H * 0.01, lAnkleX, lAnkleY);

      // Left side: ankle → knee → hip (outer left leg)
      const lKneeX = toX(lKnee) - W * 0.03;
      const lKneeY = toY(lKnee);
      mCtx.quadraticCurveTo(lKneeX - W * 0.01, (lAnkleY + lKneeY) / 2, lKneeX, lKneeY);
      mCtx.quadraticCurveTo(waistLX - W * 0.02, (lKneeY + waistY) / 2, waistLX, waistY);

      mCtx.closePath();

      // Apply feathered mask with blur for smooth edges
      mCtx.filter = 'blur(8px)';
      mCtx.fillStyle = 'white';
      mCtx.fill();
      mCtx.filter = 'none';
    } else {
      // For avatars: use simple rounded rectangle mask
      const margin = W * 0.03;
      const rx = tL * W - margin;
      const ry = tT * H - margin * 0.5;
      const rw = (tR - tL) * W + margin * 2;
      const rh = (tB - tT) * H + margin;
      const radius = rw * 0.15;
      mCtx.beginPath();
      mCtx.roundRect(rx, ry, rw, rh, radius);
      mCtx.filter = 'blur(6px)';
      mCtx.fillStyle = 'white';
      mCtx.fill();
      mCtx.filter = 'none';
    }

    // Apply mask to pants layer
    pCtx.globalCompositeOperation = 'destination-in';
    pCtx.drawImage(maskCanvas, 0, 0);
    pCtx.globalCompositeOperation = 'source-over';

    // Add subtle shadow under pants for depth
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = W;
    shadowCanvas.height = H;
    const sCtx = shadowCanvas.getContext('2d')!;
    sCtx.drawImage(pantsCanvas, 3, 5);
    sCtx.globalCompositeOperation = 'destination-in';
    sCtx.filter = 'blur(12px)';
    sCtx.fillStyle = 'rgba(0,0,0,0.3)';
    sCtx.fillRect(0, 0, W, H);
    sCtx.filter = 'none';

    // Composite: shadow first, then pants on top
    ctx.drawImage(shadowCanvas, 0, 0);
    ctx.drawImage(pantsCanvas, 0, 0);

    setResultImage(canvas.toDataURL('image/png', 0.92));
    setDetecting(false);
  }, [selectedProduct, loadMediaPipe]);

  /* ---- Upload handlers ---- */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { const src = ev.target?.result as string; setUserPhoto(src); processPhoto(src); };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => { const src = ev.target?.result as string; setUserPhoto(src); processPhoto(src); };
    reader.readAsDataURL(file);
  }, [processPhoto]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 720 } } });
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
    } catch { setError('Camera access denied.'); }
  };

  const capturePhoto = () => {
    const video = videoRef.current; if (!video) return;
    const c = document.createElement('canvas'); c.width = video.videoWidth; c.height = video.videoHeight;
    c.getContext('2d')?.drawImage(video, 0, 0);
    const src = c.toDataURL('image/png');
    const stream = video.srcObject as MediaStream; stream?.getTracks().forEach(t => t.stop());
    video.srcObject = null; setUserPhoto(src); processPhoto(src);
  };

  const handleTryOn = (product: typeof STORE_PRODUCTS[0]) => {
    setSelectedProduct(product);
    setSelectedColor('original'); // Reset to original color
    if (userPhoto) processPhoto(userPhoto);
  };

  const selectAvatar = (avatar: typeof AI_AVATARS[0]) => {
    setSelectedAvatar(avatar.id);
    setUserPhoto(avatar.img);
    // Process avatar directly (no MediaPipe needed)
    setTimeout(() => processPhoto(avatar.img, true), 500);
  };

  const handleReset = () => {
    setUserPhoto(null); setResultImage(null); setError(null); setDetecting(false); setShowComparison(false);
    setSelectedAvatar(null);
    setSelectedColor('original');
    const v = videoRef.current;
    if (v?.srcObject) { const s = v.srcObject as MediaStream; s.getTracks().forEach(t => t.stop()); v.srcObject = null; }
  };

  const downloadResult = () => {
    if (!resultImage) return;
    const a = document.createElement('a'); a.href = resultImage;
    a.download = `tubhyam-tryon-${selectedProduct.name.replace(/\s+/g, '-').toLowerCase()}.png`; a.click();
  };

  useEffect(() => { if (!open && !standalone) handleReset(); }, [open, standalone]);
  useEffect(() => {
    const v = videoRef.current;
    return () => { if (v?.srcObject) { const s = v.srcObject as MediaStream; s.getTracks().forEach(t => t.stop()); } };
  }, []);
  useEffect(() => { if (open && !poseReady && !poseLoading) loadMediaPipe(); }, [open, poseReady, poseLoading, loadMediaPipe]);

  useEffect(() => {
    if (productImage && productName) {
      const match = STORE_PRODUCTS.find(p => p.name.toLowerCase().includes(productName.toLowerCase().split(' ')[0]));
      if (match) setSelectedProduct(match);
    }
  }, [productImage, productName]);

  const filteredProducts = activeTab === 'all' ? STORE_PRODUCTS : STORE_PRODUCTS.filter(p => p.category === activeTab);

  /* ================================================================== */
  /*  RENDER — Standalone Page                                           */
  /* ================================================================== */
  if (standalone) {
    return (
      <div className="min-h-screen" style={{ background: T.bg }}>

        {/* ─── HERO ─── */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(ellipse at 30% 0%, ${isLight ? '#C9A882' : '#8B5E3C'}22, transparent 60%)` }} />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-8 sm:pt-10 sm:pb-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5" style={{ borderColor: T.borderActive, background: T.surface }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#4CAF50' }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: T.textSec }}>AI Virtual Fitting Room</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold mb-3 leading-tight" style={{ color: T.text }}>
              Try Before You{' '}
              <span className="bg-gradient-to-r from-[#8B5E3C] via-[#A0714D] to-[#C9A882] bg-clip-text text-transparent">Buy</span>
            </h1>
            <p className="text-sm sm:text-base max-w-lg mx-auto leading-relaxed" style={{ color: T.textSec }}>
              Upload your photo and see exactly how Tubhyam pants look on your body — powered by AI body detection.
            </p>
            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 flex-wrap">
              {[
                { icon: <Shield size={12} />, text: 'Private & Secure' },
                { icon: <Zap size={12} />, text: 'Instant Results' },
                { icon: <Eye size={12} />, text: 'AI Body Detection' },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: T.textMuted }}>
                  <span style={{ color: T.accentLight }}>{b.icon}</span> {b.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── MAIN CONTENT ─── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ═══ LEFT: FITTING ROOM ═══ */}
            <div className="w-full lg:w-[400px] shrink-0">
              <div className="rounded-2xl border overflow-hidden sticky top-20" style={{ background: T.surface, borderColor: T.border }}>

                {/* Fitting Room Header */}
                <div className="px-5 py-3.5 border-b flex items-center justify-between" style={{ borderColor: T.border }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${T.accent}18` }}>
                      <User size={13} style={{ color: T.accentLight }} />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: T.text }}>Fitting Room</span>
                  </div>
                  {userPhoto && (
                    <button onClick={handleReset} className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors hover:opacity-80" style={{ color: '#EF4444', background: 'rgba(239,68,68,0.08)' }}>
                      <RotateCcw size={10} /> Start Over
                    </button>
                  )}
                </div>

                <div className="p-5">
                  {!userPhoto ? (
                    /* ─── UPLOAD STATE ─── */
                    <div className="space-y-4">

                      {/* Mode Tabs: Your Photo / AI Avatar */}
                      <div className="flex rounded-xl p-1" style={{ background: T.surfaceAlt }}>
                        <button
                          onClick={() => setUploadMode('photo')}
                          className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                          style={{
                            background: uploadMode === 'photo' ? T.surface : 'transparent',
                            color: uploadMode === 'photo' ? T.text : T.textMuted,
                            boxShadow: uploadMode === 'photo' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                          }}
                        >
                          <Camera size={12} className="inline mr-1.5" />Your Photo
                        </button>
                        <button
                          onClick={() => setUploadMode('avatar')}
                          className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                          style={{
                            background: uploadMode === 'avatar' ? T.surface : 'transparent',
                            color: uploadMode === 'avatar' ? T.text : T.textMuted,
                            boxShadow: uploadMode === 'avatar' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                          }}
                        >
                          <Sparkles size={12} className="inline mr-1.5" />AI Avatar
                        </button>
                      </div>

                      {uploadMode === 'photo' ? (
                        /* ─── PHOTO UPLOAD ─── */
                        <>
                          {/* Drag & Drop Zone */}
                          <div
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className="relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 group"
                            style={{
                              borderColor: dragOver ? T.accent : T.border,
                              background: dragOver ? `${T.accent}08` : T.surfaceAlt,
                            }}
                          >
                            <div className="p-6 text-center">
                              <p className="text-sm font-semibold mb-1" style={{ color: T.text }}>Drop your photo here</p>
                              <p className="text-[11px] mb-3" style={{ color: T.textMuted }}>or click to browse</p>
                              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all group-hover:scale-105" style={{ background: T.gradient }}>
                                <Upload size={14} /> Choose Photo
                              </div>
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                          </div>

                          {/* Tips */}
                          <div className="grid grid-cols-2 gap-2">
                            {UPLOAD_TIPS.map((tip, i) => (
                              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: T.surfaceAlt }}>
                                <span className="text-sm">{tip.icon}</span>
                                <span className="text-[11px] font-medium" style={{ color: T.textSec }}>{tip.text}</span>
                              </div>
                            ))}
                          </div>

                          {/* Camera button */}
                          <button
                            onClick={startCamera}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-all hover:scale-[1.01]"
                            style={{ borderColor: T.border, color: T.text, background: T.surfaceAlt }}
                          >
                            <Camera size={15} /> Use Camera Instead
                          </button>
                        </>
                      ) : (
                        /* ─── AI AVATAR SELECTION ─── */
                        <>
                          <p className="text-[11px] text-center mb-3" style={{ color: T.textSec }}>
                            Select a model to try on products
                          </p>
                          <div className="grid grid-cols-3 gap-3">
                            {AI_AVATARS.map(avatar => (
                              <button
                                key={avatar.id}
                                onClick={() => selectAvatar(avatar)}
                                className="relative rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 group"
                                style={{
                                  borderColor: selectedAvatar === avatar.id ? T.accent : T.border,
                                  boxShadow: selectedAvatar === avatar.id ? `0 0 0 1px ${T.accent}, 0 4px 12px rgba(139,94,60,0.2)` : 'none',
                                }}
                              >
                                <div className="aspect-[3/4] overflow-hidden">
                                  <img src={avatar.img} alt={`${avatar.label} skin tone`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                </div>
                                {/* Skin tone indicator */}
                                <div className="absolute bottom-0 left-0 right-0 p-2" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                                  <div className="flex items-center justify-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full border border-white/40" style={{ background: avatar.skin }} />
                                    <span className="text-[10px] font-bold text-white">{avatar.label}</span>
                                  </div>
                                </div>
                                {selectedAvatar === avatar.id && (
                                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: T.gradient }}>
                                    <Check size={10} className="text-white" />
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                          <p className="text-[10px] text-center mt-2" style={{ color: T.textMuted }}>
                            AI will fit products on the selected model
                          </p>
                        </>
                      )}

                      {/* Privacy note */}
                      <div className="flex items-center justify-center gap-1.5 text-[10px]" style={{ color: T.textMuted }}>
                        <Shield size={10} /> Your photo is processed locally & never stored
                      </div>
                    </div>
                  ) : detecting ? (
                    /* ─── AI PROCESSING STATE ── */
                    <div className="space-y-4">
                      <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border" style={{ borderColor: T.border }}>
                        <img src={userPhoto} alt="" className="w-full h-full object-cover" />
                        {/* Scanning overlay */}
                        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }}>
                          {/* Scan line animation */}
                          <div className="absolute left-0 right-0 h-0.5 animate-[scan_2s_ease-in-out_infinite]" style={{ background: 'linear-gradient(90deg, transparent, #FFD3AC, transparent)', boxShadow: '0 0 20px #FFD3AC, 0 0 40px rgba(255,211,172,0.3)' }} />
                          {/* Grid overlay */}
                          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,211,172,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,211,172,0.3) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                        </div>
                        {/* Center status */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center px-6 py-4 rounded-2xl" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)' }}>
                            <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center animate-pulse" style={{ background: T.gradient }}>
                              <Sparkles size={22} className="text-white" />
                            </div>
                            <p className="text-sm font-bold text-white mb-1">AI Analyzing Body</p>
                            <p className="text-[11px] text-white/60">Detecting pose landmarks...</p>
                          </div>
                        </div>
                      </div>
                      {/* Progress steps */}
                      <div className="space-y-2">
                        {['Body detected', 'Measuring proportions', 'Fitting garment'].map((step, i) => (
                          <div key={i} className="flex items-center gap-2.5">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${T.accent}20` }}>
                              <Loader2 size={10} className="animate-spin" style={{ color: T.accentLight }} />
                            </div>
                            <span className="text-[11px] font-medium" style={{ color: T.textSec }}>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : resultImage ? (
                    /* ─── RESULT STATE ─── */
                    <div className="space-y-4">
                      {/* Result image */}
                      <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border" style={{ borderColor: T.borderActive }}>
                        <img src={showComparison ? userPhoto! : resultImage} alt="Try-on result" className="w-full h-full object-contain" style={{ background: T.surfaceAlt }} />
                        {/* Toggle comparison */}
                        <button
                          onClick={() => setShowComparison(!showComparison)}
                          className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all"
                          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: '#fff' }}
                        >
                          <Eye size={10} /> {showComparison ? 'Show Result' : 'Show Original'}
                        </button>
                        {/* AI badge */}
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
                          <Sparkles size={10} /> AI Try-On
                        </div>
                        {/* Product info bar */}
                        <div className="absolute bottom-0 left-0 right-0 p-3" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                          <div className="flex items-center gap-2.5 p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}>
                            <img src={selectedProduct.img} alt="" className="w-9 h-12 rounded-lg object-cover border border-white/20" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-white truncate">{selectedProduct.name}</p>
                              <p className="text-[11px] text-white/60">{selectedProduct.price}</p>
                            </div>
                            <Link to={`/product/${selectedProduct.id}`} className="px-3.5 py-2 rounded-xl text-[11px] font-bold text-white transition-all hover:scale-105" style={{ background: T.gradient }}>
                              Buy Now
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Body type selector */}
                      {resultImage && selectedProduct && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: T.textMuted }}>Body Type</p>
                          <div className="flex gap-2">
                            {(['slim', 'average', 'plus-size'] as const).map(bodyType => (
                              <button
                                key={bodyType}
                                onClick={() => setSelectedBodyType(bodyType)}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                                  selectedBodyType === bodyType
                                    ? 'text-white shadow-md'
                                    : 'border-2 hover:scale-105'
                                }`}
                                style={{
                                  background: selectedBodyType === bodyType ? T.gradient : T.surfaceAlt,
                                  borderColor: selectedBodyType === bodyType ? T.accent : T.border,
                                  color: selectedBodyType === bodyType ? 'white' : T.text,
                                }}
                              >
                                {bodyType === 'slim' ? 'Slim' : bodyType === 'average' ? 'Average' : 'Plus Size'}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Color selector */}
                      {resultImage && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: T.textMuted }}>Change Color</p>
                          <div className="flex flex-wrap gap-2">
                            {TRYON_COLORS.map(color => (
                              <button
                                key={color.id}
                                onClick={() => {
                                  setSelectedColor(color.id);
                                  if (userPhoto) processPhoto(userPhoto);
                                }}
                                className="relative w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110"
                                style={{
                                  background: color.id === 'original' ? `url(${selectedProduct.img}) center/cover` : color.hex || '#fff',
                                  borderColor: selectedColor === color.id ? T.accent : T.border,
                                  boxShadow: selectedColor === color.id ? `0 0 0 2px ${T.accent}` : 'none',
                                }}
                                title={color.label}
                              >
                                {selectedColor === color.id && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Check size={12} className={color.id === 'original' || color.hex === '#f5f5f5' ? 'text-gray-800' : 'text-white'} />
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-2.5">
                        <button onClick={downloadResult} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg" style={{ background: T.gradient }}>
                          <Download size={14} /> Save Photo
                        </button>
                        <button onClick={handleReset} className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border transition-all hover:scale-[1.02]" style={{ borderColor: T.border, color: T.text, background: T.surfaceAlt }}>
                          <RotateCcw size={14} /> New
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {/* Error */}
                  {error && (
                    <div className="mt-4 p-3.5 rounded-xl text-[12px] text-center font-medium" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
                      {error}
                    </div>
                  )}
                  {/* Pose loading */}
                  {poseLoading && !poseReady && (
                    <div className="flex items-center justify-center gap-2 text-[12px] mt-4 font-medium" style={{ color: T.textMuted }}>
                      <Loader2 size={13} className="animate-spin" /> Loading AI model...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ══ RIGHT: PRODUCT GRID ═══ */}
            <div className="flex-1 min-w-0">
              {/* Category Tabs */}
              <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
                {(['all', 'formal', 'jeans', 'track'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="px-4 py-2 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all duration-300"
                    style={{
                      background: activeTab === tab ? T.gradient : T.surface,
                      color: activeTab === tab ? '#fff' : T.textSec,
                      border: `1px solid ${activeTab === tab ? 'transparent' : T.border}`,
                      boxShadow: activeTab === tab ? '0 4px 12px rgba(139,94,60,0.25)' : 'none',
                    }}
                  >
                    {tab === 'all' ? 'All Items' : tab}
                  </button>
                ))}
                <div className="flex-1" />
                <span className="text-[11px] font-medium hidden sm:block" style={{ color: T.textMuted }}>{filteredProducts.length} products</span>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {filteredProducts.map(product => {
                  const isSelected = selectedProduct.id === product.id;
                  return (
                    <div
                      key={product.id}
                      className="group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl cursor-pointer"
                      style={{
                        background: T.surface,
                        borderColor: isSelected ? T.borderActive : T.border,
                        boxShadow: isSelected ? `0 0 0 1px ${T.accent}, 0 8px 24px rgba(139,94,60,0.15)` : 'none',
                        transform: isSelected ? 'translateY(-2px)' : 'none',
                      }}
                      onClick={() => { setSelectedProduct(product); if (userPhoto) processPhoto(userPhoto); }}
                    >
                      {/* Image */}
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

                        {/* Badge */}
                        {product.badge && (
                          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ background: T.gradient }}>
                            {product.badge}
                          </div>
                        )}

                        {/* Rating */}
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                          <Star size={8} className="fill-amber-400 text-amber-400" />
                          <span className="text-[9px] font-bold text-white">{product.rating}</span>
                        </div>

                        {/* Wishlist */}
                        <button className="absolute top-10 right-2.5 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
                          <Heart size={12} className="text-white" />
                        </button>

                        {/* Try-On button */}
                        <button
                          onClick={e => { e.stopPropagation(); handleTryOn(product); }}
                          className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                          style={{ background: T.gradient, boxShadow: '0 4px 16px rgba(139,94,60,0.35)' }}
                        >
                          <Sparkles size={15} className="text-white" />
                        </button>

                        {/* Selected indicator */}
                        {isSelected && (
                          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold text-white" style={{ background: T.gradient }}>
                            <Check size={9} /> Selected
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-3">
                        <h4 className="text-[12px] font-semibold truncate mb-1.5 leading-tight" style={{ color: T.text }}>{product.name}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] font-bold" style={{ color: T.accentLight }}>{product.price}</span>
                          <button
                            onClick={e => { e.stopPropagation(); handleTryOn(product); }}
                            className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all flex items-center gap-0.5 hover:gap-1.5"
                            style={{ color: T.accentLight }}
                          >
                            Try On <ChevronRight size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View All */}
              <div className="text-center mt-10">
                <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3 group" style={{ color: T.accentLight }}>
                  View All Products
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Scan animation keyframes */}
        <style>{`
          @keyframes scan {
            0%, 100% { top: 0; }
            50% { top: 100%; }
          }
        `}</style>
      </div>
    );
  }

  /* ================================================================== */
  /*  RENDER — Modal (product page)                                      */
  /* ================================================================== */
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-5xl h-[90vh] max-h-[750px] rounded-2xl overflow-hidden shadow-2xl flex flex-col" style={{ background: T.bg }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b shrink-0" style={{ background: T.surface, borderColor: T.border }}>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: T.gradient }}>
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="font-heading text-xs font-bold tracking-wider" style={{ color: T.text }}>Tubhyam</span>
            <div className="hidden sm:flex items-center gap-1 ml-3">
              {(['all', 'formal', 'jeans', 'track'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className="px-2.5 py-1 rounded-full text-[10px] font-medium capitalize transition-all"
                  style={{ background: activeTab === tab ? T.gradient : 'transparent', color: activeTab === tab ? '#fff' : T.textMuted }}
                >
                  {tab === 'all' ? 'All' : tab}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-white/5 transition-colors"><Search size={14} style={{ color: T.textSec }} /></button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors"><X size={16} style={{ color: T.textSec }} /></button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT: Fitting Room */}
          <div className="w-full sm:w-[320px] shrink-0 border-r flex flex-col" style={{ borderColor: T.border, background: T.surfaceAlt }}>
            <div className="px-4 py-2.5 border-b flex items-center justify-between" style={{ borderColor: T.border }}>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: `${T.accent}20` }}>
                  <User size={10} style={{ color: T.accentLight }} />
                </div>
                <span className="text-[11px] font-semibold" style={{ color: T.text }}>Fitting Room</span>
              </div>
              {userPhoto && <button onClick={handleReset} className="text-[10px] font-medium hover:underline" style={{ color: '#EF4444' }}>Reset</button>}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto">
              {!userPhoto ? (
                <div className="w-full space-y-3">
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border-2 border-dashed flex items-center justify-center cursor-pointer transition-all"
                    style={{ borderColor: dragOver ? T.accent : T.border, background: T.surface }}
                  >
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ background: T.surfaceAlt }}>
                        <ImageIcon size={20} style={{ color: T.textMuted }} />
                      </div>
                      <p className="text-[11px] font-medium" style={{ color: T.textSec }}>Drop or click to upload</p>
                      <p className="text-[10px] mt-0.5" style={{ color: T.textMuted }}>Full body photo works best</p>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-semibold text-white transition-all hover:scale-[1.02]" style={{ background: T.gradient }}>
                      <Upload size={12} /> Upload
                    </button>
                    <button onClick={startCamera} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-semibold border transition-all hover:scale-[1.02]" style={{ borderColor: T.border, color: T.text, background: T.surface }}>
                      <Camera size={12} /> Camera
                    </button>
                  </div>
                </div>
              ) : detecting ? (
                <div className="w-full">
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border" style={{ borderColor: T.border }}>
                    <img src={userPhoto} alt="" className="w-full h-full object-cover opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center animate-pulse" style={{ background: T.gradient }}>
                          <Sparkles size={18} className="text-white" />
                        </div>
                        <p className="text-[11px] font-semibold" style={{ color: T.text }}>AI Analyzing...</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : resultImage ? (
                <div className="w-full space-y-2">
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border" style={{ borderColor: T.border }}>
                    <img src={resultImage} alt="Try-on result" className="w-full h-full object-contain" style={{ background: T.surface }} />
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-medium text-white" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
                      <Sparkles size={9} /> AI
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2 p-1.5 rounded-lg text-white" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
                      <img src={selectedProduct.img} alt="" className="w-6 h-8 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-medium truncate">{selectedProduct.name}</p>
                        <p className="text-[9px] opacity-60">{selectedProduct.price}</p>
                      </div>
                      <Link to={`/product/${selectedProduct.id}`} onClick={onClose} className="px-2.5 py-1 rounded-full text-[9px] font-bold text-white shrink-0" style={{ background: T.gradient }}>Buy</Link>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={downloadResult} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[11px] font-semibold text-white" style={{ background: T.gradient }}>
                      <Download size={11} /> Save
                    </button>
                    <button onClick={handleReset} className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-[11px] font-semibold border" style={{ borderColor: T.border, color: T.text }}>
                      <RotateCcw size={11} /> New
                    </button>
                  </div>
                </div>
              ) : null}
              {error && <div className="w-full mt-2 p-2 rounded-xl text-[10px] text-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' }}>{error}</div>}
              {poseLoading && !poseReady && <div className="flex items-center justify-center gap-1.5 text-[10px] mt-2" style={{ color: T.textMuted }}><Loader2 size={10} className="animate-spin" /> Loading AI...</div>}
            </div>
          </div>

          {/* RIGHT: Product Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold" style={{ color: T.text }}>New Arrivals</h3>
              <span className="text-[10px]" style={{ color: T.textMuted }}>{filteredProducts.length} items</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
              {filteredProducts.map(product => {
                const isSelected = selectedProduct.id === product.id;
                return (
                  <div key={product.id}
                    className="group relative rounded-xl overflow-hidden border transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                    style={{ background: T.surface, borderColor: isSelected ? T.accent : T.border }}
                    onClick={() => { setSelectedProduct(product); if (userPhoto) processPhoto(userPhoto); }}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
                        <Star size={7} className="fill-amber-400 text-amber-400" />
                        <span className="text-[8px] font-bold text-white">{product.rating}</span>
                      </div>
                      <button className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
                        <Heart size={10} className="text-white" />
                      </button>
                      <button onClick={e => { e.stopPropagation(); handleTryOn(product); }}
                        className="absolute bottom-1.5 right-1.5 w-8 h-8 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                        style={{ background: T.gradient, boxShadow: '0 3px 10px rgba(139,94,60,0.3)' }}
                      >
                        <Sparkles size={12} className="text-white" />
                      </button>
                      {isSelected && <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold text-white" style={{ background: T.gradient }}>Selected</div>}
                    </div>
                    <div className="p-2">
                      <h4 className="text-[10px] font-medium truncate mb-0.5" style={{ color: T.text }}>{product.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold" style={{ color: T.accentLight }}>{product.price}</span>
                        <button onClick={e => { e.stopPropagation(); handleTryOn(product); }} className="text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5" style={{ color: T.accentLight }}>
                          Try On <ChevronRight size={9} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-5">
              <Link to="/shop" onClick={onClose} className="inline-flex items-center gap-1 text-[11px] font-medium transition-colors" style={{ color: T.accentLight }}>
                View All Products <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default AIVirtualTryOn;
