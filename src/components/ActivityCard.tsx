import React from 'react';
import { format, parseISO } from 'date-fns';
import { MapPin, Calendar, Clock, TrendingUp, Heart } from 'lucide-react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { StravaActivity } from '../types';
import { decodePolyline } from '../utils/polyline';
import L from 'leaflet';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ActivityCardProps {
  activity: StravaActivity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const date = parseISO(activity.start_date);
  const formattedDate = format(date, 'MMM d, yyyy');
  const formattedTime = format(date, 'h:mm a');
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">{activity.name}</h2>
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{formattedDate} at {formattedTime}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-500" />
          <div>
            <p className="text-sm text-gray-600">Distance</p>
            <p className="font-semibold">{(activity.distance / 1000).toFixed(2)} km</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Clock className="w-5 h-5 mr-2 text-green-500" />
          <div>
            <p className="text-sm text-gray-600">Duration</p>
            <p className="font-semibold">
              {Math.floor(activity.moving_time / 60)}:{(activity.moving_time % 60).toString().padStart(2, '0')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
          <div>
            <p className="text-sm text-gray-600">Elevation</p>
            <p className="font-semibold">{activity.total_elevation_gain}m</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Heart className="w-5 h-5 mr-2 text-red-500" />
          <div>
            <p className="text-sm text-gray-600">Avg Heart Rate</p>
            <p className="font-semibold">{Math.round(activity.average_heartrate)} bpm</p>
          </div>
        </div>
      </div>
      
      {activity.map.summary_polyline && (
        <div className="h-64 rounded-lg overflow-hidden">
          <MapContainer
            center={activity.start_latlng}
            zoom={13}
            className="h-full w-full"
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Polyline
              positions={decodePolyline(activity.map.summary_polyline)}
              color="#3B82F6"
              weight={3}
            />
          </MapContainer>
        </div>
      )}
    </div>
  );
}