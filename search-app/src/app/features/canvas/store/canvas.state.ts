import { Polygon } from '../models/polygon.model';

export interface CanvasState {
  polygons: Polygon[];
}

export const initialCanvasState: CanvasState = {
  polygons: [],
};
