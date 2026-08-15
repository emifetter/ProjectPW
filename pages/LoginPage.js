class LoginPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.loginForm = page.locator('form').nth(0);
        this.emailInput = this.loginForm.locator('input[name="email"]');
        this.passwordInput = this.loginForm.locator('input[name="password"]');
        this.loginButton = this.loginForm.getByRole('button', { name: 'Login' });
    }
    async navigate() {
        await this.page.goto('https://www.automationexercise.com/login');
    }

    async login(username, password) {
        await this.emailInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async getErrorMessage() {
        return await this.loginForm.locator('p').textContent();
    }
}

module.exports = { LoginPage };

