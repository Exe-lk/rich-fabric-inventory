import React, { useState } from 'react';
import type { NextPage } from 'next';
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
import UserAddModal from '../../../components/custom/UserAddModal';
import UserEditModal from '../../../components/custom/UserEditModal';
import Dropdown, { DropdownToggle, DropdownMenu } from '../../../components/bootstrap/Dropdown';
import Swal from 'sweetalert2';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import SellerDeleteModal from '../../../components/custom/UserDeleteModal';
import {
	useGetUsersQuery,
	useUpdateUserMutation,
} from '../../../redux/slices/userManagementApiSlice';

const Index: NextPage = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [addModalStatus, setAddModalStatus] = useState<boolean>(false);
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false);
	const [deleteModalStatus, setDeleteModalStatus] = useState<boolean>(false);
	const [id, setId] = useState<string>('');
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
	const role = [{ role: 'employee' }, { role: 'cashier' }];
	const { data: users, error, isLoading, refetch } = useGetUsersQuery(undefined);
	const [updateuser] = useUpdateUserMutation();

	// Update the user's status to false instead of deleting
	const handleClickDelete = async (user: any) => {
		try {
			const result = await Swal.fire({
				title: 'Are you sure?',
				text: 'You will not be able to recover this user!',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, delete it!',
			});
			if (result.isConfirmed) {
				try {
					const values = await {
						...user,
						status: false,
					};
					await updateuser(values);
					Swal.fire('Deleted!', 'User has been deleted.', 'success');
				} catch (error) {
					console.error('Error during handleDelete: ', error);
					Swal.fire(
						'Error',
						'An error occurred during deletion. Please try again later.',
						'error',
					);
				}
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete user.', 'error');
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
					<Dropdown>
						<DropdownToggle hasIcon={false}>
							<Button
								icon='FilterAlt'
								color='dark'
								isLight
								className='btn-only-icon position-relative'></Button>
						</DropdownToggle>
						<DropdownMenu isAlignmentEnd size='lg'>
							<div className='container py-2'>
								<div className='row g-3'>
									<FormGroup label='User type' className='col-12'>
										<ChecksGroup>
											{role.map((user, index) => (
												<Checks
													key={user.role}
													id={user.role}
													label={user.role}
													name={user.role}
													value={user.role}
													checked={selectedUsers.includes(user.role)}
													onChange={(event: any) => {
														const { checked, value } = event.target;
														setSelectedUsers((prevUsers) =>
															checked
																? [...prevUsers, value]
																: prevUsers.filter(
																		(user) => user !== value,
																  ),
														);
													}}
												/>
											))}
										</ChecksGroup>
									</FormGroup>
								</div>
							</div>
						</DropdownMenu>
					</Dropdown>

					<SubheaderSeparator />
					<Button
						icon='PersonAdd'
						color='success'
						isLight
						onClick={() => setAddModalStatus(true)}>
						New Employee
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						<Card stretch>
							<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info'>
									Employee Management
								</div>
							</CardTitle>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-hover table-bordered border-primary'>
									<thead className={'table-dark border-primary'}>
										<tr>
											<th>User</th>
											<th>Email</th>
											<th>Mobile number</th>
											<th>NIC</th>
											<th>Role</th>
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
												<td>Error fetching users.</td>
											</tr>
										)}
										{users &&
											users
												.filter((user: any) => user.status === true)
												.filter((user: any) =>
													searchTerm
														? user.nic
																.toLowerCase()
																.includes(searchTerm.toLowerCase())
														: true,
												)
												.filter((user: any) =>
													selectedUsers.length > 0
														? selectedUsers.includes(user.role)
														: true,
												)
												.map((user: any) => (
													<tr key={user.id}>
														<td>{user.name}</td>
														<td>{user.email}</td>
														<td>{user.mobile}</td>
														<td>{user.nic}</td>
														<td>{user.role}</td>
														<td>
															<Button
																icon='Edit'
																color='info'
																onClick={() => {
																	setEditModalStatus(true);
																	setId(user.id);
																}}>
																Edit
															</Button>
															<Button
																className='m-2'
																icon='Delete'
																color='danger'
																onClick={() =>
																	handleClickDelete(user)
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
			<UserAddModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id='' />
			<UserEditModal
				setIsOpen={setEditModalStatus}
				isOpen={editModalStatus}
				id={id}
				refetch={refetch}
			/>
			<SellerDeleteModal setIsOpen={setDeleteModalStatus} isOpen={deleteModalStatus} id='' />
		</PageWrapper>
	);
};
export default Index;
