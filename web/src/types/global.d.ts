import {
  LGraphCanvas as _LGraphCanvas,
  LiteGraph as _LiteGraph,
  LGraphNode as _LGraphNode,
} from "./comfyUI";

declare global {
  const LGraphCanvas = _LGraphCanvas;
  const LiteGraph = _LiteGraph;
  const LGraphNode = _LGraphNode;
}
