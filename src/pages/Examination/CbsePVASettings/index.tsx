import React, { useEffect, useMemo, useRef, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useHistory } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookBookmark01Icon } from "@hugeicons-pro/core-stroke-standard";

const routes = [
  { id: "subject-setup", path: "/other-pva-settings/pva-subjects" },
  { id: "skill-area", path: "/other-pva-settings/pva-skill-area" },
  { id: "grade-configuration", path: "/other-pva-settings/pva-grade-configuration" },
  { id: "map-subject-classes", path: "/other-pva-settings/pva-map-subject-classes" },
  { id: "reportcard-settings", path: "/other-pva-settings/reportcard-settings" }
];

const menuOptions = [
  {
    id: "subject-setup",
    labelName: "PVA Subject Setup",
    info: "Add, edit, or view subjects under the PVA module",
    icon: (
      <HugeiconsIcon
        icon={BookBookmark01Icon}
        size={28}
        color={"#d5d5d5"}
      />
    ),
  },
  {
    id: "skill-area",
    labelName: "PVA Skill Areas",
    info: "Define and manage skill areas for each subject",
    icon: (
      <HugeiconsIcon
        icon={BookBookmark01Icon}
        size={28}
        color={"#d5d5d5"}
      />
    ),
  },
  {
    id: "grade-configuration",
    labelName: "Grade Configuration",
    info: "Set grading criteria and mark range",
    icon: (
      <HugeiconsIcon
        icon={BookBookmark01Icon}
        size={28}
        color={"#d5d5d5"}
      />
    ),
  },
  {
    id: "map-subject-classes",
    labelName: "Map Subjects to Classes",
    info: "Assign PVA subjects to specific classes or sections",
    icon: (
      <HugeiconsIcon
        icon={BookBookmark01Icon}
        size={28}
        color={"#d5d5d5"}
      />
    ),
  },
  {
    id: "reportcard-settings",
    labelName: "Report Card Settings",
    info: "Configure report card settings for PVA",
    icon: (
      <HugeiconsIcon
        icon={BookBookmark01Icon}
        size={28}
        color={"#d5d5d5"}
      />
    ),
  },
];

const CbsePvaSettings = () => {

  const history = useHistory();
  const SettingsRoutes = (id: any) => {
    routes.filter((ele, idx) => {
      if (ele.id == id) {
        history.push(ele.path);
      }
    })
  };

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="CBSE PVA Managment" pageTitle="Examination" />

          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">
                    CBSE PVA Settings
                  </h4>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row gx-2 module-settings-container">
                <div className="col-12 mb-0 mb-md-2 mb-4">
                  <div className="row gx-3">
                    {menuOptions.map(item => (
                      <div onClick={() => SettingsRoutes(item.id)} data-id={item.id} key={item.id} className="col-12 col-lg-6 col-xl-3">
                        <div className="setting-card-container">
                          <div className="img-container">
                            {item.icon}
                          </div>
                          <div className="d-flex flex-column">
                            <h6 className="setting-title">{item.labelName}</h6>
                            <div className="setting-info">
                              {item.info}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CbsePvaSettings;
