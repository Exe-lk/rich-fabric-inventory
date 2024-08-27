import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubHeaderRight, SubheaderSeparator } from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import {app} from '../../../firebaseConfig';
import { getDatabase, onValue, ref } from 'firebase/database';

const Index: NextPage = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [telescope, setTelescope] = useState<any[]>([])
  // Array of time slots
  const timeSlots = [
    "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30",
    "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30",
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00",
  ];

  // //fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase(app);
        const starCountRef = ref(db, 'time_slot');
        onValue(starCountRef, async (snapshot) => {
          const data = snapshot.val();
          const chart1 = Object.keys(data).map(key => data[key]);
          const chart2 = chart1[chart1.length - 1]
          const transformedData = Object.keys(chart2).map(key => ({
            telescopeId: key,
            telescopeData: chart2[key]
          }));

          console.log(transformedData);
          setTelescope(transformedData)

        });

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <PageWrapper>
      <SubHeader>
        <SubHeaderLeft>
          {/* Search input */}
          <label className='border-0 bg-transparent cursor-pointer me-0' htmlFor='searchInput'>
            <Icon icon='Search' size='2x' color='primary' />
          </label>
          <Input
            id='searchInput'
            type='search'
            className='border-0 shadow-none bg-transparent'
            placeholder='Search payment'
            onChange={(event: any) => { setSearchTerm(event.target.value); }}
            value={searchTerm}
          />
        </SubHeaderLeft>
      </SubHeader>
      <Page>
        <div className='row h-100'>
          <div className='col-12'>
            {/* Table for displaying customer data */}
            <Card stretch>
              <CardBody isScrollable className='table-responsive'>
              <table className='table table-modern table-hover'>
                  <thead>
                  <tr>
                      <th>Telescope</th>
                      {/* Loop through time slots and generate table headers */}
                      {timeSlots.map(time => (
                        <th key={time}>{time}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Add table body content here */}
                    {telescope.map(data => (
                      <tr key={data.telescopeId}>
                        <td>{data.telescopeId}</td>
                        {data.telescopeData.map((data1: any, index: number) => (
                          <td key={index} style={{ backgroundColor: data1.isReserved ? "#F35421" : "#7FC5C5", border: '2px solid black', borderRadius:'5px'}}></td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                    </table>
              </CardBody>
            </Card>

          </div>
        </div>

      </Page>
    </PageWrapper>
  );
};

export default Index;
