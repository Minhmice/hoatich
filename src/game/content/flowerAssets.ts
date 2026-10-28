export interface FlowerDirectionVariants {
 readonly left?: string;
 readonly right?: string;
 readonly down?: string;
 readonly bud?: string;
}

export interface FlowerAssetEntry {
 readonly textureKey: string;
 readonly url: string;
 readonly variants?: FlowerDirectionVariants;
}

/**
 * Complete botanical sprite mapping for all 10 content flower IDs in `flowers.ts`.
 * Texture keys follow canonical format `flower-${id}`.
 */
export const flowerAssets: Record<string, FlowerAssetEntry> = {
 'hoa-cuc-trang': {
  textureKey: 'flower-hoa-cuc-trang',
  url: '/assets/generated/flowers/crops/white-daisy.png',
  variants: {
   left: '/assets/generated/flowers/variants/white-daisy-left.webp',
   right: '/assets/generated/flowers/variants/white-daisy-right.webp',
   down: '/assets/generated/flowers/variants/white-daisy-down.webp',
  },
 },
 'hoa-hong-do': {
  textureKey: 'flower-hoa-hong-do',
  url: '/assets/generated/flowers/crops/rose.png',
  variants: {
   left: '/assets/generated/flowers/variants/rose-left.webp',
   right: '/assets/generated/flowers/variants/rose-right.webp',
   down: '/assets/generated/flowers/variants/rose-down.webp',
   bud: '/assets/generated/flowers/variants/rose-bud.webp',
  },
 },
 'hoa-huong-duong': {
  textureKey: 'flower-hoa-huong-duong',
  url: '/assets/generated/flowers/crops/sunflower.png',
  variants: {
   left: '/assets/generated/flowers/variants/sunflower-left.webp',
   right: '/assets/generated/flowers/variants/sunflower-right.webp',
   down: '/assets/generated/flowers/variants/sunflower-down.webp',
   bud: '/assets/generated/flowers/variants/sunflower-bud.webp',
  },
 },
 'hoa-sen-hong': {
  textureKey: 'flower-hoa-sen-hong',
  url: '/assets/generated/flowers/crops/lotus.png',
  variants: {
   left: '/assets/generated/flowers/variants/lotus-left.webp',
   right: '/assets/generated/flowers/variants/lotus-right.webp',
   down: '/assets/generated/flowers/variants/lotus-down.webp',
   bud: '/assets/generated/flowers/variants/lotus-bud.webp',
  },
 },
 'hoa-thuy-tien': {
  textureKey: 'flower-hoa-thuy-tien',
  url: '/assets/generated/flowers/crops/thuy-tien.png',
  variants: {
   left: '/assets/generated/flowers/variants/thuy-tien-left.webp',
   right: '/assets/generated/flowers/variants/thuy-tien-right.webp',
   down: '/assets/generated/flowers/variants/thuy-tien-down.webp',
  },
 },
 'hoa-luu-ly': {
  textureKey: 'flower-hoa-luu-ly',
  url: '/assets/generated/flowers/crops/luu-ly.png',
  variants: {
   left: '/assets/generated/flowers/variants/luu-ly-left.webp',
   right: '/assets/generated/flowers/variants/luu-ly-right.webp',
   down: '/assets/generated/flowers/variants/luu-ly-down.webp',
  },
 },
 'hoa-cam-chuong-hong': {
  textureKey: 'flower-hoa-cam-chuong-hong',
  url: '/assets/generated/flowers/crops/carnation.png',
  variants: {
   left: '/assets/generated/flowers/variants/carnation-left.webp',
   right: '/assets/generated/flowers/variants/carnation-right.webp',
   down: '/assets/generated/flowers/variants/carnation-down.webp',
  },
 },
 'hoa-oai-huong': {
  textureKey: 'flower-hoa-oai-huong',
  url: '/assets/generated/flowers/crops/lavender.png',
  variants: {
   left: '/assets/generated/flowers/variants/lavender-left.webp',
   right: '/assets/generated/flowers/variants/lavender-right.webp',
   down: '/assets/generated/flowers/variants/lavender-down.webp',
  },
 },
 'hoa-hoang-tuyen': {
  textureKey: 'flower-hoa-hoang-tuyen',
  url: '/assets/generated/flowers/crops/hoang-tuyen.png',
  variants: {
   left: '/assets/generated/flowers/variants/hoang-tuyen-left.webp',
   right: '/assets/generated/flowers/variants/hoang-tuyen-right.webp',
   down: '/assets/generated/flowers/variants/hoang-tuyen-down.webp',
  },
 },
 'hoa-da-ngan': {
  textureKey: 'flower-hoa-da-ngan',
  url: '/assets/generated/flowers/crops/da-ngan.png',
  variants: {
   left: '/assets/generated/flowers/variants/da-ngan-left.webp',
   right: '/assets/generated/flowers/variants/da-ngan-right.webp',
   down: '/assets/generated/flowers/variants/da-ngan-down.webp',
  },
 },
};
