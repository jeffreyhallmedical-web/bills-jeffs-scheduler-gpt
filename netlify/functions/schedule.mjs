import { getStore } from "@netlify/blobs";

export default async (request) => {
  const store = getStore({ name: "bills-jeffs-schedule", consistency: "strong" });
  if (request.method === "GET") {
    const schedule = await store.get("july-2026", { type: "json" });
    return Response.json({ schedule: schedule || null }, { headers: { "Cache-Control": "no-store" } });
  }
  if (request.method === "PUT") {
    const { schedule } = await request.json();
    if (!schedule || typeof schedule !== "object") return Response.json({ error: "Invalid schedule" }, { status: 400 });
    await store.setJSON("july-2026", schedule);
    return Response.json({ saved: true, updatedAt: new Date().toISOString() });
  }
  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/schedule" };
