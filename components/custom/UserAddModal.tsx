import React, { FC} from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import Swal from 'sweetalert2';
import Select from '../bootstrap/forms/Select';
import Option from '../bootstrap/Option';
import { useAddUserMutation } from '../../redux/slices/userManagementApiSlice';
import { useGetUsersQuery } from '../../redux/slices/userManagementApiSlice';

interface UserAddModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

const UserAddModal: FC<UserAddModalProps> = ({ id, isOpen, setIsOpen }) => {
	const [addUser] = useAddUserMutation();
	const { refetch } = useGetUsersQuery(undefined);

	// Initialize formik for form management
	const formik = useFormik({
		initialValues: {
			name: '',
			role: '',
			nic: '',
			email: '',
			mobile: '',
			machin_No: '',
			status: true,
		},
		validate: (values) => {
			const errors: {
				role?: string;
				name?: string;
				nic?: string;
				email?: string;
				password?: string;
				mobile?: string;
			} = {};
			if (!values.role) {
				errors.role = 'Required';
			}
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
				Swal.fire({
					title: 'Processing...',
					html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
					allowOutsideClick: false,
					showCancelButton: false,
					showConfirmButton: false,
				});

				try {
					await addUser(values).unwrap();
					refetch();
					await Swal.fire({
						icon: 'success',
						title: 'User Created Successfully',
					});
					formik.resetForm();
					setIsOpen(false);
				} catch (error) {
					console.error('Error during handleSubmit: ', error);
					await Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Failed to add the user. Please try again.',
					});
				}
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				Swal.close;
				alert('An error occurred during file upload. Please try again later.');
			}
		},
	});
	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader
				setIsOpen={() => {
					setIsOpen(false);
					formik.resetForm();
				}}
				className='p-4'>
				<ModalTitle id=''>{'New User'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup id='name' label='Name' className='col-md-6'>
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
					<FormGroup id='role' label='Role' className='col-md-6'>
						<Select
							ariaLabel='Default select example'
							placeholder='Select user role'
							onChange={(e) => {
								formik.handleChange(e);
							}}
							value={formik.values.role}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.role}
							invalidFeedback={formik.errors.role}>
							<Option value={'cashier'}>Cashier</Option>
							<Option value={'employee'}>Employee</Option>
						</Select>
					</FormGroup>
					<FormGroup id='mobile' label='Mobile number' className='col-md-6'>
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
					<FormGroup id='nic' label='NIC' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.nic}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.nic}
							invalidFeedback={formik.errors.nic}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='email' label='Email' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.email}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.email}
							invalidFeedback={formik.errors.email}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					{formik.values.role === 'employee' && (
						<FormGroup id='machin_No' label='Machine Number' className='col-md-6'>
							<Input
								onChange={formik.handleChange}
								value={formik.values.machin_No}
								onBlur={formik.handleBlur}
								isValid={formik.isValid}
								isTouched={formik.touched.machin_No}
								invalidFeedback={formik.errors.machin_No}
								validFeedback='Looks good!'
							/>
						</FormGroup>
					)}
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

UserAddModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};
export default UserAddModal;
