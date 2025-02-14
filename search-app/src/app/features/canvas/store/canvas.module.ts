import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { canvasReducer } from './canvas.reducer';

@NgModule({
  imports: [StoreModule.forFeature('CANVAS', canvasReducer)],
})
export class CanvasStoreModule {}
