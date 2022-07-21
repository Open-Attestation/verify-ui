import React from "react";

interface Props {
  children: any;
  open: boolean;
  onClick: () => void;
  className?: string;
  style?: Record<string, string>;
}

export const BackDrop: React.FC<Props> = ({ open, onClick, children, className, style }) => {
  if (!open) return null;

  return (
    <div
      onClick={onClick}
      className={`fixed
            flex flex-col items-center justify-center
            bg-gray-700/50
            h-screen
            w-screen         
            z-10
            top-0 bottom-0 left-0 sm:right-0 ${className} `}
      style={style}
    >
      <div onClick={(event) => event.stopPropagation()}>{children}</div>
    </div>
  );
};
