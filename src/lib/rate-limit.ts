export interface RateLimitOptions {
  windowMs: number;
  max: number;
}

const limiters = new Map<string, { attempts: number; windowStart: number }>();
limiters.clear(); // Force clear on module reload

export function rateLimit(identifier: string, options: RateLimitOptions): { success: boolean; resetInMs: number } {
  const now = Date.now();
  
  let record = limiters.get(identifier);
  console.log(`[rateLimit] check for ${identifier}. Record exists: ${!!record}. Now: ${now}`);

  if (!record || now - record.windowStart > options.windowMs) {
    // New window
    record = { attempts: 1, windowStart: now };
    limiters.set(identifier, record);
    console.log(`[rateLimit] New window. attempts: 1`);
    return { success: true, resetInMs: options.windowMs };
  }

  if (record.attempts >= options.max) {
    console.log(`[rateLimit] LIMIT EXCEEDED. attempts: ${record.attempts}`);
    return { success: false, resetInMs: options.windowMs - (now - record.windowStart) };
  }

  record.attempts += 1;
  console.log(`[rateLimit] Updated record. attempts: ${record.attempts}`);
  limiters.set(identifier, record);

  return { success: true, resetInMs: options.windowMs - (now - record.windowStart) };
}

export function resetRateLimit(identifier: string) {
  limiters.delete(identifier);
}
