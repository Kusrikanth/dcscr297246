import React, { useEffect, useState } from "react";
import { Nav, NavItem, NavLink, } from "reactstrap";
import classnames from "classnames";

interface IStepDetails {
  id: string,
  title: string,
  isDisabled?: boolean,
  iconImage: any,
  iconImageClass?: any
}

interface IHorizontalWizard {
  activeStepId: any;
  updateStepHndlr: any;
  containerClass?: any;
  stepsList: Array<IStepDetails>;
}

export const HorizontalWizard: React.FC<IHorizontalWizard> = (props) => {
  const [activeTab, setactiveTab] = useState<any>(0);
  const [passedSteps, setPassedSteps] = useState([0]);
  const [filledStepKeys, setFilledStepKeys] = useState<Array<string>>([]);

  useEffect(() => {
    const activeStepIndex = props.stepsList.findIndex(item => item.id === props.activeStepId);
    setactiveTab(activeStepIndex);
  }, [props.activeStepId, props.stepsList]);

  function toggleTab(event: React.MouseEvent<HTMLAnchorElement>) {
    const navId = event.currentTarget.getAttribute("data-id"),
      stepIndex = event.currentTarget.getAttribute("data-index"),
      stepIndexNum = Number(stepIndex);
    if (!isNaN(stepIndexNum) && stepIndexNum >= 0 && stepIndexNum <= (props.stepsList.length - 1)) {
      props.updateStepHndlr(navId);
    }
  }
  return (
    <div className={classnames("step-arrow-nav", props.containerClass)}>
      <Nav
        className="nav-pills nav-justified custom-nav"
        role="tablist"
      >
        {
          props.stepsList.map((item, index) => (
            <NavItem key={item.id}>
              <NavLink href="#"
                data-id={item.id}
                data-index={index}
                disabled={item.isDisabled || false}
                className={classnames("!tw-p-4 tw-text-nowrap", { active: activeTab === (index), done: (index < activeTab) })}
                onClick={toggleTab}
              >
                {/* <i className="ri-checkbox-circle-line fs-16 p-2 bg-soft-primary text-primary rounded-circle align-middle me-2"></i> */}
                <span className={classnames("rounded-circle icon-container tw-p-2 tw-align-middle tw-me-2", item.iconImageClass)}>
                  {/* {item.iconImage && <i className={item.iconImage}></i>} */}
                  {item.iconImage}
                  {/* <img style={{ height: "16px", width: "16px" }} className="img-fluid" src={item.iconImage} /> */}
                </span>
                {item.title}
              </NavLink>
            </NavItem>
          ))
        }
      </Nav>
    </div>
  )
}


{/* <NavItem role="presentation">
                    <NavLink href="#"
                        data-id={"test"}
                        data-stepno={1}
                        className={classnames({ active: activeTab === 1, done: (activeTab <= 4 && activeTab >= 0) }, "p-3 text-nowrap")}
                        onClick={() => { toggleTab(1); }}
                    >
                        <i className="ri-user-2-line fs-16 p-2 bg-soft-primary text-primary rounded-circle align-middle me-2"></i>
                        Student Info
                    </NavLink>
                </NavItem>
                <NavItem role="presentation">
                    <NavLink href="#"
                        className={classnames({ active: activeTab === 2, done: activeTab <= 4 && activeTab > 1 }, "p-3 text-nowrap")}
                        onClick={() => { toggleTab(2); }}
                    >
                        <i className="ri-truck-line fs-16 p-2 bg-soft-primary text-primary rounded-circle align-middle me-2"></i>
                        Parents & Guardian Details
                    </NavLink>
                </NavItem>
                <NavItem role="presentation">
                    <NavLink href="#"
                        className={classnames({ active: activeTab === 3, done: activeTab <= 4 && activeTab > 2 }, "p-3 text-nowrap")}
                        onClick={() => { toggleTab(3); }}
                    >
                        <i className="ri-bank-card-line fs-16 p-2 bg-soft-primary text-primary rounded-circle align-middle me-2"></i>
                        Communication Details
                    </NavLink>
                </NavItem>
                <NavItem role="presentation">
                    <NavLink href="#"
                        className={classnames({ active: activeTab === 4, done: activeTab <= 4 && activeTab > 3 }, "p-3 text-nowrap")}
                        onClick={() => { toggleTab(4); }}
                    >
                        <i className="ri-checkbox-circle-line fs-16 p-2 bg-soft-primary text-primary rounded-circle align-middle me-2"></i>
                        Documents
                    </NavLink>
                </NavItem> */}