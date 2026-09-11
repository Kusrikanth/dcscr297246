import React, { useEffect, useMemo, useState } from "react";
import { Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import classnames from "classnames";

interface IStepDetails {
    id: number;
    title: string;
    iconImage?: any;
}

interface IHorizontalWizard {
    activeStepId: any;
    updateStepHndlr: any;
    containerClass?: any;
    stepsList: Array<IStepDetails>;
    getActiveMenuComponent: (menuId: any) => void;
}

export const StepsContainer: React.FC<IHorizontalWizard> = (props) => {
    const [activeTab, setactiveTab] = useState < any > (1);
    const [passedSteps, setPassedSteps] = useState([0]);
    const [filledStepKeys, setFilledStepKeys] = useState < Array < string >> ([]);

    useEffect(() => {
        const activeStepIndex = props.stepsList.findIndex(
            (item) => +item.id === +props.activeStepId
        );

        setactiveTab(activeStepIndex);
    }, [props.activeStepId, props.stepsList]);

    const activeComponent = useMemo(() => {
        const TabComponent: any = props.getActiveMenuComponent(props.activeStepId);
        return <TabComponent />;
    }, [props.activeStepId, props.getActiveMenuComponent]);
    return (
        <div className={classnames("step-arrow-nav", props.containerClass)}>
            {/* <Nav className="nav-pills nav-justified custom-nav" role="tablist"> */}
            <div className={`!tw-flex !tw-flex-wrap steper_wrapper tw-mb-2`}>
                {props.stepsList.map((item, index) => {

                    return (
                        <div key={item.id} className="!tw-flex-1">
                            <div
                                // href="#"
                                data-id={item.id}
                                data-index={index}
                                className={`!tw-p-3 steper_name_wrapper ${classnames({
                                    active: +props.activeStepId == item.id,
                                })}`}
                            >
                                <span className="!tw-me-2 !tw-cursor-pointer ">{item.title}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* </Nav> */}
            <Row className="mt-3">
                <Col>{activeComponent}</Col>
            </Row>
        </div>
    );
};
