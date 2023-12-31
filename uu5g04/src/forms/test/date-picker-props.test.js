/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
import { OnChangeFeedbackAndOnValidate } from "./helpers";
//@@viewOff:imports

const { mount, shallow, wait } = UU5.Test.Tools;

let origDateNow = Date.now;
let origGetLanguage = UU5.Common.Tools.getLanguage;
beforeEach(() => {
  Date.now = () => new Date(1548411167098); // 25.01.2019 11:12:47.098 GMT+0100
  UU5.Common.Tools.getLanguage = () => "en";
});
afterEach(() => {
  Date.now = origDateNow;
  UU5.Common.Tools.getLanguage = origGetLanguage;
});

const MixinPropsFunction = UU5.Common.VisualComponent.create({
  mixins: [UU5.Common.BaseMixin],

  getInitialState() {
    return {
      isCalled: false,
      defaultValue: "09.02.2018",
    };
  },

  onFocusHandler(event) {
    alert("onFocus event has been called.");
    this.setState({ isCalled: true });
  },

  onBlurHandler(event) {
    alert("onBlur event has been called.");
    this.setState({ isCalled: true });
  },

  onEnterHandler(event) {
    alert("onEnter event has been called.");
    this.setState({ isCalled: true });
  },

  validateOnChangeHandler(event) {
    alert("ValidateOnChange event has been called.");
    this.setState({ isCalled: true });
  },

  onChangeHandler(event) {
    alert("onChange event has been called.");
    this.setState({ isCalled: true });
    this.setState({ defaultValue: event.target.value });
  },

  onValidateHandler(event) {
    alert("onValidate event has been called.");
    this.setState({ isCalled: true });
    this.setState({ defaultValue: event.target.value });
  },

  onChangeFeedbackHandler(event) {
    alert("onChangeFeedback event has been called.");
    this.setState({ isCalled: true });
    this.setState({ defaultValue: event.target.value });
  },

  parseDateHandler(event) {
    alert("parseDate props was called.");
    this.setState({ isCalled: true });
  },

  getComponent() {
    return this._component;
  },

  render() {
    return (
      <UU5.Forms.DatePicker
        id={"checkID"}
        ref_={(comp) => (this._component = comp)}
        label="Date of birth"
        value={this.state.defaultValue}
        onFocus={this.onFocusHandler}
        onBlur={this.onBlurHandler}
        onEnter={this.onEnterHandler}
        validateOnChange={true}
        onChange={this.onChangeHandler}
        onValidate={this.onValidateHandler}
        onChangeFeedback={this.onChangeFeedbackHandler}
        parseDate={this.parseDateHandler}
      />
    );
  },
});

