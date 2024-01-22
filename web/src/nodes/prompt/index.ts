import { app } from "@comfyUI/scripts/app";
import type { ComfyExtension } from "@/types/comfyUI";
import { ComfyWidgets } from "@comfyUI/scripts/widgets";
import { CustomGraphNode } from "../base/customNode";
import "./main";
app.registerExtension({
  name: "easyTools.presetPrompt",
  registerCustomNodes(app) {
    class PresetPrompt extends CustomGraphNode {
      color = LGraphCanvas.node_colors.yellow.color;
      bgcolor = LGraphCanvas.node_colors.yellow.bgcolor;
      groupcolor = LGraphCanvas.node_colors.yellow.groupcolor;
      constructor() {
        // TODO 暂时用 CR Prompt Text 节点模拟
        super("Preset Prompt", "CR Prompt Text");
        ComfyWidgets.STRING(
          this,
          "prompt",
          ["", { default: "", multiline: true }],
          app
        );
        this.addWidget("button", "open preset", "", () => {
          console.log(">>>onClick:");
        });
        this.addOutput("prompt", "STRING");
      }
    }
    LiteGraph.registerNodeType("EasyTools/Prompt/PresetPrompt", PresetPrompt);
  },
  async setup(app) {},
} as ComfyExtension);
