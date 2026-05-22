import { adminPost } from './bea-admin-api';
import type { ApiAuthResponse } from './api-mappers';
import { mapProfilToRole } from './api-mappers';
import type { StaffSession } from './types';

const SESSION_KEY = 'bea_staff_session';
const TOKEN_KEY = 'bea_admin_token';

export async function authenticateStaff(
  matricule: string,
  password: string
): Promise<StaffSession> {
  let response: ApiAuthResponse;
  try {
    response = await adminPost<ApiAuthResponse>('/api/auth/login', {
      matricule: matricule.trim(),
      password,
    });
  } catch (err) {
    throw err instanceof Error ? err : new Error('Identifiants invalides');
  }

  const session: StaffSession = {
    token: response.token,
    matricule: response.matricule,
    name: `${response.prenom} ${response.nom}`.trim(),
    role: mapProfilToRole(response.profil),
    agence: response.agence,
  };

  setSession(session);
  return session;
}

export function getSession(): StaffSession | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StaffSession;
  } catch {
    return null;
  }
}

export function setSession(session: StaffSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem(TOKEN_KEY, session.token);
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(TOKEN_KEY);
}
