import {  useState } from "react";
import { Button, Input } from "@heroui/react";
import { ListBox, Select } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type registerSchemaType,
} from "../../Componant/schema/auth.schema";
import axios from "axios";
import { Link, useNavigate } from "react-router";

/*
formik
react-hook-form==>RHf
*/

export default function Register() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<registerSchemaType>({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "female",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  let { register, handleSubmit, formState } = form;

  function handleRegister(value: registerSchemaType) {
    setIsLoading(true);
    setApiError(null);

    axios
      .post("https://route-posts.routemisr.com/users/signup", value)
      .then((res) => {
        console.log(res.data);

        if (res.data.success) {
          navigate("/auth/login");
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
          <h1 className="text-4xl font-black text-blue-950">
            Creat A New Account
          </h1>

          {apiError && (
            <p className="bg-red-500 text-white text-center font-bold p-2 rounded-md">
              {apiError}
            </p>
          )}

          <form
            onSubmit={handleSubmit(handleRegister)}
            className="space-y-6 pt-4"
          >
            <Input
              {...register("name")}
              aria-label="FullName"
              className="w-full rounded-md"
              placeholder="Full Name"
              autoComplete="name"
              id="name"
            />
            {formState.errors.name?.message && (
              <p className="text-red-600 font-bold bg-gray-200 rounded-md p-3">
                {formState.errors.name?.message}
              </p>
            )}
            <Input
              aria-label="UserName"
              className="w-full rounded-md"
              placeholder="User Name"
              autoComplete="username"
              id="user-name"
              {...register("username")}
            />
            {formState.errors.username?.message && (
              <p className="text-red-600 font-bold bg-gray-200 rounded-md p-3">
                {formState.errors.username?.message}
              </p>
            )}
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
            <Controller
              name="gender"
              control={form.control}
              render={({ field }) => (
                <Select
                  className="w-full"
                  placeholder="Select Gender"
                  value={field.value}
                  onChange={field.onChange}
                  aria-label="Gender"
                >
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>

                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="female" textValue="Female">
                        Female
                        <ListBox.ItemIndicator />
                      </ListBox.Item>

                      <ListBox.Item id="male" textValue="Male">
                        Male
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
              )}
            />
            <Input
              aria-label="date"
              className="w-full rounded-md"
              type="date"
              autoComplete="bday"
              id="date"
              {...register("dateOfBirth")}
            />
            {formState.errors.dateOfBirth?.message && (
              <p className="text-red-600 font-bold bg-gray-200 rounded-md p-3">
                {formState.errors.dateOfBirth?.message}
              </p>
            )}
            <Input
              aria-label="password"
              type="password"
              className="w-full rounded-md"
              placeholder="Password"
              autoComplete="new-password"
              id="password"
              {...register("password")}
            />
            {formState.errors.password?.message && (
              <p className="text-red-600 font-bold bg-gray-200 rounded-md p-3">
                {formState.errors.password?.message}
              </p>
            )}
            <Input
              aria-label="confirm password"
              type="password"
              className="w-full rounded-md"
              placeholder="Confirm Password"
              autoComplete="new-password"
              id="confirm-password"
              {...register("rePassword")}
            />
            {formState.errors.rePassword?.message && (
              <p className="text-red-600 font-bold bg-gray-200 rounded-md p-3">
                {formState.errors.rePassword?.message}
              </p>
            )}
            <Button
              isDisabled={isLoading}
              className="bg-blue-950 rounded-md w-full disabled:bg-slate-900 disabled:text-white disabled:cursor-not-allowed"
              type="submit"
            >
              {isLoading ? "Loading..." : "Create New Account"}
            </Button>
            <div className="flex justify-center my-2 text-blue-950 underline font-bold"><Link to="/auth/login">Do You Have An Account ? Go Login</Link></div>
          </form>
        </section>
      </main>
    </>
  );
}
