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
import { defaultStarLayers, StarLayer } from 'ngx-parallax-stars';
import { debounceTime, tap } from 'rxjs';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';

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
  ],
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
  form: FormGroup;

  @Output() layersChanged = new EventEmitter<StarLayer[]>();

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
    });

    this.layers.push(layerGroup);
  }

  deleteLayer(layerIndex: number): void {
    this.layers.removeAt(layerIndex);
  }

  formatSizeLabel(value: number): string {
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
      })
    );

    return this.fb.group({
      layers: this.fb.array(layerForms),
    });
  }

  ngOnInit(): void {
    this.registerFormChanges();
  }

  private registerFormChanges() {
    this.form.valueChanges
      .pipe(
        debounceTime(100),
        tap(() => this.layersChanged.emit(this.form.getRawValue().layers))
      )
      .subscribe();
  }
}
