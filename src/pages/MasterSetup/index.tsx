import React, { useEffect, useMemo, useState } from "react";
import { Card, CardBody, Col, Container, Input, Label, Row, Button, CardHeader } from "reactstrap";
import { shallowEqual } from "react-redux";
import classnames from "classnames";

//Common Component
import BreadCrumb from "../../Components/Common/BreadCrumb";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";

//Component
import Institute from "./Institute";
import Branch from "./Branch/index";
import ModuleLevel from "./ModuleLevel";
import GlobalRecords from "./GlobalRecords";
import RoleTypes from "./RoleTypes";
// import MasterFields from "./MasterFields";
import AcademicYears from "./AcademicYears";
import Terms from "./Terms";
import AcademicTerms from "./AcademicTerms";
import Departments from "./Departments";
import Curriculum from "./Curriculum";
import ClassStructure from "./ClassStructure";
import Class from "./Class";
import Forms from "./Forms";
import Fee from "./Fees";
import NumberingSeries from "./NumberingSeries";
// import UserManagementOld from "./UserManagement";
import UserManagement from "./UserManagementU";


//Images
import DPSLogoSM from "../../assets/imagesdps/mastersetup/dps_logo.png";
import PGSLogoSM from "../../assets/imagesdps/mastersetup/pgs-logo.png";


//Helpers
import { MenuOptions } from "./helper";
import LanguagesCopm from "./LanguagesCopm";
import ModuleAccess from "./ModuleAccess";
//Generate Action
import { generateActionPayload } from "../../utility/reduxutility";
import { getInstByIdAct } from "../../store/mastersettings/instituteinfo/instituteinfoactions";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlayCircleIcon } from "@hugeicons-pro/core-stroke-standard";
import Subjects from "./Subjects";
import PaymentGateways from "./PaymentGateways";
import RegistrationInstructions from "./RegistrationInstructions";

function getActiveMenuComponent(menuId: string | null) {
  switch (menuId) {
    case "institute":
      return Institute;
    case "branches":
      return Branch;
    case "module-level":
      return ModuleLevel;
    case "global-records":
      return GlobalRecords;
    case "module-access":
      return ModuleAccess;
    case "role-type":
      return RoleTypes;
    // case "master-fields":
    //   return MasterFields;
    case "academic-years":
      return AcademicYears;
    case "terms":
      return Terms;
    case "academic-terms":
      return AcademicTerms;
    case "departments":
      return Departments;
    case "curriculum":
      return Curriculum;
    case "class":
      return Class;
    case "class-structure":
      return ClassStructure;
    case "fees":
      return Fee;
    case "forms":
      return Forms;
    case "numbering-series":
      return NumberingSeries;
    case "subjects":
      return Subjects;
    case "language":
      return LanguagesCopm;
    // case "user-management-old":
    //   return UserManagement;
    case "user-management":
      return UserManagement;
    case "payment-gateways":
      return PaymentGateways;
    case "registration-instructions":
      return RegistrationInstructions;
  }
}

const MasterSetup = () => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>("institute");

  const dispatch = useAppDispatch();
  const { currentInstIdResp, instituteValue, instDetailsResp } = useAppSelector(({ appData, Layout, instituteInfo }) => ({
    instituteValue: Layout.instituteValue,
    instDetailsResp: instituteInfo.instDetailsResp,
    currentInstIdResp: appData.currentInstIdResp
  }), shallowEqual);


  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveMenuId(menuId);
  }

  useEffect(() => {
    if (currentInstIdResp) {
      const params = { instituteId: currentInstIdResp };
      dispatch(getInstByIdAct(generateActionPayload("get_inst_details", params)));
    }
  }, [currentInstIdResp]);

  const activeComponent = useMemo(() => {
    // if (currentInstIdResp) {
    const TabComponent: any = getActiveMenuComponent(activeMenuId);
    return <TabComponent instituteName={instDetailsResp?.instituteName} instituteId={currentInstIdResp}
    />
    // }
  }, [activeMenuId, instDetailsResp, instituteValue, currentInstIdResp, getActiveMenuComponent]);

  return (<React.Fragment>
    <div className="page-content master-setup-wrapper">
      <div className="container-fluid tw-mx-auto tw-px-4">
        <BreadCrumb title="Master Setup" pageTitle="DPS" />

        <div className="tw-bg-white tw-shadow tw-rounded-lg tw-mb-4">
          <div className="tw-py-2 tw-px-2 tw-flex tw-justify-between tw-items-center">
            <div className="tw-flex tw-items-center">
              <div className="tw-flex-shrink-0 tw-w-12 tw-h-12 tw-bg-gray-100 tw-rounded-full tw-p-1 tw-mr-3">
                <img
                  src={instituteValue === "DPS" ? DPSLogoSM : DPSLogoSM}
                  className="tw-w-full tw-h-full tw-object-contain"
                />
              </div>
              <div className="tw-flex tw-flex-col">
                <h5 className="tw-mb-0">{instDetailsResp?.instituteName}</h5>
                <span className="tw-text-blue-600">{instDetailsResp?.shortName}</span>
              </div>
            </div>
            <a href="#" className="tw-flex tw-items-center tw-text-blue-500">
              <span className="tw-font-medium tw-mr-1">Help Video</span>
              <HugeiconsIcon icon={PlayCircleIcon} className="tw-mr-2 tw-text-blue-500" size={20} />
            </a>
          </div>
        </div>

        <div className="tw-flex tw-gap-3">
          <div className="tw-w-1/3 xl:tw-w-1/4 lg:tw-w-1/3">
            <div className="tw-bg-white tw-shadow tw-rounded-lg">
              <div className="tw-py-0 tw-px-0">
                <ul className="tw-list-none tw-p-0 tw-m-0">
                  {MenuOptions.map((item) => (
                    <li
                      data-id={item.id}
                      onClick={clickMenuHandler}
                      className={`tw-cursor-pointer tw-py-2 tw-px-4  tw-border-b tw-border-gray-100 ${item.id === activeMenuId ? "tw-bg-[#4051891a] tw-text-[#405189] tw-font-medium" : "hover:tw-bg-gray-50"}`}
                      key={item.id}
                    >
                      {item.labelName}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="tw-w-2/3 xl:tw-w-3/4 lg:tw-w-2/3">
            {activeComponent}
          </div>
        </div>
      </div>
    </div>
  </React.Fragment>)
}

export default MasterSetup;