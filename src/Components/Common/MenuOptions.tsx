import React, { useState } from "react";
import {
  UncontrolledTooltip,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import classnames from "classnames";
export interface IOptionsHrtl {
  id: string;
  actionIcon: React.ReactNode;
  actionName: string | React.ReactNode;
  onClickHndlr?: any;
  disabled?: boolean;
  /** Nested actions, shown as an expandable sub menu inside the more actions dropdown. */
  subActions?: Array<IOptionsHrtl>;
}

export interface IMenuOptionHrtl {
  actionOptions: Array<IOptionsHrtl>;
  rowId?: string;
  className?: string;
}
interface IMenuOptionVrtl {
  actionOptions: Array<any>;
}

export const MenuOptionHrtl = ({
  actionOptions,
  rowId = "",
  className = "",
}: IMenuOptionHrtl) => {
  return (
    <ul className={`list-inline hstack tw-mb-0 ${className}`}>
      {actionOptions.map((item) => (
        <React.Fragment key={item.id}>
          <li
            className="list-inline-item tw-cursor-pointer"
            data-id={rowId}
            onClick={item.onClickHndlr}
            id={`${item.id}${rowId}`}
            style={{ visibility: item.actionName ? "visible" : "hidden", cursor: item.disabled ? "not-allowed" : "pointer" }}
          >
            {item.actionIcon}
          </li>
          <UncontrolledTooltip placement="bottom" target={`${item.id}${rowId}`}>
            {item.actionName}
          </UncontrolledTooltip>
        </React.Fragment>
      ))}
    </ul>
  );
};

export const MenuOptionVrtl = (props: IMenuOptionVrtl) => {
  return <div>Vertical Menu Options</div>;
};

export interface IMoreActions extends IMenuOptionHrtl {
  isHorizontal?: boolean;
  menuIconClassName?: string;
}

export const MoreActions = ({
  actionOptions,
  rowId = "",
  isHorizontal = false,
  menuIconClassName = "tw-text-gray-500",
}: IMoreActions) => {
  const [isOpenState, setIsOpenState] = useState<boolean>(false);
  const [expandedActionIdState, setExpandedActionIdState] = useState<string>("");

  function toggleDropdownHndlr() {
    setIsOpenState((prevState) => {
      if (prevState) {
        setExpandedActionIdState("");
      }
      return !prevState;
    });
  }

  function toggleSubActionsHndlr(actionId: string) {
    setExpandedActionIdState((prevState) => (prevState === actionId ? "" : actionId));
  }

  return (
    <Dropdown isOpen={isOpenState} toggle={toggleDropdownHndlr} direction="start">
      <DropdownToggle tag="a" id={`action-${rowId}`} role="button">
        <i
          className={classnames(`fs-17 ${menuIconClassName}`, {
            "ri-more-fill": !isHorizontal,
            "ri-more-2-fill": isHorizontal,
          })}
        ></i>
      </DropdownToggle>
      <DropdownMenu>
        {actionOptions.map((item) => {
          const hasSubActions = Array.isArray(item.subActions) && item.subActions.length > 0;
          if (!hasSubActions) {
            return (
              <DropdownItem
                data-id={rowId}
                onClick={item.onClickHndlr}
                key={`${item.id}${rowId}`}
              >
                <div className="tw-flex tw-items-center">
                  {item.actionIcon} {item.actionName}
                </div>
              </DropdownItem>
            );
          }
          const isExpanded = expandedActionIdState === item.id;
          return (
            <React.Fragment key={`${item.id}${rowId}`}>
              <DropdownItem
                toggle={false}
                data-id={rowId}
                onClick={() => toggleSubActionsHndlr(item.id)}
              >
                <div className="tw-flex tw-items-center tw-justify-between">
                  <span className="tw-flex tw-items-center">
                    {item.actionIcon} {item.actionName}
                  </span>
                  <i
                    className={classnames("tw-ml-3 tw-text-gray-500", {
                      "ri-arrow-down-s-line": isExpanded,
                      "ri-arrow-right-s-line": !isExpanded,
                    })}
                  ></i>
                </div>
              </DropdownItem>
              {isExpanded &&
                (item.subActions || []).map((subItem) => (
                  <DropdownItem
                    data-id={rowId}
                    onClick={subItem.onClickHndlr}
                    key={`${subItem.id}${rowId}`}
                    className="tw-pl-6"
                  >
                    <div className="tw-flex tw-items-center">
                      {subItem.actionIcon} {subItem.actionName}
                    </div>
                  </DropdownItem>
                ))}
            </React.Fragment>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
};
