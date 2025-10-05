import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";
const outputDir = path.join(process.cwd(), "public", "api");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log("Generating static data files...");

const jobs = [];
for (let i = 0; i < 25; i++) {
  const title = faker.person.jobTitle();
  jobs.push({
    id: i + 1, 
    title: title,
    slug: faker.helpers.slugify(title).toLowerCase(),
    status: Math.random() > 0.3 ? "active" : "archived",
    tags: faker.helpers.arrayElements(["Full-time", "Remote", "Contract"], {
      min: 1,
      max: 3,
    }),
    order: i + 1,
  });
}
fs.writeFileSync(
  path.join(outputDir, "jobs.json"),
  JSON.stringify(jobs, null, 2)
);
console.log(`Generated ${jobs.length} jobs at /public/api/jobs.json`);

const candidates = [];
const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];
for (let i = 0; i < 1000; i++) {
  candidates.push({
    id: i + 1,
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    stage: faker.helpers.arrayElement(stages),
    jobId: faker.helpers.arrayElement(jobs).id,
  });
}
fs.writeFileSync(
  path.join(outputDir, "candidates.json"),
  JSON.stringify(candidates, null, 2)
);
console.log(`Generated ${candidates.length} candidates at /public/api/candidates.json`);

console.log("\nStatic data generation complete!");



