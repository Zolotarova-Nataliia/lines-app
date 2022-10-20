import { useEffect, useRef } from "react";
import getCanvasRelativeCoordinates from "./ts/helpers/getCanvasRelativeCoordinates";
import Scene from "./ts/Scene";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.getContext("2d")!.canvas.width =
      canvas.getContext("2d")!.canvas.clientWidth;
    canvas.getContext("2d")!.canvas.height =
      canvas.getContext("2d")!.canvas.clientHeight;
    const scene = new Scene(canvas.width, canvas.height);
    sceneRef.current = scene;
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const { x, y } = getCanvasRelativeCoordinates(
        e.clientX,
        e.clientY,
        canvasRef.current!
      );
      sceneRef.current!.moveLineEndPoint(x, y);
      sceneRef.current!.draw(canvasRef.current!.getContext("2d")!);
    };
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 2) return;
      sceneRef.current!.cancelLine();
      sceneRef.current!.draw(canvasRef.current!.getContext("2d")!);
    };
    const onMouseUp = () => {
      sceneRef.current!.finishLine();
    };
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("contextmenu", onContextMenu);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("contextmenu", onContextMenu);
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      canvasRef.current!.getContext("2d")!.canvas.width =
        canvasRef.current!.getContext("2d")!.canvas.clientWidth;
      canvasRef.current!.getContext("2d")!.canvas.height =
        canvasRef.current!.getContext("2d")!.canvas.clientHeight;
      sceneRef.current!.width =
        canvasRef.current!.getContext("2d")!.canvas.width;
      sceneRef.current!.height =
        canvasRef.current!.getContext("2d")!.canvas.height;
      sceneRef.current!.draw(canvasRef.current!.getContext("2d")!);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  });

  return (
    <div id="app">
      <canvas
        id="canvas"
        ref={canvasRef}
        onMouseDown={(e) => {
          if (e.button !== 0) return;
          const { x, y } = getCanvasRelativeCoordinates(
            e.clientX,
            e.clientY,
            canvasRef.current!
          );
          sceneRef.current!.startLine(x, y);
          sceneRef.current!.draw(canvasRef.current!.getContext("2d")!);
        }}
      />
      <button
        id="button"
        onClick={() => {
          sceneRef.current!.collapseLines(
            1000,
            canvasRef.current!.getContext("2d")!
          );
        }}
      >
        Collapse lines
      </button>
    </div>
  );
}
