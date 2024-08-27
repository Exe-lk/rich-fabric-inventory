import React from 'react';
import GoogleMapReact from 'google-map-react';

const Map = () => {
  // Define marker positions
  const markers = [
    {lat: 9.77991578749362, lng: 80.16194796114756 },
    { lat: 6.925137619020846, lng:80.97337249454358 },
    { lat: 5.970208311412924,  lng:80.52347295807296 }
    // Add more marker positions as needed
  ];

  return (
    <div style={{ height: '1000px', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyBTHUpybnJLKLsLIe0D-T58rvmLjM5gFU8' }}
        defaultCenter={{ lat:7.291335199179175, lng: 80.63061277382532}}
        defaultZoom={8}
      >
        {/* Render markers */}
        {markers.map((marker, index) => (
          <Marker key={index} lat={marker.lat} lng={marker.lng} />
        ))}
      </GoogleMapReact>
    </div>
  );
};

// Marker component
const Marker = (lat:any, lng:any) => <div style={{
    position: 'absolute',
    transform: 'translate(-50%, -50%)', // Center the marker
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'red',
    border: '2px solid white',
}}></div>;

export default Map;
