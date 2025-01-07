import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  Renderer2,
  signal,
} from '@angular/core';

import { defaultStarLayers, StarLayer } from '../star-layer';
import { randomInt, resizeObservable } from '../utils';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ngx-parallax-stars',
  imports: [],
  template: '',
  styles: [':host { display: block; overflow: hidden; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxParallaxStarsComponent {
  /**
   * Overrides default star layers
   */
  layers = input<StarLayer[]>(defaultStarLayers);
  /**
   * If responsive mode is enabled, the component will automatically be re-rendered when its size changes
   */
  responsive = input<boolean>(true);
  #renderer = inject(Renderer2);
  #elRef = inject(ElementRef);
  #initialized = signal(false);
  #size = toSignal(
    resizeObservable(this.#elRef.nativeElement).pipe(
      filter(() => this.responsive() || !this.#initialized()),
      debounceTime(100),
      distinctUntilChanged()
    )
  );

  constructor() {
    effect(() => {
      const size = this.#size();

      if (size) {
        this.#renderStars(this.layers(), size.width, size.height);
        this.#initialized.set(true);
      }
    });
  }

  #renderStars(layers: StarLayer[], width: number, height: number): void {
    this.#renderer.setProperty(this.#elRef.nativeElement, 'innerHTML', '');

    layers.forEach((layer) => {
      const boxShadow = this.#createBoxShadow(width, height, layer.density, layer.color, layer.blur, layer.glow);

      const layerElement = this.createLayerElement(layer, boxShadow, width, height);

      const afterLayerElement = this.createAfterLayerElement(layer, boxShadow, height, width);

      this.#renderer.appendChild(layerElement, afterLayerElement);

      this.#renderer.appendChild(this.#elRef.nativeElement, layerElement);
    });
  }

  private createAfterLayerElement(layer: StarLayer, boxShadow: string, height: number, width: number) {
    const afterLayerElement = this.#renderer.createElement('span');

    this.#renderer.setStyle(afterLayerElement, 'content', ' ');
    this.#renderer.setStyle(afterLayerElement, 'position', 'absolute');
    this.#renderer.setStyle(afterLayerElement, 'width', `${layer.size}px`);
    this.#renderer.setStyle(afterLayerElement, 'height', `${layer.size}px`);
    this.#renderer.setStyle(afterLayerElement, 'background', 'transparent');
    this.#renderer.setStyle(afterLayerElement, 'boxShadow', boxShadow);

    switch (layer.direction) {
      case 'up':
        this.#renderer.setStyle(afterLayerElement, 'top', `${height}px`);
        break;
      case 'down':
        this.#renderer.setStyle(afterLayerElement, 'bottom', `${height}px`);
        break;
      case 'left':
        this.#renderer.setStyle(afterLayerElement, 'left', `${width}px`);
        break;
      case 'right':
        this.#renderer.setStyle(afterLayerElement, 'right', `${width}px`);
        break;
    }

    return afterLayerElement;
  }

  private createLayerElement(layer: StarLayer, boxShadow: string, width: number, height: number) {
    const layerElement = this.#renderer.createElement('div');

    this.#renderer.setStyle(layerElement, 'width', `${layer.size}px`);
    this.#renderer.setStyle(layerElement, 'height', `${layer.size}px`);
    this.#renderer.setStyle(layerElement, 'background', 'transparent');
    this.#renderer.setStyle(layerElement, 'boxShadow', boxShadow);
    this.#renderer.setStyle(layerElement, 'borderRadius', layer.isRound ? '50%' : '0');
    layerElement.animate(this.#createKeyFramesForLayer(layer, width, height), {
      duration: 1000000 / layer.speed,
      iterations: Infinity,
    });

    return layerElement;
  }

  #createKeyFramesForLayer(layer: StarLayer, width: number, height: number): Keyframe[] {
    switch (layer.direction) {
      case 'up': {
        return [
          {
            transform: 'translateY(0)',
          },
          {
            transform: `translateY(-${height}px)`,
          },
        ];
      }
      case 'down': {
        return [
          {
            transform: 'translateY(0)',
          },
          {
            transform: `translateY(${height}px)`,
          },
        ];
      }
      case 'left': {
        return [
          {
            transform: 'translateX(0)',
          },
          {
            transform: `translateX(-${width}px)`,
          },
        ];
      }
      case 'right': {
        return [
          {
            transform: 'translateX(0)',
          },
          {
            transform: `translateX(${width}px)`,
          },
        ];
      }
      default: {
        throw new Error(`Invalid direction: ${layer.direction}`);
      }
    }
  }

  #createBoxShadow(width: number, height: number, density: number, color: string, blur: number, glow: number): string {
    const count = this.#calculateCount(density, width, height);

    const shadows = [];

    for (let i = 0; i < count; i++) {
      const xPos = randomInt(1, width);
      const yPos = randomInt(1, height);

      const starShadow = `${xPos}px ${yPos}px ${blur}px 0 ${color}`;
      shadows.push(starShadow);

      if (glow !== 0) {
        const glowShadow = `${xPos}px ${yPos}px ${glow}px 0 ${color}`;
        shadows.push(glowShadow);
      }
    }

    return shadows.join(',');
  }

  #calculateCount(density: number, width: number, height: number): number {
    return density * (width / 100) * (height / 100);
  }
}
