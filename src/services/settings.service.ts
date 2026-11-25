import { ApiError, apiRequest, isLiveApiConfigured } from "@/lib/api/client";
import { fetchCurrentSession, writeDemoSession } from "@/services/auth.service";
import type { ClientUser, CompanyInfo } from "@/types/auth";
import type {
  CompanyFormValues,
  NotificationPreferences,
  PasswordFormValues,
  ProfileFormValues,
} from "@/types/settings";

const PREFS_STORAGE_KEY = "qss_workpulse_notification_prefs";

const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  productionTargetAlerts: true,
  shiftCompletionUpdates: true,
  teamPerformanceDigests: true,
  lowOutputWarnings: true,
  emailDelivery: true,
  inAppDelivery: true,
};

function isNetworkFailure(error: unknown): boolean {
  return (
    error instanceof TypeError ||
    (error instanceof ApiError && error.status === 0)
  );
}

export async function updateAccountProfile(
  values: ProfileFormValues
): Promise<ClientUser> {
  if (isLiveApiConfigured()) {
    try {
      const response = await apiRequest<{ user: ClientUser }>(
        "/client/profile",
        {
          method: "PUT",
          body: values,
        }
      );
      return response.user;
    } catch (error) {
      if (!isNetworkFailure(error)) throw error;
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 350));
  const session = await fetchCurrentSession();
  const initials = values.name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const updatedUser: ClientUser = {
    ...(session?.user ?? {
      id: "usr-client-01",
      role: "Client Operations Manager",
      lastLoginAt: "Just now",
    }),
    ...values,
    avatarInitials: initials || "QC",
  };

  if (session) {
    writeDemoSession({ ...session, user: updatedUser });
  }
  return updatedUser;
}

export async function updateCompanyProfile(
  values: CompanyFormValues
): Promise<CompanyInfo> {
  if (isLiveApiConfigured()) {
    try {
      const response = await apiRequest<{ company: CompanyInfo }>(
        "/client/company",
        {
          method: "PUT",
          body: values,
        }
      );
      return response.company;
    } catch (error) {
      if (!isNetworkFailure(error)) throw error;
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 350));
  const session = await fetchCurrentSession();
  const updatedCompany: CompanyInfo = {
    ...(session?.company ?? {
      id: "cmp-acme-01",
      accountCode: "QSS-CL-4082",
      contractStatus: "Active",
    }),
    ...values,
  };

  if (session) {
    writeDemoSession({ ...session, company: updatedCompany });
  }
  return updatedCompany;
}

export async function updateAccountPassword(
  values: PasswordFormValues
): Promise<{ message: string }> {
  if (isLiveApiConfigured()) {
    try {
      return await apiRequest<{ message: string }>("/client/password", {
        method: "PUT",
        body: {
          current_password: values.currentPassword,
          password: values.newPassword,
          password_confirmation: values.confirmPassword,
        },
      });
    } catch (error) {
      if (!isNetworkFailure(error)) throw error;
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 400));
  if (!values.currentPassword) {
    throw new ApiError("Please enter your current password.", 422);
  }
  if (values.newPassword.length < 8) {
    throw new ApiError("New password must be at least 8 characters.", 422);
  }
  if (values.newPassword !== values.confirmPassword) {
    throw new ApiError("New password and confirmation do not match.", 422);
  }

  return { message: "Your account password has been updated successfully." };
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  if (isLiveApiConfigured()) {
    try {
      return await apiRequest<NotificationPreferences>(
        "/client/settings/notifications"
      );
    } catch (error) {
      if (!isNetworkFailure(error)) throw error;
    }
  }

  if (typeof window === "undefined") return DEFAULT_NOTIFICATION_PREFS;
  try {
    const raw = window.localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return DEFAULT_NOTIFICATION_PREFS;
    return { ...DEFAULT_NOTIFICATION_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_NOTIFICATION_PREFS;
  }
}

export async function saveNotificationPreferences(
  prefs: NotificationPreferences
): Promise<NotificationPreferences> {
  if (isLiveApiConfigured()) {
    try {
      return await apiRequest<NotificationPreferences>(
        "/client/settings/notifications",
        {
          method: "PUT",
          body: prefs,
        }
      );
    } catch (error) {
      if (!isNetworkFailure(error)) throw error;
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 250));
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Ignore storage errors
    }
  }
  return prefs;
}
