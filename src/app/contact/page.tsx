"use client";
import React from "react";
import { UserAuth } from "../context/AuthContext";

export default function Contact() { 
  const {user, userDB} = UserAuth();
  console.log(userDB)
  console.log(user)
  return (
    <div className="main-bg pt-14 md:pt-16 mb-10">
      <h1 className="text-center my-8 text-2xl font-bold text-slate-50">
        Contactanos
      </h1>
      <p>{user.email != null ? "user in" : "user out"}</p>
      
    </div>
  );
}
