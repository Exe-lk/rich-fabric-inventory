import React, { useEffect, useState } from 'react';
import {
    GoogleMap,
    LoadScript,
    Marker,
} from '@react-google-maps/api';
import axios from 'axios';
import GetDataService from '../../../services/getservices';


interface Telescopes {
    Location: string,
    isDelete: number,
    latitude: number,
    longitude: number,
    queue: number,
    status: number,
    weather: string,
}


const GoogleMapComponent = () => {
    const [telescopes, setTelescopes] = useState<Telescopes[]>([]);
    const center = { lat: 7.310304039129216, lng: 80.63585749444223 };
    const zoomLevel = 8;

   
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response:any =await GetDataService("telescopes")
            // const response = await axios.get("https://us-central1-smarttelescope.cloudfunctions.net/api/telescopes");
            const telescopes = await Object.keys(response.data).map(key => response.data[key]);
            console.log(telescopes);
            setTelescopes(telescopes)
          } catch (error) {
            console.error('Error fetching data: ', error);
          }
        };
    
        fetchData();
      }, []);
    return (


        <LoadScript
            // Pass libraries as a constant variable
            googleMapsApiKey="AIzaSyBTHUpybnJLKLsLIe0D-T58rvmLjM5gFU8"
        >
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '600px' }}
                center={center}
                zoom={zoomLevel}
            >
                {telescopes.map((location, index) => (
                    <Marker
                        key={index} // Unique key combining index and lat/lng
                        position={{ lat: location.latitude, lng: location.longitude }} // Passing the entire location object as position

                    />
                ))}
            </GoogleMap>
        </LoadScript>

    );
};

export default GoogleMapComponent;

  