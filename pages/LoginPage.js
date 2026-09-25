class LoginPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.loginButtonMicrosoft = page.getByRole('button', { name: 'Continue with Microsoft' });
        this.microsoftEmailInput = page.getByRole('textbox', {
            name: 'Enter your email, phone, or Skype.'
        });
        this.microsoftNextButton = page.getByRole('button', { name: 'Next' });
        this.microsoftPasswordInput = page.locator('input[name="passwd"]');
        this.microsoftSignInButton = page.getByRole('button', { name: 'Sign in' });
        this.permissionDialog = page.locator('button[type="submit"]');
    }
    async navigate() {
        await this.page.goto('https://tinyinvoice.app/login');
    }

    async loginWithMicrosoft(email, password) {
        await this.loginButtonMicrosoft.click();
        await this.microsoftEmailInput.fill(email);
        await this.microsoftNextButton.click();
        await this.microsoftPasswordInput.fill(password);
        await this.microsoftSignInButton.click();
    }

    async acceptPermissionDialog() {
        await this.permissionDialog.click();
    }


}

module.exports = { LoginPage };

