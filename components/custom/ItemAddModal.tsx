import React, { FC, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import Swal from 'sweetalert2';
import Select from '../bootstrap/forms/Select';
import Option from '../bootstrap/Option';
import Checks, { ChecksGroup } from '../bootstrap/forms/Checks';
import { useGetLotsQuery, useAddLotMutation } from '../../redux/slices/stockInAPISlice'; // Import the query
import { useGetFabricsQuery } from '../../redux/slices/fabricApiSlice';
import { useGetGSMsQuery } from '../../redux/slices/gsmApiSlice';
import { useGetKnitTypesQuery } from '../../redux/slices/knitTypeApiSlice';
import { useGetCategoriesQuery } from '../../redux/slices/categoryApiSlice'; // Import the RTK Query hook
import { useGetColorsQuery } from '../../redux/slices/colorApiSlice';

interface ItemAddModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

interface Category {
	categoryname: string;
	subcategory: string[];
}

interface SelectOption {
	value: string;
	label: string;
}

const ItemAddModal: FC<ItemAddModalProps> = ({ id, isOpen, setIsOpen }) => {
	const [subcategories, setSubcategories] = useState<SelectOption[]>([]);
	const [isAddingNewColor, setIsAddingNewColor] = useState(false);
	const [isAddingNewFabric, setIsAddingNewFabric] = useState(false);
	const [isAddingNewGSM, setIsAddingNewGSM] = useState(false);
	const [isAddingNewKnitType, setIsAddingNewKnitType] = useState(false); //
	const [selectedOption, setSelectedOption] = useState<string>('Gray Fabric');

	const [addLot] = useAddLotMutation();
	const { refetch } = useGetLotsQuery(undefined);
	const { data: fabric } = useGetFabricsQuery(undefined);
	const { data: gsm } = useGetGSMsQuery(undefined);
	const { data: knit } = useGetKnitTypesQuery(undefined);
	const { data: lot } = useGetLotsQuery(undefined);
	const { data: categories } = useGetCategoriesQuery(undefined);
	const { data: color } = useGetColorsQuery(undefined);

	const formik = useFormik({
		initialValues: {
			type: selectedOption,
			date: '',
			code: lot && lot.length > 0 ? lot[0].code + 1 : 0,
			description: '',
			color: '',
			fabric_type: '',
			gsm: '',
			width: '',
			knit_type: '',
			GRN_number: lot && lot.length > 0 ? lot[0].GRN_number + 1 : 0,
			quentity: '',
			status: true,
			category: '',
			subcategory: '',
			stockOutId: '',
			rolls: '',
			PackType: '',
			remark: '',
			supplier: '',
			yarn_type: '',
			collor_cuff_type: '',
			suppl_gatepass_no: '',
			suppl_invoice_no: '',
			operater: '',
			machine_no: '',
		},
		enableReinitialize: true,
		validate: (values) => {
			const errors: Record<string, string> = {};

			if (!values.date) errors.date = 'Required';
			if (!values.code) errors.code = 'Required';
			if (!values.GRN_number) errors.GRN_number = 'Required';
			if (!values.description) errors.description = 'Required';
			if (!values.quentity) errors.quentity = 'Required';
			if (selectedOption == 'Finish Fabric' && !values.color) errors.color = 'Required';
			if (
				(selectedOption == 'Finish Fabric' ||
					selectedOption == 'Gray Fabric' ||
					selectedOption == 'Other') &&
				!values.fabric_type
			)
				errors.fabric_type = 'Required';
			if (selectedOption != 'Yarn' && !values.gsm) errors.gsm = 'Required';
			if (selectedOption != 'Yarn' && !values.width) errors.width = 'Required';
			if (selectedOption != 'Yarn' && !values.knit_type) errors.knit_type = 'Required';
			if (selectedOption != 'Yarn' && !values.rolls) errors.rolls = 'Required';
			if (selectedOption != 'Yarn' && !values.PackType) errors.PackType = 'Required';
			if (selectedOption != 'Yarn' && !values.supplier) errors.supplier = 'Required';
			if (selectedOption != 'Yarn' && !values.remark) errors.remark = 'Required';
			if (selectedOption != 'Yarn' && !values.suppl_gatepass_no)
				errors.suppl_gatepass_no = 'Required';
			if (selectedOption != 'Yarn' && !values.operater) errors.operater = 'Required';
			if (selectedOption != 'Yarn' && !values.suppl_invoice_no)
				errors.suppl_invoice_no = 'Required';
			if (
				(selectedOption == 'Gray collor cuff' || selectedOption == 'Finish collor cuff') &&
				!values.collor_cuff_type
			)
				errors.collor_cuff_type = 'Required';
			if (selectedOption == 'Other' && !values.category) errors.category = 'Required';
			if (selectedOption == 'Other' && !values.subcategory) errors.subcategory = 'Required';
			if (selectedOption == 'Finish Fabric' && !values.stockOutId)
				errors.stockOutId = 'Required';

			return errors;
		},
		onSubmit: async (values) => {
			try {
				Swal.fire({
					title: 'Processing...',
					html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
					allowOutsideClick: false,
					showCancelButton: false,
					showConfirmButton: false,
				});
				const response: any = await addLot(values).unwrap();
				console.log(response);

				// Refetch categories to update the list
				refetch();

				setIsOpen(false);

				Swal.fire('Added!', 'Lot has been added successfully.', 'success');
				formik.resetForm();
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				Swal.close();
				alert('An error occurred during file upload. Please try again later.');
			}
		},
	});

	const handleResetForm = () => {
		formik.resetForm();

		setIsAddingNewColor(false);
		setIsAddingNewFabric(false);
		setIsAddingNewGSM(false);
		setIsAddingNewKnitType(false);
	};
	const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		formik.resetForm();
		setSelectedOption(event.target.value);
		handleCategoryChange(event);
	};

	const handleCategoryChange = (e: any) => {
		const selectedCategory = e.target.value;
		formik.handleChange(e);
		// setSelectedOption(e.target.value);
		const selectedCategoryData = categories.find((cat: any) => cat.name === selectedCategory);
		if (selectedCategoryData) {
			const options = selectedCategoryData.subcategory.map((subcat: any) => ({
				value: subcat,
				label: subcat,
			}));
			setSubcategories(options);
			console.log(options);
		} else {
			setSubcategories([]);
		}
	};
	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'New Stock'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup id='membershipDate' className='col-md-12'>
						<ChecksGroup isInline>
							<Checks
								type='radio'
								id='Gray Fabric'
								label='Gray Fabric'
								name='type'
								value='Gray Fabric'
								onChange={handleOptionChange}
								checked={selectedOption}
							/>
							<Checks
								type='radio'
								id='Finish Fabric'
								label='Finish Fabric'
								name='type'
								value='Finish Fabric'
								onChange={handleOptionChange}
								checked={selectedOption}
							/>
							<Checks
								type='radio'
								id='Gray collor cuff'
								label='Gray collor cuff'
								name='type'
								value='Gray collor cuff'
								onChange={handleOptionChange}
								checked={selectedOption}
							/>
							<Checks
								type='radio'
								id='Finish collor cuff'
								label='Finish collor cuff'
								name='type'
								value='Finish collor cuff'
								onChange={handleOptionChange}
								checked={selectedOption}
							/>
							<Checks
								type='radio'
								id='Yarn'
								label='Yarn'
								name='type'
								value='Yarn'
								onChange={handleOptionChange}
								checked={selectedOption}
							/>
							<Checks
								type='radio'
								id='Other'
								label='Other'
								name='type'
								value='Other'
								onChange={handleOptionChange}
								checked={selectedOption}
							/>
						</ChecksGroup>
					</FormGroup>
					{selectedOption === 'Other' && (
						<>
							<FormGroup
								id='category'
								label='Category'
								onChange={formik.handleChange}
								className='col-md-6'>
								<Select
									ariaLabel='Default select example'
									placeholder='Open this select category'
									onChange={handleCategoryChange}
									value={formik.values.category}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.category}
									invalidFeedback={formik.errors.category}
									validFeedback='Looks good!'>
									{categories &&
										categories.map((category: any) => (
											<>
												<Option value={category.name}>
													{category.name}
												</Option>
											</>
										))}
								</Select>
							</FormGroup>
							<FormGroup id='subcategory' label='Sub Category' className='col-md-6'>
								<Select
									ariaLabel='Default select example'
									placeholder='Open this select sub category'
									onChange={formik.handleChange}
									value={formik.values.subcategory}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.subcategory}
									invalidFeedback={formik.errors.subcategory}
									validFeedback='Looks good!'>
									{subcategories &&
										subcategories.map((category: any) => (
											<>
												<Option value={category.value}>
													{category.label}
												</Option>
											</>
										))}
								</Select>
							</FormGroup>
						</>
					)}
					<FormGroup id='code' label='Code' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.code}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='GRN_number' label='GRN number' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.GRN_number}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='date' label='date' className='col-md-6'>
						<Input
							type='date'
							onChange={formik.handleChange}
							value={formik.values.date}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.date}
							invalidFeedback={formik.errors.date}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='description' label='Description' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.description}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.description}
							invalidFeedback={formik.errors.description}
							validFeedback='Looks good!'
						/>
					</FormGroup>

					<FormGroup id='quentity' label='Quentity (Kg)' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.quentity}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.quentity}
							invalidFeedback={formik.errors.quentity}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					{selectedOption === 'Finish Fabric' && (
						<>
							<FormGroup id='stockOutId' label='Stock Out ID' className='col-md-6'>
								<Input
									onChange={formik.handleChange}
									value={formik.values.stockOutId}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.stockOutId}
									invalidFeedback={formik.errors.stockOutId}
									validFeedback='Looks good!'
								/>
							</FormGroup>

							<FormGroup id='color' label='Color' className='col-md-6'>
								{!isAddingNewColor ? (
									<Select
										ariaLabel='Default select example'
										placeholder='Open this select color'
										onChange={(e: any) => {
											if (e.target.value === 'Add new') {
												setIsAddingNewColor(true); // Switch to input field
											} else {
												formik.handleChange(e);
											}
										}}
										value={formik.values.color}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.color}
										invalidFeedback={formik.errors.color}
										validFeedback='Looks good!'>
										<Option value='Add new'>Add new</Option>

										{color &&
											color.map((color: any) => (
												<>
													<Option value={color.name}>{color.name}</Option>
												</>
											))}
									</Select>
								) : (
									<Input
										type='text'
										placeholder='Enter new color'
										onChange={formik.handleChange}
										value={formik.values.color}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.color}
										invalidFeedback={formik.errors.color}
										validFeedback='Looks good!'
									/>
								)}
							</FormGroup>
						</>
					)}

					{selectedOption == 'Yarn' ? (
						<></>
					) : (
						<>
							{selectedOption === 'Gray collor cuff' ||
							selectedOption === 'Finish collor cuff' ? (
								<>
									<FormGroup
										id='fabric_type'
										label='Collor Cuff Type'
										className='col-md-6'>
										{isAddingNewFabric ? (
											<Input
												placeholder='Add new collor cuff type'
												onChange={(e: any) =>
													formik.setFieldValue(
														'fabric_type',
														e.target.value,
													)
												}
												value={formik.values.collor_cuff_type}
											/>
										) : (
											<Select
												ariaLabel='Fabric type select'
												placeholder='Select collor cuff Type'
												onChange={(e: any) => {
													if (e.target.value === 'Add new') {
														setIsAddingNewFabric(true);
													} else {
														formik.handleChange(e);
													}
												}}
												value={formik.values.collor_cuff_type}
												onBlur={formik.handleBlur}
												isValid={formik.isValid}
												isTouched={formik.touched.collor_cuff_type}
												invalidFeedback={formik.errors.collor_cuff_type}
												validFeedback='Looks good!'>
												<Option value='Add new'>Add New</Option>
												<Option value='Cotton'>Plain</Option>
												<Option value='Polyester'>Tiffin</Option>
												<Option value='Cotton'>Embosed</Option>
											</Select>
										)}
									</FormGroup>
								</>
							) : (
								<>
									<FormGroup
										id='fabric_type'
										label='Fabric Type'
										className='col-md-6'>
										{isAddingNewFabric ? (
											<Input
												placeholder='Add new fabric type'
												onChange={(e: any) =>
													formik.setFieldValue(
														'fabric_type',
														e.target.value,
													)
												}
												onBlur={formik.handleBlur}
												isValid={formik.isValid}
												isTouched={formik.touched.fabric_type}
												invalidFeedback={formik.errors.fabric_type}
												value={formik.values.fabric_type}
											/>
										) : (
											<Select
												ariaLabel='Fabric type select'
												onBlur={formik.handleBlur}
												isValid={formik.isValid}
												isTouched={formik.touched.fabric_type}
												invalidFeedback={formik.errors.fabric_type}
												onChange={(e: any) => {
													if (e.target.value === 'Add new') {
														setIsAddingNewFabric(true);
													} else {
														formik.handleChange(e);
													}
												}}>
												<Option value=''>Select Fabric Type</Option>

												{/* Existing fabric type options can be dynamically loaded here */}

												{fabric &&
													fabric.map((fabric: any) => (
														<>
															<Option value={fabric.name}>
																{fabric.name}
															</Option>
														</>
													))}
												<Option value='Add new'>Add New</Option>
											</Select>
										)}
									</FormGroup>
								</>
							)}

							<FormGroup id='gsm' label='GSM' className='col-md-6'>
								{isAddingNewGSM ? (
									<Input
										placeholder='Add new GSM'
										onChange={(e: any) =>
											formik.setFieldValue('gsm', e.target.value)
										}
										value={formik.values.gsm}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.gsm}
										invalidFeedback={formik.errors.gsm}
									/>
								) : (
									<Select
										ariaLabel='GSM select'
										onChange={(e: any) => {
											if (e.target.value === 'Add new') {
												setIsAddingNewGSM(true);
											} else {
												formik.handleChange(e);
											}
										}}
										value={formik.values.gsm}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.gsm}
										invalidFeedback={formik.errors.gsm}
										validFeedback='Looks good!'>
										<Option value=''>Select GSM</Option>

										{gsm &&
											gsm.map((gsm: any) => (
												<>
													<Option value={gsm.name}>{gsm.name}</Option>
												</>
											))}
										<Option value='Add new'>Add New</Option>
									</Select>
								)}
							</FormGroup>
							<FormGroup id='width' label='Width' className='col-md-6'>
								<Input
									type='number'
									onChange={formik.handleChange}
									value={formik.values.width}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.width}
									invalidFeedback={formik.errors.width}
									validFeedback='Looks good!'
								/>
							</FormGroup>
							{/* Knit Type FormGroup with Dynamic Input */}
							<FormGroup id='knit_type' label='Knit Type' className='col-md-6'>
								{isAddingNewKnitType ? (
									<Input
										placeholder='Add new knit type'
										onChange={(e: any) =>
											formik.setFieldValue('knit_type', e.target.value)
										}
										value={formik.values.knit_type}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.knit_type}
										invalidFeedback={formik.errors.knit_type}
									/>
								) : (
									<Select
										ariaLabel='Default select example'
										placeholder='Open this select knit type'
										onChange={(e: any) => {
											if (e.target.value === 'Add new') {
												setIsAddingNewKnitType(true);
											} else {
												formik.handleChange(e);
											}
										}}
										value={formik.values.knit_type}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.knit_type}
										invalidFeedback={formik.errors.knit_type}
										validFeedback='Looks good!'>
										{/* <Option value=''>Select Knit Type</Option> */}

										<Option value='Add new'>Add new</Option>
										{knit &&
											knit.map((knit: any) => (
												<>
													<Option value={knit.name}>{knit.name}</Option>
												</>
											))}
									</Select>
								)}
							</FormGroup>
						</>
					)}
					{selectedOption != 'Yarn' && (
						<>
							<FormGroup
								id='rolls'
								label='Number of rolls or bales'
								className='col-md-6'>
								<Input
									type='number'
									onChange={formik.handleChange}
									value={formik.values.rolls}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.rolls}
									invalidFeedback={formik.errors.rolls}
									validFeedback='Looks good!'
								/>
							</FormGroup>
							<FormGroup id='PackType' label='PackType' className='col-md-6'>
								<Input
									type='number'
									onChange={formik.handleChange}
									value={formik.values.PackType}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.PackType}
									invalidFeedback={formik.errors.PackType}
									validFeedback='Looks good!'
								/>
							</FormGroup>
							<FormGroup id='remark' label='Remark' className='col-md-6'>
								<Input
									type='text'
									onChange={formik.handleChange}
									value={formik.values.remark}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.remark}
									invalidFeedback={formik.errors.remark}
									validFeedback='Looks good!'
								/>
							</FormGroup>
							<FormGroup id='supplier' label='Supplier/Customer' className='col-md-6'>
								<Input
									onChange={formik.handleChange}
									value={formik.values.supplier}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.supplier}
									invalidFeedback={formik.errors.supplier}
									validFeedback='Looks good!'
								/>
							</FormGroup>
							<FormGroup
								id='suppl_gatepass_no'
								label='supplier gate pass no'
								className='col-md-6'>
								<Input
									onChange={formik.handleChange}
									value={formik.values.suppl_gatepass_no}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.suppl_gatepass_no}
									invalidFeedback={formik.errors.suppl_gatepass_no}
									validFeedback='Looks good!'
								/>
							</FormGroup>
							<FormGroup id='operater' label='Operator name' className='col-md-6'>
								<Input
									onChange={formik.handleChange}
									value={formik.values.operater}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.operater}
									invalidFeedback={formik.errors.operater}
									validFeedback='Looks good!'
								/>
							</FormGroup>
							<FormGroup
								id='suppl_invoice_no'
								label='invoice number '
								className='col-md-6'>
								<Input
									onChange={formik.handleChange}
									value={formik.values.suppl_invoice_no}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.suppl_invoice_no}
									invalidFeedback={formik.errors.suppl_invoice_no}
									validFeedback='Looks good!'
								/>
							</FormGroup>
						</>
					)}

					{selectedOption === 'grayFabric' && (
						<>
							<FormGroup
								id='machine_no'
								label=' Machine Number '
								className='col-md-6'>
								<Input
									onChange={formik.handleChange}
									value={formik.values.machine_no}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.machine_no}
									invalidFeedback={formik.errors.machine_no}
									validFeedback='Looks good!'
								/>
							</FormGroup>
							<FormGroup id='operater' label='Operator Name' className='col-md-6'>
								<Input
									onChange={formik.handleChange}
									value={formik.values.operater}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.operater}
									invalidFeedback={formik.errors.operater}
									validFeedback='Looks good!'
								/>
							</FormGroup>
						</>
					)}
				</div>
			</ModalBody>
			<ModalFooter className='px-4 pb-4'>
				{/* Save button to submit the form */}
				<Button color='warning' onClick={handleResetForm}>
					Reset
				</Button>
				<Button color='info' onClick={formik.handleSubmit}>
					Save
				</Button>
			</ModalFooter>
		</Modal>
	);
};
// Prop types definition for ItemAddModal component
ItemAddModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};
export default ItemAddModal;
function async() {
	throw new Error('Function not implemented.');
}
