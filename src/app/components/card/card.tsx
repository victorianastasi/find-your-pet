import * as React from "react";
import Image from "next/image";
import { IoMail, IoSquare } from "react-icons/io5";
import { IoLogoWhatsapp } from "react-icons/io";
import { RiUserFill } from "react-icons/ri";

import "./card.css";
import { UserAuth } from "@/app/context/AuthContext";

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
  email?: string;
  userName?: string;
  phone?: string;
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
    <div className="md:w-[300px] md:min-w-[300px] h-[180px] md:h-full relative ">
      <Image
        src={src == "" ? defaulPets : src}
        alt={alt}
        fill={true}
        className="object-cover object-center card__image"
      ></Image>
    </div>
  );
};

const CardTitle: React.FC<{ children?: string }> = ({ children = "" }) => {
  return (
    <h3 className="poppins-700 text-lg text-center md:text-left">
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
    date,
    email,
    userName,
    phone,
  } = props;

  const { user } = UserAuth();

  let cardClassName = `flex flex-col md:flex-row md:gap-2 w-full max-w-xs md:max-w-[620px] bg-slate-200 rounded-lg text-slate-700 shadow-2xl cabin-400 ${customClass}`;

  return (
    <div className={cardClassName}>
      <CardImage src={imageSrc} alt={title}></CardImage>
      <div className="px-2 py-3 md:p-6 md:pl-4 flex flex-col gap-1.5 w-full">
        {(location || district) && (
          <div className="text-right">
            <CardBadge customClass="bg-amber-700 mr-1">{location}</CardBadge>
            <CardBadge customClass="bg-slate-700">{district}</CardBadge>
          </div>
        )}
        <div className="flex justify-between items-center bg-slate-50 rounded px-2">
          <CardTitle>{title}</CardTitle>
          {date ? (
            <span className="text-sm poppins-700 text-slate-600 px-1 rounded">
              {date}
            </span>
          ) : (
            <span className="text-sm font-bold bg-indigo-100 px-1 rounded">
              Sin fecha
            </span>
          )}
        </div>

        <p className="text-sm">Edad: {age}</p>
        {description && <p className="text-sm">{description}</p>}
        {user.email == null ? (
          <div className="bg-indigo-50/80 rounded p-2 text-slate-600 text-sm">
            <p>
              Debes{" "}
              <a
                href="/login"
                className="text-blue-500 hover:text-blue-800 visited:text-blue-800"
              >
                acceder a tu cuenta{" "}
              </a>
              para ver los datos del anunciante.
            </p>
          </div>
        ) : (
          <>
            <hr className="bg-slate-300 h-[2px]" />
            <div className="text-sm">
              <p className="mb-1 text-xs">Publicado por:</p>
              <CardContact icon={<RiUserFill />}>{userName}</CardContact>
              <CardContact icon={<IoLogoWhatsapp />}>
                <a href={`https://wa.me/${phone}`}>{phone}</a>
              </CardContact>
              <CardContact icon={<IoMail />}>
                <a href={`mailto:${email}`}>{email}</a>
              </CardContact>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
