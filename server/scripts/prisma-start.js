#!/usr/bin/env node
/**
 * prisma-start.js
 * Production start helper: builds baseline if needed, applies migrations, then starts server.
 * Handles Prisma P3005 (non-empty schema without _prisma_migrations) by marking the first
 * existing migration as applied, then re-running migrate deploy. Falls back to db push only
 * if absolutely required.
 */
const { execSync } = require('child_process');

function run(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}

function tryBaselineAndMigrate() {
  const firstMigration = '20251026201140_init'; // existing initial migration folder
  try {
    run('npx prisma migrate deploy');
    return;
  } catch (e) {
    const out = (e.stdout || '').toString() + (e.stderr || '').toString();
    if (out.includes('P3005')) {
      console.log('\n[P3005] Detected existing schema without migration history. Attempting baseline...');
      try {
        // Mark initial migration as applied.
        run(`npx prisma migrate resolve --applied ${firstMigration}`);
        // Re-run migrations to apply any later ones.
        run('npx prisma migrate deploy');
        console.log('[Baseline] Success. Migration history established.');
        return;
      } catch (baselineErr) {
        const out2 = (baselineErr.stdout || '') + (baselineErr.stderr || '');
        console.warn('[Baseline] Failed to resolve initial migration automatically.');
        if (out2.includes('does not exist')) {
          console.warn(`Migration folder ${firstMigration} not found. Falling back to db push as a last resort.`);
        }
        try {
          run('npx prisma db push');
          console.log('[Fallback] prisma db push succeeded. Schema is in sync, but migration history is absent.');
          console.log('Consider creating a proper baseline migration later for auditability.');
        } catch (pushErr) {
          console.error('[Fallback] prisma db push failed.');
          throw pushErr;
        }
      }
    } else {
      throw e; // rethrow unknown error
    }
  }
}

function startApp() {
  const port = process.env.PORT || 4000;
  console.log(`[Startup] Launching app on port ${port}...`);
  run('node dist/index.js');
}

tryBaselineAndMigrate();
startApp();
