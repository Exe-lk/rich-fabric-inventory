import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import Swal from 'sweetalert2';
import { useGetLotsQuery } from '../../redux/slices/stockInAPISlice';
import { useGetStockOutsQuery, useAddStockOutMutation } from '../../redux/slices/stockOutApiSlice';

// Define the props for the CategoryEditModal component
interface CategoryEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

// CategoryEditModal component definition
const CategoryEditModal: FC<CategoryEditModalProps> = ({ id, isOpen, setIsOpen }) => {
	// Initialize formik for form management
	const { data: data } = useGetLotsQuery(undefined);

	const stockToEdit = data?.find((data: any) => data.id === id);
	const currentTime = new Date().toLocaleTimeString('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
	});
	const [addstock, { isLoading }] = useAddStockOutMutation();
	const { refetch } = useGetStockOutsQuery(undefined);
	const currentDate = new Date();
	const year = currentDate.getFullYear();
	const month = String(currentDate.getMonth() + 1).padStart(2, '0');
	const day = String(currentDate.getDate()).padStart(2, '0');
	const formattedDate1 = `${year}-${month}-${day}`;

	const formik = useFormik({
		initialValues: {
			code: stockToEdit?.code,
			stock_id: stockToEdit?.id,
			GRN_number: stockToEdit?.GRN_number || '',
			quentity: '',
			location: '',
			stock_received: 'Yarn Transaction',
			type: 'Yarn',
			date: formattedDate1,
			time: currentTime,
		},
		enableReinitialize: true,
		validate: (values) => {
			const errors: {
				quentity?: string;
				location?: string;
			} = {};
			if (!values.quentity) {
				errors.quentity = 'Required';
			}
			if (!values.location) {
				errors.location = 'Required';
			}
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

				const response: any = await addstock(values).unwrap();
				// Refetch categories to update the list
				refetch();

				Swal.fire('Added!', 'data has been update successfully.', 'success');
				formik.resetForm();
				setIsOpen(false)
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				alert('An error occurred during file upload. Please try again later.');
			}
		},
	});

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'Stock Transaction'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup id='name' label='GRN Number' className='col-md-6'>
						<Input
							disabled
							onChange={formik.handleChange}
							value={formik.values.GRN_number}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='quentity' label='Quantity' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.quentity}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.quentity}
							invalidFeedback={formik.errors.quentity}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='location' label='Location' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.location}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.location}
							invalidFeedback={formik.errors.location}
							validFeedback='Looks good!'
						/>
					</FormGroup>
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
// Prop types definition for CustomerEditModal component
CategoryEditModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};
export default CategoryEditModal;
