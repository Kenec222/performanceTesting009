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
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";
import Css from "./internal/css.js";
import Lsi from "./internal/bricks-editable-lsi.js";

const EditableRow = UU5.Common.Component.lazy(async () => {
  await SystemJS.import("uu5g04-forms");
  await SystemJS.import("uu5g04-bricks-editable");
  return import("./internal/row-editable.js");
});

let editationLazyLoaded = false;

import "./row.less";
//@@viewOff:imports

export const Row = UU5.Common.VisualComponent.create({
  displayName: "Row", // for backward compatibility (test snapshots)

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.SectionMixin,
    UU5.Common.EditableMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Row"),
    nestingLevelList: [
      "spa",
      "page",
      "bigBoxCollection",
      "bigBoxCollection",
      "boxCollection",
      "box",
      "smallBoxCollection",
    ],
    classNames: {
      main: ns.css("row"),
      spacing: ns.css("row-spacing"),
      noSpacing: ns.css("row-nospacing"),
      standard: ns.css("row-standard"),
      flex: ns.css("row-flex"),
      editation: ns.css("row-editation"),
      spaceAround: () => Css.css`
        margin: 0 -8px;
      `,
    },
    opt: {
      nestingLevelWrapper: true,
    },
    editMode: {
      name: Lsi.row.name,
      backgroundColor: "rgba(209,196,233,.8)",
      color: "#311B92",
      highlightColor: "rgba(218,208,237,.45)",
      enablePlaceholder: false,
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    noSpacing: UU5.PropTypes.bool,
    spaceAround: UU5.PropTypes.bool,
    display: UU5.PropTypes.oneOf(["standard", "flex"]),
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      noSpacing: false,
      spaceAround: true,
      display: "standard",
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      editationLazyLoaded: false,
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  onBeforeForceEndEditation_() {
    return this._editableRow ? this._editableRow.getPropsToSave() : undefined;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _getMainAttrs() {
    let mainAttrs = this.getMainAttrs();
    mainAttrs.className += " " + this.getClassName(this.props.display);
    mainAttrs.className += " " + this.getClassName(this.props.noSpacing ? "noSpacing" : "spacing");
    mainAttrs.className += " " + this.getClassName(this.props.spaceAround ? "noSpacing" : "spacing");
    if (this.state.editation) {
      mainAttrs.className += ` ${this.getClassName("editation")}`;
    }
    if (!this.props.spaceAround){
      mainAttrs.className += ` ${this.getClassName("spaceAround")}`;
    }
    return mainAttrs;
  },

  _registerNull(inst) {
    // unmount of component means that suspense is loaded and component should be rendered
    if (!inst) {
      this.setState((state) => {
        if (state.editationLazyLoaded) return;

        // Edit component is loaded - need to set to static variable because other Edit component does not render fallback component
        // editationLazyLoaded is stored in both state and static variable for cases such as when more edit modes are loaded at the same time
        editationLazyLoaded = true;
        return { editationLazyLoaded: true };
      });
    }
  },

  _isEditationLazyLoaded() {
    return editationLazyLoaded;
  },

  _renderEditationMode() {
    return (
      <UU5.Common.Suspense fallback={<span ref={this._registerNull} />}>
        <EditableRow component={this} ref_={this._registerEditableRow} />
      </UU5.Common.Suspense>
    );
  },

  _registerEditableRow(row) {
    this._editableRow = row;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this.getNestingLevel() ? (
      <div {...this._getMainAttrs()}>
        {this.state.editation ? this._renderEditationMode() : null}
        {!this.state.editation || !this._isEditationLazyLoaded()
          ? [this.getHeaderChild(), this.getChildren(), this.getFooterChild(), this.getDisabledCover()]
          : null}
      </div>
    ) : null;
  },
  //@@viewOff:render
});

export default Row;
