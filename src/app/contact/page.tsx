"use client";
import React from "react";
import { CardContactComponent } from "../components/card/cardContact";
import { IoMail, IoLogoGithub } from "react-icons/io5";
import { IoLogoWhatsapp } from "react-icons/io";

export default function Contact() {

  return (
    <div className="main-bg pt-14 md:pt-16 mb-10 h-[calc(100vh-64px)]">
      <h1 className="text-center my-8 text-2xl font-bold text-slate-50">
        Contactanos
      </h1>
      <div className="flex flex-wrap items-center justify-center gap-40 md:gap-x-20 md:gap-y-8 md:my-20 max-w-3xl mx-auto">
        <CardContactComponent icon={<IoMail />} iconBg="bg-red-700">
          <p className="text-red-700">Email</p>
          <a href="mailto:pets.finder@gmail.com">pets.finder@gmail.com</a>
        </CardContactComponent>
        <CardContactComponent icon={<IoLogoWhatsapp />} iconBg="bg-emerald-700">
          <p className="text-emerald-700">Whatsapp</p>
          <a href="https://wa.me/1511111111">15-1111-1111</a>
        </CardContactComponent>
        <CardContactComponent icon={<IoLogoGithub  />} iconBgHex="#171515">
          <p style={{'color': '#171515'}}>GitHub</p>
          <a href="https://github.com/victorianastasi">victorianastasi</a>
        </CardContactComponent>
      </div>
    </div>
  );
}
