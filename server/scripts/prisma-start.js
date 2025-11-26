#!/usr/bin/env node
/**
 * prisma-start.js
 * Production start helper: builds baseline if needed, applies migrations, then starts server.
 * Handles Prisma P3005 (non-empty schema without _prisma_migrations) by marking the first
 * existing migration as applied, then re-running migrate deploy. Falls back to db push only
 * if absolutely required.
 */
const { execSync } = require("child_process");

function run(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

function tryBaselineAndMigrate() {
  // Known existing migrations (order matters). Adjust if folders change.
  const existingMigrations = [
    "20251028200214_create_tables",
    "20251103225124_add_google_oauth",
    "20251110123000_add_project_category",
  ];
  try {
    run("npx prisma migrate deploy");
    return; // success, nothing to baseline
  } catch (e) {
    const out = (
      (e.stdout || "") +
      (e.stderr || "") +
      (e.message || "")
    ).toString();
    if (!out.includes("P3005")) {
      throw e; // unrelated error
    }
    console.log(
      "\n[P3005] Existing schema without migration history. Attempting baseline resolve of existing migrations...",
    );
    for (const id of existingMigrations) {
      try {
        run(`npx prisma migrate resolve --applied ${id}`);
        console.log(`[Baseline] Marked ${id} as applied.`);
      } catch (err) {
        console.warn(
          `[Baseline] Could not mark ${id}: ${err.message}. Continuing.`,
        );
      }
    }
    try {
      run("npx prisma migrate deploy");
      console.log("[Baseline] migrate deploy succeeded after resolve.");
    } catch (deployErr) {
      console.warn(
        "[Baseline] migrate deploy still failing; falling back to prisma db push.",
      );
      run("npx prisma db push");
      console.log(
        "[Fallback] prisma db push completed. NOTE: migration history is synthetic; create a proper baseline later.",
      );
    }
  }
}

function startApp() {
  const port = process.env.PORT || 4000;
  console.log(`[Startup] Launching app on port ${port}...`);
  run("node dist/index.js");
}

tryBaselineAndMigrate();
startApp();
