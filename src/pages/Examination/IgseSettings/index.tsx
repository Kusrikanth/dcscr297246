import React, { useEffect, useMemo, useRef, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useHistory } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookBookmark01Icon } from "@hugeicons-pro/core-stroke-standard";

const routes = [
  {
    id: "term-name",
    path: "/igcse-settings/term-name"
  },
  {
    id: "term-details",
    path: "/igcse-settings/term-details"
  },
  {
    id: "term-wise-examination",
    path: "/igcse-settings/term-wise-examination"
  },
  {
    id: "ao-mapping",
    path: "/igcse-settings/ao-mapping"
  },
  {
    id: "ao-selection",
    path: "/igcse-settings/ao-selection"
  },
  {
    id: "skill-set",
    path: "/igcse-settings/skill-set"
  },
  {
    id: "igcse-signature",
    path: "/igcse-settings/signature"
  },
  {
    id: "coscholastic-grades",
    path: "/igcse-settings/coscholastic-grades"
  },
  {
    id: "overall-grades",
    path: "/igcse-settings/overall-grades"
  },
  {
    id: "reportcard-settings",
    path: "/igcse-settings/reportcard-settings"
  },
  {
    id: "skill-attribute-settings",
    path: "/igcse-settings/skill-attribute-settings"
  },
  {
    id: "examination-subjects",
    path: "/igcse-settings/examination-subjects"
  }
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
    id: "term-wise-examination",
    labelName: "Term Wise Examination",
    info: "View and Setup Term Wise Examination",
    icon: <HugeiconsIcon icon={BookBookmark01Icon}
      size={28}
      color={"#d5d5d5"}
    />
  },
{
    id: "coscholastic-grades",
    labelName: "Coscholastic Grades",
    info: "View and Setup Coscholastic Grades",
    icon: <HugeiconsIcon icon={BookBookmark01Icon}
      size={28}
      color={"#d5d5d5"}
    />
  },
];

const menuOptionsII = [
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
    id: "ao-mapping",
    labelName: "Ao's Mapping",
    info: "View and Setup Ao's Mapping",
    icon: <HugeiconsIcon icon={BookBookmark01Icon}
    size={28}
    color={"#d5d5d5"}
    />
  },
  {
    id: "ao-selection",
    labelName: "Ao's Selection",
    info: "View and Setup Ao's Selection",
    icon: <HugeiconsIcon icon={BookBookmark01Icon}
    size={28}
    color={"#d5d5d5"}
    />
  },
  {
    id: "skill-set",
    labelName: "Skill Set",
    info: "View and Setup Skill Set",
    icon: <HugeiconsIcon icon={BookBookmark01Icon}
    size={28}
    color={"#d5d5d5"}
    />
  },
  {
    id: "igcse-signature",
    labelName: "Signature",
    info: "View and Setup Signature",
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
      id: "skill-attribute-settings",
      labelName: "Skill Attribute Settings",
      info: "View and Setup Skill Attribute Settings",
      icon: <HugeiconsIcon icon={BookBookmark01Icon}
        size={28}
        color={"#d5d5d5"}
      />
    },
    {
      id: "examination-subjects",
      labelName: "Examination Subjects",
      info: "View and Setup Examination Subjects",
      icon: <HugeiconsIcon icon={BookBookmark01Icon}
        size={28}
        color={"#d5d5d5"}
      />
    },
];

const IgseSettings = () => {
  
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
                    IGCSE Examination Settings
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

export default IgseSettings;
