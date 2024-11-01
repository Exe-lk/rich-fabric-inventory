import React, { useEffect, useRef, useState } from 'react';
import Card, { CardActions, CardBody, CardHeader, CardLabel, CardTitle } from './bootstrap/Card';
import classNames from 'classnames';
import useDarkMode from '../hooks/useDarkMode';
import { getFirstLetter, priceFormat } from '../helpers/helpers';
import 'react-simple-keyboard/build/css/index.css';
import Input from './bootstrap/forms/Input';
import FormGroup from './bootstrap/forms/FormGroup';
import Label from './bootstrap/forms/Label';
import Checks, { ChecksGroup } from './bootstrap/forms/Checks';
import { useUpdateLotMutation, useGetLotsQuery } from '../redux/slices/stockInAPISlice';
import { useAddLotMovementMutation } from '../redux/slices/LotMovementApiSlice';
import { Scanner } from '@yudiel/react-qr-scanner';
import Button from './bootstrap/Button';
import { useFormik } from 'formik';

// Define props for the Keyboard component
interface KeyboardProps {
	isActive: boolean;
	setActiveComponent: React.Dispatch<React.SetStateAction<'additem' | 'edit'>>;
}

const Index: React.FC<KeyboardProps> = ({ isActive, setActiveComponent }) => {
	// Custom hook to manage dark mode
	const { darkModeStatus } = useDarkMode();
	const [category1, setCategory1] = useState<string>('');
	const [input, setInput] = useState<string>('');
	const keyboard = useRef<any>(null);
	const [showPopup, setShowPopup] = useState<boolean>(false);
	const [selectedItem, setSelectedItem] = useState<any>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const popupInputRef = useRef<HTMLInputElement>(null);
	const [selectedType, setSelectedType] = useState<any>('');
	const [layout, setLayout] = useState<string>('default');
	const [focusedIndex, setFocusedIndex] = useState<number>(0);
	const { data: items, error, isLoading, refetch } = useGetLotsQuery(undefined);
	const [updateLot] = useUpdateLotMutation();
	const [addlotmovement] = useAddLotMovementMutation();
	const [data, setData] = useState<any[]>([]);
	const [status, setStatus] = useState<boolean>(false);

	const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		const input = event.target.value;
		const numericInput = input.replace(/\D/g, '');
		setInput(numericInput);
		if (keyboard.current) {
			keyboard.current.setInput(numericInput);
		}
	};

	// Handle OK button click in the popup
	const formik = useFormik({
		initialValues: {
			order_type: selectedType,
			quentity: '',
			Job_ID: '',
		},
		validate: (values) => {
			const errors: Record<string, string> = {};
			if (!values.quentity) errors.quentity = 'Required';
			if (selectedItem.current_quantity < Number(values.quentity))
				errors.quentity = `please enter the quantity less than ${selectedItem.current_quantity}`;
			if (selectedType != 'Return' && !values.Job_ID) errors.Job_ID = 'Required';
			return errors;
		},
		onSubmit: async (values) => {
			try {
				if (selectedItem) {
					const { id, ...rest } = selectedItem; // Destructure to remove id
					const updatedItem = {
						...rest, // Spread the remaining properties without id
						stock_id: id, // Add stock_id with the value of id
						quentity: values.quentity,
						order_type: selectedType,
						Job_ID: values.Job_ID,
					};
					await addlotmovement(updatedItem).unwrap();

					refetch();

					const quentity = selectedItem.current_quantity - Number(values.quentity);

					const updatedItem1 = {
						...selectedItem,
						current_quantity: quentity, // Update current_quantity with the new quentity
					};
					await updateLot(updatedItem1).unwrap();
					refetch();
					setSelectedType('Return');
				}
				formik.resetForm();
				setShowPopup(false);
				setFocusedIndex(-1);
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				alert('An error occurred during file upload. Please try again later.');
			}
		},
	});
	// Open the popup to enter quantity
	const handlePopupOpen = async (selectedIndex1: any) => {
		setSelectedItem(items[selectedIndex1] || null);
		setShowPopup(true);
	};

	// Handle keyboard events for navigation and actions
	const handleKeyPress = async (event: KeyboardEvent) => {
		if (!isActive) return;
		if (event.key === 'ArrowDown') {
			setFocusedIndex((prevIndex) => (prevIndex + 1) % items.length);
		} else if (event.key === 'ArrowUp') {
			setFocusedIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
		} else if (event.key === 'Enter') {
			event.preventDefault();
			if (showPopup) {
				const button = document.querySelector('.btn.btn-success') as HTMLButtonElement;
				if (button) {
					button.click();
				}
			} else if (focusedIndex >= 0) {
				handlePopupOpen(focusedIndex);
			}
		} else if (event.key === 'ArrowLeft') {
			setActiveComponent('additem');
			setFocusedIndex(0);
		} else if (event.key === 'ArrowRight') {
			setActiveComponent('edit');
			setFocusedIndex(-1);
		}
	};
	// Add event listener for keyboard events
	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [focusedIndex, showPopup, isActive]);
	// Focus input in the popup when it is shown
	useEffect(() => {
		if (showPopup) {
			popupInputRef.current?.focus();
		}
	}, [showPopup]);

	const finditem = async (result: any) => {
		await console.log(data);
		await console.log(result[0]);
		// Proceed to find the ite
		const foundItem = data.find((item: any) => item.code.toString() == result[0].rawValue);

		if (foundItem) {
			setSelectedItem(foundItem);
			setShowPopup(true);
		} else {
			console.log('Item not found');
			setSelectedItem(null);
		}
	};

	useEffect(() => {
		const getdata = async () => {
			console.log(items);
			console.log(data);
			if (!status) {
				await setData(items);

				console.log(data);
			}
		};
		getdata();
	}, [items, finditem, selectedItem]);

	return (
		<div>
			<div>
				<Scanner
					onScan={(result) => finditem(result)}
					onError={(error) => console.error(error)}
					constraints={{ facingMode: 'environment' }} // Use the back camera
					allowMultiple
					// styles={{ "width": '300px', height: '300px' }} // Set scanner size
				/>

				{/* {data && <p>Scanned QR Data: {data}</p>} */}
				<Input
					id='keyboardinput'
					className='form-control mb-4 p-2 mt-4'
					value={input}
					placeholder='Tap on the virtual keyboard to start'
					onChange={onChangeInput}
					ref={inputRef}
				/>

				<Card className='mt-4' style={{ height: '40vh' }}>
					<CardHeader>
						<CardLabel>
							<CardTitle>Lot</CardTitle>
						</CardLabel>
					</CardHeader>
					<CardBody style={{ overflowY: 'auto', maxHeight: '30vh' }}>
						<div className='row g-3'>
							{items &&
								items
									.filter((val: any) => {
										if (input === '') {
											if (category1 === '') {
												return val;
											} else if (category1.includes(val.category)) {
												return val;
											}
										} else if (val.code.toString().includes(input)) {
											if (category1 === '') {
												return val;
											} else if (category1.includes(val.category)) {
												return val;
											}
										}
										
										return null;
									})
									.filter((val: any) => {
										if (val.type != 'Yarn') {
											return val;
										} 
									})
									.map((item: any, index: any) => (
										<div
											key={index}
											className={classNames('col-12 ', {
												'bg-info': index === focusedIndex,
											})}
											onClick={async () => {
												handlePopupOpen(index);
											}}>
											<div className='row p-1'>
												<div className='col d-flex align-items-center'>
													<div className='flex-shrink-0'>
														<div
															className='ratio ratio-1x1 me-3'
															style={{ width: 48 }}>
															<div
																className={classNames(
																	'rounded-2',
																	'd-flex align-items-center justify-content-center',
																	{
																		'bg-l10-dark':
																			!darkModeStatus,
																		'bg-l90-dark':
																			darkModeStatus,
																	},
																)}>
																<span className='fw-bold'>
																	{getFirstLetter(
																		item.category || item.type,
																	)}
																</span>
															</div>
														</div>
													</div>
													<div className='flex-grow-1'>
														<div className='fs-6'>
															{item.category || item.type}
														</div>
														<div className='text-muted'>
															<small>{item.GRN_number}</small>
														</div>
													</div>
												</div>
												<div className='col-auto text-end'>
													<div>
														<strong>
															{item.current_quantity} {item.uom}
														</strong>
													</div>
													<div className='text-muted'>
														<small>{item.code}</small>
													</div>
												</div>
											</div>
										</div>
									))}
						</div>
					</CardBody>
				</Card>
			</div>
			{showPopup && (
				<div
					className='position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-black bg-opacity-50'
					style={{ zIndex: 1050 }}>
					<div
						className={classNames('p-4 rounded-4', {
							'bg-l10-dark': !darkModeStatus,
							'bg-dark': darkModeStatus,
						})}
						style={{ zIndex: 1051, width: 600 }}>
						<FormGroup id='order_type' className='col-md-6'>
							<Label htmlFor='ChecksGroup'>Type</Label>
							<ChecksGroup isInline>
								<Checks
									type='radio'
									id={'return'}
									label={'Return'}
									name='type'
									value={'Return'}
									onClick={(e: any) => {
										setSelectedType(e.target.value);
									}}
									checked={selectedType}
								/>
								<Checks
									type='radio'
									id={'restore'}
									label={'Restore'}
									name='type'
									value={'Restore'}
									onClick={(e: any) => {
										setSelectedType(e.target.value);
									}}
									checked={selectedType}
								/>
								<Checks
									type='radio'
									id={'stockout'}
									label={'Stock Out'}
									name='type'
									value={'Stock Out'}
									onClick={(e: any) => {
										setSelectedType(e.target.value);
									}}
									checked={selectedType}
								/>
							</ChecksGroup>
						</FormGroup>

						<FormGroup id='quentity' label='Quantity' className='col-md-12'>
							<Input
								type='number'
								onChange={formik.handleChange}
								value={formik.values.quentity}
								onBlur={formik.handleBlur}
								isValid={formik.isValid}
								isTouched={formik.touched.quentity}
								invalidFeedback={formik.errors.quentity}
								ref={popupInputRef}
								min={1}
								validFeedback='Looks good!'
							/>
						</FormGroup>

						{selectedType !== 'Return' && (
							<>
								<FormGroup id='Job_ID' label='Job Id' className='col-md-12'>
									<Input
										onChange={formik.handleChange}
										value={formik.values.Job_ID}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.Job_ID}
										invalidFeedback={formik.errors.Job_ID}
										ref={popupInputRef}
										validFeedback='Looks good!'
									/>
								</FormGroup>
							</>
						)}

						<div className='d-flex pt-3 justify-content-end'>
							<FormGroup>
								<Button
									onClick={() => setShowPopup(false)}
									className='btn btn-danger me-2'>
									Cancel
								</Button>
								<Button className='btn btn-success' onClick={formik.handleSubmit}>
									OK
								</Button>
							</FormGroup>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Index;
