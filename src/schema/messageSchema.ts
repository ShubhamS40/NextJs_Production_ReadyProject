import z from 'zod'

export const messageSchema=z.object({
    content:z.string().min(10,{message:"message at least 10 word compolsuroy"}).max(120,{message:"message  maximum 120 word capicity"} )
})