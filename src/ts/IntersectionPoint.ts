import Point from "./Point";

export default class IntersectionPoint implements Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw(canvasCtx: CanvasRenderingContext2D) {
    canvasCtx.beginPath();
    canvasCtx.arc(this.x, this.y, 4, 0, 2 * Math.PI);
    canvasCtx.fillStyle = "red";
    canvasCtx.fill();
  }
}
