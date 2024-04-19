"use client";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { UserCredential, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import { HiQuestionMarkCircle } from "react-icons/hi2";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { UserAuth } from "@/app/context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const { signUpFunction } = UserAuth();

  const [visibilityPass, setVisibilityPass] = useState<{
    [key: string]: boolean;
  }>({
    pass: false,
    passConfirm: false,
  });

  const router = useRouter();

  const ErrorMessage: React.FC<{ children?: any }> = ({ children }) => {
    return (
      <small className="text-red-700 absolute bottom-[-20px] left-0">
        {children}
      </small>
    );
  };

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    console.log("enviando datos");
    signUpFunction(data.email, data.pass)
      .then((userCredential: UserCredential) => {
        const user = userCredential.user;
        updateProfile(user, { displayName: data.userName });
        console.log("Registro exitoso:", user);
      })
      .then(() => {
        router.push("/signup-success");
      })
      .catch((error: FirebaseError) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error al registrar:", errorCode, errorMessage);
      });
  });

  const toggleVisibility = (inputId: string) => {
    setVisibilityPass((prevState) => ({
      ...prevState,
      [inputId]: !prevState[inputId],
    }));
    console.log(visibilityPass);
  };

  return (
    <div className="main-bg pt-14 md:pt-16 mb-10  h-screen">
      <h1 className="text-center my-8 text-2xl font-bold text-slate-50">
        Regístrate
      </h1>
      <div className="flex justify-center mx-2 md:mx-0">
        <form
          className="bg-slate-50/80 text-slate-700 p-6 md:px-12 rounded-2xl max-w-full md:max-w-sm "
          onSubmit={onSubmit}
        >
          <fieldset className="flex flex-col md:flex-row justify-center items-center flex-wrap gap-8 mx-auto ">
            <legend className=" w-fit md:w-full text-center py-3">
              <span className="block font-bold text-2xl tracking-wider mb-3">
                Crea tu cuenta
              </span>
              <span className="text-slate-500">
                Ingresa tu email y contraseña para registarte
              </span>
            </legend>

            <div className="w-full relative">
              <label
                htmlFor="userName"
                className="flex items-center flex-wrap mb-2"
              >
                <span className="mr-2">Nombre de usuario </span>
              </label>
              <input
                type="text"
                className={`rounded py-1 px-1 min-w-full text-slate-700 min-h-[36px] ${
                  errors.userName ? "border-red-700 border-2" : ""
                }`}
                id="userName"
                {...register("userName", {
                  required: {
                    value: true,
                    message: "Nombre de usuario es requerido",
                  },
                })}
              />
              {errors.userName && (
                <ErrorMessage>{errors.userName.message}</ErrorMessage>
              )}
            </div>
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
              {errors.email && (
                <ErrorMessage>{errors.email.message}</ErrorMessage>
              )}
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
              <input
                type={`${visibilityPass["pass"] ? "text" : "password"}`}
                className={`rounded py-1 px-1 min-w-full text-slate-700 min-h-[36px] ${
                  errors.pass || errors.passConfirm
                    ? "border-red-700 border-2"
                    : ""
                }`}
                id="pass"
                placeholder="••••••"
                min-length={6}
                {...register("pass", {
                  required: {
                    value: true,
                    message: "Debes completar este campo.",
                  },
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres.",
                  },
                })}
              />
              {errors.pass && (
                <ErrorMessage>{errors.pass.message}</ErrorMessage>
              )}

              <button type="button" onClick={() => toggleVisibility("pass")}>
                {React.cloneElement(
                  visibilityPass["pass"] ? <IoEyeOff /> : <IoEye />,
                  {
                    className: "text-slate-600 absolute top-10 right-2",
                    size: 20,
                  }
                )}
              </button>
            </div>
            <div className="w-full relative">
              <label
                htmlFor="passConfirm"
                className="flex items-center flex-wrap mb-2"
              >
                <span className="mr-2">Confirmar contraseña</span>
                <HiQuestionMarkCircle
                  size={16}
                  className="hidden md:inline-block cursor-pointer text-amber-700"
                  title="Debe tener al menos 6 caracteres."
                ></HiQuestionMarkCircle>
                <small className="inline-block  md:hidden">
                  *Debe tener al menos 6 caracteres.
                </small>
              </label>
              <input
                type={`${visibilityPass["passConfirm"] ? "text" : "password"}`}
                className={`rounded py-1 px-1 min-w-full text-slate-700 min-h-[36px] ${
                  errors.passConfirm ? "border-red-700 border-2" : ""
                }`}
                id="passConfirm"
                placeholder="••••••"
                min-length={6}
                {...register("passConfirm", {
                  required: {
                    value: true,
                    message: "Debes completar este campo.",
                  },
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres.",
                  },
                  validate: (value) =>
                    value === watch("pass") || "Las contraseñas no coinciden.",
                })}
              />
              {errors.passConfirm && (
                <ErrorMessage>{errors.passConfirm.message}</ErrorMessage>
              )}
              <button
                type="button"
                onClick={() => toggleVisibility("passConfirm")}
              >
                {React.cloneElement(
                  visibilityPass["passConfirm"] ? <IoEyeOff /> : <IoEye />,
                  {
                    className: "text-slate-600 absolute top-10 right-2",
                    size: 20,
                  }
                )}
              </button>
            </div>
            <button
              className="block bg-slate-700 hover:bg-slate-800 text-white py-2 px-4 rounded-full w-fit min-w-[200px]"
              type="submit"
            >
              Crear cuenta
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
