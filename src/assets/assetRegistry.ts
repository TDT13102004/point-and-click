export type AssetId =
  | 'BG-1305'
  | 'BG-CORRIDOR'
  | 'BG-STATION'
  | 'CL-HATCH-CLOSED'
  | 'CL-HATCH-OPEN'
  | 'CL-HATCH-EMPTY'
  | 'PROP-RED-BOOK'
  | 'OV-SHADOW'
  | 'OV-VIGNETTE'
  | 'OV-CCTV'
  | 'ICON-FOLDER'
  | 'ICON-RECORDER'
  | 'ICON-NOTES'
  | 'ICON-BOOK'
  | 'AMB-ROOM'
  | 'SFX-KNOCK'
  | 'SFX-CREAK'
  | 'SFX-PAPER'
  | 'SFX-CLICK';

export interface AssetEntry {
  id: AssetId;
  path: string;
  type: 'png' | 'svg' | 'wav';
  dimensions?: [number, number];
}

const ASSET_BASE = './assets/demo-v1/';
const ORIGINAL_DOCS_BASE = './assets/original-documents/';

export function getOriginalDocImagePath(docNumber: number): string {
  const padded = String(docNumber).padStart(2, '0');
  return `${ORIGINAL_DOCS_BASE}${padded}.png`;
}

export const ASSET_MANIFEST: Record<AssetId, AssetEntry> = {
  'BG-1305': {
    id: 'BG-1305',
    path: 'backgrounds/bg-1305-v1.png',
    type: 'png',
    dimensions: [1672, 941],
  },
  'BG-CORRIDOR': {
    id: 'BG-CORRIDOR',
    path: 'backgrounds/bg-corridor-v1.png',
    type: 'png',
    dimensions: [1672, 941],
  },
  'BG-STATION': {
    id: 'BG-STATION',
    path: 'backgrounds/bg-station-v1.png',
    type: 'png',
    dimensions: [1672, 941],
  },
  'CL-HATCH-CLOSED': {
    id: 'CL-HATCH-CLOSED',
    path: 'closeups/cl-hatch-closed-v1.png',
    type: 'png',
    dimensions: [1672, 941],
  },
  'CL-HATCH-OPEN': {
    id: 'CL-HATCH-OPEN',
    path: 'closeups/cl-hatch-open-v1.png',
    type: 'png',
    dimensions: [1672, 941],
  },
  'CL-HATCH-EMPTY': {
    id: 'CL-HATCH-EMPTY',
    path: 'closeups/cl-hatch-empty-v1.png',
    type: 'png',
    dimensions: [1672, 941],
  },
  'PROP-RED-BOOK': {
    id: 'PROP-RED-BOOK',
    path: 'props/prop-red-book-v1.png',
    type: 'png',
    dimensions: [1254, 1254],
  },
  'OV-SHADOW': {
    id: 'OV-SHADOW',
    path: 'overlays/ov-shadow-v1.svg',
    type: 'svg',
    dimensions: [1600, 900],
  },
  'OV-VIGNETTE': {
    id: 'OV-VIGNETTE',
    path: 'overlays/ov-vignette-v1.svg',
    type: 'svg',
    dimensions: [1600, 900],
  },
  'OV-CCTV': {
    id: 'OV-CCTV',
    path: 'overlays/ov-cctv-v1.svg',
    type: 'svg',
    dimensions: [1600, 900],
  },
  'ICON-FOLDER': {
    id: 'ICON-FOLDER',
    path: 'icons/icon-folder-v1.svg',
    type: 'svg',
    dimensions: [96, 96],
  },
  'ICON-RECORDER': {
    id: 'ICON-RECORDER',
    path: 'icons/icon-recorder-v1.svg',
    type: 'svg',
    dimensions: [96, 96],
  },
  'ICON-NOTES': {
    id: 'ICON-NOTES',
    path: 'icons/icon-notes-v1.svg',
    type: 'svg',
    dimensions: [96, 96],
  },
  'ICON-BOOK': {
    id: 'ICON-BOOK',
    path: 'icons/icon-book-v1.svg',
    type: 'svg',
    dimensions: [96, 96],
  },
  'AMB-ROOM': {
    id: 'AMB-ROOM',
    path: 'audio/amb-room-tone-v1.wav',
    type: 'wav',
  },
  'SFX-KNOCK': {
    id: 'SFX-KNOCK',
    path: 'audio/sfx-three-knocks-v1.wav',
    type: 'wav',
  },
  'SFX-CREAK': {
    id: 'SFX-CREAK',
    path: 'audio/sfx-door-creak-v1.wav',
    type: 'wav',
  },
  'SFX-PAPER': {
    id: 'SFX-PAPER',
    path: 'audio/sfx-paper-v1.wav',
    type: 'wav',
  },
  'SFX-CLICK': {
    id: 'SFX-CLICK',
    path: 'audio/sfx-ui-click-v1.wav',
    type: 'wav',
  },
};

export function getAssetPath(id: AssetId): string {
  return `${ASSET_BASE}${ASSET_MANIFEST[id].path}`;
}

