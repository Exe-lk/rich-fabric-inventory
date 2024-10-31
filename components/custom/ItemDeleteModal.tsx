import React, { FC } from 'react';
import PropTypes from 'prop-types';
import Modal, { ModalBody, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import Button from '../bootstrap/Button';
import Swal from 'sweetalert2';
import {
	useDeleteLotMutation,
	useGetDeletedLotsQuery,
	useUpdateLotMutation,
} from '../../redux/slices/stockInAPISlice';

interface CategoryEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

const CategoryEditModal: FC<CategoryEditModalProps> = ({ id, isOpen, setIsOpen }) => {
	const { data: lot, error, isLoading } = useGetDeletedLotsQuery(undefined);
	const [updatelot] = useUpdateLotMutation();
	const [deletelot] = useDeleteLotMutation();
	const { refetch } = useGetDeletedLotsQuery(undefined);

	const handleClickDelete = async (lot: any) => {
		try {
			const { value: inputText } = await Swal.fire({
				title: 'Are you sure?',
				text: 'Please type "DELETE" to confirm ',
				input: 'text',
				icon: 'warning',
				inputValidator: (value) => {
					if (value !== 'DELETE') {
						return 'You need to type "DELETE" to confirm!';
					}
				},
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, delete it!',
			});
			if (inputText === 'DELETE') {
				await deletelot(lot.id).unwrap();
				Swal.fire('Deleted!', 'The stock has been deleted.', 'success');
				refetch();
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete stock.', 'error');
		}
	};

	const handleClickRestore = async (lot: any) => {
		try {
			const result = await Swal.fire({
				title: 'Are you sure?',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, Restore it!',
			});
			if (result.isConfirmed) {
				const values = await {
					...lot,
					status: true,
				};
				await updatelot(values);
				Swal.fire('Restored!', 'The stock has been restored.', 'success');
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete stock.', 'error');
		}
	};

	const handleDeleteAll = async () => {
		if (lot.length == 0) {
			return;
		}
		try {
			const { value: inputText } = await Swal.fire({
				title: 'Are you sure?',
				text: 'Please type "DELETE ALL" to confirm deleting all stock',
				input: 'text',
				icon: 'warning',
				inputValidator: (value) => {
					if (value !== 'DELETE ALL') {
						return 'You need to type "DELETE ALL" to confirm!';
					}
				},
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, delete all!',
			});

			if (inputText === 'DELETE ALL') {
				Swal.fire({
					title: 'Processing...',
					html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
					allowOutsideClick: false,
					showCancelButton: false,
					showConfirmButton: false,
				});
				for (const lots of lot) {
					await deletelot(lots.id).unwrap();
				}
				Swal.fire('Deleted!', 'All stock have been deleted.', 'success');
				refetch();
			}
		} catch (error) {
			Swal.fire('Error', 'Failed to delete all stock.', 'error');
		}
	};

	// Handle restore all categories
	const handleRestoreAll = async () => {
		if (lot.length == 0) {
			return;
		}
		try {
			const result = await Swal.fire({
				title: 'Are you sure?',
				text: 'This will restore all stock.',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, restore all!',
			});

			if (result.isConfirmed) {
				for (const lots of lot) {
					const values = {
						...lots,
						status: true,
					};
					await updatelot(values).unwrap();
				}
				Swal.fire('Restored!', 'All stock have been restored.', 'success');
				refetch();
			}
		} catch (error) {
			Swal.fire('Error', 'Failed to restore all stock.', 'error');
		}
	};

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'Recycle Bin'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<table className='table table-hover table-bordered border-primary'>
					<thead className={'table-dark border-primary'}>
						<tr>
							<th>Code</th>
							<th>GRN number</th>
							<th>
								<Button
									icon='Delete'
									onClick={handleDeleteAll}
									color='danger'
									isLight>
									Delete All
								</Button>
								<Button
									icon='Restore'
									className='ms-3'
									onClick={handleRestoreAll}
									color='primary'>
									Restore All
								</Button>
							</th>
						</tr>
					</thead>
					<tbody>
						{isLoading && (
							<tr>
								<td>Loading...</td>
							</tr>
						)}
						{error && (
							<tr>
								<td>Error fetching categories.</td>
							</tr>
						)}
						{lot &&
							lot.map((lot: any) => (
								<tr key={lot.id}>
									<td>{lot.code}</td>
									<td>{lot.GRN_number}</td>
									<td>
										<Button
											icon='Restore'
											tag='a'
											color='info'
											onClick={() => handleClickRestore(lot)}>
											Restore
										</Button>
										<Button
											className='m-2'
											icon='Delete'
											color='danger'
											onClick={() => handleClickDelete(lot)}>
											Delete
										</Button>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</ModalBody>
		</Modal>
	);
};

CategoryEditModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default CategoryEditModal;
