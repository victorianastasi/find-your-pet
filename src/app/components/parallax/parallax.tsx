"use client";
import Image from "next/image";

import React, { useRef } from "react";
import { Parallax, ParallaxLayer, IParallax } from "@react-spring/parallax";
import Link from "next/link";

import { PiPaperPlaneTiltFill } from "react-icons/pi";
import { IoChatboxEllipses } from "react-icons/io5";
import { BiSolidMessageSquareAdd } from "react-icons/bi";

const finder = "/img/finder.svg";
const search = "/img/search.png";
const cloud = "/img/cloud.svg";
const global = "/img/global.svg";
const contact = "/img/contact.svg";
const data = "/img/data.svg";

{
  /* <a href="https://www.freepik.com/free-vector/journey-route-planning-city-travel-urban-tourism-cartography-idea-girl-navigating-with-paper-map-cartoon-character-old-fashioned-orientation-tool_12146022.htm#query=location%20illustration&position=3&from_view=keyword&track=ais&uuid=184bb4e8-1ec9-40ef-acfd-71e0ec62a92d">Image by vectorjuice</a> on Freepik */
}
{
  /* <a href="https://storyset.com/business">Business illustrations by Storyset</a> */
}
{
  /* <a href="https://storyset.com/work">Work illustrations by Storyset</a> */
}
{
  /* <a href="https://storyset.com/social-media">Social media illustrations by Storyset</a> */
}
export default function ParallaxCover() {
  const parallaxRef = useRef<IParallax>(null!);
  return (
    <Parallax ref={parallaxRef} pages={3} id="parallax-cover bg-parallax">
      <ParallaxLayer
        offset={1}
        speed={1}
        style={{ backgroundColor: "rgb(165 180 252)" }}
      />
      <ParallaxLayer
        offset={2}
        speed={1}
        style={{ backgroundColor: "#87BCDE" }}
      />

      <ParallaxLayer offset={0} speed={0} factor={3} className="bg-stars" />

      <ParallaxLayer
        offset={1.3}
        speed={-0.3}
        style={{ pointerEvents: "none" }}
      >
        <Image
          src={search}
          alt="img"
          width={240}
          height={240}
          style={{ marginLeft: "70%" }}
          className="md:w-auto w-1/3"
        ></Image>
      </ParallaxLayer>

      <ParallaxLayer offset={1} speed={0.8} style={{ opacity: 0.1 }}>
        <Image
          src={cloud}
          alt=""
          width={416}
          height={256}
          style={{ display: "block", width: "20%", marginLeft: "55%" }}
        ></Image>
        <Image
          src={cloud}
          alt=""
          width={416}
          height={256}
          style={{ display: "block", width: "10%", marginLeft: "15%" }}
        ></Image>
      </ParallaxLayer>

      <ParallaxLayer offset={1.75} speed={0.5} style={{ opacity: 0.1 }}>
        <Image
          src={cloud}
          alt=""
          width={416}
          height={256}
          style={{ display: "block", width: "20%", marginLeft: "70%" }}
        ></Image>
        <Image
          src={cloud}
          alt=""
          width={416}
          height={256}
          style={{ display: "block", width: "20%", marginLeft: "40%" }}
        ></Image>
      </ParallaxLayer>

      <ParallaxLayer offset={1} speed={0.2} style={{ opacity: 0.2 }}>
        <Image
          src={cloud}
          alt=""
          width={416}
          height={256}
          style={{ display: "block", width: "10%", marginLeft: "10%" }}
        ></Image>
        <Image
          src={cloud}
          alt=""
          width={416}
          height={256}
          style={{ display: "block", width: "20%", marginLeft: "75%" }}
        ></Image>
      </ParallaxLayer>

      <ParallaxLayer offset={1.6} speed={-0.1} style={{ opacity: 0.4 }}>
        <Image
          src={cloud}
          alt=""
          width={416}
          height={256}
          style={{ display: "block", width: "20%", marginLeft: "60%" }}
        ></Image>
        <Image
          src={cloud}
          alt=""
          width={416}
          height={256}
          style={{ display: "block", width: "25%", marginLeft: "30%" }}
        ></Image>
        <Image
          src={cloud}
          alt=""
          width={416}
          height={256}
          style={{ display: "block", width: "10%", marginLeft: "80%" }}
        ></Image>
      </ParallaxLayer>

      <ParallaxLayer offset={2.6} speed={0.4} style={{ opacity: 0.6 }}>
        <Image
          src={cloud}
          alt=""
          width={416}
          height={256}
          style={{ display: "block", width: "20%", marginLeft: "5%" }}
        ></Image>
        <Image
          src={cloud}
          alt=""
          width={416}
          height={256}
          style={{ display: "block", width: "15%", marginLeft: "75%" }}
        ></Image>
      </ParallaxLayer>

      <ParallaxLayer
        offset={2.5}
        speed={-0.4}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <Image
          src={global}
          alt="img"
          width={500}
          height={500}
          className="mx-auto img-rotate"
        ></Image>
      </ParallaxLayer>

      <ParallaxLayer
        offset={2}
        speed={-0.3}
        style={{
          backgroundSize: "80%",
          backgroundPosition: "center",
        }}
      />

      <ParallaxLayer
        offset={0}
        speed={0.1}
        className="flex items-center justify-center flex-wrap flex-column md:flex-row px-4 "
      >
        <div className="flex flex-col gap-8 md:gap-10 md:flex-row-reverse md:items-center max-w-4xl">
          <span>
            <span className="text-white text-5xl md:text-6xl font-bold inline-block w-64 md:w-72">
              Encuentra a tu mascota
            </span>
            <Link
              href="/search"
              className="group bg-slate-50 hover:bg-amber-600 hover:shadow-lg hover:scale-105 transition-all rounded-full px-3 md:px-8 mt-6 py-3 shadow-lg w-fit flex items-center justify-center gap-3 max-[320px]:gap-2 max-[320px]:text-sm md:text-xl "
            >
              <PiPaperPlaneTiltFill
                size={20}
                className="group-hover:text-white text-amber-600"
                style={{ minWidth: "20px" }}
              />
              <span className="group-hover:text-white">
                Ver todas las publicaciones
              </span>
            </Link>
          </span>
          <Image
            src={finder}
            alt="img"
            width={250}
            height={250}
            className="rounded-full mx-auto md:w-96 md:h-96"
          ></Image>
        </div>
      </ParallaxLayer>

      <ParallaxLayer
        offset={1}
        speed={0.1}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="flex flex-col-reverse gap-0 items-center relative w-[500px]">
          <Link
            href="/add"
            className="group bg-slate-50 hover:bg-indigo-600 hover:shadow-lg hover:scale-105 transition-all rounded-full shadow-lg w-fit mx-2 px-2 md:px-12 py-3 flex items-center justify-center gap-3 max-[320px]:text-sm md:text-xl absolute md:bottom-0 bottom-[-8px]"
          >
            <BiSolidMessageSquareAdd
              size={20}
              className="group-hover:text-white text-indigo-600"
              style={{ minWidth: "20px" }}
            />
            <span className="group-hover:text-white">
              Agrega los datos de tu mascota
            </span>
          </Link>
          <Image
            src={data}
            alt=""
            width={400}
            height={400}
            className="mx-auto md:w-full w-full"
          ></Image>
        </div>
      </ParallaxLayer>

      <ParallaxLayer
        offset={2}
        speed={-0}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="flex flex-col gap-4 items-center mx-4 relative p-12 mb-40 md:mb-20 contact-container">
          <div
            className=" bg-blue-100/50 backdrop-blur-md rounded-full absolute top-0 w-full h-full"
            style={{ zIndex: "-1" }}
          ></div>

          <Link
            href="/contact"
            className="group bg-slate-50 hover:bg-sky-500 hover:shadow-lg hover:scale-105 transition-all rounded-full shadow-lg w-fit px-6 md:px-12 md:mx-20 py-3 flex items-center justify-center gap-3 max-[320px]:text-sm md:text-xl "
          >
            <IoChatboxEllipses
              size={20}
              className="group-hover:text-white text-sky-500"
              style={{ minWidth: "20px" }}
            />
            <span className="group-hover:text-white">Contactanos</span>
          </Link>

          <Image
            src={contact}
            alt=""
            width={500}
            height={500}
            className="mx-auto"
            style={{ width: "100%" }}
          ></Image>
        </div>
      </ParallaxLayer>
    </Parallax>
  );
}