export type NormalizedRect = [number, number, number, number]; // [x, y, width, height]

export interface SceneHotspot {
  id: string;
  label: string;
  rect: NormalizedRect;
  action: string;
  target?: AssetId;
  tagPosition?: 'top' | 'bottom';
}

export const INTEGRATION_CONFIG = {
  aspectRatio: 1672 / 941,
  scenes: {
    station: {
      base: 'BG-STATION' as AssetId,
      shadow_box: [0.10, 0.18, 0.12, 0.38] as NormalizedRect,
      hotspots: [
        {
          id: 'stairs_up',
          label: 'Lên hành lang tầng 13',
          rect: [0.01, 0.08, 0.25, 0.86] as NormalizedRect,
          action: 'go-corridor',
        },
        {
          id: 'garage_window',
          label: 'Cửa sổ xuống nhà để xe',
          rect: [0.275, 0.11, 0.20, 0.36] as NormalizedRect,
          action: 'puzzle-garage',
        },
        {
          id: 'laptop_files',
          label: 'Laptop — Hồ sơ vụ án',
          rect: [0.68, 0.45, 0.17, 0.21] as NormalizedRect,
          action: 'open-dossier',
        },
        {
          id: 'desk_tools',
          label: 'Bộ đồ nghề điều tra',
          rect: [0.86, 0.51, 0.12, 0.20] as NormalizedRect,
          action: 'open-tools',
        },
      ] as SceneHotspot[],
    },
    corridor: {
      base: 'BG-CORRIDOR' as AssetId,
      shadow_box: [0.395, 0.42, 0.055, 0.28] as NormalizedRect,
      doorPlates: [
        { room: '1307', rect: [0.875, 0.075, 0.052, 0.042] as NormalizedRect },
        { room: '1305', rect: [0.650, 0.228, 0.042, 0.036] as NormalizedRect },
        { room: '1313', rect: [0.460, 0.31, 0.038, 0.03] as NormalizedRect },
      ],
      hotspots: [
        {
          id: 'stairs_down',
          label: 'Xuống chiếu nghỉ tầng 12',
          rect: [0.27, 0.39, 0.055, 0.22] as NormalizedRect,
          action: 'go-station',
          tagPosition: 'top',
        },
        {
          id: 'sheetrock_pile',
          label: 'Vách thạch cao tháo dỡ',
          rect: [0.335, 0.50, 0.055, 0.14] as NormalizedRect,
          action: 'collect-scratches',
          tagPosition: 'bottom',
        },
        {
          id: 'shadow_figure',
          label: 'Bóng người trên hành lang',
          rect: [0.395, 0.35, 0.05, 0.36] as NormalizedRect,
          action: 'puzzle-who',
          tagPosition: 'top',
        },
        {
          id: 'door1313',
          label: 'Cửa phòng 1313',
          rect: [0.452, 0.35, 0.052, 0.37] as NormalizedRect,
          action: 'door-1313',
          tagPosition: 'bottom',
        },
        {
          id: 'graffiti_wall',
          label: 'Mảng tường có chữ vẽ',
          rect: [0.515, 0.52, 0.08, 0.22] as NormalizedRect,
          action: 'collect-graffiti',
          tagPosition: 'top',
        },
        {
          id: 'door1305',
          label: 'Cửa phòng 1305',
          rect: [0.615, 0.24, 0.10, 0.63] as NormalizedRect,
          action: 'door-1305',
          tagPosition: 'bottom',
        },
        {
          id: 'door1307',
          label: 'Cửa phòng 1307',
          rect: [0.815, 0.12, 0.15, 0.78] as NormalizedRect,
          action: 'inspect-1307',
          tagPosition: 'bottom',
        },
      ] as SceneHotspot[],
    },
    room1305: {
      base: 'BG-1305' as AssetId,
      shadow_box: [0.76, 0.32, 0.13, 0.48] as NormalizedRect,
      hotspots: [
        {
          id: 'window',
          label: 'Cửa sổ song sắt',
          rect: [0.16, 0.18, 0.20, 0.56] as NormalizedRect,
          action: 'inspect',
        },
        {
          id: 'table',
          label: 'Bàn gỗ nhỏ',
          rect: [0.43, 0.74, 0.15, 0.22] as NormalizedRect,
          action: 'inspect',
        },
        {
          id: 'hatch',
          label: 'Ô kỹ thuật trên vách',
          rect: [0.62, 0.41, 0.09, 0.17] as NormalizedRect,
          action: 'open-closeup',
          target: 'CL-HATCH-CLOSED' as AssetId,
        },
        {
          id: 'bedroom',
          label: 'Cửa phòng ngủ',
          rect: [0.76, 0.26, 0.16, 0.59] as NormalizedRect,
          action: 'inspect',
        },
      ] as SceneHotspot[],
    },
  },
  hatchSequence: ['CL-HATCH-CLOSED', 'CL-HATCH-OPEN', 'CL-HATCH-EMPTY'] as AssetId[],
  audio: {
    autoplay: false,
    defaultVolume: 0.35,
    knockVisualCuesSeconds: [0.35, 0.9, 1.45],
  },
};
