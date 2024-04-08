"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { MdLocationPin, MdContentPasteSearch, MdOutlineClose } from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import { IoChatboxEllipses } from "react-icons/io5";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import { usePathname } from "next/navigation";

export default function NavbarComponent() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const headerContentRef = useRef<HTMLDivElement>(null);
  
  const [isContentVisible, setIsContentVisible] = useState(false);

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

  useEffect(() => {
    let timeoutId: NodeJS.Timeout; 
      if (!isContentVisible) {
        timeoutId = setTimeout(() => {
          headerContentRef.current?.classList.add('hidden');
        }, 250);
      }
    
    return () => clearTimeout(timeoutId);
  }, [isContentVisible]);
  
  return (
    <>
    <header
      className={`${pathname == '/' ? "absolute md:left-[51%] md:translate-x-[-51%]" : "fixed md:left-[53%] md:translate-x-[-53%]"} top-0 z-10 md:w-[95%] lg:w-[940px] xl:w-[1130px] w-full left-0 border-radius-bottom-lg ${scrolled ? "bg-black/20" : ""}`} 
    >
      <nav className="flex items-center justify-between flex-wrap px-4 py-1 md:px-4 md:py-2 backdrop-blur-md border-radius-bottom-lg" >
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
          >
            <FiMenu size={22} />
          </button>
        </div>
        <div
          className={`md:flex md:flex-row gap-4  md:bg-transparent md:w-auto md:min-h-fit md:pt-0 md:px-0 flex flex-col ml-auto min-h-screen w-2/3 rounded-md absolute md:static top-[56px] right-0 bg-white/80 backdrop-blur-md ${
            isContentVisible
              ? "navbar-slide-in"
              : "navbar-slide-out"
          }`}
          ref={headerContentRef}
        >
          <button className="md:hidden" onClick={close}>
            <MdOutlineClose
              size={24}
              className="ml-auto text-gray-700 mb-2 mt-2 mr-2"
            />
          </button>
          <Link href="/search" className="group flex items-center gap-2 text-sm px-4 py-2 leading-none border rounded-full text-gray-700 border-gray-700 md:text-white md:border-white hover:border-transparent hover:text-amber-600 hover:bg-white mb-4 md:mb-0 mx-6 md:mx-0">
            <MdContentPasteSearch
              size={24}
              className="md:text-white group-hover:text-amber-600"
            ></MdContentPasteSearch>
            <span className="text-left">Ver todo</span>
          </Link>
          <Link href="/add" className="group flex items-center gap-2 text-sm px-4 py-2 leading-none border rounded-full text-gray-700 border-gray-700 md:text-white md:border-white hover:border-transparent hover:text-amber-600 hover:bg-white mb-4 md:mb-0 mx-6 md:mx-0">
            <BiSolidMessageSquareAdd
              size={24}
              className="md:text-white group-hover:text-amber-600"
            ></BiSolidMessageSquareAdd>
            <span className="text-left">Agrega tu mascota</span>
          </Link>
          <Link href="/search" className="group flex items-center gap-2 text-sm px-4 py-2 leading-none border rounded-full text-gray-700 border-gray-700 md:text-white md:border-white hover:border-transparent hover:text-amber-600 hover:bg-white mx-6 md:mx-0">
            <IoChatboxEllipses 
              size={24}
              className="md:text-white group-hover:text-amber-600"
            ></IoChatboxEllipses >
            <span className="text-left">Contactanos</span>
          </Link>
        </div>
      </nav>
      <div className={`backdrop-header z-[-1] relative bg-transparent ${
            isContentVisible
              ? "backdrop-blur-md min-h-screen"
              : "backdrop-blur-0"
          }`}>

    </div>
    </header>
    
    </>
    
  );
}
