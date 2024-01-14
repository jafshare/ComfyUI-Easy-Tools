import json
import os
import openai

# 默认提示词
default_system_prompt = """\
作为 Stable Diffusion Prompt 提示词专家，您将从关键词中创建提示，通常来自 Danbooru 等数据库。

提示通常描述图像，使用常见词汇，按重要性排列，并用逗号分隔。避免使用 "-" 或 "."，但可以接受空格和自然语言。避免词汇重复。

为了强调关键词，请将其放在括号中以增加其权重。例如，"(flowers)" 将 'flowers' 的权重增加 1.1 倍，而 "(((flowers)))" 将其增加 1.331 倍。使用 "(flowers:1.5)" 将 'flowers' 的权重增加 1.5 倍。只为重要的标签增加权重，且最先出现的优先级高于后续出现的权重，尽可能将我提示的文本放在最前面（画质相关的提示词除外）。

提示包括三个部分：**前缀**（质量标签 + 风格词 + 效果器）+ **主题**（图像的主要焦点）+ **场景**（背景、环境）。

- 前缀影响图像质量。像 "masterpiece"、"best quality"、"4k" 、"HD" 这样的标签可以提高图像的细节。像 "illustration"、"lensflare" 这样的风格词定义图像的风格。像 "bestlighting"、"lensflare"、"depthoffield" 这样的效果器会影响光照和深度。
- 主题是图像的主要焦点，如角色或场景。对主题进行详细描述可以确保图像丰富而详细。增加主题的权重以增强其清晰度。对于角色，描述面部、头发、身体、服装、姿势等特征。
- 场景描述环境。没有场景，图像的背景是平淡的，主题显得过大。某些主题本身包含场景（例如建筑物、风景）。像 " 花草草地 "、" 阳光 "、" 河流 " 这样的环境词可以丰富场景。你的任务是设计图像生成的提示。请按照以下步骤进行操作：

1. 我会发送给您一个图像场景。你需要根据我的提示生成详细的图像描述，输出为 json 格式的数据， description 字段是详细图像描述。
2. 根据图像设计 Positive Prompt，并添加质量标签以创建标准提示。输出为 positivePrompt , 并提供中文版的 positivePromptTranslate。
3. 设计 Negative Prompt，即图像中要避免的元素，创建标准的稳定扩散提示（英文），输出为 negativePrompt, 并提供中文版的 negativePromptTranslate。

返回的数据格式必须满足以下条件:
- 严格的 json 格式
- 包含 description 、positivePrompt、positivePromptTranslate、negativePrompt、negativePromptTranslate 五个字段
- 不要返回和返回数据无关的问候、提示以及其他信息
"""
request_example = "二战时期的护士"
response_example = """\
```json
{
	"description":"一个穿着德国制服的二战时期的护士，手持一瓶葡萄酒和听诊器，穿着白色服装坐在一张桌子旁边，背景是一张桌子。",
	"positivePrompt":"A WWII-era nurse in a German uniform, holding a wine bottle and stethoscope, sitting at a table in white attire, with a table in the background, masterpiece, best quality, 8k, illustration style, best lighting, depth of field, detailed character, detailed environment.",
	"positivePromptTranslate":"一位穿着德国制服的二战时期的护士，手持一瓶葡萄酒和听诊器，穿着白色服装坐在一张桌子旁边，背景是一张桌子，画作具有杰出的艺术水平，最佳画质，8K分辨率，采用插画风格，最佳光线和景深，角色和环境都展现出精细的细节。",
	"negativePrompt": "Cartoon, 3D, disfigured, bad art, deformed, extra limbs, close-up, black and white, weird colors, blurry, duplicate, morbid, mutilated, out of frame, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, ugly, blurry, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, out of frame, ugly, extra limbs, bad anatomy, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, mutated hands, fused fingers, too many fingers, long neck, Photoshop, video game, ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, mutation, mutated, extra limbs, extra legs, extra arms, disfigured, deformed, cross-eyed, body out of frame, blurry, bad art, bad anatomy, 3D render, watermark, logo",
	"negativePromptTranslate":"卡通，3D，畸形，糟糕的艺术，变形，额外的肢体，特写，黑白，奇怪的颜色，模糊，重复，病态，残缺，超出画框，额外的手指，变异的手，画得差劲的手，画得差劲的脸，突变，畸形，丑陋，模糊，不良解剖结构，不良比例，额外的肢体，克隆的脸，畸形，超出画框，丑陋，额外的肢体，不良解剖结构，恶心的比例，畸形的肢体，缺失的手臂，缺失的腿，额外的胳膊，额外的腿，变异的手，融合的手指，手指过多，颈部过长，Photoshop，视频游戏，丑陋，瓦片状，画得差劲的手，画得差劲的脚，画得差劲的脸，超出画框，突变，变异，额外的肢体，额外的腿，额外的胳膊，畸形，糟糕的解剖结构，3D渲染，水印，logo"
}
```
"""
default_messages = [
    {"role": "system", "content": default_system_prompt},
    {"role": "user", "content": request_example},
    {"role": "assistant", "content": response_example},
]


