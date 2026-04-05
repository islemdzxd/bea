export type SessionClientProfile = {
  cli?: string;
  nom?: string;
  prenom?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
};

function parseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function readFromStorage(key: string): SessionClientProfile | null {
  if (typeof globalThis === 'undefined') return null;

  const localValue = parseJson<SessionClientProfile>(globalThis.localStorage.getItem(key));
  if (localValue) return localValue;

  return parseJson<SessionClientProfile>(globalThis.sessionStorage.getItem(key));
}

export function getSessionClientProfile(): SessionClientProfile | null {
  const authProfile = readFromStorage('bea_client_profile');
  const signupProfile = readFromStorage('currentUser');

  if (!authProfile && !signupProfile) return null;

  return {
    cli: authProfile?.cli,
    nom: authProfile?.nom ?? signupProfile?.lastName,
    prenom: authProfile?.prenom ?? signupProfile?.firstName,
    email: authProfile?.email ?? signupProfile?.email,
    firstName: signupProfile?.firstName,
    lastName: signupProfile?.lastName,
    avatar: authProfile?.avatar ?? signupProfile?.avatar,
    phone: signupProfile?.phone,
  };
}
