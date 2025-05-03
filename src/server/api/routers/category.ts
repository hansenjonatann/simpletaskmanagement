import {z} from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { db } from '~/server/db'

export const categoryRouter = createTRPCRouter({
    get: publicProcedure.input(z.object({userId: z.string()})).query(async ({input}) => {
         const categories = await db.category.findMany({
            where: {
                userId: input.userId
            },
            include: {
                tasks: true
            }
        })

        return categories ?? []

      

    }),

    create: publicProcedure.input(z.object({name: z.string() , userId: z.string() })).mutation(async ({input}) => {
        if(!input.name || !input.userId) throw new Error('All fields are required!')

        const newCategory = await db.category.create({
        data: {
            userId: input.userId,
            name: input.name , 
            slug: input.name.toLowerCase().replaceAll(' ' , '-')
        } 
        })


        return newCategory
    }),

   

    update: publicProcedure.input(z.object({id: z.string() , userId: z.string() , name: z.string()})).mutation(async ({input}) => {
        const category = await db.category.findFirst({
            where: {
                id: input.id , 
                userId: input.userId
            }
        })

        if(!category) throw new Error('Category not found!')
        
        const updatedCategory = await db.category.update({
            data: {
                name: input.name , 
                slug: input.name.toLowerCase().replaceAll(' ', '-')
            },
            where: {
                id: input.id , 
                userId: input.userId
            }
        })

        return updatedCategory
    }),

    delete: publicProcedure.input(z.object({id: z.string() , userId: z.string()})).mutation(async ({input}) => {
        await db.category.delete({
            where: {
                id: input.id , 
                userId: input.userId
            }
        })
    })


})