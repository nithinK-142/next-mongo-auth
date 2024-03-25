"use client";
import { useState, useEffect } from "react";
import Logout from "./Logout";

const Profile = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("username");
      setUsername(storedUsername || "");
    }
  }, []);
  return (
    username && (
      <div className="flex- flex-col space-y-6">
        <h3 className="text-green-400/80 text-lg">
          Signed in as{" "}
          <span className="text-green-400 text-2xl">{username}</span>
        </h3>
        <Logout />
      </div>
    )
  );
};

export default Profile;
