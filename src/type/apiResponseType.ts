import { Message } from "@/models/user.model";
import { boolean, string } from "zod";


export interface ApiResponse{
    success:boolean,
    message:string,
    isAcceptingMessage?:boolean,
    messages?:Array<Message>

}