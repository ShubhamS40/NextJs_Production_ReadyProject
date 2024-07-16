import { z } from 'zod'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/models/user.model'
import { usernameSchema } from "@/schema/signupSchema"
import { routeApiResponse } from '@/type/routeApiResponse'


const UsernameQuerySchema = z.object({
    username: usernameSchema
})

export async function POST(request: Request): Promise<routeApiResponse> {
    await dbConnect()
    try {
        const { searchParams } = new URL(request.url);
        const queryParams = {
            username: searchParams.get('username')
        }
        // validate with zod

        const result = UsernameQuerySchema.safeParse(queryParams)
        console.log(result);
        if (!result.success) {
            const usernameError = result.error.format().username?._errors || []
            return {
                success: false,
                message: usernameError?.length > 0 ?
                    usernameError.join(',') :
                    'Invalid Query Parameter'
            }
        }
        const { username }: any = await result.data
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })
        if (existingVerifiedUser) {
            return {
                success: true,
                message: "usename is already exists"
            }
        }
        return {
            success: true,
            message: "Username is Unique"
        }

    }
    catch (error: any) {
        console.log("check username -auth route not work");

        return {
            success: false,
            message: `Something Went Wrong :${error}`
        }
    }
}
