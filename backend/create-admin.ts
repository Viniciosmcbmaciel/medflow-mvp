import bcrypt from "bcryptjs";

import { prisma } from "./src/config/prisma.js";

async function main() {
  const passwordHash =
    await bcrypt.hash(
      "123456",
      10
    );

  const user =
    await prisma.user.upsert({
      where: {
        email:
          "admin@medflow.com",
      },

      update: {},

      create: {
        name: "Administrador",

        email:
          "admin@medflow.com",

        passwordHash,

        role: "ADMIN",
      },
    });

  console.log(user);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });