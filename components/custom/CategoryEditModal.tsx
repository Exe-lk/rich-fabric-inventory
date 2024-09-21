import React, { FC, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import Icon from '../icon/Icon';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import Swal from 'sweetalert2';
import {
	useUpdateCategoryMutation,
	useGetCategoriesQuery,
} from '../../redux/slices/categoryApiSlice';

interface CategoryEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

const CategoryEditModal: FC<CategoryEditModalProps> = ({ id, isOpen, setIsOpen }) => {
	const { data: categories } = useGetCategoriesQuery(undefined);
	const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

	const categoryToEdit = categories?.find((category: any) => category.id === id);

	const formik = useFormik({
		initialValues: {
			id: '',
			categoryname: categoryToEdit?.name || '',
			subcategory: categoryToEdit?.subcategory || [''],
		},
		enableReinitialize: true, // This allows the form to reinitialize when categoryToEdit changes
		validate: (values) => {
			const errors: { categoryname?: string; subcategory?: string } = {};
			if (!values.categoryname) {
				errors.categoryname = 'Required';
			}
			return errors;
		},
		onSubmit: async (values) => {
			try {
				const process = Swal.fire({
					title: 'Processing...',
					html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
					allowOutsideClick: false,
					showCancelButton: false,
					showConfirmButton: false,
				});

				try {
					// Update the category
					console.log(values);
					const data = {
						name: values.categoryname,
						subcategory: values.subcategory,
						status: true,
						id: id,
					};
					await updateCategory(data).unwrap();

					// Success feedback
					await Swal.fire({
						icon: 'success',
						title: 'Category Updated Successfully',
					});
					setIsOpen(false); // Close the modal after successful update
				} catch (error) {
					await Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Failed to update the category. Please try again.',
					});
				}
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				alert('An error occurred during file upload. Please try again later.');
			}
		},
	});

	// Functions to handle adding/removing subcategories
	const addSubcategoryField = () => {
		formik.setValues({
			...formik.values,
			subcategory: [...formik.values.subcategory, ''],
		});
	};

	const removeSubcategoryField = (index: number) => {
		const newSubcategories = [...formik.values.subcategory];
		newSubcategories.splice(index, 1);
		formik.setValues({
			...formik.values,
			subcategory: newSubcategories,
		});
	};

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'Edit Category'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup
						id='categoryname'
						label='Category Name'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Input
							name='categoryname'
							onChange={formik.handleChange}
							value={formik.values.categoryname}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					{formik.values.subcategory.map((sub: any, index: any) => (
						<FormGroup
							key={index}
							id={`subcategory-${index}`}
							label={`Sub Category ${index + 1}`}
							className='col-md-6'>
							<div className='d-flex align-items-center'>
								<Input
									name={`subcategory[${index}]`}
									onChange={formik.handleChange}
									value={formik.values.subcategory[index]}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									validFeedback='Looks good!'
								/>
								<button
									type='button'
									onClick={() => removeSubcategoryField(index)}
									className='btn btn-outline-danger ms-2'>
									<Icon icon='Delete' />
								</button>
							</div>
						</FormGroup>
					))}
					<div className='col-md-12'>
						<Button color='info' onClick={addSubcategoryField}>
							Add Sub Category
						</Button>
					</div>
				</div>
			</ModalBody>
			<ModalFooter className='px-4 pb-4'>
				<Button color='info' onClick={formik.handleSubmit}>
					Save
				</Button>
			</ModalFooter>
		</Modal>
	);
};

CategoryEditModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default CategoryEditModal;
