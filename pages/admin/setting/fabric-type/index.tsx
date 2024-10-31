import React, { useState } from 'react';
import type { NextPage } from 'next';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Page from '../../../../layout/Page/Page';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../../layout/SubHeader/SubHeader';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/bootstrap/forms/Input';
import Button from '../../../../components/bootstrap/Button';
import Card, { CardBody, CardTitle } from '../../../../components/bootstrap/Card';
import CategoryAddModal from '../../../../components/custom/FabricAddModal';
import CategoryEditModal from '../../../../components/custom/FabricEditModal';
import Swal from 'sweetalert2';
import {
	useUpdateFabricMutation,
	useGetFabricsQuery,
} from '../../../../redux/slices/fabricApiSlice';

const Index: NextPage = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [addModalStatus, setAddModalStatus] = useState<boolean>(false);
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false);
	const [id, setId] = useState<string>('');
	const { data: fabric, error, isLoading } = useGetFabricsQuery(undefined);
	const [updatefabric] = useUpdateFabricMutation();

	const handleClickDelete = async (fabric: any) => {
		try {
			const result = await Swal.fire({
				title: 'Are you sure?',
				text: 'You will not be able to recover this fabric!',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, delete it!',
			});
			if (result.isConfirmed) {
				try {
					const values = await {
						...fabric,
						status: false,
					};
					await updatefabric(values);
					Swal.fire('Deleted!', 'The fabric has been deleted.', 'success');
				} catch (error) {
					console.error('Error during deleting: ', error);
					Swal.close;
				}
			}
		} catch (error) {
			Swal.fire('Error', 'Failed to delete fabric.', 'error');
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
					<Button icon='Restore' color='success' onClick={() => setAddModalStatus(true)}>
						Add Fabric
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						<Card stretch>
							<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info'>
									Fabric Management
								</div>
							</CardTitle>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-hover table-bordered border-primary'>
									<thead className={'table-dark border-primary'}>
										<tr>
											<th>Fabric Name</th>
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
										{fabric &&
											fabric
												.filter((fabric: any) =>
													searchTerm
														? fabric.name
																.toLowerCase()
																.includes(searchTerm.toLowerCase())
														: true,
												)
												.map((fabric: any) => (
													<tr key={fabric.id}>
														<td>{fabric.name}</td>
														<td>
															<Button
																icon='Edit'
																color='info'
																onClick={() => (
																	setEditModalStatus(true),
																	setId(fabric.id)
																)}>
																Edit
															</Button>
															<Button
																className='m-2'
																icon='Delete'
																color='danger'
																onClick={() =>
																	handleClickDelete(fabric)
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
			<CategoryAddModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id='' />
			<CategoryEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id={id} />
		</PageWrapper>
	);
};
export default Index;
