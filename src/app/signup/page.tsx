"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { UserCredential, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { HiQuestionMarkCircle } from "react-icons/hi2";
import { IoEye, IoEyeOff, IoLogIn } from "react-icons/io5";
import { UserAuth } from "@/app/context/AuthContext";
import { ErrorMessage } from "../components/ErrorMessage/error-message";
import { addUser, db } from "../firebase";
import { IoMdCloseCircle } from "react-icons/io";
import GetUsersDB from "../components/getUsersDb/getUsersDb";
import { RotatingSquare } from "react-loader-spinner";
import "./signup.css";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const { signUpFunction, logOut } = UserAuth();

  const { usersDB } = GetUsersDB();
  
  const usersListEmail = usersDB.map(user => user.email);
  
  const [visibilityPass, setVisibilityPass] = useState<{
    [key: string]: boolean;
  }>({
    pass: false,
    passConfirm: false,
  });
  const [error, setError] = useState("");
  const [loadingSignup, setLoadingSignup] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);

  const checkNewEmail = (email: string) => {
    const emailExists = usersListEmail.some((userEmail) => userEmail === email);
    return emailExists;
  };

  const onSubmit = handleSubmit((data) => {
    if(checkNewEmail(data.email)) {
      setError("El correo electrónico ya se encuentra registrado.")
    } else {
      setLoadingSignup(true)
      signUpFunction(data.email, data.pass)
      .then((userCredential: UserCredential) => {
        const user = userCredential.user;
        updateProfile(user, { displayName: data.userName });
        console.log("Registro exitoso:", user);
        return addUser(db, { email: data.email, phone: data.phone, userName: data.userName }, user.uid);
      })
      .then(() => {
        setLoadingSignup(false);
        logOut();
        setSignupComplete(true);
      })
      .catch((error: FirebaseError) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error al registrar:", errorCode, errorMessage);
      });
    }
  });

  const toggleVisibility = (inputId: string) => {
    setVisibilityPass((prevState) => ({
      ...prevState,
      [inputId]: !prevState[inputId],
    }));
  };

  const activeButton = watch("userName") != "" && watch("email") != "" && watch("pass") != "" && watch("passConfirm") != "";

  return (
    <div className="main-bg pt-14 md:pt-16 mb-10 h-[calc(100vh-64px)]">
      <h1 className="text-center my-8 text-2xl font-bold text-slate-50">
        Regístrate
      </h1>
      {signupComplete && 
      <div className="bg-slate-50/50 rounded-lg mx-2 md:rounded-full max-w-[533px] 550:mx-auto mt-16">
        <div className="flex flex-col items-center gap-4 pt-16 pb-24 mt-4">
          <h2 className="text-center text-2xl font-bold text-slate-700 max-w-[200px]">
            Cuenta creada con éxito
          </h2>
          <Image src="img/login.svg" width={250} height={350} alt=""></Image>
          {/* <a href="https://storyset.com/user">User illustrations by Storyset</a> */}
          <Link
            href="/login"
            className="group flex items-center gap-2 px-4 py-2 leading-none rounded-full border-2 md:border-1 hover:border-transparent hover:text-amber-600 hover:bg-white mx-6 md:mx-0 max-w-[250px] border-gray-700 bg-gray-700 text-white shadow-lg"
          >
            <IoLogIn size={24} className="min-w-[24px]" />
            <span className="text-center">Ingresa a tu cuenta</span>
          </Link>
        </div>
      </div>
      }
      
      {loadingSignup && 
      <div className="flex flex-col items-center justify-center mx-auto bg-slate-50/80 text-slate-600 p-12 rounded-2xl max-w-full md:max-w-2xl 550:max-w-sm">
        <p className="text-lg font-bold">Aguarda un momento</p>
        <p className="text-lg font-bold">Estamos registrando tus datos</p>
        <RotatingSquare
        visible={true}
        height="140"
        width="140"
        color="rgb(99 102 241)"
        ariaLabel="rotating-square-loading"
        wrapperStyle={{}}
        wrapperClass="my-8"
        />
      </div>}
      {!loadingSignup && !signupComplete &&
      <div className="flex justify-center mx-2 md:mx-0">
        <form
          className="bg-slate-50/80 text-slate-700 p-6 md:px-12 rounded-2xl max-w-full md:max-w-2xl 550:max-w-sm "
          onSubmit={onSubmit}
        >
          <fieldset className="mx-auto ">
            <legend className=" w-fit md:w-full text-center py-3 mb-2">
              <span className="block font-bold text-2xl tracking-wider mb-1">
                Crea tu cuenta
              </span>
              <span className="text-slate-500">
                Ingresa tus datos para registrarte
              </span>
            </legend>
            <div className="w-full md:max-w-[17rem] relative mr-auto">
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
                onFocus={() => setError("")}
                {...register("userName", {
                  required: {
                    value: true,
                    message: "Nombre de usuario es requerido",
                  },
                })}
              />
              <div className="leading-4 min-h-[24px]">
                {errors.userName && (
                  <ErrorMessage>{errors.userName.message}</ErrorMessage>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-between">
              <div className="w-full md:max-w-[17rem] relative">
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
                  } ${error ? 'invalid' : ''}`}
                  id="email"
                  onFocus={() => setError("")}
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
                <div className="leading-4 min-h-[24px]">
                  {errors.email && (
                    <ErrorMessage>{errors.email.message}</ErrorMessage>
                  )}
                </div>
              </div>
              <div className="w-full md:max-w-[17rem] relative">
                <label
                  htmlFor="phone"
                  className="flex items-center flex-wrap mb-2"
                >
                  <span className="mr-2">Teléfono </span>
                </label>
                <input
                  type="number"
                  className={`rounded py-1 px-1 min-w-full text-slate-700 min-h-[36px] ${
                    errors.phone ? "border-red-700 border-2" : ""
                  }`}
                  id="phone"
                  onFocus={() => setError("")}
                  {...register("phone", {
                    required: {
                      value: true,
                      message: "Teléfono es requerido",
                    },
                    minLength: {
                      value: 8,
                      message: "Ingresa un teléfono válido.",
                    },
                  })}
                />
                <div className="leading-4 min-h-[24px]">
                  {errors.phone && (
                    <ErrorMessage>{errors.phone.message}</ErrorMessage>
                  )}
                </div>
              </div>
              <div className="w-full md:max-w-[17rem] relative">
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
                    type={`${visibilityPass["pass"] ? "text" : "password"}`}
                    className={`rounded py-1 px-1 min-w-full text-slate-700 min-h-[36px] focus-visible:outline-offset-1 ${
                      errors.pass ? "invalid" : "" }`}
                    id="pass"
                    onFocus={() => setError("")}
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
                  <button type="button" className="text-slate-600 absolute top-0 right-0 p-2 rounded bg-slate-200"
                  onClick={() => toggleVisibility("pass")} >
                    {React.cloneElement(
                      visibilityPass["pass"] ? <IoEyeOff /> : <IoEye />,
                      { size: 20, }
                    )}
                  </button>
                </div>
                <div className="leading-4 min-h-[24px]">
                  {errors.pass && (
                    <ErrorMessage>{errors.pass.message}</ErrorMessage>
                  )}
                </div>
                
              </div>
              <div className="w-full md:max-w-[17rem] relative">
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
                <div className="relative">
                  <input
                    type={`${visibilityPass["passConfirm"] ? "text" : "password"}`}
                    className={`rounded py-1 px-1 min-w-full text-slate-700 min-h-[36px] focus-visible:outline-offset-1 ${
                      errors.passConfirm ? "invalid" : ""}`}
                    id="passConfirm"
                    onFocus={() => setError("")}
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
                  <button type="button" className="text-slate-600 absolute top-0 right-0 p-2 rounded bg-slate-200"
                  onClick={() => toggleVisibility("passConfirm")}>
                    {React.cloneElement(
                      visibilityPass["passConfirm"] ? <IoEyeOff /> : <IoEye />,
                      { size: 20, }
                    )}
                  </button>
                </div>
                <div className="leading-4 min-h-[24px]">
                  {errors.passConfirm && (
                    <ErrorMessage>{errors.passConfirm.message}</ErrorMessage>
                  )}
                </div>
                
              </div>
            </div>
            <button
              className={`block bg-slate-700 hover:bg-slate-800 text-white py-2 px-4 mt-2 rounded-full w-fit min-w-[200px] disabled:cursor-not-allowed disabled:bg-slate-400 mx-auto`}
              type="submit"
              disabled={activeButton ? false : true}
            >
              Crear cuenta
            </button>
            <div className="w-full flex items-center gap-1 justify-center min-h-[24px] mt-4">
                { error && (
                  <>
                    <IoMdCloseCircle size={20} className="text-red-700 min-w-[20px]" />
                    <p className="text-red-700">{error}</p>
                  </>
                )}
              </div>
          </fieldset>
        </form>
      </div>
      }
    </div>
  );
}
