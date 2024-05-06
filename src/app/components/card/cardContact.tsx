import * as React from "react";
import { IoInformationCircle } from "react-icons/io5";
import "./card.css";

interface CardContactComponentProps {
  icon?: JSX.Element;
  iconBg?: string;
  iconBgHex?: string;
  iconClasses?: string;
  children?: React.ReactNode;
}

export const CardContactComponent: React.FC<CardContactComponentProps> = (
  props: React.PropsWithChildren<CardContactComponentProps>
) => {
  const {
    icon = <IoInformationCircle />,
    iconBg = "bg-orange-500",
    iconBgHex,
    iconClasses = "text-slate-50",
    children,
  } = props;

  let cardContactClasses =
    "p-8 rounded flex items-center justify-center min-h-36 relative";

  return (
    <div className="w-64 max-h-36">
      <div className="card-contact group z-[10] hover:relative">
        <div
          className={`${cardContactClasses} z-[1] ${iconBg} `}
          style={{ backgroundColor: iconBgHex }}
        >
          {React.cloneElement(icon, {
            className: iconClasses,
            size: 48,
          })}
        </div>
        <div
          className={`${cardContactClasses} translate-y-[-32px] md:translate-y-[-144px] group-hover:translate-y-[-4px] shadow-2xl transition-all bg-slate-50/60 flex-col pb-0 md:pb-8 gap-2 text-slate-600 font-bold backdrop-blur-lg`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
