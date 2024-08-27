import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPagesMenu } from '../../../menu';
import Page from '../../../layout/Page/Page';

import Chart3 from'./top-product-chart'

const Index: NextPage = () => {

  return (
    <PageWrapper>
      <Head>
        <title>{demoPagesMenu.sales.subMenu.dashboard.text}</title>
      </Head>

      <Page container='fluid'>
        <div className='row'>
       
          <div className='col-9'>
            
            <Chart3/>
          </div>

        </div>

      </Page>

    </PageWrapper>
  )
}

export default Index