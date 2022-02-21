/// <reference types="cypress" />


/*
    Author:  Chris Haller
    Date:  Feb. 21, 2022
    Test Framework:  Cypress.io (version 9.5.0)
    Node.js Version:  16.14.0

    NWEA QA Automation Coding Test

    Notes:  Cypress clears state and cache when it initializes a test -- including cookies and cache -- so any previously
            logged in user is now logged out in the active browser session. For these test suites, this Cypress behavior 
            is relied upon to ensure that any previously logged in user is no longer logged in.

            Building Page Objects and other abstractions -- design patterns often used in a Selenium-based automation solution --
            were considered but decided against for this project, since the scope of testing was limited to capturing existence and other 
            properties of elements on one page. Since no further testing was planned for this effort, the need for Page Objects seemed less
            than the potential overhead and costs of creating them for the elements on the page. 

            All but one test suite navigates to the Instagram Login page once at the beginning of the suite, since all of the tests
            in these suites examine the current state of the elements without taking an action (such as a click or inputting text) on
            the page. This greatly reduces the amount of time that these test suites need to run. If desired, however, the before() hook
            may be changed to a beforeEach() hook to clear any previous state and simulate a user arriving at the page for the first time.

            Some of the links in the Footer section appear to be transient -- for example, "Home & Garden". After monitoring which links are 
            consistent and which come and go, the links that are consistently present could be moved into one test suite while any transient 
            links could be moved into another test suite. This would allow the consistent links tests to be run regularly, while the 
            transient links tests could be run less frequently or as desired.

    There are four test suites:
        1) A suite to verify the phone screen grahpics on the left side of the page.
        2) A suite to verify the elements on or vertically adjacents to the Login Form.
        3) A suite to verify the many links and language selector in the Footer of the page.
        4) A suite to verify text input (but not submission) to the input fields.

    How to run:
        - Open a terminal (such as VS Code terminal) and navigate to the test spec located at ./cypress/tests/test_instagram_login_spec.js  (this file).
        - Run the command "npm run cypress" (defined in package.json) or "npx cypress open" to open the Cypress Dashboard. Click on the test spec to run it.
        - Or, run the command "npx cypress run" to run the tests through the CLI (in Headless mode, by default).

    Thank you!
*/


describe('Test phone graphic images', () => {
    /* 
    This test suite tests the phone graphics on the page.
    */

    before(() => {
        // Navigate to home page
        cy.visit('/')
        // Verify the title to check that the Login page is in expected state
        cy.title().should('eq', 'Login • Instagram')
    })


    it('should have a container for the phone screen and embedded images', () => {
        /* 
            Verify:  Container (article and div) holding the phone screen and images - existence 
        */

        /* Assert */
        cy.get('main article div img[alt]')
            .should('exist')
            .and('be.visible')
    })


    it('should have phone screen images that exist and are visible', () => {
        /* 
            Verify:  Phone screen and images - existence, visibility 
        */

        /* Arrange */
        const num_images = 5
        const num_minimum_expected_images = 1

        /* Act */
        const images_container_elem = cy.get('main article div > img[alt]').parent()

        /* Assert */
        images_container_elem.children().should('have.length.at.least', num_minimum_expected_images)
        images_container_elem.find('img').should('be.visible')
        // TODO: Loop through list of images to check for existence of each expected image
        // images_container_elem.children().should('have.attr', 'img')

    })
})




