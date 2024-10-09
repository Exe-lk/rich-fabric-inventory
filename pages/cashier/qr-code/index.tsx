import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody, CardTitle } from '../../../components/bootstrap/Card';
import QRCode from 'react-qr-code';
import Qr from '../../../assets/img/QR.png';
import { useRouter } from 'next/router';
const Index: NextPage = () => {
	const router = useRouter();
	const [email, setEmail] = useState<any>('');
	const [password, setPassword] = useState<any>('');
	useEffect(() => {
		// Retrieve data from localStorage when the component mounts
		const storedEmail = localStorage.getItem('email');
		const storedPassword = localStorage.getItem('password');
		if (storedEmail && storedPassword) {
			setEmail(storedEmail);
			setPassword(storedPassword);
		} else {
			// router.push('/');
		}
	}, []);
	const data = {
		email: 'achinthawijethunga@gmail.com',
		password: '200133701291',
	};
	// Create a string to encode in the QR code
	const qrData = `email: ${email}, password: ${password}`;

	// JSX for rendering the page
	return (
		<PageWrapper>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						{/* Card for displaying QR code */}
						<Card stretch>
							<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info'>Scan to Login</div>
							</CardTitle>

							<CardBody isScrollable className='table-responsive'>
								<div className='d-flex justify-content-center'>
												{/* Render QR code here */}
												<div
										style={{
											padding: '16px', // Adjust the padding for the border thickness
											backgroundColor: '#ffffff', // Border color (white)
											display: 'inline-block', // Keep it wrapped tightly around the QR code
										}}>
										<QRCode
											value={qrData}
											size={256} // Size of the QR code
											bgColor='#ffffff' // Background color inside the QR code
											fgColor='#000000' // Foreground color for the QR code
											level='Q'
										/>
									</div>

								</div>

								<p>How it works:<br/>

Open your mobile device's camera or a QR code scanner app.<br/>
Point the camera at the QR code on this page.<br/>
Once the code is recognized, you’ll be redirected to the login page where your identity is automatically confirmed.<br/>
For any issues, please ensure:<br/><br/>

Your device's camera is functioning properly.<br/>
You have a stable internet connection.<br/>
This feature adds an extra layer of security and convenience by eliminating the need for manual input. Happy working!<br/>

</p>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Index;
