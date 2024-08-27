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

const Index: NextPage = () => {

  interface Payments {
    id: string,
    amount: number,
    date: string,
    transactionId: string,
    userId: string,
    status: string,

  }


  const [searchTerm, setSearchTerm] = useState("");
  const [payment, setPayment] = useState<Payments[]>([]);

  //refunf payment
  const refund = async () => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure to refund this amount?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Refund it!',
      })

      if (result.isConfirmed) {


      }
    } catch (error) {
      console.error('Error deleting document: ', error);
      Swal.fire('Error', 'Failed to delete employee.', 'error');
    }

  }
  //get payment details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await GetDataService("payments");
        const telescopes = await Object.entries(response.data).map(([key, value]: any) => ({ id: key, ...value }));
        setPayment(telescopes);
      } catch (error) {
        console.error('Error fetching data: ', error);
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
                      <th>Invoice ID </th>
                      <th>User ID</th>
                      <th>Transaction ID</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Payment Status </th>

                      <td />
                    </tr>
                  </thead>
                  <tbody>
                    {payment
                      .filter((val) => {
                        return val

                      }).map((telescopes, index) => (
                        <tr>
                          <td>{telescopes.id}</td>
                          <td>{telescopes.userId} </td>
                          <td>{telescopes.transactionId}</td>
                          <td>{telescopes.amount} </td>
                          <td>{telescopes.date}</td>
                          <td>{telescopes.status}</td>



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



