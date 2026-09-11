import React, { useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Card, CardBody, Col, Row, CardHeader } from "reactstrap";
import classnames from "classnames";
import { IMenuOptions } from "../../pages/NewAcademics/academicsTypes";
import { useAppSelector } from "../../hooks/storehook";

interface Props {
  MenuOptions: Array<IMenuOptions>;
  getActiveMenuComponent: any;
  activeTabId: string | null;
  tabHeader?: string;
  optionalDetails?: any;
}

const VerticalTab = ({
  MenuOptions,
  getActiveMenuComponent,
  activeTabId,
  tabHeader,
  optionalDetails,
}: Props) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(activeTabId);

  const { instituteValue } = useSelector((state: any) => ({
    instituteValue: state.Layout.instituteValue,
  }));
  const { currentBranchIdResp:branchId,currentInstIdResp:instituteId } =
    useAppSelector(
      ({ appData }) => ({
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,

      }),
      shallowEqual
    );
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
        instituteId={instituteId}
        menuId={activeMenuId||activeTabId}
        optionalDetails={optionalDetails}
      />
    );
  }, [activeMenuId, instituteValue, getActiveMenuComponent]);

  return (
    <div className="master-setup-wrapper">
      <Row>
        <Col xl={3} lg={4}>
          <Card>
            {tabHeader && (
              <CardHeader>
                <h4 className="card-title tw-mb-0 tw-flex-grow">{tabHeader}</h4>
              </CardHeader>
            )}

            <CardBody className="tw-py-0 tw-px-0">
              <ul className="left-menu-section">
                {MenuOptions.map((item) => (
                  <li
                    data-id={item.id}
                    onClick={clickMenuHandler}
                    className={classnames({
                      active: item.id == (activeMenuId||activeTabId),
                    })}
                    key={item.id}
                  >
                    {item.labelName}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </Col>
        <Col xl={9} lg={8}>
          {activeComponent}
        </Col>
      </Row>
    </div>
  );
};

export default VerticalTab;
