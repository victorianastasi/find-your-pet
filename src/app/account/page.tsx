"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserAuth } from "../context/AuthContext";
import { CardComponentPublication } from "../components/card/card";
import { Item } from "../components/models";
import { GiNotebook } from "react-icons/gi";
import { ThreeCircles } from "react-loader-spinner";
import { db, deleteItemById, getItems } from "../firebase";

export default function Account() {
  const { user } = UserAuth();
  const noItems = "img/no-items.svg";

  const [itemsPublications, setItemsPublications] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getItems(db);
      setItemsPublications(data as Item[]);
      setLoaded(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const publications: Item[] = itemsPublications.filter(
    (item) => item.email === user.email
  );

  const deletePublications = async (id: string) => {
    try {
      setLoaded(false);
      await deleteItemById(db, id);
      await fetchData();
      await setLoaded(true);
    } catch (error) {
      console.error("Error al eliminar el item:", error);
    }
  };

  return (
    <div className="main-bg pt-14 md:pt-16 mb-10 h-[calc(100vh-64px)]">
      <h1 className="text-center my-8 text-2xl font-bold text-slate-50">
        Tus publicaciones
      </h1>
      <div className="flex flex-row justify-center flex-wrap gap-4 md:gap-8 p-1 md:mx-auto mt-12">
        {loaded ? (
          publications.length == 0 || user.email == null ? (
            <div className="bg-slate-50/50 rounded-lg mx-2 md:px-24 max-w-4xl 550:mx-auto">
              <div className="flex flex-col items-center gap-4 pt-16 pb-24 mt-4">
                <h2 className="text-center text-2xl font-bold text-slate-700">
                  Aún no tienes publicaciones
                </h2>
                <Image src={noItems} width={350} height={350} alt=""></Image>
                {/* <a href="https://storyset.com/online">Online illustrations by Storyset</a> */}
                <Link
                  href="/add"
                  className="group flex items-center gap-2 px-4 py-2 leading-none rounded-full border-2 md:border-1 hover:border-transparent hover:text-amber-600 hover:bg-white mx-6 md:mx-0 max-w-[250px] border-gray-700 bg-gray-700 text-white shadow-lg"
                >
                  <GiNotebook size={24} className="min-w-[24px]" />
                  <span>Crear una publicación</span>
                </Link>
              </div>
            </div>
          ) : (
            publications?.map((item, index) => (
              <CardComponentPublication
                key={index}
                title={item.name}
                imageSrc={item.image}
                district={item.district}
                location={item.location}
                description={item.description}
                age={item.age}
                date={item.date}
                email={item.email}
                userName={item.userName}
                phone={item.phone}
                id={item.id}
                deleteAction={() => item.id && deletePublications(item.id)}
              />
            ))
          )
        ) : (
          <div className="min-h-[500px] flex flex-col items-center justify-start mx-auto text-slate-50 cabin">
            <p className="text-xl mb-4">Cargando..</p>
            <ThreeCircles
              visible={true}
              height="100"
              width="100"
              color="#FFFBEB"
              ariaLabel="Cargando"
            />
          </div>
        )}
      </div>
    </div>
  );
}