describe('Test all Login Form elements to verify existence, visibility, and correctness', () => {
    /*
        This test suite verifies that all of the elements on the Login Form exist, are visible, and have the correct
        text (or other attributes) where appropriate.
    */

    before(() => {
        // Navigate to home page
        cy.visit('/')

        // Verify the title to check that the Login page is in expected state
        cy.title().should('eq', 'Login • Instagram')
    })


    it('should have a user-facing title that exists and is visible', () => {
        /*
            Verify: User-Facing Title - existence, visibility
            This verifies that the user-facing page title (not the DOM title attribute) exists and is visible to the user.
        */

        /* Arrange */
        const page_title = 'Instagram'
        const page_title_element = cy.get('main h1').contains(page_title)

        /* Assert */
        page_title_element.should('exist')
        page_title_element.should('have.text', page_title)
    })


    it('should have a username input field exists, is visible, and displays the correct text', () => {
        /* 
            Verify:  Username Input - existence, visibility, correct text
        */

        /* Arrange */
        const username_default_text = 'Phone number, username, or email'

        /* Assert */
        // Verify existence and visibility of the Username Input Field
        let username_input_element = cy.get('#loginForm input[name="username"]').should('exist').and('be.visible')

        // Verify that the correct text is displayed
        let username_text_elem = username_input_element.parent().children('span')
        username_text_elem.should('exist').and('be.visible')
        username_text_elem.should('have.text', username_default_text)

    })


    it('should verify that the password input field exists, is visible, and displays the correct text', () => {
        /*
            Verify: Password Input - existence, visibility, correct text displayed
        */

        /* Arrange */
        const password_default_text = 'Password'

        /* Act */
        // Verify existence and visibility of the Password Input field
        let password_input_elem = cy.get('#loginForm input[name="password"][type="password"]').should('exist').and('be.visible')

        /* Assert */
        // Verify that the correct text is displayed
        let password_text_elem = password_input_elem.parent().children('span')
        password_text_elem.should('exist').and('be.visible')
        password_text_elem.should('have.text', password_default_text)
    })


    it('should have a Log In button that exists, is visible, and has the text "Log In"', () => {
        /* 
            Verify:  Log In Button - existence, visibility, correct button text
        */

        /* Arrange */
        const button_text = 'Log In'

        /* Assert */
        cy.get('#loginForm button[type="submit"]').should('exist').and('be.visible')
        cy.get('#loginForm button[type="submit"] > div').should('have.text', button_text)
    })


    it('should have an "Or" label and adjacent lines that exist, are visible, and have the correct text', () => {
        /*
            Verify:  "Or" label and lines - existence, visibility, and text correctness
        */

        /* Arrange */
        const or_divider_elem = cy.get('#loginForm > div > div:nth-child(4)')

        /* Assert */
        or_divider_elem.should('exist').and('be.visible')
        or_divider_elem.children().should('have.length', 3)
        or_divider_elem.contains('div:nth-child(2)', 'or').should('have.text', 'or')
    })


    it('should have a Facebook button that exists, is visible, and has the correct text"', () => {
        /* 
            Verify:  Facebook button - existence, visibility, and text correctness
        */

        /* Arrange */
        let facebook_button_elem = cy.get('#loginForm button[type="button"] .coreSpriteFacebookIcon').parent()

        /* Assert */
        // Check that the button exists and has two children
        facebook_button_elem.should('exist')
        facebook_button_elem.children().should('have.length', 2)

        // Check that the button (icon) and the text are visible and that the text is correct
        cy.get('#loginForm button[type="button"] .coreSpriteFacebookIcon').should('be.visible')
        cy.get('#loginForm button[type="button"] .coreSpriteFacebookIcon + span').should('be.visible').and('have.text', 'Log in with Facebook')
    })


    it('should have a Forgot Password link tht exists, is visible, has the correct text, and has the correct link URL"', () => {
        /*
            Verify:  Forgot Password Link - existence, visibility, text correctness, and target correctness
        */

        /* Arrange */
        const forgot_password_expected_link_text = 'Forgot password?'
        const forgot_password_expected_link_target = '/accounts/password/reset/'

        /* Act */
        let forgot_password_link_elem = cy.get('#loginForm a')

        /* Assert */
        forgot_password_link_elem.should('exist').and('be.visible')
        forgot_password_link_elem.should('have.text', forgot_password_expected_link_text)
        forgot_password_link_elem.should('have.attr', 'href', forgot_password_expected_link_target)

    })


    it('should have New Account Sign Up text that exists, is visible, and has the correct text"', () => {
        /*
            Verify:  New Account Text - existence, visibility, text correctness
        */

        /* Arrange */
        const account_signup_expected_text = "Don't have an account? Sign up"

        /* Act */
        const account_signup_text_elem = cy.get('[data-testid="sign-up-link"]').parent()

        /* Assert */
        account_signup_text_elem.should('exist').and('be.visible')
        account_signup_text_elem.should('have.text', account_signup_expected_text)

    })


    it('should have a New Account Sign Up link that exists, is visible, has the correct text, and has the correct target URL', () => {
        /*
            Verify:  New Account Link - existence, visibility, text correctness, and target correctness
        */

        /* Arrange */
        const account_signup_expected_link_text = 'Sign up'
        const account_signup_expected_link_target = '/accounts/emailsignup/'

        /* Act */
        let account_signup_link_elem = cy.get('a[data-testid="sign-up-link"]')

        /* Assert */
        account_signup_link_elem.should('exist')
            .and('be.visible')
            .and('have.text', account_signup_expected_link_text)
            .and('have.attr', 'href', account_signup_expected_link_target)
    })


    it('should have "Get The App" text that exists and is visible', () => {
        /* 
            Verify:  "Get The App" text - existence and visibility
        */

        /* Arrange */
        const expected_text = 'Get the app.'

        /* Assert */
        cy.get('main p').contains(new RegExp("^" + expected_text + "$", "i"))
            .should('exist')
            .and('be.visible')
    })


    it('should have a "Download on the App Store" link that exists, is visible, and has correct URL', () => {
        /*
            Verify:  "Download on the App Store" link - existence, visibility, and link URL correctness
        */

        /* Arrange */
        const expected_download_app_URL = "https://itunes.apple.com/app/instagram/id389801252?pt=428156&ct=igweb.loginPage.badge&mt=8&vt=lo"

        /* Act */
        const download_app_link_elem = cy.get('[aria-label="Download on the App Store"]')

        /* Assert */
        download_app_link_elem
            .should('exist')
            .and('be.visible')
            .and('have.attr', 'href', expected_download_app_URL)
    })


    it('should verify that the "Download on the App Store" image exists and is visible', () => {
        /* 
            Verify:  "Download on the App Store" image - existence and visibility
        */

        /* Assert */
        cy.get('img[alt="Download on the App Store"]')
            .should('exist')
            .and('be.visible')
    })


    it('should have a "Get it on Google Play" link that exists, is visible, and has correct URL', () => {
        /*
            "Download on the App Store" link - existence, visibility, and link URL correctness
        */

        /* Arrange */
        const expected_google_play_URL = "https://play.google.com/store/apps/details?id=com.instagram.android"

        /* Act */
        const google_play_link_elem = cy.get('[aria-label="Get it on Google Play"]')

        /* Assert */
        google_play_link_elem
            .should('exist')
            .and('be.visible')
    })


    it('should have a "Get it on Google Play" link that exists and is visible', () => {
        /* 
            "Get it on Google Play" image - existence and visibility
        */

        /* Assert */
        cy.get('img[alt="Get it on Google Play"]')
            .should('exist')
            .and('be.visible')
    })

})




