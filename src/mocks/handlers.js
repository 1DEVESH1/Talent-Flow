import { http, delay, HttpResponse } from "msw";
import { db } from "../database/db";

const randomFail = () => Math.random() < 0.1; // 10% failure rate
const randomLatency = () => Math.random() * 1000 + 200; // 200-1200ms latency

// The "export" keyword was missing from this line
export const handlers = [
  // --- JOBS ---
  http.get("/jobs", async ({ request }) => {
    await delay(await randomLatency());

    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status");

    // Improvement: Let the database do the filtering!
    let jobsQuery;
    if (status && status !== "all") {
      jobsQuery = db.jobs.where("status").equals(status);
    } else {
      jobsQuery = db.jobs.toCollection();
    }

    let jobs = await jobsQuery.sortBy("order");

    if (search) {
      jobs = jobs.filter((j) =>
        j.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    return HttpResponse.json(jobs);
  }),

  http.post("/jobs", async ({ request }) => {
    await delay(await randomLatency());
    if (randomFail()) return new Response(null, { status: 500 });

    const newJobData = await request.json();
    const count = await db.jobs.count();

    const newJob = {
      ...newJobData,
      status: "active",
      tags: newJobData.tags || [],
      order: count + 1,
    };

    const id = await db.jobs.add(newJob);
    return HttpResponse.json({ ...newJob, id });
  }),
  http.patch("/jobs/:id", async ({ request, params }) => {
    await delay(await randomLatency());
    if (randomFail()) return new HttpResponse(null, { status: 500 });

    const { id } = params;
    const updates = await request.json();

    // Dexie primary keys are numbers, so we parse the ID
    const numericId = parseInt(id, 10);

    // Update the job in the database
    await db.jobs.update(numericId, updates);

    return HttpResponse.json({ success: true });
  }),
  http.patch("/jobs/:id/reorder", async ({ request }) => {
    await delay(await randomLatency());
    if (Math.random() < 0.0) {
      return HttpResponse.json(
        { message: "Failed to reorder" },
        { status: 500 }
      );
    }

    const { fromId, toOrder } = await request.json();

    await db.transaction("rw", db.jobs, async () => {
      // 1. Get all jobs sorted by current order
      let jobs = await db.jobs.orderBy("order").toArray();

      // 2. Find the dragged job
      const oldIndex = jobs.findIndex((j) => j.id === fromId);
      if (oldIndex === -1) return;

      // 3. Remove the dragged job
      const [movedJob] = jobs.splice(oldIndex, 1);

      // 4. Insert at new index (toOrder is 1-based, so subtract 1)
      const newIndex = Math.max(0, Math.min(jobs.length, toOrder - 1));
      jobs.splice(newIndex, 0, movedJob);

      // 5. Renumber all jobs sequentially
      jobs = jobs.map((job, idx) => ({ ...job, order: idx + 1 }));

      // 6. Save all back to DB
      await db.jobs.bulkPut(jobs);
    });

    return HttpResponse.json({ success: true });
  }),

  // --- CANDIDATES ---
  http.get("/candidates", async ({ request }) => {
    await delay(await randomLatency());
    const url = new URL(request.url);
    const stage = url.searchParams.get("stage");

    let candidates;
    if (stage && stage !== "all") {
      candidates = await db.candidates.where("stage").equals(stage).toArray();
    } else {
      candidates = await db.candidates.toArray();
    }

    return HttpResponse.json(candidates);
  }),

  http.patch("/candidates/:id", async ({ request, params }) => {
    await delay(await randomLatency());
    if (randomFail()) return new HttpResponse(null, { status: 500 });

    const { id } = params;
    const updates = await request.json();

    // Dexie keys are numbers, so we parse the param
    await db.candidates.update(parseInt(id, 10), updates);

    return HttpResponse.json({ success: true });
  }),
];
