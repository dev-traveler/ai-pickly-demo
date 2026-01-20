type RequestResult = {
  ok: boolean;
  status?: number;
  latencyMs: number;
  error?: string;
};

const targetUrl = process.env.TARGET_URL ?? "http://localhost:3000/";
const totalRequests = Number(process.env.REQUESTS ?? "20");
const concurrency = Number(process.env.CONCURRENCY ?? "5");
const timeoutMs = Number(process.env.TIMEOUT_MS ?? "10000");
const method = (process.env.METHOD ?? "GET").toUpperCase();
const body = process.env.BODY;
const contentType = process.env.CONTENT_TYPE ?? "application/json";
const headersEnv = process.env.HEADERS;

if (!globalThis.fetch) {
  throw new Error("Global fetch is not available in this runtime.");
}

if (Number.isNaN(totalRequests) || totalRequests <= 0) {
  throw new Error("REQUESTS must be a positive number.");
}

if (Number.isNaN(concurrency) || concurrency <= 0) {
  throw new Error("CONCURRENCY must be a positive number.");
}

if (Number.isNaN(timeoutMs) || timeoutMs <= 0) {
  throw new Error("TIMEOUT_MS must be a positive number.");
}

const headers: Record<string, string> = {};
if (headersEnv) {
  const parsed = JSON.parse(headersEnv) as Record<string, string>;
  Object.assign(headers, parsed);
}

if (body && !headers["Content-Type"]) {
  headers["Content-Type"] = contentType;
}

const requestOnce = async (): Promise<RequestResult> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const start = process.hrtime.bigint();

  try {
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      signal: controller.signal,
    });
    const end = process.hrtime.bigint();
    clearTimeout(timeout);
    return {
      ok: response.ok,
      status: response.status,
      latencyMs: Number(end - start) / 1_000_000,
    };
  } catch (error) {
    const end = process.hrtime.bigint();
    clearTimeout(timeout);
    return {
      ok: false,
      latencyMs: Number(end - start) / 1_000_000,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

const runWithConcurrency = async () => {
  const results: RequestResult[] = [];
  let inFlight = 0;
  let index = 0;

  return new Promise<RequestResult[]>((resolve) => {
    const launchNext = () => {
      while (inFlight < concurrency && index < totalRequests) {
        inFlight += 1;
        index += 1;
        requestOnce()
          .then((result) => results.push(result))
          .finally(() => {
            inFlight -= 1;
            if (results.length === totalRequests) {
              resolve(results);
              return;
            }
            launchNext();
          });
      }
    };
    launchNext();
  });
};

const summarize = (results: RequestResult[]) => {
  const latencies = results.map((result) => result.latencyMs).sort((a, b) => a - b);
  const successCount = results.filter((result) => result.ok).length;
  const errorCount = results.length - successCount;
  const statusCounts: Record<string, number> = {};
  results.forEach((result) => {
    const key = result.status ? String(result.status) : "error";
    statusCounts[key] = (statusCounts[key] ?? 0) + 1;
  });

  const percentile = (p: number) => {
    if (latencies.length === 0) return 0;
    const index = Math.ceil((p / 100) * latencies.length) - 1;
    return latencies[Math.max(0, Math.min(index, latencies.length - 1))];
  };

  return {
    successCount,
    errorCount,
    statusCounts,
    minMs: latencies[0] ?? 0,
    maxMs: latencies[latencies.length - 1] ?? 0,
    p50Ms: percentile(50),
    p95Ms: percentile(95),
    p99Ms: percentile(99),
    avgMs: latencies.reduce((sum, value) => sum + value, 0) / Math.max(latencies.length, 1),
  };
};

const main = async () => {
  const started = Date.now();
  const results = await runWithConcurrency();
  const durationMs = Date.now() - started;
  const summary = summarize(results);

  console.log("Concurrency test results");
  console.log(`Target: ${targetUrl}`);
  console.log(`Requests: ${totalRequests}, Concurrency: ${concurrency}`);
  console.log(`Duration: ${durationMs}ms`);
  console.log(`Success: ${summary.successCount}, Errors: ${summary.errorCount}`);
  console.log(`Latency ms (min/p50/p95/p99/max): ${summary.minMs.toFixed(1)}/${summary.p50Ms.toFixed(1)}/${summary.p95Ms.toFixed(1)}/${summary.p99Ms.toFixed(1)}/${summary.maxMs.toFixed(1)}`);
  console.log(`Average latency: ${summary.avgMs.toFixed(1)}ms`);
  console.log(`Status counts: ${JSON.stringify(summary.statusCounts)}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
