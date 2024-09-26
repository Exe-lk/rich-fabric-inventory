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
import StockAddModal from '../../../components/custom/ItemAddModal';
import StockEditModal from '../../../components/custom/ItemEditModal';
import Dropdown, { DropdownToggle, DropdownMenu } from '../../../components/bootstrap/Dropdown';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import { useGetStockOutsQuery } from '../../../redux/slices/stockOutApiSlice';

// Define interfaces for data objects
interface Item {
	cid: string;
	category: number;
	image: string;
	name: string;
	price: number;
	quantity: number;
	reorderlevel: number;
}
interface Category {
	cid: string;
	categoryname: string;
}
interface stock {
	quantity: number;
	item_id: string;
}
const Index: NextPage = () => {
	const { darkModeStatus } = useDarkMode(); // Dark mode
	const [searchTerm, setSearchTerm] = useState(''); // State for search term
	const [addModalStatus, setAddModalStatus] = useState<boolean>(false); // State for add modal status
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false); // State for edit modal status
	const [id, setId] = useState<string>(''); // State for current stock item ID
	const [id1, setId1] = useState<string>('12356'); // State for new item ID
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const { data: transaction, error, isLoading } = useGetStockOutsQuery(undefined);
	console.log(transaction);
	const position = [
		{ position: 'Gray Fabric' },
		{ position: 'Finish Fabric' },
		{ position: 'Gray collor cuff' },
		{ position: 'Finish collor cuff' },
		{ position: 'Yarn' },
	];
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
					<SubheaderSeparator />

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
									<FormGroup label='Transaction type' className='col-12'>
										<ChecksGroup>
											{position.map((category, index) => (
												<Checks
													key={category.position}
													id={category.position}
													label={category.position}
													name={category.position}
													value={category.position}
													checked={selectedCategories.includes(
														category.position,
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
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						{/* Table for displaying customer data */}
						<Card stretch>
							<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<FormGroup id='code' className='col-md-3'>
									<Input
										type='date'
										// onChange={formik.handleChange}
										// value={formik.values.code}
										// onBlur={formik.handleBlur}
										// isValid={formik.isValid}
										// isTouched={formik.touched.code}
										// invalidFeedback={formik.errors.code}
										validFeedback='Looks good!'
									/>
								</FormGroup>
								<div className='flex-grow-1 text-center text-info'>
									Transaction Report
								</div>
								<Button
									icon='UploadFile'
									color='warning'
									onClick={() => setAddModalStatus(true)}>
									Export
								</Button>
							</CardTitle>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-modern table-bordered border-primary table-hover '>
									<thead>
										<tr>
											<th>
												<Checks
													type='checkbox'
													id='Code'
													name='type'
													label='Code'
													value='Code'
												/>
											</th>
											<th>
												<Checks
													type='checkbox'
													id='GRN number'
													name='type'
													label='GRN number'
													value='GRN number'
												/>
											</th>
											<th>
												<Checks
													type='checkbox'
													id='Dater'
													name='type'
													label='Date'
													value='Date'
												/>
											</th>
											<th>
												<Checks
													type='checkbox'
													id='colour'
													name='type'
													label='Quantity'
													value='Colour'
												/>
											</th>
											<th>
												<Checks
													type='checkbox'
													id='Type'
													name='type'
													label='Stock Out Type'
													value='Type'
												/>{' '}
											</th>
											<th>
												<Checks
													type='checkbox'
													id='colour'
													name='type'
													label='Price (Rs.)'
													value='Colour'
												/>
											</th>
											<th>
												<Checks
													type='checkbox'
													id='Category'
													name='type'
													label='Category'
													value='Category'
												/>
											</th>
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
										{transaction &&
											transaction
												.filter((transaction: any) =>
													searchTerm
														? transaction.code
																.toLowerCase()
																.includes(searchTerm.toLowerCase())
														: true,
												)
												.map((transaction: any) => {
													// Determine the appropriate Bootstrap text color class based on order_type
													let textColorClass = '';
													if (transaction.stock_received == 'Customer') {
														textColorClass = 'text-warning';
													} else if (
														transaction.stock_received ===
														'Yarn Transaction'
													) {
														textColorClass = 'text-danger';
													} else if (
														transaction.stock_received === 'Dye Plant'
													) {
														textColorClass = 'text-success';
													}

													return (
														<tr
															key={transaction.id}
															className={textColorClass}>
															<td className={textColorClass}>
																{transaction.code}
															</td>
															<td className={textColorClass}>
																{transaction.GRN_number}
															</td>
															<td className={textColorClass}>
																{transaction.date} -{' '}
																{transaction.time}
															</td>
															<td className={textColorClass}>
																{transaction.quentity}
															</td>
															<td className={textColorClass}>
																{transaction.stock_received}
															</td>
															<td className={textColorClass}>
																{transaction.price}
															</td>
															<td className={textColorClass}>
																{transaction.category ||
																	transaction.type}
															</td>
														</tr>
													);
												})}
									</tbody>
								</table>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
			<StockAddModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id={id1} />
			<StockEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id={id} />
		</PageWrapper>
	);
};
export default Index;
