import { openDB } from "@/lib/db";

export const runtime = "nodejs";

export default async function TestPage() {
  try {
    const db = await openDB();

    const [rows]: any = await db.execute("SELECT 1 as test");

    return (
      <div>
        <h1>DB OK</h1>
        <pre>{JSON.stringify(rows)}</pre>
      </div>
    );
  } catch (err) {
    console.error("DB ERROR:", err);
    return <div>Database Failed</div>;
  }
}