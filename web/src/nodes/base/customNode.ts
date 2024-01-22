import type {
  INodeInputSlot,
  INodeOutputSlot,
  SerializedLGraphNode,
  LGraphNode as ILGraphNode,
} from "@/types/comfyUI";

export class CustomGraphNode extends LGraphNode {
  /**
   * 用于 comfy 标识调用的 python 类
   */
  comfyClass: string;
  /**
   * 序列化组件
   */
  serialize_widgets = true;
  /**
   * 是否虚拟节点
   */
  isVirtualNode = false;
  constructor(title: string, comfyClass: string = "") {
    super(title);
    this.comfyClass = comfyClass;
    this.properties = {
      // 初始化标识
      //@ts-ignore
      "Node name for S&R": this.__proto__.constructor.type,
      ...this.properties,
    };
  }
  addInput(
    name: string,
    type: string | -1,
    extra_info?: Partial<INodeInputSlot> | undefined
  ): INodeInputSlot {
    return super.addInput(name, type, { label: name, ...extra_info });
  }
  addOutput(
    name: string,
    type: string | -1,
    extra_info?: Partial<INodeOutputSlot> | undefined
  ): INodeOutputSlot {
    // 增加 label 标识
    return super.addOutput(name, type, { label: name, ...extra_info });
  }
  serialize(): SerializedLGraphNode<ILGraphNode> {
    const serialized = super.serialize();
    return {
      ...super.serialize(),
      // 和 comfyUI 的序列化格式保持一致
      size: serialized.size,
      pos: [serialized.pos[0], serialized.pos[1]],
    };
  }
}
