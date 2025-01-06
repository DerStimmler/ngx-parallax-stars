import { Component, inject } from '@angular/core';
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
import { debounceTime, map } from 'rxjs';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { ConfigForm } from './config-form';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LayerRandomizerService } from './layer-randomizer.service';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { MatDivider } from '@angular/material/divider';

@Component({
    selector: 'ngx-parallax-stars-config',
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
        MatDivider,
    ],
    templateUrl: './config.component.html',
    styleUrls: ['./config.component.scss']
})
export class ConfigComponent {
  #fb = inject(NonNullableFormBuilder);
  #clipboard = inject(Clipboard);
  #layerRandomizerService = inject(LayerRandomizerService);

  protected form = this.#buildForm(this.#fb);

  configChanged = outputFromObservable<ConfigForm>(
    this.form.valueChanges.pipe(
      debounceTime(100),
      map(() => this.form.getRawValue())
    )
  );

  protected get formLayers(): FormArray {
    return this.form.controls['layers'] as FormArray;
  }

  protected addLayer(): void {
    const layer = defaultStarLayers[0];

    const layerGroup = this.createLayerFormGroup(layer, this.#fb);

    this.formLayers.push(layerGroup);
  }

  protected deleteLayer(layerIndex: number): void {
    this.formLayers.removeAt(layerIndex);
  }

  protected formatPxLabel(value: number): string {
    return `${value}px`;
  }

  #buildForm(fb: NonNullableFormBuilder): FormGroup {
    const layerForms = defaultStarLayers.map((layer) =>
      this.createLayerFormGroup(layer, fb)
    );

    return fb.group({
      layers: fb.array(layerForms),
      responsive: fb.control(true),
    });
  }

  private createLayerFormGroup(layer: StarLayer, fb: NonNullableFormBuilder) {
    return fb.group({
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

  protected exportLayers(): void {
    const layers = JSON.stringify(this.formLayers.getRawValue());
    this.#clipboard.copy(layers);
  }

  protected randomizeLayers(): void {
    const layers = this.#layerRandomizerService.generateRandomLayers();

    const layerForms = layers.map((layer) =>
      this.createLayerFormGroup(layer, this.#fb)
    );

    this.form.setControl('layers', this.#fb.array(layerForms));
  }
}
