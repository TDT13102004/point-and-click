import { AssetId, getAssetPath, INTEGRATION_CONFIG } from '../assets/assetRegistry';

export type SoundSettings = {
  muted: boolean;
  volume: number;
};

class SoundManager {
  private audioMap: Partial<Record<AssetId, HTMLAudioElement>> = {};
  private ambientAudio: HTMLAudioElement | null = null;
  private settings: SoundSettings = { muted: false, volume: INTEGRATION_CONFIG.audio.defaultVolume };
  private userUnlocked = false;
  private knockTimers: number[] = [];

  public updateSettings(next: SoundSettings) {
    this.settings = next;
    const effectiveVol = next.muted ? 0 : Math.max(0, Math.min(1, next.volume));
    if (this.ambientAudio) {
      this.ambientAudio.volume = effectiveVol * 0.35;
    }
    Object.values(this.audioMap).forEach((el) => {
      if (el) el.volume = effectiveVol;
    });
  }

  public unlockAndStartAmbience() {
    this.userUnlocked = true;
    if (!this.ambientAudio) {
      const amb = new Audio(getAssetPath('AMB-ROOM'));
      amb.loop = true;
      amb.volume = this.settings.muted ? 0 : this.settings.volume * 0.35;
      this.ambientAudio = amb;
    }
    if (!this.settings.muted && this.ambientAudio.paused) {
      this.ambientAudio.play().catch(() => {});
    }
  }

  public playSfx(id: AssetId) {
    if (!this.userUnlocked) {
      this.unlockAndStartAmbience();
    }
    if (this.settings.muted) return;

    let audio = this.audioMap[id];
    if (!audio) {
      audio = new Audio(getAssetPath(id));
      this.audioMap[id] = audio;
    }
    audio.currentTime = 0;
    audio.volume = this.settings.volume;
    audio.play().catch(() => {});
  }

  public playKnocksWithVisualCues(onCueIndex: (index: number) => void, onDone?: () => void) {
    this.clearKnockTimers();
    this.playSfx('SFX-KNOCK');

    const cues = INTEGRATION_CONFIG.audio.knockVisualCuesSeconds;
    cues.forEach((sec, idx) => {
      const t = window.setTimeout(() => {
        onCueIndex(idx + 1);
      }, sec * 1000);
      this.knockTimers.push(t);
    });

    const endTimer = window.setTimeout(() => {
      onDone?.();
    }, 2400);
    this.knockTimers.push(endTimer);
  }

  public clearKnockTimers() {
    this.knockTimers.forEach((t) => window.clearTimeout(t));
    this.knockTimers = [];
  }

  public stopAllPlayback() {
    this.clearKnockTimers();
  }
}

export const soundManager = new SoundManager();
