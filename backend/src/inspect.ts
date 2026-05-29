import prisma from "./prisma.ts";

async function main() {
  const users = await prisma.user.findMany();
  const workers = await prisma.worker.findMany();
  const tasks = await prisma.task.findMany({
    include: { options: true }
  });
  console.log("USERS:", users);
  console.log("WORKERS:", workers);
  console.log("TASKS:", tasks);
}

main().catch(console.error);
