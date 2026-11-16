import { QuestionId } from '../data/puzzleConfig';

export type SceneView = 'station' | 'corridor' | 'room1305';
export type HatchState = 'closed' | 'open' | 'empty';

export interface GameSettings {
  muted: boolean;
  showHotspots: boolean;
}

export interface GameState {
  schemaVersion: 4;
  hasStarted: boolean;
  currentView: SceneView;
  activeDocId: string | null;
  unlockedDocs: string[];
  viewedDocs: string[];
  solvedQuestions: QuestionId[];
  room1305Unlocked: boolean;
  inspectedRoomHotspots: string[];
  hatchCloseupOpen: boolean;
  hatchState: HatchState;
  hasRedBook: boolean;
  bookModalOpen: boolean;
  hauntingTriggered: boolean;
  doorwayShadowInspected: boolean;
  demoCompleted: boolean;
  endingModalOpen: boolean;
  settings: GameSettings;
}

export const STORAGE_KEY = 'an_linh_demo_v4_state';
const LEGACY_KEYS = [
  'an_linh_demo_v1_state',
  'an_linh_demo_v2_state',
  'an_linh_demo_v3_state',
];

export const INITIAL_UNLOCKED_DOCS = [
  'DOC-01',
  'DOC-02',
  'DOC-03',
  'DOC-06',
  'DOC-09',
  'DOC-10',
];

export const INITIAL_GAME_STATE: GameState = {
  schemaVersion: 4,
  hasStarted: false,
  currentView: 'station',
  activeDocId: null,
  unlockedDocs: [...INITIAL_UNLOCKED_DOCS],
  viewedDocs: [],
  solvedQuestions: [],
  room1305Unlocked: false,
  inspectedRoomHotspots: [],
  hatchCloseupOpen: false,
  hatchState: 'closed',
  hasRedBook: false,
  bookModalOpen: false,
  hauntingTriggered: false,
  doorwayShadowInspected: false,
  demoCompleted: false,
  endingModalOpen: false,
  settings: {
    muted: false,
    showHotspots: false,
  },
};

const VALID_QUESTIONS: QuestionId[] = ['Q-READ', 'Q-WHO', 'Q-GARAGE', 'Q-WHAT', 'Q-CLEANSE'];

function sanitizeState(raw: unknown): GameState {
  if (!raw || typeof raw !== 'object') return INITIAL_GAME_STATE;
  const obj = raw as Partial<GameState>;
  if (obj.schemaVersion !== 4) return INITIAL_GAME_STATE;

  const solvedQuestions = Array.isArray(obj.solvedQuestions)
    ? obj.solvedQuestions.filter((q): q is QuestionId => VALID_QUESTIONS.includes(q))
    : [];

  const room1305Unlocked = solvedQuestions.includes('Q-READ');
  const rawHatch: HatchState =
    obj.hatchState === 'open' || obj.hatchState === 'empty' ? obj.hatchState : 'closed';
  const hasRedBook = room1305Unlocked && (Boolean(obj.hasRedBook) || rawHatch === 'empty');
  const hatchState: HatchState = hasRedBook ? 'empty' : rawHatch;

  const unlockedSet = new Set<string>(INITIAL_UNLOCKED_DOCS);
  if (Array.isArray(obj.unlockedDocs)) {
    if (obj.unlockedDocs.includes('DOC-07')) unlockedSet.add('DOC-07');
    if (obj.unlockedDocs.includes('DOC-08')) unlockedSet.add('DOC-08');
  }
  if (solvedQuestions.includes('Q-WHO')) unlockedSet.add('DOC-12');
  if (room1305Unlocked && hasRedBook) unlockedSet.add('DOC-13');
  if (solvedQuestions.includes('Q-GARAGE') && unlockedSet.has('DOC-13')) unlockedSet.add('DOC-14');
  if (
    solvedQuestions.includes('Q-WHAT') &&
    unlockedSet.has('DOC-12') &&
    unlockedSet.has('DOC-14')
  ) {
    unlockedSet.add('DOC-15');
  }
  if (solvedQuestions.includes('Q-CLEANSE') && unlockedSet.has('DOC-15')) {
    unlockedSet.add('DOC-16');
  }
  const unlockedDocs = Array.from(unlockedSet);

  const validViews: SceneView[] = ['station', 'corridor', 'room1305'];
  let currentView: SceneView = validViews.includes(obj.currentView as SceneView)
    ? (obj.currentView as SceneView)
    : 'station';
  if (currentView === 'room1305' && !room1305Unlocked) {
    currentView = 'corridor';
  }

  const demoCompleted =
    solvedQuestions.includes('Q-CLEANSE') && unlockedDocs.includes('DOC-16');

  return {
    ...INITIAL_GAME_STATE,
    ...obj,
    schemaVersion: 4,
    currentView,
    activeDocId: null,
    unlockedDocs,
    viewedDocs: Array.isArray(obj.viewedDocs)
      ? obj.viewedDocs.filter((d) => unlockedDocs.includes(d))
      : [],
    solvedQuestions,
    room1305Unlocked,
    hatchState,
    hasRedBook,
    hauntingTriggered: hasRedBook,
    inspectedRoomHotspots: Array.isArray(obj.inspectedRoomHotspots)
      ? obj.inspectedRoomHotspots
      : [],
    demoCompleted,
    bookModalOpen: false,
    endingModalOpen: false,
    settings: {
      muted: Boolean(obj.settings?.muted),
      showHotspots: Boolean(obj.settings?.showHotspots),
    },
  };
}

export function loadSavedState(): { state: GameState; hasSave: boolean } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const sanitized = sanitizeState(JSON.parse(raw));
      return { state: sanitized, hasSave: sanitized.hasStarted };
    }
    LEGACY_KEYS.forEach((k) => window.localStorage.removeItem(k));
    return { state: INITIAL_GAME_STATE, hasSave: false };
  } catch {
    return { state: INITIAL_GAME_STATE, hasSave: false };
  }
}

export function saveGameState(state: GameState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

export function clearSavedState(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    LEGACY_KEYS.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // Ignore storage errors
  }
}
