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
import { random } from '../utils';
import { debounceTime, first, Subject, takeUntil, takeWhile, tap } from 'rxjs';

@Component({
  selector: 'ngx-parallax-stars',
  standalone: true,
  imports: [CommonModule],
  template: '',
  styles: [':host {overflow: hidden;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxParallaxStarsComponent implements OnInit, OnChanges, OnDestroy {
  private width = 0;
  private height = 0;
  private resize$ = new Subject<void>();
  private destroy$ = new Subject<void>();
  @Input() layers: StarLayer[] = defaultStarLayers;
  @Input() responsive = true;

  constructor(private elRef: ElementRef) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.renderStars();
  }

  ngOnInit(): void {
    this.observeResizeEvents();
    this.handleResizeEvents();
    this.renderInitialStars();
  }

  private handleResizeEvents() {
    this.resize$
      .pipe(
        takeWhile(() => this.responsive),
        debounceTime(100),
        tap(() => this.renderStars()),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private observeResizeEvents() {
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

  private renderStars() {
    this.elRef.nativeElement.replaceChildren();

    this.layers.forEach((layer) => {
      const boxShadow = this.createBoxShadow(
        this.width,
        this.height,
        layer.density,
        layer.color
      );

      const layerElement = document.createElement('div');
      layerElement.style.width = `${layer.size}px`;
      layerElement.style.height = `${layer.size}px`;
      layerElement.style.background = 'transparent';
      layerElement.style.boxShadow = boxShadow;
      layerElement.animate(
        [
          {
            transform: 'translateY(0)',
          },
          {
            transform: `translateY(${layer.direction === 'upwards' ? '-' : ''}${
              this.height
            }px)`,
          },
        ],
        { duration: 1000000 / layer.speed, iterations: Infinity }
      );

      const afterLayerElement = document.createElement('span');
      afterLayerElement.style.content = ' ';
      afterLayerElement.style.position = 'absolute';
      if (layer.direction === 'upwards')
        afterLayerElement.style.top = `${this.height}px`;
      if (layer.direction === 'downwards')
        afterLayerElement.style.bottom = `${this.height}px`;
      afterLayerElement.style.width = `${layer.size}px`;
      afterLayerElement.style.height = `${layer.size}px`;
      afterLayerElement.style.background = 'transparent';
      afterLayerElement.style.boxShadow = boxShadow;

      layerElement.appendChild(afterLayerElement);

      this.elRef.nativeElement.appendChild(layerElement);
    });
  }

  private createBoxShadow(
    width: number,
    height: number,
    density: number,
    color: string
  ) {
    const count = this.calculateCount(density, width, height);

    const values = [];

    for (let i = 0; i < count; i++) {
      const x = `${random(1, width)}px ${random(1, height)}px ${color}`;
      values.push(x);
    }

    return values.join(',');
  }

  private renderInitialStars() {
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
