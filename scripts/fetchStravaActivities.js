const fs = require('fs').promises;
const path = require('path');

const STRAVA_API = 'https://www.strava.com/api/v3';

async function getAccessToken() {
  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: process.env.STRAVA_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  
  const data = await response.json();
  return data.access_token;
}

async function fetchActivities(accessToken) {
  const response = await fetch(
    `${STRAVA_API}/athlete/activities?per_page=100`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );
  
  return response.json();
}

async function main() {
  try {
    const accessToken = await getAccessToken();
    const activities = await fetchActivities(accessToken);
    
    const runningActivities = activities
      .filter(activity => activity.type === 'Run')
      .map(activity => ({
        id: activity.id,
        name: activity.name,
        distance: activity.distance,
        moving_time: activity.moving_time,
        elapsed_time: activity.elapsed_time,
        total_elevation_gain: activity.total_elevation_gain,
        start_date: activity.start_date,
        average_speed: activity.average_speed,
        max_speed: activity.max_speed,
        average_heartrate: activity.average_heartrate,
        max_heartrate: activity.max_heartrate,
        start_latlng: activity.start_latlng,
        end_latlng: activity.end_latlng,
        map: activity.map,
      }));
    
    await fs.mkdir('public/data', { recursive: true });
    
    await fs.writeFile(
      'public/data/activities.json',
      JSON.stringify({ activities: runningActivities }, null, 2)
    );
    
    console.log(`Successfully saved ${runningActivities.length} activities`);
  } catch (error) {
    console.error('Error fetching activities:', error);
    process.exit(1);
  }
}

main();