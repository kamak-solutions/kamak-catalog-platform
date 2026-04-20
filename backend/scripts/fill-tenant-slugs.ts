import { prisma } from "../src/lib/prisma.js";
import { slugify } from "../src/shared/utils/slug.js"
async function main() {
  const tenants = await prisma.tenant.findMany();

  for (const tenant of tenants) {
    if (tenant.slug) continue;

    const baseSlug = slugify(tenant.name);

    let slug = baseSlug || `tenant-${tenant.id.slice(0, 8)}`;
    let counter = 1;

    while (await prisma.tenant.findFirst({
      where: {
        slug,
        NOT: { id: tenant.id },
      },
    })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    await prisma.tenant.update({
      where: { id: tenant.id },
      data: { slug },
    });

    console.log(`Tenant ${tenant.name} -> ${slug}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });