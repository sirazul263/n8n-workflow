import { inngest } from "@/inngest/client";
import { createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/database";

export const appRouter = createTRPCRouter({
  testAi: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "execute/ai",
    });

    return { success: true, message: "Job queued" };
  }),

  getUsers: protectedProcedure.query(({ ctx }) => {
    return prisma.user.findMany({
      where: {
        id: ctx.auth.user.id,
      },
    });
  }),
  getWorkflows: protectedProcedure.query(() => {
    return prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "sirazul@gmail.com",
      },
    });

    return prisma.workflow.create({
      data: {
        name: "test-workflow",
      },
    });
  }),
});
export type AppRouter = typeof appRouter;
