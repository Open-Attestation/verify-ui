import React from "react";

interface cardProps {
  className?: string;
  padding?: string;
  children: any;
  style?: Record<string, string>;
  onClick?: (...args: any) => any;
  [props: string]: any;
}

const CustomCard: React.FC<cardProps> = ({
  className = "",
  padding = "p-4",
  children,
  style = {},
  onClick = () => {},
  ...props
}) => {
  className = `bg-white rounded-md
        shadow
        ${padding}
        ${className}`;
  return (
    <div className={className} style={style} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

interface Props {
  onClose: () => void;
  child?: any;
}

export const QrPopup: React.FC<Props> = ({ onClose, child }) => (
  <CustomCard>
    <div className="flex flex-col max-w-md">
      <img
        src="/images/icon-cross.svg"
        onClick={onClose}
        width="40"
        height="40"
        className="cursor-pointer self-end mb-5"
      />
      {child}
    </div>
  </CustomCard>
);
