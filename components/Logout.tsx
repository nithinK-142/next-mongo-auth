import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Logout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const logoutPromise = axios.get("/api/users/logout").then(
        (response) => {
          if (response.data.error) {
            throw new Error(response.data.error);
          }
          localStorage.clear();
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
        error: (err: any) => `Logout failed: ${err}`,
      });
    } catch (error) {
      console.log(error);
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
