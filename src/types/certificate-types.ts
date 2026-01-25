export interface ApiCertificate {
  id: string;
  commonName: string;
  countryCode: string;
  state: string;
  localityName: string;
  organizationName: string;
  organizationUnit: string;
  createdAt: string;
  updatedAt: string;
  keyId: string;
  serialNumber: string;
  validFrom: string;
  validTo: string;
  privateKeyUrl: string;
  publicKeyUrl: string;
  certificateUrl: string;
}

export interface CertificateApiResponse {
  success: boolean;
  data: ApiCertificate[];
}
