import React, { useEffect, useState } from 'react';
import Card, { CardBody, CardLabel, CardTitle } from '../../../components/bootstrap/Card';
import Icon from '../../../components/icon/Icon';
import axios from 'axios';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Select from '../../../components/bootstrap/forms/Select';


const CommonDashboardUserCard = () => {


  const [prediction, setPrediction] = useState<any>(0);
  const [location, setLocation] = useState<any>('colombo');
  const [telescopes, setTelescopes] = useState<any>(0);
  const [available_slots, setAvailable_slots] = useState<any>(0);
  const [days_of_previous_month, setDays_of_previous_month] = useState<any>(0);
  const [previous_month_average_purchased_slots, setPrevious_month_average_purchased_slots] = useState<any>(0);
  const [demand_type, setDemand_type] = useState<any>('high');

  //get demand 
  const getdimand = () => {
    try {
      const baseURL = `https://asia-south1-smarttelescope.cloudfunctions.net/supply-level`
      const data = {
        location,
        telescopes,
        available_slots,
        days_of_previous_month,
        previous_month_average_purchased_slots,
        demand_type
      }

      console.log(data)
      axios.post(baseURL, data)
        .then((res: any) => {
          console.log(res.data)
          setPrediction(res.data)
        })
        .catch((err) => {
          console.log(err)
          return err
        })

    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }



  return (
    <Card stretch={false} >
      <CardTitle className='pt-4 ps-4'>
        <Icon icon='DoubleArrow' size='3x' color='success' className='me-2' />
        Check system supply
      </CardTitle>
      <CardBody isScrollable={false} className='table-responsive ms-2'>

      <FormGroup id='location' label='enter location' onChange={(e: any) => { setLocation(e.target.value) }} className='col-md-12'>
							<Select
              required
								ariaLabel='State'
								list={[
									{ value:'colombo', text: 'colombo' },
									{ value:"sliit", text: 'sliit' },
									{ value:"rathnapura", text: 'rathnapura' },
									{ value:"badulla", text: 'badulla' },
									{ value: "kandy", text: 'kandy' },
                  { value: "jaffna", text: 'jaffna' },
                  { value: "anuradhapura", text: 'anuradhapura' },
                  { value: "matara", text: 'matara' },
                  { value: "ampara", text: 'ampara' },
                  { value: "negombo", text: 'negombo' },
									
								]}
								value={location}
							/>
						</FormGroup>
            <FormGroup id='demand_type' label='enter type' className='col-md-12'   onChange={(e: any) => { setDemand_type(e.target.value) }} >
							<Select
              required={true}
								ariaLabel='State'
								list={[
									{ value:'high', text: 'high' },
									{ value:"low", text: 'low' },
									{ value:"mid", text: 'mid' },
								
									
								]}
								value={demand_type}
							/>
						</FormGroup>

 <FormGroup id='telescopes' label='enter telescopes' className='col-md-12'>
          <Input
            type='number'
            onChange={(e: any) => { setTelescopes(e.target.value) }}
            value={telescopes}
          />
        </FormGroup>

        <FormGroup id='available_slots' label='enter available_slots' className='col-md-12'>
          <Input
            type='number'
            onChange={(e: any) => { setAvailable_slots(e.target.value) }}
            value={available_slots}
          />
        </FormGroup>

        <FormGroup id='days_of_previous_month' label='enter days_of_previous_month' className='col-md-12'>
          <Input
            type='number'
            onChange={(e: any) => { setDays_of_previous_month(e.target.value) }}
            value={days_of_previous_month}
          />
        </FormGroup>

        <FormGroup id='previous_month_average_purchased_slots' label='enter previous_month_average_purchased_slots' className='col-md-12'>
          <Input
            type='number'
            onChange={(e: any) => { setPrevious_month_average_purchased_slots(e.target.value) }}
            value={previous_month_average_purchased_slots}
          />
        </FormGroup>




        <Button color='info' className='mt-4 col-12 ' onClick={getdimand}>
          Submit
        </Button>


        <div className='col-12 mt-4'>
          <h4>{prediction}</h4>

        </div>




      </CardBody>
    </Card>
  );
};

export default CommonDashboardUserCard;