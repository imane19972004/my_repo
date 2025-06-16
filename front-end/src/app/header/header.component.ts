import { Component, OnInit } from '@angular/core';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  musicOn = false;
  volume = 0.3;

  constructor(private audioService: AudioService) {}

  ngOnInit(): void {
    this.musicOn = this.audioService.getState();
  }

  toggleMusic(): void {
    this.audioService.toggleAudio();
    this.musicOn = this.audioService.getState();
  }

  changeVolume(event: any): void {
    this.volume = event.target.value;
    this.audioService.setVolume(this.volume);
  }
}
