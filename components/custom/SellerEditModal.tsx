import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import Icon from '../icon/Icon';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import Swal from 'sweetalert2';
import Select from '../bootstrap/forms/Select';
import Option, { Options } from '../bootstrap/Option';
import {
	useUpdateSupplierMutation,
	useGetSuppliersQuery,
} from '../../redux/slices/supplierAPISlice';

interface Category {
	categoryId: string;
	categoryname: string;
}
interface Item {
	itemId: string;
	name: string;
	category: string;
}
// Define the props for the SellerAddModal component
interface SellerAddModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

interface Seller {
	cid: string;
	name: string;
	phone: string;
	email: string;
	company_name: string;
	company_email: string;
	product: { category: string; name: string }[];
	status: boolean;
}
// SellerAddModal component definition
const SellerAddModal: FC<SellerAddModalProps> = ({ id, isOpen, setIsOpen }) => {
	const initialSellerData: Seller = {
		cid: '',
		name: '',
		phone: '',
		email: '',
		company_name: '',
		company_email: '',
		product: [{ category: '', name: '' }],
		status: true,
	};

	const [categories, setCategories] = useState<Category[]>([]);
	const [items, setItems] = useState<Item[]>([]);
	const [seller, setSeller] = useState<Seller>(initialSellerData);

	const { data: supplier } = useGetSuppliersQuery(undefined);
	const [updateSupplier, { isLoading }] = useUpdateSupplierMutation();

	const SupplierToEdit = supplier?.find((supplier: any) => supplier.id === id);

	// Initialize formik for form management
	const formik = useFormik({
		initialValues: {
			id: SupplierToEdit?.id,
			name: SupplierToEdit?.name || '',
			phone: SupplierToEdit?.phone || '',
			email: SupplierToEdit?.email || '',
			company_name: SupplierToEdit?.company_name || '',
			company_email: SupplierToEdit?.company_email || '',
			product: [{ category: '', name: '' }],
		},
		enableReinitialize: true,
		validate: (values) => {
      const errors: {
				name?: string;
				phone?: string;
				email?: string;
				company_name?: string;
				company_email?: string;
				products?: string[];
			} = {};
			if (!values.name) {
				errors.name = 'Required';
			}
			if (!values.phone) {
				errors.phone = 'Required';
			}
			if (!values.email) {
				errors.email = 'Required';
			}
			if (!values.company_name) {
				errors.company_name = 'Required';
			}
			if (!values.company_email) {
				errors.company_email = 'Required';
			}
			// if (!values.product) {
			// 	errors.product = 'Required';
			// }
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
				await updateSupplier(values).unwrap();

				Swal.fire('Added!', 'Supplier has been update successfully.', 'success');
				
				formik.resetForm();
				setIsOpen(false)
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				Swal.close();
				alert('An error occurred during file upload. Please try again later.');
			}
		},
	});

	// Function to handle adding a new product input field
	const addProductField = () => {
		const newProducts = [...seller.product, { category: '', name: '' }];
		setSeller({ ...seller, product: newProducts });
	};

	const removeProductField = (index: number) => {
		const newProducts = [...seller.product];
		newProducts.splice(index, 1);
		setSeller({ ...seller, product: newProducts });
	};

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'Edit Supplier'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup id='name' label='Name' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.name}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='phone' label='Phone' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.phone}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='email' label='Email' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.email}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='company_name' label='Company name' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.company_name}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='company_email' label='company email' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.company_email}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>

					{/* {formik.values.product.map((product, index) => (
						<FormGroup
							key={index}
							id={`product-${index}`}
							label={`Product ${index + 1}`}
							className='col-md-6'>
							<div className='d-flex align-items-center'>
								<Select
									ariaLabel='Select Product'
									value={product.category} // Use category value
									onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
										const newProducts = [...formik.values.product];
										newProducts[index] = {
											...newProducts[index],
											category: event.target.value,
										}; // Update category
										formik.setFieldValue('product', newProducts);
									}}>
									<Option value='' disabled>
										Select Product
									</Option>
									{categories.map((category) => (
										<Option
											key={category.categoryId}
											value={category.categoryname}>
											{category.categoryname}
										</Option>
									))}
								</Select>
								{product.category && ( // Show item dropdown only when category is selected
									<Select
										ariaLabel={`Select item for ${product.category}`} // Use selected category
										value={product.name} // Use item name value
										onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
											const newProducts = [...formik.values.product];
											newProducts[index] = {
												...newProducts[index],
												name: event.target.value,
											}; // Update item name
											formik.setFieldValue('product', newProducts);
										}}>
										<Option value='' disabled>
											Select Item
										</Option>
										{items
											.filter((item) => item.category === product.category) // Filter items based on selected category
											.map((item) => (
												<Option key={item.itemId} value={item.name}>
													{item.name}
												</Option>
											))}
									</Select>
								)}
								<button
									type='button'
									onClick={() => removeProductField(index)}
									className='btn btn-outline-danger ms-2'>
									<Icon icon='Delete' />
								</button>
							</div>
						</FormGroup>
					))} */}

					{/* Button to add new product input field */}
					{/* <div className='col-md-12'>
						<Button color='info' onClick={addProductField}>
							Add Product
						</Button>
					</div> */}
				</div>
			</ModalBody>
			<ModalFooter className='px-4 pb-4'>
				{/* Save button to submit the form */}
				<Button color='info' onClick={formik.handleSubmit}>
					Save
				</Button>
			</ModalFooter>
		</Modal>
	);
};
// Prop types definition for SellerEditModal component
SellerAddModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};
export default SellerAddModal;
