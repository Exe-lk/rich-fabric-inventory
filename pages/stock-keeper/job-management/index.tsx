import React, { useEffect, useState } from 'react';
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
import StockAddModal from '../../../components/custom/JobAddModal';
import StockEditModal from '../../../components/custom/JobEditModal';
import { doc, deleteDoc, collection, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import Dropdown, { DropdownToggle, DropdownMenu } from '../../../components/bootstrap/Dropdown';
import { getColorNameWithIndex } from '../../../common/data/enumColors';
import { getFirstLetter } from '../../../helpers/helpers';
import Swal from 'sweetalert2';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import showNotification from '../../../components/extras/showNotification';
import JobDeleteModal from '../../../components/custom/JobDeleteModal';

// Define interfaces for data objects
interface Item {
	cid: string;
	category: number;
	image: string;
	name: string;
	price: number;
	quentity: number;
	reorderlevel: number;
}
interface Category {
	cid: string;
	categoryname: string;
}

const Index: NextPage = () => {
	const [deleteModalStatus, setDeleteModalStatus] = useState<boolean>(false);

	const { darkModeStatus } = useDarkMode(); // Dark mode
	const [searchTerm, setSearchTerm] = useState(''); // State for search term
	const [addModalStatus, setAddModalStatus] = useState<boolean>(false); // State for add modal status
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false); // State for edit modal status
	const [item, setItem] = useState<Item[]>([]); // State for stock data
	const [category, setcategory] = useState<Category[]>([]);
	const [orderData, setOrdersData] = useState([]);
	const [stockData, setStockData] = useState([]);
	const [id, setId] = useState<string>(''); // State for current stock item ID
	const [id1, setId1] = useState<string>('12356'); // State for new item ID
	const [status, setStatus] = useState(true);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [quantityDifference, setQuantityDifference] = useState([]);
	
	// Function to handle deletion of an item
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
					item.status = false;
					const docRef = doc(firestore, 'item', item.cid);
					// Update the data
					updateDoc(docRef, item)
						.then(() => {
							Swal.fire('Deleted!', 'item has been deleted.', 'success');
							if (status) {
								// Toggle status to trigger data refetch
								setStatus(false);
							} else {
								setStatus(true);
							}
						})
						.catch((error) => {
							console.error('Error adding document: ', error);

							alert(
								'An error occurred while adding the document. Please try again later.',
							);
						});
				} catch (error) {
					console.error('Error during handleUpload: ', error);
					Swal.close;
					alert('An error occurred during file upload. Please try again later.');
				}
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete employee.', 'error');
		}
	};
	// Return the JSX for rendering the page
	return (
		<PageWrapper>
			<SubHeader>
				<SubHeaderLeft>
					{/* Search input */}
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
									<FormGroup label='Category type' className='col-12'>
										<ChecksGroup>
											{category.map((category, index) => (
												<Checks
													key={category.categoryname}
													id={category.categoryname}
													label={category.categoryname}
													name={category.categoryname}
													value={category.categoryname}
													checked={selectedCategories.includes(
														category.categoryname,
													)}
													onChange={(event: any) => {
														const { checked, value } = event.target;
														setSelectedCategories(
															(prevCategories) =>
																checked
																	? [...prevCategories, value] // Add category if checked
																	: prevCategories.filter(
																			(category) =>
																				category !== value,
																	  ), // Remove category if unchecked
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
					{/* Button to open  New Item modal */}
					<Button
						icon='AddCircleOutline'
						color='success'
						isLight
						onClick={() => setAddModalStatus(true)}>
						New Job
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						{/* Table for displaying customer data */}
						<Card stretch>
						<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info'>Manage Job</div>
								<Button
									icon='UploadFile'
									color='warning'
									onClick={() => setAddModalStatus(true)}>
									Export
								</Button>
							</CardTitle>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-bordered border-primary table-modern table-hover'>
									<thead>
										<tr>
											<th>Job ID</th>
											<th>Client Name</th>
											<th>Description</th>

											<th></th>
											{/* <th><Button icon='PersonAdd' color='primary' isLight onClick={() => setAddModalStatus(true)}>
                        New Item
                      </Button></th> */}
										</tr>
									</thead>

									<tbody>
										<tr>
											<td>15368</td>
											<td>ABC company</td>
											<td>500 stock</td>
											
											<td>
												<Button
													
													icon='Edit'
													tag='a'
													color='info'
													onClick={() => setEditModalStatus(true)}>
													Edit
												</Button>
												<Button
													
													className='m-2'
													icon='Delete'
													color='danger'
													onClick={() => handleClickDelete(item)}>
													Delete
												</Button>
											</td>
										</tr>
										<tr>
										
										<td>15368</td>
											<td>ABC company</td>
											<td>500 stock</td>
											<td>
												<Button
													
													icon='Edit'
													tag='a'
													color='info'
													onClick={() => setEditModalStatus(true)}>
													Edit
												</Button>
												<Button
													
													className='m-2'
													icon='Delete'
													color='danger'
													onClick={() => handleClickDelete(item)}>
													Delete
												</Button>
											</td>
										</tr>
										
									</tbody>
								</table>
								<Button icon='Delete' className='mb-5'
								onClick={() => (
									setDeleteModalStatus(true)
									
								)}>
								Recycle Bin</Button> 
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
			<StockAddModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id={id1} />
			<JobDeleteModal setIsOpen={setDeleteModalStatus} isOpen={deleteModalStatus} id='' />

			<StockEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id={id} />
		</PageWrapper>
	);
};
export default Index;
