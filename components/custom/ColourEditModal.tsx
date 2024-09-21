import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import {
	useUpdateColorMutation,
	useGetColorsQuery,
} from '../../redux/slices/colorApiSlice';
import Swal from 'sweetalert2';

// Define the props for the CategoryEditModal component
interface CategoryEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

// CategoryEditModal component definition
const CategoryEditModal: FC<CategoryEditModalProps> = ({ id, isOpen, setIsOpen }) => {
	// Initialize formik for form management
	const { data: color } = useGetColorsQuery(undefined);
	const [updateColor, { isLoading }] = useUpdateColorMutation();

	const ColorToEdit = color?.find((color: any) => color.id === id);


	const formik = useFormik({
		initialValues: {
			id:  ColorToEdit?.id,
			name:  ColorToEdit?.name || '',
		},
		enableReinitialize: true,
		validate: (values) => {
			const errors: {
				name?: string;
			} = {};
			if (!values.name) {
				errors.name = 'Required';
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
				await updateColor(values).unwrap();

				Swal.fire('Added!', 'Color has been update successfully.', 'success');
				formik.resetForm();
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				alert('An error occurred during file upload. Please try again later.');
			}
		},
	});

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'Edit Color'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup id='name' label='Color name' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.name}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
						
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
