import { iconData } from "./iconData";

export type IconProps {
  name: string;
  viewBox: string;
  height: string;
  width: string;
}

const Icon = ({ name, viewBox, height, width }: IconProps): JSX.Element => (
  <svg
    className="p-.4 pb-.8 fill-primaryColor"
    height={height ?? "2rem"}
    width={width ?? "2rem"}
    viewBox={viewBox || "0 0 512 512"}
  >
    {iconData[name]}
  </svg>
);

export default Icon;
