// Types for API responses
export interface Role {
  label: string;
  id: string;
  name: string;
  description?: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  roleId: string;
  email: string;
  phone: string;
  teamId: string;
}

export interface TeamGroup {
  id: string;
  name: string;
  members: Member[];
}

export interface OrganizationData {
  team: TeamGroup[];
  strength: number;
  orgId: string;
}

export interface OrganizationSummary {
  strength: number;
}
