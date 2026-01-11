import qz from 'qz-tray';
import moment from 'moment';

const PRINTER_NAME = 'BIXOLON SRP-E302';

class InvoicePrinterService {
  constructor() {
    this.esc = '\x1B';
    this.gs = '\x1D';
    this.LINE_WIDTH = 42;
    this.isConnected = false;
    this.printerConfig = null;
  }

  async connectToPrinter() {
    try {
      if (!qz.websocket.isActive()) {
        await qz.websocket.connect({
          host: 'localhost',
          port: 8181,
          retries: 3,
          delay: 1000
        });
      }
      this.isConnected = true;
      this.printerConfig = qz.configs.create(PRINTER_NAME);
      return true;
    } catch (error) {
      console.error('Failed to connect to printer:', error);
      this.isConnected = false;
      throw error;
    }
  }

  // Helper methods
  leftRight(left, right, width = this.LINE_WIDTH) {
    const space = width - (left.length + right.length);
    return left + ' '.repeat(space > 0 ? space : 1) + right;
  }

  divider(char = '-') {
    return char.repeat(this.LINE_WIDTH) + '\n';
  }

  center(text, width = this.LINE_WIDTH) {
    const padding = Math.max(0, Math.floor((width - text.length) / 2));
    return ' '.repeat(padding) + text + ' '.repeat(padding) + '\n';
  }

  generateBarcodeCommands(data) {
    return [
      this.gs + 'H' + '\x02', // Select print position
      this.gs + 'w' + '\x02', // Set barcode width
      this.gs + 'h' + '\x35', // Set barcode height
      this.gs + 'k' + '\x04' + data + '\x00', // Print CODE128 barcode
      '\n',
    ];
  }

  // Format currency
  formatCurrency(amount) {
    return parseFloat(amount).toFixed(2);
  }

  // Generate return invoice print data
  generateReturnInvoiceData(invoiceData, isDuplicate = false) {
    const {
      invoiceNumber,
      invoiceDate,
      customerName,
      customerId,
      items = [],
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount,
      paymentMethod,
      cashierName,
      warehouseCode,
      returnReason = '',
      originalInvoiceDate = ''
    } = invoiceData;

    const printDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const printTitle = isDuplicate ? 'DUPLICATE INVOICE (RETURN COPY)' : 'INVOICE RETURN COPY';

    const lines = [
      this.esc + '@', // Initialize printer
      
      // Header
      this.esc + '!' + '\x38', // Double height and emphasized
      this.esc + 'a' + '\x01', // Center align
      '★ INVOICE RETURN ★\n',
      this.esc + '!' + '\x00', // Cancel text formatting
      
      // Print title
      this.esc + '!' + '\x08', // Emphasized
      this.center(printTitle),
      this.esc + '!' + '\x00',
      
      this.divider('='),

      // Invoice Info
      this.leftRight('Invoice No:', invoiceNumber) + '\n',
      this.leftRight('Date:', invoiceDate) + '\n',
      this.leftRight('Print Date:', printDate) + '\n',
      
      // Return Info if available
      ...(returnReason ? [this.leftRight('Return Reason:', returnReason) + '\n'] : []),
      ...(originalInvoiceDate ? [this.leftRight('Original Date:', originalInvoiceDate) + '\n'] : []),
      
      this.divider('-'),

      // Customer Info
      this.esc + '!' + '\x08', // Emphasized
      'CUSTOMER INFORMATION\n',
      this.esc + '!' + '\x00',
      this.leftRight('Name:', customerName || 'Walk-in Customer') + '\n',
      ...(customerId ? [this.leftRight('Customer ID:', customerId) + '\n'] : []),
      this.divider('-'),

      // Items Header
      this.esc + '!' + '\x08', // Emphasized
      this.leftRight('Item', 'Qty  Price   Total') + '\n',
      this.esc + '!' + '\x00',
      this.divider('-'),

      // Items List
      ...items.map(item => {
        const itemName = item.name || item.PRODUCT_DESCRIPTION || '';
        const truncatedName = itemName.length > 28 ? itemName.slice(0, 28) : itemName;
        const quantity = item.quantity || item.QUANTITY || 0;
        const price = this.formatCurrency(item.price || item.UNIT_PRICE || 0);
        const itemTotal = this.formatCurrency((item.price || item.UNIT_PRICE || 0) * quantity);
        
        return [
          truncatedName + '\n',
          this.leftRight(
            ' '.repeat(2) + `${quantity} x ${price}`,
            itemTotal
          ) + '\n',
          ...(item.BATCH_ID ? [`Batch: ${item.BATCH_ID}\n`] : []),
          ...(item.PRODUCT_CODE ? [`Code: ${item.PRODUCT_CODE}\n`] : [])
        ];
      }).flat(),

      this.divider('-'),

      // Totals
      this.leftRight('Subtotal:', '' + this.formatCurrency(subtotal)) + '\n',
      ...(discountAmount > 0 ? [this.leftRight('Discount:', '(' + this.formatCurrency(discountAmount) + ')\n')] : []),
      ...(taxAmount > 0 ? [this.leftRight('Tax:', '' + this.formatCurrency(taxAmount) + '\n')] : []),
      
      this.divider('='),
      this.esc + '!' + '\x38', // Double height and emphasized
      this.leftRight('TOTAL:', '' + this.formatCurrency(totalAmount)) + '\n',
      this.esc + '!' + '\x00',
      this.divider('='),

      // Payment Info
      this.esc + '!' + '\x08',
      'PAYMENT INFORMATION\n',
      this.esc + '!' + '\x00',
      this.leftRight('Method:', paymentMethod || 'Cash') + '\n',
      this.leftRight('Cashier:', cashierName || 'System') + '\n',
      this.leftRight('Warehouse:', warehouseCode || 'Main') + '\n',
      
      this.divider('-'),

      // Footer
      this.esc + 'a' + '\x01', // Center align
      '★ THANK YOU ★\n\n',
      'For returns/exchanges:\n',
      '1. Present this invoice\n',
      '2. Within 7 days of purchase\n',
      '3. With original packaging\n',
      '4. Unused condition\n\n',

      // Barcode
      ...this.generateBarcodeCommands(invoiceNumber),

      // Cut paper
      '\n\n',
      this.gs + 'V' + '\x41' + '\x03', // Full cut
    ];

    return lines.join('');
  }

