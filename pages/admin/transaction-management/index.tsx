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
import { useGetLotsQuery } from '../../../redux/slices/stockInAPISlice';

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
	const [selectedStockOutTypes, setSelectedStockOutTypes] = useState<string[]>([]); // New state for StockOutType filter
	const { data: transaction, error, isLoading } = useGetStockOutsQuery(undefined);
	const { data: lot } = useGetLotsQuery(undefined);
	const [startDate, setStartDate] = useState<string>(''); // State for start date
	const [endDate, setEndDate] = useState<string>(''); // State for end date
	const [selectedOption, setSelectedOption] = useState<string>('Transaction Report');

	const position = [
		{ position: 'Gray Fabric' },
		{ position: 'Finish Fabric' },
		{ position: 'Gray collor cuff' },
		{ position: 'Finish collor cuff' },
		{ position: 'Yarn' },
		{ position: 'Other' },
	];

	const StockOutType = [
		{ position: 'Yarn Transaction' },
		{ position: 'Customer' },
		{ position: 'Dye Plant' },
	];
	// Filter transactions based on date range
	const filteredTransactions = transaction?.filter((trans: any) => {
		const transactionDate = new Date(trans.date);
		const start = startDate ? new Date(startDate) : null;
		const end = endDate ? new Date(endDate) : null;

		// Check if transaction date is within the selected range
		if (start && end) {
			return transactionDate >= start && transactionDate <= end;
		} else if (start) {
			return transactionDate >= start;
		} else if (end) {
			return transactionDate <= end;
		}
		return true;
	});
	const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedOption(event.target.value);
	};

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
									{/* Date Range Filters */}
									<FormGroup label='Start Date' className='col-6'>
										<Input
											type='date'
											onChange={(e: any) => setStartDate(e.target.value)}
											value={startDate}
										/>
									</FormGroup>
									<FormGroup label='End Date' className='col-6'>
										<Input
											type='date'
											onChange={(e: any) => setEndDate(e.target.value)}
											value={endDate}
										/>
									</FormGroup>

									{/* Stock Out Type Filter */}
									<FormGroup label='Stock Out Type' className='col-12'>
										<ChecksGroup>
											{StockOutType.map((type, index) => (
												<Checks
													key={type.position}
													id={type.position}
													label={type.position}
													name={type.position}
													value={type.position}
													checked={selectedStockOutTypes.includes(
														type.position,
													)}
													onChange={(event: any) => {
														const { checked, value } = event.target;
														setSelectedStockOutTypes((prevTypes) =>
															checked
																? [...prevTypes, value]
																: prevTypes.filter(
																		(type) => type !== value,
																  ),
														);
													}}
												/>
											))}
										</ChecksGroup>
									</FormGroup>

									{/* Category Filter */}
									<FormGroup label='Category' className='col-12'>
										<ChecksGroup>
											{position.map((category: any, index) => (
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
														setSelectedCategories((prevCategories) =>
															checked
																? [...prevCategories, value]
																: prevCategories.filter(
																		(category) =>
																			category !== value,
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
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						{/* Table for displaying customer data */}
						<Card stretch>
							<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								{/* <div className='flex-grow-1  text-info'>Transaction Report</div> */}
								<FormGroup id='membershipDate' className='col-10'>
									<ChecksGroup isInline>
										<Checks
											type='radio'
											id='Transaction Report'
											label='Transaction Report'
											name='type'
											value='Transaction Report'
											onChange={handleOptionChange}
											checked={selectedOption}
										/>
										<Checks
											type='radio'
											id='GRN Report'
											label='GRN Report'
											name='type'
											value='GRN Report'
											onChange={handleOptionChange}
											checked={selectedOption}
										/>
										<Checks
											type='radio'
											id='Transfer Note Report'
											label='Transfer Note Report'
											name='type'
											value='Transfer Note Report'
											onChange={handleOptionChange}
											checked={selectedOption}
										/>
										<Checks
											type='radio'
											id='Grey Fabric Report'
											label='Grey Fabric Report'
											name='type'
											value='Grey Fabric Report'
											onChange={handleOptionChange}
											checked={selectedOption}
										/>
									</ChecksGroup>
								</FormGroup>
								<Button
									icon='UploadFile'
									color='warning'
									onClick={() => setAddModalStatus(true)}>
									Export
								</Button>
							</CardTitle>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-modern table-bordered border-primary table-hover '>
									{selectedOption === 'Transaction Report' && (
										<>
											<thead>
												<tr>
													<th>Code</th>
													<th>GRN number</th>
													<th>Date</th>
													<th>Quantity</th>
													<th>Stock Out Type</th>
													<th>Price (Rs.)</th>
													<th>Category</th>
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
												{filteredTransactions &&
													filteredTransactions
														.filter((transaction: any) =>
															searchTerm
																? transaction.code
																		.toString()
																		.includes(
																			searchTerm.toLowerCase(),
																		) ||
																  // transaction.category.toLowerCase().includes(searchTerm.toLowerCase())||
																  // transaction.price.toString().includes(searchTerm.toLowerCase())||
																  transaction.date.includes(
																		searchTerm.toLowerCase(),
																  )
																: // transaction.GRN_number.toString().includes(searchTerm.toLowerCase())

																  true,
														)
														.filter((transaction: any) =>
															selectedCategories.length > 0
																? selectedCategories.includes(
																		transaction.type,
																  )
																: true,
														)
														.filter((transaction: any) =>
															selectedStockOutTypes.length > 0
																? selectedStockOutTypes.includes(
																		transaction.stock_received,
																  )
																: true,
														)
														.map((transaction: any) => {
															// Determine the appropriate Bootstrap text color class based on order_type
															let textColorClass = '';
															if (
																transaction.stock_received ==
																'Customer'
															) {
																textColorClass = 'text-warning';
															} else if (
																transaction.stock_received ===
																'Yarn Transaction'
															) {
																textColorClass = 'text-danger';
															} else if (
																transaction.stock_received ===
																'Dye Plant'
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
										</>
									)}

									{selectedOption === 'GRN Report' && (
										<>
											<thead>
												<tr>
													<th>GRN number</th>
													<th>Date</th>
													<th>Item Code</th>
													<th>Item</th>
													<th>Quantity</th>
													<th>Supplier</th>
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
												{lot &&
													lot
														.filter((lot: any) =>
															searchTerm
																? lot.code
																		.toString()
																		.toLowerCase()
																		.includes(
																			searchTerm.toLowerCase(),
																		) ||
																  lot.category
																		.toLowerCase()
																		.includes(
																			searchTerm.toLowerCase(),
																		) ||
																  lot.suppl_invoice_no
																		.toLowerCase()
																		.includes(
																			searchTerm.toLowerCase(),
																		) ||
																  lot.suppl_gatepass_no
																		.toLowerCase()
																		.includes(
																			searchTerm.toLowerCase(),
																		) ||
																  lot.GRN_number.toString()
																		.toLowerCase()
																		.includes(
																			searchTerm.toLowerCase(),
																		) ||
																  lot.subcategory
																		.toLowerCase()
																		.includes(
																			searchTerm.toLowerCase(),
																		)
																: true,
														)
														.map((lot: any) => (
															<tr key={lot.id}>
																<td>{lot.GRN_number}</td>
																<td>{lot.date}</td>
																<td>{lot.code}</td>

																<td>{lot.category || lot.type}</td>

																<td>{lot.quentity} Kg</td>
																<td>{lot.supplier}</td>
															</tr>
														))}
											</tbody>
										</>
									)}
									{selectedOption === 'Transfer Note Report' && (
										<>
											<thead>
												<tr>
													<th>Date</th>
													<th>Code</th>

													<th>Quantity</th>
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
												{filteredTransactions &&
													filteredTransactions
														.filter((transaction: any) =>
															searchTerm
																? transaction.code
																		.toString()
																		.includes(
																			searchTerm.toLowerCase(),
																		) ||
																  // transaction.category.toLowerCase().includes(searchTerm.toLowerCase())||
																  // transaction.price.toString().includes(searchTerm.toLowerCase())||
																  transaction.date.includes(
																		searchTerm.toLowerCase(),
																  )
																: // transaction.GRN_number.toString().includes(searchTerm.toLowerCase())

																  true,
														)
														.filter((transaction: any) => {
															if (
																transaction.stock_received ==
																'Yarn Transaction'
															) {
																return transaction;
															}
														})

														.map((transaction: any) => {
															return (
																<tr key={transaction.id}>
																	<td>
																		{transaction.date} -{' '}
																		{transaction.time}
																	</td>
																	<td>{transaction.code}</td>
																	<td>
																		{transaction.quentity} Kg
																	</td>
																</tr>
															);
														})}
											</tbody>
										</>
									)}
									{selectedOption === 'Grey Fabric Report' && (
										<>
											<thead>
												<tr>
													<th>Date</th>
													<th>Item Code</th>
													<th>Quantity</th>
													<th>Matchin No</th>
													<th>Operator Name</th>
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
												{lot &&
													lot
														.filter((lot: any) =>
															searchTerm? 
																	lot.code.toString().toLowerCase().includes(searchTerm.toLowerCase(),) ||
																  	lot.category.toLowerCase().includes(searchTerm.toLowerCase(),) ||
																 	lot.suppl_invoice_no.toLowerCase().includes(searchTerm.toLowerCase(),) ||
																  	lot.suppl_gatepass_no.toLowerCase().includes(searchTerm.toLowerCase(),) ||
																  	lot.GRN_number.toString().toLowerCase().includes(searchTerm.toLowerCase(),) ||
																  	lot.subcategory.toLowerCase().includes(searchTerm.toLowerCase(),)
																: true,
														)
														.filter((transaction: any) => {
															if (
																transaction.type ==
																'Gray Fabric'
															) {
																return transaction;
															}
														})
														.map((lot: any) => (
															<tr key={lot.id}>
																<td>{lot.date}</td>
																<td>{lot.code}</td>
																<td>{lot.quentity} Kg</td>
																<td></td>
																<td>{lot.operater}</td>
															</tr>
														))}
											</tbody>
										</>
									)}
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
