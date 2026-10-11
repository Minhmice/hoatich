export interface FlowerAssetEntry {
  readonly textureKey: string;
  readonly url: string;
}

/**
 * Complete botanical sprite mapping for all 10 content flower IDs in `flowers.ts`.
 * Texture keys follow canonical format `flower-${id}`.
 */
export const flowerAssets: Record<string, FlowerAssetEntry> = {
  'hoa-cuc-trang': {
    textureKey: 'flower-hoa-cuc-trang',
    url: '/assets/generated/flowers/crops/white-daisy.png',
  },
  'hoa-hong-do': {
    textureKey: 'flower-hoa-hong-do',
    url: '/assets/generated/flowers/crops/rose.png',
  },
  'hoa-huong-duong': {
    textureKey: 'flower-hoa-huong-duong',
    url: '/assets/generated/flowers/crops/sunflower.png',
  },
  'hoa-sen-hong': {
    textureKey: 'flower-hoa-sen-hong',
    url: '/assets/generated/flowers/crops/lotus.png',
  },
  'hoa-thuy-tien': {
    textureKey: 'flower-hoa-thuy-tien',
    url: '/assets/generated/flowers/crops/thuy-tien.png',
  },
  'hoa-luu-ly': {
    textureKey: 'flower-hoa-luu-ly',
    url: '/assets/generated/flowers/crops/luu-ly.png',
  },
  'hoa-cam-chuong-hong': {
    textureKey: 'flower-hoa-cam-chuong-hong',
    url: '/assets/generated/flowers/crops/carnation.png',
  },
  'hoa-oai-huong': {
    textureKey: 'flower-hoa-oai-huong',
    url: '/assets/generated/flowers/crops/lavender.png',
  },
  'hoa-hoang-tuyen': {
    textureKey: 'flower-hoa-hoang-tuyen',
    url: '/assets/generated/flowers/crops/hoang-tuyen.png',
  },
  'hoa-da-ngan': {
    textureKey: 'flower-hoa-da-ngan',
    url: '/assets/generated/flowers/crops/da-ngan.png',
  },
};
