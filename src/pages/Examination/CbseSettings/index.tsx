import React, { useEffect, useMemo, useRef, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useHistory } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookBookmark01Icon } from "@hugeicons-pro/core-stroke-standard";

const routes = [
  {
    id: "term-name",
    path: "/cbse-settings/term-name"
  },
  {
    id: "term-details",
    path: "/cbse-settings/term-details"
  },
  {
    id: "examination-name",
    path: "/cbse-settings/examination-name"
  },
  {
    id: "examination-weightage",
    path: "/cbse-settings/examination-weightage"
  },
  {
    id: "coscholastic-grades",
    path: "/cbse-settings/coscholastic-grades"
  },
  {
    id: "overall-grades",
    path: "/cbse-settings/overall-grades"
  },
  {
    id: "cbse-signature",
    path: "/cbse-settings/signature"
  },
  {
    id: "internal-subject-grades",
    path: "/cbse-settings/internal-subject-grades"
  },
  {
    id: "percentage-slabs",
    path: "/cbse-settings/percentage-slabs"
  },
  {
    id: "reportcard-settings",
    path: "/cbse-settings/reportcard-settings"
  },
  {
    id: "examination-subjects",
    path: "/cbse-settings/examination-subjects"
  },
]

const menuOptions = [
  {
    id: "term-name",
    labelName: "Term Name",
    info: "View and Setup Term Name",
    icon: <HugeiconsIcon icon={BookBookmark01Icon}
      size={28}
      color={"#d5d5d5"}
    />
  },
  {
    id: "term-details",
    labelName: "Term Details",
    info: "View and Setup Term Details",
    icon: <HugeiconsIcon icon={BookBookmark01Icon}
      size={28}
      color={"#d5d5d5"}
    />
  },
  {
    id: "examination-name",
    labelName: "Examinations",
    info: "View and Setup Examination Details",
    icon: <HugeiconsIcon icon={BookBookmark01Icon}
      size={28}
      color={"#d5d5d5"}
    />
  },
  {
    id: "examination-weightage",
    labelName: "Examination Weightage",
    info: "View and Setup Examination Weightage",
    icon: <HugeiconsIcon icon={BookBookmark01Icon}
      size={28}
      color={"#d5d5d5"}
    />
  },

];

const menuOptionsII = [

  {
    id: "coscholastic-grades",
    labelName: "Coscholastic Grades",
    info: "View and Setup Coscholastic Grades",
    icon: <HugeiconsIcon icon={BookBookmark01Icon}
      size={28}
      color={"#d5d5d5"}
    />
  },
  {
    id: "overall-grades",
    labelName: "Overall Grades",
    info: "View and Setup Overall Grades",
    icon: <HugeiconsIcon icon={BookBookmark01Icon}
      size={28}
      color={"#d5d5d5"}
    />
  },
  {
    id: "cbse-signature",
    labelName: "Signature",
    info: "View and Setup Signature",
    icon: <HugeiconsIcon icon={BookBookmark01Icon}
      size={28}
      color={"#d5d5d5"}
    />
  },
  {
    id: "internal-subject-grades",
    labelName: "Internal Subject Grades",
    info: "View and Setup Internal Subject Grades",
    icon: <HugeiconsIcon icon={BookBookmark01Icon}
      size={28}
      color={"#d5d5d5"}
    />
  },
  {
    id: "reportcard-settings",
    labelName: "Report Card Settings",
    info: "View and Setup Report Card Settings",
    icon: <HugeiconsIcon icon={BookBookmark01Icon}
      size={28}
      color={"#d5d5d5"}
    />
  },
  {
    id: "examination-subjects",
    labelName: "Examination Subjects",
    info: "View and Setup Percentage Slabs",
    icon: <HugeiconsIcon icon={BookBookmark01Icon}
      size={28}
      color={"#d5d5d5"}
    />
  },
];

const CbseSettings = () => {

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
          <BreadCrumb title="CBSE Examination Managment" pageTitle="Examination" />

          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">
                    CBSE Examination Settings
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
                <div className="col-12 mb-0 mb-md-2 mb-4">
                  <div className="row gx-3">
                    {menuOptionsII.map(item => (
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

export default CbseSettings;
