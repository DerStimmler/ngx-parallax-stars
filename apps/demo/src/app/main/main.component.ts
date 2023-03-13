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
  isConfigOpen = false;
  layers: StarLayer[] = defaultStarLayers;

  toggleConfig() {
    this.isConfigOpen = !this.isConfigOpen;
  }

  updateLayers(layers: StarLayer[]) {
    this.layers = layers;
  }
}
