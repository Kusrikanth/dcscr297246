import React from "react";
import {
  UncontrolledTooltip,
  UncontrolledDropdown,
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


  return (
    <UncontrolledDropdown direction="start">
      <DropdownToggle tag="a" id={`action-${rowId}`} role="button">
        <i
          className={classnames(`fs-17 ${menuIconClassName}`, {
            "ri-more-fill": !isHorizontal,
            "ri-more-2-fill": isHorizontal,
          })}
        ></i>
      </DropdownToggle>
      <DropdownMenu>
        {actionOptions.map((item) => (
          <DropdownItem
            data-id={rowId}
            onClick={item.onClickHndlr}
            key={`${item.id}${rowId}`}
          >
            <div className="tw-flex tw-items-center">
              {item.actionIcon} {item.actionName}
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};
