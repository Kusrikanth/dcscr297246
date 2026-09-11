import React, { useEffect, useMemo, useState } from "react";
import { Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import classnames from "classnames";

interface IStepDetails {
  id: number;
  title: string;
  iconImage?: any;
}

interface NewStepsContainerPropsType {
  activeStepId: any;
  updateStepHndlr: any;
  containerClass?: any;
  stepsList: Array<IStepDetails>;
  state?: any;
  showApiLoader?:any;
  toggle?:any;
  getActiveMenuComponent: (menuId: any) => void;
}

export const NewStepsContainer: React.FC<NewStepsContainerPropsType> = (
  props
) => {
  const [activeTab, setactiveTab] = useState<any>(1);
  const [passedSteps, setPassedSteps] = useState([0]);
  const [filledStepKeys, setFilledStepKeys] = useState<Array<string>>([]);

  useEffect(() => {
    const activeStepIndex = props.stepsList.findIndex(
      (item) => +item.id === +props.activeStepId
    );

    setactiveTab(activeStepIndex);
  }, [props.activeStepId, props.stepsList]);

  const activeComponent = useMemo(() => {
    const TabComponent: any = props.getActiveMenuComponent(props.activeStepId);
    return <TabComponent state={props.state} activeStepId={props.activeStepId} updateStepHndlr={props.updateStepHndlr} toggle={props.toggle} showApiLoader={props.showApiLoader} />;
  }, [props.activeStepId, props.getActiveMenuComponent]);
  return (
    <div className={classnames(props.containerClass)}>
      <div className="breadcrumbsss  !tw-grid !tw-grid-cols-12 tw-gap-0">
        {props.stepsList.map((item, index) => {
          return (
            <div className="tw-col-span-4 cccc tw-px-0" key={item.id}>
              <div
                className={`breadcrumb_itemm ${classnames({
                  active: +props.activeStepId == item.id,
                  done: item.id < +props.activeStepId,
                })}`}
              >
                <span className="number">{item?.iconImage}</span>

                <span className="label">{item.title}</span>
              </div>
            </div>
          );
        })}
      </div>

      <Row className="tw-mt-3">
        <Col>{activeComponent}</Col>
      </Row>
    </div>
  );
};
