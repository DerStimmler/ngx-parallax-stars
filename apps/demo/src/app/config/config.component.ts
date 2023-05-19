import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {
  FormArray,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { defaultStarLayers } from 'ngx-parallax-stars';
import { debounceTime, tap } from 'rxjs';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { ConfigForm } from './config-form';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'ngx-parallax-stars-config',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatSliderModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
  ],
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
  form: FormGroup;

  @Output() configChanged = new EventEmitter<ConfigForm>();

  constructor(private fb: NonNullableFormBuilder) {
    this.form = this.buildForm();
  }

  get layers(): FormArray {
    return this.form.controls['layers'] as FormArray;
  }

  addLayer(): void {
    const starLayer = defaultStarLayers[0];

    const layerGroup = this.fb.group({
      color: [starLayer.color],
      speed: [starLayer.speed],
      density: [starLayer.density],
      size: [starLayer.size],
      direction: [starLayer.direction],
      blur: [starLayer.blur],
      glow: [starLayer.glow],
      isRound: [starLayer.isRound],
    });

    this.layers.push(layerGroup);
  }

  deleteLayer(layerIndex: number): void {
    this.layers.removeAt(layerIndex);
  }

  formatPxLabel(value: number): string {
    return `${value}px`;
  }

  private buildForm(): FormGroup {
    const layerForms = defaultStarLayers.map((layer) =>
      this.fb.group({
        color: [layer.color],
        speed: [layer.speed],
        density: [layer.density],
        size: [layer.size],
        direction: [layer.direction],
        blur: [layer.blur],
        glow: [layer.glow],
        isRound: [layer.isRound],
      })
    );

    return this.fb.group({
      layers: this.fb.array(layerForms),
      responsive: this.fb.control(true),
    });
  }

  ngOnInit(): void {
    this.registerFormChanges();
  }

  private registerFormChanges(): void {
    this.form.valueChanges
      .pipe(
        debounceTime(100),
        tap(() => this.configChanged.emit(this.form.getRawValue()))
      )
      .subscribe();
  }
}
