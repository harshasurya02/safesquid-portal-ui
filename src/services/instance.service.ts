
import { apiGet, apiPut } from "./api.service";
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

export interface CpuData {
    idle: number;
    time: string;
    total: number;
    load_average: number;
}

export interface MemoryData {
    time: string;
    in_use: number;
    caching: number;
    server_pool: number;
}

export interface BandwidthData {
    time: string;
    client_side: number;
    server_pool: number;
    server_side: number;
}

export interface ConnectionData {
    time: string;
    active: number;
    client_pool: number;
    server_pool: number;
    total_client: number;
    total_server: number;
}

export interface InstanceGraphs {
    cpu: CpuData[];
    memory: MemoryData[];
    bandwidth: BandwidthData[];
    connections: ConnectionData[];
}

export interface InstanceDetails {
    id: string;
    instanceName: string;
    version: string;
    createdAt: string;
    ipAddress: string;
    location: string;
    status: string;
    graphs: InstanceGraphs;
    lastUpdated: string;
}

export interface InstanceHistoryItem {
    id: string;
    description: string;
    timestamp: string;
    user: string;
}

export interface InstanceHistoryResponse {
    error: boolean;
    data: InstanceHistoryItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

interface InstancesResponse {
    error: boolean;
    data: Instance[];
}

interface InstanceDetailsResponse {
    error: boolean;
    data: InstanceDetails;
}

export const getInstances = async (keyId: string): Promise<Instance[]> => {
    const response = await apiGet<InstancesResponse>(`/api/instance?keyId=${keyId}`);
    return response.data;
};

export const getInstancesServer = async (keyId: string, options?: RequestInit): Promise<Instance[]> => {
    const response = await apiGetServer<InstancesResponse>(`/api/instance`, { keyId }, options);
    return response.data;
};

export const getInstanceDetails = async (instanceId: string): Promise<InstanceDetails> => {
    const response = await apiGet<InstanceDetailsResponse>(`/api/instance/${instanceId}`);
    return response.data;
};

export const getInstanceDetailsServer = async (instanceId: string, options?: RequestInit): Promise<InstanceDetails> => {
    const response = await apiGetServer<InstanceDetailsResponse>(`/api/instance/${instanceId}`, {}, options);
    return response.data;
};

export const getInstanceHistoryServer = async (instanceId: string, page: number = 1, limit: number = 10, options?: RequestInit): Promise<InstanceHistoryResponse> => {
    const response = await apiGetServer<InstanceHistoryResponse>(`/api/instance/${instanceId}/history`, { page, limit }, options);
    return response;
};

export const updateInstance = async (instanceId: string, data: { instanceName: string; location: string }): Promise<void> => {
    await apiPut<void>(`/api/instance/${instanceId}`, data);
};
