import calendarsmall from "../../../../../assets/imagesdps/lms/calendarsmall.png";
import searchsmall from "../../../../../assets/imagesdps/lms/searchsmall.png";
import gradesmall from "../../../../../assets/imagesdps/lms/gradesmall.png";
import Groupsmall from "../../../../../assets/imagesdps/lms/Groupsmall.png";
import prescriptionsmall from "../../../../../assets/imagesdps/lms/prescriptionsmall.png";
import responsesmall from "../../../../../assets/imagesdps/lms/responsesmall.png";

interface IMenuOptions {
  id: string;
  labelName: string;
  icon: string;
}

export const MenuOptions: Array<IMenuOptions> = [
  {
    id: "schedule-type",
    labelName: "Schedule Type",
    icon: calendarsmall,
  },
  {
    id: "advance-settings",
    labelName: "Advance Settings",
    icon: searchsmall,
  },
  {
    id: "grades-distribution",
    labelName: "Grades Distribution",
    icon: gradesmall,
  },
  {
    id: "notifcations",
    labelName: "Notifications",
    icon: Groupsmall,
  },
  {
    id: "rules",
    labelName: "Rules",
    icon: prescriptionsmall,
  },
  {
    id: "result-settings",
    labelName: "Result Settings",
    icon: responsesmall,
  },
];
