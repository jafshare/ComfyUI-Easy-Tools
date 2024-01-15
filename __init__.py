from .chatgpt_prompt_node import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS

VERSION = "0.0.2"
# web 目录
WEB_DIRECTORY = "./web"
__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
# 加载信息
print(f"\033[34mComfyUI-Easy-Tools (v{VERSION}): \033[92mLoaded\033[0m")
