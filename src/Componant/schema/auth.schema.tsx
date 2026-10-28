
import * as zod from "zod";

export const registerSchema = zod
  .object({
    name: zod
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(10, "Name must be at most 10 characters"),

    username: zod
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(10, "Username must be at most 10 characters"),

    email: zod
      .string()
      .email("Invalid email"),

    dateOfBirth: zod
      .string()
      .min(1, "Date of birth is required"),

    gender: zod.enum(["male", "female"]),

    password: zod
      .string()
      .min(8, "Password must be at least 8 characters"),

    rePassword: zod
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.rePassword, {
    path: ["rePassword"],
    message: "Passwords do not match",
  });

export type registerSchemaType = zod.infer<typeof registerSchema>


/////////////////////////////////////////////////

export const loginSchema = zod
  .object({

    email: zod
      .string()
      .email("Invalid email"),

  
    password: zod
      .string()
      .min(8, "Password must be at least 8 characters"),

  
  })
 

export type loginSchemaType = zod.infer<typeof loginSchema>