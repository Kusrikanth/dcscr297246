import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, StudentsIcon, ValidationApprovalIcon } from "@hugeicons-pro/core-stroke-standard";
export const transformApiResponseToCardData = (response: any) => {

  return [
    {
      cardTitle: "Total Students",
      cardCount: (response?.totalStudents ?? 0).toString(),
      iconBgColor: "#54b3f1",
      iconColor: "text-info",
      cardIcon: <HugeiconsIcon icon={StudentsIcon} size={24} color={"#ffffff"} />,
      bgColor: "#d2e6f3",
      borderColor: "#54b3f1",
    },
    {
      cardTitle: "Average Attendance",
      cardCount: (response?.averagePercentage ?? 0).toFixed(2).toString() + "%",
      iconBgColor: "#4ae1c4",
      iconColor: "text-info",
      cardIcon: <HugeiconsIcon icon={Calendar03Icon} size={24} color={"#ffffff"} />,
      bgColor: "#d1f0ea",
      borderColor: "#4ae1c4",
    },
    {
      cardTitle: "Students With 100%",
      cardCount: (response?.perfectAttendanceCount ?? 0).toString(),
      iconBgColor: "#4edddd",
      iconColor: "text-info",
      cardIcon: <HugeiconsIcon icon={StudentsIcon} size={26} color={"#ffffff"} />,
      bgColor: "#d3f4f4",
      borderColor: "#4edddd",
    },
    {
      cardTitle: "Students Above 75%",
      cardCount: (response?.above75PercentCount ?? 0).toString(),
      iconBgColor: "#ffbf7f",
      iconColor: "text-info",
      cardIcon: <HugeiconsIcon icon={ValidationApprovalIcon} size={26} color={"#ffffff"} />,
      bgColor: "#feeede",
      borderColor: "#ffbf7f",
    }
  ]
};