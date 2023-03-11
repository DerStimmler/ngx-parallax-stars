import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxParallaxStarsComponent } from './ngx-parallax-stars.component';

describe('NgxParallaxStarsComponent', () => {
  let component: NgxParallaxStarsComponent;
  let fixture: ComponentFixture<NgxParallaxStarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxParallaxStarsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxParallaxStarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
