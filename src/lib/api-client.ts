import { 
  getSiteSettingsFn,
  getLandingDataFn,
  submitRegistrationFn,
  getRegistrationsFn,
  updateRegistrationStatusFn
} from "./server-functions";

// Determine if we should use the PHP API (only in production browser)
const shouldUsePhp = import.meta.env.PROD && typeof window !== 'undefined';

// Import hardcoded data generated during build
import hardcodedData from './hardcoded-data.json' assert { type: 'json' };

// Wrapper that uses Node server functions during dev, and hardcoded data in production
export const api = {
  getSiteSettings: async () => {
    // In production, always return the data that was hardcoded during the build process
    if (import.meta.env.PROD) {
      return hardcodedData.settings || null;
    }
    return getSiteSettingsFn();
  },
  
  getLandingData: async () => {
    if (shouldUsePhp) {
      try {
        const res = await fetch('/api/get-landing-data.php');
        const text = await res.text();
        return JSON.parse(text);
      } catch (e) {
        console.error("Failed to load landing data:", e);
        return null;
      }
    }
    return getLandingDataFn();
  },
  
  submitRegistration: async (data: any) => {
    if (shouldUsePhp) {
      const res = await fetch('/api/submit-registration.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    }
    return submitRegistrationFn({ data });
  },
  
  getRegistrations: async () => {
    if (shouldUsePhp) {
      const res = await fetch('/api/get-registrations.php');
      return res.json();
    }
    return getRegistrationsFn();
  },
  
  updateRegistrationStatus: async (data: { id: string, status: string }) => {
    if (shouldUsePhp) {
      const res = await fetch('/api/update-registration-status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    }
    return updateRegistrationStatusFn({ data });
  },

  updateSettings: async (data: any) => {
    if (shouldUsePhp) {
      const res = await fetch('/api/update-settings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    }
    const { updateSettingsFn } = await import("./server-functions");
    return updateSettingsFn({ data });
  }
};
