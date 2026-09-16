/**
 * Try-on image resolver for the Tubhyam Style Studio.
 *
 * Returns the mannequin plate URL for the selected size + skin tone.
 * The plate is a faceless model in a black bodysuit; the product garment
 * will be added in a future phase.
 */

import type { Product } from '@/data/products';
import { getModelImage, type BodyShape, type SkinTone } from '@/data/styleStudioModels';

export const getTryOnCandidates = (
  product: Product,
  bodyType: BodyShape,
  skinTone: SkinTone,
  uiSize?: string
): string[] => {
  // Just return the mannequin plate for this size/skin combo
  return [getModelImage(bodyType, skinTone, uiSize)];
};
