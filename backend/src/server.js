import { config, getConfigProblems, getConfigWarnings } from "./lib/env.js";

for (const warning of getConfigWarnings()) console.warn(`[config] ${warning}`);

const problems = getConfigProblems();
if (problems.length > 0) {
  console.error("Cannot start - configuration problems:");
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

const { createApp } = await import("./app.js");
const { connectDB } = await import("./lib/db.js");

// Connect first, then accept traffic, so no request ever hits a half-started server.
await connectDB(config.mongoUri);

createApp().listen(config.port, () => {
  console.log(`Server is running on port ${config.port} (${config.nodeEnv})`);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason?.message ?? reason);
});
