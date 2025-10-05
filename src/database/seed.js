import { db } from "./db";
import { faker } from "@faker-js/faker";
const assessmentSeeds = [
  {
    jobId: 1, 
    config: [
      {
        id: 1,
        type: "short-text",
        label: "What is your primary motivation for applying for this role?",
        required: true,
      },
      {
        id: 2,
        type: "long-text",
        label:
          "Describe a challenging project you worked on and how you handled it.",
        required: true,
      },
      {
        id: 3,
        type: "single-choice",
        label: "What is your preferred work environment?",
        required: false,
        options: [
          { id: 1, value: "Remote" },
          { id: 2, value: "Office" },
          { id: 3, value: "Hybrid" },
        ],
      },
      {
        id: 4,
        type: "numeric",
        label: "How many years of experience do you have with React?",
        required: true,
        min: 0,
        max: 20,
      },
      {
        id: 5,
        type: "file-upload",
        label: "Please upload your resume.",
        required: true,
      },
    ],
  },
  {
    jobId: 2,
    config: [
      {
        id: 1,
        type: "short-text",
        label: "What are your salary expectations?",
        required: true,
      },
      {
        id: 2,
        type: "multi-choice",
        label: "Which of the following technologies are you proficient in?",
        required: true,
        options: [
          { id: 1, value: "JavaScript" },
          { id: 2, value: "TypeScript" },
          { id: 3, value: "Python" },
          { id: 4, value: "Go" },
        ],
      },
      {
        id: 3,
        type: "long-text",
        label: "Where do you see yourself in 5 years?",
        required: false,
      },
    ],
  },
  {
    jobId: 3, 
    config: [
      {
        id: 1,
        type: "short-text",
        label: "What is your GitHub profile URL?",
        required: false,
      },
      {
        id: 2,
        type: "long-text",
        label:
          "Explain the concept of state management in a front-end application.",
        required: true,
      },
      {
        id: 3,
        type: "numeric",
        label:
          "On a scale of 1-10, how would you rate your communication skills?",
        required: true,
        min: 1,
        max: 10,
      },
    ],
  },
];
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
  await db.assessments.bulkAdd(assessmentSeeds);
  console.log("Database seeded successfully!");
}
