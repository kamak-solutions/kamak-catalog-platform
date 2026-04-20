export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterResponse {
  token: string;
  user: AuthUser;
  tenant: AuthTenant;
}

export interface AuthTenant {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  whatsapp: string | null;
  createdAt: string;
}