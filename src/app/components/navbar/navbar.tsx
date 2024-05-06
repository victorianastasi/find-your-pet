"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  MdLocationPin,
  MdContentPasteSearch,
  MdOutlineClose,
} from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import { IoChatboxEllipses, IoLogIn, IoLogOut, IoChevronDown  } from "react-icons/io5";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import { HiMiniUserCircle } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import { PiNotebookFill } from "react-icons/pi";
import { UserAuth } from "@/app/context/AuthContext";

export default function NavbarComponent() {
  const { user, logOut, userDB } = UserAuth();

  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const headerContentRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const toggleAccountRef = useRef<HTMLDivElement>(null);

  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isAccountVisible, setIsAccountVisible] = useState(false);

  const handleLogOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const handleScroll = (position: number) => {
      if (position > 150) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const parallax = document.getElementById("parallax-cover");

    if (parallax) {
      parallax.addEventListener("scroll", () => {
        handleScroll(parallax.scrollTop);
      });

      return () => {
        parallax.removeEventListener("scroll", () => {
          handleScroll(parallax.scrollTop);
        });
      };
    } else {
      window.addEventListener("scroll", () => {
        handleScroll(window.scrollY);
      });

      return () => {
        window.removeEventListener("scroll", () => {
          handleScroll(window.scrollY);
        });
      };
    }
  }, []);

  const toggle = () => {
    if (window.innerWidth > 768) {
      setIsContentVisible(false);
    } else {
      setIsContentVisible(!isContentVisible);
    }
  };

  const close = () => {
    setIsContentVisible(false);
  };

  const toggleAccount = () => {
    setIsAccountVisible(!isAccountVisible);
  };
  

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (!isContentVisible) {
      timeoutId = setTimeout(() => {
        headerContentRef.current?.classList.add("hidden");
      }, 250);
    }

    return () => clearTimeout(timeoutId);
  }, [isContentVisible]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerContentRef.current &&
        !headerContentRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setIsContentVisible(false);
        setIsAccountVisible(false);
      } else if (
        toggleAccountRef.current &&
        !toggleAccountRef.current.contains(event.target as Node)
      ) {
        setIsAccountVisible(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [headerContentRef, toggleButtonRef, toggleAccountRef]);
  
  const LinksStyles =
    "group flex items-center gap-2 text-[13px] 880:text-sm p-2 880:px-4 leading-none rounded-full border-2 md:border-1 hover:border-transparent hover:text-amber-600 hover:bg-white mx-6 md:mx-0 max-w-[205px] border-gray-700";
  const LinksIconStyles =
    "text-gray-700 md:text-white md:group-hover:text-amber-600";
  
    const handleLinkClick = () => {
    setIsContentVisible(false);
  };

  const Links = () => {
    const filteredLinks = user.email != null ? LINKS_DATA.filter(link => link.href !== "/login") : LINKS_DATA;
    return (
      <>
        {filteredLinks.map(({ href, text, icon }, index) => (
          <Link
            key={index}
            href={href}
            onClick={handleLinkClick}
            className={`${LinksStyles} ${
              pathname == href
                ? "bg-slate-50/75 md:text-gray-900 md:border-slate-50/10 "
                : "text-gray-700 md:border-slate-50  md:text-white "
            }`}
          >
            {React.cloneElement(icon, {
              className: `text-xl md:text-lg lg:text-2xl ${
                pathname == href
                  ? "text-amber-600"
                  : LinksIconStyles
              }`,
            })}
            <span className="text-left max-[320px]:text-[13px]">{text}</span>
          </Link>
        ))}
      </>
    );
  };

  const LINKS_DATA = [
    { href: "/search", icon: <MdContentPasteSearch />, text: "Ver todo" },
    { href: "/add", icon: <BiSolidMessageSquareAdd />, text: "Agrega tu mascota" },
    { href: "/contact", icon: <IoChatboxEllipses />, text: "Contactanos" },
    { href: "/login", icon: <IoLogIn />, text: "Log In" }
  ];

  return (
    <>
      <header
        className={`${
          pathname == "/"
            ? "absolute md:left-[51%] md:translate-x-[-51%]"
            : "fixed md:left-[53%] md:translate-x-[-53%]"
        } top-0 z-10 md:w-[95%] lg:w-[940px] xl:w-[1130px] w-full left-0 border-radius-bottom-lg ${
          scrolled ? "bg-black/20" : ""
        }`}
      >
        <nav className="flex items-center justify-between flex-wrap px-4 py-1 md:px-4 md:py-2 backdrop-blur-md border-radius-bottom-lg">
          <Link
            href="/"
            className="flex items-center flex-shrink-0 text-white p-2 pl-0 rounded-full hover:text-amber-600 hover:bg-white"
          >
            <MdLocationPin size={32}></MdLocationPin>
            <span className="font-bold text-xl tracking-tight">PetsFinder</span>
          </Link>
          <div className="block md:hidden">
            <button
              className={`flex items-center p-2 border rounded ${
                isContentVisible
                  ? "bg-white text-amber-600"
                  : "text-gray-50 border-white"
              }`}
              onClick={toggle}
              aria-label="Menu"
              ref={toggleButtonRef}
            >
              <FiMenu size={22} />
            </button>
          </div>
          <div
            className={`md:flex md:flex-row gap-4 md:gap-1 880:gap-2 lg:gap-4 md:bg-transparent md:w-auto md:min-h-fit md:pt-0 md:px-0 flex flex-col ml-auto min-h-screen w-4/5 rounded-md absolute md:static top-[56px] right-0 bg-white/80 backdrop-blur-md ${
              isContentVisible ? "navbar-slide-in" : "navbar-slide-out"
            }`}
            ref={headerContentRef}
          >
            <button className="md:hidden" onClick={close}>
              <MdOutlineClose
                size={24}
                className="ml-auto text-gray-700 mb-2 mt-2 mr-2"
              />
            </button>
            <Links />
            {user.email != null && 
            <div className="md:relative mx-6 md:mx-0" ref={toggleAccountRef}>
              <button  onClick={toggleAccount} className={`group flex items-center gap-2 text-[13px] 880:text-sm p-2 880:px-4 py-2 leading-none rounded-full border-2 md:border-1 md:hover:bg-slate-900  max-w-[205px] border-gray-700 md:text-white w-full text-gray-700 ${isAccountVisible ? "bg-slate-900 text-white md:border-slate-900" : "bg-transparent md:border-slate-50 md:hover:border-slate-900"}`} >
                <HiMiniUserCircle className={`md:text-white md:group-hover:text-amber-400 text-xl md:text-lg lg:text-2xl `} />
                <span className={`text-left max-[320px]:text-[13px]`}>Tu cuenta</span>
                <IoChevronDown size={20} className={`md:text-white  ml-auto transition-all ${isAccountVisible ? "rotate-180" : "rotate-0"}`} />
              </button>
              <div className={`p-2 md:absolute right-0 top-12 md:min-w-64 border-2 border-slate-50 bg-slate-50/50 md:bg-slate-50 backdrop-blur-md text-slate-600 rounded-lg mt-1 md:mt-0 max-w-[405px] ${isAccountVisible ? "block" : "hidden"} md:text-right`}>
                <div className="text-sm py-2 border-t border-slate-100 pl-1 break-words flex flex-col ">
                  <span className="text-xs text-gray-400 tracking-wider">Usuario:</span>
                  <span className="font-bold">{userDB.userName}</span>
                </div>
                <div className="text-sm py-2 border-t border-slate-100 pl-1 break-words flex flex-col ">
                  <span className="text-xs text-gray-400 tracking-wider">Email:</span>
                  <span className="font-bold">{userDB.email}</span></div>
                <div className="text-sm py-2 border-y border-slate-100 pl-1 break-words flex flex-col ">
                  <span className="text-xs text-gray-400 tracking-wider">Teléfono:</span>
                  <span className="font-bold">{userDB.phone}</span></div>
                <Link href="/account" onClick={() => setIsAccountVisible(false)} className={`group flex items-center gap-2 text-sm px-4 py-1 mt-2 leading-none rounded-full border-2 md:border-1 hover:border-transparent hover:text-white hover:bg-slate-800 text-slate-800 border-slate-800 md:ml-auto w-fit`}>
                  <PiNotebookFill size={24} />
                  <span className="text-left font-semibold">Tus publicaciones</span>
                </Link>
                <button onClick={handleLogOut} className={`group flex items-center gap-2 text-sm px-4 py-1 mt-2 leading-none rounded-full border-2 md:border-1 hover:border-transparent hover:text-white hover:bg-red-800 text-red-800 border-red-800 md:ml-auto`}>
                  <IoLogOut size={24} />
                  <span className="text-left font-semibold">Cerrar sesión</span>
                </button>
              </div>
            </div>
            }
          </div>
        </nav>
        <div
          className={`backdrop-header z-[-1] relative bg-transparent ${
            isContentVisible
              ? "backdrop-blur-md min-h-screen"
              : "backdrop-blur-0"
          }`}
        ></div>
      </header>
    </>
  );
}
