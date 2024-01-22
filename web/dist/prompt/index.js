var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { app } from "../../../scripts/app.js";
import { ComfyWidgets } from "../../../scripts/widgets.js";
import { c as client, j as jsxRuntimeExports, B as Button } from "../vendor-eHVUmlmg.js";
class CustomGraphNode extends LGraphNode {
  constructor(title, comfyClass = "") {
    super(title);
    /**
     * 用于 comfy 标识调用的 python 类
     */
    __publicField(this, "comfyClass");
    /**
     * 序列化组件
     */
    __publicField(this, "serialize_widgets", true);
    /**
     * 是否虚拟节点
     */
    __publicField(this, "isVirtualNode", false);
    this.comfyClass = comfyClass;
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
}
const rootDom = document.createElement("div");
document.body.appendChild(rootDom);
client.createRoot(rootDom).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    Button,
    {
      className: "TestButton",
      style: { position: "absolute", left: 0, bottom: 0, zIndex: 991999 },
      children: "test22233312312333"
    }
  )
);
app.registerExtension({
  name: "easyTools.presetPrompt",
  registerCustomNodes(app2) {
    class PresetPrompt extends CustomGraphNode {
      constructor() {
        super("Preset Prompt", "CR Prompt Text");
        __publicField(this, "color", LGraphCanvas.node_colors.yellow.color);
        __publicField(this, "bgcolor", LGraphCanvas.node_colors.yellow.bgcolor);
        __publicField(this, "groupcolor", LGraphCanvas.node_colors.yellow.groupcolor);
        ComfyWidgets.STRING(
          this,
          "prompt",
          ["", { default: "", multiline: true }],
          app2
        );
        this.addWidget("button", "open preset", "", () => {
          console.log(">>>onClick:");
        });
        this.addOutput("prompt", "STRING");
      }
    }
    LiteGraph.registerNodeType("EasyTools/Prompt/PresetPrompt", PresetPrompt);
  },
  async setup(app2) {
  }
});
