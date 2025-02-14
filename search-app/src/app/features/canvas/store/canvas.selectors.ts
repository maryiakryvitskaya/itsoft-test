import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CanvasState } from './canvas.state';

export const selectCanvasState = createFeatureSelector<CanvasState>('CANVAS');

export const selectPolygons = createSelector(selectCanvasState, (state: CanvasState) => state.polygons);
