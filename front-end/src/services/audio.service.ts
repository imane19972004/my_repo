import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private audio = new Audio();
  private isPlaying = false;

  constructor() {
    const savedState = localStorage.getItem('music_enabled');
    this.isPlaying = savedState === 'true';
    this.audio.src = 'assets/audio/relax.mp3';
    this.audio.loop = true;
    this.audio.volume = 0.3;

    if (this.isPlaying) {
      this.audio.play().catch(err => console.warn('Autoplay failed:', err));
    }
  }

  toggleAudio(): void {
    this.isPlaying = !this.isPlaying;
    localStorage.setItem('music_enabled', this.isPlaying.toString());
    this.isPlaying ? this.audio.play() : this.audio.pause();
  }

  getState(): boolean {
    return this.isPlaying;
  }

  setVolume(volume: number): void {
    this.audio.volume = volume;
  }
}
