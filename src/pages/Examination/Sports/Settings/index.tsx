import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { default as PaymentIcon } from "../../../../assets/imagesdps/modulesettings/money.svg?react";

import { useHistory } from "react-router-dom";

const routes = [
  {
    id: "sports",
    path: "/sports-settings/sports",
  },
  {
    id: "sports-attributes",
    path: "/sports-settings/sports-attribute",
  },
  {
    id: "grades",
    path: "/sports-settings/grade",
  },
  { id: "sportsClassMapping", path: "/sports-settings/map-sports-to-classes" },
  { id: "subAttributeSports", path: "/sports-settings/sports-sub-attributes" },
  { id: "sportsDescription", path: "/sports-settings/sports-descriptions" },
  { id: "teacherAssign", path: "/sports-settings/asssign-teacher-to-sports" },
   {
    id: "reportcard-settings",
    path: "/sports-settings/reportcard-settings"
  },
];

const librarySettingsSetup1 = [
  {
    id: "sports",
    icon: <PaymentIcon />,
    title: "Sports",
    info: "View and Setup Sports",
  },
  {
    id: "sports-attributes",
    icon: <PaymentIcon />,
    title: "Sports Attributes",
    info: "View and Setup Sports Attributes",
  },
  {
    id: "grades",
    icon: <PaymentIcon />,
    title: "Grades",
    info: "View and Setup Sports grades",
  },
  {
    id: "sportsClassMapping",
    icon: <PaymentIcon />,
    title: "Map Sports to Classes",
    info: "Assign sports to specific classes and manage mappings",
  },
  {
    id: "subAttributeSports",
    icon: <PaymentIcon />,
    title: "Sports Sub-Attributes",
    info: "Define and manage detailed attributes for each sport",
  },
  {
    id: "sportsDescription",
    icon: <PaymentIcon />,
    title: "Sports Descriptions",
    info: "Add and update descriptions for different sports",
  },
  {
    id: "teacherAssign",
    icon: <PaymentIcon />,
    title: "Assign Teacher to Sports",
    info: "Allocate teachers or coaches to specific sports",
  },
  {
    id: "reportcard-settings",
    icon: <PaymentIcon />,
    title: "Report Card Settings",
    info: "Configure Report Card Settings",
  },
];

const SportsSettings = () => {
  const history = useHistory();

  const SettingsRoutes = (id: any) => {
    routes.filter((ele, idx) => {
      if (ele.id == id) {
        history.push(ele.path);
      }
    });
  };

  return (
    <div className="page-content transportaion_dashboard_wrapper">
      <div className="container-fluid">
        <BreadCrumb title="Dashboard" pageTitle="Examination" />

        <div className=" ps-3">
          {" "}
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0 flex-grow-1">Sport Settings</h4>
            </div>
            <div className="card-body">
              <div className="row gx-2 module-settings-container mb-4">
                <div className="col-12 mb-4">
                  <div className="row gx-3">
                    {librarySettingsSetup1.map((item) => (
                      <div
                        onClick={() => SettingsRoutes(item.id)}
                        data-id={item.id}
                        key={item.id}
                        className="col-12 col-lg-6 col-xl-3"
                      >
                        <div className="setting-card-container">
                          <div className="img-container">{item.icon}</div>
                          <div className="d-flex flex-column">
                            <h6 className="setting-title">{item.title}</h6>
                            <div className="setting-info">{item.info}</div>
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
    </div>
  );
};
export default SportsSettings;
