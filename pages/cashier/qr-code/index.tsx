import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody, CardTitle } from '../../../components/bootstrap/Card';
import QRCode from 'react-qr-code';

const Index: NextPage = () => {
	const [email, setEmail] = useState<any>('');
	const [password, setPassword] = useState<any>('');
	
	useEffect(() => {
		const storedEmail = localStorage.getItem('email');
		const storedPassword = localStorage.getItem('password');
		if (storedEmail && storedPassword) {
			setEmail(storedEmail);
			setPassword(storedPassword);
		} else {
		}
	}, []);

	const qrData = `email: ${email}, password: ${password}`;

	return (
		<PageWrapper>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						<Card stretch>
							<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info'>
									Scan to Login
								</div>
							</CardTitle>
							<CardBody isScrollable className='table-responsive'>
								<div className='d-flex justify-content-center'>
									<div
										style={{
											padding: '16px',
											backgroundColor: '#ffffff',
											display: 'inline-block',
										}}>
										<QRCode
											value={qrData}
											size={256}
											bgColor='#ffffff'
											fgColor='#000000'
											level='Q'
										/>
									</div>
								</div>
								<p>
									How it works:
									<br />
									Open your mobile device's camera or a QR code scanner app.
									<br />
									Point the camera at the QR code on this page.
									<br />
									Once the code is recognized, you’ll be redirected to the login
									page where your identity is automatically confirmed.
									<br />
									For any issues, please ensure:
									<br />
									<br />
									Your device's camera is functioning properly.
									<br />
									You have a stable internet connection.
									<br />
									This feature adds an extra layer of security and convenience by
									eliminating the need for manual input. Happy working!
									<br />
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
