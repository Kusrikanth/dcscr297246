import { useHistory } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookBookmark01Icon } from "@hugeicons-pro/core-stroke-standard";

const routes = [
  {
    id: "class-rooms",
    path: "/time-table-settings/class-rooms",
  },
  {
    id: "period-category",
    path: "/time-table-settings/period-category",
  },
  {
    id: "time-table-breaks-type",
    path: "/time-table-settings/breaks-type",
  },
  {
    id: "time-table-breaks",
    path: "/time-table-settings/breaks",
  },
];

const menuOptions = [
  {
    id: "class-rooms",
    labelName: "Class Rooms",
    info: "View and Setup Class Room Details",
    icon: <HugeiconsIcon icon={BookBookmark01Icon} size={28} color="#d5d5d5" />,
  },
  {
    id: "period-category",
    labelName: "Period Category",
    info: "View and Setup Period Categories",
    icon: <HugeiconsIcon icon={BookBookmark01Icon} size={28} color="#d5d5d5" />,
  },
  {
    id: "assign-teachers",
    labelName: "Assign Teachers",
    info: "View and Setup Assign Teachers",
    icon: <HugeiconsIcon icon={BookBookmark01Icon} size={28} color="#d5d5d5" />,
  },
  {
    id: "substitution-list",
    labelName: "Substitution List",
    info: "View and Setup Substitution List",
    icon: <HugeiconsIcon icon={BookBookmark01Icon} size={28} color="#d5d5d5" />,
  },
  {
    id: "holidays",
    labelName: "Holidays",
    info: "View and Setup Holidays",
    icon: <HugeiconsIcon icon={BookBookmark01Icon} size={28} color="#d5d5d5" />,
  },
  {
    id: "time-table-type-structure",
    labelName: "Time Table Type & Structure",
    info: "View and Setup Holidays",
    icon: <HugeiconsIcon icon={BookBookmark01Icon} size={28} color="#d5d5d5" />,
  },
  {
    id: "time-table-breaks-type",
    labelName: "Breaks Type",
    info: "View and Setup Breaks Type",
    icon: <HugeiconsIcon icon={BookBookmark01Icon} size={28} color="#d5d5d5"  />,
  },
  {
    id: "time-table-breaks",
    labelName: "Breaks",
    info: "View and Setup Breaks",
    icon: <HugeiconsIcon icon={BookBookmark01Icon} size={28} color="#d5d5d5" />,
  },
];

const TimeTableSettings = () => {
  const history = useHistory();
  const settingsRoutes = (id: any) => {
    routes.filter((ele) => {
      if (ele.id == id) {
        history.push(ele.path);
      }
    });
  };

  return (
    <>
      <div className="page-content time-table-settings-container">
        <div className="container-fluid">
          <BreadCrumb
            title="Time Table Settings"
            pageTitle="Time Table Settings"
          />
        </div>
        <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-100">
          <div className="tw-px-6 tw-py-4 tw-border-b tw-border-gray-100">
            <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
              Time Table Settings
            </h4>
          </div>

          <div className="tw-p-6">
            <div className="tw-grid tw-grid-cols-12  tw-gap-6">

              {menuOptions.map((item) => (
                 <div
                        onClick={() => settingsRoutes(item.id)}
                        data-id={item.id}
                        key={item.id}
                        className="tw-col-span-3 tw-cursor-pointer"
                      >
                        <div className="setting-card-container tw-flex tw-gap-2">
                          <div className="img-container tw-bg-slate-100 tw-flex tw-justify-center tw-items-center tw-p-2">{item.icon}</div>

                          <div className="d-flex flex-column">
                            <h6 className="setting-title tw-text-blue-400">{item.labelName}</h6>
                            <div className="setting-info">{item.info}</div>
                          </div>
                        </div>
                      </div>
              ))}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimeTableSettings;
