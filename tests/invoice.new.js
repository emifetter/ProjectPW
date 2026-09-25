const {test, expect} = require('@playwright/test');
const { randomUUID } = require('crypto');

test.describe('Invoice New Tests', () => {
    test('TC01-Create New Invoice', async ({ page }) => {
        const uniqueId = randomUUID();
        const clientName = `Test Client ${uniqueId}`;
        const clientEmail = `test.${uniqueId}@example.com`;

        await page.goto('https://tinyinvoice.app/invoices/new');
        await expect(page).toHaveURL(/\/invoices\/new$/);
        const InvoicePage = require('../pages/InvoicePage');
        const invoicePage = new InvoicePage(page);
        await invoicePage.fillInvoiceDetails({ newClientName: clientName, clientEmail, itemDescription: 'Test Item', itemQuantity: '1', itemRate: '100', sendInvoice: false });
        await expect(page.getByText(clientName, { exact: true })).toBeVisible();
        await expect(invoicePage.textArea).toHaveValue('Test Item');
        await expect(invoicePage.qty).toHaveValue('1');
        await expect(invoicePage.rate).toHaveValue('100');
       

    });

    test('TC02-SEND Invoice', async ({ page }) => {
        const uniqueId = randomUUID();
        const clientName = `Test Client ${uniqueId}`;
        const clientEmail = `test.${uniqueId}@example.com`;
        const businessEmail = `business.${uniqueId}@example.com`;

        await page.goto('https://tinyinvoice.app/invoices/new');
        await expect(page).toHaveURL(/\/invoices\/new$/);
        const InvoicePage = require('../pages/InvoicePage');
        const invoicePage = new InvoicePage(page);
        await invoicePage.fillInvoiceDetails({ newClientName: clientName, clientEmail, businessName: 'Test Business', businessEmail, businessCurrency: 'US Dollar | $', itemDescription: 'Test Item', itemQuantity: '1', itemRate: '100', sendInvoice: true });
        await expect(invoicePage.sentToClientCheckbox).toBeChecked();
        await expect(invoicePage.invoiceErrorMessage).not.toBeVisible();
        
    
    });
});