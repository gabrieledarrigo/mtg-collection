import { defaultUser } from "./config";
import { prisma } from "./prisma";

async function main() {
  console.log("Seeding database.");

  await prisma.user.upsert({
    where: {
      id: defaultUser.id,
    },
    update: {},
    create: {
      ...defaultUser,
    },
  });
}

main()
  .then(async () => {
    console.log("DB seeding complete.");
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
