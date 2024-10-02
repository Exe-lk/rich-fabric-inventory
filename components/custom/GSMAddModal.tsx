import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, {ModalBody,ModalFooter,ModalHeader,ModalTitle,} from '../bootstrap/Modal';
import showNotification from '../extras/showNotification';
import Icon from '../icon/Icon';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import Swal from 'sweetalert2';
import { useGetGSMsQuery,useAddGSMMutation} from '../../redux/slices/gsmApiSlice';


// Define the props for the CategoryEditModal component
interface CategoryEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}
// CategoryEditModal component definition
const CategoryEditModal: FC<CategoryEditModalProps> = ({ id, isOpen, setIsOpen }) => {
     // Initialize formik for form management
	const [addgsm , {isLoading}] = useAddGSMMutation();
	const {refetch} = useGetGSMsQuery(undefined);

	
	const formik = useFormik({
        initialValues: {
			name: '',
			status:true
		},
		validate: (values) => {
			const errors: {
				categoryname?: string;
			} = {};
			if (!values.name) {
				errors.categoryname = 'Required';
			}
			return errors;
		},
		onSubmit: async (values) => {
			try {
				// Show a processing modal
				const process = Swal.fire({
					title: 'Processing...',
					html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
					allowOutsideClick: false,
					showCancelButton: false,
					showConfirmButton: false,
				});
				
			
					// Add the new category
					const response: any = await addgsm(values).unwrap();
					console.log(response);

					// Refetch categories to update the list
					refetch();

					// Success feedback
					await Swal.fire({
						icon: 'success',
						title: 'GSM added Successfully',
					});
					setIsOpen(false);
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				alert('An error occurred during file upload. Please try again later.');
			}

		},
	});
    return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id="">{'New GSM'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup id='name' label='GSM Name' className='col-md-6'>
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
CategoryEditModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};
export default CategoryEditModal;



