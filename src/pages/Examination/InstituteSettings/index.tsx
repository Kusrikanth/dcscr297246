import React, { useEffect, useMemo, useRef, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useHistory } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookBookmark01Icon } from "@hugeicons-pro/core-stroke-standard";

const routes = [
  {
    id: "term-name",
    path: "/term-name"
  },
  {
    id: "term-details",
    path: "/term-details"
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
  }
];


const InstituteSettings = () => {
  
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
                    Settings
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

export default InstituteSettings;