import { test, expect } from '@playwright/test';
import { FormPage } from '../pages/form.page';

test.describe('Web UI Playground Form Tests', () => {
    let formPage: FormPage;

    test.beforeEach(async ({ page }) => {
        await page.goto('https://vladimirwork.github.io/web-ui-playground/');
        formPage = new FormPage(page);
    });

    test('should validate required fields', async () => {
        await formPage.submitForm();

        // Check for validation messages
        expect(await formPage.firstNameValidation().isVisible()).toBeTruthy();
        expect(await formPage.lastNameValidation().isVisible()).toBeTruthy();
        expect(await formPage.emailValidation().isVisible()).toBeTruthy();
        expect(await formPage.phoneValidation().isVisible()).toBeTruthy();
        expect(await formPage.genderValidation().isVisible()).toBeTruthy();
        expect(await formPage.cvValidation().isVisible()).toBeTruthy();
        expect(await formPage.agreementValidation().isVisible()).toBeTruthy();
    });

    test.describe('First Name Validation', () => {
        test('should show error for empty first name', async () => {
            await formPage.submitForm();
            expect(await formPage.firstNameValidation().isVisible()).toBeTruthy();
        });

        test('should show error for short first name', async () => {
            await formPage.firstNameInput().fill('A');
            await formPage.submitForm();
            expect(await formPage.firstNameValidation().isVisible()).toBeTruthy();
        });

        test('should show error for long first name', async () => {
            await formPage.firstNameInput().fill('ThisIsAVeryLongFirstNameExceedingLimit');
            await formPage.submitForm();
            expect(await formPage.firstNameValidation().isVisible()).toBeTruthy();
        });

        test('should accept valid first name', async () => {
            await formPage.firstNameInput().fill('John');
            await formPage.submitForm();
            expect(await formPage.firstNameValidation().isVisible()).toBeFalsy();
        });
    });

    test.describe('Last Name Validation', () => {
        test('should show error for empty last name', async () => {
            await formPage.submitForm();
            expect(await formPage.lastNameValidation().isVisible()).toBeTruthy();
        });

        test('should show error for short last name', async () => {
            await formPage.lastNameInput().fill('B');
            await formPage.submitForm();
            expect(await formPage.lastNameValidation().isVisible()).toBeTruthy();
        });

        test('should show error for long last name', async () => {
            await formPage.lastNameInput().fill('ThisIsAVeryLongLastNameExceedingLimit');
            await formPage.submitForm();
            expect(await formPage.lastNameValidation().isVisible()).toBeTruthy();
        });

        test('should accept valid last name', async () => {
            await formPage.lastNameInput().fill('Doe');
            await formPage.submitForm();
            expect(await formPage.lastNameValidation().isVisible()).toBeFalsy();
        });
    });

    test.describe('Email Validation', () => {
        test('should show error for empty email', async () => {
            await formPage.submitForm();
            expect(await formPage.emailValidation().isVisible()).toBeTruthy();
        });

        test('should show error for invalid email (missing @)', async () => {
            await formPage.emailInput().fill('example.com');
            await formPage.submitForm();
            expect(await formPage.emailValidation().isVisible()).toBeTruthy();
        });

        test('should show error for invalid email (missing domain)', async () => {
            await formPage.emailInput().fill('test@');
            await formPage.submitForm();
            expect(await formPage.emailValidation().isVisible()).toBeTruthy();
        });

        test('should accept valid email', async () => {
            await formPage.emailInput().fill('test@example.com');
            await formPage.submitForm();
            expect(await formPage.emailValidation().isVisible()).toBeFalsy();
        });
    });

    test.describe('Phone Number Validation', () => {
        test('should show error for empty phone number', async () => {
            await formPage.submitForm();
            expect(await formPage.phoneValidation().isVisible()).toBeTruthy();
        });

        test('should show error for phone number shorter than 7 digits', async () => {
            await formPage.phoneInput().fill('123');
            await formPage.submitForm();
            expect(await formPage.phoneValidation().isVisible()).toBeTruthy();
        });

        test('should show error for phone number longer than 12 digits', async () => {
            await formPage.phoneInput().fill('1234567890123');
            await formPage.submitForm();
            expect(await formPage.phoneValidation().isVisible()).toBeTruthy();
        });

        test('should show error for phone number with non-numeric characters', async () => {
            await formPage.phoneInput().fill('12345ABC');
            await formPage.submitForm();
            expect(await formPage.phoneValidation().isVisible()).toBeTruthy();
        });

        test('should accept valid phone number', async () => {
            await formPage.phoneInput().fill('123456789');
            await formPage.submitForm();
            expect(await formPage.phoneValidation().isVisible()).toBeFalsy();
        });
    });

    test.describe('Gender Validation', () => {
        test('should show error when gender is not selected', async () => {
            await formPage.submitForm();
            expect(await formPage.genderValidation().isVisible()).toBeTruthy();
        });

        test('should accept Male gender selection', async () => {
            await formPage.genderMaleRadio().check();
            await formPage.submitForm();
            expect(await formPage.genderValidation().isVisible()).toBeFalsy();
        });

        test('should accept Female gender selection', async () => {
            await formPage.genderFemaleRadio().check();
            await formPage.submitForm();
            expect(await formPage.genderValidation().isVisible()).toBeFalsy();
        });
    });

    test.describe('CV Upload Validation', () => {
        test('should show error if CV is not uploaded', async () => {
            await formPage.submitForm();
            expect(await formPage.cvValidation().isVisible()).toBeTruthy();
        });

        test('should accept valid CV upload', async () => {
            await formPage.cvUploadInput().setInputFiles('./files/sample.pdf');
            await formPage.submitForm();
            expect(await formPage.cvValidation().isVisible()).toBeFalsy();
        });
    });

    test.describe('Agreement Validation', () => {
        test('should show error if agreement is not checked', async () => {
            await formPage.submitForm();
            expect(await formPage.agreementValidation().isVisible()).toBeTruthy();
        });

        test('should accept form when agreement is checked', async () => {
            await formPage.agreementCheckbox().check();
            await formPage.submitForm();
            expect(await formPage.agreementValidation().isVisible()).toBeFalsy();
        });
    });

    test.describe('Full Form Submission', () => {
        test('should successfully submit the form with all valid inputs', async ({ page }) => {
            await formPage.firstNameInput().fill('John');
            await formPage.lastNameInput().fill('Doe');
            await formPage.emailInput().fill('john.doe@example.com');
            await formPage.phoneInput().fill('123456789');
            await formPage.genderMaleRadio().check();
            await formPage.vacancyDropdown().selectOption('QA Engineer');
            await formPage.cvUploadInput().setInputFiles('./files/sample.pdf');
            await formPage.agreementCheckbox().check();
            await formPage.submitForm();

            page.on('dialog', async (dialog) => {
                const data = JSON.parse(dialog.message());
                expect(data.FirstName).toBe('John');
                expect(data.LastName).toBe('Doe');
                expect(data.Email).toBe('john.doe@example.com');
                expect(data.PhoneNumber).toBe('123456789');
                expect(data.Gender).toBe('Male');
                expect(data.Vacancy).toBe('QA Engineer');
                expect(data.Agreement).toBe(true);
                await dialog.accept();
            });
        });
    });

    test.describe('Security Tests', () => {
        test('should not allow XSS in First Name field', async ({ page }) => {
            const maliciousInput = "<script>alert('XSS')</script>";
            await formPage.firstNameInput().fill(maliciousInput);
            await formPage.submitForm();

            // Check that no alert is triggered
            let alertTriggered = false;

            page.on('dialog', async (dialog) => {
                alertTriggered = true;
                await dialog.dismiss(); // Close the alert if triggered
            });

            // Wait to ensure no alert appears
            await page.waitForTimeout(1000);

            expect(alertTriggered).toBeFalsy(); // Assert no alert was triggered
        });

        test('should not allow HTML injection in First Name field', async ({ page }) => {
            const maliciousInput = '<img src="x" onerror="alert(\'HTML Injection\')">';
            await formPage.firstNameInput().fill(maliciousInput);
            await formPage.submitForm();

            // Verify that the input value is rendered as plain text
            const firstNameValue = await formPage.firstNameInput().inputValue();
            expect(firstNameValue).toBe(maliciousInput); // Should remain as plain text

            // Verify that no alert is triggered from injected HTML
            let alertTriggered = false;

            page.on('dialog', async (dialog) => {
                alertTriggered = true;
                await dialog.dismiss();
            });

            // Wait to ensure no alert appears
            await page.waitForTimeout(1000);

            expect(alertTriggered).toBeFalsy(); // Assert no alert was triggered
        });
    });

});
