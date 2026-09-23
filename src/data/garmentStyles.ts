import type { Product } from './products';

/**
 * Product-specific trouser details extracted from the catalog entry and
 * mapped to visual rendering instructions for the Style Studio mannequin.
 */

export type GarmentFit = 'slim' | 'straight' | 'relaxed' | 'wide-leg' | 'jogger';
export type WaistType = 'elastic' | 'drawstring' | 'belted' | 'button' | 'flat';
export type AnkleType = 'straight' | 'tapered' | 'cuffed' | 'elastic-cuff' | 'flare';
export type PocketStyle = 'none' | 'slash' | 'patch' | 'cargo' | 'five-pocket';
export type FabricTexture = 'smooth' | 'knit' | 'twill' | 'denim' | 'linen' | 'satin';

export interface GarmentStyle {
  fit: GarmentFit;
  waistType: WaistType;
  ankleType: AnkleType;
  pocketStyle: PocketStyle;
  texture: FabricTexture;
  hasStitching: boolean;
  hasSideStripe: boolean;
  hasCrease: boolean;
  fabricSheen: number; // 0 (matte) .. 1 (high sheen)
}

export interface GarmentVisuals {
  waistWidth: number;
  hipWidth: number;
  thighWidth: number;
  ankleWidth: number;
  showWaistband: boolean;
  showBelt: boolean;
  showFly: boolean;
  showPockets: boolean;
  showCrease: boolean;
  showStitching: boolean;
  showSideStripe: boolean;
  showElasticCuff: boolean;
  waistbandHeight: number;
  pocketOffset: number;
  stitchingOpacity: number;
  creaseOpacity: number;
  sideStripeWidth: number;
}

/** Extract product-specific garment features from name/description/material. */
export function extractGarmentStyle(product: Product): GarmentStyle {
  const text = `${product.name} ${product.description} ${product.material}`.toLowerCase();

  const has = (re: RegExp) => re.test(text);

  const fit: GarmentFit = has(/jogger/)
    ? 'jogger'
    : has(/wide-?leg|palazzo|flare/)
      ? 'wide-leg'
      : has(/relaxed|baggy|loose|comfort fit/)
        ? 'relaxed'
        : has(/slim|skinny|cigarette|pencil/)
          ? 'slim'
          : 'straight';

  const waistType: WaistType = has(/drawstring/)
    ? 'drawstring'
    : has(/elastic/)
      ? 'elastic'
      : has(/belt/)
        ? 'belted'
        : has(/button/)
          ? 'button'
          : 'flat';

  const ankleType: AnkleType = has(/elastic cuff|ribbed .*cuff/)
    ? 'elastic-cuff'
    : has(/cuffed|cuff/)
      ? 'cuffed'
      : has(/tapered|cigarette|pencil/)
        ? 'tapered'
        : has(/flare|flared/)
          ? 'flare'
          : 'straight';

  const texture: FabricTexture = has(/denim/)
    ? 'denim'
    : has(/linen/)
      ? 'linen'
      : has(/satin/)
        ? 'satin'
        : has(/knit|jersey/)
          ? 'knit'
          : has(/twill/)
            ? 'twill'
            : 'smooth';

  const pocketStyle: PocketStyle =
    texture === 'denim' || has(/five-?pocket/)
      ? 'five-pocket'
      : has(/cargo/)
        ? 'cargo'
        : has(/patch pocket/)
          ? 'patch'
          : has(/no pockets|pocketless/)
            ? 'none'
            : 'slash';

  const hasStitching = texture === 'denim' || has(/stitch/);
  const hasSideStripe = has(/side[- ]stripe/);
  const hasCrease = has(/crease|pressed/);

  const fabricSheen = texture === 'satin'
    ? 0.55
    : has(/wool/)
      ? 0.35
      : texture === 'denim'
        ? 0.08
        : texture === 'linen'
          ? 0.1
          : 0.2;

  return {
    fit,
    waistType,
    ankleType,
    pocketStyle,
    texture,
    hasStitching,
    hasSideStripe,
    hasCrease,
    fabricSheen,
  };
}

/** Map extracted features to mannequin rendering instructions. */
export function getGarmentVisuals(style: GarmentStyle): GarmentVisuals {
  const widths: Record<GarmentFit, Pick<GarmentVisuals, 'waistWidth' | 'hipWidth' | 'thighWidth' | 'ankleWidth'>> = {
    slim: { waistWidth: 0.94, hipWidth: 0.96, thighWidth: 0.92, ankleWidth: 0.88 },
    straight: { waistWidth: 1.0, hipWidth: 1.02, thighWidth: 1.0, ankleWidth: 1.0 },
    relaxed: { waistWidth: 1.04, hipWidth: 1.06, thighWidth: 1.08, ankleWidth: 1.05 },
    'wide-leg': { waistWidth: 1.0, hipWidth: 1.08, thighWidth: 1.18, ankleWidth: 1.55 },
    jogger: { waistWidth: 1.02, hipWidth: 1.04, thighWidth: 1.02, ankleWidth: 0.85 },
  };
  const w = widths[style.fit];

  return {
    waistWidth: w.waistWidth,
    hipWidth: w.hipWidth,
    thighWidth: w.thighWidth,
    ankleWidth: w.ankleWidth,
    showWaistband: true,
    showBelt: style.waistType === 'belted',
    showFly: style.waistType !== 'elastic' && style.waistType !== 'drawstring',
    showPockets: style.pocketStyle !== 'none',
    showCrease: style.hasCrease,
    showStitching: style.hasStitching,
    showSideStripe: style.hasSideStripe,
    showElasticCuff: style.ankleType === 'elastic-cuff' || style.fit === 'jogger',
    waistbandHeight: style.waistType === 'elastic' || style.waistType === 'drawstring' ? 14 : 11,
    pocketOffset: style.pocketStyle === 'cargo' ? 12 : 7,
    stitchingOpacity: 0.5,
    creaseOpacity: style.hasCrease ? 0.35 : 0,
    sideStripeWidth: style.hasSideStripe ? 2.5 : 0,
  };
}

/** Derive the four fabric shades used for SVG shading from a base hex color. */
export function getFabricShading(
  hex: string,
  style: GarmentStyle
): { base: string; dark: string; light: string; highlight: string } {
  const shade = (amount: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  const sheenBoost = Math.round(style.fabricSheen * 18);
  return {
    base: hex,
    dark: shade(-28),
    light: shade(22 + sheenBoost),
    highlight: shade(34 + sheenBoost),
  };
}
