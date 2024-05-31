import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { defaultStarLayers, StarLayer } from '../star-layer';
import { randomInt, resizeObservable } from '../utils';
import { debounceTime, filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ngx-parallax-stars',
  standalone: true,
  imports: [CommonModule],
  template: '',
  styles: [':host { display: block; overflow: hidden; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxParallaxStarsComponent {
  #elRef = inject(ElementRef);

  /**
   * Overrides default star layers
   */
  layers = input<StarLayer[]>(defaultStarLayers);
  /**
   * If responsive mode is enabled, the component will automatically be re-rendered when its size changes
   */
  responsive = input<boolean>(true);

  #size = toSignal(
    resizeObservable(this.#elRef.nativeElement).pipe(
      filter(() => this.responsive() || !this.#initialized()),
      debounceTime(100)
    )
  );
  #initialized = signal(false);

  constructor() {
    effect(
      () => {
        const size = this.#size();

        if (size) {
          this.#renderStars(this.layers(), size.width, size.height);
          this.#initialized.set(true);
        }
      },
      { allowSignalWrites: true }
    );
  }

  #renderStars(layers: StarLayer[], width: number, height: number): void {
    this.#elRef.nativeElement.replaceChildren();

    layers.forEach((layer) => {
      const boxShadow = this.#createBoxShadow(
        width,
        height,
        layer.density,
        layer.color,
        layer.blur,
        layer.glow
      );

      const layerElement = document.createElement('div');
      layerElement.style.width = `${layer.size}px`;
      layerElement.style.height = `${layer.size}px`;
      layerElement.style.background = 'transparent';
      layerElement.style.boxShadow = boxShadow;
      layerElement.style.borderRadius = layer.isRound ? '50%' : '0';
      layerElement.animate(
        this.#createKeyFramesForLayer(layer, width, height),
        {
          duration: 1000000 / layer.speed,
          iterations: Infinity,
        }
      );

      const afterLayerElement = document.createElement('span');
      afterLayerElement.style.content = ' ';
      afterLayerElement.style.position = 'absolute';
      afterLayerElement.style.width = `${layer.size}px`;
      afterLayerElement.style.height = `${layer.size}px`;
      afterLayerElement.style.background = 'transparent';
      afterLayerElement.style.boxShadow = boxShadow;

      switch (layer.direction) {
        case 'up':
          afterLayerElement.style.top = `${height}px`;
          break;
        case 'down':
          afterLayerElement.style.bottom = `${height}px`;
          break;
        case 'left':
          afterLayerElement.style.left = `${width}px`;
          break;
        case 'right':
          afterLayerElement.style.right = `${width}px`;
          break;
      }

      layerElement.appendChild(afterLayerElement);

      this.#elRef.nativeElement.appendChild(layerElement);
    });
  }

  #createKeyFramesForLayer(
    layer: StarLayer,
    width: number,
    height: number
  ): Keyframe[] {
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
    }
  }

  #createBoxShadow(
    width: number,
    height: number,
    density: number,
    color: string,
    blur: number,
    glow: number
  ): string {
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
