
import { apiGet } from "./api.service";
import { apiGetServer } from "./api.server.service";

export interface Instance {
    id: string;
    status: string;
    instanceName: string;
    version: string;
    lastUpdated: string;
    lastUptime: string;
    ipAddress: string;
    location: string;
}

interface InstancesResponse {
    error: boolean;
    data: Instance[];
}

export const getInstances = async (keyId: string): Promise<Instance[]> => {
    const response = await apiGet<InstancesResponse>(`/api/instance?keyId=${keyId}`);
    return response.data;
};

export const getInstancesServer = async (keyId: string, options?: RequestInit): Promise<Instance[]> => {
    const response = await apiGetServer<InstancesResponse>(`/api/instance`, { keyId }, options);
    return response.data;
};