  // Print return invoice
  async printReturnInvoice(invoiceData, isDuplicate = false) {
    try {
      if (!this.isConnected) {
        await this.connectToPrinter();
      }

      const printData = this.generateReturnInvoiceData(invoiceData, isDuplicate);
      
      await qz.print(this.printerConfig, [
        { 
          type: 'raw', 
          format: 'command', 
          data: printData 
        }
      ]);

      // Save print record
      await this.savePrintRecord(invoiceData, isDuplicate);

      return { success: true, message: 'Invoice printed successfully' };
    } catch (error) {
      console.error('Print error:', error);
      throw new Error(`Failed to print invoice: ${error.message}`);
    }
  }

  // Save print record to local storage/database
  async savePrintRecord(invoiceData, isDuplicate) {
    try {
      const printHistory = {
        invoiceNumber: invoiceData.invoiceNumber,
        printType: isDuplicate ? 'DUPLICATE_RETURN' : 'RETURN_COPY',
        printedAt: new Date().toISOString(),
        printerName: PRINTER_NAME,
        data: {
          customerName: invoiceData.customerName,
          totalAmount: invoiceData.totalAmount,
          itemsCount: invoiceData.items?.length || 0
        }
      };

      // Save to localStorage for history
      const existingHistory = JSON.parse(localStorage.getItem('printHistory') || '[]');
      existingHistory.unshift(printHistory);
      if (existingHistory.length > 100) {
        existingHistory.pop();
      }
      localStorage.setItem('printHistory', JSON.stringify(existingHistory));

      return true;
    } catch (error) {
      console.error('Failed to save print record:', error);
      // Don't throw error for failed history save
      return false;
    }
  }

  // Open cash drawer
  async openCashDrawer() {
    try {
      if (!this.isConnected) {
        await this.connectToPrinter();
      }

      const commands = [
        '\x1B\x70\x00\x19\xFA', // Open drawer pin 2
        '\x1B\x70\x01\x19\xFA', // Open drawer pin 5
        '\x07', // Bell command
      ];

      for (const command of commands) {
        try {
          await qz.print(this.printerConfig, [
            { type: 'raw', format: 'command', data: command }
          ]);
          return true;
        } catch (error) {
          continue;
        }
      }

      throw new Error('Cash drawer failed to open');
    } catch (error) {
      console.error('Cash drawer error:', error);
      throw error;
    }
  }

  // Generate PDF for download
  async generatePDF(invoiceData) {
    try {
      // This would typically call a backend service to generate PDF
      // For now, we'll create a simple HTML PDF
      const htmlContent = this.generateHTMLForPDF(invoiceData);
      
      // Create blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_Return_${invoiceData.invoiceNumber}_${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('PDF generation error:', error);
      throw error;
    }
  }

  generateHTMLForPDF(invoiceData) {
    // Basic HTML structure for PDF
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .invoice-title { font-size: 24px; font-weight: bold; color: #333; }
          .section { margin: 15px 0; }
          .section-title { font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 5px; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .total-row { font-weight: bold; background-color: #f9f9f9; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="invoice-title">INVOICE RETURN COPY</div>
          <div>Invoice No: ${invoiceData.invoiceNumber}</div>
          <div>Date: ${invoiceData.invoiceDate}</div>
          <div>Printed: ${new Date().toLocaleString()}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Customer Information</div>
          <div>Name: ${invoiceData.customerName || 'Walk-in Customer'}</div>
          ${invoiceData.customerId ? `<div>Customer ID: ${invoiceData.customerId}</div>` : ''}
        </div>
        
        <div class="section">
          <div class="section-title">Items</div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${(invoiceData.items || []).map(item => `
                <tr>
                  <td>${item.name || item.PRODUCT_DESCRIPTION || ''}</td>
                  <td>${item.quantity || item.QUANTITY || 0}</td>
                  <td>${this.formatCurrency(item.price || item.UNIT_PRICE || 0)}</td>
                  <td>${this.formatCurrency((item.price || item.UNIT_PRICE || 0) * (item.quantity || item.QUANTITY || 0))}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <div class="section-title">Payment Summary</div>
          <table>
            <tr>
              <td>Subtotal:</td>
              <td>${this.formatCurrency(invoiceData.subtotal || 0)}</td>
            </tr>
            ${invoiceData.discountAmount ? `
            <tr>
              <td>Discount:</td>
              <td>${this.formatCurrency(invoiceData.discountAmount)}</td>
            </tr>` : ''}
            ${invoiceData.taxAmount ? `
            <tr>
              <td>Tax:</td>
              <td>${this.formatCurrency(invoiceData.taxAmount)}</td>
            </tr>` : ''}
            <tr class="total-row">
              <td>TOTAL:</td>
              <td>${this.formatCurrency(invoiceData.totalAmount || 0)}</td>
            </tr>
          </table>
        </div>
        
        <div class="footer">
          <p>★ THANK YOU ★</p>
          <p>This is a return copy of the original invoice</p>
          <p>For returns/exchanges, please present this copy within 7 days</p>
        </div>
      </body>
      </html>
    `;
  }
}

export default new InvoicePrinterService();