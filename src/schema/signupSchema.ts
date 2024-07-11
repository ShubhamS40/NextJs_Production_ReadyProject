import { z } from "zod";

const usernameRegex = /^[a-zA-Z0-9._]{5,10}$/;

export const usernameSchema = z
    .string()
    .min(5, { message: "Username should be at least 5 characters long" })
    .max(10, { message: "Username should not exceed 10 characters" })
    .regex(/^[a-zA-Z0-9._]{5,10}$/, { message: "Username should not contain special characters" });

export const signupSchema=z.object({
    username:usernameSchema,
    email:z.string().email({message:"Invalid email"}),
    password:z.string().min(6,{message:"Password Should me minimum 6 character allowed"})

})    