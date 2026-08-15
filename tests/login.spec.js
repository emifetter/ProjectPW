const {test, expect} = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { USERS, errorMessages } = require('../testData/userDatas');

test.describe('Login Tests', () => {
    let loginPage;
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    });

    test('TC01-Login exitoso con credenciales correctas', async ({ page }) => {
        await loginPage.login(USERS.valid.email, USERS.valid.password);
                
        // Add assertions to verify successful login

        await expect(page).toHaveURL('https://www.automationexercise.com/');
    });
    test('TC02-Login fallido con contraseña incorrectas', async ({ page }) => {
        await loginPage.login(USERS.valid.email, USERS.invalidPassword.password);
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe(errorMessages.invalidCredentials);
    });
});