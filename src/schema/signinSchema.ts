import z from 'zod'

export const signinSchema=z.object({
    email:z.string().email({message:"Invalid email"}),
    password:z.string()
})