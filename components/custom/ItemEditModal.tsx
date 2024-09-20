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
import { useUpdateLotMutation, useGetLotsQuery } from '../../redux/slices/lotAPISlice';
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
	const [imageurl, setImageurl] = useState<File | null>(null);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [category, setCategory] = useState<Category[]>([]);
	const [subcategories, setSubcategories] = useState<SelectOption[]>([]);
	const [isAddingNewColor, setIsAddingNewColor] = useState(false);
	const [isAddingNewFabric, setIsAddingNewFabric] = useState(false);
	const [isAddingNewGSM, setIsAddingNewGSM] = useState(false);
	const [isAddingNewKnitType, setIsAddingNewKnitType] = useState(false); //
	const [selectedOption, setSelectedOption] = useState<string>('');

	const { data: lots } = useGetLotsQuery(undefined);
	const [updateLot, { isLoading }] = useUpdateLotMutation();

	const lotToEdit = lots?.find((lot: any) => lot.id === id);

	const { refetch } = useGetLotsQuery(undefined);
	const { data: fabric } = useGetFabricsQuery(undefined);
	const { data: gsm } = useGetGSMsQuery(undefined);
	const { data: knit } = useGetKnitTypesQuery(undefined);
	const { data: categories } = useGetCategoriesQuery(undefined);
	const { data: color } = useGetColorsQuery(undefined);

	const formik = useFormik({
		initialValues: {
			type: lotToEdit?.type || selectedOption,
			id: lotToEdit?.id,
			date: lotToEdit?.date || '',
			code: lotToEdit?.code,
			description: lotToEdit?.description || '',
			color: lotToEdit?.color || '',
			fabric_type: lotToEdit?.fabric_type || '',
			gsm: lotToEdit?.gsm || '',
			width: lotToEdit?.width || '',
			knit_type: lotToEdit?.knit_type || '',
			GRN_number: lotToEdit?.GRN_number || '',
			uom: lotToEdit?.uom || '',
			status: lotToEdit?.status || true,
			category: lotToEdit?.category || '',
			subcategory: lotToEdit?.subcategory || '',
			stockOutId: lotToEdit?.stockOutId || '',
			FinishType: lotToEdit?.FinishType || '',
			PackType: lotToEdit?.PackType || '',
			remark: lotToEdit?.remark || '',
			supplier: lotToEdit?.supplier || '',
			yarn_type: lotToEdit?.yarn_type || '',
			collor_cuff_type: lotToEdit?.collor_cuff_type || '',
			suppl_gatepass_no: lotToEdit?.suppl_gatepass_no || '',
			suppl_invoice_no: lotToEdit?.suppl_invoice_no || '',
			operater: lotToEdit?.operater || '',
		},
		enableReinitialize: true,
		validate: (values) => {
			const errors: Record<string, string> = {};
			// if (!values.code) errors.code = 'Required';
			// if (!values.description) errors.description = 'Required';
			// if (!values.color) errors.color = 'Required';
			// if (!values.fabric_type) errors.fabric_type = 'Required';
			// if (!values.gsm) errors.gsm = 'Required';
			// if (!values.width) errors.width = 'Required';
			// if (!values.knit_type) errors.knit_type = 'Required';
			// if (!values.GRA_number) errors.GRA_number = 'Required';
			// if (!values.GRN_number) errors.GRN_number = 'Required';
			// if (!values.supplier) errors.supplier = 'Required';
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
				await updateLot(values).unwrap();

				Swal.fire('Added!', 'Lot has been update successfully.', 'success');

				formik.resetForm();
				setIsOpen(false);
				
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
		setSelectedOption(e.target.value);
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
								validFeedback='Looks good!'>
								{categories &&
									categories.map((category: any) => (
										<>
											<Option value={category.name}>{category.name}</Option>
										</>
									))}
							</Select>
						</FormGroup>
					)}
					<FormGroup id='subcategory' label='Sub Category' className='col-md-6'>
						<Select
							ariaLabel='Default select example'
							placeholder='Open this select sub category'
							onChange={formik.handleChange}
							value={formik.values.subcategory}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'>
							{subcategories &&
								subcategories.map((category: any) => (
									<>
										<Option value={category.value}>{category.label}</Option>
									</>
								))}
						</Select>
					</FormGroup>

					{selectedOption === 'Finish Fabric' && (
						<>
							<FormGroup id='stockOutId' label='Stock Out ID' className='col-md-6'>
								<Input
									onChange={formik.handleChange}
									value={formik.values.stockOutId}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
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
										validFeedback='Looks good!'
									/>
								)}
							</FormGroup>
						</>
					)}

					<FormGroup id='code' label='GRN number' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.code}
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
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='description' label='Description' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.description}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>

					<FormGroup id='uom' label='UOM' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.uom}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>

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
												value={formik.values.fabric_type}
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
												value={formik.values.fabric_type}>
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
												value={formik.values.fabric_type}
											/>
										) : (
											<Select
												ariaLabel='Fabric type select'
												onChange={(e: any) => {
													if (e.target.value === 'Add new') {
														setIsAddingNewFabric(true);
													} else {
														formik.handleChange(e);
													}
												}}
												value={formik.values.fabric_type}>
												<Option value=''>Select Fabric Type</Option>
												<Option value='Add new'>Add New</Option>
												{/* Existing fabric type options can be dynamically loaded here */}

												{fabric &&
													fabric.map((fabric: any) => (
														<>
															<Option value={fabric.name}>
																{fabric.name}
															</Option>
														</>
													))}
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
										value={formik.values.gsm}>
										<Option value=''>Select GSM</Option>
										<Option value='Add new'>Add New</Option>
										{gsm &&
											gsm.map((gsm: any) => (
												<>
													<Option value={gsm.name}>{gsm.name}</Option>
												</>
											))}
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

					<FormGroup
						id='FinishType'
						label='Number of rolls or bales'
						className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.FinishType}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
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
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='supplier' label='Supplier/Customer' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.supplier}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
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
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='operater' label='Operator name' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.operater}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='suppl_invoice_no' label='invoice number ' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.suppl_invoice_no}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>

					{selectedOption === 'grayFabric' && (
						<>
							<FormGroup id='supplier' label=' Machine Number ' className='col-md-6'>
								<Input
									onChange={formik.handleChange}
									// value={formik.values.suppl_invoice_no}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									validFeedback='Looks good!'
								/>
							</FormGroup>
							<FormGroup id='supplier' label='Operator Name' className='col-md-6'>
								<Input
									onChange={formik.handleChange}
									// value={formik.values.suppl_invoice_no}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
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
