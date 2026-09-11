import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Col, Row } from "reactstrap";
import classnames from "classnames";
import { IMenuOptions } from "../../pages/NewAcademics/academicsTypes";
import Button from "./Button";

interface Props {
  MenuOptions: Array<IMenuOptions>;
  getActiveMenuComponent: any;
  activeTabId: string | null;
  showBadge?: boolean;
  horizontalClass?: string;
  optionalDetails?:any;
  btnShow?: boolean;
}

const HorizontalTab = ({
  MenuOptions,
  getActiveMenuComponent,
  activeTabId,
  showBadge,
  horizontalClass,
  optionalDetails,
  btnShow,
}: Props) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(activeTabId);

  const { instituteValue } = useSelector((state: any) => ({
    instituteValue: state.Layout.instituteValue,
  }));

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveMenuId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeMenuId);
    return (
      <TabComponent
        instituteName={instituteValue}
        instituteId={49}
        optionalDetails={optionalDetails}
      />
    );
  }, [activeMenuId, instituteValue, getActiveMenuComponent]);

  return (
    <>
      <div
        className={`tw-flex tw-items-center horizontal_tab_wrapper tw-mb-2 ${
          horizontalClass && horizontalClass
        }`}
      >
        {MenuOptions.map((item) => (
          <div
            data-id={item.id}
            onClick={clickMenuHandler}
            className={`tab_name_wrapper ${classnames({
              active: item.id === activeMenuId,
            })}`}
            key={item.id}
            style={{ padding: `${item?.customPadding || "0px 26px"}` }}
          >
            <span className="tw-me-2 tw-cursor-pointer">{item.labelName}</span>
            {showBadge && (
              <span className="badge badge-soft-danger tw-align-middle rounded-pill tw-ms-1 align-self-baseline">
                1
              </span>
            )}
            {/* {showBadge && (
              <div className="d-flex mb-auto">
                <span className="badge badge-soft-success">1</span>
              </div>
            )} */}
          </div>
        ))}
        {btnShow && (
          <div className="ms-auto">
            <Button variant="primary">
              Change Password
            </Button>
            <Button variant="reject">
              Deactive Account
            </Button>
          </div>
        )}
      </div>

      <Row>
        <Col>{activeComponent}</Col>
      </Row>
    </>
  );
};

export default HorizontalTab;
