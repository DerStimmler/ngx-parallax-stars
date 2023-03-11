import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {defaultStarLayers, StarLayer} from "../star-layer";
import { random } from '../utils';
import {debounceTime, Subject, tap} from "rxjs";

@Component({
  selector: 'ngx-parallax-stars',
  standalone: true,
  imports: [CommonModule],
  template: '',
  styles : [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxParallaxStarsComponent implements OnInit{
  private width = 0;
  private height = 0;

  private resize$ = new Subject<{height: number, width: number}>();
  @Input() layers: StarLayer[] = defaultStarLayers;

  constructor(private elRef: ElementRef) {}

  ngOnInit(): void {
    this.registerResizeObserver();

    this.resize$.pipe(debounceTime(100),tap(dimensions => {
      if (
        Math.abs(dimensions.height - this.height) < 20 &&
        Math.abs(dimensions.width - this.width) < 20
      )
        return;

      this.height = dimensions.height;
      this.width = dimensions.width;

      this.renderStars();
    })).subscribe();
  }

  private registerResizeObserver() {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const contentRect = entry.contentRect;

        console.log(contentRect);
        if (
          Math.abs(contentRect.height - this.height) < 1 &&
          Math.abs(contentRect.width - this.width) < 1
        )
          continue;

        this.resize$.next({height: contentRect.height, width: contentRect.width});
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
        layer.count,
        layer.color
      );

      const layerElement = document.createElement('div');
      layerElement.style.width = layer.size;
      layerElement.style.height = layer.size;
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
        { duration: layer.speed * 1000, iterations: 5000 }
      );

      const afterLayerElement = document.createElement('span');
      afterLayerElement.style.content = ' ';
      afterLayerElement.style.position = 'absolute';
      afterLayerElement.style.top = `${this.height}px`;
      afterLayerElement.style.width = layer.size;
      afterLayerElement.style.height = layer.size;
      afterLayerElement.style.background = 'transparent';
      afterLayerElement.style.boxShadow = boxShadow;

      layerElement.appendChild(afterLayerElement);

      this.elRef.nativeElement.appendChild(layerElement);
    });
  }

  private createBoxShadow(
    width: number,
    height: number,
    count: number,
    color: string
  ) {
    const values = [];

    for (let i = 0; i < count; i++) {
      const x = `${random(1, width)}px ${random(
        1,
        height
      )}px ${color}`;
      values.push(x);
    }

    return values.join(',');
  }
}
