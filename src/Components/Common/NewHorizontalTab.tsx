import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Col, Row } from "reactstrap";
import classnames from "classnames";
import { IMenuOptions } from "../../pages/NewAcademics/academicsTypes";

interface Props {
  MenuOptions: Array<IMenuOptions>;
  getActiveMenuComponent: any;
  activeTabId: string | null;
  showBadge?: boolean;
  horizontalClass?: string;
  btnShow?: boolean;
}

const NewHorizontalTab = ({
  MenuOptions,
  getActiveMenuComponent,
  activeTabId,
  showBadge,
  horizontalClass,
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
        instituteId="54a42c4d-47aa-40b7-bd6b-284702aaebi7"
      />
    );
  }, [activeMenuId, instituteValue, getActiveMenuComponent]);

  return (
    <>
      <div
        className={`!tw-flex !tw-items-center new_horizontal_tab_wrapper ${
          horizontalClass && horizontalClass
        }`}
      >
        {MenuOptions.map((item, index) => (
          <div
            data-id={item.id}
            onClick={clickMenuHandler}
            key={item.id}
            className={`tab_name_wrapper ${item.className} ${classnames({
              active: item.id === activeMenuId,
            })}`}
            style={{ padding: `${item?.customPadding || "0px 20px"}` }}
          >
            <div>
              <span className="!tw-cursor-pointer">{item.labelName}</span>
              {showBadge && (
                <span className="badge badge-soft-danger tw-align-middle rounded-pill !tw-ms-1">
                  1
                </span>
              )}
            </div>
          </div>
        ))}

        {btnShow && (
          <div className="!tw-ms-auto">
            <Button className="botton botton-success btn-success tw-me-2">
              Change Password
            </Button>
            <Button className="botton botton-error btn-danger">
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

export default NewHorizontalTab;
