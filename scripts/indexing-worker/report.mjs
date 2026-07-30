import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('scripts/indexing-worker/indexing-log.sqlite');
const complete = db
  .prepare("SELECT * FROM submissions WHERE status='run_complete' ORDER BY id DESC LIMIT 1")
  .get();
const quota = db.prepare('SELECT * FROM daily_quota').all();
const ok = db.prepare("SELECT count(*) as c FROM submissions WHERE status='ok'").get();
const err = db.prepare("SELECT count(*) as c FROM submissions WHERE status='error'").get();
const errors = db
  .prepare(
    "SELECT url, http_code, substr(message,1,200) as message FROM submissions WHERE status='error' ORDER BY id DESC LIMIT 10",
  )
  .all();
const sampleOk = db
  .prepare("SELECT url, http_code FROM submissions WHERE status='ok' ORDER BY id DESC LIMIT 5")
  .all();

console.log(
  JSON.stringify(
    {
      complete,
      quota,
      okCount: ok.c,
      errorCount: err.c,
      sampleOk,
      errors,
    },
    null,
    2,
  ),
);
db.close();
