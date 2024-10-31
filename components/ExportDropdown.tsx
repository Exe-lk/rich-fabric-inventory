import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toSvg, toPng } from 'html-to-image';
import Dropdown, { DropdownItem, DropdownMenu, DropdownToggle } from './bootstrap/Dropdown';
import Button from './bootstrap/Button';

type ExportDropdownProps = {
	tableSelector: string; // CSS selector for the table you want to export
    title:string
};

const ExportDropdown: React.FC<ExportDropdownProps> = ({ tableSelector, title }) => {
	const handleExport = async (format: string) => {
		const table = document.querySelector('table');
		if (!table) return;

		// Remove borders and hide last cells before exporting
		modifyTableForExport(table as HTMLElement, true);

		const clonedTable = table.cloneNode(true) as HTMLElement;

		// Remove Edit/Delete buttons column from cloned table
		const rows = clonedTable.querySelectorAll('tr');
		rows.forEach((row) => {
			const lastCell = row.querySelector('td:last-child, th:last-child');
			if (lastCell) {
				lastCell.remove();
			}
		});

		const clonedTableStyles = getComputedStyle(table);
		clonedTable.setAttribute('style', clonedTableStyles.cssText);

		try {
			switch (format) {
				case 'svg':
					await downloadTableAsSVG();
					break;
				case 'png':
					await downloadTableAsPNG();
					break;
				case 'csv':
					downloadTableAsCSV(clonedTable);
					break;
				case 'pdf':
					await downloadTableAsPDF(clonedTable);
					break;
				default:
					console.warn('Unsupported export format: ', format);
			}
		} catch (error) {
			console.error('Error exporting table: ', error);
		} finally {
			// Restore table after export
			modifyTableForExport(table as HTMLElement, false);
		}
	};
	// Helper function to modify table by hiding last column and removing borders
	const modifyTableForExport = (table: HTMLElement, hide: boolean) => {
		const rows = table.querySelectorAll('tr');
		rows.forEach((row) => {
			const lastCell = row.querySelector('td:last-child, th:last-child');
			if (lastCell instanceof HTMLElement) {
				if (hide) {
					lastCell.style.display = 'none';
				} else {
					lastCell.style.display = '';
				}
			}
		});
	};

	// function to export the table data in CSV format
	const downloadTableAsCSV = (table: any) => {
		let csvContent = '';
		const rows = table.querySelectorAll('tr');
		rows.forEach((row: any) => {
			const cols = row.querySelectorAll('td, th');
			const rowData = Array.from(cols)
				.map((col: any) => `"${col.innerText}"`)
				.join(',');
			csvContent += rowData + '\n';
		});

		const blob = new Blob([csvContent], { type: 'text/csv' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = `${title}.csv`;
		link.click();
	};
	// PDF export function with the logo added
	const downloadTableAsPDF = async (table: HTMLElement) => {
		try {
			const pdf = new jsPDF('p', 'pt', 'a4');
			const pageWidth = pdf.internal.pageSize.getWidth();
			const pageHeight = pdf.internal.pageSize.getHeight();
			const rows: any[] = [];
			const headers: any[] = [];

			// Draw a thin page border
			pdf.setLineWidth(1);
			pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

			// Add the logo in the top-left corner

			const logoWidth = 100;
			const logoHeight = 40;
			const logoX = 20;
			const logoY = 20;

			// Add small heading in the top left corner (below the logo)
			pdf.setFontSize(8);
			pdf.setFont('helvetica', 'bold');
			pdf.text('Rich Fabric Inventory.', 20, logoY + logoHeight + 10);

			// Add the table heading (title) in the top-right corner
			const title1 = `${title} Report`;
			pdf.setFontSize(16);
			pdf.setFont('helvetica', 'bold');
			const titleWidth = pdf.getTextWidth(title1);
			const titleX = pageWidth - titleWidth - 20;
			pdf.text(title1, titleX, 30);

			// Add the current date below the table heading
			const currentDate = new Date().toLocaleDateString();
			const dateX = pageWidth - pdf.getTextWidth(currentDate) - 20;
			pdf.setFontSize(12);
			pdf.text(currentDate, dateX, 50);

			// Extract table headers
			const thead = table.querySelector('thead');
			if (thead) {
				const headerCells = thead.querySelectorAll('th');
				headers.push(Array.from(headerCells).map((cell: any) => cell.innerText));
			}

			// Extract table rows
			const tbody = table.querySelector('tbody');
			if (tbody) {
				const bodyRows = tbody.querySelectorAll('tr');
				bodyRows.forEach((row: any) => {
					const cols = row.querySelectorAll('td');
					const rowData = Array.from(cols).map((col: any) => col.innerText);
					rows.push(rowData);
				});
			}

			// Generate the table below the date
			autoTable(pdf, {
				head: headers,
				body: rows,
				margin: { top: 100 },
				styles: {
					overflow: 'linebreak',
					cellWidth: 'wrap',
				},
				headStyles: {
					fillColor: [80, 101, 166],
					textColor: [255, 255, 255],
				},
				theme: 'grid',
			});

			pdf.save(`${title}.pdf`);
		} catch (error) {
			console.error('Error generating PDF: ', error);
			alert('Error generating PDF. Please try again.');
		}
	};

	// Helper function to load the image (logo) for the PDF
	const loadImage = (url: string): Promise<string> => {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.src = url;
			img.crossOrigin = 'Anonymous';
			img.onload = () => {
				const canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;
				const ctx = canvas.getContext('2d');
				if (ctx) {
					ctx.drawImage(img, 0, 0);
					const dataUrl = canvas.toDataURL('image/png'); // Base64 URL
					resolve(dataUrl);
				} else {
					reject('Failed to load the logo image.');
				}
			};
			img.onerror = () => {
				reject('Error loading logo image.');
			};
		});
	};

	// Helper function to hide the last cell of every row (including borders)
	const hideLastCells = (table: HTMLElement) => {
		const rows = table.querySelectorAll('tr');
		rows.forEach((row) => {
			const lastCell = row.querySelector('td:last-child, th:last-child');
			if (lastCell instanceof HTMLElement) {
				lastCell.style.visibility = 'hidden';
				lastCell.style.border = 'none';
				lastCell.style.padding = '0';
				lastCell.style.margin = '0';
			}
		});
	};

	// Helper function to restore the visibility and styles of the last cell
	const restoreLastCells = (table: HTMLElement) => {
		const rows = table.querySelectorAll('tr');
		rows.forEach((row) => {
			const lastCell = row.querySelector('td:last-child, th:last-child');
			if (lastCell instanceof HTMLElement) {
				lastCell.style.visibility = 'visible';
				lastCell.style.border = '';
				lastCell.style.padding = '';
				lastCell.style.margin = '';
			}
		});
	};

	// Function to export the table data in PNG format
	const downloadTableAsPNG = async () => {
		try {
			const table = document.querySelector('table');
			if (!table) {
				console.error('Table element not found');
				return;
			}

			const originalBorderStyle = table.style.border;
			table.style.border = '1px solid black';

			// Convert table to PNG
			const dataUrl = await toPng(table, {
				cacheBust: true,
				style: {
					width: table.offsetWidth + 'px',
				},
			});

			table.style.border = originalBorderStyle;

			const link = document.createElement('a');
			link.href = dataUrl;
			link.download = `${title}.png`;
			link.click();
		} catch (error) {
			console.error('Error generating PNG: ', error);
		}
	};

	// Function to export the table data in SVG format using html-to-image without cloning the table
	const downloadTableAsSVG = async () => {
		try {
			const table = document.querySelector('table');
			if (!table) {
				console.error('Table element not found');
				return;
			}

			// Hide last cells before export
			hideLastCells(table);

			const dataUrl = await toSvg(table, {
				backgroundColor: 'white',
				cacheBust: true,
				style: {
					width: table.offsetWidth + 'px',
					color: 'black',
				},
			});

			// Restore the last cells after export
			restoreLastCells(table);

			const link = document.createElement('a');
			link.href = dataUrl;
			link.download = `${title}.svg`;
			link.click();
		} catch (error) {
			console.error('Error generating SVG: ', error);
			// Restore the last cells in case of error
			const table = document.querySelector('table');
			if (table) restoreLastCells(table);
		}
	};
	return (
		<Dropdown>
			<DropdownToggle hasIcon={false}>
				<Button icon='UploadFile' color='warning'>
					Export
				</Button>
			</DropdownToggle>
			<DropdownMenu isAlignmentEnd>
				<DropdownItem onClick={() => handleExport('svg')}>Download SVG</DropdownItem>
				<DropdownItem onClick={() => handleExport('png')}>Download PNG</DropdownItem>
				<DropdownItem onClick={() => handleExport('csv')}>Download CSV</DropdownItem>
				<DropdownItem onClick={() => handleExport('pdf')}>Download PDF</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
};

export default ExportDropdown;
