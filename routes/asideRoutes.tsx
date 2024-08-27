import React from 'react';
import dynamic from 'next/dynamic';
import { demoPagesMenu, pageLayoutTypesPagesMenu } from '../menu';


const AdminAside = dynamic(() => import('../pages/_layout/_asides/AdminAside'));
const OfficeAside = dynamic(() => import('../pages/_layout/_asides/OfficeAsider'));
const ViewAside = dynamic(() => import('../pages/_layout/_asides/ViewAside'));
const StockAside = dynamic(() => import('../pages/_layout/_asides/StockKeeperAsider'));



const asides = [
	
	{ path: '/admin/*', element: <AdminAside/>, exact: true },
	{ path: '/production-coordinator/*', element: <OfficeAside/>, exact: true },
	{ path: '/stock-keeper/*', element: <StockAside/>, exact: true },
	{ path: '/viewer/*', element: <ViewAside/>, exact: true },

];

export default asides;
