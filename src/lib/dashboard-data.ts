import {
  Database,
  FileBadge,
  GlobeLock,
  ShieldAlert,
  Users,
  CreditCard,
  LucideIcon,
} from "lucide-react";

export interface DashboardSubItem {
  title: string;
  link: string;
}

export interface DashboardItemProps {
  icon: LucideIcon;
  title: string;
  mobileTitle: string;
  subtitle: string;
  mobileSubtitle: string;
  link: string;
  variant?: "default" | "warn" | "destructive";
  subItems?: DashboardSubItem[];
}

export interface DashboardData {
  instancescount: number;
  certificateExpiryDate: string;
  signaturesCount: number;
  webCategoriesCount: number;
  subscriptionEndDate: string;
  teamStrengthcount: number;
}

export const getDashboardItems = (
  data?: DashboardData,
): DashboardItemProps[] => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    }); // e.g., 27 Jan 27
  };

  const instancesCount = data?.instancescount ?? 0;
  const webCategoriesCount = data?.webCategoriesCount ?? 0;
  const signaturesCount = data?.signaturesCount ?? 0;
  const teamStrengthcount = data?.teamStrengthcount ?? 0;

  return [
    {
      icon: Database,
      title: "Instances",
      mobileTitle: "Instances",
      subtitle: `${instancesCount} Active`,
      mobileSubtitle: `${instancesCount} Active`,
      link: "/dashboard/instances",
      variant: "default",
      subItems: [{ title: "View Instances", link: "/dashboard/instances" }],
    },
    {
      icon: FileBadge,
      title: "Certificate",
      mobileTitle: "Certificate",
      subtitle: data?.certificateExpiryDate
        ? `Renew before ${formatDate(data.certificateExpiryDate)}`
        : "Add a certificate",
      mobileSubtitle: data?.certificateExpiryDate
        ? `Renew before ${formatDate(data.certificateExpiryDate)}`
        : "Add a certificate",
      link: "/dashboard/certificate",
      variant: "warn",
      subItems: [
        { title: "Upload", link: "/dashboard/certificate/upload" },
        { title: "Regenerate", link: "/dashboard/certificate/regenerate" },
        { title: "Download", link: "/dashboard/certificate/download" },
      ],
    },
    {
      icon: GlobeLock,
      title: "Web Categorization",
      mobileTitle: "Categories",
      subtitle: `${webCategoriesCount} Custom Categories`,
      mobileSubtitle: `${webCategoriesCount} Categories`,
      link: "/dashboard/web-categorization",
      variant: "default",
      subItems: [
        { title: "Add a category", link: "/dashboard/web-categorization/add" },
      ],
    },
    {
      icon: ShieldAlert,
      title: "Signatures",
      mobileTitle: "Signatures",
      subtitle: `${signaturesCount} Signatures`,
      mobileSubtitle: `${signaturesCount} Signatures`,
      link: "/dashboard/signatures",
      variant: "default",
      subItems: [
        { title: "Add a signature", link: "/dashboard/signatures/add" },
      ],
    },
    {
      icon: Users,
      title: "Team",
      mobileTitle: "Team",
      subtitle: `${teamStrengthcount} Members`,
      mobileSubtitle: `${teamStrengthcount} Members`,
      link: "/dashboard/team",
      variant: "default",
      subItems: [{ title: "Add a member", link: "/dashboard/team/add" }],
    },
    {
      icon: CreditCard,
      title: "Subscription",
      mobileTitle: "Subscription",
      subtitle: data?.subscriptionEndDate
        ? `Renew before ${formatDate(data.subscriptionEndDate)}`
        : "No subscription found",
      mobileSubtitle: data?.subscriptionEndDate
        ? `Renew before ${formatDate(data.subscriptionEndDate)}`
        : "No subscription found",
      link: "/dashboard/subscription",
      variant: "destructive",
      subItems: [
        {
          title: "Extend conservation period",
          link: "/dashboard/subscription/extend",
        },
        {
          title: "View billing history",
          link: "/dashboard/subscription/history",
        },
      ],
    },
  ];
};

// Export static version for backward compatibility
export const dashboardItems = getDashboardItems();

export interface Keyword {
  id: string;
  value: string;
}

export interface Signature {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  keywords: Keyword[];
}

// export const initialSignatures: Signature[] = [
//   {
//     id: "1",
//     name: "signature_1",
//     description:
//       "This keyword was created for web xyz and also for testing that how this works and to what extent it works and etc.",
//     keywords: [
//       { id: "k1", value: ".UUIHfge#12--2" },
//       { id: "k2", value: ".UUIHfge#12--2" },
//       { id: "k3", value: ".UUIHfge#12--2" },
//       { id: "k4", value: ".UUIHfge#12--2" },
//     ],
//   },
//   {
//     id: "2",
//     name: "signature_2",
//     description:
//       "Another signature description for testing the grid layout and expansion logic.",
//     keywords: [
//       { id: "k5", value: ".TEST-123" },
//       { id: "k6", value: ".EXAMPLE-456" },
//     ],
//   },
//   {
//     id: "3",
//     name: "signature_3",
//     description:
//       "Signature with many keywords to test the 'show more' functionality properly.",
//     keywords: [
//       { id: "k7", value: ".KEY-1" },
//       { id: "k8", value: ".KEY-2" },
//       { id: "k9", value: ".KEY-3" },
//       { id: "k10", value: ".KEY-4" },
//       { id: "k11", value: ".KEY-5" },
//       { id: "k12", value: ".KEY-6" },
//     ],
//   },
//   {
//     id: "4",
//     name: "signature_4",
//     description: "Brief description.",
//     keywords: [{ id: "k13", value: ".SHORT" }],
//   },
//   {
//     id: "5",
//     name: "signature_5",
//     description: "Yet another signature for the grid.",
//     keywords: [{ id: "k14", value: ".GRID-TEST" }],
//   },
//   {
//     id: "6",
//     name: "signature_6",
//     description: "Expanding the dataset for better visual testing.",
//     keywords: [
//       { id: "k15", value: ".DATA-1" },
//       { id: "k16", value: ".DATA-2" },
//     ],
//   },
//   {
//     id: "7",
//     name: "signature_7",
//     description: "Final mock signature for now.",
//     keywords: [{ id: "k17", value: ".FINAL" }],
//   },
// ];
