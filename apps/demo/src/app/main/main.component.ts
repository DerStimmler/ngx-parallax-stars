import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  defaultStarLayers,
  NgxParallaxStarsComponent,
  StarLayer,
} from 'ngx-parallax-stars';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfigComponent } from '../config/config.component';
import { ConfigForm } from '../config/config-form';

@Component({
  selector: 'ngx-parallax-stars-main',
  standalone: true,
  imports: [
    CommonModule,
    NgxParallaxStarsComponent,
    MatButtonModule,
    MatIconModule,
    ConfigComponent,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  repoUrl = 'https://github.com/DerStimmler/ngx-parallax-stars';
  isConfigOpen = false;
  layers: StarLayer[] = defaultStarLayers;
  responsive = true;

  toggleConfig() {
    this.isConfigOpen = !this.isConfigOpen;
  }

  updateComponent(config: ConfigForm) {
    this.layers = config.layers;
    this.responsive = config.responsive;
  }
}
