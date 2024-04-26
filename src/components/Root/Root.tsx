import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../Header/Header";

export const Root:React.FC = () => {
  return (
    <main>
      <Header />
      <Outlet />
    </main>
  )
}
