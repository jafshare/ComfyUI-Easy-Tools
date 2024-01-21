// src/nodes/setting/setting.ts
import { app } from "@comfyUI/scripts/app";
var noop = () => {
};
var ext = {
  name: "easyTools.chatGPTPrompt",
  async setup(app2) {
    app2.ui.settings.addSetting({
      id: "EasyTools.ChatGPTPrompt.BaseURL",
      name: "ChatGPT Base URL",
      defaultValue: "",
      type: "text",
      onChange: noop
    });
    app2.ui.settings.addSetting({
      id: "EasyTools.ChatGPTPrompt.Token",
      name: "ChatGPT Token",
      defaultValue: "",
      type: "text",
      onChange: noop
    });
  }
};
app.registerExtension(ext);
