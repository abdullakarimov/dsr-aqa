# Web UI Playground Test Automation Suite

## Overview

This repository contains a **Playwright**-based test automation suite written in TypeScript for the Web UI Playground. The suite covers:

* Form Field Validations
* Full Form Submission
* Security Tests (e.g., XSS, HTML Injection)

## Features

* Automated testing of 28 test cases.
* Covers all field validations, form interactions, and submission behavior.
* Security tests ensure client-side robustness against XSS and HTML injection.
* Built using modern tools: Playwright and TypeScript.

## Prerequisites

* **Node.js** (v16 or later)
* **npm** or **yarn**

## Installation

1. Clone the repository:
```
git clone https://github.com/abdullakarimov/dsr-aqa.git
cd dsr-aqa
```
2. Install dependencies:
```
npm install
```

## Running Tests
Run the entire suite:
```
npx playwright test
```

## Tools and Frameworks
* **Playwright**: For browser automation.
* **TypeScript**: For strongly-typed code.
* **React Hook Form**: Observed in the Web UI Playground for form validation.
