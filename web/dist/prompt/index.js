// src/nodes/prompt/index.ts
import { app } from "../../../scripts/app.js";
import { ComfyWidgets } from "../../../scripts/widgets.js";

// src/nodes/base/customNode.ts
var CustomGraphNode = class extends LGraphNode {
  /**
   * 序列化组件
   */
  serialize_widgets = true;
  /**
   * 是否虚拟节点
   */
  isVirtualNode = false;
  constructor(title) {
    super(title);
    this.properties = {
      // 初始化标识
      //@ts-ignore
      "Node name for S&R": this.__proto__.constructor.type,
      ...this.properties
    };
  }
  addInput(name, type, extra_info) {
    return super.addInput(name, type, { label: name, ...extra_info });
  }
  addOutput(name, type, extra_info) {
    return super.addOutput(name, type, { label: name, ...extra_info });
  }
  serialize() {
    const serialized = super.serialize();
    return {
      ...super.serialize(),
      // 和 comfyUI 的序列化格式保持一致
      size: serialized.size,
      pos: [serialized.pos[0], serialized.pos[1]]
    };
  }
};

// src/nodes/prompt/index.ts
app.registerExtension({
  name: "easyTools.presetPrompt",
  registerCustomNodes(app2) {
    class PresetPrompt extends CustomGraphNode {
      color = LGraphCanvas.node_colors.yellow.color;
      bgcolor = LGraphCanvas.node_colors.yellow.bgcolor;
      groupcolor = LGraphCanvas.node_colors.yellow.groupcolor;
      constructor() {
        super("Preset Prompt");
        ComfyWidgets.STRING(
          this,
          "prompt",
          ["", { default: "", multiline: true }],
          app2
        );
        this.addOutput("prompt", "STRING");
      }
    }
    LiteGraph.registerNodeType("EasyTools/Prompt/PresetPrompt", PresetPrompt);
  },
  async setup(app2) {
  }
});
