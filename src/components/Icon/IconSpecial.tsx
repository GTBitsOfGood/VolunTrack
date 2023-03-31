import { IconProps } from "./Icon";
import { iconData } from "./iconData";

type IconSpecialProps = IconProps & {
  href: string;
  id: string;
};

const IconSpecial = ({
  width,
  height,
  viewBox,
  name,
  href,
  id,
}: IconSpecialProps): JSX.Element => (
  <svg
    fill="none"
    width={width}
    height={height}
    viewBox={viewBox}
    href={href}
    id={id}
  >
    {iconData[name]}
  </svg>
);

export default IconSpecial;
