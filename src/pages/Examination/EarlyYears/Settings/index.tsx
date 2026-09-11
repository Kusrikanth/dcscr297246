import { useHistory } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookBookmark01Icon } from "@hugeicons-pro/core-stroke-standard";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";

const routes = [
      {
        id: "term-name",
        path: "/early-years-settings/term-name"
      },
      {
        id: "term-details",
        path: "/early-years-settings/term-details"
      },
      {
        id: "ao-mapping",
        path: "/early-years-settings/ao-mapping"
      },
      {
        id: "area-of-strength-focus",
        path: "/early-years-settings/area-of-strength-focus"
      },
    {
        id: "skill-set",
        path: "/early-years-settings/skill-set"
      },
      {
        id: "early-years-signature",
        path: "/early-years-settings/signature"
      },
      {
        id: "reportcard-settings",
        path: "/early-years-settings/reportcard-settings"
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
    id: "ao-mapping",
    labelName: "Ao's Mapping",
    info: "View and Setup Ao's Mapping",
    icon: <HugeiconsIcon icon={BookBookmark01Icon}
      size={28}
      color={"#d5d5d5"}
    />
  },
  {
    id: "area-of-strength-focus",
    labelName: "Area of Strength Focus",
    info: "View and Setup Ao's Mapping",
    icon: <HugeiconsIcon icon={BookBookmark01Icon}
      size={28}
      color={"#d5d5d5"}
    />
  },
  {
    id: "skill-set",
    labelName: "Skill Set",
    info: "View and Setup Skill Set Details",
    icon: <HugeiconsIcon icon={BookBookmark01Icon}
      size={28}
      color={"#d5d5d5"}
    />
  },
  {
    id: "early-years-signature",
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
];


const EarlyYearsSettings = () => {

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
          <BreadCrumb title="Early Years Managment" pageTitle="Examination" />

          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">
                    Early Years Settings
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

export default EarlyYearsSettings;
