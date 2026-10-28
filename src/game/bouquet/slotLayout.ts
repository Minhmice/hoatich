export type VesselKind = 'bouquet' | 'vase' | 'jar';
export type FlowerPose = 'center' | 'left' | 'right' | 'down';

export interface BouquetSlot {
 readonly index: number;
 readonly position: { readonly x: number; readonly y: number };
 readonly rotation: number;
 readonly layer: number;
 readonly pose: FlowerPose;
}

const VALID_VESSELS: Record<VesselKind, true> = {
 bouquet: true,
 vase: true,
 jar: true,
};

/**
 * Returns row counts summing exactly to stemCount using largest-remainder distribution.
 */
function calculateRowCounts(stemCount: number): number[] {
 if (stemCount === 1) return [1];
 if (stemCount === 2) return [1, 1];
 if (stemCount === 3) return [1, 2];
 if (stemCount === 4) return [1, 2, 1];
 if (stemCount === 5) return [2, 1, 2];

 let numRows: number;
 let weights: number[];

 if (stemCount <= 7) {
  numRows = 3;
  weights = [0.25, 0.5, 0.25];
 } else if (stemCount <= 12) {
  numRows = 4;
  weights = [0.18, 0.32, 0.32, 0.18];
 } else if (stemCount <= 18) {
  numRows = 5;
  weights = [0.12, 0.24, 0.32, 0.2, 0.12];
 } else {
  numRows = 6;
  weights = [0.1, 0.18, 0.24, 0.24, 0.14, 0.1];
 }

 const raw = weights.map((w) => w * stemCount);
 const floors = raw.map((v) => Math.floor(v));
 let allocated = floors.reduce((sum, v) => sum + v, 0);
 const remainders = raw.map((v, i) => ({ index: i, rem: v - floors[i] }));
 remainders.sort((a, b) => b.rem - a.rem);

 let rIdx = 0;
 while (allocated < stemCount) {
  floors[remainders[rIdx % numRows].index] += 1;
  allocated += 1;
  rIdx += 1;
 }

 // Ensure no row is empty
 for (let i = 0; i < floors.length; i++) {
  if (floors[i] === 0) {
   let maxIdx = 0;
   for (let j = 1; j < floors.length; j++) {
    if (floors[j] > floors[maxIdx]) maxIdx = j;
   }
   if (floors[maxIdx] > 1) {
    floors[maxIdx] -= 1;
    floors[i] += 1;
   }
  }
 }

 return floors;
}

export function generateSlots(vessel: VesselKind, stemCount: number): readonly BouquetSlot[] {
 if (!VALID_VESSELS[vessel]) {
  throw new Error(`Invalid vessel: ${vessel}`);
 }
 if (!Number.isInteger(stemCount) || stemCount < 1 || stemCount > 24) {
  throw new Error(`Stem count must be an integer between 1 and 24, got: ${stemCount}`);
 }

 const centerX = 640;
 let centerY = 510;
 let spreadW = 280;
 let spreadH = 180;

 if (vessel === 'vase') {
  centerY = 500;
  spreadW = 220;
  spreadH = 190;
 } else if (vessel === 'jar') {
  centerY = 520;
  spreadW = 320;
  spreadH = 150;
 }

 const rowCounts = calculateRowCounts(stemCount);
 const numRows = rowCounts.length;
 const slots: BouquetSlot[] = [];
 let index = 0;

 for (let r = 0; r < numRows; r++) {
  const countInRow = rowCounts[r];
  const y = numRows === 1 ? centerY : centerY - spreadH / 2 + (r / (numRows - 1)) * spreadH;

  // Row width multiplier: middle rows wider, top/bottom rows slightly narrower
  const rowFrac = numRows === 1 ? 0.5 : r / (numRows - 1);
  const widthFactor = 0.65 + 0.35 * Math.sin(rowFrac * Math.PI);
  const rowW = spreadW * widthFactor;

  for (let c = 0; c < countInRow; c++) {
   const x = countInRow === 1 ? centerX : centerX - rowW / 2 + (c / (countInRow - 1)) * rowW;

   // Determine pose
   let pose: FlowerPose;
   const isBottomRow = r === numRows - 1 && numRows > 1;

   if (isBottomRow) {
    if (Math.abs(x - centerX) <= 40) {
     pose = 'down';
    } else if (x < centerX) {
     pose = 'left';
    } else {
     pose = 'right';
    }
   } else {
    if (x < centerX - 30) {
     pose = 'left';
    } else if (x > centerX + 30) {
     pose = 'right';
    } else {
     pose = 'center';
    }
   }

   // Natural rotation derived from position offset
   const xDiff = (x - centerX) / (spreadW / 2 || 1);
   const rotation = Math.round(xDiff * 20 * 10) / 10;

   slots.push(
    Object.freeze({
     index,
     position: Object.freeze({
      x: Math.round(x),
      y: Math.round(y),
     }),
     rotation,
     layer: r,
     pose,
    }),
   );

   index++;
  }
 }

 return Object.freeze(slots);
}
