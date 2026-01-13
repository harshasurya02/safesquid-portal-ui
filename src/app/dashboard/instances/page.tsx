import React from "react";
import InstancePageContent from "./instance-page-content";
import { getInstancesServer } from "@/services/instance.service";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

interface InstancesPageProps {
  searchParams: { k?: string };
}

export const dynamic = "force-dynamic";

export default async function InstancesPage({
  searchParams,
}: InstancesPageProps) {
  const { k } = await searchParams;
  const cookieStore = await cookies();
  console.log(
    "Page Cookies:",
    cookieStore.getAll().map((c) => c.name)
  );

  // Fetch instances on the server if key is present
  const instances = k ? await getInstancesServer(k, cookieStore) : [];

  if (instances.length === 0) {
    redirect("/dashboard/instances/build");
  }
  // console.log(instances);
  return (
    <InstancePageContent initialInstances={instances} searchParamsKey={k} />
  );
}
