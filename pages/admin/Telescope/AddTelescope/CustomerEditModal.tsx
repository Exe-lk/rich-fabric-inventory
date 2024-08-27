import React, { useState, useEffect, FC } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import Button from '../../../../components/bootstrap/Button';
import Swal from 'sweetalert2';
import PostDataService from '../../../../services/postservice';



// Define the props for the CustomerEditModal component
interface ICustomerEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

// CustomerEditModal component definition
const CustomerEditModal: FC<ICustomerEditModalProps> = ({ id, isOpen, setIsOpen }) => {

	// Initialize formik for form management
	const formik = useFormik({

		initialValues: {

			TelescopeID: "",
			Location: '',
			longitude: "",
			latitude: '',
			severURL: '',
			status: 1

		}
		,
		validate: (values) => {
			const errors: {
				TelescopeID?: string;
				Location?: string;
				Longitude?: string;
				Latitude?: string;
				severURL?: string;

			} = {};
			if (!values.TelescopeID) {
				errors.TelescopeID = 'Required';
			}
			if (!values.Location) {
				errors.Location = 'Required';
			}
			if (!values.longitude) {
				errors.Longitude = 'Required';
			}
			if (!values.latitude) {
				errors.Latitude = 'Required';
			}
			if (!values.severURL) {
				errors.severURL = 'Required';
			}
			return errors;
		},
		onSubmit: async (values) => {

			try {
				const processingPopup = Swal.fire({
					title: "Processing...",
					html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
					allowOutsideClick: false,
					showCancelButton: false,
					showConfirmButton: false,
				});
				console.log(values)
				PostDataService(`telescopes/${values.TelescopeID}`, values)
					.then((res: any) => {

						Swal.fire('Updated!', 'Telescope has been update.', 'success');
					})
					.catch((err) => {
						console.error('Error fetching data: ', err);
					});
			} catch (error) {
				Swal.fire('Network Error', 'Please try again later', 'error');
			}
		},
	});

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='lg' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id="">{'New Customer'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>

					<FormGroup id='TelescopeID' label='Telescope ID' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.TelescopeID}

							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.TelescopeID}
							invalidFeedback={formik.errors.TelescopeID}
							validFeedback='Looks good!'


						/>
					</FormGroup>
					<FormGroup id='Location' label='Location' className='col-md-6'>
						<Input
							required

							onChange={formik.handleChange}
							value={formik.values.Location}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.Location}
							invalidFeedback={formik.errors.Location}
							validFeedback='Looks good!'

						/>
					</FormGroup>
					<FormGroup id='longitude' label='Longitude' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.longitude}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.longitude}
							invalidFeedback={formik.errors.longitude}
							validFeedback='Looks good!'


						/>
					</FormGroup>
					<FormGroup id='latitude' label='Latitude' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.latitude}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.latitude}
							invalidFeedback={formik.errors.latitude}
							validFeedback='Looks good!'


						/>
					</FormGroup>
					<FormGroup id='severURL' label='severURL' className='col-md-6'>
						<Input

							onChange={formik.handleChange}
							value={formik.values.severURL}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.severURL}
							invalidFeedback={formik.errors.severURL}
							validFeedback='Looks good!'


						/>
					</FormGroup>





				</div>
			</ModalBody>
			<ModalFooter className='px-4 pb-4'>
				{/* Save button to submit the form */}
				<Button color='info' onClick={formik.handleSubmit} >
					Save
				</Button>
			</ModalFooter>
		</Modal>
	);
}
// If 'id' is not present, return null (modal won't be rendered)



// Prop types definition for CustomerEditModal component
CustomerEditModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default CustomerEditModal;
