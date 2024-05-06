"use client";
import React from "react";
import GetData from "../components/getData/getData";
import { UserAuth } from "../context/AuthContext";
import { CardComponentPublication } from "../components/card/card";

export default function Account() {
  const { itemsList, loaded } = GetData();
  const { user, userDB } = UserAuth();
  console.log(itemsList);
  console.log("userDB.email", userDB.email);

  const publications = itemsList.filter((item) => item.email === userDB.email);
  console.log(publications);
  return (
    <div className="main-bg pt-14 md:pt-16 mb-10 h-[calc(100vh-64px)]">
      <h1 className="text-center my-8 text-2xl font-bold text-slate-50">
        Tus publicaciones
      </h1>
      <div className="flex flex-row justify-center flex-wrap gap-4 md:gap-8 p-1 md:mx-auto">
        {publications?.map((item, index) => (
          <CardComponentPublication
            key={index}
            title={item.name}
            imageSrc={item.image}
            district={item.district}
            location={item.location}
            description={item.description}
            age={item.age}
            date={item.date}
          />
        ))}
      </div>
    </div>
  );
}