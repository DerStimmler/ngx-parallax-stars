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
import { ConfigForm } from './config-form';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LayerRandomizerService } from './layer-randomizer.service';

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
    MatTooltipModule,
  ],
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
  form: FormGroup;

  @Output() configChanged = new EventEmitter<ConfigForm>();

  constructor(
    private fb: NonNullableFormBuilder,
    private clipboard: Clipboard,
    private layerRandomizerService: LayerRandomizerService
  ) {
    this.form = this.buildForm();
  }

  get layers(): FormArray {
    return this.form.controls['layers'] as FormArray;
  }

  addLayer(): void {
    const layer = defaultStarLayers[0];

    const layerGroup = this.createLayerFormGroup(layer);

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
      this.createLayerFormGroup(layer)
    );

    return this.fb.group({
      layers: this.fb.array(layerForms),
      responsive: this.fb.control(true),
    });
  }

  private createLayerFormGroup(layer: StarLayer) {
    return this.fb.group({
      color: [layer.color],
      speed: [layer.speed],
      density: [layer.density],
      size: [layer.size],
      direction: [layer.direction],
      blur: [layer.blur],
      glow: [layer.glow],
      isRound: [layer.isRound],
    });
  }

  ngOnInit(): void {
    this.registerFormChanges();
  }

  exportLayers(): void {
    const layers = JSON.stringify(this.layers.getRawValue());
    this.clipboard.copy(layers);
  }

  randomizeLayers(): void {
    const layers = this.layerRandomizerService.generateRandomLayers();

    const layerForms = layers.map((layer) => this.createLayerFormGroup(layer));

    this.form.setControl('layers', this.fb.array(layerForms));
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
