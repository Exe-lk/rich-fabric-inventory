import React, { FC } from 'react';
import PropTypes from 'prop-types';
import Modal, { ModalBody, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import Button from '../bootstrap/Button';
import Swal from 'sweetalert2';
import {
	useDeleteCategoryMutation,
	useGetDeleteCategoriesQuery,
	useUpdateCategoryMutation,
} from '../../redux/slices/categoryApiSlice';

interface CategoryEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

const CategoryEditModal: FC<CategoryEditModalProps> = ({ id, isOpen, setIsOpen }) => {
	const { data: categories, error, isLoading } = useGetDeleteCategoriesQuery(undefined);
	const [updateCategory] = useUpdateCategoryMutation();
	const [deleteCategory] = useDeleteCategoryMutation();
	const { refetch } = useGetDeleteCategoriesQuery(undefined);

	const handleClickDelete = async (category: any) => {
		try {
			const { value: inputText } = await Swal.fire({
				title: 'Are you sure?',
				text: 'Please type "DELETE" to confirm',
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
				await deleteCategory(category.id).unwrap();
				Swal.fire('Deleted!', 'The category has been deleted.', 'success');
				refetch();
			}
		} catch (error) {
			console.error('Error deleting category:', error);
			Swal.fire('Error', 'Failed to delete category.', 'error');
		}
	};

	const handleClickRestore = async (category: any) => {
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
					id: category.id,
					name: category.name,
					status: true,
					subcategory: category.subcategory,
				};
				await updateCategory(values);
				Swal.fire('Restored!', 'The category has been restored.', 'success');
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			Swal.fire('Error', 'Failed to delete category.', 'error');
		}
	};

	const handleDeleteAll = async () => {
		if (categories.length == 0) {
			return;
		}
		try {
			const { value: inputText } = await Swal.fire({
				title: 'Are you sure?',
				text: 'Please type "DELETE ALL" to confirm deleting all categories',
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
				for (const category of categories) {
					await deleteCategory(category.id).unwrap();
				}
				Swal.fire('Deleted!', 'All categories have been deleted.', 'success');
				refetch();
			}
		} catch (error) {
			console.error('Error deleting all categories:', error);
			Swal.fire('Error', 'Failed to delete all categories.', 'error');
		}
	};

	// Handle restore all categories
	const handleRestoreAll = async () => {
		if (categories.length == 0) {
			return;
		}
		try {
			const result = await Swal.fire({
				title: 'Are you sure?',
				text: 'This will restore all categories.',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, restore all!',
			});
			if (result.isConfirmed) {
				for (const category of categories) {
					const values = {
						id: category.id,
						name: category.name,
						status: true,
						subcategory: category.subcategory,
					};
					await updateCategory(values).unwrap();
				}
				Swal.fire('Restored!', 'All categories have been restored.', 'success');
				refetch();
			}
		} catch (error) {
			console.error('Error restoring all categories:', error);
			Swal.fire('Error', 'Failed to restore all categories.', 'error');
		}
	};

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'New Category'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
			<table className='table table-hover table-bordered border-primary'>
			<thead className={'table-dark border-primary'}>
						<tr>
							<th>Category name</th>
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
						{categories &&
							categories.map((category: any) => (
								<tr key={category.cid}>
									<td>{category.name}</td>
									<td>
										<Button
											icon='Restore'
											tag='a'
											color='info'
											onClick={() => handleClickRestore(category)}>
											Restore
										</Button>

										<Button
											className='m-2'
											icon='Delete'
											color='danger'
											onClick={() => handleClickDelete(category)}>
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
