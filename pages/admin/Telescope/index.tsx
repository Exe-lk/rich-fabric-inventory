import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubHeaderRight, SubheaderSeparator } from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import Swal from 'sweetalert2';
import Button from '../../../components/bootstrap/Button';
import CustomerEditModal from './AddTelescope/CustomerEditModal';
import MapComponent from './Map';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Select from '../../../components/bootstrap/forms/Select';
import GetDataService from '../../../services/getservices';
import PutDataService from '../../../services/putservices';
import PostDataService from '../../../services/postservice';
const Index: NextPage = () => {

  interface Telescopes {
    id: string,
    Location: string,
    isDelete: number,
    latitude: number,
    longitude: number,
    queue: number,
    status: number,
    weather: string,
  }
 
  const [searchTerm, setSearchTerm] = useState("");
  const [telescopes, setTelescopes] = useState<Telescopes[]>([]);
  const [addModalStatus, setAddModalStatus] = useState<boolean>(false);
  const [count, setCount] = useState(0);

  // get user details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response:any = await GetDataService("telescopes");
        const telescopes = Object.entries(response.data).map(([key, value]: any) => ({ id: key, ...value }));
        console.log(telescopes);
        setTelescopes(telescopes);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [count,addModalStatus]);

  //deactivate user
  const deactivateuser = async (status: any, id: string) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      })

      if (result.isConfirmed) {
        if (status) {
          console.log(status)
          const data: any = {
            status: 0
          }

          PutDataService(`telescopes/${id}/status`,data)
      .then((res: any) => {
              setCount(count+1)
              Swal.fire('Updated!', 'Telescope has been update.', 'success');
            })
            .catch((err) => {
              console.error('Error fetching data: ', err);
            });
        } else {
          console.log(status)
          const data: any = {
            status: 1
          }
          PutDataService(`telescopes/${id}/status`,data)
            .then((res: any) => {
              setCount(count+1)
              Swal.fire('Updated!', 'Telescope has been update.', 'success');
            })
            .catch((err) => {
              console.error('Error fetching data: ', err);
            });
        }


      }
    } catch (error) {
      console.error('Error deleting document: ', error);
      Swal.fire('Error', 'Failed to dactivate  telescope.', 'error');
    }

  }

  //update weather
  const updateWeather = async (data: Telescopes, weather: string) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure to change weather?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, change it!',
      })

      if (result.isConfirmed) {
     
          data.weather=weather
          console.log(data)
          PostDataService(`telescopes/${data.id}/`,data)
            .then((res: any) => {
              setCount(count+1)
              Swal.fire('Updated!', 'Telescope has been update.', 'success');
            })
            .catch((err) => {
              console.error('Error fetching data: ', err);
            });
        }
    } catch (error) {
      console.error('Error deleting document: ', error);
      Swal.fire('Error', 'Failed to dactivate  telescope.', 'error');
    }

  }


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
            placeholder='Search Telescope...'
            // onChange={formik.handleChange}
            onChange={(event: any) => { setSearchTerm(event.target.value); }}
            value={searchTerm}
          />
        </SubHeaderLeft>
        <SubHeaderRight>
          <Button icon='Camera' color='primary' isLight onClick={() => setAddModalStatus(true)}>
            New Telescope
          </Button>
        </SubHeaderRight>

      </SubHeader>
      <Page>
        <div className='row h-100'>
          <div className='col-12'>
            {/* Table for displaying customer data */}
            <Card stretch id="1">
              <CardBody isScrollable className='table-responsive'>
                <table className='table table-modern table-hover'>
                  <thead>
                    <tr>
                      <th>Telescope ID  </th>
                      <th>Location </th>
                      <th>Longitude</th>
                      <th>Latitude </th>
                      <th>Weather</th>
                      <th>Status  </th>
                      <th>Action</th>

                    </tr>
                  </thead>
                  <tbody>

                    {telescopes
                      .filter((val) => {
                        if (searchTerm === "") {
                          return val
                        } else if (val.Location?.toLowerCase().includes(searchTerm.toLowerCase())) {
                          return val
                        }

                      }).map((telescopes, index) => (
                        <tr>
                          <td>{telescopes.id}</td>
                          <td>{telescopes.Location} </td>
                          <td>{telescopes.longitude} </td>
                          <td>{telescopes.latitude}</td>
                          <td>
                            
                          <FormGroup
													id='role'
													
													className='col-md-12'>
													<Select
														ariaLabel='State'
														placeholder={telescopes.weather}
														list={[
															{ value: 'Suny', text: 'Sunny' },
															{ value: 'Most Suny', text: 'Most Suny' },
															{ value: 'Clear Sky', text: 'Clear Sky' },

														]}
                            onChange={(e:any)=>{updateWeather(telescopes,e.target.value)}}
														
													/>
												</FormGroup>
                            
                            
                            </td>

                          <td>{telescopes.status ? "active" : "Deactivate"}</td>
                          <td>
                            {telescopes.status ?
                              <Button icon='Delete' color='info' onClick={() => { deactivateuser(telescopes.status, telescopes.id) }}>
                                Deactivate
                              </Button>
                              :
                              <Button icon='Delete' color='info' onClick={() => { deactivateuser(telescopes.status, telescopes.id) }}>
                                Active
                              </Button>
                            }

                          </td>


                        </tr>
                      ))}

                  </tbody>

                </table>


              </CardBody>

            </Card>

            <Card stretch id='map'>
              <CardBody isScrollable className='table-responsive'>
                {/* <Map apiKey={'AIzaSyBTHUpybnJLKLsLIe0D-T58rvmLjM5gFU8'} /> */}
                <MapComponent />

              </CardBody>

            </Card>
          </div>
        </div>
      </Page>
      <CustomerEditModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id="" />
    </PageWrapper>
  );
};




export default Index;