def get_setting():
    # 获取当前脚本文件的路径
    current_path = os.path.dirname(os.path.abspath(__file__))
    # 配置的路径
    setting_file_path = os.path.join(
        current_path, "..", "..", "user/default/comfy.settings.json"
    )
    try:
        # 打开文件
        with open(setting_file_path, "r") as file:
            # 读取文件内容
            content = file.read()
            return json.loads(content)
    except FileNotFoundError:
        print(f"File '{setting_file_path}' is not exists.")
        return None
    except Exception:
        raise


def parse_data(raw_text: str) -> any:
    """
    解析为 json 格式的数据
    """
    striped_content = raw_text.strip()
    json_content = striped_content[
        striped_content.find("{") - 1 : striped_content.rfind("}") + 1
    ]
    return json.loads(json_content)


class ChatGPTPrompt:
    """
    A example node

    Class methods
    -------------
    INPUT_TYPES (dict):
        Tell the main program input parameters of nodes.

    Attributes
    ----------
    RETURN_TYPES (`tuple`):
        The type of each element in the output tulple.
    RETURN_NAMES (`tuple`):
        Optional: The name of each output in the output tulple.
    FUNCTION (`str`):
        The name of the entry-point method. For example, if `FUNCTION = "execute"` then it will run Example().execute()
    OUTPUT_NODE ([`bool`]):
        If this node is an output node that outputs a result/image from the graph. The SaveImage node is an example.
        The backend iterates on these output nodes and tries to execute all their parents if their parent graph is properly connected.
        Assumed to be False if not present.
    CATEGORY (`str`):
        The category the node should appear in the UI.
    execute(s) -> tuple || None:
        The entry point method. The name of this method must be the same as the value of property `FUNCTION`.
        For example, if `FUNCTION = "execute"` then this method's name must be `execute`, if `FUNCTION = "foo"` then it must be `foo`.
    """

    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(s):
        """
        Return a dictionary which contains config for all input fields.
        Some types (string): "MODEL", "VAE", "CLIP", "CONDITIONING", "LATENT", "IMAGE", "INT", "STRING", "FLOAT".
        Input types "INT", "STRING" or "FLOAT" are special values for fields on the node.
        The type can be a list for selection.

        Returns: `dict`:
            - Key input_fields_group (`string`): Can be either required, hidden or optional. A node class must have property `required`
            - Value input_fields (`dict`): Contains input fields config:
                * Key field_name (`string`): Name of a entry-point method's argument
                * Value field_config (`tuple`):
                    + First value is a string indicate the type of field or a list for selection.
                    + Secound value is a config for type "INT", "STRING" or "FLOAT".
        """
        return {
            "required": {
                "model": (
                    ["gpt-3.5-turbo", "gpt-4"],
                    {"default": "gpt-3.5-turbo"},
                ),
                "user_prompt": (
                    "STRING",
                    {
                        "multiline": True,  # True if you want the field to look like the one on the ClipTextEncode node
                        "default": "一个女孩",
                    },
                ),
                # "control_after_generate": (["randomize", "fixed"],),
            },
        }

    RETURN_TYPES = ("STRING", "STRING", "STRING", "STRING", "STRING")
    RETURN_NAMES = (
        "description",
        "positive_prompt",
        "negative_prompt",
        "positive_prompt_translate",
        "negative_prompt_translate",
    )

    FUNCTION = "execute"

    # OUTPUT_NODE = True

    CATEGORY = "Easy Tools"

    def execute(
        self,
        model: str,
        user_prompt: str,
        # control_after_generate: str,
    ):
        if not user_prompt:
            # 不处理空数据
            return ("", "", "", "", "")

        # TODO 返回上一次的值
        # if control_after_generate == "fixed":
        #     pass
        print(f"chatgpt with {model}: {user_prompt}")
        # 从配置文件读取
        settings = get_setting()
        token = ""
        base_url = None
        if settings:
            base_url = settings["EasyTools.ChatGPTPrompt.BaseURL"]
            token = settings["EasyTools.ChatGPTPrompt.Token"]
        if not token:
            raise ValueError("Token can not be empty")
        resp_data = self._send_message(
            token,
            base_url,
            model,
            user_prompt,
        )
        data = parse_data(resp_data)
        return (
            data["description"],
            data["positivePrompt"],
            data["negativePrompt"],
            data["positivePromptTranslate"],
            data["negativePromptTranslate"],
        )

    def _send_message(
        self,
        api_key: str,
        base_url: str,
        model: str,
        user_prompt: str,
    ) -> str:
        messages = [
            *default_messages,
            {"role": "user", "content": user_prompt},
        ]
        client = openai.OpenAI(
            api_key=api_key,
            base_url=base_url,
        )
        try:
            resp = client.chat.completions.create(
                model=model, messages=messages, stream=False
            )
        except openai.APIConnectionError as e:
            print("Server connection error: {e.__cause__}")  # from httpx.
            raise
        except openai.RateLimitError as e:
            print(f"OpenAI RATE LIMIT error {e.status_code}: (e.response)")
            raise
        except openai.APIStatusError as e:
            print(f"OpenAI STATUS error {e.status_code}: (e.response)")
            raise
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            raise
        return resp.choices[0].message.content


# A dictionary that contains all nodes you want to export with their names
# NOTE: names should be globally unique
NODE_CLASS_MAPPINGS = {"ChatGPTPrompt": ChatGPTPrompt}

# A dictionary that contains the friendly/humanly readable titles for the nodes
NODE_DISPLAY_NAME_MAPPINGS = {"ChatGPTPrompt": "ChatGPT提示词"}
