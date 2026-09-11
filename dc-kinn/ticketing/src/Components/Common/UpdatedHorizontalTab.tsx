import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Col, Row } from "reactstrap";
import classnames from "classnames";

interface IMenuOptions{
  count?: number;
  id:string;
  labelName:string;
  customPadding:string;
  Icon?:any;
  badgeClass?:string;
}
interface Props {
  MenuOptions: Array<IMenuOptions>;
  clickMenuHandler:any;
  activeTabId: string | null;
  showBadge?: boolean;
  horizontalClass?: string;
  btnShow?: boolean;
  tabWrapperClass?:string | undefined;
}

const UpdatedHorizontalTab = ({
  MenuOptions,
  clickMenuHandler,
  activeTabId,
  showBadge,
  horizontalClass,
  btnShow,
  tabWrapperClass
}: Props) => {

  const { instituteValue } = useSelector((state: any) => ({
    instituteValue: state.Layout.instituteValue,
  }));

  

  // const activeComponent = useMemo(() => {
  //   const TabComponent: any = getActiveMenuComponent(activeMenuId);
  //   return (
  //     <TabComponent
  //       instituteName={instituteValue}
  //       instituteId={49}
  //     />
  //   );
  // }, [activeMenuId, instituteValue, getActiveMenuComponent]);

  return (
    <>
    {/* <div className="card"> */}
      <div
        className={`tw-flex tw-items-center updated_horizontal_tab_wrapper ${
          horizontalClass && horizontalClass
        }`}
      >
        {MenuOptions.map((item) => (
          <div
            data-id={item.id}
            onClick={clickMenuHandler}
            className={classnames("tab_name_wrapper", {active: item.id === activeTabId}, 
            item.id !== activeTabId && tabWrapperClass)}
            key={item.id}
            style={{ padding: `${item?.customPadding || "0px 26px"}` }}
          >
            <span className="tw-cursor-pointer">{item.Icon}</span>
            <span
              className={classnames("tw-cursor-pointer", {
                "tw-text-sm": !horizontalClass?.includes("use-small-font"),
                "tw-text-xs": horizontalClass?.includes("use-small-font"),
                "tw-font-bold": !horizontalClass?.includes("use-small-font") && item.id === activeTabId,
              })}
            >
              {item.labelName}
            </span>
            {showBadge && (
              <span className={classnames("badge badge-soft-danger tw-align-middle tw-rounded tw-ms-1",item?.badgeClass)} style={{marginBottom:"15px"}}>
                {item.count}
              </span>
            )}
          </div>
        ))}
      </div>
      {/* </div> */}
      {/* <Row>
        <Col>{activeComponent}</Col>
      </Row> */}
    </>
  );
};

export default UpdatedHorizontalTab;
