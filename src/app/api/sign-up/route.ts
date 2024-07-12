import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { SendVerificationEmail } from "@/helper/sendVerificationEmail";
import { NextApiRequest,NextApiResponse } from "next";
import bcrypt from 'bcryptjs';
import { routeApiResponse } from "@/type/routeApiResponse";

interface User extends Document {
    username: string,
    email: string,
    password: string,
    verifyCodeExpiry: Date,
    verifyCode: string,
    isAcceptingMessage: boolean,
    isVerified:boolean
    // message: Message[]
}

async function POST(request:Request):Promise<routeApiResponse> {
   await dbConnect()
  
    try {
        const otp = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        const expiryDate=new Date()
        expiryDate.setHours(expiryDate.getHours()+1)
        const {username,email,password}= await request.json()
        const VerifyedUser= await UserModel.findOne({username:username,isVerified:true})
        if(VerifyedUser){
            console.log("User is already registered and verified");
            return {success:true,message:"User is Valid and Already Registered or Verified"}
        }

        const RegisteredUser=await UserModel.findOne({email:email})
        if (RegisteredUser) {
            if (RegisteredUser?.isVerified) {
                console.log("User is Registered But Not Verified");
                return {success:false,message:"User  already exists with this email please provide new email"}
            }else{
               const hashPassword=await bcrypt.hash(password,10)
               RegisteredUser.password=hashPassword
               RegisteredUser.verifyCode=otp
               RegisteredUser.verifyCodeExpiry=expiryDate
               await RegisteredUser.save()

               console.log("User Created Successfully");
             const emailResponse=await SendVerificationEmail(email,username,otp)
             if(!emailResponse){
                 return {success:false,message:`send verification mail throw error on signup api : ${emailResponse}`}
             }
             return {success:true,message:"User Registered Successfully please Verified Your Email "}
            }
        }else{
            const hashPassword=await bcrypt.hash(password,10)
            

            const newUser= new UserModel(
                {
                 username,
                 email,
                 password:hashPassword,
                 isVerified:false,
                 verifyCode:otp,
                 verifyCodeExpiry:expiryDate,
                 isAcceptingMessage:true,
                 message:[]
         
                }
             )
              await newUser.save()
              console.log("User Created Successfully");
              const verifyCode=otp
            const emailResponse=await SendVerificationEmail(email,username,verifyCode)
            if(!emailResponse){
                return {success:false,message:`send verification mail throw error on signup api : ${emailResponse}`}
            }
            return {success:true,message:"User Registered Successfully please Verified Your Email "}

        }
    
    } catch (error) {
        return {success:false,message:"Somthing Want Wrong Catch Part Exceuite"}
    }

} 