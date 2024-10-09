import React, { useEffect, useState } from 'react';
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
import StockAddModal from '../../../components/custom/ItemAddModal';
import StockEditModal from '../../../components/custom/ItemEditModal';
import StockTransformModal from '../../../components/custom/StockTransformModal';
import Swal from 'sweetalert2';
import StockDeleteModal from '../../../components/custom/ItemDeleteModal';
import { useUpdateLotMutation, useGetLotsQuery } from '../../../redux/slices/stockInAPISlice';
import Dropdown, { DropdownItem, DropdownMenu, DropdownToggle } from '../../../components/bootstrap/Dropdown';
import { toSvg, toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Index: NextPage = () => {
	const [searchTerm, setSearchTerm] = useState(''); // State for search term
	const [addModalStatus, setAddModalStatus] = useState<boolean>(false); // State for add modal status
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false); // State for edit modal status
	const [transformModalStatus, setTransformModalStatus] = useState<boolean>(false); 
	const [deleteModalStatus, setDeleteModalStatus] = useState<boolean>(false);
	const [id, setId] = useState<string>(''); // State for current stock item ID
	const [id1, setId1] = useState<string>('12356'); // State for new item ID
	const { data: lot, error, isLoading } = useGetLotsQuery(undefined);
	const [updatelot] = useUpdateLotMutation();

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
					const values = await {
						...item,
						status: false,
					};
					await updatelot(values);

					Swal.fire('Deleted!', 'The stock has been deleted.', 'success');
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
	// Function to handle the download in different formats
	const handleExport = async (format: string) => {
		const table = document.querySelector('table');
		if (!table) return;
		const clonedTable = table.cloneNode(true) as HTMLElement;
		// Remove Edit/Delete buttons column from cloned table
		const rows = clonedTable.querySelectorAll('tr');
		rows.forEach((row) => {
			const lastCell = row.querySelector('td:last-child, th:last-child');
			if (lastCell) {
				lastCell.remove();
			}
		});
		const clonedTableStyles = getComputedStyle(table);
		clonedTable.setAttribute('style', clonedTableStyles.cssText);
		try {
			switch (format) {
				case 'svg':
					await downloadTableAsSVG(clonedTable);
					break;
				case 'png':
					await downloadTableAsPNG(clonedTable);
					break;
				case 'csv':
					downloadTableAsCSV(clonedTable);
					break;
				case 'pdf':
					await downloadTableAsPDF(clonedTable);
					break;
				default:
					console.warn('Unsupported export format: ', format);
			}
		} catch (error) {
			console.error('Error exporting table: ', error);
		}
	};
	// function to export the table data in CSV format
	const downloadTableAsCSV = (table: any) => {
		let csvContent = '';
		const rows = table.querySelectorAll('tr');
		rows.forEach((row: any) => {
			const cols = row.querySelectorAll('td, th');
			const rowData = Array.from(cols)
				.map((col: any) => `"${col.innerText}"`)
				.join(',');
			csvContent += rowData + '\n';
		});

		const blob = new Blob([csvContent], { type: 'text/csv' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'stock_in.csv';
		link.click();
	};
	//  function for PDF export
	const downloadTableAsPDF = (table: HTMLElement) => {
		try {
			const pdf = new jsPDF('p', 'pt', 'a4');
			const rows: any[] = [];
			const headers: any[] = [];

			const thead = table.querySelector('thead');
			if (thead) {
				const headerCells = thead.querySelectorAll('th');
				headers.push(Array.from(headerCells).map((cell: any) => cell.innerText));
			}
			const tbody = table.querySelector('tbody');
			if (tbody) {
				const bodyRows = tbody.querySelectorAll('tr');
				bodyRows.forEach((row: any) => {
					const cols = row.querySelectorAll('td');
					const rowData = Array.from(cols).map((col: any) => {
						const ul = col.querySelector('ul');
						if (ul) {
							// Handle <ul> and extract <li> or <p> elements as line-separated text
							const listItems = Array.from(ul.querySelectorAll('p')).map(
								(li: any) => li.innerText,
							);
							return listItems.join('\n'); // Separate each item by a new line
						} else {
							return col.innerText; // Return regular text for other <td> elements
						}
					});
					rows.push(rowData);
				});
			}

			autoTable(pdf, {
				head: headers,
				body: rows,
				margin: { top: 50 },
				styles: {
					overflow: 'linebreak',
					cellWidth: 'wrap',
				},
				theme: 'grid',
			});
			pdf.save('stock_in.pdf');
		} catch (error) {
			console.error('Error generating PDF: ', error);
			alert('Error generating PDF. Please try again.');
		}
	};
	// Function to export the table data in SVG format using library html-to-image
	const downloadTableAsSVG = async (table: HTMLElement) => {
		try {
			const dataUrl = await toSvg(table, {
				backgroundColor: 'white',
				cacheBust: true,
				style: {
					width: table.offsetWidth + 'px',
				},
			});
			const link = document.createElement('a');
			link.href = dataUrl;
			link.download = 'stock_in.svg';
			link.click();
		} catch (error) {
			console.error('Error generating SVG: ', error);
		}
	};
	// Function to export the table data in PNG format using library html-to-image
	const downloadTableAsPNG = async (table: HTMLElement) => {
		try {
			const dataUrl = await toPng(table, {
				backgroundColor: 'white',
				cacheBust: true,
				style: {
					width: table.offsetWidth + 'px',
				},
			});
			const link = document.createElement('a');
			link.href = dataUrl;
			link.download = 'stock_in.png';
			link.click();
		} catch (error) {
			console.error('Error generating PNG: ', error);
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
					{/* <Dropdown>
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
					</Dropdown> */}
					<SubheaderSeparator />

					{/* Button to open  New Item modal */}
					<Button
						icon='AddCircleOutline'
						color='success'
						isLight
						onClick={() => setAddModalStatus(true)}>
						New Stock
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						{/* Table for displaying customer data */}
						<Card stretch>
							<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info '>
									Manage Stock In
								</div>
								<Dropdown>
								<DropdownToggle hasIcon={false}>
									<Button
										icon='UploadFile'
										color='warning'>
										Export
									</Button>
								</DropdownToggle>
								<DropdownMenu isAlignmentEnd>
									<DropdownItem onClick={() => handleExport('svg')}>Download SVG</DropdownItem>
							
									<DropdownItem onClick={() => handleExport('csv')}>Download CSV</DropdownItem>
									<DropdownItem onClick={() => handleExport('pdf')}>Download PDF</DropdownItem>
								</DropdownMenu>
							</Dropdown>
					
							</CardTitle>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-modern table-bordered border-primary table-hover '>
									<thead>
										<tr>
											<th>Code</th>
											<th>GRN Number</th>
											<th>Description</th>
											<th>Category</th>
											<th>Quantity</th>
											<th>Current Quantity</th>
											<th>Gate Pass No</th>
											<th>Invoice No</th>
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
										{lot &&
											lot
												.filter((lot: any) =>
													searchTerm? 
												lot.code.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
												lot.category.toLowerCase().includes(searchTerm.toLowerCase())||
												lot.suppl_invoice_no.toLowerCase().includes(searchTerm.toLowerCase())||
												lot.suppl_gatepass_no.toLowerCase().includes(searchTerm.toLowerCase())||
												lot.GRN_number.toString().toLowerCase().includes(searchTerm.toLowerCase())||
												lot.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
											  : true
												)
												.map((lot: any) => (
													<tr key={lot.id}>
														<td>{lot.code}</td>
														<td>{lot.GRN_number}</td>
														<td>{lot.description}</td>
														<td>{lot.category||lot.type}</td>
														
														<td>{lot.quentity} Kg</td>
														<td>{lot.current_quantity} Kg</td>
														<td>{lot.suppl_gatepass_no}</td>
														<td>{lot.suppl_invoice_no}</td>
														
														<td>
															<Button
																icon='Edit'
																color='info'
																onClick={() => (
																	setEditModalStatus(true),
																	setId(lot.id)
																)}>
																Edit
															</Button>
															<Button
																className='m-2'
																icon='Delete'
																color='danger'
																onClick={() =>
																	handleClickDelete(lot)
																}>
																Delete
															</Button>

															{lot.type === 'Yarn' && (
																<Button
																	className=''
																	icon='Transform'
																	color='success'
																	onClick={() => (
																		setTransformModalStatus(true),
																		setId(lot.id)
																	)}>
																	Stock Transaction
																</Button>
															)}
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
			<StockAddModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id={id1} />
			<StockDeleteModal setIsOpen={setDeleteModalStatus} isOpen={deleteModalStatus} id='' />
			<StockTransformModal setIsOpen={setTransformModalStatus} isOpen={transformModalStatus} id={id} />
			<StockEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id={id} />
		</PageWrapper>
	);
};
export default Index;
