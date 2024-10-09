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

import Additem from '../../../components/add-item-mobile';
import Edit from '../../../components/edit-item';
interface ILoginHeaderProps {
	isNewUser?: boolean;
}

interface ILoginProps {
	isSignUp?: boolean;
}
const Login: NextPage<ILoginProps> = ({ isSignUp }) => {
	const router = useRouter();
	const [orderedItems, setOrderedItems] = useState<any>([]);
	const [status, setStatus] = useState<any>(true);
	const [activeComponent, setActiveComponent] = useState<'additem' | 'edit'>('additem');
	const { darkModeStatus } = useDarkMode();
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
								{status ? (




									<Additem
									
										
										isActive={activeComponent === 'additem'}
										setActiveComponent={setActiveComponent}
									/>
								) : (
									<Edit
									
									
										isActive={activeComponent === 'edit'}
										setActiveComponent={setActiveComponent}
									/>
								)}

								{status ? (
									<Button
										onClick={() => {
											setStatus(false);
										}}>
										Stock Movement
									</Button>
								) : (
									<Button
										onClick={() => {
											setStatus(true);
										}}>
										Stock Add
									</Button>
								)}
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
