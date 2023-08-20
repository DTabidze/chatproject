"use client";
import Image from "next/image";
import Login from "./login/page";
import { UserContext } from "./UserContext";
import { useContext } from "react";
import MainPanel from "./mainpanel/page";

export default function Page() {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  return (
    <>{Object.keys(loggedInUser).length === 0 ? <Login /> : <MainPanel />}</>
  );
}
