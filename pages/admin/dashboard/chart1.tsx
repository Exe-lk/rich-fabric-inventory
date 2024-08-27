import React, { FC, useEffect, useState } from 'react';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {app} from '../../../firebaseConfig';
import { getDatabase, ref, onValue } from "firebase/database";


interface ICommonUpcomingEventsProps {
	isFluid?: boolean;
}
const CommonUpcomingEvents: FC<ICommonUpcomingEventsProps> = ({ isFluid }) => {

	const [revenue, setRevenue] = useState<any[]>([])
// //fetch data
	useEffect(() => {
		const fetchData = async () => {
		  try {
			const db = getDatabase(app);
			const starCountRef = ref(db, 'chart');
			onValue(starCountRef, (snapshot) => {
			  const data = snapshot.val();
			  const chart1 = Object.keys(data).map(key => data[key]);
			

			 setRevenue(chart1)
			});
			
		  } catch (error) {
			console.error('Error fetching data:', error);
		  }
		};
	
		fetchData();
	  }, []);

	return (
		<>
			<Card stretch={isFluid}>
				<CardHeader borderSize={1}>
					<CardLabel icon='BarChart' iconColor='warning'>
						<CardTitle>Revenue</CardTitle>
					</CardLabel>
				</CardHeader>
				<CardBody className='table-responsive' isScrollable={isFluid}>
					<>
						<ResponsiveContainer width="100%" height={400}>
							<BarChart data={revenue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="month" />
								<YAxis />
								<Tooltip contentStyle={{ backgroundColor: "#1E2027", border: "0", borderRadius: 5 }} />
								<Legend />
								<Bar dataKey="Revenue" fill="rgba(75,192,192,0.6)" name="Month" />
								<Line type="monotone" dataKey="" stroke="rgba(255, 206, 86, 1)" name="Difference" />
							</BarChart>
						</ResponsiveContainer>
					</>
				</CardBody>

			</Card>
		</>
	);
};

export default CommonUpcomingEvents;
