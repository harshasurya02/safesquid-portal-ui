export type StepStatus = "pending" | "in_progress" | "completed" | "disabled";

export type SubscriptionStatus =
  | "proposal_created"
  | "proposal_submitted"
  | "po_uploaded"
  | "invoice_generated"
  | "payment_pending"
  | "payment_success"
  | "payment_failed"
  | "active"
  | "expired"
  | "cancelled";

export interface StepConfig {
  stepId: string;
  title: string;
  status: StepStatus;
  isAccessible: boolean;
}

export type PurchaseOrderStatus = "pending" | "approved";
export type PaymentStatus = "processing" | "success" | "failed";

export interface SubscriptionFlowState {
  currentStepId: string;
  steps: StepConfig[];
  subscriptionId?: string;
  subscriptionStatus?: SubscriptionStatus;

  // Entity IDs and statuses
  proposalId?: string;
  purchaseOrderId?: string;
  purchaseOrderStatus?: PurchaseOrderStatus;
  invoiceId?: string;
  paymentId?: string;
  paymentStatus?: PaymentStatus;

  // Data for each step (optional, can be expanded as needed)
  proposalData?: any;
  purchaseOrderData?: any;
  invoiceData?: any;
  paymentData?: any;
}

// API Response Interfaces
export interface ProposalResponse {
  subscription: {
    id: string;
    status: SubscriptionStatus;
    orgId: string;
    proposalId: string;
    tenure: number;
    createdAt: string;
  };
  proposal: {
    id: string;
    noOfUsers: number;
    noOfInstances: number;
    tenure: number;
    status: string;
    billingName: string;
  };
}

export interface PoResponse {
  subscription: {
    id: string;
    status: SubscriptionStatus;
  };
  purchaseOrder: {
    id: string;
    poNumber: string;
    verificationStatus: PurchaseOrderStatus;
  };
}

export interface InvoiceResponse {
  subscription: {
    id: string;
    status: SubscriptionStatus;
  };
  invoice: {
    id: string;
    invoiceNumber: string;
    invoiceUrl: string;
  };
}

export interface PaymentResponse {
  subscription: {
    id: string;
    status: SubscriptionStatus;
  };
  transaction: {
    id: string;
    referenceNumber: string;
    paymentStatus: string;
  };
}

export interface SubscriptionFlowContextType extends SubscriptionFlowState {
  completeStep: (stepId: string, data?: any) => Promise<void>;
  goToStep: (stepId: string) => void;
  isLoading: boolean;
  refreshPaymentStatus: () => Promise<void>;
  extendSubscription: (months: number) => Promise<void>;
}
