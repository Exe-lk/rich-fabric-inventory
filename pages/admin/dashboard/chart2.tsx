import React, { FC, useEffect, useState } from 'react';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import Button, { ButtonGroup } from '../../../components/bootstrap/Button';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Select from '../../../components/bootstrap/forms/Select';
import axios from 'axios';
import {app} from '../../../firebaseConfig';
import { getDatabase, ref, onValue } from "firebase/database";
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';


interface ICommonUpcomingEventsProps {
	isFluid?: boolean;
}

const CommonUpcomingEvents: FC<ICommonUpcomingEventsProps> = ({ isFluid }) => {


	const [role, setRole] = useState<any>(0);
	const [data, setData] = useState<any[]>([]);

	//get database data
	useEffect(() => {
		const fetchData = async () => {
		  try {
			const db =getDatabase(app);
			const starCountRef =ref(db,'chart2');
			onValue(starCountRef, (snapshot) => {
			  const data = snapshot.val()
			  const chart = Object.keys(data).map(key => data[key]);
			
			const data1=chart[role]
			if(data1){
				const dataset=Object.keys(data1).map(key => data1[key]);
				
				setData(dataset)
			}
			else{
				setData([])
			}
			
			});
			
		  } catch (error) {
			console.error('Error fetching data:', error);
		  }
		};
	
		fetchData();
	}, [role]);

	return (
		<>
			<Card stretch={isFluid}>
				<CardHeader borderSize={1}>
					<CardLabel icon='BarChart' iconColor='warning'>
						<CardTitle>Telescope Vs User</CardTitle>
					</CardLabel>
					<CardActions>
						<FormGroup id='role' onChange={(e: any) => { setRole(e.target.value) }} className='col-md-12'>
							<Select
								ariaLabel='State'
								list={[
									{ value:0, text: 'January' },
									{ value: 1, text: 'February' },
									{ value: 2, text: 'March' },
									{ value:3, text: 'April' },
									{ value: 4, text: 'May' },
									{ value:5, text: 'June' },
									{ value: 6, text: 'July' },
									{ value: 7, text: 'August' },
									{ value:8, text: 'September' },
									{ value: 9, text: 'October' },
									{ value:10, text: 'November' },
									{ value: 11, text: 'December' }
								]}
								value={role}
							/>
						</FormGroup>
					</CardActions>
				</CardHeader>
				<CardBody className='table-responsive' isScrollable={isFluid}>
					<>
						<ResponsiveContainer width="100%" height={400}>
							<LineChart width={600} height={300} data={data}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis />
								<Tooltip contentStyle={{ backgroundColor: "#1E2027", border: "0", borderRadius: 5 }} />
								<Legend />
								<Line type="monotone" dataKey="user" stroke="#8884d8" />
								<Line type="monotone" dataKey="telescope" stroke="#82ca9d" />
							</LineChart>
						</ResponsiveContainer>
					</>
				</CardBody>

			</Card>
		</>
	);
};

export default CommonUpcomingEvents;