//`${TAG_NAME}`
const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Forms.TextInputMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Forms.InputMixin",
  ],
  props: {
    value: {
      values: ["1.1.2017"],
    },
    dateFrom: {
      values: ["1.1.1990"],
    },
    dateTo: {
      values: ["1.1.2020"],
    },
    buttonHidden: {
      values: [true, false],
    },
    iconOpen: {
      values: ["mdi-clock-outline"],
    },
    iconClosed: {
      values: ["mdi-calendar"],
    },
    format: {
      values: ["dd.mm.Y", "dd/mm/Y", "dd-mm-Y", "dd:mm:Y - q"],
    },
    hideFormatPlaceholder: {
      values: [true, false],
    },
    country: {
      values: ["en-us"],
    },
    nanMessage: {
      values: ["Prosím zadejte validní datum."],
    },
    beforeRangeMessage: {
      values: ["Zkus zadat pozdější datum."],
    },
    afterRangeMessage: {
      values: ["Přestřelil jsi, zkus trochu ubrat."],
    },
    disableBackdrop: {
      values: [true, false],
    },
    showTodayButton: {
      values: [true, false],
    },
    calendarStartView: {
      values: ["days", "months", "years"],
    },
    hideWeekNumber: {
      values: [true, false],
    },
    // parseDate - In agreement with developers, this props need not be tested.
  },
  requiredProps: {
    //The component does not have any required props
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

const ISOFormatTest = (props, country, expectedValue) => {
  const wrapper = mount(<UU5.Forms.DatePicker {...props} country={country} />);

  expect(wrapper.find("input").getDOMNode().value).toBe(expectedValue);
};

describe(`UU5.Forms.DatePicker props`, () => {
  UU5.Test.Tools.testProperties(UU5.Forms.DatePicker, CONFIG);

  it(`ISO format value`, () => {
    let defaultCountry = "en-US";
    ISOFormatTest({ value: "2019-07-20" }, defaultCountry, "7/20/2019");
    ISOFormatTest({ value: "2019-07-20T07:00:00.000Z" }, defaultCountry, "7/20/2019");
    ISOFormatTest({ value: "2019-07-20T07:00:00.000+02:00" }, defaultCountry, "7/20/2019");
    // FIXME Uncomment when Jest tests use full-icu so that Intl.DateTimeFormat works.
    // ISOFormatTest({ value: "2019-07-20T07:00:00.000+02:00" }, "cs-CZ", "20. 7. 2019");
  });

  it(`step`, () => {
    // default value "days"
    let wrapper = mount(<UU5.Forms.DatePicker />);
    wrapper.instance().open();
    wrapper.update();
    expect(wrapper.find(".uu5-forms-calendar-month-table").length).toBe(1);

    wrapper = mount(<UU5.Forms.DatePicker value="2015-01" step="months" />);
    wrapper.instance().open();
    wrapper.update();
    expect(wrapper.find(".uu5-forms-calendar-year-table").length).toBe(1);
    let value = wrapper.instance().getValue();
    expect(value).toBe("2015-01");

    wrapper = mount(<UU5.Forms.DatePicker value="2015" step="years" />);
    wrapper.instance().open();
    wrapper.update();
    expect(wrapper.find(".uu5-forms-calendar-decade-table").length).toBe(1);
    value = wrapper.instance().getValue();
    expect(value).toBe("2015");
  });

  it(`valueType`, () => {
    let onChangeFn = jest.fn();
    let wrapper = mount(<UU5.Forms.DatePicker value="2.2.2020" valueType="iso" onChange={onChangeFn} />);
    expect(wrapper.instance().getValue()).toBe("2020-02-02");
  });
});

describe(`UU5.Forms.DatePicker props function -> Text.InputMixin`, () => {
  it("onFocus()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction />);
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate("focus");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onFocus event has been called.");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onFocus event has been called.");
    expect(wrapper).toMatchSnapshot();
  });

  it("onBlur()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction />);
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate("blur");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onBlur event has been called.");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onBlur event has been called.");
    expect(wrapper).toMatchSnapshot();
  });

  it("onEnter()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction />);
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate("enter");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onEnter event has been called.");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onEnter event has been called.");
    expect(wrapper).toMatchSnapshot();
  });

  /**
   * You can not simulate events that do not start with it on. For example, onChange, onChangeFeedback.
   * Therefore, the validateonChange event is simulated here so that it is set to true, and event onValidate sets the message and feedback to error,
   * success if the component is valid. Valid component means that it is not empty and has the correct format.
   */

  it("validateOnChange() - input is invalid", () => {
    const wrapper = shallow(
      <UU5.Forms.DatePicker
        id={"uuID"}
        label="Date of birth"
        validateOnChange={true}
        onValidate={(opt) => {
          let feedback;
          if (opt.value) {
            feedback = {
              feedback: "success",
              message: "Is valid.",
              value: opt.value,
            };
          } else {
            feedback = {
              feedback: "error",
              message: "Not valid.",
              value: opt.value,
            };
          }
          return feedback;
        }}
      />
    );
    expect(wrapper.instance().state.message).toEqual("Not valid.");
    expect(wrapper.instance().state.feedback).toEqual("error");
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper).toMatchSnapshot();
  });

  it("validateOnChange() - input is valid", () => {
    const wrapper = shallow(
      <UU5.Forms.DatePicker
        id={"uuID"}
        value={"12.12.2018"}
        label="Date of birth"
        validateOnChange={true}
        onValidate={(opt) => {
          let feedback;
          if (opt.value) {
            feedback = {
              feedback: "success",
              message: "Is valid.",
              value: opt.value,
            };
          } else {
            feedback = {
              feedback: "error",
              message: "Not valid.",
              value: opt.value,
            };
          }
          return feedback;
        }}
      />
    );
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper.instance().state.value).toMatch(/12.12.2018/);
    expect(wrapper).toMatchSnapshot();
  });
});

