import Point from "./Point";

export default class Line {
  point1: Point;
  point2: Point;
  constructor(point1: Point, point2: Point) {
    this.point1 = point1;
    this.point2 = point2;
  }

  draw(canvasCtx: CanvasRenderingContext2D) {
    canvasCtx.beginPath();
    canvasCtx.moveTo(this.point1.x, this.point1.y);
    canvasCtx.lineTo(this.point2.x, this.point2.y);
    canvasCtx.lineWidth = 1;
    canvasCtx.stroke();
  }

  moveEndpoint(x: number, y: number) {
    this.point2.x = x;
    this.point2.y = y;
  }

  getCenterDistance(): { distanceX: number; distanceY: number } {
    const { x, y } = this.getCenter();
    const distanceX = Math.abs(x - this.point1.x);
    const distanceY = Math.abs(y - this.point1.y);
    return { distanceX, distanceY };
  }

  getCenter(): Point {
    const x = (this.point2.x + this.point1.x) / 2;
    const y = (this.point2.y + this.point1.y) / 2;
    return { x, y };
  }

  changeLength(centerDistance: { distanceX: number; distanceY: number }) {
    const { x, y } = this.getCenter();

    this.point1.x = x + centerDistance.distanceX * (this.point1.x > x ? -1 : 1);
    this.point1.y = y + centerDistance.distanceY * (this.point1.y > y ? -1 : 1);
    this.point2.x = x + centerDistance.distanceX * (this.point2.x > x ? -1 : 1);
    this.point2.y = y + centerDistance.distanceY * (this.point2.y > y ? -1 : 1);
  }

  findIntersection(line: Line): Point | undefined {
    const a1 = this.point2.y - this.point1.y;
    const b1 = this.point1.x - this.point2.x;
    const c1 = a1 * this.point1.x + b1 * this.point1.y;
    const a2 = line.point2.y - line.point1.y;
    const b2 = line.point1.x - line.point2.x;
    const c2 = a2 * line.point1.x + b2 * line.point1.y;

    const determinant = a1 * b2 - a2 * b1;

    if (determinant == 0) return undefined;
    else {
      const x = (b2 * c1 - b1 * c2) / determinant;
      const y = (a1 * c2 - a2 * c1) / determinant;

      if (x < Math.min(line.point1.x, line.point2.x)) return undefined;
      if (x > Math.max(line.point1.x, line.point2.x)) return undefined;

      if (y < Math.min(line.point1.y, line.point2.y)) return undefined;
      if (y > Math.max(line.point1.y, line.point2.y)) return undefined;

      if (x < Math.min(this.point1.x, this.point2.x)) return undefined;
      if (x > Math.max(this.point1.x, this.point2.x)) return undefined;

      if (y < Math.min(this.point1.y, this.point2.y)) return undefined;
      if (y > Math.max(this.point1.y, this.point2.y)) return undefined;

      return { x, y };
    }
  }
}
