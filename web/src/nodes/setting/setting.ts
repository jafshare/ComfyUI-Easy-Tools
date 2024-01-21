// @ts-ignore
import { app } from "@comfyUI/scripts/app.js";
// import { $el } from "../../../../scripts/ui.js";
import { ComfyApp, ComfyExtension } from "@/types/comfyUI";
const noop = () => {};

const ext = {
  name: "easyTools.chatGPTPrompt",
  async setup(app: ComfyApp) {
    // app.ui.settings.addSetting({
    //   id: "EasyTools.ChatGPTPrompt.SystemPrompt",
    //   name: "ChatGPT System Prompt",
    //   defaultValue: defaultSystemPrompt,
    //   type: (name, setter, value) => {
    //     // TODO 从接口取值
    //     const customPrompt = "";
    //     const promptInput = $el("textarea", {
    //       value: customPrompt || defaultSystemPrompt,
    //       rows: 10,
    //       onchange: (e) => {
    //         // 更新数据到服务器
    //         setter(e.target.value);
    //       },
    //       style: {
    //         fontSize: "14px",
    //         width: "100%",
    //       },
    //     });
    //     return $el("tr", [
    //       $el("td", [
    //         $el("label", {
    //           textContent: name,
    //         }),
    //       ]),
    //       $el("td", [
    //         promptInput,
    //         $el("button", {
    //           textContent: "Reset",
    //           onclick: async () => {
    //             // 重置
    //             promptInput.value = defaultSystemPrompt;
    //             // 创建并分发 change 事件
    //             var event = new Event("change", {
    //               bubbles: true,
    //               cancelable: true,
    //             });
    //             promptInput.dispatchEvent(event);
    //           },
    //           style: {
    //             marginTop: "5px",
    //             display: "block",
    //           },
    //         }),
    //       ]),
    //     ]);
    //   },
    // });
    app.ui.settings.addSetting({
      id: "EasyTools.ChatGPTPrompt.BaseURL",
      name: "ChatGPT Base URL",
      defaultValue: "",
      type: "text",
      onChange: noop,
    });
    app.ui.settings.addSetting({
      id: "EasyTools.ChatGPTPrompt.Token",
      name: "ChatGPT Token",
      defaultValue: "",
      type: "text",
      onChange: noop,
    });
  },
};
app.registerExtension(ext as ComfyExtension);
