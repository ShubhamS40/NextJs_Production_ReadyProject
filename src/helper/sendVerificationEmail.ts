import {resend } from '@/lib/resend'
import { ApiResponse } from '@/type/apiResponseType'
import { EmailTemplate } from '../../email/email-template'

// interface SendVerificationEmailType{
//     username:string,
//     email:string,
//     otp:string

// }


export async function SendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string,

):Promise<ApiResponse>{
      try {
        await resend.emails.send({
            from:'shubham.0202.in@gmail.com',
            to:'robot2004asiwal@gmail.com',
            subject:'hello sir welcome to next js',
            react:EmailTemplate(username,verifyCode)
        })

        return {success:true,message:"Verification email send Successfull"}
        
      } catch (emailError) {
        console.log("Error Sending Verification email",emailError)
        return {success:false,message:"Error Sending Verification Email"}
        
      }
}