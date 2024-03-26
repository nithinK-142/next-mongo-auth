import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Logout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const responsePromise = axios.get("/api/users/logout");

      toast.promise(responsePromise, {
        loading: "Logging out...",
        success: (response) => {
          localStorage.clear();
          router.push("/login");
          return response.data.message;
        },
        error: (error) => `Logout failed: ${error.response.data.error}`,
      });
    } catch (error: any) {
      console.log(error.response);
    }
  };
  return (
    <button
      className="px-4 py-1 rounded-lg text-white bg-black/80 dark:bg-white/80 dark:text-black/70"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default Logout;
