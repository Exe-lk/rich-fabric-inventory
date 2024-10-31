import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import Swal from 'sweetalert2';
import {
	useGetCustomersQuery,
	useUpdateCustomerMutation,
} from '../../redux/slices/coustomerApiSlice';
interface UserEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
	refetch(...args: unknown[]): unknown;
}
interface User {
	cid: string;
	name: string;
	mobile: string;
	email?: string;
	nic?: string;
	status?: boolean;
}

const UserEditModal: FC<UserEditModalProps> = ({ id, isOpen, setIsOpen, refetch }) => {
	const { data: userData } = useGetCustomersQuery(id);
	const UserToEdit = userData?.find((userData: any) => userData.id === id);
	const [updateUser] = useUpdateCustomerMutation();

	const formik = useFormik({
		initialValues: {
			name: UserToEdit?.name,
			id: UserToEdit?.id,
			mobile: UserToEdit?.mobile,
			email: UserToEdit?.email,
			nic: UserToEdit?.nic,
		},
		enableReinitialize: true,
		validate: (values) => {
			const errors: Partial<User> = {};
			if (!values.name) {
				errors.name = 'Required';
			}
			if (!values.mobile) {
				errors.mobile = 'Required';
			} else if (values.mobile.length !== 10) {
				errors.mobile = 'Mobile number must be exactly 10 digits';
			} else if (!/^0\d{9}$/.test(values.mobile)) {
				errors.mobile = 'Mobile number must start with 0 and be exactly 10 digits';
			}
			if (!values.nic) {
				errors.nic = 'Required';
			} else if (!/^\d{9}[Vv]$/.test(values.nic) && !/^\d{12}$/.test(values.nic)) {
				errors.nic = 'NIC must be 9 digits followed by "V" or 12 digits';
			}
			if (!values.email) {
				errors.email = 'Required';
			} else if (!values.email.includes('@')) {
				errors.email = 'Invalid email format.';
			} else if (values.email.includes(' ')) {
				errors.email = 'Email should not contain spaces.';
			}
			return errors;
		},
		onSubmit: async (values) => {
			try {
				await updateUser(values).unwrap();
				setIsOpen(false);
				Swal.fire('Updated!', 'User has been updated successfully.', 'success');
				refetch();
				formik.resetForm();
			} catch (error) {
				console.error('Error updating document: ', error);
				alert('An error occurred while updating the document. Please try again later.');
			}
		},
	});

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'Edit User'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup id='name' label='Name' className='col-md-6'>
						<Input
							name='name'
							value={formik.values.name}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.name}
							invalidFeedback={formik.errors.name}
							validFeedback='Looks good!'
						/>
					</FormGroup>

					<FormGroup id='mobile' label='Mobile number' className='col-md-6'>
						<Input
							name='mobile'
							value={formik.values.mobile}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.mobile}
							invalidFeedback={formik.errors.mobile}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='email' label='Email' className='col-md-6'>
						<Input
							name='email'
							value={formik.values.email}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.email}
							invalidFeedback={formik.errors.email}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='nic' label='NIC' className='col-md-6'>
						<Input
							name='nic'
							value={formik.values.nic}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.nic}
							invalidFeedback={formik.errors.nic}
							validFeedback='Looks good!'
						/>
					</FormGroup>
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

UserEditModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};
export default UserEditModal;
