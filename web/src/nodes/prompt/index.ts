import { app } from "@comfyUI/scripts/app";
import type { ComfyExtension } from "@/types/comfyUI";
import { ComfyWidgets } from "@comfyUI/scripts/widgets";
import { CustomGraphNode } from "../base/customNode";
import "./main";
import { usePresetStore } from "./store";
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
        const widget = ComfyWidgets.STRING(
          this,
          "prompt",
          ["", { default: "", multiline: true }],
          app
        );
        this.addWidget("button", "open preset", "", () => {
          const { openPreset, updateTags } = usePresetStore.getState();
          // 获取默认值
          const rawPrompts = widget.widget.value as string;
          updateTags(
            rawPrompts
              .split(/[,，]+/)
              .map((item) => item.trim())
              .filter((item) => item)
          );
          const unSub = usePresetStore.subscribe((state) => {
            widget.widget.value = state.tags.join(",");
            // 关闭后自动取消订阅
            if (!state.open) {
              unSub();
            }
          });
          // 打开预设弹窗
          openPreset();
        });
        this.addOutput("prompt", "STRING");
      }
    }
    LiteGraph.registerNodeType("EasyTools/Prompt/PresetPrompt", PresetPrompt);
  },
  async setup(app) {},
} as ComfyExtension);
