import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { defaultStarLayers, NgxParallaxStarsComponent, StarLayer } from 'ngx-parallax-stars';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfigComponent } from '../config/config.component';
import { ConfigForm } from '../config/config-form';
import { MouseHighlighterComponent } from '../mouse-highlighter/mouse-highlighter.component';

@Component({
  selector: 'ngx-parallax-stars-main',
  imports: [
    NgxParallaxStarsComponent,
    MatButtonModule,
    MatIconModule,
    ConfigComponent,
    NgOptimizedImage,
    MouseHighlighterComponent
],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  repoUrl = 'https://github.com/DerStimmler/ngx-parallax-stars';
  isConfigOpen = signal<boolean>(false);
  layers = signal<StarLayer[]>(defaultStarLayers);
  responsive = signal<boolean>(true);

  toggleConfig() {
    this.isConfigOpen.update((isOpen) => !isOpen);
  }

  updateComponent(config: ConfigForm) {
    this.layers.set(config.layers);
    this.responsive.set(config.responsive);
  }
}
