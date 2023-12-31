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

import { PropTypes, Utils } from "uu5g05";
import Environment from "../environment/environment.js";

export const NestingLevelMixin = {
  //@@viewOn:statics
  statics: {
    "UU5.Common.NestingLevelMixin": {
      requiredMixins: ["UU5.Common.BaseMixin"],
      defaults: {
        nestingLevel: "boxCollection",
      },
      errors: {
        // incorrectRequestedNestingLevel:
        //   'Component %s was used with property nestingLevel="%s", but it supports only one of: %s.',
        // nestingLevelMismatch:
        //   'Component %s with supported nesting levels %s cannot be nested into parent component %s which uses nesting level "%s". Component would have to support one of: %s.',
        // nestingLevelMismatchExplicitProp:
        //   'Component %s has prop nestingLevel="%s" and as such it cannot be nested into parent component %s which uses nesting level "%s". Component needs to use one of: %s.',
        unsupportedNestingLevel: 'Nesting level "%s" is not a supported value. Use one of: %s.',
      },
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    nestingLevel: PropTypes.oneOf(Environment.nestingLevelList.concat(Utils.NestingLevel.valueList)),
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      nestingLevel: null,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState: function () {
    // initialize
    this.registerMixin("UU5.Common.NestingLevelMixin");
    // state
    return {
      nestingLevel: this.checkNestingLevel(),
    };
  },

  UNSAFE_componentWillReceiveProps: function (nextProps) {
    this.getNestingLevel() !== nextProps.nestingLevel &&
      this.setState({ nestingLevel: this.checkNestingLevel(nextProps) });
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonNestingLevelMixin: function () {
    return this.hasMixin("UU5.Common.NestingLevelMixin");
  },

  getNestingLevel: function () {
    return this.state.nestingLevel;
  },

  getUU5CommonNestingLevelMixinProps: function () {
    return {
      nestingLevel: this.props.nestingLevel,
    };
  },

  getUU5CommonNestingLevelMixinPropsToPass: function () {
    return this.getUU5CommonNestingLevelMixinProps();
  },

  getParentNestingLevel: function (parentNestingLevelComponent) {
    let component = parentNestingLevelComponent || this.getParentByType("hasUU5CommonNestingLevelMixin");
    return component ? component.getNestingLevel() : Environment.nestingLevelList[0];
  },

  getNestingLevelList: function () {
    return (
      (this.constructor.nestingLevel && [this.constructor.nestingLevel]) ||
      this.constructor.nestingLevelList ||
      Environment.nestingLevelList
    );
  },

  checkNestingLevel: function (props = this.props) {
    // NOTE Current rule: all components with nesting level must support "inline" nesting level.
    // 1. However, the components are implemented in such way that they list only e.g. "box" as their
    //    supported NL and if getNestingLevel() returns null, they render as "inline" :-/.
    // 2. Additionally, nestingLevel prop is "maximal" nesting level, therefore invalid nesting never happens... and
    //    therefore all warnings are now commented out.

    let propsNestingLevel = Utils.NestingLevel._denormalizeLevel?.(props.nestingLevel) ?? props.nestingLevel;

    //step 1 - check prop nestingLevel
    let nestingLevelEnvIndex = Environment.nestingLevelList.indexOf(propsNestingLevel);
    let nestingLevel = nestingLevelEnvIndex > -1 ? propsNestingLevel : null;
    //console.log("step 1 requestedNestingLevel:",nestingLevel);

    //step 2 - check nestingLevelList
    let nestingLevelList = this.getNestingLevelList();
    // let origNestingLevelList = nestingLevelList;
    //console.log("step 2 requestedNestingLevel:",nestingLevel,"nestingLevelList:",nestingLevelList,"parent::",parentNestingLevelComponent);

    if (propsNestingLevel && nestingLevelEnvIndex === -1) {
      this.showError("unsupportedNestingLevel", [propsNestingLevel, JSON.stringify(nestingLevelList)], {
        mixinName: "UU5.Common.NestingLevelMixin",
      });
    }

    //step 3 - check requested nestingLevel with build in nestingLevelList
    if (nestingLevel) {
      nestingLevelEnvIndex = Environment.nestingLevelList.indexOf(nestingLevel);

      let nestingLevelLoc = nestingLevelList.find((nestingLevel) => {
        return Environment.nestingLevelList.indexOf(nestingLevel) >= nestingLevelEnvIndex;
      });
      let nestingLevelLocIndex = nestingLevelList.indexOf(nestingLevelLoc);

      if (nestingLevelLocIndex > -1) {
        nestingLevelList = nestingLevelList.slice(nestingLevelLocIndex);
        nestingLevelEnvIndex = Environment.nestingLevelList.indexOf(nestingLevelLoc);
        nestingLevel = null;
      }
    }

    //check nestingLevel rule incorrectRequestedNestingLevel
    if (
      Environment.nestingLevelList.indexOf(nestingLevel) >
      Environment.nestingLevelList.indexOf(nestingLevelList[nestingLevelList.length - 1])
    ) {
      // this.showError(
      //   "incorrectRequestedNestingLevel",
      //   [this.getTagName(), nestingLevel, JSON.stringify(origNestingLevelList)],
      //   {
      //     mixinName: "UU5.Common.NestingLevelMixin",
      //     context: {
      //       nestingLevelList: origNestingLevelList
      //     }
      //   }
      // );
      nestingLevelList = [];
    }

    //console.log("step 3 requestedNestingLevel:",nestingLevel,"requestedNestingLevelList:",nestingLevelList);

    //step 4 - build calculatedNestingLevelList from nestingLevel parent if exist
    let calculatedNestingLevelIndex = 0;
    let calculatedNestingLevelList = Environment.nestingLevelList;
    let parentNestingLevel = calculatedNestingLevelList[calculatedNestingLevelIndex];
    let parentNestingLevelComponent;
    if (!this.getOpt("nestingLevelRoot")) {
      parentNestingLevelComponent = this.getParentByType("hasUU5CommonNestingLevelMixin");
      parentNestingLevel = this.getParentNestingLevel(parentNestingLevelComponent);
      //console.log("step 4a",parentNestingLevel);
      calculatedNestingLevelIndex = Environment.nestingLevelList.indexOf(parentNestingLevel);
      if (
        parentNestingLevelComponent &&
        !parentNestingLevelComponent.getOpt("nestingLevelWrapper") &&
        parentNestingLevel &&
        parentNestingLevel.search(/Collection$/) === -1
      ) {
        calculatedNestingLevelIndex = Math.min(
          Environment.nestingLevelList.length - 1,
          calculatedNestingLevelIndex + 1
        );
      }
      calculatedNestingLevelList = Environment.nestingLevelList.slice(calculatedNestingLevelIndex);
    }

    //console.log("step 4",calculatedNestingLevelList);

    //step 5 - find the lowest requested nestingLevel as possible if is not requested or is not requested correctly
    if (!nestingLevel) {
      nestingLevel = nestingLevelList.find((nestingLevel) => {
        return Environment.nestingLevelList.indexOf(nestingLevel) >= calculatedNestingLevelIndex;
      });

      nestingLevelEnvIndex = Environment.nestingLevelList.indexOf(nestingLevel);
      //console.log("step 5",nestingLevel)
    }

    // //check nestingLevel rule nestingLevelMismatch
    // if (nestingLevelEnvIndex < calculatedNestingLevelIndex) {
    //   if (propsNestingLevel) {
    //     this.showError(
    //       "nestingLevelMismatchExplicitProp",
    //       [
    //         this.getTagName(),
    //         propsNestingLevel,
    //         parentNestingLevelComponent.getTagName(),
    //         parentNestingLevel,
    //         JSON.stringify(calculatedNestingLevelList)
    //       ],
    //       {
    //         mixinName: "UU5.Common.NestingLevelMixin",
    //         context: {
    //           parent: {
    //             tagName: parentNestingLevelComponent.getTagName(),
    //             component: parentNestingLevelComponent
    //           }
    //         }
    //       }
    //     );
    //   } else {
    //     this.showError(
    //       "nestingLevelMismatch",
    //       [
    //         this.getTagName(),
    //         JSON.stringify(origNestingLevelList),
    //         parentNestingLevelComponent.getTagName(),
    //         parentNestingLevel,
    //         JSON.stringify(calculatedNestingLevelList)
    //       ],
    //       {
    //         mixinName: "UU5.Common.NestingLevelMixin",
    //         context: {
    //           parent: {
    //             tagName: parentNestingLevelComponent.getTagName(),
    //             component: parentNestingLevelComponent
    //           }
    //         }
    //       }
    //     );
    //   }
    // }

    //step 6 - find the lowest nestingLevel as possible for render into parent
    nestingLevel = nestingLevelList.find((nestingLevel) => {
      return calculatedNestingLevelList.indexOf(nestingLevel) > -1;
    });

    //console.log("step 6",this.getTagName(),nestingLevel || null);

    return nestingLevel || null;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private
};

export default NestingLevelMixin;
