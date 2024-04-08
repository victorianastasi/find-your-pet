import * as React from "react";
import Image from "next/image";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { IoMail, IoSquare, IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { IoLogoWhatsapp } from "react-icons/io";
import "./card.css";

interface CardContactProps {
  children?: React.ReactNode;
  icon?: JSX.Element;
}

interface CardComponentProps {
  imageSrc?: string;
  location?: string;
  district?: string;
  title: string;
  description?: string | JSX.Element;
  customClass?: string;
  age?: string;
  date?: string;
}

const CardBadge: React.FC<{ children?: string; customClass?: string }> = ({
  children,
  customClass,
}) => {
  if (!children) {
    return null;
  }
  return (
    <span
      className={`uppercase text-[11px] text-white px-2 leading-6 rounded-full inline-block mb-2 ${customClass}`}
    >
      {children}
    </span>
  );
};

const defaulPets = "/img/pets-card.svg";
{
  /* <a href="https://storyset.com/friends">Friends illustrations by Storyset</a> */
}
const CardImage: React.FC<{ alt?: string; src?: string }> = ({
  alt = "Imagen predeterminada",
  src = defaulPets,
}) => {
  return (
    <Image
      src={src == "" ? defaulPets : src}
      alt={alt}
      width={300}
      height={180}
      className="card__image"
    ></Image>
  );
};

const CardTitle: React.FC<{ children?: string }> = ({ children = "" }) => {
  return (
    <h3 className="poppins-700 text-lg bg-slate-50 rounded md:pl-2 text-center md:text-left">
      {children.charAt(0).toUpperCase() + children.slice(1).toLocaleLowerCase()}
    </h3>
  );
};

const CardContact: React.FC<CardContactProps> = ({
  children,
  icon = <IoSquare />,
}) => {
  if (!children && !icon) {
    return null;
  }
  return (
    <p className="mb-1 flex gap-1 items-center card__contact">
      {React.cloneElement(icon, { className: "text-base inline-block" })}
      <span>{children}</span>
    </p>
  );
};

export const CardComponent: React.FC<CardComponentProps> = (
  props: React.PropsWithChildren<CardComponentProps>
) => {
  const {
    imageSrc,
    location,
    district,
    title,
    description,
    customClass = "",
    age,
    date
  } = props;

  let cardClassName = `flex flex-col md:flex-row gap-2 w-full max-w-xs md:max-w-[620px] bg-slate-200 rounded-lg text-slate-800 shadow-2xl cabin-400 ${customClass}`;
  /* let cardClassName = `flex flex-col md:flex-row gap-2 w-full max-w-xs md:max-w-2xl lg:max-w-5xl bg-slate-200 rounded-lg text-slate-800 shadow-2xl ${customClass}`; */

  return (
    <div className={cardClassName}>
      <CardImage src={imageSrc} alt={title}></CardImage>
      <div className="px-2 py-3 md:p-6 md:pl-4 flex flex-col gap-1.5 w-full">
        {(location || district) && (
          <div className="text-right">
            <CardBadge customClass="bg-amber-700 mr-1">{location}</CardBadge>
            <CardBadge customClass="bg-slate-700">{`Partido de ${district}`}</CardBadge>
          </div>
        )}
        <CardTitle>{title}</CardTitle>
        <p>Edad: {age}</p>
        {description && <p>{description}</p>}
        {date ? <p className="text-sm">Fecha en que se perdió: {date}</p> : <p className="text-sm">Sin información sobre la fecha en que se perdió</p>}
        <hr className="bg-slate-300 h-[2px]" />
        <div className="text-sm">
          <p className="mb-1">Publicado por:</p>
          {location && (
            <CardContact icon={<IoLogoWhatsapp />}>
              Teléfono:&nbsp;
              <a href={`tel:${location}`}>{location}</a>
            </CardContact>
          )}
          {district && (
            <CardContact icon={<IoMail />}>
              Email:&nbsp;
              <a href={`mailto:${district}`}>{district}</a>
            </CardContact>
          )}
        </div>
        {/* <hr className="bg-slate-300 h-[2px]" />
        <div className="flex items-center justify-end text-xs gap-1">
            <IoChatbubbleEllipsesSharp className="inline-block text-sm" />
            <span>Comentarios</span>
            <span className="">0</span>
        </div> */}
      </div>
    </div>
  );
};
