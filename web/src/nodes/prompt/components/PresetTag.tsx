import { Tag, TagProps } from "antd";
interface Props {}
const PresetTag = ({
  children,
  ...rest
}: React.PropsWithChildren<Props & TagProps>) => {
  return (
    <Tag {...rest} color="purple" closable>
      {children}
    </Tag>
  );
};

export default PresetTag;
