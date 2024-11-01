import React, { useState } from 'react';
import type { NextPage } from 'next';
import PageWrapper from '../../../../../layout/PageWrapper/PageWrapper';
import Page from '../../../../../layout/Page/Page';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../../../layout/SubHeader/SubHeader';
import Icon from '../../../../../components/icon/Icon';
import Input from '../../../../../components/bootstrap/forms/Input';
import Button from '../../../../../components/bootstrap/Button';
import Card, { CardBody } from '../../../../../components/bootstrap/Card';
import Swal from 'sweetalert2';
import {
	useDeleteColorMutation,
	useGetDeletedColorsQuery,
	useUpdateColorMutation,
} from '../../../../../redux/slices/colorApiSlice';

const Index: NextPage = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const { data: data, error, isLoading } = useGetDeletedColorsQuery(undefined);
	const [updatedata] = useUpdateColorMutation();
	const [deletedata] = useDeleteColorMutation();
	const { refetch } = useGetDeletedColorsQuery(undefined);

	const handleClickDelete = async (data: any) => {
		try {
			const { value: inputText } = await Swal.fire({
				title: 'Are you sure?',
				text: 'Please type "DELETE" to confirm ',
				input: 'text',
				icon: 'warning',
				inputValidator: (value) => {
					if (value !== 'DELETE') {
						return 'You need to type "DELETE" to confirm!';
					}
				},
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, delete it!',
			});
			if (inputText === 'DELETE') {
				await deletedata(data.id).unwrap();
				Swal.fire('Deleted!', 'The data has been deleted.', 'success');
				refetch();
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete data.', 'error');
		}
	};

	const handleClickRestore = async (data: any) => {
		try {
			const result = await Swal.fire({
				title: 'Are you sure?',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, Restore it!',
			});
			if (result.isConfirmed) {
				const values = await {
					...data,
					status: true,
				};
				await updatedata(values);
				Swal.fire('Restored!', 'The data has been restored.', 'success');
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete data.', 'error');
		}
	};

	const handleDeleteAll = async () => {
		if (data?.length == 0) {
			return;
		}
		try {
			const { value: inputText } = await Swal.fire({
				title: 'Are you sure?',
				text: 'Please type "DELETE ALL" to confirm deleting all data',
				input: 'text',
				icon: 'warning',
				inputValidator: (value) => {
					if (value !== 'DELETE ALL') {
						return 'You need to type "DELETE ALL" to confirm!';
					}
				},
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, delete all!',
			});
			if (inputText === 'DELETE ALL') {
				for (const datas of data) {
					await deletedata(datas.id).unwrap();
				}
				Swal.fire('Deleted!', 'All data have been deleted.', 'success');
				refetch();
			}
		} catch (error) {
			console.error('Error deleting all categories:', error);
			Swal.fire('Error', 'Failed to delete all data.', 'error');
		}
	};

	// Handle restore all categories
	const handleRestoreAll = async () => {
		if (data?.length == 0) {
			return;
		}
		try {
			const result = await Swal.fire({
				title: 'Are you sure?',
				text: 'This will restore all data',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, restore all!',
			});
			if (result.isConfirmed) {
				for (const datas of data) {
					const values = {
						...datas,
						status: true,
					};
					await updatedata(values).unwrap();
				}
				Swal.fire('Restored!', 'All data have been restored.', 'success');
				refetch();
			}
		} catch (error) {
			console.error('Error restoring all categories:', error);
			Swal.fire('Error', 'Failed to restore all data.', 'error');
		}
	};

	return (
		<PageWrapper>
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
						placeholder='Search...'
						onChange={(event: any) => {
							setSearchTerm(event.target.value);
						}}
						value={searchTerm}
					/>
				</SubHeaderLeft>
				<SubHeaderRight>
					<SubheaderSeparator />
					<Button icon='Delete' onClick={handleDeleteAll} color='danger' isLight>
						Delete All
					</Button>
					<Button
						icon='Restore'
						className='ms-3'
						onClick={handleRestoreAll}
						color='primary'>
						Restore All
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						<Card stretch>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-hover table-bordered border-primary'>
									<thead className={'table-dark border-primary'}>
										<tr>
											<th>Color Name</th>
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
										{data &&
											data
												.filter((data: any) =>
													searchTerm
														? data.name
																.toLowerCase()
																.includes(searchTerm.toLowerCase())
														: true,
												)
												.map((data: any) => (
													<tr key={data.id}>
														<td>{data.name}</td>
														<td>
															<Button
																icon='Restore'
																tag='a'
																color='info'
																onClick={() =>
																	handleClickRestore(data)
																}>
																Restore
															</Button>
															<Button
																className='m-2'
																icon='Delete'
																color='danger'
																onClick={() =>
																	handleClickDelete(data)
																}>
																Delete
															</Button>
														</td>
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
