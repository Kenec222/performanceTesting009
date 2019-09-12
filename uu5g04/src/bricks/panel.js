/**
 * Copyright (C) 2019 Unicorn a.s.
 * 
 * This program is free software; you can use it under the terms of the UAF Open License v01 or
 * any later version. The text of the license is available in the file LICENSE or at www.unicorn.com.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See LICENSE for more details.
 * 
 * You may contact Unicorn a.s. at address: V Kapslovne 2767/2, Praha 3, Czech Republic or
 * at the email: info@unicorn.com.
 */

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";
const ClassNames = UU5.Common.ClassNames;

import Header from './panel-header.js';
import Body from './panel-body.js';
import './panel.less';

const MOUNT_CONTENT_VALUES = {
  onFirstRender: "onFirstRender",
  onFirstExpand: "onFirstExpand",
  onEachExpand: "onEachExpand"
};

const getMountContent = props => {
  return props.mountContent === undefined ? MOUNT_CONTENT_VALUES.onFirstRender : props.mountContent;
};

export const Panel = createReactClass({
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.SectionMixin,
    UU5.Common.NestingLevelMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Panel"),
    nestingLevelList: UU5.Environment.getNestingLevelList('bigBoxCollection', 'box'),
    classNames: {
      main: ns.css("panel"),
      expanded: ns.css("panel-expanded"),
      size: ns.css("panel-size-"),
      default: ns.css("panel-default")
    },
    defaults: {
      parentTagName: 'UU5.Bricks.Accordion',
      header: 'noHeader',
      body: 'noBody'
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    expanded: PropTypes.bool,
    alwaysExpanded: PropTypes.bool,
    iconExpanded: PropTypes.string,
    iconCollapsed: PropTypes.string,
    onClick: PropTypes.func,
    disableHeaderClick: PropTypes.bool,
    size: PropTypes.oneOf(['s', 'm', 'l', 'xl']),
    bgStyle: PropTypes.oneOf(['filled', 'outline', 'transparent', 'underline']),
    bgStyleHeader: PropTypes.oneOf(['filled', 'outline', 'transparent', 'underline']),
    bgStyleContent: PropTypes.oneOf(['filled', 'outline', 'transparent', 'underline']),
    colorSchemaHeader: PropTypes.string,
    colorSchemaContent: PropTypes.string,
    borderRadius: PropTypes.string,
    elevation: PropTypes.oneOf(['0', '1', '2', '3', '4', '5', 0, 1, 2, 3, 4, 5]),
    iconAlign: PropTypes.oneOf(["right", "after", "left"]),
    openClick: PropTypes.oneOf(["header", "icon", "none"]),
    mountContent: PropTypes.oneOf([
      MOUNT_CONTENT_VALUES.onEachExpand,
      MOUNT_CONTENT_VALUES.onFirstExpand,
      MOUNT_CONTENT_VALUES.onFirstRender
    ])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      expanded: false,
      alwaysExpanded: false,
      iconExpanded: null,
      iconCollapsed: null,
      onClick: null,
      bgStyle: null,
      bgStyleHeader: null,
      bgStyleContent: null,
      borderRadius: null,
      elevation: null,
      disableHeaderClick: undefined,
      size: 'm',
      iconAlign: null,
      openClick: null,
      mountContent: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  getInitialState() {
    this._blockNextChildUpdate = false;
    const expanded = this.props.alwaysExpanded || this.props.expanded;
    return {
      expanded,
      renderChild: getMountContent(this.props) === MOUNT_CONTENT_VALUES.onFirstRender || expanded
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {

      if (nextProps.alwaysExpanded) {
        !this.isExpanded() && this.setState({ expanded: true, renderChild: true });
      } else if (nextProps.expanded !== this.props.expanded && nextProps.expanded !== this.isExpanded()) {
        // new expanded != this.props.expanded because if hide or disable accordion, default props to panel set again but state in panel can be different!!!
        this._setExpandedValue(nextProps, nextProps.expanded);
      }
    }
  },

  componentDidUpdate() {
    this._blockNextChildUpdate = false;
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  isPanel() {
    return true;
  },

  setExpandedValue(expanded, setStateCallback) {
    this._setExpandedValue(this.props, expanded, setStateCallback);
    return this;
  },

  expand(setStateCallback) {
    this.setExpandedValue(true, setStateCallback);
    return this;
  },

  collapse(setStateCallback) {
    this.setExpandedValue(false, setStateCallback);
    return this;
  },

  toggle(setStateCallback) {
    this._setExpandedValue(undefined, undefined, setStateCallback);
    return this;
  },

  isExpanded() {
    return this.state.expanded;
  },

  isExpandable(props) {
    return !this.isDisabled() && !(props || this.props).alwaysExpanded;
  },
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  buildHeaderChild_(headerTypes) {
    var headerType = this.getHeaderType(headerTypes);

    var headerChild;
    if (headerType === 'contentOfStandardHeader') {
      headerChild = <Header content={headerTypes.header} />;
      headerChild = this.cloneChild(headerChild, this.expandHeaderProps(headerChild));
    }

    return headerChild;
  },

  expandHeaderProps_(headerChild) {
    let headerProps = headerChild.props;
    let newProps = {};

    // default values is used if child is set as react element so null or undefined will not set!!!
    for (let key in headerProps) {
      headerProps[key] !== null && headerProps[key] !== undefined && (newProps[key] = headerProps[key]);
    }
    let icon = this.isExpanded() ? this.props.iconExpanded : this.props.iconCollapsed;
    return UU5.Common.Tools.merge(newProps, {
      key: newProps.id,
      _onClick: this._onClickToggle,
      _icon: icon,
      _disableHeaderClick: this.props.disableHeaderClick,
      style: { borderRadius: this.props.borderRadius },
      openClick: this.props.openClick || "header",
      iconAlign: icon ? this.props.iconAlign || "right" : null,
      bgStyle: this.props.bgStyleHeader ? this.props.bgStyleHeader : (this.props.colorSchemaHeader && !this.props.bgStyle ? "filled" : null),
      colorSchema: this.props.colorSchemaHeader ? this.props.colorSchemaHeader : (this.props.bgStyle ? this.props.colorSchema : null)
    });
  },
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _updateExpandedValue(expanded, setStateCallback) {
    this.setState(function(state) {
      expanded = expanded !== undefined ? expanded : !state.expanded;
      // do not update state to same value
      if (expanded === state.expanded) return null;
      let renderChild;
      if (
        getMountContent(this.props) === MOUNT_CONTENT_VALUES.onFirstRender ||
        getMountContent(this.props) === MOUNT_CONTENT_VALUES.onFirstExpand
      ) {
        renderChild = true;
      } else {
        renderChild = expanded;
      }
      return { expanded, renderChild };
    }, setStateCallback);
  },

  // update expanded state - if expanded is not set it will be used from state but toggle that value
  _setExpandedValue(props = this.props, expanded, setStateCallback) {
    if (this.isExpandable(props)) {
      if (!this.state.renderChild) {
        let blockUpdate = false;
        this.setState(
          state => {
            // block update expanded to already set value
            if (expanded !== undefined && expanded === state.expanded) {
              typeof setStateCallback === "function" && setStateCallback();
              blockUpdate = true;
              return null;
            }
            return {
              renderChild: getMountContent(this.props) === MOUNT_CONTENT_VALUES.onEachExpand ? !state.expanded : true
            };
          },
          () => {
            if (!blockUpdate) {
              this._blockNextChildUpdate = true; // there is no update of props only need to change state of current component and run animation inside
              this._updateExpandedValue(expanded, setStateCallback);
            }
          }
        );
        return;
      }
      this._updateExpandedValue(expanded, setStateCallback);
    }
    return this;
  },

  _findChildByTagName(tagName) {
    var children = Array.isArray(this.props.children) ? this.props.children : [this.props.children];

    var result = children.filter(function (child) {
      return child.type && child.type.tagName === tagName;
    });

    return result[0] || null;
  },

  _onClickToggle(e) {
    var panel = this;
    this.toggle(() => {
      var onClick;

      if (typeof this.props.onClick === 'function') {
        onClick = () => panel.props.onClick(this);
      }

      if (onClick) {
        onClick(this);
      }
    });
    return this;
  },

  _getBodyId() {
    return this.getId() + '-body';
  },

  _getBodyChild() {
    var bodyContent = this.getContent();
    !this.props.children && !bodyContent && (bodyContent = this.getDefault().body);

    var bodyId = this._getBodyId();

    // console.log("Block next child update: " + this.state.renderChild);

    var bodyProps = {
      controlled: true,
      id: bodyId,
      key: bodyId,
      content: this.state.renderChild ? bodyContent : undefined,
      _expanded: this.isExpanded(),
      _preventUpdateChild: this._blockNextChildUpdate,
      borderRadius: this.props.borderRadius,
      bgStyle: this.props.bgStyleContent ? this.props.bgStyleContent : null,
      colorSchema: this.props.colorSchemaContent ? this.props.colorSchemaContent : null
    };

    return this.buildChildren({
      children: React.createElement(
        Body,
        bodyProps,
        this.state.renderChild ? React.Children.toArray(this.props.children) : undefined
      )
    });
  },

  _getBodyHeight() {
    return this.getRenderedChildById(this._getBodyId()).getFullHeight();
  },

  _checkParentTag() {
    let parent = this.getParent();

    if (parent) {
      while (parent.getOpt("parentWrapper")) {
        parent = parent.getParent();
      }
    }
    return parent && (parent.getTagName() === this.getDefault().parentTagName);
  },
  //@@viewOff:componentSpecificHelpers

  // Render
  _buildChildren() {
    var header = this.getHeader() || this.getDefault().header;
    var headerChild = this.buildHeaderChild({ header: header });
    var bodyChild = this._getBodyChild();

    return [headerChild, bodyChild];
  },

  //@@viewOn:render
  render() {
    var mainProps = this.getMainAttrs();
    this.isExpanded() && (mainProps.className += ' ' + this.getClassName().expanded);
    mainProps.className += ' ' + this.getClassName('size') + this.props.size;

    if (this.props.elevation) {
      mainProps.className += " " + ClassNames.elevation + this.props.elevation;
    }

    if (this.props.bgStyle) {
      mainProps.className += " " + ClassNames[this.props.bgStyle];
    }

    if (!this.props.bgStyle && !this.props.bgStyleHeader && !this.props.colorSchema) {
      mainProps.className += " " + this.getClassName("default");
    }

    if (this.props.borderRadius) {
      mainProps.style = { borderRadius: this.props.borderRadius };
    }

    return (
      this.getNestingLevel()
        ? (
        <div {...mainProps} >
          {this._buildChildren()}
          {this.getDisabledCover()}
        </div>
      ) : null
    );
  }
  //@@viewOff:render
});

export default Panel;
