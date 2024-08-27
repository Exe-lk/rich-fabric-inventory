import React from 'react';
import AdminHeader from '../pages/_layout/_headers/AdminHeader';
import OfficeHeader from '../pages/_layout/_headers/OfficeHeader';
import StockHeader from '../pages/_layout/_headers/StockHeader';
import ViewHeader from '../pages/_layout/_headers/ViewHeader';

const headers = [
	{
		path: `/admin/*`,
		element: <AdminHeader />,
	},
	{
		path: `/production-coordinator/*`,
		element: <OfficeHeader />,
	},

	{
		path: `/stock-keeper/*`,
		element: <StockHeader />,
	},
	{
		path: `/viewer/*`,
		element: <ViewHeader />,
	},
];

export default headers;
