import { createAction, props } from '@ngrx/store';
import { Polygon } from '../models/polygon.model';

export const savePolygon = createAction('[CANVAS] Save Polygon', props<{ polygon: Polygon }>());

export const loadPolygons = createAction('[CANVAS] Load Polygons');

export const resetPolygons = createAction('[CANVAS] Reset Polygons');
