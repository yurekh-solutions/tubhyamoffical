/**
 * Reusable base-model library for the Tubhyam Style Studio.
 *
 * The Style Studio shows a single REUSABLE female model whose look is driven by
 * the chosen body shape + skin tone. Products swap on the same model rather than
 * generating a new model per product. Each model maps to a pre-generated base
 * plate under public/images/models/{plateSkin}-{sizeForBody}.jpg.
 *
 * The same {plateSkin}-{sizeForBody} key is used as the Phase-2 VTON composite
 * filename ({productId}__{modelId}.jpg), so the frontend and the offline Colab
 * pipeline agree on one naming convention.
 */

export type BodyShape = 'slim' | 'average' | 'plus-size';
export type SkinTone = 'Fair' | 'Light' | 'Medium' | 'Tan' | 'Honey' | 'Deep';

// Body shape -> the plate size suffix used by the base-model assets.
// NOTE: This is only a fallback when no uiSize is provided.
const BODY_TO_SIZE: Record<BodyShape, string> = {
  slim: 's',
  average: 'm',
  'plus-size': 'xl',
};

// Ordered size ladder used to shift the plate when Body Shape changes.
const SIZE_ORDER = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl', '4xl', '5xl'];

// Body shape acts as a visible modifier on the size plate:
// slim -> one size down, average -> exact size, plus-size -> one size up (clamped).
const BODY_SHAPE_OFFSET: Record<BodyShape, number> = {
  slim: -1,
  average: 0,
  'plus-size': 1,
};

// UI size -> the plate size suffix used by the base-model assets.
const SIZE_TO_PLATE: Record<string, string> = {
  'XXS': 'xxs',
  'XS': 'xs',
  'S': 's',
  'M': 'm',
  'L': 'l',
  'XL': 'xl',
  '2XL': 'xxl',
  '3XL': 'xxxl',
  '4XL': '4xl',
  '5XL': '5xl',
};

// UI skin tone -> the plate skin token used by the base-model assets.
const SKIN_TO_PLATE: Record<SkinTone, string> = {
  Fair: 'fair',
  Light: 'fair',
  Medium: 'medium',
  Tan: 'wheatish',
  Honey: 'dusky',
  Deep: 'deep',
};

export interface StyleStudioModel {
  id: string; // e.g. "medium-m"
  bodyType: BodyShape;
  skinTone: SkinTone;
  image: string; // e.g. "/images/models/medium-m.jpg"
}

/**
 * Stable model id shared by the base plate path and the VTON composite filename.
 * Examples:
 *   getModelId('average', 'Medium', 'L')    === 'medium-l'   (exact size)
 *   getModelId('slim',    'Medium', 'L')    === 'medium-s'   (one size down)
 *   getModelId('plus-size','Medium', 'L')  === 'medium-xl'  (one size up)
 *   getModelId('plus-size','Medium', '5XL') === 'medium-5xl' (clamped at max)
 *
 * @param bodyType - Shifts the plate (slim -1 / average 0 / plus-size +1); also the fallback size when uiSize is absent
 * @param skinTone - Skin tone for plate selection
 * @param uiSize - Optional actual size from UI selector (XXS-5XL)
 */
export const getModelId = (bodyType: BodyShape, skinTone: SkinTone, uiSize?: string): string => {
  const plateSkin = SKIN_TO_PLATE[skinTone] ?? 'medium';
  // Use UI size if provided, otherwise fall back to body shape mapping
  const base = uiSize ? (SIZE_TO_PLATE[uiSize] ?? BODY_TO_SIZE[bodyType]) : (BODY_TO_SIZE[bodyType] ?? 'm');
  // Apply the body-shape offset along the size ladder, clamped to both ends
  const offset = BODY_SHAPE_OFFSET[bodyType] ?? 0;
  const idx = SIZE_ORDER.indexOf(base);
  const shifted = idx === -1 ? base : SIZE_ORDER[Math.min(SIZE_ORDER.length - 1, Math.max(0, idx + offset))];
  return `${plateSkin}-${shifted}`;
};

/** Absolute (public) path to the reusable base-model plate image. */
export const getModelImage = (bodyType: BodyShape, skinTone: SkinTone, uiSize?: string): string =>
  `/images/models/${getModelId(bodyType, skinTone, uiSize)}.jpg`;

/** Resolve the full reusable model descriptor for the current selection. */
export const resolveModel = (bodyType: BodyShape, skinTone: SkinTone): StyleStudioModel => ({
  id: getModelId(bodyType, skinTone),
  bodyType,
  skinTone,
  image: getModelImage(bodyType, skinTone),
});

// Pre-computed catalog of every reusable model combination (female-only).
const BODY_SHAPES: BodyShape[] = ['slim', 'average', 'plus-size'];
const SKIN_TONES: SkinTone[] = ['Fair', 'Light', 'Medium', 'Tan', 'Honey', 'Deep'];

export const STYLE_STUDIO_MODELS: StyleStudioModel[] = BODY_SHAPES.flatMap(bodyType =>
  SKIN_TONES.map(skinTone => resolveModel(bodyType, skinTone))
);
