import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';
import { Polygon } from '../../models/polygon.model';
import { savePolygon, resetPolygons } from '../../store/canvas.actions';
import { selectPolygons } from '../../store/canvas.selectors';
import Konva from 'konva';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-drawing-tool',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './drawing-tool.component.html',
  styleUrl: './drawing-tool.component.scss',
})
export class DrawingToolComponent {
  @ViewChild('canvasContainer', { static: true }) containerRef!: ElementRef;

  private destroy$ = new Subject<void>();
  private stage!: Konva.Stage;
  private layer!: Konva.Layer;
  private polygonGroup!: Konva.Group;
  private polygon!: Konva.Line;
  private tempLine!: Konva.Line;
  private transformer!: Konva.Transformer;
  private circles: Konva.Circle[] = [];
  private points: number[][] = [];
  private isMouseOverStartPoint = false;
  public isDrawing = true;
  public isSaved: boolean = false;

  constructor(private store: Store) {}

  /**
   * After view init
   */

  ngAfterViewInit() {
    this.initCanvas();
    this.loadPolygons();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  resetPolygon() {
    this.store.dispatch(resetPolygons());
    this.resetDrawing();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private loadPolygons() {
    this.store
      .select(selectPolygons)
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe((polygons) => {
        if (polygons[0]?.points) {
          this.points = polygons[0]?.points;
          this.drawPolygon();
          this.finishPolygon();
        }
      });
  }

  private initCanvas() {
    const container = this.containerRef.nativeElement;

    setTimeout(() => {
      const konvasjsContent = container.querySelector('.konvajs-content');
      konvasjsContent.style.background = '#f0f0f0';
    });

    this.stage = new Konva.Stage({
      container,
      width: container.offsetWidth,
      height: container.offsetHeight,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    this.stage.on('click', (event) => this.handleStageClick(event));
    this.stage.on('mousemove', (event) => this.updateTempLine(event));
  }

  private handleStageClick(event: Konva.KonvaEventObject<MouseEvent>) {
    if (!this.isDrawing) return;

    const { x, y } = this.stage.getPointerPosition()!;

    if (this.points.length > 2 && this.isMouseOverStartPoint) {
      this.finishPolygon();
      return;
    }

    this.points.push([x, y]);
    this.drawPolygon();
  }

  private drawPolygon() {
    this.layer.destroyChildren();
    this.polygonGroup = new Konva.Group({ draggable: true });

    this.polygon = new Konva.Line({
      points: this.points.flat(),
      stroke: 'black',
      strokeWidth: 2,
      closed: false,
    });

    this.polygonGroup.add(this.polygon);
    this.createCircles();

    this.layer.add(this.polygonGroup);
    this.addTransformer();
    this.addTempLine();

    this.layer.draw();
  }

  private createCircles() {
    this.circles = this.points.map(([x, y], index) => {
      const circle = new Konva.Circle({
        x,
        y,
        radius: 5,
        fill: index === 0 ? 'slateblue' : 'white',
        stroke: 'black',
        strokeWidth: 2,
        draggable: true,
      });

      circle.on('dragmove', (event) => this.updateCirclePosition(event, index));
      this.addStartPointEvents(circle, index);

      this.polygonGroup.add(circle);
      return circle;
    });
  }

  private addStartPointEvents(circle: Konva.Circle, index: number) {
    if (index !== 0) return;

    circle.on('mouseenter', () => {
      this.isMouseOverStartPoint = true;
      circle.fill('white');
      this.layer.draw();
    });

    circle.on('mouseleave', () => {
      this.isMouseOverStartPoint = false;
      circle.fill('slateblue');
      this.layer.draw();
    });
  }

  private updateCirclePosition(event: Konva.KonvaEventObject<DragEvent>, index: number) {
    const pos = [event.target.x(), event.target.y()];
    this.points = this.points.map((p, i) => (i === index ? pos : p));
    this.polygon.points(this.points.flat());
    this.layer.draw();
  }

  private addTransformer() {
    this.transformer = new Konva.Transformer({
      nodes: [this.polygonGroup],
      centeredScaling: true,
      rotationSnaps: [0, 90, 180, 270],
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      resizeEnabled: true,
    });

    this.polygonGroup.on('dragmove', () => {
      this.updatePolygonPosition();
    });

    this.polygonGroup.on('dragend', () => {
      this.saveDrawing();
    });
    this.transformer.on('transformend', () => {
      this.updatePolygonTransform();
      this.saveDrawing();
    });
    this.layer.add(this.transformer);
  }

  private addTempLine() {
    this.tempLine = new Konva.Line({
      stroke: 'gray',
      strokeWidth: 1,
      dash: [4, 4],
    });
    this.layer.add(this.tempLine);
  }

  private finishPolygon() {
    this.isDrawing = false;
    this.polygon.closed(true);
    this.polygon.fill('rgba(0, 0, 255, 0.5)');
    this.polygonGroup.draggable(true);
    this.tempLine.destroy();
    this.layer.draw();

    if (!this.isSaved) this.saveDrawing();
  }

  private updatePolygonPosition() {
    const newPoints = this.polygon.points().map((coord, index) => {
      return index % 2 === 0 ? coord + this.polygonGroup.x() : coord + this.polygonGroup.y();
    });

    this.points = [];
    for (let i = 0; i < newPoints.length; i += 2) {
      this.points.push([newPoints[i], newPoints[i + 1]]);
    }
  }

  private updatePolygonTransform() {
    const rotation = this.polygonGroup.rotation();
    const scaleX = this.polygonGroup.scaleX();
    const scaleY = this.polygonGroup.scaleY();
    const center = this.polygonGroup.getClientRect();
    const centerX = center.x + center.width / 2;
    const centerY = center.y + center.height / 2;

    this.points = this.points.map(([x, y]) => {
      let dx = x - centerX;
      let dy = y - centerY;

      // Rotate
      const radians = (Math.PI / 180) * rotation;
      const rotatedX = dx * Math.cos(radians) - dy * Math.sin(radians);
      const rotatedY = dx * Math.sin(radians) + dy * Math.cos(radians);

      // Scale
      const scaledX = rotatedX * scaleX;
      const scaledY = rotatedY * scaleY;

      return [centerX + scaledX, centerY + scaledY];
    });
  }

  private updateTempLine(event: Konva.KonvaEventObject<MouseEvent>) {
    if (!this.isDrawing || this.points.length === 0) return;

    const { x, y } = this.stage.getPointerPosition()!;
    const lastPoint = this.points[this.points.length - 1];

    this.tempLine?.points([...lastPoint, x, y]);
    this.layer.draw();
  }

  private saveDrawing() {
    this.isSaved = true;

    const newPolygon: Polygon = {
      points: this.points,
    };
    this.store.dispatch(savePolygon({ polygon: newPolygon }));
  }

  private resetDrawing() {
    this.isDrawing = true;
    this.isSaved = false;
    this.points = [];
    this.layer.destroyChildren();
    this.layer.draw();
    this.tempLine = new Konva.Line({
      stroke: 'gray',
      strokeWidth: 1,
      dash: [4, 4],
    });

    this.layer.add(this.tempLine);
    this.layer.draw();
  }

  /**
   * On destroy
   */

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
