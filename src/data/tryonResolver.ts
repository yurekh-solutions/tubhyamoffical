/**
 * Try-on image resolver for the Tubhyam Style Studio.
 *
 * Returns the mannequin plate URL for the selected size + skin tone.
 * The plate is a faceless model in a black bodysuit from
 * public/images/models/{plateSkin}-{size}.jpg.
 *
 * The actual product photo comes from product.image (catalog).
 * No garment overlay, no cutout, no CSS compositing.
 */

import type { Product } from '@/data/products';
import { getModelId, getModelImage, type BodyShape, type SkinTone } from '@/data/styleStudioModels';

export interface TryOnAssets {
  plateUrl: string;
  modelId: string;
}

export const getTryOnAssets = (
  product: Product,
  bodyType: BodyShape,
  skinTone: SkinTone,
  uiSize?: string
): TryOnAssets => {
  const modelId = getModelId(bodyType, skinTone, uiSize);
  const plateUrl = getModelImage(bodyType, skinTone, uiSize);
  return { plateUrl, modelId };
};

/** Legacy: returns plate URL only (for backward compat). */
export const getTryOnCandidates = (
  product: Product,
  bodyType: BodyShape,
  skinTone: SkinTone,
  uiSize?: string
): string[] => {
  return [getModelImage(bodyType, skinTone, uiSize)];
};
