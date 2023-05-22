import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ngx-parallax-stars-mouse-highlighter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mouse-highlighter.component.html',
  styleUrls: ['./mouse-highlighter.component.scss'],
})
export class MouseHighlighterComponent implements AfterViewInit {
  constructor(private element: ElementRef) {}

  ngAfterViewInit(): void {
    document.body.addEventListener('mousemove', (e: MouseEvent) => {
      this.element.nativeElement.style.top = `${e.y}px`;
      this.element.nativeElement.style.left = `${e.x}px`;
    });
  }
}
