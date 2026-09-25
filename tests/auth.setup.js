const { test: setup, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const authFile = path.resolve('playwright/.auth/user.json');

setup('authenticate with Microsoft', async ({ page }) => {
    setup.setTimeout(120000);

    if (fs.existsSync(authFile)) {
        const validationContext = await page.context().browser().newContext({
            storageState: authFile,
        });
        const validationPage = await validationContext.newPage();

        try {
            await validationPage.goto('https://tinyinvoice.app/invoices/new');
            if (validationPage.url().includes('/invoices/new')) {
                await validationContext.close();
                return;
            }
        } finally {
            await validationContext.close();
        }
    }

    if (!process.env.MS_EMAIL || !process.env.MS_PASSWORD) {
        throw new Error('Define MS_EMAIL y MS_PASSWORD antes de ejecutar el setup de autenticación.');
    }

    await page.goto('https://tinyinvoice.app/login');
    await page.getByRole('button', { name: 'Continue with Microsoft' }).click();
    await page.getByRole('textbox', {
        name: 'Enter your email, phone, or Skype.'
    }).fill(process.env.MS_EMAIL);
    await page.getByRole('button', { name: 'Next' }).click();

    const passwordInput = page.locator('input[name="passwd"]');
    const passwordVisible = await passwordInput
        .waitFor({ state: 'visible', timeout: 10000 })
        .then(() => true)
        .catch(() => false);

    if (!passwordVisible) {
        const passwordOption = page
            .getByRole('button', {
                name: /^(Ingresar con contraseña|Use your password|Use password instead)$/i
            })
            .or(page.getByRole('link', {
                name: /^(Ingresar con contraseña|Use your password|Use password instead)$/i
            }));
        await passwordOption.click();
        await passwordInput.waitFor({ state: 'visible' });
    }

    await passwordInput.fill(process.env.MS_PASSWORD);
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    const staySignedInButton = page.getByRole('button', {
        name: /^(Yes|Sí)$/i
    });
    const staySignedInVisible = await staySignedInButton
        .waitFor({ state: 'visible', timeout: 10000 })
        .then(() => true)
        .catch(() => false);
    if (staySignedInVisible) {
        await staySignedInButton.click();
    }

    await expect(page).toHaveURL('https://tinyinvoice.app/invoices/new', {
        timeout: 120000
    });
    fs.mkdirSync(path.dirname(authFile), { recursive: true });
    await page.context().storageState({ path: authFile });
});
