import { Page } from '@playwright/test';

export class FormPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Selectors for fields
    firstNameInput = () => this.page.locator('[name="FirstName"]');
    lastNameInput = () => this.page.locator('[name="LastName"]');
    emailInput = () => this.page.locator('[name="Email"]');
    phoneInput = () => this.page.locator('[name="PhoneNumber"]');
    genderMaleRadio = () => this.page.locator('input[name="Gender"][value="Male"]');
    genderFemaleRadio = () => this.page.locator('input[name="Gender"][value="Female"]');
    vacancyDropdown = () => this.page.locator('select[name="Vacancy"]');
    cvUploadInput = () => this.page.locator('input[name="myfile"]');
    agreementCheckbox = () => this.page.locator('[name="Agreement"]');
    submitButton = () => this.page.locator('[name="submitbutton"]');

    // Validation message selectors
    firstNameValidation = () => this.page.locator('p:has-text("Valid first name is required.")');
    lastNameValidation = () => this.page.locator('p:has-text("Valid last name is required.")');
    emailValidation = () => this.page.locator('p:has-text("Valid email is required.")');
    phoneValidation = () => this.page.locator('p:has-text("Valid phone number is required.")');
    genderValidation = () => this.page.locator('p:has-text("Choose your gender.")');
    cvValidation = () => this.page.locator('p:has-text("Attach your CV file.")');
    agreementValidation = () => this.page.locator('p:has-text("You must agree to the processing of personal data.")');


    // Methods
    async fillForm(fields: { firstName: string; lastName: string; email: string; phone: string; gender: string; vacancy: string; }) {
        await this.firstNameInput().fill(fields.firstName);
        await this.lastNameInput().fill(fields.lastName);
        await this.emailInput().fill(fields.email);
        await this.phoneInput().fill(fields.phone);
        if (fields.gender === 'Male') {
            await this.genderMaleRadio().check();
        } else {
            await this.genderFemaleRadio().check();
        }
        await this.vacancyDropdown().selectOption(fields.vacancy);
    }

    async uploadCV(filePath: string) {
        await this.cvUploadInput().setInputFiles(filePath);
    }

    async agreeToTerms() {
        await this.agreementCheckbox().check();
    }

    async submitForm() {
        await this.submitButton().click();
    }
}
