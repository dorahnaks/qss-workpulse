export interface ProfileFormValues {
  name: string;
  email: string;
  jobTitle: string;
  phone: string;
  timezone: string;
}

export interface CompanyFormValues {
  name: string;
  industry: string;
  siteLocation: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface NotificationPreferences {
  productionTargetAlerts: boolean;
  shiftCompletionUpdates: boolean;
  teamPerformanceDigests: boolean;
  lowOutputWarnings: boolean;
  emailDelivery: boolean;
  inAppDelivery: boolean;
}
