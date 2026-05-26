import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword =
    await bcrypt.hash(
      "admin123",
      10
    );

  await prisma.user.upsert({
    where: {
      email: "admin@medflow.com",
    },

    update: {},

    create: {
      name: "Administrador",

      email:
        "admin@medflow.com",

      passwordHash:
        hashedPassword,

      role: "ADMIN",
    },
  });

  console.log(
    "Seed executado com sucesso!"
  );
}

main()
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });