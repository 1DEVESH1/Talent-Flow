import { http, delay, HttpResponse } from "msw";
import { db } from "../database/db";

const randomFail = () => Math.random() < 0.1;
const randomLatency = () => Math.random() * 1000 + 200;

export const handlers = [
  // --- JOBS ---
  http.get("/jobs", async ({ request }) => {
    await delay(await randomLatency());
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status");
    let jobsQuery;
    if (status && status !== "all") {
      jobsQuery = db.jobs.where("status").equals(status);
    } else {
      jobsQuery = db.jobs.toCollection();
    }
    let allJobs = await jobsQuery.sortBy("order");
    if (search) {
      allJobs = allJobs.filter((j) =>
        j.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    const totalCount = allJobs.length;
    const paginatedJobs = allJobs.slice((page - 1) * pageSize, page * pageSize);
    return HttpResponse.json({ jobs: paginatedJobs, totalCount });
  }),

  http.get("/jobs/:jobId", async ({ params }) => {
    await delay(await randomLatency());
    const { jobId } = params;
    const job = await db.jobs.get(parseInt(jobId, 10));
    return job
      ? HttpResponse.json(job)
      : new HttpResponse(null, { status: 404 });
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

  // --- CANDIDATES ---
  http.get("/candidates/:candidateId", async ({ params }) => {
    await delay(await randomLatency());
    const { candidateId } = params;
    const candidate = await db.candidates.get(parseInt(candidateId, 10));
    return candidate
      ? HttpResponse.json(candidate)
      : new HttpResponse(null, { status: 404 });
  }),

  http.get("/candidates/:candidateId/timeline", async ({ params }) => {
    await delay(await randomLatency());
    const { candidateId } = params;
    const events = await db.timeline_events
      .where("candidateId")
      .equals(parseInt(candidateId, 10))
      .sortBy("timestamp");
    return HttpResponse.json(events);
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
    const numericId = parseInt(id, 10);

    if (updates.stage) {
      await db.timeline_events.add({
        candidateId: numericId,
        event: `Moved to "${updates.stage}" stage`,
        timestamp: new Date(),
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
    }

    await db.candidates.update(numericId, updates);
    return HttpResponse.json({ success: true });
  }),

  // --- ASSESSMENTS ---
  http.get("/assessments/:jobId", async ({ params }) => {
    await delay(await randomLatency());
    const { jobId } = params;
    const assessment = await db.assessments
      .where({ jobId: parseInt(jobId, 10) })
      .first();

    return assessment
      ? HttpResponse.json(assessment)
      : new HttpResponse(null, { status: 404 });
  }),

  http.put("/assessments/:jobId", async ({ request, params }) => {
    await delay(await randomLatency());
    if (randomFail()) return new HttpResponse(null, { status: 500 });

    const { jobId } = params;
    const config = await request.json();
    const numericJobId = parseInt(jobId, 10);

    const existing = await db.assessments
      .where({ jobId: numericJobId })
      .first();

    if (existing) {
      await db.assessments.update(existing.id, { config: config.config });
    } else {
      await db.assessments.add({ jobId: numericJobId, config: config.config });
    }

    return HttpResponse.json({ success: true, jobId: numericJobId });
  }),

  http.post("/assessments/:jobId/submit", async ({ request, params }) => {
    await delay(await randomLatency());
    const { jobId } = params;
    const submissionData = await request.json();

    const submission = {
      ...submissionData,
      jobId: parseInt(jobId, 10),
      timestamp: new Date(),
    };
    const id = await db.submissions.add(submission);

    return HttpResponse.json({ success: true, id });
  }),
];
