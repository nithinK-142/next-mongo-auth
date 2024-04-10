"use client";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginType, loginSchema } from "@/schemas/auth.schema";

const defaultData = { username: "", password: "" };

const LoginPage = () => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  });

  const handleFormSubmit: SubmitHandler<LoginType> = async (formData) => {
    try {
      const responsePromise = axios.post("/api/users/login", formData);

      toast.promise(
        responsePromise,
        {
          loading: "processing...",
          success: (response) => {
            localStorage.setItem("username", response.data.username);
            router.push("/");
            reset(defaultData);
            return response.data.message;
          },
          error: (error) => `Login failed: ${error.response.data.error}`,
        },
        { success: { icon: "🚀" } }
      );
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
              LOGIN
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(handleFormSubmit)}
            >
              <div className="relative pb-2">
                <span className="absolute right-0 pt-1 text-sm font-medium text-red-500">
                  {errors.username?.message}
                </span>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  {...register("username")}
                  placeholder="Homelander"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="relative pb-2">
                <span className="absolute right-0 pt-1 text-sm font-medium text-red-500">
                  {errors.password?.message}
                </span>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
                <div className="absolute right-0">
                  <Link
                    href="/reset-password/generate-token"
                    className="text-sm  font-light text-gray-500 dark:text-gray-100 hover:underline"
                  >
                    forgot password?
                  </Link>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
              <p className="text-sm text-right font-light text-gray-500 dark:text-gray-100">
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/register"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
