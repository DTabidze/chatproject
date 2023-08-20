"use client";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [loggedInUser, setLoggedInUser] = useState({});
  const refreshUser = async () => {
    try {
      const response = await fetch("http://192.168.1.162:8080/session", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const user = await response.json();
        console.log("LOGGED IN USER: ", user);
        if (user) {
          setLoggedInUser(user);
        } else {
          // Handle no user data
        }
      } else {
        console.error("Error fetching data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    console.log("Fetch and state update complete.");
  };

  useEffect(() => {
    refreshUser(); // Call it when the component mounts to fetch initial user data
  }, []);
  return (
    <UserContext.Provider
      value={{ loggedInUser, setLoggedInUser, refreshUser }}
    >
      {children}
    </UserContext.Provider>
  );
}
