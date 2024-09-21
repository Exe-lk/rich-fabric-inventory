import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import showNotification from '../extras/showNotification';
import Icon from '../icon/Icon';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../../firebaseConfig';
import Swal from 'sweetalert2';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Select from '../bootstrap/forms/Select';
import Option from '../bootstrap/Option';
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
// UserEditModal component definition
const UserEditModal: FC<UserEditModalProps> = ({ id, isOpen, setIsOpen, refetch }) => {
	const [user, setUser] = useState<User>({
		cid: '',
		name: '',
		mobile: '',
		email: '',
		nic: '',
		status: true,
	});
	const { data: userData, isSuccess } = useGetCustomersQuery(id);
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
		enableReinitialize: true, // Reinitialize formik when the user data is updated
		validate: (values) => {
			const errors: Partial<User> = {};
			if (!values.name) {
				errors.name = 'Required';
			}
			if (!values.mobile) {
				errors.mobile = 'Required';
			}
			if (!values.email) {
				errors.email = 'Required';
			}
			if (!values.nic) {
				errors.nic = 'Required';
			}
			return errors;
		},
		onSubmit: async (values) => {
			try {
				await updateUser(values).unwrap();
				setIsOpen(false);

				Swal.fire('Updated!', 'User has been updated successfully.', 'success');
				refetch(); // Trigger refetch of users list after update
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

// Prop types definition for CustomerEditModal component
UserEditModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};
export default UserEditModal;
