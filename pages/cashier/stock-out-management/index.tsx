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
} from '../../../redux/slices/stockOutApiSlice';
import {
	useGetLotMovementsQuery,
	useDeleteLotMovementMutation,
} from '../../../redux/slices/LotMovementApiSlice';

function index() {
	const [toggleRightPanel, setToggleRightPanel] = useState(false);
	const [id, setId] = useState<number>(1530);
	const customerNameInputRef = useRef<HTMLInputElement>(null);
	const customerAmountInputRef = useRef<HTMLInputElement>(null);
	const [activeComponent, setActiveComponent] = useState<'additem' | 'edit'>('additem');
	const [selectedOption, setSelectedOption] = useState<string>('Customer');
	const { data: orderedItems, error } = useGetLotMovementsQuery(undefined);
	const [deletelot] = useDeleteLotMovementMutation();
	const [addtransaction] = useAddStockOutMutation();
	const { refetch } = useGetStockOutsQuery(undefined);
	const currentTime = new Date().toLocaleTimeString('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
	});

	const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedOption(event.target.value);
	};

	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.ctrlKey && event.key.toLowerCase() === 'b') {
			setToggleRightPanel((prevState) => !prevState);
			event.preventDefault();
		} else if (event.ctrlKey && event.key.toLowerCase() === 'p') {
			formik.handleSubmit();
			event.preventDefault();
		} else if (event.key === 'Shift') {
			if (
				document.activeElement === customerNameInputRef.current ||
				document.activeElement === customerAmountInputRef.current
			) {
				event.preventDefault();
			} else {
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
			if (selectedOption == 'Customer' && !values.mobile) {
				errors.mobile = 'Required';
			} else if (values.mobile.length !== 10) {
				errors.mobile = 'Mobile number must be exactly 10 digits';
			} else if (!/^0\d{9}$/.test(values.mobile)) {
				errors.mobile = 'Mobile number must start with 0 and be exactly 10 digits';
			}
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
						icon: 'warning',
						showCancelButton: true,
						confirmButtonColor: '#3085d6',
						cancelButtonColor: '#d33',
						confirmButtonText: 'Yes, update it!',
					});

					if (result.isConfirmed) {
						const currentDate = new Date();
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
								GRN_number: orderedItem.GRN_number,
								category: orderedItem.category,
								subcategory: orderedItem.subcategory,
								time: currentTime,
								date: formattedDate1,
								quentity: orderedItem.quentity,
								stock_received: selectedOption,
								price: values.price,
								customer_name: values.name,
								customer_mobile: values.mobile,
								vehicle_number: values.vehiclenumber,
								gate_pass_No: values.gatepassno,
							};
							await addtransaction(values1).unwrap();
						}
						for (const orderedItem of orderedItems) {
							await deletelot(orderedItem.id).unwrap();
						}
						refetch();
						formik.resetForm();
						Swal.fire('Added!', 'transaction has been added successfully.', 'success');
					}
				} catch (error) {
					console.error('Error during handleUpload: ', error);
					alert('An error occurred during file upload. Please try again later.');
				}
			}
		},
	});

	return (
		<PageWrapper className=''>
			<div className='row'>
				<div className='col-4  mb-sm-0'>
					<Additem
						isActive={activeComponent === 'additem'}
						setActiveComponent={setActiveComponent}
					/>
				</div>
				<div className='col-4 '>
					<Edit
						isActive={activeComponent === 'edit'}
						setActiveComponent={setActiveComponent}
					/>
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
										name='type1'
										value='Customer'
										onChange={handleOptionChange}
										checked={selectedOption}
									/>
									<Checks
										type='radio'
										id='Dye Plant'
										label='Dye Plant'
										name='type1'
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
