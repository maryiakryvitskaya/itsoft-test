import { createReducer, on } from '@ngrx/store';
import { initialCanvasState, CanvasState } from './canvas.state';
import { resetPolygons, savePolygon } from './canvas.actions';

export const canvasReducer = createReducer<CanvasState>(
  initialCanvasState,

  on(savePolygon, (state, { polygon }) => ({
    ...state,
    polygons: [polygon],
  })),

  on(resetPolygons, (state) => ({
    ...state,
    polygons: [],
  })),
);
