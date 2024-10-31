import React from 'react';
import { format, parseISO, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { BarChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { StravaActivity } from '../types';

interface StatsProps {
  activities: StravaActivity[];
}

export function Stats({ activities }: StatsProps) {
  const totalDistance = activities.reduce((acc, curr) => acc + curr.distance, 0) / 1000;
  const totalTime = activities.reduce((acc, curr) => acc + curr.moving_time, 0) / 3600;
  const totalElevation = activities.reduce((acc, curr) => acc + curr.total_elevation_gain, 0);

  // Get data for the last 6 months
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    const monthActivities = activities.filter(activity => {
      const activityDate = parseISO(activity.start_date);
      return activityDate >= monthStart && activityDate <= monthEnd;
    });
    
    const monthDistance = monthActivities.reduce((acc, curr) => acc + curr.distance, 0) / 1000;
    const monthTime = monthActivities.reduce((acc, curr) => acc + curr.moving_time, 0) / 60; // Convert to minutes
    
    // Calculate average pace (minutes/km)
    const avgPace = monthDistance > 0 ? monthTime / monthDistance : 0;
    
    return {
      month: format(date, 'MMM'),
      distance: parseFloat(monthDistance.toFixed(1)),
      pace: parseFloat(avgPace.toFixed(2))
    };
  }).reverse();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Running Statistics</h2>
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-500">{totalDistance.toFixed(1)}</p>
          <p className="text-gray-600">Total Distance (km)</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-500">{totalTime.toFixed(1)}</p>
          <p className="text-gray-600">Total Time (hours)</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-500">{totalElevation}</p>
          <p className="text-gray-600">Total Elevation (m)</p>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#10B981"
              domain={['dataMin - 1', 'dataMax + 1']}
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'Monthly Distance') return [`${value} km`, name];
                if (name === 'Average Pace') return [`${value} min/km`, name];
                return [value, name];
              }}
            />
            <Legend />
            <Bar 
              yAxisId="left" 
              dataKey="distance" 
              fill="#3B82F6" 
              name="Monthly Distance"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="pace"
              stroke="#10B981"
              name="Average Pace"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}