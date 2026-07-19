import { AfterViewInit, Component, ElementRef, inject, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ngx-parallax-stars-mouse-highlighter',
  imports: [],
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./mouse-highlighter.component.scss']
})
export class MouseHighlighterComponent implements AfterViewInit {
  #elRef = inject(ElementRef);

  ngAfterViewInit(): void {
    document.body.addEventListener('mousemove', (e: MouseEvent) => {
      this.#elRef.nativeElement.style.top = `${e.y}px`;
      this.#elRef.nativeElement.style.left = `${e.x}px`;
    });
  }
}
