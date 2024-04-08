"use client";
import React from "react";
import { ThreeCircles } from 'react-loader-spinner';
import { FilterComponent } from "../components/filters/filters";
import GetData from '../components/getData/getData';
import "./search.css";

export default function Search() { 
  const { itemsList, loaded } = GetData();

  return (
    <div className="main-bg pt-14 md:pt-16">
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

        <h1 className="mt-5 pt-5">search title</h1>
        <p className="mt-5 py-5">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam expedita dicta nisi enim. Vitae beatae laboriosam officiis est eum laudantium ipsa nulla ea perspiciatis. Totam facilis officia saepe aliquid inventore!</p>
        <p className="mt-5 py-5">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam expedita dicta nisi enim. Vitae beatae laboriosam officiis est eum laudantium ipsa nulla ea perspiciatis. Totam facilis officia saepe aliquid inventore!</p>
        <p className="mt-5 py-5">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam expedita dicta nisi enim. Vitae beatae laboriosam officiis est eum laudantium ipsa nulla ea perspiciatis. Totam facilis officia saepe aliquid inventore!</p>
        <p className="mt-5 py-5">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam expedita dicta nisi enim. Vitae beatae laboriosam officiis est eum laudantium ipsa nulla ea perspiciatis. Totam facilis officia saepe aliquid inventore!</p>
        <p className="mt-5 py-5">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam expedita dicta nisi enim. Vitae beatae laboriosam officiis est eum laudantium ipsa nulla ea perspiciatis. Totam facilis officia saepe aliquid inventore!</p>
        <p className="mt-5 py-5">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam expedita dicta nisi enim. Vitae beatae laboriosam officiis est eum laudantium ipsa nulla ea perspiciatis. Totam facilis officia saepe aliquid inventore!</p>
        <p className="mt-5 py-5">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam expedita dicta nisi enim. Vitae beatae laboriosam officiis est eum laudantium ipsa nulla ea perspiciatis. Totam facilis officia saepe aliquid inventore!</p>
        <p className="mt-5 py-5">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam expedita dicta nisi enim. Vitae beatae laboriosam officiis est eum laudantium ipsa nulla ea perspiciatis. Totam facilis officia saepe aliquid inventore!</p>
        <p className="mt-5 py-5">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam expedita dicta nisi enim. Vitae beatae laboriosam officiis est eum laudantium ipsa nulla ea perspiciatis. Totam facilis officia saepe aliquid inventore!</p>
        <p className="mt-5 py-5">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam expedita dicta nisi enim. Vitae beatae laboriosam officiis est eum laudantium ipsa nulla ea perspiciatis. Totam facilis officia saepe aliquid inventore!</p>
        <p className="mt-5 py-5">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam expedita dicta nisi enim. Vitae beatae laboriosam officiis est eum laudantium ipsa nulla ea perspiciatis. Totam facilis officia saepe aliquid inventore!</p>
        <p className="mt-5 py-5">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam expedita dicta nisi enim. Vitae beatae laboriosam officiis est eum laudantium ipsa nulla ea perspiciatis. Totam facilis officia saepe aliquid inventore!</p>
        <p className="mt-5 py-5">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam expedita dicta nisi enim. Vitae beatae laboriosam officiis est eum laudantium ipsa nulla ea perspiciatis. Totam facilis officia saepe aliquid inventore!</p>
    </div>
  );
}
