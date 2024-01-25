import { Card, CardProps, Drawer, Space, Tabs, Tag } from "antd";
import { useEffect } from "react";
import PresetTag from "./components/PresetTag";
import startPreset from "./data/01起手式.json";
import personPreset from "./data/02人物.json";
import clothPreset from "./data/03服饰.json";
import hairPreset from "./data/04人物发型.json";
import actionPreset from "./data/05动作.json";
import facePreset from "./data/06面部表情.json";
import animalPreset from "./data/07动物装饰.json";
import scenePreset from "./data/08场景.json";
import newClothPreset from "./data/10新服饰.json";
import magicPreset from "./data/11艺术魔法.json";
import colorPreset from "./data/12颜色.json";
import { OptionItem } from "@/types/utils";
import { transEnumToOptions } from "@/utils";
import { usePresetStore } from "./store";
import styles from "./PresetDrawer.module.less";
import classNames from "classnames";
const presetsMap: Record<string, any> = {};
const parseData = () => {
  const collections = [
    startPreset,
    personPreset,
    clothPreset,
    hairPreset,
    actionPreset,
    facePreset,
    animalPreset,
    scenePreset,
    newClothPreset,
    magicPreset,
    colorPreset,
  ];
  for (const collection of collections) {
    for (const key in collection) {
      const tags = collection[key as keyof typeof collection] as any;
      for (const label in tags) {
        //@ts-ignore
        presetsMap[tags[label]] = label;
      }
    }
  }
};
const tabs = [
  { label: "起手式01", key: "start", value: startPreset },
  { label: "人物02", key: "person", value: personPreset },
  { label: "服饰03", key: "cloth", value: clothPreset },
  { label: "新服饰10", key: "newCloth", value: newClothPreset},
  { label: "发型04", key: "hair", value: hairPreset },
  { label: "动作05", key: "action", value: actionPreset },
  { label: "表情06", key: "face", value: facePreset },
  { label: "动物装饰07", key: "animal", value: animalPreset },
  { label: "场景08", key: "scene", value: scenePreset },
  { label: "魔法11", key: "magic", value: magicPreset},
  { label: "颜色12", key: "color", value: colorPreset},
];
const GroupPreset = ({
  tags,
  onChoice,
  ...rest
}: CardProps & {
  tags: OptionItem[];
  onChoice?: (value: any, item: OptionItem) => void;
}) => {
  return (
    <Card {...rest}>
      <Space wrap>
        {tags.map((tag) => {
          return (
            <Tag
              className="cursor-pointer"
              key={tag.value}
              onClick={() => onChoice?.(tag.value, tag)}
              color="#108ee9"
            >
              {tag.label}
            </Tag>
          );
        })}
      </Space>
    </Card>
  );
};
const PresetDrawer = () => {
  const { open, tags, updateTags, close } = usePresetStore((state) => ({
    open: state.open,
    tags: state.tags,
    updateTags: state.updateTags,
    close: state.closePreset,
  }));
  useEffect(() => {
    parseData();
  }, []);
  return (
    <Drawer
      open={open}
      placement="left"
      width={500}
      zIndex={99999}
      destroyOnClose
      onClose={close}
    >
      <div className="both-full flex flex-col">
        <div className="tags mb-2">
          <Space wrap>
            {tags.map((tag) => {
              return (
                <PresetTag
                  key={tag}
                  onClose={() => updateTags(tags.filter((t) => t !== tag))}
                >
                  {presetsMap[tag] ?? tag}
                </PresetTag>
              );
            })}
          </Space>
        </div>
        <div className="presets flex-1 overflow-auto">
          <Tabs
            className={classNames("flex", "both-full", styles.tabs)}
            items={tabs.map((tab) => {
              return {
                label: tab.label,
                key: tab.key,
                children: (
                  <Space wrap>
                    {Object.entries(tab.value).map(([title, groupData]) => {
                      return (
                        <GroupPreset
                          key={title}
                          title={title}
                          tags={transEnumToOptions(groupData)}
                          onChoice={(value) => {
                            updateTags([...tags, value]);
                          }}
                        />
                      );
                    })}
                  </Space>
                ),
              };
            })}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default PresetDrawer;
