import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Col, Row } from "reactstrap";
import classnames from "classnames";
import { IMenuOptions } from "../../pages/NewAcademics/academicsTypes";

interface Props {
  MenuOptions: Array<IMenuOptions>;
  getActiveMenuId: any;
  activeTabId: string | null;
  showBadge?: boolean;
  horizontalClass?: string;
  labelClass?: string;
  optionalDetails?: any;
  badgeColors?: Record<string, string>;
  //   btnShow?: boolean;
}

const ModifiedHorizontalTab = ({
  MenuOptions,
  getActiveMenuId,
  activeTabId,
  showBadge,
  horizontalClass,
  labelClass,
  optionalDetails,
  badgeColors,
  //   btnShow,
}: Props) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(activeTabId);

  const { instituteValue } = useSelector((state: any) => ({
    instituteValue: state.Layout.instituteValue,
  }));

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveMenuId(menuId);
    getActiveMenuId(menuId);
  }

  //   const activeComponent = useMemo(() => {
  //     const TabComponent: any = getActiveMenuCompon(activeMenuId);
  //     return (
  //       <TabComponent
  //         instituteName={instituteValue}
  //         instituteId={49}
  //         optionalDetails={optionalDetails}
  //       />
  //     );
  //   }, [activeMenuId, instituteValue, getActiveMenuComponent]);

  return (
    <>
      <div
        // style={{overflowX:'scroll'}}
        className={`tw-flex tw-items-center horizontal_tab_wrapper tw-w-full ${horizontalClass && horizontalClass
          }`}
      >
        {MenuOptions.map((item) => {
          const badgeColor = badgeColors?.[item.id];

          return (
            <div
              data-id={item.id}
              onClick={clickMenuHandler}
              className={`tab_name_wrapper ${classnames({
              active: item.id === activeMenuId,
              })}`}
              key={item.id}
              style={{ padding: `${item?.customPadding || "0px 26px"}` }}
            >
              <span className={`tw-me-2 tw-cursor-pointer ${labelClass}`}>
                {item.labelName}
              </span>
              {showBadge && (
                <span
                  className={`badge tw-align-middle tw-ms-1 ${badgeColor ? "" : "badge-soft-danger rounded-pill"
                    }`}
                  style={{
                    marginBottom: "15px",
                    backgroundColor: badgeColor || undefined,
                    borderRadius: badgeColor ? "25px" : undefined,
                    minWidth: badgeColor ? "25px" : undefined,
                    height: badgeColor ? "25px" : undefined,
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "12px",
                  }}
                >
                  {item.count}
                </span>
              )}
            </div>
          );
        })}
        {/* {btnShow && (
          <div className="ms-auto">
            <Button className="botton botton-success btn-soft-success me-2">
              Change Password
            </Button>
            <Button className="botton botton-error btn-soft-danger">
              Deactive Account
            </Button>
          </div>
        )} */}
      </div>

      {/* <Row>
        <Col>{activeComponent}</Col>
      </Row> */}
    </>
  );
};

export default ModifiedHorizontalTab;
