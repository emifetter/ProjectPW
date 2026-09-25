class InvoicePage {
    constructor(page) {
        this.page = page;
        this.comboBox = page
            .getByText('Select or create a client', { exact: true })
            .locator('..')
            .getByRole('combobox');
        this.NewCliente = page.getByRole('option', { name: 'New client' });
        this.fillNewCliente = page.locator('input[id="client.tradingName"]');
        this.clientEmail = page.getByRole('textbox', { name: 'Email Optional ?' });
        this.saveNewCliente = page.locator('button:has-text("Save client")');
        this.newItem = page.getByRole('button', { name: 'Add Line Item' });
        this.lineItem = page.locator('#invoice-item-0');
        this.textArea = this.lineItem.getByRole('textbox');
        this.qty = this.lineItem.getByRole('spinbutton').nth(0);
        this.rate = this.lineItem.getByRole('spinbutton').nth(1);
        this.businessDetailsButton = page.getByRole('button', { name: 'Your details', exact: true });
        this.businessDetailsModal = page.locator('.invoice-client-modal').last();
        this.businessName = page.locator('#businessDetails\\.name');
        this.businessEmail = page.locator('#businessDetails\\.email');
        this.businessCurrency = page.getByRole('combobox').filter({ visible: true }).last();
        this.saveBusinessDetails = this.businessDetailsModal.getByRole('button', { name: 'Save', exact: true });
        this.sendInvoiceButton = page.getByRole('button', { name: 'Send Invoice' }).first();
        this.confirmSendButton = page.getByRole('button', { name: 'Send', exact: true });
        this.sentToClientCheckbox = page.getByRole('checkbox', { name: 'Sent to client' });
        this.invoiceErrorMessage = page.getByText('Invoice Error', { exact: true });
        this.premiumHeading = page.getByRole('heading', { name: 'Get Premium', exact: true });

    }

    async fillInvoiceDetails(invoiceData) {
        await this.comboBox.click();
        await this.NewCliente.click();
        await this.fillNewCliente.fill(invoiceData.newClientName);
        await this.clientEmail.fill(invoiceData.clientEmail);
        await this.saveNewCliente.click();
        await this.fillNewCliente.waitFor({ state: 'hidden' });
        await this.newItem.click();
        await this.textArea.fill(invoiceData.itemDescription);
        await this.qty.fill(invoiceData.itemQuantity);
        await this.rate.fill(invoiceData.itemRate);
        if (invoiceData.sendInvoice) {
            if (await this.businessDetailsButton.isVisible()) {
                await this.businessDetailsButton.click();
                await this.businessName.fill(invoiceData.businessName);
                await this.businessEmail.fill(invoiceData.businessEmail);
                await this.businessCurrency.fill('US Dollar');
                await this.page.getByRole('option', { name: 'US Dollar | $', exact: true }).click();
                await this.saveBusinessDetails.click();
                await this.businessName.waitFor({ state: 'hidden' });
            }
            await this.sendInvoiceButton.click();
            await this.confirmSendButton.click();
            const sendOutcome = await Promise.race([
                this.sentToClientCheckbox.waitFor({ state: 'visible' }).then(() => 'sent'),
                this.premiumHeading.waitFor({ state: 'visible' }).then(() => 'premium'),
            ]);
            if (sendOutcome === 'premium') {
                throw new Error('Sending invoices requires a premium account.');
            }
        } else if (invoiceData.expectError) {
            await this.invoiceErrorMessage.waitFor({ state: 'visible' });
        }
    }
}

module.exports = InvoicePage;