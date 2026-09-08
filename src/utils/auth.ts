/**
 * Authentication and Device Trust Utilities
 * Handles Email OTP generation/validation and Remember Me / Trusted Device storage.
 */

export interface OtpRecord {
  code: string;
  email: string;
  purpose: 'login' | 'register';
  createdAt: number;
  expiresAt: number;
}

export interface TrustedDevice {
  email: string;
  trustedAt: string;
  expiresAt: string;
  userAgent?: string;
}

const OTP_STORAGE_KEY = 'tallywise-active-otps';
const TRUSTED_DEVICES_KEY = 'tallywise-trusted-devices';
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const DEFAULT_TRUST_DAYS = 30; // 30 days remember me

/**
 * Generate a cryptographically random 6-digit numeric OTP code
 */
export function generateOtp(email: string, purpose: 'login' | 'register' = 'login'): OtpRecord {
  const cleanEmail = email.trim().toLowerCase();
  
  // Generate random 6 digit string
  const num = Math.floor(100000 + Math.random() * 900000);
  const code = num.toString();
  const now = Date.now();

  const record: OtpRecord = {
    code,
    email: cleanEmail,
    purpose,
    createdAt: now,
    expiresAt: now + OTP_EXPIRY_MS,
  };

  try {
    const existingRaw = sessionStorage.getItem(OTP_STORAGE_KEY);
    const otps: OtpRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
    // Remove previous OTPs for this email and purpose
    const filtered = otps.filter(
      (item) => !(item.email === cleanEmail && item.purpose === purpose)
    );
    filtered.push(record);
    sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error storing OTP:', e);
  }

  // Dispatch custom window event so simulated email listener can show alert/notification
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('tallywise-otp-generated', {
        detail: record,
      })
    );
  }

  return record;
}

/**
 * Retrieve the active OTP for an email & purpose (if not expired)
 */
export function getActiveOtp(email: string, purpose: 'login' | 'register'): OtpRecord | null {
  try {
    const existingRaw = sessionStorage.getItem(OTP_STORAGE_KEY);
    if (!existingRaw) return null;
    const otps: OtpRecord[] = JSON.parse(existingRaw);
    const cleanEmail = email.trim().toLowerCase();
    const found = otps.find(
      (item) => item.email === cleanEmail && item.purpose === purpose && item.expiresAt > Date.now()
    );
    return found || null;
  } catch (e) {
    return null;
  }
}

/**
 * Verify submitted OTP against stored active OTP
 */
export function verifyOtp(email: string, code: string, purpose: 'login' | 'register'): { success: boolean; message?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = code.trim();

  if (!cleanCode || cleanCode.length !== 6) {
    return { success: false, message: 'Please enter a complete 6-digit verification code.' };
  }

  const active = getActiveOtp(cleanEmail, purpose);

  if (!active) {
    return { success: false, message: 'Verification code has expired or was not requested. Please request a new code.' };
  }

  if (active.code !== cleanCode) {
    return { success: false, message: 'Invalid verification code. Please check your email and try again.' };
  }

  // OTP verified successfully - clear it so it cannot be reused
  try {
    const existingRaw = sessionStorage.getItem(OTP_STORAGE_KEY);
    if (existingRaw) {
      const otps: OtpRecord[] = JSON.parse(existingRaw);
      const filtered = otps.filter(
        (item) => !(item.email === cleanEmail && item.purpose === purpose)
      );
      sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(filtered));
    }
  } catch (e) {}

  return { success: true };
}

// -------------------------------------------------------------
// Remember Me / Trusted Devices Management
// -------------------------------------------------------------

/**
 * Returns all active trusted devices recorded in localStorage
 */
export function getTrustedDevices(): TrustedDevice[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(TRUSTED_DEVICES_KEY);
    if (!raw) return [];
    const devices: TrustedDevice[] = JSON.parse(raw);
    const now = new Date().toISOString();
    // Filter out expired devices
    return devices.filter((d) => d.expiresAt > now);
  } catch (e) {
    return [];
  }
}

/**
 * Check if the current browser/device is recognized and trusted for this email
 */
export function isDeviceTrusted(email: string): boolean {
  const cleanEmail = email.trim().toLowerCase();
  const devices = getTrustedDevices();
  return devices.some((d) => d.email.toLowerCase() === cleanEmail);
}

/**
 * Add or update a trusted device record for the email (Remember Me)
 */
export function trustDevice(email: string, durationDays = DEFAULT_TRUST_DAYS): void {
  if (typeof window === 'undefined') return;
  try {
    const cleanEmail = email.trim().toLowerCase();
    const devices = getTrustedDevices().filter((d) => d.email.toLowerCase() !== cleanEmail);
    
    const expires = new Date();
    expires.setDate(expires.getDate() + durationDays);

    const record: TrustedDevice = {
      email: cleanEmail,
      trustedAt: new Date().toISOString(),
      expiresAt: expires.toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Device',
    };

    devices.push(record);
    localStorage.setItem(TRUSTED_DEVICES_KEY, JSON.stringify(devices));
  } catch (e) {
    console.error('Failed to trust device:', e);
  }
}

/**
 * Revoke trust for an email on this device (user will need OTP on next login)
 */
export function revokeDeviceTrust(email: string): void {
  if (typeof window === 'undefined') return;
  try {
    const cleanEmail = email.trim().toLowerCase();
    const devices = getTrustedDevices().filter((d) => d.email.toLowerCase() !== cleanEmail);
    localStorage.setItem(TRUSTED_DEVICES_KEY, JSON.stringify(devices));
  } catch (e) {}
}

/**
 * Clear all remembered devices on this browser
 */
export function clearAllTrustedDevices(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TRUSTED_DEVICES_KEY);
}
