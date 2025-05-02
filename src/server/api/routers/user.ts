import {z} from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { db } from '~/server/db'
import { hashSync } from 'bcrypt-ts'

export const userRouter = createTRPCRouter({
    signUp: publicProcedure.input(z.object({name: z.string() , username: z.string() , confirmPassword: z.string() , password: z.string()})).mutation(async ({input}) => {
        const user  = await db.user.findFirst({
            where: {
                username: input.username
            }
        })

        if(user) throw new Error('User already exists ! Please create a different username')

        if(input.password !== input.confirmPassword) throw new Error('Password and Password Confirmation does not match!')

        const hashedPassword = hashSync(input.password)
        const newUser = await db.user.create({
            data: {
                name: input.name ,
                username: input.username,
                password: hashedPassword 
            }
        })

        return newUser


    })

})