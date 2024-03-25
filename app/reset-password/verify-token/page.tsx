"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect } from "react";
import toast from "react-hot-toast";

const VerifyToken = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("verifyToken");
  const tokenId = searchParams.get("verifyTokenId");
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tokenId", tokenId as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const responsePromise = axios
        .post("/api/users/reset-password/verify-token", { token })
        .then(
          (response) => {
            if (response.data.error) throw new Error(response.data.error);
            return response;
          },
          (error) => {
            console.log(error);
            throw error;
          }
        );

      toast.promise(responsePromise, {
        loading: "processing...",
        success: () => {
          router.push("/reset-password");
          return "Token verified successfuly!";
        },
        error: (err: any) => `Token verification failed: ${err}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        {token && (
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl text-center font-semibold leading-tight tracking-wider text-gray-900 md:text-2xl dark:text-white">
                VERIFY USER
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={(e) => handleSubmit(e)}
              >
                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Click here
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VerifyToken;
