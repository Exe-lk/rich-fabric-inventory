import React, { useEffect, useRef, useState } from 'react';
import Card, { CardActions, CardBody, CardHeader, CardLabel, CardTitle } from './bootstrap/Card';
import classNames from 'classnames';
import useDarkMode from '../hooks/useDarkMode';
import { getFirstLetter, priceFormat } from '../helpers/helpers';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import Input from './bootstrap/forms/Input';
import FormGroup from './bootstrap/forms/FormGroup';
import Label from './bootstrap/forms/Label';
import Checks, { ChecksGroup } from './bootstrap/forms/Checks';
import { useUpdateLotMutation, useGetLotsQuery } from '../redux/slices/stockInAPISlice';
import {
	useAddLotMovementMutation,
	useGetLotMovementsQuery,
} from '../redux/slices/LotMovementApiSlice';
import { Scanner } from '@yudiel/react-qr-scanner';

interface Item {
	cid: string;
	category: string;
	image: string;
	name: string;
	price: number;
	quentity: number;
	reorderlevel: number;
}

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
	const [popupInput, setPopupInput] = useState<any>('');
	const [popupInput1, setPopupInput1] = useState<any>();
	const [selectedItem, setSelectedItem] = useState<any>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const popupInputRef = useRef<HTMLInputElement>(null);
	const [selectedType, setSelectedType] = useState<any>('');
	const [layout, setLayout] = useState<string>('default');
	const [focusedIndex, setFocusedIndex] = useState<number>(0);
	const { data: items, error, isLoading, refetch } = useGetLotsQuery(undefined);
	const [updateLot] = useUpdateLotMutation();
	const [addlotmovement] = useAddLotMovementMutation();
	// const { refetch } = useGetLotMovementsQuery(undefined);
	const [data, setData] = useState<any[]>([]);
	const [status, setStatus] = useState<boolean>(false);
	// Handle input change
	const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		const input = event.target.value;
		const numericInput = input.replace(/\D/g, '');
		setInput(numericInput);
		if (keyboard.current) {
			keyboard.current.setInput(numericInput);
		}
	};

	// Toggle between default and shift layouts on virtual keyboard
	const handleShift = () => {
		const newLayoutName = layout === 'default' ? 'shift' : 'default';
		setLayout(newLayoutName);
	};

	// Handle OK button click in the popup
	const handlePopupOk = async () => {
		if (
			popupInput <= 0 ||
			selectedType === '' ||
			(selectedType != 'Return' && popupInput1 == null) ||
			selectedItem.current_quantity < Number(popupInput)
		) {
			return;
		}
		if (selectedItem) {
			const { id, ...rest } = selectedItem; // Destructure to remove id
			const updatedItem = {
				...rest, // Spread the remaining properties without id
				stock_id: id, // Add stock_id with the value of id
				quentity: Number(popupInput),
				order_type: selectedType,
				Job_ID: popupInput1,
			};
			await addlotmovement(updatedItem).unwrap();

			// Refetch categories to update the list
			refetch();

			const quentity = selectedItem.current_quantity - Number(popupInput);

			const updatedItem1 = {
				...selectedItem,
				current_quantity: quentity, // Update current_quantity with the new quentity
			};
			await updateLot(updatedItem1).unwrap();
			refetch();
			// await setOrderedItems((prevItems: any) => {
			// 	const itemIndex = prevItems.findIndex((item: any) => item.id === updatedItem.id);
			// 	if (itemIndex > -1) {
			// 		const updatedItems = [...prevItems];
			// 		updatedItems[itemIndex] = updatedItem;
			// 		return updatedItems;
			// 	} else {
			// 		return [...prevItems, updatedItem];
			// 	}
			// });
			setPopupInput('');
			setPopupInput1('');
			setSelectedType('');
		}
		setShowPopup(false);
		setFocusedIndex(-1);
	};

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
		// Ensure items are defined before proceeding

	
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
							'bg-l90-dark': darkModeStatus,
						})}
						style={{ zIndex: 1051, width: 600 }}>
						<FormGroup id='membershipDate' className='col-md-6'>
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
						<h6 className='mt-4'>Enter a Quantity</h6>
						<Input
							type='number'
							value={popupInput}
							onChange={(e: any) => setPopupInput(e.target.value)}
							min={1}
							className='form-control mb-4 p-2'
							ref={popupInputRef}
						/>
						{selectedType !== 'Return' && (
							<>
								<h6 className='mb-4'>Job ID</h6>
								<Input
									type='text'
									value={popupInput1}
									onChange={(e: any) => setPopupInput1(e.target.value)}
									className='form-control mb-4 p-2'
									ref={popupInputRef}
								/>
							</>
						)}

						<div className='d-flex justify-content-end'>
							<button
								onClick={() => setShowPopup(false)}
								className='btn btn-danger me-2'>
								Cancel
							</button>
							<button className='btn btn-success' onClick={handlePopupOk}>
								OK
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Index;
