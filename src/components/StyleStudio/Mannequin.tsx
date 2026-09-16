import { useTheme } from '@/context/ThemeContext';
import type { GarmentVisuals } from '@/data/garmentStyles';

type BodyShape = 'slim' | 'average' | 'plus-size';
type GarmentType = 'formal' | 'jeans' | 'track';
type Gender = 'male' | 'female';

interface MannequinProps {
  size: string;
  skinTone: string;
  garmentColor?: string;
  topColor?: string;
  height?: number;
  width?: number;
  gender?: Gender;
  bodyShape?: BodyShape;
  garmentType?: GarmentType;
  // NEW: Product-specific garment visuals
  garmentVisuals?: GarmentVisuals;
  fabricColors?: {
    base: string;
    dark: string;
    light: string;
    highlight: string;
  };
}

const SKIN_TONES: Record<string, string> = {
  Fair: '#F5D0B0',
  Light: '#E8B896',
  Medium: '#D4A574',
  Tan: '#C4956A',
  Honey: '#A67B5B',
  Deep: '#6B4423',
};

// Base male size scales (the reference body)
const SIZE_SCALES: Record<string, { shoulder: number; waist: number; hip: number; thigh: number; ankle: number }> = {
  XXS: { shoulder: 66, waist: 54, hip: 74, thigh: 34, ankle: 24 },
  XS:  { shoulder: 71, waist: 58, hip: 80, thigh: 36, ankle: 26 },
  S:   { shoulder: 76, waist: 62, hip: 86, thigh: 39, ankle: 28 },
  M:   { shoulder: 82, waist: 67, hip: 92, thigh: 42, ankle: 30 },
  L:   { shoulder: 88, waist: 73, hip: 99, thigh: 45, ankle: 32 },
  XL:  { shoulder: 94, waist: 79, hip: 106, thigh: 48, ankle: 34 },
  '2XL': { shoulder: 100, waist: 86, hip: 113, thigh: 51, ankle: 36 },
  '3XL': { shoulder: 106, waist: 93, hip: 120, thigh: 54, ankle: 38 },
  '4XL': { shoulder: 112, waist: 100, hip: 127, thigh: 57, ankle: 40 },
  '5XL': { shoulder: 118, waist: 107, hip: 134, thigh: 60, ankle: 42 },
};

// Body-shape modifiers — separate curves per gender
const BODY_SHAPE_MODIFIERS: Record<Gender, Record<BodyShape, { waist: number; hip: number; thigh: number; shoulder: number }>> = {
  male: {
    slim:        { shoulder: 0.95, waist: 0.92, hip: 0.92, thigh: 0.94 },
    average:     { shoulder: 1.0,  waist: 1.0,  hip: 1.0,  thigh: 1.0 },
    'plus-size': { shoulder: 1.04, waist: 1.08, hip: 1.10, thigh: 1.08 },
  },
  female: {
    slim:        { shoulder: 0.95, waist: 0.90, hip: 0.94, thigh: 0.95 },
    average:     { shoulder: 1.0,  waist: 1.0,  hip: 1.0,  thigh: 1.0 },
    'plus-size': { shoulder: 1.03, waist: 1.10, hip: 1.12, thigh: 1.08 },
  },
};

// Structural gender differences applied as multipliers on the base (male) scales.
// Female: narrower shoulders, smaller waist, wider hips, slimmer thighs/ankles.
const GENDER_STRUCTURAL: Record<Gender, { shoulder: number; waist: number; hip: number; thigh: number; ankle: number }> = {
  male:   { shoulder: 1.0,  waist: 1.0,  hip: 1.0,  thigh: 1.0,  ankle: 1.0 },
  female: { shoulder: 0.88, waist: 0.86, hip: 1.10, thigh: 0.94, ankle: 0.90 },
};

