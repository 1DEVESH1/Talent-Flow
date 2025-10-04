import { http, delay, HttpResponse } from "msw";
import { db } from "../database/db";

const randomFail = () => Math.random() < 0.1;
const randomLatency = () => Math.random() * 1000 + 200;

export const handlers = [
  http.get("/jobs", async ({ request }) => {
    await delay(await randomLatency());
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status");
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

  http.get("/jobs/:jobId", async ({ params }) => {
    await delay(await randomLatency());
    const { jobId } = params;
    const job = await db.jobs.get(parseInt(jobId, 10));

    if (!job) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(job);
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
    const numericId = parseInt(id, 10);
    await db.jobs.update(numericId, updates);
    return HttpResponse.json({ success: true });
  }),

  http.patch("/jobs/:id/reorder", async ({ request }) => {
    await delay(await randomLatency());
    if (Math.random() < 0.05) {
      return HttpResponse.json(
        { message: "Failed to reorder" },
        { status: 500 }
      );
    }
    const { fromId, toOrder } = await request.json();
    await db.transaction("rw", db.jobs, async () => {
      let jobs = await db.jobs.orderBy("order").toArray();
      const oldIndex = jobs.findIndex((j) => j.id === fromId);
      if (oldIndex === -1) return;
      const [movedJob] = jobs.splice(oldIndex, 1);
      const newIndex = Math.max(0, Math.min(jobs.length, toOrder - 1));
      jobs.splice(newIndex, 0, movedJob);
      jobs = jobs.map((job, idx) => ({ ...job, order: idx + 1 }));
      await db.jobs.bulkPut(jobs);
    });
    return HttpResponse.json({ success: true });
  }),

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
    await db.candidates.update(parseInt(id, 10), updates);
    return HttpResponse.json({ success: true });
  }),
  
  http.get("/candidates/:candidateId", async ({ params }) => {
    await delay(await randomLatency());
    const { candidateId } = params;
    const candidate = await db.candidates.get(parseInt(candidateId, 10));
    return candidate
      ? HttpResponse.json(candidate)
      : new HttpResponse(null, { status: 404 });
  }),

  http.get("/candidates/:candidateId/timeline", async () => {
    await delay(await randomLatency());
    // In a real app, this data would come from the database.
    // For this project, we'll return a mocked static timeline.
    const mockTimeline = [
      { event: "Applied for Senior Developer", date: "2024-09-01" },
      { event: "Moved to Screen stage", date: "2024-09-03" },
      {
        event: "Note added by HR",
        content: "Strong resume, seems like a good fit.",
        date: "2024-09-03",
      },
      { event: "Moved to Tech stage", date: "2024-09-10" },
    ];
    return HttpResponse.json(mockTimeline);
  }),
];
