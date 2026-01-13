import React from "react";
import InstancePageContent from "./instance-page-content";
import { getInstancesServer } from "@/services/instance.service";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

interface InstancesPageProps {
  searchParams: { k?: string };
}

export default async function InstancesPage({ searchParams }: InstancesPageProps) {
  const { k } = await searchParams; 
  const cookieStore = await cookies()
  // Fetch instances on the server if key is present
  const instances = k ? await getInstancesServer(k) : [];

  if(instances.length === 0) {
    redirect("/dashboard/instances/build")
  }
  // console.log(instances);
  return (
    <InstancePageContent 
      initialInstances={instances} 
      searchParamsKey={k} 
    />
  );
}
