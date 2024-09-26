import React, { useEffect, useRef, useState } from 'react';
import CommonRightPanel from '../../../components/CommonRightPanel';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Button from '../../../components/bootstrap/Button';
import 'react-simple-keyboard/build/css/index.css';
import Swal from 'sweetalert2';
import Additem from '../../../components/add-item';
import Edit from '../../../components/edit-item';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import Input from '../../../components/bootstrap/forms/Input';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import { useFormik } from 'formik';
import {
	useGetStockOutsQuery,
	useAddStockOutMutation,
} from '../../../redux/slices/stockOutApiSlice'; // Import the query

function index() {
	const [toggleRightPanel, setToggleRightPanel] = useState(false);
	const [orderedItems, setOrderedItems] = useState<any>([]);
	const [id, setId] = useState<number>(1530);
	const customerNameInputRef = useRef<HTMLInputElement>(null);
	const customerAmountInputRef = useRef<HTMLInputElement>(null);
	const [activeComponent, setActiveComponent] = useState<'additem' | 'edit'>('additem');
	const [selectedOption, setSelectedOption] = useState<string>('Customer');
	const currentTime = new Date().toLocaleTimeString('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
	});
	const [addtransaction, { isLoading }] = useAddStockOutMutation();
	const { refetch } = useGetStockOutsQuery(undefined);
	const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedOption(event.target.value);
	};
	console.log(orderedItems);
	const addbill = async () => {
		try {
			const result = await Swal.fire({
				title: 'Are you sure?',
				text: 'You will not be able to recover this!',
				// text: id,
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, update it!',
			});

			if (result.isConfirmed) {
				const currentDate = new Date();
				const formattedDate = currentDate.toLocaleDateString();

				const year = currentDate.getFullYear();
				const month = String(currentDate.getMonth() + 1).padStart(2, '0');
				const day = String(currentDate.getDate()).padStart(2, '0');
				const formattedDate1 = `${year}-${month}-${day}`;

				for (const orderedItem of orderedItems) {
					const values = {
						stock_id: orderedItem.id,
						fabric_type: orderedItem.fabric_type,
						type: orderedItem.type,
						code: orderedItem.code,
						category: orderedItem.category,
						subcategory: orderedItem.subcategory,
						time: currentTime,
						date: formattedDate1,
						quentity: orderedItem.order_quantity,
						stock_received: selectedOption,
						price: formik.values.price,
						customer_name: formik.values.name,
						customer_mobile: formik.values.mobile,
						vehicle_number: formik.values.vehiclenumber,
						gate_pass_No: formik.values.gatepassno,
					};
					const response: any = await addtransaction(values).unwrap();
				}

				refetch();
				Swal.fire('Added!', 'transaction has been added successfully.', 'success');
			}
		} catch (error) {
			console.error('Error during handleUpload: ', error);
			alert('An error occurred during file upload. Please try again later.');
		}
	};
	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.ctrlKey && event.key.toLowerCase() === 'b') {
			setToggleRightPanel((prevState) => !prevState);
			event.preventDefault(); // Prevent default browser behavior
		} else if (event.ctrlKey && event.key.toLowerCase() === 'p') {
			formik.handleSubmit();
			event.preventDefault(); // Prevent default browser behavior
		} else if (event.key === 'Shift') {
			// Check if the focus is on the input fields
			if (
				document.activeElement === customerNameInputRef.current ||
				document.activeElement === customerAmountInputRef.current
			) {
				// Prevent default action of the Shift key press
				event.preventDefault();
			} else {
				// Focus the customer name input
				customerNameInputRef.current?.focus();
			}
		}
	};

	useEffect(() => {
		const handleCustomerNameEnter = (event: KeyboardEvent) => {
			if (event.key === 'Shift') {
				customerAmountInputRef.current?.focus();
			}
		};

		const handleAmountEnter = (event: KeyboardEvent) => {
			if (event.key === 'Shift') {
				event.stopPropagation();
				event.preventDefault();
				formik.handleSubmit();
			}
		};

		const customerNameInput = customerNameInputRef.current;
		const customerAmountInput = customerAmountInputRef.current;

		customerNameInput?.addEventListener('keydown', handleCustomerNameEnter);
		customerAmountInput?.addEventListener('keydown', handleAmountEnter);

		window.addEventListener('keydown', handleKeyPress);

		return () => {
			// customerNameInput?.removeEventListener('keydown', handleCustomerNameEnter);
			customerAmountInput?.removeEventListener('keydown', handleAmountEnter);
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, []);

	const formik = useFormik({
		initialValues: {
			price: '',
			gatepassno: '',
			name: '',
			mobile: '',
			vehiclenumber: '',
		},
		validate: (values) => {
			const errors: Record<string, string> = {};
			if (!values.price) errors.price = 'Required';
			if (selectedOption == 'Dye Plant' && !values.gatepassno) errors.gatepassno = 'Required';
			if (selectedOption == 'Customer' && !values.name) errors.name = 'Required';
			if (selectedOption == 'Customer' && !values.mobile) errors.mobile = 'Required';
			if (selectedOption == 'Dye Plant' && !values.vehiclenumber)
				errors.vehiclenumber = 'Required';

			return errors;
		},
		onSubmit: async (values) => {
			if (orderedItems.length >= 1) {
				try {
					const result = await Swal.fire({
						title: 'Are you sure?',
						text: 'You will not be able to recover this!',
						// text: id,
						icon: 'warning',
						showCancelButton: true,
						confirmButtonColor: '#3085d6',
						cancelButtonColor: '#d33',
						confirmButtonText: 'Yes, update it!',
					});

					if (result.isConfirmed) {
						const currentDate = new Date();
						const formattedDate = currentDate.toLocaleDateString();

						const year = currentDate.getFullYear();
						const month = String(currentDate.getMonth() + 1).padStart(2, '0');
						const day = String(currentDate.getDate()).padStart(2, '0');
						const formattedDate1 = `${year}-${month}-${day}`;

						for (const orderedItem of orderedItems) {
							const values1 = {
								stock_id: orderedItem.id,
								fabric_type: orderedItem.fabric_type,
								type: orderedItem.type,
								code: orderedItem.code,
								GRN_number:orderedItem.GRN_number,
								category: orderedItem.category,
								subcategory: orderedItem.subcategory,
								time: currentTime,
								date: formattedDate1,
								quentity: orderedItem.order_quantity,
								stock_received: selectedOption,
								price: values.price,
								customer_name: values.name,
								customer_mobile: values.mobile,
								vehicle_number: values.vehiclenumber,
								gate_pass_No: values.gatepassno,
							};
							const response: any = await addtransaction(values1).unwrap();
						}
						setOrderedItems([]);
						refetch();
						Swal.fire('Added!', 'transaction has been added successfully.', 'success');
					}
				} catch (error) {
					console.error('Error during handleUpload: ', error);
					alert('An error occurred during file upload. Please try again later.');
				}
			}
		},
	});

	// Define TypeScript interfaces for Category and Item
	interface Category {
		cid: string;
		categoryname: string;
	}
	const cdata = [
		{ status: true, categoryname: 'Gray Fabric', cid: '0bc5HUELspDzvrUdt5u6' },

		{ status: true, categoryname: 'Finished Fabric', cid: 'LKcV57ThRnHtE9bxBHMb' },

		{ status: true, categoryname: 'Gray Collar Cuff', cid: '0bc5HUELspDzvrUdt5u6' },

		{ status: true, categoryname: 'Finished Collar Cuff', cid: '0bc5HUELspDzvrUdt5u6' },

		{ status: true, categoryname: 'Yarn', cid: 'LKcV57ThRnHtE9bxBHMb' },
	];
	const [category, setCategory] = useState<Category[]>(cdata);
	return (
		<PageWrapper className=''>
			{/* <div>
				<div className='mt-5'>
					<Button className='btn btn-outline-warning '>All</Button>
					{category.map((category, index) => (
						<Button key={index} className='btn btn-outline-warning'>
							{category.categoryname}
						</Button>
					))}
				</div>
			</div> */}
			<div className='row'>
				<div className='col-4  mb-sm-0'>
					<Additem
						orderedItems={orderedItems}
						setOrderedItems={setOrderedItems}
						isActive={activeComponent === 'additem'}
						setActiveComponent={setActiveComponent}
					/>{' '}
				</div>
				<div className='col-4 '>
					<Edit
						orderedItems={orderedItems}
						setOrderedItems={setOrderedItems}
						isActive={activeComponent === 'edit'}
						setActiveComponent={setActiveComponent}
					/>{' '}
				</div>
				<div className='col-4 mt-4 '>
					<Card stretch className=' p-4' style={{ height: '75vh' }}>
						<CardBody isScrollable>
							<FormGroup id='membershipDate' className='col-md-12'>
								<ChecksGroup isInline>
									<Checks
										type='radio'
										id='customer'
										label='Customer'
										name='type'
										value='Customer'
										onChange={handleOptionChange}
										checked={selectedOption}
									/>
									<Checks
										type='radio'
										id='Dye Plant'
										label='Dye Plant'
										name='type'
										value='Dye Plant'
										onChange={handleOptionChange}
										checked={selectedOption}
									/>
								</ChecksGroup>
							</FormGroup>

							<div className='row g-4 mt-1'>
								<FormGroup id='price' label='Price' className='col-md-12'>
									<Input
										onChange={formik.handleChange}
										value={formik.values.price}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.price}
										invalidFeedback={formik.errors.price}
										validFeedback='Looks good!'
									/>
								</FormGroup>

								{selectedOption === 'Dye Plant' && (
									<div>
										<FormGroup
											id='vehiclenumber'
											label='Vehicle Number'
											className='col-md-12'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.vehiclenumber}
												onBlur={formik.handleBlur}
												isValid={formik.isValid}
												isTouched={formik.touched.vehiclenumber}
												invalidFeedback={formik.errors.vehiclenumber}
												validFeedback='Looks good!'
											/>
										</FormGroup>
										<FormGroup
											id='gatepassno'
											label='Gate Pass Number'
											className='col-md-12'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.gatepassno}
												onBlur={formik.handleBlur}
												isValid={formik.isValid}
												isTouched={formik.touched.gatepassno}
												invalidFeedback={formik.errors.gatepassno}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
								)}

								{selectedOption === 'Customer' && (
									<div>
										<FormGroup
											id='name'
											label='Customer Name'
											className='col-md-12'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.name}
												onBlur={formik.handleBlur}
												isValid={formik.isValid}
												isTouched={formik.touched.name}
												invalidFeedback={formik.errors.name}
												validFeedback='Looks good!'
											/>
										</FormGroup>

										<FormGroup
											id='mobile'
											label='Contact No.'
											className='col-md-12'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.mobile}
												onBlur={formik.handleBlur}
												isValid={formik.isValid}
												isTouched={formik.touched.mobile}
												invalidFeedback={formik.errors.mobile}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
								)}
							</div>
							<Button
								className='btn btn-success w-100 mt-3 fs-4 p-3 mb-3'
								onClick={formik.handleSubmit}>
								Proceed
							</Button>
						</CardBody>
					</Card>
				</div>
			</div>

			<CommonRightPanel
				setOpen={setToggleRightPanel}
				isOpen={toggleRightPanel}
				orderedItems={orderedItems}
				id={id}
			/>
		</PageWrapper>
	);
}

export default index;
