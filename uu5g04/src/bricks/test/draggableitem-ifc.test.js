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
//@@viewOff:imports

const { mount, shallow, wait } = UU5.Test.Tools;

const Draggable = UU5.Common.VisualComponent.create({
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.ContentMixin, UU5.Bricks.DraggableMixin],

  render: function () {
    return (
      <div {...this.getMainAttrs()}>
        {this.getChildren()}
        {this.getDisabledCover()}
      </div>
    );
  },
});

describe("UU5.Bricks.DraggableItem interface testing", () => {
  let container;
  beforeEach(function () {
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(function () {
    container.remove();
  });

  it("moveToPostion(x,y)", () => {
    const wrapper = mount(
      <Draggable id="parentId">
        <UU5.Bricks.DraggableItem id={"idItem"} className="item" x={350} y={15} />
      </Draggable>,
      { attachTo: container }
    );
    let component = wrapper.find("#idItem").first().instance();
    expect(component.state.x).toBe(350);
    expect(component.state.y).toBe(15);
    const returnValue = component.moveToPosition(40, 20);
    wrapper.update();
    expect(returnValue).toBe(component);
    expect(component.state.x).toBe(390);
    expect(component.state.y).toBe(35);
  });

  it("setPosition(x,y, setStateCallBack)", () => {
    const wrapper = mount(
      <Draggable id="parentId">
        <UU5.Bricks.DraggableItem id={"idItem"} className="item" x={350} y={15} />
      </Draggable>,
      { attachTo: container }
    );
    let component = wrapper.find("#idItem").first().instance();
    const mockFunc = jest.fn();
    expect(component.state.x).toBe(350);
    expect(component.state.y).toBe(15);
    const returnValue = component.setPosition(10, 15, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(component);
    expect(component.state.x).toBe(360);
    expect(component.state.y).toBe(30);
  });

  it("stopDragging()", () => {
    const wrapper = mount(
      <Draggable id="parentId">
        <UU5.Bricks.DraggableItem id={"idItem"} className="item" x={350} y={15} />
      </Draggable>,
      { attachTo: container }
    );
    let component = wrapper.find("#idItem").first().instance();
    const returnValue = component.stopDragging();
    wrapper.update();
    expect(returnValue).toBe(component);
    expect(() => component.stopDragging()).not.toThrow();
    expect(returnValue).not.toBeNull();
    expect(returnValue).not.toBeUndefined();
  });
});