describe('Test all Footer Links and Text to verify existence, visibility, and correctness', () => {
    /*
        This test suite tests the elements in the Footer section of the page -- primarily the many links
        that are located there.
        
        TODO:  The link tests, in aggregate, would be good candidates for a single parameterized test. 
    */

    before(() => {
        // Navigate to home page
        cy.visit('/')
        // Verify the title to check that the Login page is in expected state
        cy.title().should('eq', 'Login • Instagram')
    })


    it('should have a link for "Meta" that exists, is visible, and has the expected URL', () => {
        /*
            Verify:  "Meta" link - existence, visibility, and expected URL
        */

        /* Arrange */
        const expected_link_text = "Meta"
        const expected_meta_link_dest = "https://about.facebook.com/meta"

        /* Act */
        const link_elem = cy.get('footer[role="contentinfo"] a').contains(new RegExp("^" + expected_link_text + "$"))

        /* Assert */
        link_elem.should('exist')
            .and('be.visible')
        link_elem.parent().should('have.attr', 'href', expected_meta_link_dest)
    })


    it('should have a link for "About" that exists, is visible, and has the expected URL', () => {
        /*
            Verify:  "About" link - existence, visibility, and expected URL
        */

        /* Arrange */
        const expected_link_text = "About"
        const expected_meta_link_dest = "https://about.instagram.com/"

        /* Act */
        const link_elem = cy.get('footer[role="contentinfo"] a').contains(new RegExp("^" + expected_link_text + "$"))

        /* Assert */
        link_elem.should('exist')
            .and('be.visible')
        link_elem.parent().should('have.attr', 'href', expected_meta_link_dest)
    })


    it('should have a link for "Blog" that exists, is visible, and has the expected URL', () => {
        /*
            Verify:  "Blog" link - existence, visibility, and expected URL
        */

        /* Arrange */
        const expected_link_text = "Blog"
        const expected_meta_link_dest = "https://about.instagram.com/blog/"

        /* Act */
        const link_elem = cy.get('footer[role="contentinfo"] a').contains(new RegExp("^" + expected_link_text + "$"))

        /* Assert */
        link_elem.should('exist')
            .and('be.visible')
        link_elem.parent().should('have.attr', 'href', expected_meta_link_dest)
    })


    it('should have a link for "Jobs" that exists, is visible, and has the expected URL', () => {
        /*
            Verify:  "Jobs" link - existence, visibility, and expected URL
        */

        /* Arrange */
        const expected_link_text = "Jobs"
        const expected_meta_link_dest = "/about/jobs/"

        /* Act */
        const link_elem = cy.get('footer[role="contentinfo"] a').contains(new RegExp("^" + expected_link_text + "$"))

        /* Assert */
        link_elem.should('exist')
            .and('be.visible')
        link_elem.parent().should('have.attr', 'href', expected_meta_link_dest)
    })


    it('should have a link for "Help" that exists, is visible, and has the expected URL', () => {
        /*
            Verify:  "Help" link - existence, visibility, and expected URL
        */

        /* Arrange */
        const expected_link_text = "Help"
        const expected_meta_link_dest = "https://help.instagram.com/"

        /* Act */
        const link_elem = cy.get('footer[role="contentinfo"] a').contains(new RegExp("^" + expected_link_text + "$"))

        /* Assert */
        link_elem.should('exist')
            .and('be.visible')
        link_elem.parent().should('have.attr', 'href', expected_meta_link_dest)
    })


    it('should have a link for "API" that exists, is visible, and has the expected URL', () => {
        /*
            Verify:  "API" link - existence, visibility, and expected URL
        */

        /* Arrange */
        const expected_link_text = "API"
        const expected_meta_link_dest = "https://developers.facebook.com/docs/instagram"

        /* Act */
        const link_elem = cy.get('footer[role="contentinfo"] a').contains(new RegExp("^" + expected_link_text + "$"))

        /* Assert */
        link_elem.should('exist')
            .and('be.visible')
        link_elem.parent().should('have.attr', 'href', expected_meta_link_dest)
    })


    it('should have a link for "Privacy" that exists, is visible, and has the expected URL', () => {
        /*
            Verify:  "Privacy" link - existence, visibility, and expected URL
        */

        /* Arrange */
        const expected_link_text = "Privacy"
        const expected_meta_link_dest = "/legal/privacy/"

        /* Act */
        const link_elem = cy.get('footer[role="contentinfo"] a').contains(new RegExp("^" + expected_link_text + "$"))

        /* Assert */
        link_elem.should('exist')
            .and('be.visible')
        link_elem.parent().should('have.attr', 'href', expected_meta_link_dest)
    })


    it('should have a link for "Terms" that exists, is visible, and has the expected URL', () => {
        /*
            Verify:  "Terms" link - existence, visibility, and expected URL
        */

        /* Arrange */
        const expected_link_text = "Terms"
        const expected_meta_link_dest = "/legal/terms/"

        /* Act */
        const link_elem = cy.get('footer[role="contentinfo"] a').contains(new RegExp("^" + expected_link_text + "$"))

        /* Assert */
        link_elem.should('exist')
            .and('be.visible')
        link_elem.parent().should('have.attr', 'href', expected_meta_link_dest)
    })


    it('should have a link for "Top Accounts" that exists, is visible, and has the expected URL', () => {
        /*
            Verify:  "Top Accounts" link - existence, visibility, and expected URL
        */

        /* Arrange */
        const expected_link_text = "Top Accounts"
        const expected_meta_link_dest = "/directory/profiles/"

        /* Act */
        const link_elem = cy.get('footer[role="contentinfo"] a').contains(new RegExp("^" + expected_link_text + "$"))

        /* Assert */
        link_elem.should('exist')
            .and('be.visible')
        link_elem.parent().should('have.attr', 'href', expected_meta_link_dest)
    })


    it('should have a link for "Hashtags" that exists, is visible, and has the expected URL', () => {
        /*
            Verify:  "Hashtags" link - existence, visibility, and expected URL
        */

        /* Arrange */
        const expected_link_text = "Hashtags"
        const expected_meta_link_dest = "/directory/hashtags/"

        /* Act */
        const link_elem = cy.get('footer[role="contentinfo"] a').contains(new RegExp("^" + expected_link_text + "$"))

        /* Assert */
        link_elem.should('exist')
            .and('be.visible')
        link_elem.parent().should('have.attr', 'href', expected_meta_link_dest)
    })


    it('should have a link for "Locations" that exists, is visible, and has the expected URL', () => {
        /*
            Verify:  "Locations" link - existence, visibility, and expected URL
        */

        /* Arrange */
        const expected_link_text = "Locations"
        const expected_meta_link_dest = "/explore/locations/"

        /* Act */
        const link_elem = cy.get('footer[role="contentinfo"] a').contains(new RegExp("^" + expected_link_text + "$"))

        /* Assert */
        link_elem.should('exist')
            .and('be.visible')
        link_elem.parent().should('have.attr', 'href', expected_meta_link_dest)
    })


    it('should have a link for "Instagram Lite" that exists, is visible, and has the expected URL', () => {
        /*
            Verify:  "Instagram Lite" link - existence, visibility, and expected URL
        */

        /* Arrange */
        const expected_link_text = "Instagram Lite"
        const expected_meta_link_dest = "/web/lite/"

        /* Act */
        const link_elem = cy.get('footer[role="contentinfo"] a').contains(new RegExp("^" + expected_link_text + "$"))

        /* Assert */
        link_elem.should('exist')
            .and('be.visible')
        link_elem.parent().should('have.attr', 'href', expected_meta_link_dest)
    })


    it('should have a link for "Dance" that exists, is visible, and has the expected URL', () => {
        /*
            Verify:  "Dance" link - existence, visibility, and expected URL
        */

        /* Arrange */
        const expected_link_text = "Dance"
        const expected_meta_link_dest = "/topics/dance-and-performance/"

        /* Act */
        const link_elem = cy.get('footer[role="contentinfo"] a').contains(new RegExp("^" + expected_link_text + "$"))

        /* Assert */
        link_elem.should('exist')
            .and('be.visible')
        link_elem.parent().should('have.attr', 'href', expected_meta_link_dest)
    })


    it('should have a link for "Food & Drink" that exists, is visible, and has the expected URL', () => {
        /*
            Verify:  "Food & Drink" link - existence, visibility, and expected URL
        */

        /* Arrange */
        const expected_link_text = "Food & Drink"
        const expected_meta_link_dest = "/topics/food-and-drink/"

        /* Act */
        const link_elem = cy.get('footer[role="contentinfo"] a').contains(new RegExp("^" + expected_link_text + "$"))

        /* Assert */
        link_elem.should('exist')
            .and('be.visible')
        link_elem.parent().should('have.attr', 'href', expected_meta_link_dest)
    })


    it('should have a link for "Home & Garden" that exists, is visible, and has the expected URL', () => {
        /*
            Verify:  "Home & Garden" link - existence, visibility, and expected URL
        */

        /* Arrange */
        const expected_link_text = "Home & Garden"
        const expected_meta_link_dest = "/topics/home-and-garden/"

        /* Act */
        const link_elem = cy.get('footer[role="contentinfo"] a').contains(new RegExp("^" + expected_link_text + "$"))

        /* Assert */
        link_elem.should('exist')
            .and('be.visible')
        link_elem.parent().should('have.attr', 'href', expected_meta_link_dest)
    })


    it('should have a link for "Music" that exists, is visible, and has the expected URL', () => {
        /*
            Verify:  "Music" link - existence, visibility, and expected URL
        */

        /* Arrange */
        const expected_link_text = "Music"
        const expected_meta_link_dest = "/topics/music/"

        /* Act */
        const link_elem = cy.get('footer[role="contentinfo"] a').contains(new RegExp("^" + expected_link_text + "$"))

        /* Assert */
        link_elem.should('exist')
            .and('be.visible')
        link_elem.parent().should('have.attr', 'href', expected_meta_link_dest)
    })


    it('should have a link for "Visual Arts" that exists, is visible, and has the expected URL', () => {
        /*
            Verify:  "Visual Arts" link - existence, visibility, and expected URL
        */

        /* Arrange */
        const expected_link_text = "Visual Arts"
        const expected_meta_link_dest = "/topics/visual-arts/"

        /* Act */
        const link_elem = cy.get('footer[role="contentinfo"] a').contains(new RegExp("^" + expected_link_text + "$"))

        /* Assert */
        link_elem.should('exist')
            .and('be.visible')
        link_elem.parent().should('have.attr', 'href', expected_meta_link_dest)
    })


    it('should have a language selector that exists and has at least one option', () => {
        /*
            Verify:  Language Selector - existence and at least one option present
        */
        /* Act */
        const lang_select_elem = cy.get('footer select[aria-label="Switch Display Language"]')

        /* Assert */
        lang_select_elem.should('exist')
        lang_select_elem.children().should('not.be.empty')
    })


    it('should have the default text of the language selector exist and be visible', () => {
        /* 
            Verify:  Language Selector - default text existence, visibility, text set to "English"
        */

        /* Arrange */
        const default_lang_choice_text = "English"

        /* Act */
        const lang_select_parentspan_elem = cy.get('footer select[aria-label="Switch Display Language"]').parent()

        /* Assert */
        lang_select_parentspan_elem.contains('span', default_lang_choice_text)
            .should('exist')
            .and('be.visible')
            .and('have.text', default_lang_choice_text)
    })


    it('should have the Copyright text exist and be visible', () => {
        /*
            Verify:  Copyright text - existence and visibility
        */

        /* Arrange */
        const copyright_text = "© 2022 Instagram from Meta"

        /* Assert */
        cy.get('footer div').contains(copyright_text)
            .should('exist')
            .and('be.visible')
    })

})




