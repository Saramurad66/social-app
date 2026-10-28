import { useContext, useState } from "react";
import { Button, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type loginSchemaType,
} from "../../Componant/schema/auth.schema";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext";


/*
formik
react-hook-form==>RHf
*/

export default function login() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

const { setuserLogin } = useContext(AuthContext);
  const form = useForm<loginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  let { register, handleSubmit, formState } = form;

  function handleLogin(value: loginSchemaType) {
    setIsLoading(true);
    setApiError(null);

    axios
      .post("https://route-posts.routemisr.com/users/signin", value)
      .then((res) => {
        console.log(res.data);

        if (res.data.success) {
          console.log(res.data.data.token);

          localStorage.setItem("userToken", res.data.data.token);
          setuserLogin(res.data.data.token)
          // token set state
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err.response?.data);
        setApiError(err.response?.data?.message || "Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <main className="pt-10">
        <section>
          <h1 className="text-4xl font-black text-blue-950">Login Now</h1>

          {apiError && (
            <p className="bg-red-500 text-white text-center font-bold p-2 rounded-md">
              {apiError}
            </p>
          )}

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6 pt-4">
            <Input
              aria-label="Email"
              type="email"
              className="w-full rounded-md"
              placeholder="Email"
              autoComplete="email"
              id="email"
              {...register("email")}
            />

            {formState.errors.email?.message && (
              <p className="text-red-600 font-bold bg-gray-200 rounded-md p-3">
                {formState.errors.email?.message}
              </p>
            )}

            <Input
              aria-label="password"
              type="password"
              className="w-full rounded-md"
              placeholder="Password"
              autoComplete="current-password"
              id="password"
              {...register("password")}
            />

            {formState.errors.password?.message && (
              <p className="text-red-600 font-bold bg-gray-200 rounded-md p-3">
                {formState.errors.password?.message}
              </p>
            )}

            <Button
              isDisabled={isLoading}
              className="bg-blue-950 rounded-md w-full disabled:bg-slate-900 disabled:text-white disabled:cursor-not-allowed"
              type="submit"
            >
              {isLoading ? "Loading..." : "Login"}
            </Button>
             <div className="flex justify-center my-2 text-blue-950 underline font-bold"><Link to="/auth/register">Do You Have An Account ? Go Register</Link></div>

          </form>
        </section>
      </main>
    </>
  );
}
