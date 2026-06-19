/**
 * @telegram-apps/analytics — DEPRECATED no-op shim
 * ------------------------------------------------------------------
 * Drop-in replacement for the Telegram Analytics SDK.
 *
 * Existing apps that already call `telegramAnalytics.init(...)` /
 * `registerInvoice(...)` keep compiling and running with ZERO behaviour change
 * from their point of view — nothing throws, no network calls are made, and
 * analytics is simply no longer collected.
 *
 * Backend sunset date: 2026-06-24. See https://docs.tganalytics.xyz/sunset
 *
 * Public surface is byte-for-byte compatible with v1.6.4:
 *   default export = { init, registerInvoice }
 *   init(opts) => Promise<void>
 *   registerInvoice(payload) => void
 *   plus the CDN/global `window.telegramAnalytics`
 */
import { InvoicePayload } from './declarations/invoice-payload.interface';

const DEPRECATION_MESSAGE =
  '[@telegram-apps/analytics] This SDK is deprecated and is now a no-op. ' +
  'Data is no longer collected; the backend stops processing on 2026-06-24. ' +
  'You can safely remove this dependency. Details: https://docs.tganalytics.xyz/sunset';

// One warning per page load. Guards `console` so it is safe in SSR / Node / workers.
let warned = false;
function warnOnce(): void {
  if (warned) return;
  warned = true;
  try {
    if (typeof console !== 'undefined' && typeof console.warn === 'function') {
      console.warn(DEPRECATION_MESSAGE);
    }
  } catch {
    /* never let logging throw */
  }
}

/**
 * No-op init. Resolves immediately so both `await init()` and fire-and-forget
 * `init()` behave. Never rejects, never touches the network. Signature kept
 * identical to the original so consumer code type-checks unchanged.
 */
async function init({ token, appName, env = 'PROD' }: {
  token: string;
  appName: string;
  env?: 'STG' | 'PROD';
}): Promise<void> {
  warnOnce();
}

/** No-op invoice registration. Never throws (the original threw before init). */
function registerInvoice(_invoicePayload: InvoicePayload): void {
  warnOnce();
}

const telegramAnalytics = {
  init,
  registerInvoice,
};

// CDN / <script> usage sets this global via the IIFE build's `lib.name`. Set it
// explicitly too so ESM/CJS consumers that relied on the global keep working.
// The `Window.telegramAnalytics` type comes from the ambient declaration.d.ts.
if (typeof window !== 'undefined') {
  try {
    window.telegramAnalytics = telegramAnalytics;
  } catch {
    /* ignore */
  }
}

export default telegramAnalytics;
