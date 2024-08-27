import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPagesMenu } from '../../../menu';
import Page from '../../../layout/Page/Page';
import Chart1 from "./chart1"
import Chart2 from "./chart2"
import Telescope from './telescope'
import Revenue from './revenue';
import Supply from './SupplyPredict'
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
            <Chart1 />
          </div>
          <div className='col-3'>
            
            <Supply />
          </div>
          <div className='col-xxl-3'>
            <Telescope />
            <Revenue />
          </div>
          <div className='col-9'>
            <Chart2 />
            <Chart3/>
          </div>

        </div>

      </Page>

    </PageWrapper>
  )
}

export default Index