describe(`UU5.Forms.DatePicker props function -> Forms.InputMixin`, () => {
  it("onChange()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state().defaultValue).toMatch(/09.02.2018/);
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate("change", { target: { value: "24.12.2018" } });
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onChange event has been called.");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(wrapper.state().defaultValue).toMatch(/24.12.2018/);
    expect(window.alert.mock.calls[0][0]).toEqual("onChange event has been called.");
    expect(wrapper).toMatchSnapshot();
  });

  it(`onChangeDefault() with callback`, () => {
    let callback = jest.fn();
    let wrapper = shallow(<UU5.Forms.DatePicker />);
    wrapper.instance().onChangeDefault({ _data: { type: "input" } }, callback);
    expect(callback).toBeCalled();
  });

  it("onValidate()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction />);
    expect(wrapper.state().isCalled).toBeFalsy();
    expect(wrapper.state().defaultValue).toMatch(/09.02.2018/);
    wrapper.simulate("validate", { target: { value: "24.12.2018" } });
    expect(wrapper.state().defaultValue).toMatch(/24.12.2018/);
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onValidate event has been called.");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onValidate event has been called.");
    expect(wrapper).toMatchSnapshot();
  });

  it("onChangeFeedback()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state().isCalled).toBeFalsy();
    expect(wrapper.state().defaultValue).toMatch(/09.02.2018/);
    wrapper.simulate("changeFeedback", { target: { value: "24.12.2018" } });
    expect(wrapper.state().defaultValue).toMatch(/24.12.2018/);
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onChangeFeedback event has been called.");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onChangeFeedback event has been called.");
    expect(wrapper).toMatchSnapshot();
  });

  it("onChangeFeedback + onValidate controlled", () => {
    let onChangeFeedback = jest.fn();
    let onValidate = jest.fn();
    mount(
      <OnChangeFeedbackAndOnValidate
        component={UU5.Forms.DatePicker}
        onChangeFeedback={onChangeFeedback}
        onValidate={onValidate}
      />
    );
    expect(onChangeFeedback).toHaveBeenCalledTimes(2);
    expect(onValidate).toHaveBeenCalledTimes(1);
  });
});

describe(`UU5.Forms.DatePicker props function`, () => {
  it("parseDate()", function () {
    const dateValue = "1:1:2020";
    const parseDateMethod = jest.fn((stringDate) => {
      let date = null;
      stringDate = stringDate && stringDate.replace(/ /g, "");
      let regExp = new RegExp("^(\\d{1,2})\\:(\\d{1,2})\\:(\\d{4})$");
      if (regExp.test(stringDate)) {
        let replacedDate = stringDate.replace(regExp, "$3-$2-$1");
        date = Date.parse(replacedDate) ? new Date(replacedDate) : null;
      }
      return date;
    });
    const wrapper = shallow(<UU5.Forms.DatePicker id={"checkID"} parseDate={parseDateMethod} format="dd:mm:Y" />);
    parseDateMethod.mockClear();
    // according to docs, parseDate is for parsing passed value, i.e. calling getValue()
    // should trigger it (though maybe multiple times so we'll check only last invocation)
    wrapper.setProps({ value: dateValue }).instance().getValue();
    expect(parseDateMethod).toBeCalled();
    expect(parseDateMethod.mock.calls[parseDateMethod.mock.calls.length - 1][0]).toEqual("01:01:2020");
    expect(wrapper).toMatchSnapshot();
  });
});

