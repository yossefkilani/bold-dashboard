import { readFileSync } from "fs";
import path from "path";

export default function Home() {
  const filePath = path.join(
    process.cwd(),
    "public",
    "bold-site",
    "index.html"
  );

  const html = readFileSync(filePath, "utf8");

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}