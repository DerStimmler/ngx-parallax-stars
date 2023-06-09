import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { defaultStarLayers, StarLayer } from '../star-layer';
import { randomInt } from '../utils';
import { debounceTime, filter, first, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'ngx-parallax-stars',
  standalone: true,
  imports: [CommonModule],
  template: '',
  styles: [':host { display: block; overflow: hidden; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxParallaxStarsComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Overrides default star layers
   */
  @Input() layers: StarLayer[] = defaultStarLayers;
  /**
   * If responsive mode is enabled, the component will automatically be re-rendered when its size changes
   */
  @Input() responsive = true;
  private width = 0;
  private height = 0;
  private resize$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(private elRef: ElementRef) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.haveLayersChanged(changes)) this.renderStars();
  }

  ngOnInit(): void {
    this.observeResizeEvents();
    this.handleResizeEvents();
    this.renderInitialStars();
  }

  private haveLayersChanged(changes: SimpleChanges): boolean {
    return (
      changes['layers'] &&
      !changes['layers'].firstChange &&
      JSON.stringify(changes['layers'].previousValue) !==
        JSON.stringify(changes['layers'].currentValue)
    );
  }

  private handleResizeEvents(): void {
    this.resize$
      .pipe(
        filter(() => this.responsive),
        debounceTime(100),
        tap(() => this.renderStars()),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private observeResizeEvents(): void {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const contentRect = entry.contentRect;

        if (
          Math.abs(contentRect.height - this.height) < 1 &&
          Math.abs(contentRect.width - this.width) < 1
        )
          continue;

        this.height = contentRect.height;
        this.width = contentRect.width;

        this.resize$.next();
      }
    });

    resizeObserver.observe(this.elRef.nativeElement);
  }

  private renderStars(): void {
    this.elRef.nativeElement.replaceChildren();

    this.layers.forEach((layer) => {
      const boxShadow = this.createBoxShadow(
        this.width,
        this.height,
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
      layerElement.animate(this.createKeyFramesForLayer(layer), {
        duration: 1000000 / layer.speed,
        iterations: Infinity,
      });

      const afterLayerElement = document.createElement('span');
      afterLayerElement.style.content = ' ';
      afterLayerElement.style.position = 'absolute';
      afterLayerElement.style.width = `${layer.size}px`;
      afterLayerElement.style.height = `${layer.size}px`;
      afterLayerElement.style.background = 'transparent';
      afterLayerElement.style.boxShadow = boxShadow;

      switch (layer.direction) {
        case 'up':
          afterLayerElement.style.top = `${this.height}px`;
          break;
        case 'down':
          afterLayerElement.style.bottom = `${this.height}px`;
          break;
        case 'left':
          afterLayerElement.style.left = `${this.width}px`;
          break;
        case 'right':
          afterLayerElement.style.right = `${this.width}px`;
          break;
      }

      layerElement.appendChild(afterLayerElement);

      this.elRef.nativeElement.appendChild(layerElement);
    });
  }

  private createKeyFramesForLayer(layer: StarLayer): Keyframe[] {
    switch (layer.direction) {
      case 'up': {
        return [
          {
            transform: 'translateY(0)',
          },
          {
            transform: `translateY(-${this.height}px)`,
          },
        ];
      }
      case 'down': {
        return [
          {
            transform: 'translateY(0)',
          },
          {
            transform: `translateY(${this.height}px)`,
          },
        ];
      }
      case 'left': {
        return [
          {
            transform: 'translateX(0)',
          },
          {
            transform: `translateX(-${this.width}px)`,
          },
        ];
      }
      case 'right': {
        return [
          {
            transform: 'translateX(0)',
          },
          {
            transform: `translateX(${this.width}px)`,
          },
        ];
      }
    }
  }

  private createBoxShadow(
    width: number,
    height: number,
    density: number,
    color: string,
    blur: number,
    glow: number
  ): string {
    const count = this.calculateCount(density, width, height);

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

  private renderInitialStars(): void {
    this.resize$
      .pipe(
        first(),
        tap(() => this.renderStars())
      )
      .subscribe();
  }

  private calculateCount(
    density: number,
    width: number,
    height: number
  ): number {
    return density * (width / 100) * (height / 100);
  }
}
