
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
