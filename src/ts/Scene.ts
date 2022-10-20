import IntersectionPoint from "./IntersectionPoint";
import Line from "./Line";

export default class Scene {
  width: number;
  height: number;
  lines: Line[];
  currentLine: Line | null;
  collapseAnimationFrameId: number;
  intersectionPoints: IntersectionPoint[];

  constructor(width: number, height: number) {
    this.lines = [];
    this.width = width;
    this.height = height;
    this.currentLine = null;
    this.collapseAnimationFrameId = 0;
    this.intersectionPoints = [];
  }

  draw(canvasCtx: CanvasRenderingContext2D) {
    canvasCtx.clearRect(0, 0, this.width, this.height);
    this.lines.forEach((obj) => {
      obj.draw(canvasCtx);
    });
    this.intersectionPoints.forEach((el) => {
      el.draw(canvasCtx);
    });
  }

  cancelLine() {
    if (this.currentLine) {
      this.lines = this.lines.filter((el) => el !== this.currentLine);
      this.currentLine = null;
      this.checkIntersections();
    }
  }

  startLine(x: number, y: number) {
    const line = new Line({ x, y }, { x, y });
    this.currentLine = line;
    this.lines.push(line);
  }

  checkIntersections() {
    this.intersectionPoints = [];
    for (let i = 0; i < this.lines.length; i++) {
      for (let j = i + 1; j < this.lines.length; j++) {
        const point = this.lines[i].findIntersection(this.lines[j]);
        if (point) {
          this.intersectionPoints.push(new IntersectionPoint(point.x, point.y));
        }
      }
    }
  }

  moveLineEndPoint(x: number, y: number) {
    if (this.currentLine === null) return;
    this.currentLine.moveEndpoint(x, y);
    this.checkIntersections();
  }

  finishLine() {
    this.currentLine = null;
  }

  collapseLines(time: number, canvasCtx: CanvasRenderingContext2D) {
    cancelAnimationFrame(this.collapseAnimationFrameId);
    let startTime = 0;
    const centerDistances = new Map<
      Line,
      { distanceX: number; distanceY: number }
    >();
    this.lines.forEach((el) => {
      const centerDistance = el.getCenterDistance();
      centerDistances.set(el, centerDistance);
    });
    const step = (timestamp: number) => {
      this.cancelLine();
      if (!startTime) startTime = timestamp;
      let timeDiff = timestamp - startTime;
      const progress = Math.min(timeDiff / time, 1);
      const progressLeft = 1 - progress;
      this.lines.forEach((el) => {
        const initialDistance = centerDistances.get(el)!;
        const stepDistance = {
          distanceX: initialDistance.distanceX * progressLeft,
          distanceY: initialDistance.distanceY * progressLeft,
        };
        el.changeLength(stepDistance);
      });

      if (timeDiff < time) {
        this.collapseAnimationFrameId = requestAnimationFrame(step);
      } else {
        this.lines = [];
      }
      this.checkIntersections();
      this.draw(canvasCtx);
    };
    this.collapseAnimationFrameId = requestAnimationFrame(step);
  }
}
