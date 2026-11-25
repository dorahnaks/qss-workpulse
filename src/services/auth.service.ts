import {
  ApiError,
  apiRequest,
  clearStoredToken,
  getStoredToken,
  isLiveApiConfigured,
  setStoredToken,
} from "@/lib/api/client";
import type {
  AuthActionResult,
  AuthSession,
  ClientUser,
  CompanyInfo,
  ForgotPasswordPayload,
  LoginCredentials,
  ResetPasswordPayload,
} from "@/types/auth";

const DEMO_SESSION_KEY = "qss_workpulse_demo_session";

export const DEMO_CREDENTIALS = {
  email: "sarah.jenkins@acmelogistics.com",
  password: "WorkPulse@2026",
} as const;

const DEFAULT_DEMO_USER: ClientUser = {
  id: "usr-client-01",
  name: "Sarah Jenkins",
  email: DEMO_CREDENTIALS.email,
  role: "Client Operations Manager",
  jobTitle: "Head of Fulfillment Operations",
  phone: "+1 (312) 555-0194",
  timezone: "Africa/Nairobi",
  avatarInitials: "SJ",
  lastLoginAt: "Today at 08:15 AM",
};

const DEFAULT_DEMO_COMPANY: CompanyInfo = {
  id: "cmp-acme-01",
  name: "Acme Logistics & Distribution",
  accountCode: "QSS-CL-4082",
  industry: "Logistics & Warehousing",
  siteLocation: "Nairobi Industrial Park — Hub B",
  contactEmail: "operations@acmelogistics.com",
  contactPhone: "+254 700 412 890",
  address: "Plot 14, Enterprise Road, Industrial Area, Nairobi",
  contractStatus: "Active",
};

function readDemoSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DEMO_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function writeDemoSession(session: AuthSession): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
  } catch {
    // Ignore storage errors
  }
}

function clearDemoSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DEMO_SESSION_KEY);
  } catch {
    // Ignore storage errors
  }
}

function isNetworkFailure(error: unknown): boolean {
  return (
    error instanceof TypeError ||
    (error instanceof ApiError && error.status === 0)
  );
}

export async function loginClient(
  credentials: LoginCredentials
): Promise<AuthSession> {
  if (isLiveApiConfigured()) {
    try {
      const response = await apiRequest<AuthSession>("/auth/login", {
        method: "POST",
        authenticated: false,
        body: {
          email: credentials.email,
          password: credentials.password,
          remember: Boolean(credentials.rememberMe),
        },
      });
      setStoredToken(response.token, credentials.rememberMe);
      return response;
    } catch (error) {
      if (!isNetworkFailure(error)) {
        throw error;
      }
    }
  }

  // Demo mode fallback when Laravel API is not running locally
  await new Promise((resolve) => setTimeout(resolve, 450));

  const email = credentials.email.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    throw new ApiError("Please enter a valid work email address.", 422);
  }
  if (!credentials.password || credentials.password.length < 6) {
    throw new ApiError("Invalid credentials. Password must be at least 6 characters.", 401);
  }

  const existing = readDemoSession();
  const displayName =
    email === DEMO_CREDENTIALS.email
      ? DEFAULT_DEMO_USER.name
      : email
          .split("@")[0]
          .split(/[._-]/)
          .filter(Boolean)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ") || "QSS Client";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const session: AuthSession = {
    token: `demo_sanctum_${Date.now()}`,
    user: {
      ...(existing?.user ?? DEFAULT_DEMO_USER),
      name: existing?.user.email === email ? existing.user.name : displayName,
      email,
      avatarInitials:
        existing?.user.email === email ? existing.user.avatarInitials : initials,
      lastLoginAt: "Just now",
    },
    company: existing?.company ?? DEFAULT_DEMO_COMPANY,
  };

  setStoredToken(session.token, credentials.rememberMe);
  writeDemoSession(session);
  return session;
}

export async function fetchCurrentSession(): Promise<AuthSession | null> {
  const token = getStoredToken();
  if (!token) return null;

  if (isLiveApiConfigured() && !token.startsWith("demo_sanctum_")) {
    try {
      const data = await apiRequest<{ user: ClientUser; company: CompanyInfo }>(
        "/auth/me"
      );
      return {
        token,
        user: data.user,
        company: data.company,
      };
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearStoredToken();
        clearDemoSession();
        return null;
      }
      if (!isNetworkFailure(error)) {
        return null;
      }
    }
  }

  const demo = readDemoSession();
  if (demo) return demo;

  return {
    token,
    user: DEFAULT_DEMO_USER,
    company: DEFAULT_DEMO_COMPANY,
  };
}

export async function logoutClient(): Promise<void> {
  const token = getStoredToken();
  if (isLiveApiConfigured() && token && !token.startsWith("demo_sanctum_")) {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch {
      // Clear local session even if backend logout fails
    }
  }
  clearStoredToken();
  clearDemoSession();
}

export async function requestPasswordReset(
  payload: ForgotPasswordPayload
): Promise<AuthActionResult> {
  if (isLiveApiConfigured()) {
    try {
      const response = await apiRequest<{ message: string }>(
        "/auth/forgot-password",
        {
          method: "POST",
          authenticated: false,
          body: { email: payload.email },
        }
      );
      return {
        success: true,
        message:
          response.message ||
          "If an account exists for that email, a password reset link has been sent.",
      };
    } catch (error) {
      if (!isNetworkFailure(error)) {
        throw error;
      }
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 400));
  const cleanEmail = payload.email.trim();
  const demoResetUrl = `/reset-password?token=demo-reset-token-2026&email=${encodeURIComponent(
    cleanEmail
  )}`;

  return {
    success: true,
    message: `Password reset instructions have been sent to ${cleanEmail}.`,
    demoResetUrl,
  };
}

export async function resetClientPassword(
  payload: ResetPasswordPayload
): Promise<AuthActionResult> {
  if (isLiveApiConfigured()) {
    try {
      const response = await apiRequest<{ message: string }>(
        "/auth/reset-password",
        {
          method: "POST",
          authenticated: false,
          body: {
            email: payload.email,
            token: payload.token,
            password: payload.password,
            password_confirmation: payload.passwordConfirmation,
          },
        }
      );
      return {
        success: true,
        message:
          response.message ||
          "Your password has been updated. You can now sign in.",
      };
    } catch (error) {
      if (!isNetworkFailure(error)) {
        throw error;
      }
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 450));
  return {
    success: true,
    message:
      "Your password has been reset successfully. Sign in with your new password.",
  };
}
