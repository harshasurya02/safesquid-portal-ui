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

const data = [
  { time: "00:00:00", totalClient: 400, clientPool: 200, active: 100, totalServer: 300, serverPool: 150, clientSide: 300, serverSide: 200, inUse: 200, caching: 100, totalCpu: 300, idle: 100, loadAvg: 50 },
  { time: "02:00:00", totalClient: 300, clientPool: 250, active: 120, totalServer: 280, serverPool: 160, clientSide: 350, serverSide: 220, inUse: 250, caching: 120, totalCpu: 350, idle: 110, loadAvg: 60 },
  { time: "04:00:00", totalClient: 500, clientPool: 300, active: 150, totalServer: 400, serverPool: 200, clientSide: 450, serverSide: 280, inUse: 400, caching: 180, totalCpu: 500, idle: 150, loadAvg: 80 },
  { time: "06:00:00", totalClient: 700, clientPool: 400, active: 180, totalServer: 500, serverPool: 250, clientSide: 600, serverSide: 350, inUse: 500, caching: 220, totalCpu: 600, idle: 180, loadAvg: 100 },
  { time: "08:00:00", totalClient: 600, clientPool: 350, active: 160, totalServer: 450, serverPool: 220, clientSide: 500, serverSide: 300, inUse: 450, caching: 200, totalCpu: 550, idle: 160, loadAvg: 90 },
  { time: "10:00:00", totalClient: 800, clientPool: 500, active: 200, totalServer: 600, serverPool: 300, clientSide: 700, serverSide: 400, inUse: 600, caching: 300, totalCpu: 700, idle: 220, loadAvg: 120 },
];

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

export function InstanceCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Connections Chart */}
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Connections</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
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
              
              {/* Using stacked areas or layered as per image. Image looks layered/stacked. Let's try stackId for some or just layering. 
                  The image shows transparent overlaps usually. 
               */}
              <Area type="monotone" dataKey="serverPool" stackId="1" stroke="none" fill="#fca5a5" fillOpacity={0.8} name="Server Pool" />
              <Area type="monotone" dataKey="totalServer" stackId="1" stroke="none" fill="#93c5fd" fillOpacity={0.8} name="Total Server" />
              <Area type="monotone" dataKey="active" stackId="1" stroke="none" fill="#fca5a5" fillOpacity={0.6} name="Active" />
              <Area type="monotone" dataKey="clientPool" stackId="1" stroke="none" fill="#67e8f9" fillOpacity={0.6} name="Client Pool" />
              <Area type="monotone" dataKey="totalClient" stackId="1" stroke="none" fill="#86efac" fillOpacity={0.6} name="Total Client" />
             
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center text-[10px] text-gray-400 mt-2">2024 - 04 - 24</div>
      </div>

      {/* Bandwidth Chart */}
       <div className="min-w-0">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Bandwidth</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend content={<CustomLegend />} verticalAlign="top" align="left" wrapperStyle={{paddingBottom: '20px'}} />
              
              <Area type="monotone" dataKey="serverPool" stackId="1" stroke="none" fill="#fca5a5" fillOpacity={0.8} name="Server Pool" />
              <Area type="monotone" dataKey="serverSide" stackId="1" stroke="none" fill="#93c5fd" fillOpacity={0.8} name="Server Side" />
              <Area type="monotone" dataKey="clientSide" stackId="1" stroke="none" fill="#86efac" fillOpacity={0.6} name="Client Side" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center text-[10px] text-gray-400 mt-2">2024 - 04 - 24</div>
      </div>

       {/* Memory Chart */}
       <div className="min-w-0">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Memory</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend content={<CustomLegend />} verticalAlign="top" align="left" wrapperStyle={{paddingBottom: '20px'}} />
              
              <Area type="monotone" dataKey="serverPool" stackId="1" stroke="none" fill="#fca5a5" fillOpacity={0.8} name="Server Pool" />
              <Area type="monotone" dataKey="caching" stackId="1" stroke="none" fill="#93c5fd" fillOpacity={0.8} name="Caching" />
              <Area type="monotone" dataKey="inUse" stackId="1" stroke="none" fill="#86efac" fillOpacity={0.6} name="In use" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center text-[10px] text-gray-400 mt-2">2024 - 04 - 24</div>
      </div>

       {/* CPU Chart */}
       <div className="min-w-0">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">CPU</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend content={<CustomLegend />} verticalAlign="top" align="left" wrapperStyle={{paddingBottom: '20px'}} />
              
              <Area type="monotone" dataKey="loadAvg" stackId="1" stroke="none" fill="#fca5a5" fillOpacity={0.8} name="Load Average" />
              <Area type="monotone" dataKey="idle" stackId="1" stroke="none" fill="#93c5fd" fillOpacity={0.8} name="Idle" />
              <Area type="monotone" dataKey="totalCpu" stackId="1" stroke="none" fill="#86efac" fillOpacity={0.6} name="Total" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center text-[10px] text-gray-400 mt-2">2024 - 04 - 24</div>
      </div>

    </div>
  );
}
