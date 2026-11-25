export interface ClientUser {
  id: string;
  name: string;
  email: string;
  role: string;
  jobTitle: string;
  phone: string;
  timezone: string;
  avatarInitials: string;
  lastLoginAt: string;
}

export interface CompanyInfo {
  id: string;
  name: string;
  accountCode: string;
  industry: string;
  siteLocation: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  contractStatus: "Active" | "Pending Renewal" | "Suspended";
}

export interface AuthSession {
  token: string;
  user: ClientUser;
  company: CompanyInfo;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthActionResult {
  success: boolean;
  message: string;
  demoResetUrl?: string;
}
