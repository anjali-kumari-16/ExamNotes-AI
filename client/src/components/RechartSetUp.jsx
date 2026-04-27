import React from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
    LineChart,
    Line,
    PieChart,
    Pie,
} from 'recharts';

function RechartSetUp({ charts }) {
    if (!charts || charts.length === 0) return null;
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className='space-y-8'>
            {charts.map((chart, index) => (
                <div
                    key={index}
                    className='border border-gray-200 rounded-xl p-4 bg-white'
                >
                    <h4 className='font-semibold text-gray-800 mb-3'>
                        📊 {chart.title}
                    </h4>
                    <div className='h-72'>
                        <ResponsiveContainer width='100%' height='100%'>
                            {/* Bar chart */}
                            {chart.type === 'bar' && (
                                <BarChart data={chart.data}>
                                    <XAxis dataKey='name' />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey='value' radius={[6, 6, 0, 0]} label={{ position: 'top', fill: '#666', fontSize: 12 }}>
                                        {chart.data.map((_, i) => (
                                            <Cell
                                                key={i}
                                                fill={COLORS[i % COLORS.length]}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            )}

                            {/* Line chart */}
                            {chart.type === 'line' && (
                                <LineChart data={chart.data}>
                                    <XAxis dataKey='name' />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type='monotone'
                                        dataKey='value'
                                        stroke='#0088FE'
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                        label={{ position: 'top', fill: '#666', fontSize: 12, dy: -5 }}
                                    />
                                </LineChart>
                            )}
                            {/* Pie chart */}
                            {chart.type === 'pie' && (
                                <PieChart data={chart.data}>
                                    <Pie dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius={80} fill='#8884d8' label={({ name, value }) => `${name}: ${value}`}>
                                        {chart.data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Pie>
                                </PieChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RechartSetUp;