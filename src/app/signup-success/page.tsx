"use client";
import React from "react";
import { UserAuth } from "../context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { IoLogIn } from "react-icons/io5";

export default function SignUpSuccessfull() {
  const { user } = UserAuth();
  console.log(user);
  console.log(user.displayName);
  return (
    <div className="main-bg pt-14 md:pt-16 mb-10">
      {/* <a href="https://storyset.com/user">User illustrations by Storyset</a> */}
      <div className="bg-slate-50/50 rounded-lg mx-2 md:rounded-full max-w-[533px] 550:mx-auto">
        <div className="flex flex-col items-center gap-4 pt-16 pb-24 mt-4">
          <h1 className="text-center text-2xl font-bold text-slate-700 max-w-[200px]">
            Cuenta creada con éxito
          </h1>
          <Image src="img/login.svg" width={250} height={350} alt=""></Image>
          <Link
            href="/login"
            className="group flex items-center gap-2 px-4 py-2 leading-none rounded-full border-2 md:border-1 hover:border-transparent hover:text-amber-600 hover:bg-white mx-6 md:mx-0 max-w-[250px] border-gray-700 bg-gray-700 text-white shadow-lg"
          >
            <IoLogIn size={24} className="min-w-[24px]" />
            <span className="text-center">Ingresa a tu cuenta</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
