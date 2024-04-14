"use client";
import React, { useEffect, useState } from "react";

export default function LogIn() {

  return (
    <div className="main-bg pt-14 md:pt-16 mb-10  h-screen">
      <h1 className="text-center my-8 text-2xl font-bold text-slate-50">
        Log In
      </h1>

      <div className="flex justify-center mx-2 md:mx-0">
        <form
          className="bg-slate-50/80 text-slate-700 p-6 md:px-16 rounded-2xl max-w-full md:max-w-md "
        >
          <fieldset className="flex flex-col md:flex-row justify-center items-center flex-wrap gap-4 md:gap-8 mx-auto ">
            <legend className="font-bold w-fit md:w-full mb-6 text-center text-xl tracking-wider py-3">
              Ingresa a tu cuenta
            </legend>
            <div className="w-full">
              <label htmlFor="email" className="">
                Usuario:{" "}
              </label>
              <input
                type="text"
                className="rounded py-1 px-1 min-w-full text-slate-700"
                name="email"
                id="email"
                
              />
            </div>
            <div className="w-full ">
              <label htmlFor="pass" className="">
                Contraseña:{" "}
              </label>
              <input
                type="text"
                className="rounded py-1 px-1 min-w-full text-slate-700"
                name="pass"
                id="pass"
                
              />
            </div>
            <button
              className="block bg-slate-700 hover:bg-slate-800 text-white py-2 px-4 rounded w-fit"
              type="submit"
            >
              Ingresar
            </button>
          </fieldset>
          <div className="w-fit md:w-full text-center py-3 mt-6">
            <p>¿No tenés cuenta?</p>
            <a href="/register" className="text-blue-600 underline">
              Regístrate
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
