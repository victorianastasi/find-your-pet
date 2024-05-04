"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { UserAuth } from "@/app/context/AuthContext";
import { UserCredential } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";
import { HiQuestionMarkCircle } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { Circles } from "react-loader-spinner";
import { ErrorMessage } from "../components/ErrorMessage/error-message";
import "./login.css";

export default function LogIn() {
  const [visibilityPass, setVisibilityPass] = useState(false);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const { logInFunction } = UserAuth();

  const toggleVisibility = () => {
    setVisibilityPass(!visibilityPass);
  };

  const logInUser = handleSubmit((data) => {
    setError("");
    logInFunction(data.email, data.pass)
    .then((userCredential: UserCredential) => {
      setLoader(true);
      const userCred = userCredential.user;
      console.log("Inicio de sesión exitoso:", userCred);
      router.push("/");
    })
    .catch((error: FirebaseError) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error al iniciar sesión:", errorCode, errorMessage);
      setError(errorMessage);
    });
  });

  const disabledBtn = watch("email") != ""  && watch("pass") != "";

  return (
    <div className="main-bg pt-14 md:pt-16 mb-10  h-screen">
      <h1 className="text-center my-8 text-2xl font-bold text-slate-50">
        Log In
      </h1>
      <div className="flex justify-center mx-2 md:mx-0">
        <div
          className={`absolute h-[300px] w-full max-w-[264px] rounded-2xl md:rounded-full md:h-[384px] sm:max-w-sm bg-slate-50/80 text-slate-700 text-center flex-col justify-center ${
            loader ? "flex" : "hidden"
          }`}
        >
          <p className="text-lg">Accediendo a tu cuenta</p>
          <Circles
            height="80"
            width="80"
            color="#D97808"
            wrapperClass="justify-center mt-4"
          />
        </div>
        <div className={`bg-slate-50/80 text-slate-700 p-6 md:px-12 rounded-2xl max-w-full md:max-w-sm ${
            loader ? "hidden" : "block"
          }`}>
          <form onSubmit={logInUser}>
            <fieldset className="flex flex-col md:flex-row justify-center items-center flex-wrap mx-auto">
              <legend className=" w-fit md:w-full text-center py-3 mb-6">
                <span className="block font-bold text-2xl tracking-wider mb-1">
                  Ingresa a tu cuenta
                </span>
                <span className="text-slate-500">
                  Ingresa tus datos para iniciar sesión
                </span>
              </legend>

              <div className="w-full relative">
                <label
                  htmlFor="email"
                  className="flex items-center flex-wrap mb-2"
                >
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
                  className={`rounded py-1 px-1 min-w-full text-slate-700 min-h-[36px] ${
                    errors.email ? "border-red-700 border-2" : ""
                  }`}
                  id="email"
                  placeholder="ejemplo@mail.com"
                  onFocus={() => setError("")}
                  {...register("email", {
                    required: {
                      value: true,
                      message: "Correo electrónico es requerido",
                    },
                    pattern: {
                      value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                      message: "Correo electrónico no válido",
                    },
                  })}
                />
                <div className="leading-4 min-h-[24px]">
                  {errors.email && (
                    <ErrorMessage>{errors.email.message}</ErrorMessage>
                  )}
                </div>
              </div>

              <div className="w-full relative">
                <label
                  htmlFor="pass"
                  className="flex items-center flex-wrap mb-2"
                >
                  <span className="mr-2">Contraseña</span>
                  <HiQuestionMarkCircle
                    size={16}
                    className="hidden md:inline-block cursor-pointer text-amber-700"
                    title="Debe tener al menos 6 caracteres."
                  ></HiQuestionMarkCircle>
                  <small className="inline-block  md:hidden">
                    *Debe tener al menos 6 caracteres.
                  </small>
                </label>
                <div className="relative">
                  <input
                    type={`${visibilityPass ? "text" : "password"}`}
                    className={`rounded py-1 px-1 min-w-full text-slate-700 min-h-[36px] focus-visible:outline-offset-1 ${
                      errors.pass ? "invalid" : ""
                    }`}
                    id="pass"
                    placeholder="••••••"
                    onFocus={() => setError("")}
                    min-length={6}
                    {...register("pass", {
                      required: {
                        value: true,
                        message: "Debes completar este campo.",
                      },
                      minLength: {
                        value: 6,
                        message:
                          "La contraseña debe tener al menos 6 caracteres.",
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="text-slate-600 absolute top-0 right-0 p-2 rounded bg-slate-200"
                    onClick={() => toggleVisibility()}
                  >
                    {React.cloneElement(
                      visibilityPass ? <IoEyeOff /> : <IoEye />,
                      { size: 20 }
                    )}
                  </button>
                </div>
                <div className="leading-4 min-h-[24px]">
                  {errors.pass && (
                    <ErrorMessage>{errors.pass.message}</ErrorMessage>
                  )}
                </div>
              </div>
              <button
                className={`block bg-slate-700 hover:bg-slate-800 text-white py-2 px-4 mt-2 rounded-full w-fit min-w-[200px] disabled:cursor-not-allowed disabled:bg-slate-400`}
                type="submit"
                disabled={disabledBtn ? false : true}
              >
                Acceder
              </button>
              <div className="w-full flex items-center gap-1 justify-center min-h-[24px] mt-4">
                {error && (
                  <>
                    <IoMdCloseCircle size={20} className="text-red-700" />
                    <p className="text-red-700">Email o contraseña inválidos</p>
                  </>
                )}
              </div>
            </fieldset>
          </form>
          <div className="w-full text-center py-3">
            <p>¿No tenés cuenta?</p>
            <a href="/signup" className="text-blue-600 underline">
              Regístrate
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
