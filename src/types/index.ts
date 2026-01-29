export interface Submission {
  id: string;
  designerName: string;
  email: string;
  city: string;
  category: string;
  brandName: string;
  phoneNumber: string;
  storeLink: string | null;
  brandStory: string;
  logoPath: string;
  bankDetailsPdf: string;
  fulfillmentMethod: string;
  commercialRegPdf: string;
  taxCertificatePdf: string | null;
  productImagePolicy: boolean;
  returnRefundPolicy: boolean;
  privacyPolicy: boolean;
  termsOfUse: boolean;
  commissionShippingPolicy: boolean;
  whistleblowingPolicy: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
  id: string;
  username: string;
  createdAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UploadedFile {
  path: string;
  originalName: string;
  size: number;
  type: string;
}

export type Locale = "en" | "ar";

export interface LocaleParams {
  params: {
    locale: Locale;
  };
}
