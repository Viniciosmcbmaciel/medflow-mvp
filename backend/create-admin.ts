import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash(
    "123456",
    10
  );

  const user =
    await prisma.user.upsert({
      where: {
        email: "admin@medflow.com",
      },

      update: {
        password,
      },

      create: {
        name: "Administrador",
        email: "admin@medflow.com",
        password,
        role: "ADMIN",
      },
    });

  console.log(
    "Usuário criado:",
    user.email
  );
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });