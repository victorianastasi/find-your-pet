"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HiQuestionMarkCircle } from "react-icons/hi2";
import { addItem, db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./add.css";
import { IoLogIn, IoTrashSharp, IoCloudUpload } from "react-icons/io5";
import { BsSendCheck } from "react-icons/bs";
import { FiCheckCircle } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import { FcLock } from "react-icons/fc";
import { IoMdTrash } from "react-icons/io";
import { v4 as uuidv4 } from 'uuid';

import { Grid } from "react-loader-spinner";
import Link from "next/link";
import { UserAuth } from "../context/AuthContext";

export default function Add() {
  const { user, userDB } = UserAuth();

  const formRef = useRef<HTMLFormElement>(null);
  const previewImg = useRef<HTMLImageElement>(null);
  const uploadingForm = useRef<HTMLDivElement>(null);
  const cancelFileBtn = useRef<HTMLButtonElement>(null);
  const selectFile = useRef<HTMLSpanElement>(null);

  const successForm = useRef<HTMLDivElement>(null);

  const noResults = "img/no-results.svg";
  const sent = "img/sent.svg";

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  let imgUrl: string = '';

  const [departments, setDepartments] = useState<string[]>([]);
  const [localities, setLocalities] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedLocality, setSelectedLocality] = useState<string>("");


  // Establecer max en Input Fecha
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Formato de fecha dd-mm-aaaa
  const formatDate = (date: string) => {
    const parts = date.split("-");
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return formattedDate;
  };

  //Lista de partidos
  useEffect(() => {
    fetch("https://apis.datos.gob.ar/georef/api/departamentos?provincia=Buenos%20Aires&max=135")
      .then(response => response.json())
      .then(data => {        
        let departmentData = data.departamentos.map((departamento: { nombre: string; }) => departamento.nombre).sort();
        setDepartments(departmentData);
        
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  //Selección de Partido
  const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(event.target.value);

    if (event.target.value != "") {
      fetch(`https://apis.datos.gob.ar/georef/api/localidades?municipio=${event.target.value}&provincia=Buenos%20Aires`)
        .then(response => response.json())
        .then(data => {
          let localidadesData = data.localidades
          .filter((localidad: any) => localidad.categoria === 'Entidad')
          .map((localidad: any) => localidad.nombre)
          .sort();
          localidadesData.length == 0 ? setLocalities([event.target.value]) : setLocalities(localidadesData);
        })
        .catch(error => {
          console.error("Error fetching localidades:", error);
        });
    } else {
      setLocalities([]);
    }
  };

  //Selección de Localidad
  const handleLocalityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocality(event.target.value);
  };

  // Manejo de archivo imagen
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setImageError(false);
    const input = e.target as HTMLInputElement;
    const fileUrl = input.files?.[0];

    if (fileUrl) {
      setImageFile(fileUrl);
      setImageLoaded(true);

      cancelFileBtn.current?.classList.remove("hidden");

      selectFile.current?.classList.add("hidden");
    
      if (previewImg.current) {
        previewImg.current.classList.remove("hidden");
        previewImg.current.src = fileUrl ? URL.createObjectURL(fileUrl) : "";
        previewImg.current.alt = fileUrl?.name ? fileUrl?.name : "";
      }
    }
  };

  // Cancelar el archivo antes de su subida a Storage firebase
  const cancelFile = () => {
    setImageFile(null);
    setImageLoaded(false);
    selectFile.current?.classList.remove("hidden");
    previewImg.current?.classList.add("hidden");
    cancelFileBtn.current?.classList.add("hidden");
  };

  // Subir imagen a Storage en Firebase
  const uploadFileToStorage = async () => {
    const fileId = uuidv4();
    const storageRef = ref(storage, `img/${fileId}`);

    try {
      await uploadBytes(storageRef, imageFile!);
      console.log("Archivo subido exitosamente.");

      // Obtener la URL de la imagen y actualizar el estado
      const downloadUrl = await getDownloadURL(storageRef);
      imgUrl = downloadUrl;
      return imgUrl;
    } catch (error) {
      console.error("Error al subir el archivo:", error);
    } 
  };

  //Manejo de texto en inputs
  function capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  function lowerCaseExceptFirst(value: string): string {
    const words = value.split(" ");
    const firstWord = words.shift();
    const restOfSentence = words.join(" ").toLowerCase();
    return `${firstWord?.charAt(0).toUpperCase()}${firstWord?.slice(1).toLowerCase()} ${restOfSentence}`;
  }

  //scroll To Top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Envio de formulario
  const submitLostPet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (imageLoaded) {
      scrollToTop();
      formRef.current?.classList.add("hidden");
      uploadingForm.current?.classList.remove("hidden");
  
      const formData = new FormData(e.currentTarget);
      
      // Comprobación de values de inputs
      const newName = capitalizeFirstLetter(formData.get("name") as string);
      const type = formData.get("type") as string;
      const age = formData.get("age") as string;
      const location = formData.get("location") as string;
      const district = formData.get("district") as string;
      const description = lowerCaseExceptFirst(
        formData.get("description") as string
      );
      const date = formatDate(formData.get("date") as string);
      const email = userDB.email;
      const userName = userDB.userName;
      const phone = userDB.phone;
  
      // Subir imagen a storeage de firebase
      await uploadFileToStorage();
  
      //Valores de Data
      const newData = {
        type,
        name: newName,
        age,
        location,
        district,
        description,
        image: imgUrl,
        date,
        email,
        userName,
        phone
      };  
      
      await addItem(db, newData);
  
      formRef.current?.reset();
      uploadingForm.current?.classList.add("hidden");
      successForm.current?.classList.remove("hidden");
      successForm.current?.classList.add("flex");
    }else {
      setImageError(true);
    }
  };

  const cancelForm = () => {
    cancelFile();
    if (formRef.current) {
      formRef.current.reset();
    }
    setImageError(false);
  };

  return (
    <div className="main-bg pt-14 md:pt-16 mb-10 relative">
      {user.email == null && 
      <div className="h-full w-full bg-gray-200/80 absolute backdrop-blur z-[5]">
        <div className="flex flex-col gap-8 items-center text-slate-700 mt-24 font-bold max-w-72 mx-auto">
          <FcLock size={120}/>
          <p className="text-center text-lg">Inicia sesión en tu cuenta para acceder a esta sección</p>
          <Link
            href="/login"
            className="group flex items-center gap-2 px-4 py-2 leading-none rounded-full border-2 md:border-1 hover:border-transparent hover:text-amber-600 hover:bg-white mx-6 md:mx-0 max-w-[205px] border-gray-700 bg-gray-700 text-white shadow-lg"
          >
            <IoLogIn  size={24} />
            <span className="text-center">Login</span>
          </Link>
        </div>
      </div>}
      <h1 className="text-center my-8 text-2xl font-bold text-slate-50">
        Agrega una publicación de tu mascota perdida
      </h1>
      <div className="flex justify-center mx-2 md:mx-0 relative ">
        
        <div className="mx-2 md:mx-0 mt-8 md:mt-16 h-[70vh] hidden" ref={uploadingForm}>
          <div className=" text-slate-800 p-6 py-16 rounded-2xl max-w-full md:min-w-[600px] md:max-w-2xl bg-slate-50/95">
            <h2 className="text-2xl font-bold text-center mb-8">
              Subiendo publicación{" "}
              <IoCloudUpload size={28} className="inline-block text-indigo-500" />
            </h2>
            <Grid
              visible={true}
              height="80"
              width="80"
              color="#6366F1"
              ariaLabel="Cargando"
              wrapperClass="mx-auto w-fit"
            />
          </div>
        </div>
        <form
          ref={formRef}
          onSubmit={submitLostPet}
          className="bg-slate-800 text-slate-50 p-6 rounded-2xl max-w-full md:max-w-2xl"
        >
          <fieldset className="flex flex-col md:flex-row justify-center items-center flex-wrap gap-4 md:gap-8 mx-auto ">
            <legend className="text-indigo-100 font-bold w-fit md:w-full mb-6 text-center text-xl tracking-wider py-3">
              Carga los datos de tu mascota perdida
            </legend>
            <div className="w-full md:w-[15rem]">
              <label htmlFor="pet" className="">
                Mascota:{" "}
              </label>
              <select
                className="rounded py-1 min-w-full text-slate-700"
                required
                name="type"
                id="pet"
              >
                <option value="">Selecciona una opción</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
              </select>
            </div>
            <div className="w-full md:w-[15rem]">
              <label htmlFor="name" className="">
                Nombre:{" "}
              </label>
              <input
                type="text"
                className="rounded py-1 px-1 min-w-full text-slate-700"
                name="name"
                id="name"
                required
              />
            </div>
            <div className="w-full md:w-[15rem]">
              <label htmlFor="age" className="flex items-center flex-wrap">
                <span className="mr-2">Edad: </span>
                <HiQuestionMarkCircle
                  size={16}
                  className="hidden md:inline-block"
                  title="Ingresa la cantidad de años o meses."
                ></HiQuestionMarkCircle>
                <small className="inline-block  md:hidden">
                  *Ingresa la cantidad de años o meses.
                </small>
              </label>
              <input
                type="text"
                className="rounded py-1 px-1 min-w-full text-slate-700"
                required
                name="age"
                id="age"
              />
            </div>
            <div className="w-full md:w-[15rem]">
              <label htmlFor="date" className="">
                Fecha en que se perdió:{" "}
              </label>
              <input
                type="date"
                className="rounded py-1 px-1 min-w-full text-slate-700"
                name="date"
                id="date"
                max={getCurrentDate()}
                required
              />
            </div>
            <div className="w-full md:max-w-[32rem]">
              <label htmlFor="description" className="">
                Descripción:{" "}
              </label>
              <textarea
                className="rounded py-1 px-1 min-w-full text-slate-700"
                required
                name="description"
                id="description"
              ></textarea>
            </div>
            <div className="w-full md:w-[15rem]">
              <label htmlFor="district" className="">
                Partido:{" "}
              </label>
              <select
                className="rounded p-1 w-full text-slate-700"
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                required
                name="district"
                id="district"
              >
                <option value="">Seleccione una opción..</option>
                {departments.map((department, index) => (
                  <option key={index} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-[15rem]">
              <label htmlFor="location" className="">
                Localidad:{" "}
              </label>
              <select
                className="rounded p-1 w-full text-slate-700"
                value={selectedLocality}
                onChange={handleLocalityChange}
                required
                name="location"
                id="location"
              >
                <option value="">Seleccione una opción..</option>
                {localities.map((locality, index) => (
                  <option key={index} value={locality}>
                    {locality}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="w-full md:max-w-[32rem]">
              <div className="relative">
                <label
                  htmlFor="image_uploads"
                  className="cursor-pointer inline-block"
                >
                  <span className="mr-2">Imagen</span>
                  <HiQuestionMarkCircle
                    size={16}
                    className="hidden md:inline-block"
                    title="Selecciona imágenes de tipo .png, .jpg, .jpeg, .svg"
                  ></HiQuestionMarkCircle>
                  <small className="text-slate-50 inline-block md:hidden">
                    *Selecciona imágenes de tipo .png, .jpg, .jpeg, .svg
                  </small>
                  <span
                    className="block bg-amber-600 hover:bg-amber-800  py-1 px-2 rounded w-fit"
                    ref={selectFile}
                  >
                    Selecciona una imagen
                  </span>
                </label>

                <input
                  type="file"
                  id="image_uploads"
                  name="image_uploads"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="opacity-0 absolute left-0 top-0 w-0.5 h-0.5"
                />
              </div>
              <div className="flex flex-row flex-wrap 330:flex-nowrap gap-2 justify-center md:justify-between items-center p-2 pl-0 mt-2 bg-slate-50 rounded-lg relative">
                <span className="w-full md:w-4/5 pl-2 text-slate-700">
                  {imageLoaded ? "Imagen seleccionada:" : "No hay imagen seleccionada."}
                </span>
                <Image
                    src={noResults}
                    ref={previewImg}
                    id="preview-img"
                    className="preview-img hidden"
                    width={72}
                    height={72}
                    alt="preview-img"
                  ></Image>
                  <button
                    className="text-red-800 border border-red-800 hover:bg-red-800 hover:text-white py-2 px-2 ml-4 rounded text-center w-full 330:w-fit hidden"
                    type="button"
                    id="cancel-file"
                    ref={cancelFileBtn}
                    onClick={cancelFile}
                    aria-label="Cancelar"
                  >
                    <IoMdTrash size={24} className="inline-block" />
                  </button>
              </div>
                {imageError && <p className="w-full md:w-4/5 pl-2 text-red-100 px-2 rounded flex items-center gap-1">
                  <MdCancel size={20} className="inline-block text-red-600 text-sm" />
                  <span>Debes subir una imagen para enviar el formulario.</span>
                </p>}
              
            </div>
            <div className="w-full flex gap-4 550:gap-2 mt-4 justify-between flex-wrap md:px-14">
              <button
                type="reset"
                className="flex gap-2 justify-center items-center bg-red-800 hover:bg-red-900 text-white py-2 px-4 rounded-full w-full 550:w-[48%]"
                onClick={cancelForm}
              >
                <IoTrashSharp size={20} />
                Borrar los datos
              </button>
              <button
                type="submit"
                className="flex gap-2 justify-center items-center bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full w-full 550:w-[48%]"
              >
                <BsSendCheck size={20} />
                Enviar publicación
              </button>
            </div>
          </fieldset>
        </form>
      </div>
      {/* <a href="https://storyset.com/email">Email illustrations by Storyset</a> */}
      {/* <a href="https://storyset.com/email">Email illustrations by Storyset</a> */}
      
      <div className="justify-center mx-2 md:mx-0 hidden" ref={successForm}>
        <div className=" text-slate-800 p-6 pt-0 rounded-2xl max-w-full md:max-w-2xl ">
          <h2 className="text-2xl font-bold text-center mb-8">
            Publicación enviada correctamente{" "}
            <FiCheckCircle size={28} className="inline-block" />
          </h2>
          <Image
            src={sent}
            className="rounded-full bg-slate-50/50 p-6 animation__image-success"
            width={420}
            height={420}
            alt="Publicación enviada correctamente"
          ></Image>
        </div>
      </div>
    </div>
  );
}
