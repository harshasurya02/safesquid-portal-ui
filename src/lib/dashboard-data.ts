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

export interface LatestInstanceData {
  instances: {
    id: string;
    instanceName: string;
  }[];
  activeCount: number;
}

export const getDashboardItems = (
  instanceData?: LatestInstanceData,
): DashboardItemProps[] => {
  const instanceSubItems = instanceData?.instances.map((instance) => ({
    title: instance.instanceName,
    link: `/dashboard/instances/${instance.id}`,
  })) || [
    { title: "Instance_database_12", link: "/dashboard/instances/1" },
    { title: "Instance_testing_12", link: "/dashboard/instances/2" },
  ];

  const activeCount = instanceData?.activeCount ?? 5;

  return [
    {
      icon: Database,
      title: "Instances",
      mobileTitle: "Instances",
      subtitle: `${activeCount} Active`,
      mobileSubtitle: `${activeCount} Active`,
      link: "/dashboard/instances",
      variant: "default",
      subItems: instanceSubItems,
    },
    {
      icon: FileBadge,
      title: "Certificate",
      mobileTitle: "Certificate",
      subtitle: "Renew before 12 Jan 23",
      mobileSubtitle: "Renew before 01/12/2023",
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
      subtitle: "21 Custom Categories",
      mobileSubtitle: "21 Categories",
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
      subtitle: "21 Signatures",
      mobileSubtitle: "21 Signatures",
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
      subtitle: "38 Members",
      mobileSubtitle: "38 Members",
      link: "/dashboard/team",
      variant: "default",
      subItems: [{ title: "Add a member", link: "/dashboard/team/add" }],
    },
    {
      icon: CreditCard,
      title: "Subscription",
      mobileTitle: "Subscription",
      subtitle: "Renew before 12 Jan 23",
      mobileSubtitle: "Renew before 01/12/2023",
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
