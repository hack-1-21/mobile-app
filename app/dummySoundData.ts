export type SoundPoint = {
  latitude: number;
  longitude: number;
  weight: number;
};

// 東京都心部（渋谷・新宿・原宿・代々木周辺）のダミー音データ
export const DUMMY_SOUND_DATA: SoundPoint[] = [
  // 渋谷駅周辺（騒音大）
  { latitude: 35.6580, longitude: 139.7016, weight: 1.0 },
  { latitude: 35.6585, longitude: 139.7022, weight: 0.95 },
  { latitude: 35.6575, longitude: 139.7009, weight: 0.92 },
  { latitude: 35.6590, longitude: 139.7030, weight: 0.88 },
  { latitude: 35.6570, longitude: 139.7000, weight: 0.85 },
  { latitude: 35.6595, longitude: 139.7035, weight: 0.82 },
  { latitude: 35.6565, longitude: 139.6998, weight: 0.80 },
  { latitude: 35.6600, longitude: 139.7040, weight: 0.78 },

  // センター街・道玄坂
  { latitude: 35.6597, longitude: 139.7002, weight: 0.95 },
  { latitude: 35.6592, longitude: 139.6995, weight: 0.90 },
  { latitude: 35.6588, longitude: 139.6988, weight: 0.85 },
  { latitude: 35.6583, longitude: 139.6980, weight: 0.80 },
  { latitude: 35.6578, longitude: 139.6975, weight: 0.75 },
  { latitude: 35.6573, longitude: 139.6968, weight: 0.70 },

  // 原宿・表参道
  { latitude: 35.6702, longitude: 139.7027, weight: 0.75 },
  { latitude: 35.6710, longitude: 139.7035, weight: 0.70 },
  { latitude: 35.6718, longitude: 139.7042, weight: 0.65 },
  { latitude: 35.6725, longitude: 139.7050, weight: 0.68 },
  { latitude: 35.6695, longitude: 139.7020, weight: 0.72 },
  { latitude: 35.6688, longitude: 139.7012, weight: 0.78 },
  { latitude: 35.6680, longitude: 139.7005, weight: 0.80 },
  { latitude: 35.6673, longitude: 139.6998, weight: 0.76 },
  { latitude: 35.6665, longitude: 139.6990, weight: 0.72 },
  { latitude: 35.6658, longitude: 139.6982, weight: 0.68 },

  // 竹下通り
  { latitude: 35.6720, longitude: 139.7068, weight: 0.90 },
  { latitude: 35.6715, longitude: 139.7060, weight: 0.88 },
  { latitude: 35.6710, longitude: 139.7052, weight: 0.85 },
  { latitude: 35.6705, longitude: 139.7045, weight: 0.82 },

  // 新宿駅周辺
  { latitude: 35.6896, longitude: 139.7006, weight: 1.0 },
  { latitude: 35.6902, longitude: 139.7012, weight: 0.95 },
  { latitude: 35.6890, longitude: 139.6998, weight: 0.92 },
  { latitude: 35.6908, longitude: 139.7018, weight: 0.88 },
  { latitude: 35.6884, longitude: 139.6992, weight: 0.85 },
  { latitude: 35.6914, longitude: 139.7024, weight: 0.82 },

  // 歌舞伎町
  { latitude: 35.6940, longitude: 139.7038, weight: 0.95 },
  { latitude: 35.6948, longitude: 139.7045, weight: 0.90 },
  { latitude: 35.6932, longitude: 139.7030, weight: 0.88 },
  { latitude: 35.6956, longitude: 139.7052, weight: 0.85 },
  { latitude: 35.6924, longitude: 139.7022, weight: 0.82 },
  { latitude: 35.6964, longitude: 139.7058, weight: 0.78 },

  // 新宿西口・オフィス街（比較的静か）
  { latitude: 35.6880, longitude: 139.6950, weight: 0.45 },
  { latitude: 35.6888, longitude: 139.6942, weight: 0.40 },
  { latitude: 35.6872, longitude: 139.6958, weight: 0.50 },
  { latitude: 35.6896, longitude: 139.6935, weight: 0.35 },
  { latitude: 35.6864, longitude: 139.6966, weight: 0.55 },

  // 代々木公園周辺（静か）
  { latitude: 35.6718, longitude: 139.6948, weight: 0.20 },
  { latitude: 35.6730, longitude: 139.6938, weight: 0.18 },
  { latitude: 35.6742, longitude: 139.6928, weight: 0.15 },
  { latitude: 35.6754, longitude: 139.6918, weight: 0.22 },
  { latitude: 35.6706, longitude: 139.6958, weight: 0.25 },
  { latitude: 35.6694, longitude: 139.6968, weight: 0.28 },
  { latitude: 35.6760, longitude: 139.6908, weight: 0.12 },
  { latitude: 35.6772, longitude: 139.6898, weight: 0.10 },

  // 明治神宮（非常に静か）
  { latitude: 35.6763, longitude: 139.6993, weight: 0.08 },
  { latitude: 35.6775, longitude: 139.6980, weight: 0.06 },
  { latitude: 35.6788, longitude: 139.6968, weight: 0.05 },
  { latitude: 35.6800, longitude: 139.6955, weight: 0.07 },
  { latitude: 35.6750, longitude: 139.7005, weight: 0.10 },
  { latitude: 35.6738, longitude: 139.7018, weight: 0.12 },

  // 恵比寿周辺
  { latitude: 35.6467, longitude: 139.7101, weight: 0.60 },
  { latitude: 35.6475, longitude: 139.7110, weight: 0.58 },
  { latitude: 35.6459, longitude: 139.7092, weight: 0.62 },
  { latitude: 35.6483, longitude: 139.7118, weight: 0.55 },
  { latitude: 35.6451, longitude: 139.7083, weight: 0.65 },

  // 代官山（おしゃれで比較的静か）
  { latitude: 35.6490, longitude: 139.7028, weight: 0.38 },
  { latitude: 35.6498, longitude: 139.7038, weight: 0.35 },
  { latitude: 35.6482, longitude: 139.7018, weight: 0.42 },
  { latitude: 35.6506, longitude: 139.7048, weight: 0.32 },
  { latitude: 35.6474, longitude: 139.7008, weight: 0.45 },

  // 中目黒（川沿い・カフェ街）
  { latitude: 35.6440, longitude: 139.6981, weight: 0.52 },
  { latitude: 35.6448, longitude: 139.6990, weight: 0.48 },
  { latitude: 35.6432, longitude: 139.6972, weight: 0.55 },
  { latitude: 35.6456, longitude: 139.6999, weight: 0.45 },
  { latitude: 35.6424, longitude: 139.6963, weight: 0.58 },

  // 青山・骨董通り周辺
  { latitude: 35.6648, longitude: 139.7148, weight: 0.45 },
  { latitude: 35.6656, longitude: 139.7158, weight: 0.42 },
  { latitude: 35.6640, longitude: 139.7138, weight: 0.48 },
  { latitude: 35.6664, longitude: 139.7168, weight: 0.40 },
  { latitude: 35.6632, longitude: 139.7128, weight: 0.52 },

  // 六本木周辺（夜は騒がしい）
  { latitude: 35.6628, longitude: 139.7310, weight: 0.88 },
  { latitude: 35.6636, longitude: 139.7320, weight: 0.85 },
  { latitude: 35.6620, longitude: 139.7300, weight: 0.90 },
  { latitude: 35.6644, longitude: 139.7330, weight: 0.82 },
  { latitude: 35.6612, longitude: 139.7290, weight: 0.92 },
  { latitude: 35.6652, longitude: 139.7340, weight: 0.78 },

  // 麻布十番
  { latitude: 35.6557, longitude: 139.7370, weight: 0.62 },
  { latitude: 35.6565, longitude: 139.7380, weight: 0.58 },
  { latitude: 35.6549, longitude: 139.7360, weight: 0.65 },
  { latitude: 35.6573, longitude: 139.7390, weight: 0.55 },

  // 渋谷〜青山通り（幹線道路沿い）
  { latitude: 35.6618, longitude: 139.7088, weight: 0.72 },
  { latitude: 35.6628, longitude: 139.7100, weight: 0.70 },
  { latitude: 35.6638, longitude: 139.7112, weight: 0.68 },
  { latitude: 35.6648, longitude: 139.7124, weight: 0.65 },
  { latitude: 35.6608, longitude: 139.7076, weight: 0.74 },
  { latitude: 35.6598, longitude: 139.7064, weight: 0.76 },
  { latitude: 35.6588, longitude: 139.7052, weight: 0.78 },

  // 原宿〜新宿南口（甲州街道沿い）
  { latitude: 35.6820, longitude: 139.6980, weight: 0.80 },
  { latitude: 35.6830, longitude: 139.6990, weight: 0.78 },
  { latitude: 35.6840, longitude: 139.7000, weight: 0.75 },
  { latitude: 35.6850, longitude: 139.7010, weight: 0.72 },
  { latitude: 35.6860, longitude: 139.7020, weight: 0.70 },
  { latitude: 35.6870, longitude: 139.7030, weight: 0.68 },

  // 散発的な静かなスポット
  { latitude: 35.6550, longitude: 139.7150, weight: 0.30 },
  { latitude: 35.6820, longitude: 139.7100, weight: 0.25 },
  { latitude: 35.6700, longitude: 139.7200, weight: 0.35 },
  { latitude: 35.6750, longitude: 139.6900, weight: 0.20 },
  { latitude: 35.6500, longitude: 139.6950, weight: 0.28 },
  { latitude: 35.6900, longitude: 139.7150, weight: 0.32 },
  { latitude: 35.6450, longitude: 139.7200, weight: 0.40 },
  { latitude: 35.6850, longitude: 139.6850, weight: 0.18 },
];
