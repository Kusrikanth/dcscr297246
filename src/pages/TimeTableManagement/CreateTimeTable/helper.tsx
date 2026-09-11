import { default as CommunicationIconSvg } from "../../../assets/imagesdps/directory/icons/communication_icon.svg?react";
import { default as BasicInfo } from "../../../assets/imagesdps/directory/icons/basic_info.svg?react";
import { default as JobInfo } from "../../../assets/imagesdps/directory/icons/job_info.svg?react";
import { default as Document } from "../../../assets/imagesdps/directory/icons/document.svg?react";

export const timeTableSettingsStepList = [
  {
    id: "time-table-details",
    title: "Time Table Details",
    iconImage: <BasicInfo />,
  },
  {
    id: "assign-period-wise-subject",
    title: "Assign Subjects",
    iconImage: <JobInfo />,
  },
  // {
  //   id: "assign-teacher",
  //   title: "Allocate Teachers",
  //   iconImage: <CommunicationIconSvg />,
  // },
  // {
  //   id: "time-table-preview",
  //   title: "Preview",
  //   iconImage: <BasicInfo />,
  // },
];
