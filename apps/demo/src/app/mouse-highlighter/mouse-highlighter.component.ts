import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ngx-parallax-stars-mouse-highlighter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mouse-highlighter.component.html',
  styleUrls: ['./mouse-highlighter.component.scss'],
})
export class MouseHighlighterComponent implements OnInit {
  constructor(private element: ElementRef) {}

  ngOnInit(): void {
    document.body.addEventListener('mousemove', (e: MouseEvent) => {
      this.element.nativeElement.style.top = `${e.y}px`;
      this.element.nativeElement.style.left = `${e.x}px`;
    });
  }
}
