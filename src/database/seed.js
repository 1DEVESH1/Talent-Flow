import { db } from "./db";
import { faker } from "@faker-js/faker";

export async function seedDatabase() {
  const jobsCount = await db.jobs.count();
  if (jobsCount > 0) {
    console.log("Database already seeded.");
    return;
  }

  console.log("Seeding database...");
  const jobs = [];
  const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];

  for (let i = 0; i < 25; i++) {
    jobs.push({
      title: faker.person.jobTitle(),
      slug: faker.helpers.slugify(faker.person.jobTitle()).toLowerCase(),
      status: Math.random() > 0.3 ? "active" : "archived",
      tags: faker.helpers.arrayElements(["Full-time", "Remote", "Contract"], {
        min: 1,
        max: 3,
      }),
      order: i + 1,
    });
  }
  const addedJobs = await db.jobs.bulkAdd(jobs, { allKeys: true });

  const candidates = [];
  for (let i = 0; i < 1000; i++) {
    candidates.push({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      stage: faker.helpers.arrayElement(stages),
      jobId: faker.helpers.arrayElement(addedJobs),
    });
  }
  await db.candidates.bulkAdd(candidates);

  console.log("Database seeded successfully!");
}
