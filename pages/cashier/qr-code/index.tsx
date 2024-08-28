import React from 'react';
import type { NextPage } from 'next';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody, CardTitle } from '../../../components/bootstrap/Card';
// import QRCode  from 'qrcode.react';
import Qr from '../../../assets/img/QR.png'
const Index: NextPage = () => {

	const data = {
		email: "abc@gmail.com",
		password: "123456"
	}

	// Create a string to encode in the QR code
	const qrData = `Email: ${data.email}, Password: ${data.password}`;

	// JSX for rendering the page
	return (
		<PageWrapper>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						{/* Card for displaying QR code */}
						<Card stretch>
							<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info'>QR Code</div>
							</CardTitle>

							<CardBody isScrollable className='table-responsive'>
								<div className='d-flex justify-content-center'>
									{/* Render QR code here */}
									{/* <QRCode value={qrData} size={200} /> */}
									<img src={Qr}/>

								</div>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Index;
