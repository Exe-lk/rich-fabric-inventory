import React, { FC, useEffect, useState } from 'react';
import Card, {
  CardActions,
  CardBody,
  CardHeader,
  CardLabel,
  CardTitle,
} from '../../../components/bootstrap/Card';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import Button, { ButtonGroup } from '../../../components/bootstrap/Button';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Select from '../../../components/bootstrap/forms/Select';
import axios from 'axios';
import GetDataService from '../../../services/getservices';

interface ICommonUpcomingEventsProps {
  isFluid?: boolean;
}

interface Telescopes {
  Location: string,
  isDelete: number,
  latitude: number,
  longitude: number,
  queue: number,
  status: number,
  weather: string,
}

const CommonUpcomingEvents: FC<ICommonUpcomingEventsProps> = ({ isFluid }) => {

  const [telescopes, setTelescopes] = useState<Telescopes[]>([]);
  //get telescope data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await GetDataService("telescopes");
        const telescopes = Object.keys(response.data).map(key => response.data[key]);

        setTelescopes(telescopes)
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);


  return (
    <>
      <Card stretch={isFluid}>
        <CardHeader borderSize={1}>
          <CardLabel icon='Camera' iconColor='success'>
            <CardTitle>Telescope</CardTitle>
          </CardLabel>

        </CardHeader>
        <CardBody className='table-responsive' isScrollable={isFluid}>
          <>
            <table className='table table-modern table-hover'>
              <thead>
                <tr>
                  <th>Telescope ID  </th>
                  <th>Location </th>
                </tr>
              </thead>
              <tbody>

                {telescopes
                  .filter((val) => {
                    if (val.status) {
                      return val
                    }

                  }).map((telescopes, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{telescopes.Location} </td>


                    </tr>
                  ))}

              </tbody>

            </table>
          </>
        </CardBody>

      </Card>
    </>
  );
};

export default CommonUpcomingEvents;
