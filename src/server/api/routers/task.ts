import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "~/server/db";

export const taskRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const tasks = await db.task.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          category: true,
        },
      });
      return tasks ?? [];
    }),

  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        title: z.string(),
        content: z.string(),
        categoryId: z.string(),
        due: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      if (!input.title || !input.categoryId || !input.due)
        throw new Error("All fields are required");

      const newTask = await db.task.create({
        data: {
          title: input.title,
          content: input.content,
          due: input.due,
          userId: input.userId,
          categoryId: input.categoryId,
          status: "TODO",
        },
      });

      if (!newTask) throw new Error("Something went wrong!");

      return newTask;
    }),

  changeStatus: publicProcedure
    .input(
      z.object({
        status: z.enum(["TODO", "DOING", "DONE"]),
        id: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.task.update({
        where: {
          id: input.id,
          userId: input.userId,
        },
        data: {
          status: input.status,
        },
      });
    }),

  detail: publicProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .query(async ({ input }) => {
      await db.task.findFirst({
        where: {
          id: input.id,
          userId: input.userId,
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
        title: z.string(),
        content: z.string(),
        due: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const task = await db.task.findFirst({
        where: {
          id: input.id,
          userId: input.userId,
        },
      });

      if (!task) throw new Error("Task not found!");

      const updatedTask = await db.task.update({
        where: {
          id: input.id,
          userId: input.userId,
        },
        data: {
          title: input.title,
          content: input.content,
          due: input.due,
        },
      });

      return updatedTask;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .mutation(async ({ input }) => {
      await db.task.delete({
        where: {
          id: input.id,
          userId: input.userId,
        },
      });
    }),

  filterByStatus: publicProcedure
    .input(
      z.object({
        status: z.string(),
        userId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const tasks = await db.task.findMany({
        where: {
          userId: input.userId,
          status: input.status as 'TODO' | 'DOING' | 'DONE',
        },
        include: {
          category: true,
        },
      });
      return tasks
    }),

  filterByCategory: publicProcedure
    .input(z.object({ categoryId: z.string(), userId: z.string() }))
    .query(async ({ input }) => {
      const tasks = await db.task.findMany({
        where: {
          userId: input.userId,
          categoryId: input.categoryId,
        },
        include: {
          category: true,
        },
        
        
      } );
      return tasks
    }),
});
