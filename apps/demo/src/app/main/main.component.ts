import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxParallaxStarsComponent} from "ngx-parallax-stars";

@Component({
  selector: 'ngx-parallax-stars-main',
  standalone: true,
    imports: [CommonModule, NgxParallaxStarsComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {}
