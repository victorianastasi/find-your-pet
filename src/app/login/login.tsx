"use client";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";
import { Circles } from "react-loader-spinner";

export default function LogIn() {
  const [Credentials, setCredentials] = useState({email:"", pass:""});
  const [visibilityPass, setVisibilityPass] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const inputPass = useRef<HTMLInputElement>(null);
  const inputEmail = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  
  const toggleVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setVisibilityPass(!visibilityPass);
    console.log(Credentials.email, Credentials.pass)
  }

  const changeUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
        ...Credentials,
        [e.target.name]: e.target.value
    });
    (inputEmail.current?.value != "" && inputPass.current?.value != "") ? setDisabledBtn(false) : setDisabledBtn(true) 
    console.log(Credentials)
  }

  const logInUser =  (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoader(true);
    setError(""); 
    signInWithEmailAndPassword(auth, Credentials.email, Credentials.pass)
      .then((userCredential) => {
        
        const user = userCredential.user;
        console.log("Inicio de sesión exitoso:", user);
        
        router.push("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error al iniciar sesión:", errorCode, errorMessage);
        setError(errorMessage);
      });
  }

  return (
    <div className="main-bg pt-14 md:pt-16 mb-10  h-screen relative">
      <h1 className="text-center my-8 text-2xl font-bold text-slate-50">
        Log In
      </h1>
      <div className="flex justify-center mx-2 md:mx-0">
        <div className={`absolute h-[300px] w-full max-w-[264px] rounded-2xl md:rounded-full md:h-[384px] sm:max-w-sm bg-slate-50/80 text-slate-700 text-center flex-col justify-center ${loader ? 'flex' : 'hidden'}`}>
          <p className="text-lg">Accediendo a tu cuenta</p>
          <Circles
            height="80"
            width="80"
            color="#D97808"
            wrapperClass="justify-center mt-4"
            />
        </div>
        <form
          className={`bg-slate-50/80 text-slate-700 p-6 md:px-12 rounded-2xl max-w-full md:max-w-sm ${loader ? 'hidden' : 'block'}`}
        >
          <fieldset className="flex flex-col md:flex-row justify-center items-center flex-wrap gap-4 md:gap-8 mx-auto ">
            <legend className=" w-fit md:w-full mb-6 text-center py-3">
            <span className="block font-bold text-2xl tracking-wider mb-3">Ingresa a tu cuenta</span> 
            <span className="text-slate-500">Ingresa tu email y contraseña para acceder</span>
            </legend>
            {/* {error && <div className="text-red-500">{error} esto es un texto</div>}
            {!error && <div className="text-green-500">{error} esto es un texto</div>} */}
            <div className="w-full">
              <label htmlFor="email" className="flex items-center flex-wrap mb-2">
                <span className="mr-2">Correo electrónico </span>
              </label>
              <input
                type="text"
                className="rounded py-1 px-1 min-w-full text-slate-700 min-h-[36px]"
                name="email"
                id="email"
                placeholder="ejemplo@mail.com"
                ref={inputEmail}
                onChange={changeUser}
              />
            </div>
            <div className="w-full relative">
              <label htmlFor="pass" className="flex items-center flex-wrap mb-2">
                <span className="mr-2">Contraseña</span>
              </label>
              <input
                type={`${visibilityPass ? "text" : "password"}`}
                className="rounded py-1 px-1 min-w-full text-slate-700 min-h-[36px]"
                name="pass"
                id="pass"
                placeholder="••••••"
                ref={inputPass}
                onChange={changeUser}
              />              
              <button onClick={toggleVisibility}>
                {React.cloneElement(visibilityPass ? <IoEyeOff /> : <IoEye />, {
                  className: "text-slate-600 absolute top-10 right-2",
                  size: 20,
                })}
              </button>
            </div>
            <div className="w-full flex items-center gap-1 justify-center">
              {error && 
               <>
                <IoMdCloseCircle size={20} className="text-red-700" />
                <p className="text-red-700">Email o contraseña inválidos</p>
               </> }
            </div>
            <button
              className={`block bg-slate-700 hover:bg-slate-800 text-white py-2 px-4 rounded-full w-fit min-w-[200px] disabled:bg-slate-400`}
              type="submit"
              onClick={logInUser}
              disabled={disabledBtn ? true : false}
            >
              Acceder
            </button>
          </fieldset>

          <div className="w-full text-center py-3 mt-6">
            <p>¿No tenés cuenta?</p>
            <a href="/signup" className="text-blue-600 underline">
              Regístrate
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
