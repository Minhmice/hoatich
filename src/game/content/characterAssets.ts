export type CharacterId = 'player' | 'passerby' | 'customer-one';

export interface CharacterVariant {
  readonly index: string;
  readonly url: string;
  readonly mood: string;
  readonly originalDir: string;
  readonly originalName: string;
  /** SHA-256 hash of original source file in DEMO_assets */
  readonly sha256: string;
}

export interface CharacterAssetEntry {
  readonly id: CharacterId;
  readonly defaultPortrait: string;
  readonly urls: string[];
  readonly variants: CharacterVariant[];
}

export const characterAssets: Record<CharacterId, CharacterAssetEntry> = {
  player: {
    id: 'player',
    defaultPortrait: '/assets/characters/player/02.webp',
    urls: [
      '/assets/characters/player/01.webp',
      '/assets/characters/player/02.webp',
      '/assets/characters/player/03.webp',
    ],
    variants: [
      {
        index: '01',
        url: '/assets/characters/player/01.webp',
        mood: 'worried',
        originalDir: "DEMO_assets/Player nữ",
        originalName: 'Main_F_01 demo.png',
        sha256: 'a9bf0d595d1e97decfd25a06ba5f3e3b7196f73908e4c781dfd57f080352e1bb',
      },
      {
        index: '02',
        url: '/assets/characters/player/02.webp',
        mood: 'neutral',
        originalDir: "DEMO_assets/Player nữ",
        originalName: 'Main_F_02 demo.png',
        sha256: '1417796fb4dd9a8ea4356380880cada320582e5f457e5ae80bd3e8256064a8d9',
      },
      {
        index: '03',
        url: '/assets/characters/player/03.webp',
        mood: 'happy',
        originalDir: "DEMO_assets/Player nữ",
        originalName: 'Main_F_03 demo.png',
        sha256: '3870745533ef4e1e1addbb958866527358ecc700bd6d70945e294aa7af1562e7',
      },
    ],
  },
  passerby: {
    id: 'passerby',
    defaultPortrait: '/assets/characters/passerby/02.webp',
    urls: [
      '/assets/characters/passerby/01.webp',
      '/assets/characters/passerby/02.webp',
    ],
    variants: [
      {
        index: '01',
        url: '/assets/characters/passerby/01.webp',
        mood: 'annoyed',
        originalDir: "DEMO_assets/Khách vãng lai",
        originalName: "KVL1.1 - bà cô khó tính.png",
        sha256: '6c977bc3e960fcae633865867f3cff0dfdc0bd1985460accd721e04c58b9f540',
      },
      {
        index: '02',
        url: '/assets/characters/passerby/02.webp',
        mood: 'neutral',
        originalDir: "DEMO_assets/Khách vãng lai",
        originalName: "KVL1.2 .png",
        sha256: '9a5b9dfa7f8219d38ac5c8e1a74d5022c2739c0fd8b0a1394da53ed9f1b022fc',
      },
    ],
  },
  'customer-one': {
    id: 'customer-one',
    defaultPortrait: '/assets/characters/customer-one/01.webp',
    urls: [
      '/assets/characters/customer-one/01.webp',
      '/assets/characters/customer-one/02.webp',
    ],
    variants: [
      {
        index: '01',
        url: '/assets/characters/customer-one/01.webp',
        mood: 'neutral',
        originalDir: "DEMO_assets/Khách 1",
        originalName: 'CT1_01 demo.png',
        sha256: '746a10c9cb5a96a579014246c781fefb2a28cb6644180aa4ccfb0d3179d259bd',
      },
      {
        index: '02',
        url: '/assets/characters/customer-one/02.webp',
        mood: 'happy',
        originalDir: "DEMO_assets/Khách 1",
        originalName: 'CT1_02 demo.png',
        sha256: '73b777b068402cfa5788374e128b294d391665a137af91a103d971a3bf17e864',
      },
    ],
  },
};
