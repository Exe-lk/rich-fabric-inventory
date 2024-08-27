import React, { useEffect, useState } from 'react';
import Card, { CardBody, CardLabel, CardTitle } from '../../../components/bootstrap/Card';
import Icon from '../../../components/icon/Icon';
import axios from 'axios';
import { Height } from '../../../components/icon/material-icons';


const CommonDashboardUserCard = () => {

  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [sunnyDays, setSunnyDays] = useState(0);
  const [mostlySunnyDays, setMostlySunnyDays] = useState(0);
  const [daysLeft, setDaysLeft] = useState<any>(0);
  const [prediction, setPrediction] = useState<any>(0);

  //get weather data
  useEffect(() => {

    const apiKey = '7c88b1faaa4a4c6985f92040242302';
    const location = 'Sri lanka';
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=${daysLeft}`;

    // Fetch weather data
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        return response.json();
      })
      .then(data => {

        setWeatherData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [daysLeft, prediction]);


  // get clear sky days
  useEffect(() => {
    analyzeWeather();
  }, [daysLeft, weatherData, prediction]);

  const analyzeWeather = async () => {
    const forecastDays = await weatherData?.forecast.forecastday;
    let sunnyCount = 0;
    let mostlySunnyCount = 0;

    forecastDays?.forEach((forecastDay: any) => {
      const condition = forecastDay.day.condition.text;

      if (condition === 'Sunny') {
        sunnyCount++;
      } else if (condition === 'Mostly Sunny') {
        mostlySunnyCount++;
      }
    });

    await setSunnyDays(sunnyCount);
    await setMostlySunnyDays(mostlySunnyCount);
  };


  // get remaining days
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysUntilEndOfMonth = lastDayOfMonth - currentDate.getDate();

    setDaysLeft(daysUntilEndOfMonth + 1);

  }, []);


  // get estimeted cost from 
  useEffect(() => {
    try {
      const baseURL = `https://asia-south1-smarttelescope.cloudfunctions.net/Weather_Test`
      const data = {
        AvgOfIncome: 10000,
        Remainingdays: daysLeft,
        RemainingClearSkyDays: sunnyDays + mostlySunnyDays
      }

      axios.post(baseURL, data)
        .then((res: any) => {

          const ans=Math.round((res.data.prediction + Number.EPSILON) * 100) / 100;
          setPrediction(ans)

        })
        .catch((err) => {
          console.log(err)
          return err
        })

    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }, [daysLeft, weatherData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Card stretch={false}style={{'height':'200px'}} >
      <CardTitle className='pt-4 ps-4'>
        <Icon icon='TrendingUp' size='3x' color='info' className='me-2' />
        Revenue
      </CardTitle>
      <CardBody isScrollable={false} className='table-responsive ms-2'>


        <div className='row'>
          <div className='col-8'>
            <p className="fs-5">Estimated charges</p>
            For the billing period 1-31 Mar 2024
          </div>
          <div className='col-4'>
           <b> RS. {prediction} </b>
          </div>

        </div>

     

      </CardBody>
    </Card>
  );
};

export default CommonDashboardUserCard;