export default function getCanvasRelativeCoordinates(
  x: number,
  y: number,
  canvas: HTMLCanvasElement
) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: x - rect.x,
    y: y - rect.y,
  };
}
