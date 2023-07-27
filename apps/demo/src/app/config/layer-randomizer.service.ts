import { Injectable } from '@angular/core';
import { StarLayer } from 'ngx-parallax-stars';

@Injectable({ providedIn: 'root' })
export class LayerRandomizerService {
  generateRandomLayers(): StarLayer[] {
    const layerCount = this.generateRandomInteger(3, 4);

    const layers = [];

    for (let i = 1; i <= layerCount; i++) {
      layers.push(this.generateRandomLayer());
    }

    return layers;
  }

  private generateRandomLayer(): StarLayer {
    return {
      color: '#ffffff',
      blur: this.generateRandomInteger(0, 5),
      density: this.generateRandomInteger(1, 5),
      glow: this.generateRandomInteger(0, 5),
      size: this.generateRandomInteger(1, 6),
      speed: this.generateRandomInteger(5, 20),
      isRound: this.getRandomBoolean(),
      direction: this.getRandomItem(['up', 'down', 'left', 'right']),
    };
  }

  private generateRandomInteger(min: number, max: number) {
    return Math.floor(min + Math.random() * (max - min + 1));
  }

  private getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getRandomBoolean(): boolean {
    return Math.random() < 0.5;
  }
}
