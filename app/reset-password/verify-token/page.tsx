"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent } from "react";
import toast from "react-hot-toast";
import { Suspense } from "react";
import { verifyTokenSchema } from "@/utils/schemas/token.schema";
import { z } from "zod";

const VerifyTokenClient = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("verifyToken");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const validatedToken = verifyTokenSchema.parse({ token });
      const responsePromise = axios.post(
        "/api/users/reset-password/verify-token",
        { token: validatedToken.token }
      );

      toast.promise(responsePromise, {
        loading: "processing...",
        success: (response) => {
          router.push("/reset-password");
          return response.data.message;
        },
        error: (error) =>
          `User verification failed: ${error.response.data.error}`,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const firstIssue = error.issues[0];
        toast.error(firstIssue.message);
        router.push("/login");
      } else console.log(error.response);
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

const VerifyToken = () => {
  return (
    <Suspense>
      <VerifyTokenClient />
    </Suspense>
  );
};

export default VerifyToken;
