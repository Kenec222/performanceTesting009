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

import React from "react";
import UU5 from "uu5g04";
import "uu5g04-bricks";

const { mount, shallow } = UU5.Test.Tools;

//`UU5.Common.Error`

const data = { invalidToken: { id: "123", data: "some data..." } };
const newdata = { invalidToken: { id: "456", data: "some new set props data..." } };

// force navigator.hardwareConcurrency to 8 so that it doesn't differ between developers machines (used in snapshot of test "moreInfo")
Object.defineProperty(navigator, "hardwareConcurrency", {
  get() {
    return 8;
  },
});
// force userAgent string so that it doesn't change between versions of jsdom
Object.defineProperty(navigator, "userAgent", {
  get() {
    return "Mozilla/5.0 (win32) AppleWebKit/537.36 (KHTML, like Gecko) jsdom";
  },
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Common.ColorSchemaMixin",
  ],
  props: {
    errorInfo: {
      values: ["Kontaktujte prosím +4U Helpdesk"],
    },
    moreInfo: {
      values: [true, false],
    },
    inline: {
      values: [true, false],
    },
    silent: {
      values: [true, false],
    },
    errorData: {
      data,
    },
    bgStyle: {
      values: ["filled", "outline", "transparent"],
    },
    elevation: {
      values: ["-1", "5"],
    },
    borderRadius: {
      values: ["8px", 16],
    },
    //Error props is tested separatelly.
    error: {},
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

let origGetRuntimeLibraries;
beforeEach(() => {
  origGetRuntimeLibraries = UU5.Environment.getRuntimeLibraries;
  UU5.Environment.getRuntimeLibraries = () => {
    let result = { ...origGetRuntimeLibraries() };
    for (let k in result) if (result[k]?.version) result[k].version = "0.0.0";
    return result;
  };
});
afterEach(() => {
  UU5.Environment.getRuntimeLibraries = origGetRuntimeLibraries;
});

describe(`UU5.Common.Error props`, () => {
  UU5.Test.Tools.testProperties(UU5.Common.Error, CONFIG);

  it("error props test", () => {
    const wrapper = shallow(<UU5.Common.Error id={"errorID"} error={new Error("This is test of error props")} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.error).not.toBeNull();
    expect(wrapper.instance().props.error).not.toBeUndefined();
    wrapper.setProps({ error: new Error("This is new error setting by wrapper") });
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.error).not.toBeNull();
    expect(wrapper.instance().props.error).not.toBeUndefined();
  });
});

describe("UU5.Common.Error props without test tool API", () => {
  it("test01 - default snapshot", () => {
    const wrapper = mount(<UU5.Common.Error id={"errorID"} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("test02 - erroData", () => {
    const wrapper = mount(<UU5.Common.Error id={"errorID"} errorData={data} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.errorData).toEqual(
      expect.objectContaining({ invalidToken: { id: "123", data: "some data..." } })
    );
    wrapper.setProps({ errorData: newdata });
    wrapper.update();
    expect(wrapper.instance().props.errorData).toEqual(
      expect.objectContaining({ invalidToken: { id: "456", data: "some new set props data..." } })
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("test03 - error", () => {
    const wrapper = mount(
      <UU5.Common.Error id={"errorID"} error={new Error("This is unhandled exception from Jest")} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("test04 - error", () => {
    const wrapper = mount(<UU5.Common.Error id={"errorID"} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.silent).toBeFalsy();
    wrapper.setProps({ silent: true });
    wrapper.update();
    expect(wrapper.instance().props.silent).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("test05 - inline", () => {
    const wrapper = mount(<UU5.Common.Error id={"errorID"} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.inline).toBeFalsy();
    wrapper.setProps({ inline: true });
    wrapper.update();
    expect(wrapper.instance().props.inline).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("test06 - moreInfo", () => {
    const wrapper = shallow(<UU5.Common.Error id={"errorID"} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.moreInfo).toBeFalsy();
    wrapper.setProps({ moreInfo: true });
    wrapper.update();
    expect(wrapper.instance().props.moreInfo).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("test07 - errorInfo", () => {
    const wrapper = mount(<UU5.Common.Error id={"errorID"} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.errorInfo).toBeNull();
    wrapper.setProps({ errorInfo: "Please contact +4U Helpdesk" });
    wrapper.update();
    expect(wrapper.instance().props.errorInfo).not.toBeNull();
    expect(wrapper).toMatchSnapshot();
  });

  it("test08 - All Error props is set", () => {
    const wrapper = mount(
      <UU5.Common.Error
        id={"errorID"}
        errorData={data}
        error={new Error("Unhandled exception")}
        silent={true}
        inline={true}
        moreInfo={true}
        errorInfo={"Please contact helpdesk."}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
