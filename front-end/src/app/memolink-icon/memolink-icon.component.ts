import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'memolink-icon',
  template: '',
  standalone: true,
  // Pas besoin de template HTML ici
  styleUrls: [''] // Optionnel, si tu as des styles pour ce composant
})
export class MemolinkIconComponent implements OnInit {

    constructor(private renderer: Renderer2) {}

    ngOnInit(): void {
        const link: HTMLLinkElement = this.renderer.createElement('link');
        link.rel = 'icon';
        link.type = 'image/x-icon';
        link.href = 'assets/icon.ico'; // Chemin vers ton icône

        this.renderer.appendChild(document.head, link);
    }
}
