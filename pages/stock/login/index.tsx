import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import classNames from 'classnames';
import Link from 'next/link';
import PropTypes from 'prop-types';
import AuthContext from '../../../context/authContext';
import useDarkMode from '../../../hooks/useDarkMode';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Swal from 'sweetalert2';
import Logo from '../../../components/Logo';
import { useAddUserMutation } from '../../../redux/slices/userApiSlice';

import { Scanner } from '@yudiel/react-qr-scanner';
interface ILoginHeaderProps {
	isNewUser?: boolean;
}
const LoginHeader: FC<ILoginHeaderProps> = () => {
	return (
		<>
			<div className='text-center h1 fw-bold mt-5'>Welcome,</div>
			<div className='text-center h4 text-muted mb-5'>Scan QR to continue!</div>
		</>
	);
};

interface User {
	password: string;
	email: string;
	position: string;
}

interface ILoginProps {
	isSignUp?: boolean;
}
const Login: NextPage<ILoginProps> = ({ isSignUp }) => {
	const router = useRouter();
	const { darkModeStatus } = useDarkMode();
	const [users, setUsers] = useState<User[]>([]);
	const { setUser } = useContext(AuthContext);
	const [addUser] = useAddUserMutation();
	const [data, setData] = useState('No result');

	const convertTextToJson = (text: any) => {
		// Ensure the input is a string
		if (typeof text !== 'string') {
			console.error('Expected a string but got:', typeof text);
			return {};
		}

		const result: { [key: string]: string } = {};

		// Split by comma to get each key-value pair
		const pairs = text.split(',');

		pairs.forEach((pair) => {
			// Split each pair by the colon to separate the key and the value
			const [key, value] = pair.split(':').map((str) => str.trim());

			if (key && value) {
				result[key] = value;
			}
		});

		return result;
	};
	const login = async (result: any) => {
		if (result[0].rawValue) {
			// Safely call the conversion function
			const jsonResult = convertTextToJson(result[0].rawValue);
			console.log(jsonResult);
			try {
				const response = await addUser(jsonResult).unwrap();
				const email = response.user.email;
				localStorage.setItem('email', email);
				console.log(response);
				if (response.user) {
					await Swal.fire({
						icon: 'success',
						title: 'Login Successful',
						text: 'You have successfully logged in!',
					});
					switch (response.user.position) {
						case 'Stock Keeper':
							router.push('/stock/stock-transaction');
							break;

						default:
							break;
					}
				} else {
					await Swal.fire({
						icon: 'error',
						title: 'Invalid Credentials',
						text: 'Username and password do not match. Please try again.',
					});
				}
			} catch (error) {
				console.error('Error occurred:', error);
				Swal.fire('Error', 'An unexpected error occurred', 'error');
			}
		} else {
			console.error('No text found in the QR result');
		}
	};

	return (
		<PageWrapper
			isProtected={false}
			// className={classNames({ 'bg-dark': !singUpStatus, 'bg-light': singUpStatus })}
		>
			<Head>
				<title> Login</title>
			</Head>
			<Page className='p-0'>
				<div className='row h-100 align-items-center justify-content-center'>
					<div className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container'>
						<Card className='shadow-3d-dark' data-tour='login-page'>
							<CardBody>
								<div className='text-center my-5'>
									<Link
										href='/'
										className={classNames(
											'text-decoration-none  fw-bold display-2',
											{
												'text-dark': !darkModeStatus,
												'text-light': darkModeStatus,
											},
										)}>
										<Logo width={200} />
									</Link>
								</div>

								<LoginHeader />
								{/* <QrReader
									onResult={(result: any, error: Error | null | undefined) => {
										if (!!result) {
											setData(result?.text);
											login(result);
										}

										if (!!error) {
											console.info(error);
										}
									}}
									constraints={{
										facingMode: 'environment', // 'user' for front camera
									}}
									// style={{ width: '100%' }}
								/> */}
								<Scanner
									onScan={(result) => login(result)}
									onError={(error) => console.error(error)}
									constraints={{ facingMode: 'environment' }} // Use the back camera
									// allowMultiple
									// styles={{ "width": '300px', height: '300px' }} // Set scanner size
								/>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};
Login.propTypes = {
	isSignUp: PropTypes.bool,
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		// @ts-ignore
		...(await serverSideTranslations(locale, ['common', 'menu'])),
	},
});

export default Login;
