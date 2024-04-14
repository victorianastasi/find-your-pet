"use client";
import React, { useRef, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; 
import { useRouter } from 'next/navigation'
import { HiQuestionMarkCircle } from "react-icons/hi2";
import { IoEye, IoEyeOff  } from "react-icons/io5";

export default function SignUp() {

  const [Credentials, setCredentials] = useState({email:"", pass:""});
  const [visibilityPass, setVisibilityPass] = useState(false);
  const inputPass =useRef<HTMLInputElement>(null);

  const {push} = useRouter();

  const changeUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
        ...Credentials,
        [e.target.name]: e.target.value
    });
    console.log(Credentials)
  }

  const registerUser = async () => {
    console.log(Credentials)
    try {
        await createUserWithEmailAndPassword(auth, Credentials.email, Credentials.pass);

        console.log(Credentials.email, Credentials.pass)
    }
    catch(error) {
        console.log(error)
    }
  }
  
  const toggleVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setVisibilityPass(!visibilityPass);
  }

  return (
    <div className="main-bg pt-14 md:pt-16 mb-10  h-screen">
      <h1 className="text-center my-8 text-2xl font-bold text-slate-50">
        Regístrate
      </h1>
      <div className="flex justify-center mx-2 md:mx-0">
        <form
          className="bg-slate-50/80 text-slate-700 p-6 md:px-12 rounded-2xl max-w-full md:max-w-sm "
        >
          <fieldset className="flex flex-col md:flex-row justify-center items-center flex-wrap gap-4 md:gap-8 mx-auto ">
            <legend className=" w-fit md:w-full mb-6 text-center py-3">
            <span className="block font-bold text-2xl tracking-wider mb-3">Crea tu cuenta</span> 
            <span className="text-slate-500">Ingresa tu email y contraseña para registarte</span>
            </legend>
            
            <div className="w-full">
              <label htmlFor="email" className="flex items-center flex-wrap mb-2">
                <span className="mr-2">Correo electrónico </span>
                <HiQuestionMarkCircle
                  size={16}
                  className="hidden md:inline-block cursor-pointer text-amber-700"
                  title="Ingresa un correo válido."
                ></HiQuestionMarkCircle>
                <small className="inline-block  md:hidden">
                  *Ingresa un correo válido.
                </small>
              </label>
              <input
                type="text"
                className="rounded py-1 px-1 min-w-full text-slate-700 min-h-[36px]"
                name="email"
                id="email"
                placeholder="ejemplo@mail.com"
                onChange={changeUser}
              />
            </div>
            <div className="w-full relative">
              <label htmlFor="pass" className="flex items-center flex-wrap mb-2">
                <span className="mr-2">Contraseña</span>
                <HiQuestionMarkCircle
                  size={16}
                  className="hidden md:inline-block cursor-pointer text-amber-700"
                  title="Debe tener 6 caracteres."
                ></HiQuestionMarkCircle>
                <small className="inline-block  md:hidden">
                  *Debe tener como mínimo 6 caracteres.
                </small>
              </label>
              <input
                type={`${visibilityPass ? "text" : "password"}`}
                className="rounded py-1 px-1 min-w-full text-slate-700 min-h-[36px]"
                name="pass"
                id="pass"
                placeholder="••••••"
                onChange={changeUser}
                ref={inputPass}
              />              
              <button onClick={toggleVisibility}>
                {React.cloneElement(visibilityPass ? <IoEyeOff /> : <IoEye />, {
                  className: "text-slate-600 absolute top-10 right-2",
                  size: 20,
                })}
              </button>
            </div>
            <button
              className="block bg-slate-700 hover:bg-slate-800 text-white py-2 px-4 rounded w-fit"
              type="submit"
              onClick={registerUser}
            >
              Crear cuenta
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
