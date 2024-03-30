"use client";
import {
  ResetPasswordEmailType,
  resetPasswordEmailSchema,
} from "@/utils/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

const defaultData = { email: "" };

const GenerateToken = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordEmailType>({
    resolver: zodResolver(resetPasswordEmailSchema),
  });

  const handleFormSubmit: SubmitHandler<ResetPasswordEmailType> = async (
    formData
  ) => {
    try {
      const responsePromise = axios.post(
        "/api/users/reset-password/generate-token",
        { email: formData.email }
      );

      toast.promise(responsePromise, {
        loading: "processing...",
        success: (response) => {
          reset(defaultData);
          return response.data.message;
        },
        error: (error) => error.response.data.error,
      });
    } catch (error: any) {
      console.log(error.response);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-semibold leading-tight tracking-wider text-gray-900 md:text-2xl dark:text-white">
              RESET PASSWORD
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(handleFormSubmit)}
            >
              <div className="relative pb-4">
                <span className="absolute right-0 pt-1 text-sm font-medium text-red-500">
                  {errors.email?.message}
                </span>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className="bg-gray-50 border mb-4 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter your email..."
                  required
                  autoComplete="off"
                />
                <div className="absolute right-0">
                  <Link
                    href="/login"
                    className="text-sm  font-light text-gray-500 dark:text-gray-100"
                  >
                    back to{" "}
                    <span className="font-medium dark:text-gray-200 hover:underline">
                      login?
                    </span>
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenerateToken;
