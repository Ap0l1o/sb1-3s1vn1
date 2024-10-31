import React, { useEffect, useState } from 'react';
import { Activity, Download } from 'lucide-react';
import { ActivityCard } from './components/ActivityCard';
import { Stats } from './components/Stats';
import { StravaActivity } from './types';

// Import mock data
const mockData = {
  "activities": [
    {
      "id": 1,
      "name": "Morning City Run",
      "distance": 5200,
      "moving_time": 1800,
      "elapsed_time": 1920,
      "total_elevation_gain": 45,
      "start_date": "2024-03-15T06:30:00Z",
      "average_speed": 2.89,
      "max_speed": 3.5,
      "average_heartrate": 155,
      "max_heartrate": 175,
      "start_latlng": [39.9042, 116.4074],
      "end_latlng": [39.9042, 116.4074],
      "map": {
        "summary_polyline": "}_~{Fc`|sLjAwD|DyBfEzAtAzG"
      }
    },
    {
      "id": 2,
      "name": "Park Interval Run",
      "distance": 8000,
      "moving_time": 2400,
      "elapsed_time": 2520,
      "total_elevation_gain": 65,
      "start_date": "2024-03-13T16:00:00Z",
      "average_speed": 3.33,
      "max_speed": 4.2,
      "average_heartrate": 162,
      "max_heartrate": 182,
      "start_latlng": [39.9042, 116.4074],
      "end_latlng": [39.9042, 116.4074],
      "map": {
        "summary_polyline": "}_~{Fc`|sLjAwD|DyBfEzAtAzG"
      }
    }
  ]
};

function App() {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Use mock data
    setActivities(mockData.activities);
    setLoading(false);
  }, []);

  const handleDownload = () => {
    const dataStr = JSON.stringify(activities, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'running-activities.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Activity className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Running Journey</h1>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Data
          </button>
        </div>
        <Stats activities={activities} />
        <div className="space-y-6">
          {activities.map(activity => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;