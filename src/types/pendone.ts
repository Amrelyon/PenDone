export type AppTab = 'store' | 'onboarding' | 'builder' | 'ledger' | 'blueprints';

export type LanguageCode = 'en' | 'ar' | 'fr' | 'es' | 'id';

export type StorageFormat = 'json' | 'google_sheet';

export interface AppManifest {
  app_id: string;
  slug: string;
  name: string;
  schema_version: string;
  storage: {
    provider: 'google_drive';
    scope: 'https://www.googleapis.com/auth/drive.file';
    folder_name: string;
    file_name: string;
    format: StorageFormat;
  };
  fields: {
    updatable_info: string[];
    read_only_fields: string[];
  };
  revenue_share: {
    platform_fee_percent: 10;
    builder_share_percent: 90;
  };
}

export interface PenDoneApp {
  id: string;
  slug: string;
  name: string;
  builderName: string;
  category: 'Productivity' | 'Finance & Invoices' | 'Health & Logs' | 'Developer Tools';
  description: string;
  priceUsd: number;
  usesCodeGs: boolean;
  manifest: AppManifest;
  sampleRecord: Record<string, string | number>;
}

export interface StoragePointer {
  id: string;
  appId: string;
  storagePath: string;
  driveFileId: string;
  accessGranted: boolean;
  updatableFields: string[];
  readOnlyFields: string[];
  updatedAt: string;
}

export interface ApiUsageLog {
  id: string;
  appSlug: string;
  endpoint: string;
  action: string;
  apiCalls: number;
  bytesTransferred: number;
  statusCode: number;
  createdAt: string;
}

export interface RevenueTransaction {
  id: string;
  appName: string;
  builderName: string;
  grossAmount: number;
  platformFee10Pct: number;
  netToBuilder90Pct: number;
  currency: string;
  status: 'recorded' | 'paid_out' | 'pending';
  createdAt: string;
}
