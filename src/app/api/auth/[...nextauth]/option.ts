import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../../lib/dbConnect";
import bcrypt from "bcryptjs";
import UserModel from '../../../../models/user.model';
import NextAuth from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import "next-auth";

// Define the CustomToken interface
interface CustomToken {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials?.email },
                            { username: credentials?.email }
                        ]
                    });

                    if (!user) {
                        throw new Error("No user found with this email or username.");
                    }
                    if (!user.isVerified) {
                        throw new Error("Please verify your account before login.");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        throw new Error("Incorrect password. Please try again.");
                    }
                } catch (err: any) {
                    throw new Error(err.message);
                }
            }
        })
    ],
    callbacks: {
        async jwt ({ token, user }) {
           // Type assertion to CustomToken
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            const customToken = token as CustomToken;  // Type assertion to CustomToken
            if (customToken) {
                session.user._id = customToken._id;
                session.user.isAcceptingMessage = customToken.isAcceptingMessage;
                session.user.isVerified = customToken.isVerified;
                session.user.username = customToken.username;
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin'
    }
};

export default NextAuth(authOptions);
