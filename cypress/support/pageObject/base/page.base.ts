import { Label } from '../elements/label.element';
import { BaseElement } from './element.base';
import { BaseEntity } from './entity.base';

/**
 * Base page which contains base logic and interaction with the page presentation.
 * Parent for all specific pages (Login Page, Select Practice Page etc).
 */
export class BasePage extends BaseEntity {
  /**
   * Page pattern of the URL of page
   */
  private _pagePattern: RegExp;

  /**
   * Creates an instance of base page.
   * @param pageName {string} Name of page
   * @param urlPattern {RegExp} Page URL pattern
   */
  constructor(pageName: string, urlPattern?: RegExp) {
    super(pageName);
    this._pagePattern = urlPattern;
  }

  /**
   * Page name getter
   */
  get pageName() {
    return this.entityName;
  }

  /**
   * Page pattern getter
   */
  get pagePattern() {
    return this._pagePattern;
  }

  /**
   * Page body getter
   * @returns Label with `body` locator
   */
  get body() {
    return new Label('Body', 'body');
  }

  /**
   * Opens page with specific URL, then waits until document.readyState is equal to complete.
   * @returns Instance of the page
   * @param url {String} URL which is used to proceed to page
   */
  open(url: string = '/') {
    cy.visit(url);
    cy.waitUntil(() =>
      cy.window().then((win) => win.document.readyState === 'complete'),
    );
    return this;
  }

  /**
   * Opens page with specific URL and further setting special cookie, then waits until document.readyState is equal to complete.
   * @returns Instance of the page
   * @param url {String} URL which is used to proceed to page
   * @param cookieName {String}
   * @param cookieValue {String}
   */
  openWithCookie(url: string = '/', cookieName: string, cookieValue: string) {
    cy.setCookie(cookieName, cookieValue);
    cy.visit(url);
    cy.waitUntil(() =>
      cy.window().then((win) => win.document.readyState === 'complete'),
    );
    return this;
  }

  /**
   * Sets browser cookie.
   * @returns Instance of the page
   * @param cookieName {String}
   * @param cookieValue {String}
   */
  setCookie(cookieName: string, cookieValue: string) {
    cy.setCookie(cookieName, cookieValue);
    return this;
  }

  /**
   * Reloads the current page
   */
  reloadPage() {
    cy.reload();
    return this;
  }

  /**
   * Moves focus to specific element on page
   * @param elem {BaseElement} Element to which the focus should be moved
   * @returns Page instance so it's possible to chain further.
   */
  focus(elem: BaseElement) {
    cy.get(elem.locator).then((e) => {
      this.logger.step(
        `[${this.pageName}]: Moving focus to [${elem.entityName}]`,
      );
      elem.click();
    });

    return this;
  }

  /**
   * Moves focus to body
   * @returns Page instance so it's possible to chain further.
   */
  moveFocusToBody() {
    this.logger.step(`[${this.pageName}]: Moving focus to page body`);
    cy.get('body').click();

    return this;
  }

  /**
   * Checks if URL matches pattern for the current page
   * @param pattern {RegExp} Pattern that URL should match
   * @returns Page instance so it's possible to chain further.
   */
  verifyUrlMatches(pattern: RegExp = this.pagePattern) {
    cy.url().then((url) => {
      this.logger.step(
        `[${this.pageName}]: Checking if current url [${url}] matches [${pattern}]`,
      );
      cy.url().should('match', pattern);
    });

    this.settleDown();
    cy.waitUntil(() =>
      cy.window().then((win) => win.document.readyState === 'complete'),
    );
    return this;
  }

  /**
   * Checks if page contains reg exp
   * @param regExp {RegExp} Pattern that should exist on page
   */
  verifyPageContainsRegExp(regExp: RegExp) {
    cy.contains(regExp);
  }

  /**
   * Checks if page contains text
   * @param expectedText {string} Text that should exist on page
   */
  verifyPageContainsText(expectedText: string, options: object | null = null) {
    this.logger.step(`Verifying that page contains text [${expectedText}]`);
    if (options === null) {
      cy.contains(expectedText);
      return;
    }
    cy.contains(expectedText, options);
    return this;
  }

  /**
   * Checks if page doesn't contains text
   * @param expectedText {string} Text that should not exist on page
   */
  verifyPageNotContainsText(text: string) {
    this.logger.step(`Verifying that page doesn't contain [${text}]`);
    this.body.assertNotContainsText(text);
  }

  // This will stop anything else happening until all the network requests have resolved
  // This has the effect of avoiding trying to click on things whilst the UI is still in flux
  settleDown = () => {
    cy.log('Waiting for network requests to settle...');
    return cy.window({ log: false }).then(
      {
        timeout: 10000,
      },
      (win) =>
        new Cypress.Promise((resolve, reject) =>
          // @ts-ignore
          win.requestIdleCallback(
            (deadline) => {
              if (deadline.timeRemaining() == 0 || deadline.didTimeout) {
                cy.log('WARNING: timed out (9s) waiting to settleDown');
              }
              resolve();
            },
            { timeout: 9000 },
          ),
        ),
    );
  };

  /**
   * NOTE: for flaky tests only, when no other options to anchor to.
   * @param timeout {number} Time to wait
   */
  wait(timeout: number) {
    cy.wait(timeout, { log: false });
    return this;
  }

  /**
   * Scroll to element on page
   *
   */
  scrollToElement(element: BaseElement) {
    cy.get(element.locator).scrollIntoView();
  }
}
