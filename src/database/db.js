import Dexie from "dexie";

export const db = new Dexie("TalentFlowDB");

db.version(1).stores({
  jobs: "++id,title,status,tags,slug,order",
  candidates: "++id,name,email,stage,jobId",
  assessments: "jobId",
  timeline: "++id, candidateId, timestamp, content", 
  submissions: "++id, jobId, candidateId, timestamp",
});