describe('Test text entry to input fields', () => {
    /*
        This test suite tests the acceptance of input into the input fields on the page. It also tests the 
        Show / Hide link's text and visibility, which depend on text input to the input fields.
    */
    beforeEach(() => {
        // Navigate to home page
        cy.visit('/')
        // Verify the title to check that the Login page is in expected state
        cy.title().should('eq', 'Login • Instagram')
    })


    it('should verify that the username input field accepts text input and displays that text as expected', () => {
        /*
            Username Input - text input accepted and displayed correctly
        */

        /* Arrange */
        const test_username = "Test Username"

        /* Assert */
        cy.get('#loginForm input[name="username"]').type(test_username)
            .should('have.value', test_username)
    })


    it('should verify that the password input field accepts text input and displays that text as expected', () => {
        /*
            Password Input - text input accepted and displayed correctly
        */

        /* Arrange */
        const test_password = "Test Password"

        /* Assert */
        cy.get('#loginForm input[name="password"][type="password"]').type(test_password)
            .should("have.value", test_password)
    })


    it('should verify that the Show button appears when a password is input', () => {
        /*
            Password Input Show/Hide - text appears as expected after input, and the states flip on click
        */

        /* Arrange */
        const test_password = "Test Password"
        cy.get('#loginForm input[name="password"][type="password"]').type(test_password)
        let show_button_elem = cy.get('#loginForm button[type="button"]').contains("Show")

        /* Act */
        show_button_elem.click()

        /* Assert */
        show_button_elem = cy.get('#loginForm button[type="button"]').contains("Hide")
            .should('exist')
            .and('be.visible')
            .and('have.text', 'Hide')
    })
})