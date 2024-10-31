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
import Page from '../../../layout/Page/Page';
import Card, { CardBody, CardTitle } from '../../../components/bootstrap/Card';
import { useGetLotsQuery } from '../../../redux/slices/stockInAPISlice';
import ExportDropdown from '../../../components/ExportDropdown';

const Index: NextPage = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const { data: lot, error, isLoading } = useGetLotsQuery(undefined);
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
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						<Card stretch>
							<CardTitle className='d-flex justify-content-between align-items-center m-4'>
								<div className='flex-grow-1 text-center text-info '>Stock In</div>
								<ExportDropdown
									tableSelector='table'
									title='Lot Management Report'
								/>
							</CardTitle>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-hover table-bordered border-primary'>
									<thead className={'table-dark border-primary'}>
										<tr>
											<th>Code</th>
											<th>GRN Number</th>
											<th>Description</th>
											<th>Category</th>
											<th>Quantity</th>
											<th>Current Quantity</th>
											<th>Gate Pass No</th>
											<th>Invoice No</th>
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
																.includes(searchTerm.toLowerCase())
														: true,
												)
												.map((lot: any) => (
													<tr key={lot.id}>
														<td>{lot.code}</td>
														<td>{lot.GRN_number}</td>
														<td>{lot.description}</td>
														<td>{lot.category || lot.type}</td>
														<td>{lot.quentity} Kg</td>
														<td>{lot.current_quantity} Kg</td>
														<td>{lot.suppl_gatepass_no}</td>
														<td>{lot.suppl_invoice_no}</td>
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
