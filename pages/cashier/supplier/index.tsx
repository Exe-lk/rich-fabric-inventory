import React, { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import useDarkMode from '../../../hooks/useDarkMode';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Page from '../../../layout/Page/Page';
import Card, { CardBody, CardTitle } from '../../../components/bootstrap/Card';
import SellerAddModal from '../../../components/custom/SellerAddModal';
import SellerEditModal from '../../../components/custom/SellerEditModal';
import Swal from 'sweetalert2';
import SellerDeleteModal from '../../../components/custom/SellerDeleteModal';
import {
	useUpdateSupplierMutation,
	useGetSuppliersQuery,
} from '../../../redux/slices/supplierAPISlice';
import ExportDropdown from '../../../components/ExportDropdown';

const Index: NextPage = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [addModalStatus, setAddModalStatus] = useState<boolean>(false);
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false);
	const [id, setId] = useState<string>('');
	const [deleteModalStatus, setDeleteModalStatus] = useState<boolean>(false);
	const { data: supplier, error, isLoading } = useGetSuppliersQuery(undefined);
	const [updatesupplier] = useUpdateSupplierMutation();

	const handleClickDelete = async (item: any) => {
		try {
			const result = await Swal.fire({
				title: 'Are you sure?',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, delete it!',
			});
			if (result.isConfirmed) {
				try {
					const values = await {
						...item,
						status: false,
					};
					await updatesupplier(values);
					Swal.fire('Deleted!', 'The supplier has been deleted.', 'success');
				} catch (error) {
					console.error('Error during deleting: ', error);
					Swal.close;
					alert('An error occurred during file upload. Please try again later.');
				}
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete seller.', 'error');
		}
	};

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
					<Button
						icon='AddCircleOutline'
						color='success'
						isLight
						onClick={() => setAddModalStatus(true)}>
						Add Supplier
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						<Card stretch>
							<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info'>
									Manage Supplier
								</div>
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
											<th></th>
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
														<td>
															<Button
																icon='Edit'
																color='info'
																onClick={() => (
																	setEditModalStatus(true),
																	setId(supplier.id)
																)}>
																Edit
															</Button>
															<Button
																className='m-2'
																icon='Delete'
																color='danger'
																onClick={() =>
																	handleClickDelete(supplier)
																}>
																Delete
															</Button>
														</td>
													</tr>
												))}
									</tbody>
								</table>
								<Button
									icon='Delete'
									className='mb-5'
									onClick={() => setDeleteModalStatus(true)}>
									Recycle Bin
								</Button>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
			<SellerAddModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id='' />
			<SellerEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id={id} />
			<SellerDeleteModal setIsOpen={setDeleteModalStatus} isOpen={deleteModalStatus} id='' />
		</PageWrapper>
	);
};
export default Index;
