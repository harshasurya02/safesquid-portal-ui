"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { EnterpriseLoginForm } from "@/components/enterprise-login-form";

const MOCK_ORGS: Record<string, { name: string; id: string }> = {
  mtech: { name: "MTech", id: "mtech" },
};

export default function EnterpriseLoginPage() {
  const params = useParams<{ orgId: string }>();
  const orgId = params?.orgId?.toLowerCase?.() || "mtech";

  const org = useMemo(() => {
    return MOCK_ORGS[orgId] || { name: orgId.toUpperCase(), id: orgId };
  }, [orgId]);

  return <EnterpriseLoginForm orgId={org.id} orgName={org.name} />;
}
