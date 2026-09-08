import { User } from '../types';

/**
 * Google Authentication Utilities using Google Identity Services (GIS)
 */

export interface GooglePayload {
  sub: string;
  name: string;
  email: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  email_verified?: boolean;
}

const GOOGLE_CLIENT_ID_KEY = 'tallywise-google-client-id';

/**
 * Get active Google OAuth Client ID (from localStorage override or Vite .env)
 */
export function getGoogleClientId(): string {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(GOOGLE_CLIENT_ID_KEY);
      if (saved && saved.trim()) return saved.trim();
    } catch (e) {}
  }
  return (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
}

/**
 * Save Google Client ID to localStorage for instant client-side testing
 */
export function saveGoogleClientId(clientId: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (clientId.trim()) {
      localStorage.setItem(GOOGLE_CLIENT_ID_KEY, clientId.trim());
    } else {
      localStorage.removeItem(GOOGLE_CLIENT_ID_KEY);
    }
  } catch (e) {}
}

/**
 * Checks if a non-placeholder Google Client ID is configured
 */
export function isGoogleAuthAvailable(): boolean {
  const id = getGoogleClientId();
  return Boolean(id && !id.includes('your_google_client_id') && id.length > 10);
}

/**
 * Load Google Identity Services script dynamically
 */
export function loadGoogleScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);

    // If already loaded
    if ((window as any).google?.accounts?.id) {
      return resolve(true);
    }

    // Check if script element already exists
    const existingScript = document.getElementById('google-gsi-client');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Failed to load Google Identity Services SDK');
      resolve(false);
    };

    document.head.appendChild(script);
  });
}

/**
 * Parse base64 JWT payload from Google credential response
 */
export function parseGoogleJwt(token: string): GooglePayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Failed to parse Google JWT credential:', err);
    return null;
  }
}

/**
 * Converts Google payload into an application User, saving to local accounts if new
 */
export function processGoogleLogin(payload: GooglePayload): User {
  const cleanEmail = payload.email.trim().toLowerCase();
  const userName = payload.name || payload.given_name || cleanEmail.split('@')[0];
  const avatar = payload.picture;

  let usersList: any[] = [];
  try {
    const usersRaw = localStorage.getItem('tallywise-users');
    if (usersRaw) usersList = JSON.parse(usersRaw);
  } catch (e) {}

  const existing = usersList.find((u) => u.email?.toLowerCase() === cleanEmail);

  let user: User;
  if (existing) {
    user = {
      id: existing.id,
      name: existing.name || userName,
      email: existing.email,
      avatarUrl: avatar || existing.avatarUrl,
      createdAt: existing.createdAt || new Date().toISOString(),
    };
    // Update avatar if provided by Google
    if (avatar && existing.avatarUrl !== avatar) {
      existing.avatarUrl = avatar;
      try {
        localStorage.setItem('tallywise-users', JSON.stringify(usersList));
      } catch (e) {}
    }
  } else {
    // New Google User
    user = {
      id: `google-${payload.sub || Date.now()}`,
      name: userName,
      email: cleanEmail,
      avatarUrl: avatar,
      createdAt: new Date().toISOString(),
    };
    usersList.push({
      ...user,
      password: '', // Signed up via Google OAuth
      provider: 'google',
    });
    try {
      localStorage.setItem('tallywise-users', JSON.stringify(usersList));
    } catch (e) {}
  }

  return user;
}
