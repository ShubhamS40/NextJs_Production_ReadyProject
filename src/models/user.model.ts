import { create } from "domain";
import mongoose, { Schema, Document } from "mongoose";
import { boolean } from "zod";


export interface Message extends Document {
    content: string,
    createdAt: Date

}

 const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }

})

export interface User extends Document {
    username: string,
    email: string,
    password: string,
    verifyCodeExpiry: Date,
    verifyCode: string,
    isAcceptingMessage: boolean,
    isVerified:boolean
    message: Message[]
}

const userSchema: Schema<User> = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"]
        },
        email: {
            type: String,
            required: [true, "email is required"],
            match:[/.+\@.+\..+/,"please use a valid email"] // it will come up with regex
        },
        password: {
            type: String,
            unique: true,
            required: [true, "Username is required"]
        },
        verifyCode:{
            type:String,
            required: [true, "VerifyCode is required"]
        },
       
        isVerified:{
            type:Boolean,
            default:false        
        },
        verifyCodeExpiry:{
            type:Date,
            required:[true,"verify code Expiry is required"]
        },
        isAcceptingMessage:{
            type:Boolean,
            default:true
        },
        message:[messageSchema]
   
    }, {
        timestamps: {
            createdAt: true,
            updatedAt: true
        }
})



const UserModel= (mongoose.models.User as mongoose.Model<User>) || ( mongoose.model<User>("User",userSchema)  )

export default UserModel;