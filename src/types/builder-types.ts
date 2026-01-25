export type BuilderFlow = "NONE" | "SELF_SIGNED" | "ENTERPRISE";

export interface CertificateBuilderState {
  flow: BuilderFlow;
  step: number;
  formData: {
    // Key Config
    key: string;
    algorithm: string;
    privateKeyFormat: string;
    keySize: number;
    encrypted: boolean;
    cipher: string;
    passphrase?: string;
    confirmPassphrase?: string;

    // Subject Attributes
    commonName: string;
    countryCode: string;
    state: string;
    localityName: string;
    organizationName: string;
    organizationUnit: string;
    subjectAlternativeNames: { type: string; value: string }[];

    // Enterprise Upload
    certificate?: string;
    privateKey?: string;
  };
}
