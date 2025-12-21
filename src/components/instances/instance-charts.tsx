
"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { InstanceGraphs } from "@/services/instance.service";

interface InstanceChartsProps {
    graphs: InstanceGraphs;
}

// Helper for custom legend
const CustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <ul className="flex list-none gap-4 mb-2 text-xs text-gray-500 pl-4">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center gap-2">
          <span
            className="block w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

export function InstanceCharts({ graphs }: InstanceChartsProps) {
  // Format time to show only time part, assuming ISO string
  const formatTime = (timeStr: string) => {
      try {
          return new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch {
          return timeStr;
      }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Connections Chart */}
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Connections</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={graphs.connections.map(d => ({ ...d, time: formatTime(d.time) }))}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            >
              <defs>
                 {/* Gradients or solid colors can be defined here if needed specifically */}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend content={<CustomLegend />} verticalAlign="top" align="left" wrapperStyle={{paddingBottom: '20px'}} />
              
              <Area type="monotone" dataKey="server_pool" stackId="1" stroke="none" fill="#fca5a5" fillOpacity={0.8} name="Server Pool" />
              <Area type="monotone" dataKey="total_server" stackId="1" stroke="none" fill="#93c5fd" fillOpacity={0.8} name="Total Server" />
              <Area type="monotone" dataKey="active" stackId="1" stroke="none" fill="#fca5a5" fillOpacity={0.6} name="Active" />
              <Area type="monotone" dataKey="client_pool" stackId="1" stroke="none" fill="#67e8f9" fillOpacity={0.6} name="Client Pool" />
              <Area type="monotone" dataKey="total_client" stackId="1" stroke="none" fill="#86efac" fillOpacity={0.6} name="Total Client" />
             
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {graphs.connections.length > 0 && <div className="text-center text-[10px] text-gray-400 mt-2">{new Date(graphs.connections[0].time).toLocaleDateString()}</div>}
      </div>

      {/* Bandwidth Chart */}
       <div className="min-w-0">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Bandwidth</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={graphs.bandwidth.map(d => ({ ...d, time: formatTime(d.time) }))}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend content={<CustomLegend />} verticalAlign="top" align="left" wrapperStyle={{paddingBottom: '20px'}} />
              
              <Area type="monotone" dataKey="server_pool" stackId="1" stroke="none" fill="#fca5a5" fillOpacity={0.8} name="Server Pool" />
              <Area type="monotone" dataKey="server_side" stackId="1" stroke="none" fill="#93c5fd" fillOpacity={0.8} name="Server Side" />
              <Area type="monotone" dataKey="client_side" stackId="1" stroke="none" fill="#86efac" fillOpacity={0.6} name="Client Side" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {graphs.bandwidth.length > 0 && <div className="text-center text-[10px] text-gray-400 mt-2">{new Date(graphs.bandwidth[0].time).toLocaleDateString()}</div>}
      </div>

       {/* Memory Chart */}
       <div className="min-w-0">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Memory</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={graphs.memory.map(d => ({ ...d, time: formatTime(d.time) }))}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend content={<CustomLegend />} verticalAlign="top" align="left" wrapperStyle={{paddingBottom: '20px'}} />
              
              <Area type="monotone" dataKey="server_pool" stackId="1" stroke="none" fill="#fca5a5" fillOpacity={0.8} name="Server Pool" />
              <Area type="monotone" dataKey="caching" stackId="1" stroke="none" fill="#93c5fd" fillOpacity={0.8} name="Caching" />
              <Area type="monotone" dataKey="in_use" stackId="1" stroke="none" fill="#86efac" fillOpacity={0.6} name="In use" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {graphs.memory.length > 0 && <div className="text-center text-[10px] text-gray-400 mt-2">{new Date(graphs.memory[0].time).toLocaleDateString()}</div>}
      </div>

       {/* CPU Chart */}
       <div className="min-w-0">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">CPU</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={graphs.cpu.map(d => ({ ...d, time: formatTime(d.time) }))}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend content={<CustomLegend />} verticalAlign="top" align="left" wrapperStyle={{paddingBottom: '20px'}} />
              
              <Area type="monotone" dataKey="load_average" stackId="1" stroke="none" fill="#fca5a5" fillOpacity={0.8} name="Load Average" />
              <Area type="monotone" dataKey="idle" stackId="1" stroke="none" fill="#93c5fd" fillOpacity={0.8} name="Idle" />
              <Area type="monotone" dataKey="total" stackId="1" stroke="none" fill="#86efac" fillOpacity={0.6} name="Total" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {graphs.cpu.length > 0 && <div className="text-center text-[10px] text-gray-400 mt-2">{new Date(graphs.cpu[0].time).toLocaleDateString()}</div>}
      </div>

    </div>
  );
}
