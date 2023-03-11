import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ngx-parallax-stars-ngx-parallax-stars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ngx-parallax-stars.component.html',
  styleUrls: ['./ngx-parallax-stars.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxParallaxStarsComponent {}
