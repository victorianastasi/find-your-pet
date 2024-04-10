"use client";
import React from "react";
import { ThreeCircles } from 'react-loader-spinner';
import { FilterComponent } from "../components/filters/filters";
import GetData from '../components/getData/getData';
import "./search.css";

export default function Search() { 
  const { itemsList, loaded } = GetData();

  return (
    <div className="main-bg pt-14 md:pt-16 mb-10">
      <h1 className="text-center my-8 text-2xl font-bold text-slate-50">Publicaciones</h1>
      {loaded ? 
      (
        <FilterComponent list={itemsList}></FilterComponent>
      ):
      <div className="min-h-[500px] flex flex-col items-center justify-center text-slate-50 cabin">
        <p className="text-xl mb-4">Cargando..</p>
        <ThreeCircles
          visible={true}
          height="100"
          width="100"
          color="#FFFBEB"
          ariaLabel="Cargando"
        />
      </div>
      }
    </div>
  );
}
