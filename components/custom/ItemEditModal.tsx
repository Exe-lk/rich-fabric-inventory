import React, { FC, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import showNotification from '../extras/showNotification';
import Icon from '../icon/Icon';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import { collection, addDoc, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { firestore, storage } from '../../firebaseConfig';
import Swal from 'sweetalert2';
import Select from '../bootstrap/forms/Select';
import Option from '../bootstrap/Option';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

interface ItemAddModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

interface Category {
	categoryname: string;
	subcategory: string[];
}

interface SelectOption {
	value: string;
	label: string;
}

const ItemAddModal: FC<ItemAddModalProps> = ({ id, isOpen, setIsOpen }) => {
	const [imageurl, setImageurl] = useState<File | null>(null);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [category, setCategory] = useState<Category[]>([]);
	const [subcategories, setSubcategories] = useState<SelectOption[]>([]);
	const [isAddingNewColor, setIsAddingNewColor] = useState(false);
	const [isAddingNewFabric, setIsAddingNewFabric] = useState(false);
	const [isAddingNewGSM, setIsAddingNewGSM] = useState(false);
	const [isAddingNewKnitType, setIsAddingNewKnitType] = useState(false); //
	useEffect(() => {
		const fetchData = async () => {
			try {
				const dataCollection = collection(firestore, 'category');
				const q = query(dataCollection, where('status', '==', true));
				const querySnapshot = await getDocs(q);
				const firebaseData = querySnapshot.docs.map((doc) => doc.data() as Category);
				setCategory(firebaseData);
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};
		fetchData();
	}, []);

	const handleUploadImage = async () => {
		if (imageurl) {
			const storageRef = ref(storage, `item/${imageurl.name}`);
			const uploadTask = uploadBytesResumable(storageRef, imageurl);

			return new Promise((resolve, reject) => {
				uploadTask.on(
					'state_changed',
					(snapshot) => {
						const progress = Math.round(
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100,
						);
					},
					(error) => {
						console.error(error.message);
						reject(error.message);
					},
					() => {
						getDownloadURL(uploadTask.snapshot.ref)
							.then((url) => {
								resolve(url);
							})
							.catch((error) => {
								console.error(error.message);
								reject(error.message);
							});
					},
				);
			});
		} else {
			return '';
		}
	};

	const formik = useFormik({
		initialValues: {
			code: '',
			description: '',
			color: '',
			fabric_type: '',
			gsm: '',
			width: '',
			knit_type: '',
			GRN_number: '',
			GRA_number: '',
			status: true,
			category: '',
			subcategory: '',
		},
		validate: (values) => {
			const errors: Record<string, string> = {};
			if (!values.code) errors.code = 'Required';
			if (!values.description) errors.description = 'Required';
			if (!values.color) errors.color = 'Required';
			if (!values.fabric_type) errors.fabric_type = 'Required';
			if (!values.gsm) errors.gsm = 'Required';
			if (!values.width) errors.width = 'Required';
			if (!values.knit_type) errors.knit_type = 'Required';
			if (!values.GRA_number) errors.GRA_number = 'Required';
			if (!values.GRN_number) errors.GRN_number = 'Required';
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

				const imgurl = await handleUploadImage();
				values.status = true;

				const collectionRef = doc(firestore, 'item', id);
				await setDoc(collectionRef, { ...values, imageUrl: imgurl });

				setIsOpen(false);
				showNotification(
					<span className='d-flex align-items-center'>
						<Icon icon='Info' size='lg' className='me-1' />
						<span>Successfully Added</span>
					</span>,
					'Stock has been added successfully',
				);
				Swal.fire('Added!', 'Stock has been added successfully.', 'success');
				formik.resetForm();
				setSelectedImage(null);
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				Swal.close();
				alert('An error occurred during file upload. Please try again later.');
			}
		},
	});

	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedCategory = e.target.value;
		formik.handleChange(e);

		const selectedCategoryData = category.find((cat) => cat.categoryname === selectedCategory);
		if (selectedCategoryData) {
			const options = selectedCategoryData.subcategory.map((subcat) => ({
				value: subcat,
				label: subcat,
			}));
			setSubcategories(options);
		} else {
			setSubcategories([]);
		}
	};

	const handleResetForm = () => {
		formik.resetForm();
		setSelectedImage(null);
		setIsAddingNewColor(false);
		setIsAddingNewFabric(false);
		setIsAddingNewGSM(false);
		setIsAddingNewKnitType(false);
	};

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'New LOT'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup
						id='category'
						label='Category'
						onChange={formik.handleChange}
						className='col-md-6'>
						<Select
							ariaLabel='Default select example'
							placeholder='Open this select category'
							onChange={formik.handleChange}
							value={formik.values.category}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.category}
							invalidFeedback={formik.errors.category}
							validFeedback='Looks good!'>
							<Option value={'dd'}>abc</Option>
							<Option value={'dd'}>efg</Option>
							<Option value={'dd'}>xyz</Option>
							{category.map((item, index) => (
								<Option value={item.categoryname}>{item.categoryname}</Option>
							))}
						</Select>
					</FormGroup>
					<FormGroup id='subcategory' label='Sub Category' className='col-md-6'>
						<Select
							ariaLabel='Default select example'
							placeholder='Open this select sub category'
							onChange={formik.handleChange}
							value={formik.values.subcategory}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.subcategory}
							invalidFeedback={formik.errors.subcategory}
							validFeedback='Looks good!'>
							<Option value={'dd'}>abc</Option>
							<Option value={'dd'}>efg</Option>
							<Option value={'dd'}>xyz</Option>
							{category.map((item, index) => (
								<Option value={item.categoryname}>{item.categoryname}</Option>
							))}
						</Select>
					</FormGroup>
					<FormGroup id='code' label='Code' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.code}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.code}
							invalidFeedback={formik.errors.code}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='code' label='date' className='col-md-6'>
						<Input
							type='date'
							onChange={formik.handleChange}
							value={formik.values.code}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.code}
							invalidFeedback={formik.errors.code}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='description' label='Description' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.description}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.description}
							invalidFeedback={formik.errors.description}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='color' label='Color' className='col-md-6'>
						{!isAddingNewColor ? (
							<Select
								ariaLabel='Default select example'
								placeholder='Open this select color'
								onChange={(e: any) => {
									if (e.target.value === 'Add new') {
										setIsAddingNewColor(true); // Switch to input field
									} else {
										formik.handleChange(e);
									}
								}}
								value={formik.values.color}
								onBlur={formik.handleBlur}
								isValid={formik.isValid}
								isTouched={formik.touched.color}
								invalidFeedback={formik.errors.color}
								validFeedback='Looks good!'>
								<Option value='Green'>Green</Option>
								<Option value='Red'>Red</Option>
								<Option value='Blue'>Blue</Option>
								<Option value='Add new'>Add new</Option>
							</Select>
						) : (
							<Input
								type='text'
								placeholder='Enter new color'
								onChange={formik.handleChange}
								value={formik.values.color}
								onBlur={formik.handleBlur}
								isValid={formik.isValid}
								isTouched={formik.touched.color}
								invalidFeedback={formik.errors.color}
								validFeedback='Looks good!'
							/>
						)}
					</FormGroup>
					<FormGroup id='GRN_number' label='GRN Number' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.GRN_number}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.GRN_number}
							invalidFeedback={formik.errors.GRN_number}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='GRA_number' label='supplier Name' className='col-md-6'>
						<Select
							ariaLabel='Default select example'
							placeholder='Open this select knit type'
							onChange={formik.handleChange}
							value={formik.values.gsm}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.gsm}
							invalidFeedback={formik.errors.gsm}
							validFeedback='Looks good!'>
							<Option value={'dd'}>abc</Option>
							<Option value={'dd'}>efg</Option>
							<Option value={'dd'}>ijk</Option>
						</Select>
					</FormGroup>
					<FormGroup id='GRA_number' label='Order Details' className='col-md-6'>
						<Input
							type='text'
							onChange={formik.handleChange}
							// value={formik.values.GRA_number}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.GRA_number}
							invalidFeedback={formik.errors.GRA_number}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='GRA_number' label='UOM' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							// value={formik.values.GRA_number}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.GRA_number}
							invalidFeedback={formik.errors.GRA_number}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<p>Fabric</p>
					<FormGroup id='fabric_type' label='Fabric Type' className='col-md-6'>
						{isAddingNewFabric ? (
							<Input
								placeholder='Add new fabric type'
								onChange={(e: any) =>
									formik.setFieldValue('fabric_type', e.target.value)
								}
								value={formik.values.fabric_type}
							/>
						) : (
							<Select
								ariaLabel='Fabric type select'
								onChange={(e: any) => {
									if (e.target.value === 'Add new') {
										setIsAddingNewFabric(true);
									} else {
										formik.handleChange(e);
									}
								}}
								value={formik.values.fabric_type}>
								<Option value=''>Select Fabric Type</Option>
								<Option value='Add new'>Add New</Option>
								{/* Existing fabric type options can be dynamically loaded here */}
								<Option value='Cotton'>Cotton</Option>
								<Option value='Polyester'>Polyester</Option>
							</Select>
						)}
					</FormGroup>

					<FormGroup id='gsm' label='GSM' className='col-md-6'>
						{isAddingNewGSM ? (
							<Input
								placeholder='Add new GSM'
								onChange={(e: any) => formik.setFieldValue('gsm', e.target.value)}
								value={formik.values.gsm}
							/>
						) : (
							<Select
								ariaLabel='GSM select'
								onChange={(e: any) => {
									if (e.target.value === 'Add new') {
										setIsAddingNewGSM(true);
									} else {
										formik.handleChange(e);
									}
								}}
								value={formik.values.gsm}>
								<Option value=''>Select GSM</Option>
								<Option value='Add new'>Add New</Option>
								{/* Existing GSM options can be dynamically loaded here */}
								<Option value='150'>150 GSM</Option>
								<Option value='180'>180 GSM</Option>
							</Select>
						)}
					</FormGroup>
					<FormGroup id='width' label='Width' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.width}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.width}
							invalidFeedback={formik.errors.width}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					{/* Knit Type FormGroup with Dynamic Input */}
					<FormGroup id='knit_type' label='Knit Type' className='col-md-6'>
						{isAddingNewKnitType ? (
							<Input
								placeholder='Add new knit type'
								onChange={(e: any) =>
									formik.setFieldValue('knit_type', e.target.value)
								}
								value={formik.values.knit_type}
							/>
						) : (
							<Select
								ariaLabel='Default select example'
								placeholder='Open this select knit type'
								onChange={(e: any) => {
									if (e.target.value === 'Add new') {
										setIsAddingNewKnitType(true);
									} else {
										formik.handleChange(e);
									}
								}}
								value={formik.values.knit_type}
								onBlur={formik.handleBlur}
								isValid={formik.isValid}
								isTouched={formik.touched.knit_type}
								invalidFeedback={formik.errors.knit_type}
								validFeedback='Looks good!'>
								<Option value=''>Select Knit Type</Option>
								<Option value='60'>60</Option>
								<Option value='70'>70</Option>
								<Option value='80'>80</Option>
								<Option value='Add new'>Add new</Option>
							</Select>
						)}
					</FormGroup>

					<FormGroup id='GRA_number' label='Job ID' className='col-md-6'>
						<Input
							type='text'
							onChange={formik.handleChange}
							// value={formik.values.GRA_number}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.GRA_number}
							invalidFeedback={formik.errors.GRA_number}
							validFeedback='Looks good!'
						/>
					</FormGroup>

					<FormGroup id='GRA_number' label='Bales' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							// value={formik.values.GRA_number}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.GRA_number}
							invalidFeedback={formik.errors.GRA_number}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<p>Thread</p>
					<FormGroup id='GRA_number' label='Yrds per cone' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							// value={formik.values.GRA_number}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.GRA_number}
							invalidFeedback={formik.errors.GRA_number}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='GRA_number' label='Qty' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							// value={formik.values.GRA_number}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.GRA_number}
							invalidFeedback={formik.errors.GRA_number}
							validFeedback='Looks good!'
						/>
					</FormGroup>
				</div>
			</ModalBody>
			<ModalFooter className='px-4 pb-4'>
				{/* Save button to submit the form */}
				<Button color='warning' onClick={handleResetForm}>
          Reset
        </Button>
				<Button color='info' onClick={formik.handleSubmit}>
					Save
				</Button>
			</ModalFooter>
		</Modal>
	);
};
// Prop types definition for ItemAddModal component
ItemAddModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};
export default ItemAddModal;
function async() {
	throw new Error('Function not implemented.');
}
