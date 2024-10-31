import React, { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import Page from '../../../layout/Page/Page';
import Card, { CardBody, CardTitle } from '../../../components/bootstrap/Card';
import { useGetSuppliersQuery } from '../../../redux/slices/supplierAPISlice';
import ExportDropdown from '../../../components/ExportDropdown';

const Index: NextPage = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const { data: supplier, error, isLoading } = useGetSuppliersQuery(undefined);

	return (
		<PageWrapper>
			<Head>
				<></>
			</Head>
			<SubHeader>
				<SubHeaderLeft>
					<label
						className='border-0 bg-transparent cursor-pointer me-0'
						htmlFor='searchInput'>
						<Icon icon='Search' size='2x' color='primary' />
					</label>
					<Input
						id='searchInput'
						type='search'
						className='border-0 shadow-none bg-transparent'
						placeholder='Search Supplier...'
						onChange={(event: any) => {
							setSearchTerm(event.target.value);
						}}
						value={searchTerm}
					/>
				</SubHeaderLeft>
				<SubHeaderRight>
					<SubheaderSeparator />
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						<Card stretch>
							<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info'>Supplier</div>
								<ExportDropdown
									tableSelector='table'
									title='Supplier Management Report'
								/>
							</CardTitle>
							<CardBody isScrollable className='table-responsive'>
							<table className='table table-hover table-bordered border-primary'>
									<thead className={'table-dark border-primary'}>
										<tr>
											<th>Supplier name</th>
											<th>Company name</th>
											<th>Company email</th>
											<th>Phone number</th>
											<th>Supplier email</th>
										</tr>
									</thead>
									<tbody>
										{isLoading && (
											<tr>
												<td>Loading...</td>
											</tr>
										)}
										{error && (
											<tr>
												<td>Error fetching categories.</td>
											</tr>
										)}
										{supplier &&
											supplier
												.filter((supplier: any) =>
													searchTerm
														? supplier.name
																.toLowerCase()
																.includes(searchTerm.toLowerCase())
														: true,
												)
												.map((supplier: any) => (
													<tr key={supplier.id}>
														<td>{supplier.name}</td>
														<td>{supplier.company_name}</td>
														<td>{supplier.company_email}</td>
														<td>{supplier.phone}</td>
														<td>{supplier.email}</td>
													</tr>
												))}
									</tbody>
								</table>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};
export default Index;
