"use client";
import axios from "axios";
import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const response = await axios.get("/api/user/logout");
    if (response.status === 200) router.push("/login");
  };
  return (
    <section>
      <h2 className="text-lg">Welcome</h2>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-normal py-2 px-3 rounded-lg mt-10 w-full"
        onClick={handleLogout}
      >
        Logout
      </button>
    </section>
  );
};

export default Logout;