describe(`UU5.Forms.DatePicker check default values`, () => {
  it(`UU5.Forms.DatePicker default props`, () => {
    const wrapper = shallow(<UU5.Forms.DatePicker id={"uuID"} />);
    expect(wrapper).toMatchSnapshot();
    //Check default values of props because it should not be in snapshot.
    expect(wrapper.instance().props.value).toBe(null);
    expect(wrapper.instance().props.dateFrom).toBe(null);
    expect(wrapper.instance().props.dateTo).toBe(null);
    expect(wrapper.instance().props.buttonHidden).toBeFalsy();
    expect(wrapper.instance().props.iconOpen).toMatch(/mdi-calendar/);
    expect(wrapper.instance().props.iconClosed).toMatch(/mdi-calendar/);
    expect(wrapper.instance().props.format).toBe(null);
    expect(wrapper.instance().props.hideFormatPlaceholder).toBe(false);
    expect(wrapper.instance().props.hideWeekNumber).toBe(false);
    expect(wrapper.instance().props.country).toBe(null);
    expect(wrapper.instance().props.nanMessage).toMatchObject({
      cs: "Prosím zadejte čas a datum ve správném formátu.",
      en: "Please insert a valid date and time.",
    });
    expect(wrapper.instance().props.beforeRangeMessage).toMatchObject({
      cs: "Datum a čas jsou mimo rozsah.",
      en: "Date and time is out of range.",
    });
    expect(wrapper.instance().props.afterRangeMessage).toMatchObject({
      cs: "Datum a čas jsou mimo rozsah.",
      en: "Date and time is out of range.",
    });
    expect(wrapper.instance().props.parseDate).toBe(null);
    expect(wrapper.instance().props.disableBackdrop).toBeFalsy();
  });

  it(`UU5.Commons.Mixin Base,Elementary`, () => {
    const wrapper = shallow(<UU5.Forms.DatePicker id={"uuID"} />);
    //Check UU5.Common.Elementary.Mixin default props
    expect(wrapper.instance().props.hidden).toBeFalsy();
    expect(wrapper.instance().props.disabled).toBeFalsy();
    expect(wrapper.instance().props.selected).toBeFalsy();
    expect(wrapper.instance().props.controlled).toBeTruthy;
    //Check default values of props BaseMixin.
    expect(wrapper.instance().props.id).toEqual("uuID");
    expect(wrapper.instance().props.name).toBe(null);
    expect(wrapper.instance().props.tooltip).toBe(null);
    expect(wrapper.instance().props.className).toBe(null);
    expect(wrapper.instance().props.style).toBe(null);
    expect(wrapper.instance().props.mainAttrs).toBe(null);
    expect(wrapper.instance().props.parent).toBe(null);
    expect(wrapper.instance().props.ref_).toBe(null);
    expect(wrapper.instance().props.noIndex).toBeFalsy();
    //Check UU5.Common.PureRender.Mixin default values
    expect(wrapper.instance().props.pureRender).toBeFalsy();
  });

  it(`UU5.Forms.InputMixin`, () => {
    const wrapper = shallow(<UU5.Forms.DatePicker id={"uuID"} />);
    expect(wrapper.instance().props.inputAttrs).toBe(null);
    expect(wrapper.instance().props.size).toEqual("m");
    expect(wrapper.instance().props.readOnly).toBeFalsy();
    expect(wrapper.instance().props.feedback).toEqual("initial");
    expect(wrapper.instance().props.message).toBe(null);
    expect(wrapper.instance().props.label).toBe(null);
    expect(wrapper.instance().props.onChange).toBe(null);
    expect(wrapper.instance().props.onValidate).toBe(null);
    expect(wrapper.instance().props.onChangeFeedback).toBe(undefined);
    expect(wrapper.instance().props.inputColWidth).toMatchObject({ xs: 12, s: 7 });
    expect(wrapper.instance().props.labelColWidth).toMatchObject({ xs: 12, s: 5 });
  });

  it(`UU5.Forms.TextInputMixin`, () => {
    const wrapper = shallow(<UU5.Forms.DatePicker id={"uuID"} />);
    expect(wrapper.instance().props.placeholder).toBe(null);
    expect(wrapper.instance().props.required).toBeFalsy();
    expect(wrapper.instance().props.requiredMessage).toBe(null);
    expect(wrapper.instance().props.focusMessage).toBe(null);
    expect(wrapper.instance().props.patternMessage).toBe(null);
    expect(wrapper.instance().props.autocompleteItems).toBe(null);
    expect(wrapper.instance().props.onFocus).toBe(null);
    expect(wrapper.instance().props.onBlur).toBe(null);
    expect(wrapper.instance().props.onEnter).toBe(null);
    expect(wrapper.instance().props.validateOnChange).toBeFalsy();
  });
});

describe(`UU5.Forms.DatePicker props extra`, () => {
  it("format", () => {
    const wrapper = mount(
      <UU5.Forms.DatePicker id={"uuID"} value={new Date(2019, 7, 2, 0, 0, 0, 0)} format="dd:mm:Y - q" />
    );

    let input = wrapper.find("input").first().instance();
    expect(input).toBeTruthy();
    expect(input.value).toBe("02:08:2019 - 3");
    expect(+wrapper.instance().getValue()).toBe(+new Date(2019, 7, 2, 0, 0, 0, 0));

    wrapper.instance().setValue("08:02:2019 - 1");
    input = wrapper.find("input").first().instance();
    expect(input).toBeTruthy();
    expect(input.value).toBe("08:02:2019 - 1");
    expect(+wrapper.instance().getValue()).toBe(+new Date(2019, 1, 8, 0, 0, 0, 0));

    wrapper.unmount();
  });
});
