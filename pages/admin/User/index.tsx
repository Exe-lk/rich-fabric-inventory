import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubHeaderRight, SubheaderSeparator } from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Swal from 'sweetalert2';
import axios from 'axios';
import GetDataService from '../../../services/getservices';
import PutDataService from '../../../services/putservices';


const Index: NextPage = () => {

  interface User {
    id: string
    email: string,
    fullName: string,
    location: string,
    phone: string,
    status: string,
  }
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [count, setCount] = useState(0);

  // get user details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response:any = await GetDataService("users");
        
        // const response = await axios.get("https://us-central1-smarttelescope.cloudfunctions.net/api/users");
        const users = await Object.entries(response.data).map(([key, value]: any) => ({ id: key, ...value }));
        await setUsers(users)
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [count]);

  //divativate activate user
  const deactivateuser = async (status: any, id: string) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
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
          PutDataService(`users/${id}/status`, data)
          // axios
          //   .put(`https://us-central1-smarttelescope.cloudfunctions.net/api/users/${id}/status`, data)
            .then((res: any) => {

              setCount(count + 1)
              Swal.fire('Updated!', 'User has been update.', 'success');
            })
            .catch((err) => {
              console.error('Error fetching data: ', err);
            });
        } else {
          console.log(status)
          const data: any = {
            status: 1
          }
          PutDataService(`users/${id}/status`, data)
         
            .then((res: any) => {
              setCount(count + 1)
              Swal.fire('Updated!', 'user has been update.', 'success');
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
            placeholder='Search User'
            // onChange={formik.handleChange}
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
                      <th>No# </th>
                      <th>User Name </th>
                      <th>Email</th>
                      <th>Location </th>
                      <th>Contact</th>
                      <th>Status  </th>
                      <th>Action</th>

                    </tr>
                  </thead>
                  <tbody>

                    {users
                      .filter((val) => {
                        if (searchTerm === "") {
                          return val
                        } else if (val.fullName.toLowerCase().includes(searchTerm.toLowerCase())) {
                          return val
                        }

                      }).map((user, index) => (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{user.fullName} </td>
                          <td>{user.email} </td>
                          <td>{user.location}</td>
                          <td>{user.phone}</td>
                          <td>{user.status ? "active" : "Deactivate"} </td>
                          <td>{user.status ?
                            <Button icon='Delete' color='info' onClick={() => { deactivateuser(user.status, user.id) }}>
                              Deactivate
                            </Button>
                            :
                            <Button icon='Delete' color='info' onClick={() => { deactivateuser(user.status, user.id) }}>
                              Activate
                            </Button>
                          }
                          </td>

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



