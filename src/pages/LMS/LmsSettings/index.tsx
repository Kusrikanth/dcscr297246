import { useHistory } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

import {
  Tag02Icon,
  MessageQuestionIcon,
  Mortarboard02Icon,
} from "@hugeicons-pro/core-stroke-standard";

import { HugeiconsIcon } from "@hugeicons/react";
import { OffCanvasContainer } from "../../../Components/Common";
import { useState } from "react";
import AdvanceFilterModal from "./AdvanceFilterModal";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";

const routes = [
  { id: "question-pool", path: "/lms-settings/question-pool" },
  { id: "assignments", path: "/lms-settings/assignments" },
  { id: "globalSettings", path: "/lms-settings/assessment-settings" },
  { id: "digital-curriculum-settings", path: "/lms-settings/digital-curriculum-settings" },
];

const lmsSettingsList = [
  {
    id: "academics",
    icon: Mortarboard02Icon,
    title: "Academics",
    info: "Academics Settings",
  },
  {
    id: "question-pool",
    icon: MessageQuestionIcon,
    title: "Question Pool",
    info: "Manage and configure the question banks and its settings",
  },
  {
    id: "assignments",
    icon: MessageQuestionIcon,
    title: "Assignments",
    info: "Manage and configure the Assignments and its settings",
  },
  {
    id: "globalSettings",
    icon: MessageQuestionIcon,
    title: "Assessment Settings",
    info: "Manage and configure the Assessment Settings and its settings",
  },
  {
    id: "digital-curriculum-settings",
    icon: MessageQuestionIcon,
    title: "Digital Curriculum Settings",
    info: "Manage and configure the Assessment Settings and its settings",
  },
];

const LMSSettings = () => {
  const [open, setOpen] = useState<boolean>(false);

  const history = useHistory();
  const toggleAdvanceFilter = () => {
    setOpen((prev) => !prev);
  };
  const redirectRoute = (id: any) => {
    routes.filter((route) => {
      if (route.id === id) {
        history.push(route.path);
      }
    });
  };

  return (
    <>
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb pageTitle="LMS"></BreadCrumb>

        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0 flex-grow-1">LMS Settings</h4>
          </div>

            {/* <div className="col-auto me-2">
              <button
                style={{
                  backgroundColor: "#F4F7FA",
                }}
                onClick={toggleAdvanceFilter}
                title="Filters"
                className="p-2 btn d-flex"
              >
                <FilterSvg height={"18px"} width={"18px"} />
                <span className="ms-2">Filters</span>
              </button>
            </div> */}
          <div className="card-body">
            <div className="row gx-2 module-settings-container">
              <div className="col-12 mb-4">
                <div className="row gx-3">
                  {lmsSettingsList.map((item) => (
                    <div
                      data-id={item.id}
                      key={item.id}
                      className="col-12 col-lg-6 col-xl-3"
                      onClick={() => redirectRoute(item.id)}
                    >
                      <div className="setting-card-container !tw-p-2">
                        <div className="img-container !tw-bg-[#4051891a]">
                          <HugeiconsIcon
                            icon={item.icon}
                            className="text-muted"
                            size={24}
                          />
                        </div>
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
      <div className="lms_readiness">

<OffCanvasContainer
  isOpen={open}
  headerTitle="Readiness"
  closeHndlr={toggleAdvanceFilter}
  id="advance-filter-login-user"
  width={500}
>
  <AdvanceFilterModal />
</OffCanvasContainer>



      </div>
    </>
  );
};

export default LMSSettings;
