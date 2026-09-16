export interface FetchJsonOptions {
  timeoutMs?: number;
  retries?: number;
  userAgent?: string;
  accept?: string;
}

export async function fetchJson<T>(url: string, options: FetchJsonOptions = {}): Promise<T> {
  const { timeoutMs = 10_000, retries = 2, userAgent = "RemoteCut/1.0 job-ingestion", accept = "application/json" } = options;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        headers: { Accept: accept, "User-Agent": userAgent },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status} from ${url}`);
      return await response.json() as T;
    } catch (error) {
      lastError = error;
      if (attempt < retries) await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt));
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError instanceof Error ? lastError : new Error(`Could not fetch ${url}`);
}

export async function fetchText(url: string, options: FetchJsonOptions = {}): Promise<string> {
  const {
    timeoutMs = 12_000,
    retries = 2,
    userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 RemoteCut/1.0",
    accept = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  } = options;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        headers: { Accept: accept, "User-Agent": userAgent },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status} from ${url}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < retries) await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt));
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError instanceof Error ? lastError : new Error(`Could not fetch text from ${url}`);
}