// Vertical-layout offsets for female proportions (shorter torso, higher waist, longer legs relative to torso)
const GENDER_VERTICAL: Record<Gender, { waistOff: number; hipOff: number; crotchOff: number; kneeOff: number }> = {
  male:   { waistOff: 0,   hipOff: 0,  crotchOff: 0,  kneeOff: 0 },
  female: { waistOff: -12, hipOff: 6,  crotchOff: 10, kneeOff: -4 },
};

const Mannequin = ({
  size = 'M',
  skinTone = 'Medium',
  garmentColor = '#8B5E3C',
  topColor = '#FFFFFF',
  height = 620,
  width = 400,
  gender = 'male',
  bodyShape = 'average',
  garmentType = 'formal',
  garmentVisuals,
  fabricColors,
}: MannequinProps) => {
  const { isLight } = useTheme();
  const skin = SKIN_TONES[skinTone] || SKIN_TONES.Medium;
  const raw = SIZE_SCALES[size] || SIZE_SCALES.M;
  const shapeMod = BODY_SHAPE_MODIFIERS[gender]?.[bodyShape] || BODY_SHAPE_MODIFIERS.male.average;
  const gStruct = GENDER_STRUCTURAL[gender] || GENDER_STRUCTURAL.male;
  const gVert = GENDER_VERTICAL[gender] || GENDER_VERTICAL.male;

  // Apply product-specific garment visuals if provided
  const visuals = garmentVisuals || {
    waistWidth: 1.0,
    hipWidth: 1.05,
    thighWidth: 1.0,
    ankleWidth: 1.0,
    showWaistband: true,
    showBelt: garmentType === 'formal',
    showFly: garmentType !== 'track',
    showPockets: true,
    showCrease: garmentType === 'formal',
    showStitching: garmentType === 'jeans',
    showSideStripe: garmentType === 'track',
    showElasticCuff: garmentType === 'track',
    waistbandHeight: garmentType === 'track' ? 14 : 11,
    pocketOffset: garmentType === 'track' ? 12 : 7,
    stitchingOpacity: 0.5,
    creaseOpacity: garmentType === 'formal' ? 0.35 : 0,
    sideStripeWidth: garmentType === 'track' ? 2.5 : 0,
  };

  // Apply gender structural × body-shape modifiers × product-specific multipliers with overflow caps
  const maxLateral = width * 0.42;
  const s = {
    shoulder: Math.min(raw.shoulder * gStruct.shoulder * shapeMod.shoulder, maxLateral),
    waist:    Math.min(raw.waist * gStruct.waist * shapeMod.waist * visuals.waistWidth, maxLateral),
    hip:      Math.min(raw.hip * gStruct.hip * shapeMod.hip * visuals.hipWidth, maxLateral),
    thigh:    Math.min(raw.thigh * gStruct.thigh * shapeMod.thigh * visuals.thighWidth, maxLateral * 0.5),
    ankle:    raw.ankle * gStruct.ankle * visuals.ankleWidth,
  };

  const cx = width / 2;

  // Vertical layout (with gender offsets)
  const headY = 40;
  const headR = 25;
  const neckY = headY + headR - 4;
  const neckH = 15;
  const shoulderY = neckY + neckH;
  const waistY = shoulderY + 105 + gVert.waistOff;
  const hipY = waistY + 48 + gVert.hipOff;
  const crotchY = hipY + 34 + gVert.crotchOff;
  const kneeY = crotchY + 110 + gVert.kneeOff;
  const ankleY = kneeY + 110;
  const gap = 4;

  const shade = (hex: string, amt: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amt));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amt));
    const b = Math.min(255, Math.max(0, (num & 0xff) + amt));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };
  
  // Use product-specific fabric colors if provided, otherwise generate from base color
  const colors = fabricColors || {
    base: garmentColor,
    dark: shade(garmentColor, -28),
    light: shade(garmentColor, 22),
    highlight: shade(garmentColor, 35),
  };
  const pantsDark = colors.dark;
  const pantsLight = colors.light;

  // TOP (shirt) — female has slightly deeper neckline
  const necklineDepth = gender === 'female' ? 14 : 11;
  const topPath = `
    M ${cx - s.shoulder / 2} ${shoulderY}
    L ${cx + s.shoulder / 2} ${shoulderY}
    L ${cx + s.waist / 2 + 3} ${waistY}
    L ${cx - s.waist / 2 - 3} ${waistY}
    Z
  `;

  // Garment-type derived values
  // NOTE: s.thigh and s.ankle are FULL widths; divide by 2 for half-width in path
  const thighHalf = s.thigh / 2;
  const ankleBaseHalf = s.ankle / 2;
  // Use product-specific ankle width or fallback to garment type logic
  const ankleEffHalf = visuals.showElasticCuff 
    ? ankleBaseHalf * 0.9  // Elastic cuff makes it narrower
    : visuals.ankleWidth > 1.2 
      ? ankleBaseHalf * 1.35  // Wide-leg style
      : garmentType === 'jeans' 
        ? ankleBaseHalf * 1.35  // Jeans straight-leg
        : ankleBaseHalf;
  
  // Track pants or relaxed fit are slightly looser at the thigh
  const thighEffHalf = thighHalf;

  // TROUSERS — hip curve prominence differs by gender, full coverage from waist to ankles
  const hipCurveExtra = gender === 'female' ? 7 : 4;
  
  // Ensure full leg coverage - pants should completely cover the leg area
  const pantsPath = `
    M ${cx - s.waist / 2 - 3} ${waistY}
    L ${cx + s.waist / 2 + 3} ${waistY}
    Q ${cx + s.hip / 2 + hipCurveExtra} ${hipY - 10} ${cx + s.hip / 2} ${hipY}
    L ${cx + thighEffHalf + gap / 2} ${crotchY}
    Q ${cx + thighEffHalf + gap / 2 + 3} ${kneeY} ${cx + ankleEffHalf + gap / 2} ${ankleY}
    L ${cx + ankleEffHalf + gap / 2} ${ankleY + 2}
    L ${cx + gap / 2} ${ankleY + 2}
    L ${cx + gap / 2} ${crotchY + 6}
    L ${cx - gap / 2} ${crotchY + 6}
    L ${cx - gap / 2} ${ankleY + 2}
    L ${cx - ankleEffHalf - gap / 2} ${ankleY + 2}
    L ${cx - ankleEffHalf - gap / 2} ${ankleY}
    Q ${cx - thighEffHalf - gap / 2 - 3} ${kneeY} ${cx - thighEffHalf - gap / 2} ${crotchY}
    L ${cx - s.hip / 2} ${hipY}
    Q ${cx - s.hip / 2 - hipCurveExtra} ${hipY - 10} ${cx - s.waist / 2 - 3} ${waistY}
    Z
  `;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
      <rect width={width} height={height} fill={isLight ? '#FAF5EF' : '#1C1714'} rx="12" />

      {/* Head */}
      <circle cx={cx} cy={headY} r={headR} fill={skin} />
      {/* Jawline — male: angular/square; female: softer/rounder */}
      {gender === 'male' ? (
        <path
          d={`M ${cx - headR + 2} ${headY + 8} L ${cx - headR + 6} ${headY + headR - 2} Q ${cx} ${headY + headR + 3} ${cx + headR - 6} ${headY + headR - 2} L ${cx + headR - 2} ${headY + 8}`}
          fill={skin}
        />
      ) : (
        <path
          d={`M ${cx - headR + 4} ${headY + 8} Q ${cx - headR + 2} ${headY + headR + 2} ${cx} ${headY + headR + 6} Q ${cx + headR - 2} ${headY + headR + 2} ${cx + headR - 4} ${headY + 8}`}
          fill={skin}
        />
      )}
      {/* Hair — male: short cropped; female: longer flowing */}
      {gender === 'male' ? (
        <path
          d={`M ${cx - headR - 2} ${headY - 2} Q ${cx - headR - 3} ${headY - headR - 4} ${cx} ${headY - headR - 6} Q ${cx + headR + 3} ${headY - headR - 4} ${cx + headR + 2} ${headY - 2} L ${cx + headR} ${headY + 6} L ${cx + headR - 3} ${headY + 2} Q ${cx} ${headY - headR + 6} ${cx - headR + 3} ${headY + 2} L ${cx - headR} ${headY + 6} Z`}
          fill="#2C1810"
          opacity="0.92"
        />
      ) : (
        <path
          d={`M ${cx - headR - 3} ${headY - 4} Q ${cx - headR - 5} ${headY - headR - 8} ${cx} ${headY - headR - 10} Q ${cx + headR + 5} ${headY - headR - 8} ${cx + headR + 3} ${headY - 4} L ${cx + headR} ${headY + headR - 4} Q ${cx} ${headY + headR + 4} ${cx - headR} ${headY + headR - 4} Z`}
          fill="#2C1810"
          opacity="0.92"
        />
      )}

      {/* Neck — male: thicker with Adam's apple; female: slender */}
      {gender === 'male' ? (
        <>
          <rect x={cx - 12} y={neckY} width={24} height={neckH + 6} fill={skin} />
          <ellipse cx={cx} cy={neckY + 7} rx={2.5} ry={3.5} fill={shade(skin, -18)} opacity="0.45" />
        </>
      ) : (
        <rect x={cx - 9} y={neckY} width={18} height={neckH + 6} fill={skin} />
      )}

      {/* Arms — male: slightly thicker with more angular contour */}
      {gender === 'male' ? (
        <>
          <path d={`M ${cx - s.shoulder / 2} ${shoulderY + 4} Q ${cx - s.shoulder / 2 - 15} ${shoulderY + 68} ${cx - s.shoulder / 2 - 8} ${shoulderY + 130} L ${cx - s.shoulder / 2 + 6} ${shoulderY + 130} Q ${cx - s.shoulder / 2} ${shoulderY + 68} ${cx - s.shoulder / 2 + 10} ${shoulderY + 10} Z`} fill={skin} />
          <path d={`M ${cx + s.shoulder / 2} ${shoulderY + 4} Q ${cx + s.shoulder / 2 + 15} ${shoulderY + 68} ${cx + s.shoulder / 2 + 8} ${shoulderY + 130} L ${cx + s.shoulder / 2 - 6} ${shoulderY + 130} Q ${cx + s.shoulder / 2} ${shoulderY + 68} ${cx + s.shoulder / 2 - 10} ${shoulderY + 10} Z`} fill={skin} />
        </>
      ) : (
        <>
          <path d={`M ${cx - s.shoulder / 2} ${shoulderY + 6} Q ${cx - s.shoulder / 2 - 11} ${shoulderY + 70} ${cx - s.shoulder / 2 - 6} ${shoulderY + 126} L ${cx - s.shoulder / 2 + 4} ${shoulderY + 126} Q ${cx - s.shoulder / 2 - 1} ${shoulderY + 70} ${cx - s.shoulder / 2 + 7} ${shoulderY + 12} Z`} fill={skin} />
          <path d={`M ${cx + s.shoulder / 2} ${shoulderY + 6} Q ${cx + s.shoulder / 2 + 11} ${shoulderY + 70} ${cx + s.shoulder / 2 + 6} ${shoulderY + 126} L ${cx + s.shoulder / 2 - 4} ${shoulderY + 126} Q ${cx + s.shoulder / 2 + 1} ${shoulderY + 70} ${cx + s.shoulder / 2 - 7} ${shoulderY + 12} Z`} fill={skin} />
        </>
      )}

      {/* TOP */}
      <path d={topPath} fill={topColor} />
      {/* Neckline — male: crew/V-neck with collar hint; female: deeper scoop */}
      {gender === 'male' ? (
        <>
          <path d={`M ${cx - 12} ${shoulderY} Q ${cx} ${shoulderY + necklineDepth} ${cx + 12} ${shoulderY}`} fill="none" stroke={shade(topColor, -35)} strokeWidth="2.5" />
          <path d={`M ${cx - 14} ${shoulderY + 1} Q ${cx} ${shoulderY + necklineDepth + 2} ${cx + 14} ${shoulderY + 1}`} fill="none" stroke={shade(topColor, -20)} strokeWidth="1.2" />
          {/* Button placket */}
          <line x1={cx} y1={shoulderY + necklineDepth + 2} x2={cx} y2={waistY} stroke={shade(topColor, -25)} strokeWidth="1.2" opacity="0.5" />
          <circle cx={cx} cy={shoulderY + necklineDepth + 14} r={1.8} fill={shade(topColor, -30)} opacity="0.5" />
          <circle cx={cx} cy={shoulderY + necklineDepth + 30} r={1.8} fill={shade(topColor, -30)} opacity="0.5" />
          <circle cx={cx} cy={shoulderY + necklineDepth + 46} r={1.8} fill={shade(topColor, -30)} opacity="0.5" />
        </>
      ) : (
        <path d={`M ${cx - 15} ${shoulderY} Q ${cx} ${shoulderY + necklineDepth} ${cx + 15} ${shoulderY}`} fill="none" stroke={shade(topColor, -35)} strokeWidth="2" />
      )}

      {/* TROUSERS */}
      <path d={pantsPath} fill={colors.base} />
      
      {/* Waistband */}
      {visuals.showWaistband && (
        <rect 
          x={cx - s.waist / 2 - 3} 
          y={waistY} 
          width={s.waist + 6} 
          height={visuals.waistbandHeight} 
          fill={pantsDark} 
        />
      )}
      
      {/* Fly */}
      {visuals.showFly && (
        <line 
          x1={cx} 
          y1={waistY + visuals.waistbandHeight} 
          x2={cx} 
          y2={crotchY} 
          stroke={pantsDark} 
          strokeWidth="1.5" 
          opacity="0.55" 
        />
      )}
      
      {/* Leg creases */}
      {visuals.showCrease && visuals.creaseOpacity > 0 && (
        <>
          <path 
            d={`M ${cx - thighHalf / 2 - gap / 2} ${crotchY + 20} Q ${cx - thighHalf / 2 - gap / 2} ${kneeY} ${cx - ankleEffHalf / 2 - gap / 2} ${ankleY - 8}`} 
            fill="none" 
            stroke={pantsDark} 
            strokeWidth="1.2" 
            opacity={visuals.creaseOpacity} 
          />
          <path 
            d={`M ${cx + thighHalf / 2 + gap / 2} ${crotchY + 20} Q ${cx + thighHalf / 2 + gap / 2} ${kneeY} ${cx + ankleEffHalf / 2 + gap / 2} ${ankleY - 8}`} 
            fill="none" 
            stroke={pantsDark} 
            strokeWidth="1.2" 
            opacity={visuals.creaseOpacity} 
          />
        </>
      )}
      
      {/* Side highlight */}
      <path 
        d={`M ${cx - s.hip / 2 + 4} ${hipY} Q ${cx - thighHalf - gap / 2 + 4} ${kneeY} ${cx - ankleEffHalf - gap / 2 + 3} ${ankleY - 6}`} 
        fill="none" 
        stroke={pantsLight} 
        strokeWidth="2" 
        opacity="0.4" 
      />
      
      {/* Pockets */}
      {visuals.showPockets && (
        <>
          <path 
            d={`M ${cx - s.hip / 2 + visuals.pocketOffset} ${hipY - 6} L ${cx - s.hip / 2 + visuals.pocketOffset + 10} ${hipY + 8} L ${cx - s.hip / 2 + visuals.pocketOffset} ${hipY + 16}`} 
            fill="none" 
            stroke={pantsDark} 
            strokeWidth="1.5" 
            opacity="0.5" 
          />
          <path 
            d={`M ${cx + s.hip / 2 - visuals.pocketOffset} ${hipY - 6} L ${cx + s.hip / 2 - visuals.pocketOffset - 10} ${hipY + 8} L ${cx + s.hip / 2 - visuals.pocketOffset} ${hipY + 16}`} 
            fill="none" 
            stroke={pantsDark} 
            strokeWidth="1.5" 
            opacity="0.5" 
          />
        </>
      )}
      
      {/* Belt (for button-waist garments) */}
      {visuals.showBelt && gender === 'male' && (
        <>
          <rect 
            x={cx - s.waist / 2 - 3} 
            y={waistY + 1} 
            width={s.waist + 6} 
            height={5} 
            fill={shade(colors.base, -40)} 
            opacity="0.6" 
          />
          <rect 
            x={cx - 5} 
            y={waistY + 1} 
            width={10} 
            height={5} 
            rx={1} 
            fill={isLight ? '#B8956A' : '#8B7355'} 
            opacity="0.7" 
          />
        </>
      )}

      {/* Jeans/Denim stitching lines */}
      {visuals.showStitching && (
        <>
          <path 
            d={`M ${cx - s.hip / 2 + 2} ${hipY} Q ${cx - thighEffHalf - gap / 2 + 2} ${kneeY} ${cx - ankleEffHalf - gap / 2 + 2} ${ankleY - 4}`} 
            fill="none" 
            stroke={pantsDark} 
            strokeWidth="1" 
            strokeDasharray="4 3" 
            opacity={visuals.stitchingOpacity} 
          />
          <path 
            d={`M ${cx + s.hip / 2 - 2} ${hipY} Q ${cx + thighEffHalf + gap / 2 - 2} ${kneeY} ${cx + ankleEffHalf + gap / 2 - 2} ${ankleY - 4}`} 
            fill="none" 
            stroke={pantsDark} 
            strokeWidth="1" 
            strokeDasharray="4 3" 
            opacity={visuals.stitchingOpacity} 
          />
        </>
      )}

      {/* Track side-stripes */}
      {visuals.showSideStripe && visuals.sideStripeWidth > 0 && (
        <>
          <path 
            d={`M ${cx - s.hip / 2 + 3} ${hipY} Q ${cx - thighEffHalf - gap / 2 + 3} ${kneeY} ${cx - ankleEffHalf - gap / 2 + 2} ${ankleY - 4}`} 
            fill="none" 
            stroke={pantsLight} 
            strokeWidth={visuals.sideStripeWidth} 
            opacity="0.7" 
          />
          <path 
            d={`M ${cx + s.hip / 2 - 3} ${hipY} Q ${cx + thighEffHalf + gap / 2 - 3} ${kneeY} ${cx + ankleEffHalf + gap / 2 - 2} ${ankleY - 4}`} 
            fill="none" 
            stroke={pantsLight} 
            strokeWidth={visuals.sideStripeWidth} 
            opacity="0.7" 
          />
        </>
      )}
      
      {/* Elastic cuffs */}
      {visuals.showElasticCuff && (
        <>
          <rect 
            x={cx - ankleEffHalf - gap / 2 - 1} 
            y={ankleY - 8} 
            width={ankleEffHalf * 2 + 2} 
            height={8} 
            rx={2} 
            fill={pantsDark} 
            opacity="0.6" 
          />
          <rect 
            x={cx + gap / 2 - 1} 
            y={ankleY - 8} 
            width={ankleEffHalf * 2 + 2} 
            height={8} 
            rx={2} 
            fill={pantsDark} 
            opacity="0.6" 
          />
        </>
      )}

      {/* Shoes */}
      <ellipse cx={cx - thighHalf - gap / 2} cy={ankleY + 9} rx={thighHalf + 6} ry={9} fill={isLight ? '#C9B8A5' : '#3A2E24'} />
      <ellipse cx={cx + thighHalf + gap / 2} cy={ankleY + 9} rx={thighHalf + 6} ry={9} fill={isLight ? '#C9B8A5' : '#3A2E24'} />

      <text x={cx} y={height - 14} textAnchor="middle" fontSize="14" fontWeight="600" fill={isLight ? '#8B5E3C' : '#FFD3AC'} fontFamily="Inter, sans-serif">
        Size {size}
      </text>
    </svg>
  );
};

export default Mannequin;
