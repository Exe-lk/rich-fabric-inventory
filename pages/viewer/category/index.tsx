import React, { useState } from 'react';
import { NextPage } from 'next';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { useGetCategoriesQuery } from '../../../redux/slices/categoryApiSlice';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import Card, { CardBody, CardTitle } from '../../../components/bootstrap/Card';
import ExportDropdown from '../../../components/ExportDropdown';

const Index: NextPage = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const { data: categories, error, isLoading } = useGetCategoriesQuery(undefined);

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
						onChange={(event: any) => setSearchTerm(event.target.value)}
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
								<div className='flex-grow-1 text-center text-info '> Category</div>
								<ExportDropdown
									tableSelector='table'
									title='Category Management Report'
								/>
							</CardTitle>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-hover table-bordered border-primary'>
									<thead className={'table-dark border-primary'}>
										<tr>
											<th>Category name</th>
											<th>Sub Category</th>
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
										{categories &&
											categories
												.filter((category: any) =>
													searchTerm
														? category.name
																.toLowerCase()
																.includes(searchTerm.toLowerCase())
														: true,
												)
												.map((category: any) => (
													<tr key={category.cid}>
														<td>{category.name}</td>
														<td>
															<ul>
																{category.subcategory?.map(
																	(sub: any, index: any) => (
																		<p>{sub}</p>
																	),
																)}
															</ul>
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
