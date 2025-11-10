
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';

const generateData = () => Array.from({ length: 10 }, (_, i) => ({
  name: `T-${9-i}`,
  core1: Math.floor(Math.random() * 60) + 20,
  core2: Math.floor(Math.random() * 50) + 30,
}));

const radialData = [
  { name: 'CPU', uv: Math.random() * 100, fill: '#8884d8' },
  { name: 'Memory', uv: Math.random() * 100, fill: '#83a6ed' },
  { name: 'Disk', uv: Math.random() * 100, fill: '#8dd1e1' },
  { name: 'Network', uv: Math.random() * 100, fill: '#82ca9d' },
];


const DashboardApp: React.FC = () => {
  const [data, setData] = useState(generateData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.slice(1), {
          name: 'Now',
          core1: Math.floor(Math.random() * 60) + 20,
          core2: Math.floor(Math.random() * 50) + 30,
        }];
        return newData.map((d, i) => ({...d, name: `T-${9-i}`}));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 h-full text-white font-mono flex flex-col space-y-4">
      <h2 className="text-lg text-cyan-300">Quantum Core Monitor</h2>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey="name" stroke="#ffffff80" />
            <YAxis stroke="#ffffff80" />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #ffffff30' }} />
            <Line type="monotone" dataKey="core1" stroke="#8884d8" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="core2" stroke="#82ca9d" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
       <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            innerRadius="20%" 
            outerRadius="100%" 
            data={radialData} 
            startAngle={180} 
            endAngle={0}
          >
            <RadialBar background dataKey="uv" />
            <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{color: '#fff'}}/>
            <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #ffffff30' }}/>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardApp;
