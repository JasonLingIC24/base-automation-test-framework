import { Label } from "./label.element";
import { ListItems } from "./listItems.element";

/**
 * Implementation of stepper element
 */
export class StepIndication extends ListItems {
  private _tickedLbl: Label;
  private _activeLbl: Label;
  private _notActiveLbl: Label;

  constructor(
    entityName: string,
    locator: string,
    tickedStepIcon: Label,
    activeStateLbl: Label,
    notActiveStateLbl: Label
  ) {
    super(entityName, locator);
    this._tickedLbl = tickedStepIcon;
    this._activeLbl = activeStateLbl;
    this._notActiveLbl = notActiveStateLbl;
  }

  /**
   * Asserts if actual amount of steps match expected amount
   * @param expectedAmount {number} Expected steps amount
   */
  assetStepsAmount(expectedAmount: number) {
    return super.assertListLength(expectedAmount);
  }

  private assertStepState(
    stepIdentifier: string | number,
    statusMarkLocator: string,
    expectedState: string
  ) {
    let step =
      typeof stepIdentifier == "number"
        ? this.getItem(stepIdentifier as number)
        : this.getItem(stepIdentifier as string);

    step.find(statusMarkLocator).should(expectedState);
    return this;
  }

  /**
   * Asserts if the step is in active state
   * @param stepIdentifier {string} Text to identify step
   * @param stepIdentifier {number} Index to identify step
   */
  assertStepIsActive(stepIdentifier: string | number) {
    this.assertStepState(stepIdentifier, this._activeLbl.locator, "exist");
    this.assertStepState(stepIdentifier, this._tickedLbl.locator, "not.exist");
    this.assertStepState(
      stepIdentifier,
      this._notActiveLbl.locator,
      "not.exist"
    );
    return this;
  }

  /**
   * Asserts if the step is in inactive state
   * @param stepIdentifier {string} Text to identify step
   * @param stepIdentifier {number} Index to identify step
   */
  assertStepNotActive(stepIdentifier: string | number) {
    this.assertStepState(stepIdentifier, this._notActiveLbl.locator, "exist");
    this.assertStepState(stepIdentifier, this._tickedLbl.locator, "not.exist");
    this.assertStepState(stepIdentifier, this._activeLbl.locator, "not.exist");
    return this;
  }

  /**
   * Asserts if the step is in complete state
   * @param stepIdentifier {string} Text to identify step
   * @param stepIdentifier {number} Index to identify step
   */
  assertStepTicked(stepIdentifier: string | number) {
    this.assertStepState(stepIdentifier, this._tickedLbl.locator, "exist");
    this.assertStepState(stepIdentifier, this._activeLbl.locator, "not.exist");
    this.assertStepState(
      stepIdentifier,
      this._notActiveLbl.locator,
      "not.exist"
    );
    return this;
  }

  /**
   * Asserts if a step includes expected text
   * @param stepIdentifier {number} Index to identify step
   * @param expectedText {string} Text included in the step
   */
  assertStepIncludesText(stepIdentifier: number, expectedText: string) {
    this.getItem(stepIdentifier).should("include.text", expectedText);
  }
}
