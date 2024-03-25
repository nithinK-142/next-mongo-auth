"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Logout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const logoutPromise = axios.get("/api/user/logout").then(
        (response) => {
          if (response.data.error) {
            throw new Error(response.data.error);
          }
          return response;
        },
        (error) => {
          console.log(error);
          throw error;
        }
      );

      toast.promise(logoutPromise, {
        loading: "Logging out...",
        success: () => {
          router.push("/login");
          return "Logout successful";
        },
        error: (err) => `Logout failed: ${err.message}`,
      });
    } catch (error) {
      console.log(error);
    }
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
