import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

const data = [
  { name: 'T-60', q_core: 4000, n_link: 2400, load: 2400 },
  { name: 'T-50', q_core: 3000, n_link: 1398, load: 2210 },
  { name: 'T-40', q_core: 2000, n_link: 9800, load: 2290 },
  { name: 'T-30', q_core: 2780, n_link: 3908, load: 2000 },
  { name: 'T-20', q_core: 1890, n_link: 4800, load: 2181 },
  { name: 'T-10', q_core: 2390, n_link: 3800, load: 2500 },
  { name: 'NOW', q_core: 3490, n_link: 4300, load: 2100 },
];

const barData = [
  { name: 'Core A', usage: 65, fill: '#cccccc' },
  { name: 'Core B', usage: 78, fill: '#bbbbbb' },
  { name: 'Core C', usage: 45, fill: '#aaaaaa' },
  { name: 'Core D', usage: 89, fill: '#999999' },
];

const radialData = [
    { name: 'Cognitive Load', value: 75, fill: '#E5E5E5' }
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/80 p-2 border border-gray-600 rounded-md text-sm">
          <p className="label text-gray-200">{`Time: ${label}`}</p>
          <p className="intro" style={{color: '#E5E5E5'}}>{`Quantum Core: ${payload[0].value}`}</p>
          <p className="intro" style={{color: '#A0A0A0'}}>{`Neural Link: ${payload[1].value}`}</p>
        </div>
      );
    }
    return null;
};

const DashboardApp: React.FC = () => {
  return (
    <div className="w-full h-full bg-black/80 text-gray-300 p-2 flex flex-col space-y-2 overflow-hidden">
        <h3 className="text-center font-bold text-gray-200">SYSTEM PERFORMANCE MONITOR</h3>
        <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{fontSize: "12px"}}/>
                    <Line type="monotone" dataKey="q_core" name="Quantum Core" stroke="#E5E5E5" strokeWidth={2} dot={{r: 4}} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="n_link" name="Neural Link" stroke="#A0A0A0" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
        <div className="flex h-1/3 space-x-2">
            <div className="w-2/3">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" stroke="#9CA3AF" width={60} fontSize={12} />
                        <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} wrapperStyle={{backgroundColor: '#111827', border: '1px solid #4B5563'}} />
                        <Bar dataKey="usage" barSize={20}>
                            {barData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="w-1/3">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart innerRadius="50%" outerRadius="90%" data={radialData} startAngle={180} endAngle={0}>
                       <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                       <RadialBar background dataKey='value' angleAxisId={0} />
                       <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-xs">
                          Cognitive Load
                        </text>
                        <text x="50%" y="80%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-300 text-2xl font-bold">
                          {`${radialData[0].value}%`}
                        </text>
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
};

export default DashboardApp;