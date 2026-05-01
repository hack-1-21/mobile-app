export type SoundPoint = {
  id: number;
  db: number;
  hz: number;
  latitude: number;
  longitude: number;
  created_at: string;
};

// 渋谷・新宿・原宿エリアのダミー音データ
export const DUMMY_SOUND_DATA: SoundPoint[] = [
  // 渋谷駅周辺（騒音大）
  { id: 1,  db: 88, hz: 800,  latitude: 35.658,  longitude: 139.7016, created_at: "2026-05-01T09:00:00Z" },
  { id: 2,  db: 85, hz: 750,  latitude: 35.6585, longitude: 139.7022, created_at: "2026-05-01T09:01:00Z" },
  { id: 3,  db: 83, hz: 700,  latitude: 35.6575, longitude: 139.7009, created_at: "2026-05-01T09:02:00Z" },
  { id: 4,  db: 80, hz: 680,  latitude: 35.659,  longitude: 139.703,  created_at: "2026-05-01T09:03:00Z" },
  { id: 5,  db: 78, hz: 650,  latitude: 35.657,  longitude: 139.7,    created_at: "2026-05-01T09:04:00Z" },
  // センター街・道玄坂
  { id: 6,  db: 86, hz: 900,  latitude: 35.6597, longitude: 139.7002, created_at: "2026-05-01T09:05:00Z" },
  { id: 7,  db: 82, hz: 850,  latitude: 35.6592, longitude: 139.6995, created_at: "2026-05-01T09:06:00Z" },
  { id: 8,  db: 76, hz: 600,  latitude: 35.6583, longitude: 139.698,  created_at: "2026-05-01T09:07:00Z" },
  { id: 9,  db: 72, hz: 550,  latitude: 35.6573, longitude: 139.6968, created_at: "2026-05-01T09:08:00Z" },
  // 原宿・表参道
  { id: 10, db: 70, hz: 500,  latitude: 35.6702, longitude: 139.7027, created_at: "2026-05-01T09:09:00Z" },
  { id: 11, db: 68, hz: 480,  latitude: 35.671,  longitude: 139.7035, created_at: "2026-05-01T09:10:00Z" },
  { id: 12, db: 74, hz: 560,  latitude: 35.6688, longitude: 139.7012, created_at: "2026-05-01T09:11:00Z" },
  { id: 13, db: 71, hz: 520,  latitude: 35.6673, longitude: 139.6998, created_at: "2026-05-01T09:12:00Z" },
  // 竹下通り
  { id: 14, db: 84, hz: 720,  latitude: 35.672,  longitude: 139.7068, created_at: "2026-05-01T09:13:00Z" },
  { id: 15, db: 81, hz: 690,  latitude: 35.671,  longitude: 139.7052, created_at: "2026-05-01T09:14:00Z" },
  // 新宿駅
  { id: 16, db: 91, hz: 950,  latitude: 35.6896, longitude: 139.7006, created_at: "2026-05-01T09:15:00Z" },
  { id: 17, db: 89, hz: 920,  latitude: 35.6902, longitude: 139.7012, created_at: "2026-05-01T09:16:00Z" },
  { id: 18, db: 87, hz: 880,  latitude: 35.689,  longitude: 139.6998, created_at: "2026-05-01T09:17:00Z" },
  { id: 19, db: 84, hz: 830,  latitude: 35.6908, longitude: 139.7018, created_at: "2026-05-01T09:18:00Z" },
  // 歌舞伎町
  { id: 20, db: 90, hz: 1000, latitude: 35.694,  longitude: 139.7038, created_at: "2026-05-01T09:19:00Z" },
  { id: 21, db: 88, hz: 980,  latitude: 35.6948, longitude: 139.7045, created_at: "2026-05-01T09:20:00Z" },
  { id: 22, db: 85, hz: 870,  latitude: 35.6932, longitude: 139.703,  created_at: "2026-05-01T09:21:00Z" },
  { id: 23, db: 83, hz: 840,  latitude: 35.6956, longitude: 139.7052, created_at: "2026-05-01T09:22:00Z" },
  // 新宿西口・オフィス街
  { id: 24, db: 58, hz: 300,  latitude: 35.688,  longitude: 139.695,  created_at: "2026-05-01T09:23:00Z" },
  { id: 25, db: 55, hz: 280,  latitude: 35.6888, longitude: 139.6942, created_at: "2026-05-01T09:24:00Z" },
  { id: 26, db: 61, hz: 320,  latitude: 35.6872, longitude: 139.6958, created_at: "2026-05-01T09:25:00Z" },
  { id: 27, db: 52, hz: 260,  latitude: 35.6896, longitude: 139.6935, created_at: "2026-05-01T09:26:00Z" },
  // 代々木公園
  { id: 28, db: 44, hz: 200,  latitude: 35.6718, longitude: 139.6948, created_at: "2026-05-01T09:27:00Z" },
  { id: 29, db: 42, hz: 180,  latitude: 35.673,  longitude: 139.6938, created_at: "2026-05-01T09:28:00Z" },
  { id: 30, db: 40, hz: 160,  latitude: 35.6742, longitude: 139.6928, created_at: "2026-05-01T09:29:00Z" },
  { id: 31, db: 45, hz: 210,  latitude: 35.676,  longitude: 139.6908, created_at: "2026-05-01T09:30:00Z" },
  // 明治神宮
  { id: 32, db: 36, hz: 120,  latitude: 35.6763, longitude: 139.6993, created_at: "2026-05-01T09:31:00Z" },
  { id: 33, db: 34, hz: 100,  latitude: 35.6775, longitude: 139.698,  created_at: "2026-05-01T09:32:00Z" },
  { id: 34, db: 33, hz: 90,   latitude: 35.6788, longitude: 139.6968, created_at: "2026-05-01T09:33:00Z" },
  { id: 35, db: 35, hz: 110,  latitude: 35.68,   longitude: 139.6955, created_at: "2026-05-01T09:34:00Z" },
  // 恵比寿
  { id: 36, db: 66, hz: 440,  latitude: 35.6467, longitude: 139.7101, created_at: "2026-05-01T09:35:00Z" },
  { id: 37, db: 64, hz: 420,  latitude: 35.6475, longitude: 139.711,  created_at: "2026-05-01T09:36:00Z" },
  { id: 38, db: 68, hz: 460,  latitude: 35.6483, longitude: 139.7118, created_at: "2026-05-01T09:37:00Z" },
  // 代官山
  { id: 39, db: 54, hz: 270,  latitude: 35.649,  longitude: 139.7028, created_at: "2026-05-01T09:38:00Z" },
  { id: 40, db: 52, hz: 250,  latitude: 35.6498, longitude: 139.7038, created_at: "2026-05-01T09:39:00Z" },
  { id: 41, db: 57, hz: 290,  latitude: 35.6474, longitude: 139.7008, created_at: "2026-05-01T09:40:00Z" },
  // 中目黒
  { id: 42, db: 63, hz: 390,  latitude: 35.644,  longitude: 139.6981, created_at: "2026-05-01T09:41:00Z" },
  { id: 43, db: 60, hz: 370,  latitude: 35.6448, longitude: 139.699,  created_at: "2026-05-01T09:42:00Z" },
  { id: 44, db: 65, hz: 410,  latitude: 35.6456, longitude: 139.6999, created_at: "2026-05-01T09:43:00Z" },
  // 六本木
  { id: 45, db: 82, hz: 710,  latitude: 35.6628, longitude: 139.731,  created_at: "2026-05-01T09:44:00Z" },
  { id: 46, db: 80, hz: 690,  latitude: 35.6636, longitude: 139.732,  created_at: "2026-05-01T09:45:00Z" },
  { id: 47, db: 85, hz: 740,  latitude: 35.662,  longitude: 139.73,   created_at: "2026-05-01T09:46:00Z" },
  { id: 48, db: 78, hz: 660,  latitude: 35.6644, longitude: 139.733,  created_at: "2026-05-01T09:47:00Z" },
  // 渋谷〜青山通り
  { id: 49, db: 73, hz: 540,  latitude: 35.6618, longitude: 139.7088, created_at: "2026-05-01T09:48:00Z" },
  { id: 50, db: 71, hz: 520,  latitude: 35.6638, longitude: 139.7112, created_at: "2026-05-01T09:49:00Z" },
  { id: 51, db: 69, hz: 500,  latitude: 35.6648, longitude: 139.7124, created_at: "2026-05-01T09:50:00Z" },
];
