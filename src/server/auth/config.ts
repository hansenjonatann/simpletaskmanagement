import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcrypt-ts";
import {  type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { db } from "~/server/db";

export const authConfig = {
  providers: [

    Credentials({
      name: 'credentials' , 
      credentials: {
       username: {label: 'Username' , type: 'text'},
       password: {label: 'Password' , type: 'password'} 
      },
      async authorize(credentials: any) {
        const user = await db.user.findFirst({
          where: {
            username: credentials?.username
          }
        })

        if(!user) throw new Error('User not found')

        const isValidPassword = await compare(credentials.password , user.password)

        if(!isValidPassword) throw new Error('Invalid Credentials!')

        return {id: user.id , username: user.username , name: user.name}
      },
    },
    
  ),
   
  ],
  session: {
    strategy: 'jwt'
  },

  adapter: PrismaAdapter(db),
  callbacks: {

    async jwt({token , user} : any) {
      if(user) {
        token.id  = user.id 
        token.name = user.name 
        token.username = user.username
      }

      return token
    },

    async session({session , token} : any) {
      if(token) {
        session.user = {
          id: token.id ,
          name: token.name ,
          username: token.username
        }
      }
      return session

    }
  },
  secret: process.env.AUTH_SECRET
} satisfies NextAuthConfig;
