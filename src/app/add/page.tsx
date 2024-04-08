"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HiQuestionMarkCircle } from "react-icons/hi2";
import { addItem, db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./add.css";
import { IoTrashSharp } from "react-icons/io5";
import { BsSendCheck } from "react-icons/bs";
import { FiCheckCircle } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import { Grid } from "react-loader-spinner";

export default function Add() {
  const formRef = useRef<HTMLFormElement>(null);
  const previewImg = useRef<HTMLImageElement>(null);
  const previewActions = useRef<HTMLDivElement>(null);
  const selectFile = useRef<HTMLSpanElement>(null);
  const previewText = useRef<HTMLSpanElement>(null);
  const alertPreview = useRef<HTMLDivElement>(null);
  const alertPreviewText = useRef<HTMLDivElement>(null);

  const successForm = useRef<HTMLDivElement>(null);

  const noResults = "img/no-results.svg";
  const sent = "img/sent.svg";

  const checkIcon =
    '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" color="#84CC16" height="24" width="24" xmlns="http://www.w3.org/2000/svg" style="color: rgb(132, 204, 22);"><path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm108.25 138.29-134.4 160a16 16 0 0 1-12 5.71h-.27a16 16 0 0 1-11.89-5.3l-57.6-64a16 16 0 1 1 23.78-21.4l45.29 50.32 122.59-145.91a16 16 0 0 1 24.5 20.58z"></path></svg>';

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageConfirmed, setImageConfirmed] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const [uploading, setUploading] = useState<boolean>(false);

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
          setLocalities(localidadesData);
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
    console.log(event.target.value)
  };

  // Manejo de archivo imagen
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    const input = e.target as HTMLInputElement;
    const fileUrl = input.files?.[0];

    if (fileUrl) {
      setImageFile(fileUrl);
      console.log("handleFileChange" + imageFile);
      setImageLoaded(true);
      if (
        previewActions.current &&
        previewImg.current &&
        selectFile.current &&
        previewText.current
      ) {
        selectFile.current.classList.add("hidden");
        previewText.current.innerHTML = "Imagen seleccionada: ";

        previewImg.current.classList.remove("hidden");
        previewImg.current.src = fileUrl ? URL.createObjectURL(fileUrl) : "";
        previewImg.current.alt = fileUrl?.name ? fileUrl?.name : "";

        previewActions.current.classList.remove("hidden");
        previewActions.current.classList.add("flex");

        alertPreview.current?.classList.remove("flex");
        alertPreview.current?.classList.add("hidden");
      }

      /* console.log("file" +file) */
      console.log("fileUrl.name" + fileUrl?.name);
      console.log("fileUrl" + fileUrl);
      console.log("imageLoaded" + imageLoaded);
    }
  };

  // Subir imagen a Storage en Firebase
  const uploadFileToStorage = async () => {
    const storageRef = ref(storage, `img/${imageFile?.name}`);
    setUploading(true); // Muestra el loader al iniciar la carga del archivo

    try {
      await uploadBytes(storageRef, imageFile!);
      console.log("Archivo subido exitosamente.");

      // Obtener la URL de la imagen y actualizar el estado
      const downloadUrl = await getDownloadURL(storageRef);
      console.log("downloadUrl: ", downloadUrl);
      setImageUrl(downloadUrl);
      console.log("imageUrl: ", imageUrl);
      setImageConfirmed(true);
      console.log("ImageConfirmed: ", imageConfirmed);
    } catch (error) {
      console.error("Error al subir el archivo:", error);
    } finally {
      setUploading(false); // Ocultar el loader al finalizar la carga del archivo
      previewActions.current?.classList.remove("flex");
      previewActions.current?.classList.add("hidden");
      previewText.current?.classList.add("flex", "gap-2");
      alertPreview.current?.classList.remove("flex");
      alertPreview.current?.classList.add("hidden");
      if (previewText.current) {
        previewText.current.innerHTML = ` ${checkIcon} Imagen confirmada`;
      }
    }
  };

  // Cancelar el archivo antes de su subida a Storage firebase
  const cancelFile = () => {
    setImageFile(null);
    setImageLoaded(false);
    selectFile.current?.classList.remove("hidden");

    previewImg.current?.classList.add("hidden");

    previewActions.current?.classList.remove("flex");
    previewActions.current?.classList.add("hidden");

    alertPreview.current?.classList.remove("flex");
    alertPreview.current?.classList.add("hidden");

    if (previewText.current) {
      previewText.current.innerHTML = "No hay imagen seleccionada.";
    }
  };

  // Envio de formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    function capitalizeFirstLetter(value: string): string {
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
    
    function lowerCaseExceptFirst(value: string): string {
      const words = value.split(" ");
      const firstWord = words.shift();
      const restOfSentence = words.join(" ").toLowerCase();
      return `${firstWord?.charAt(0).toUpperCase()}${firstWord?.slice(
        1
      )} ${restOfSentence}`;
    }

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

    const newData = {
      type,
      name: newName,
      age,
      location,
      district,
      description,
      image: imageUrl,
      date,
    };
    console.log(newData);

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    // Agrega el nuevo item a Firestore
    console.log("imageUrl" + imageUrl === "");
    console.log("uploading" + uploading);
    console.log("imageConfirmed" + imageConfirmed);
    console.log("imageUrl" + imageUrl);
    console.log("imageLoaded form" + imageLoaded);
    if (imageLoaded) {
      if (imageConfirmed) {
        await addItem(db, newData);

        // Limpia el formulario y muestra mensaje de éxito
        if (formRef.current) {
          formRef.current.reset();
          setImageConfirmed(false);
          scrollToTop();
          formRef.current.classList.add("hidden");
          successForm.current?.classList.remove("hidden");
          successForm.current?.classList.add("flex");
        }
      } else {
        console.log(
          "Por favor, confirma la imagen antes de enviar el formulario."
        );
        alertPreview.current?.classList.remove("hidden");
        alertPreview.current?.classList.add("flex");
        if (alertPreviewText.current) {
          alertPreviewText.current.innerHTML =
            "Por favor, confirma la imagen antes de enviar el formulario.";
        }
      }
    } else {
      console.log("Por favor, sube una imagen antes de enviar el formulario.");
      alertPreview.current?.classList.remove("hidden");
      alertPreview.current?.classList.add("flex");
      if (alertPreviewText.current) {
        alertPreviewText.current.innerHTML =
          "Por favor, sube una imagen antes de enviar el formulario.";
      }
    }
  };

  const cancelForm = () => {
    console.log(imageUrl);
    cancelFile();
    if (formRef.current) {
      formRef.current.reset();
      setImageConfirmed(false);
    }
  };

  return (
    <div className="main-bg pt-14 md:pt-16">
      <h1 className="text-center my-8 text-2xl font-bold text-slate-50">
        Agrega una publicación de tu mascota perdida
      </h1>
      <div className="flex justify-center mx-2 md:mx-0">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-slate-50/50 text-slate-700 p-6 rounded-2xl max-w-full md:max-w-2xl "
        >
          <fieldset className="flex flex-col md:flex-row justify-center items-center flex-wrap gap-4 md:gap-8 mx-auto ">
            <legend className="text-slate-700 font-bold w-fit md:w-full mb-6 text-center text-xl">
              Carga los datos de tu mascota perdida
            </legend>
            <div className="w-full md:w-[15rem]">
              <label htmlFor="pet" className="">
                Mascota:{" "}
              </label>
              <select
                className="rounded py-1 min-w-full"
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
                className="rounded py-1 px-1 min-w-full"
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
                <small className="inline-block text-slate-600 md:hidden">
                  *Ingresa la cantidad de años o meses.
                </small>
              </label>
              <input
                type="text"
                className="rounded py-1 px-1 min-w-full"
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
                className="rounded py-1 px-1 min-w-full"
                name="date"
                id="date"
                max={getCurrentDate()}
                required
                //onChange={handleDateChange}
              />
            </div>
            <div className="w-full md:max-w-[32rem]">
              <label htmlFor="description" className="">
                Descripción:{" "}
              </label>
              <textarea
                className="rounded py-1 px-1 min-w-full"
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
                className="rounded p-1 w-full"
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                required
                name="district"
                id="district"
              >
                <option value="">Todas</option>
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
                className="rounded p-1 w-full"
                value={selectedLocality}
                onChange={handleLocalityChange}
                required
                name="location"
                id="location"
              >
                <option value="">Todas</option>
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
                  <small className="text-slate-600 inline-block md:hidden">
                    *Selecciona imágenes de tipo .png, .jpg, .jpeg, .svg
                  </small>
                  <span
                    className="block bg-slate-700 hover:bg-slate-800 text-white py-1 px-2 rounded w-fit"
                    ref={selectFile}
                  >
                    Selecciona un archivo
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
              <div
                className="flex flex-row flex-wrap gap-2 justify-center md:justify-between items-center p-2 pl-0 mt-2 bg-slate-50 rounded-lg relative"
                id="preview"
              >
                <span
                  id="preview-text"
                  className="w-full md:w-4/5 pl-2"
                  ref={previewText}
                >
                  No hay imagen seleccionada.
                </span>
                <span
                  className={`bg-slate-50 w-full h-full absolute rounded-lg justify-center items-center ${
                    uploading ? "flex" : "hidden"
                  }`}
                  id="file-loader"
                >
                  <Grid
                    visible={true}
                    height="40"
                    width="40"
                    color="#6366F1"
                    ariaLabel="Cargando"
                  />
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
                <div
                  ref={previewActions}
                  className="w-full flex-wrap gap-2 ml-2 hidden"
                >
                  <button
                    className="bg-red-800 hover:bg-red-900 text-white py-1 px-2 rounded w-full 550:w-[48%]"
                    type="button"
                    id="cancel-file"
                    onClick={cancelFile}
                  >
                    Cancelar
                  </button>
                  <button
                    className="bg-slate-700 hover:bg-slate-800 text-white py-1 px-2 rounded w-full 550:w-[48%]"
                    id="confirm-file"
                    type="button"
                    onClick={uploadFileToStorage}
                  >
                    Confirmar imagen
                  </button>
                </div>
                <div
                  className="border-4 text-red-900 border-red-900 rounded-lg p-1 px-2 items-center justify-center w-full ml-2 hidden text-center"
                  ref={alertPreview}
                >
                  <MdCancel size={20} className="inline-block mr-1" />
                  <span ref={alertPreviewText}></span>
                </div>
              </div>
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
