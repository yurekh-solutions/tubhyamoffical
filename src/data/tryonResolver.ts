/**
 * Try-on image resolver for the Tubhyam Style Studio.
 *
 * Returns the mannequin plate URL for the selected size + skin tone.
 * The plate is a faceless model in a black bodysuit from
 * public/images/models/{plateSkin}-{size}.jpg.
 *
 * Main try-on photos resolve as a SIZE + TONE aware candidate chain:
 *   1. VTON composite  /images/tryon/{productId}__{modelId}.jpg
 *      (produced by the offline Colab batch — one per product x plate)
 *   2. Pre-generated per-body variant photo (tryOnBodyVariants)
 *   3. Flat catalog photo (product.image)
 *
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

/**
 * Ordered try-on photo candidates for the current size + skin tone selection.
 * The first entry is the per-size/per-tone VTON composite; the viewer walks
 * down the chain on load errors so missing composites degrade gracefully.
 */
export const getTryOnImageCandidates = (
  product: Product,
  bodyType: BodyShape,
  skinTone: SkinTone,
  uiSize?: string
): string[] => {
  const modelId = getModelId(bodyType, skinTone, uiSize);
  const candidates: string[] = [];

  // 1. Size+tone-wise VTON composite (Colab batch output)
  candidates.push(`/images/tryon/${product.id}__${modelId}.jpg`);

  // 2. Pre-generated model-wearing-product photo for the body shape
  const variant = product.tryOnBodyVariants?.find(v => v.bodyType === bodyType);
  if (variant?.images?.[0]) candidates.push(variant.images[0]);

  // 3. Flat catalog photo as the final fallback
  if (product.image) candidates.push(product.image);

  return [...new Set(candidates)];
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
