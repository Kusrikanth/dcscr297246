import { HugeiconsIcon } from "@hugeicons/react";
import { SchoolBusIcon, StudentsIcon, UserGroup03Icon, ValidationApprovalIcon } from "@hugeicons-pro/core-stroke-standard";
export const transformApiResponseToCardData = (response: any) => {
  return [
    {
      cardTitle: "Active Vehicles Count",
      cardCount: (response?.vehicleDetailsSummary?.totalActiveVehicles ?? 0).toString(),
      iconBgColor: "bg-soft-info",
      iconColor: "text-info",
      cardIcon: <HugeiconsIcon icon={SchoolBusIcon} size={24} color={"#000000"} />,
      bgColor: "#E1E2F6",
      subTextOne: "Total Vehicles",
      subTextTwo: "Total Drivers",
      subTextThree: "Total Attendants",
      subCountOne: (response?.vehicleDetailsSummary?.totalVehiclesCount ?? 0).toString(),
      subCountTwo: (response?.vehicleDetailsSummary?.driversCount ?? 0).toString(),
      subCountThree: (response?.vehicleDetailsSummary?.attendersCount ?? 0).toString(),
      overlayColor: "#B0B2D4",
      overlayChildColor: "#CACBF0",
    },
    {
      cardTitle: "Total Students Availing",
      cardCount: (response?.totalStudentsAvail?.studentsAvailingCount ?? 0).toString(),
      iconBgColor: "bg-soft-info",
      iconColor: "text-info",
      cardIcon: <HugeiconsIcon icon={UserGroup03Icon} size={24} color={"#000000"}  />,
      bgColor: "#F8EFE2",
      subTextOne: "Term-I",
      subTextTwo: "Term-II",
      subTextThree: "Term-III",
      subCountOne: (response?.totalStudentsAvail?.termWiseAllocationCounts?.["Term-1"] ?? 0).toString(),
      subCountTwo: (response?.totalStudentsAvail?.termWiseAllocationCounts?.["Term-2"] ?? 0).toString(),
      subCountThree: (response?.totalStudentsAvail?.termWiseAllocationCounts?.["Term-3"] ?? 0).toString(),
      overlayColor: "#D7C5A9",
      overlayChildColor: "#EDE0C8",
    },
    {
      cardTitle: "Transport Opt",
      cardCount: (
        (response?.transportOpt?.staffCount ?? 0) +
        (response?.transportOpt?.studentCountGrade ?? 0) +
        (response?.transportOpt?.studentCountPrePrimary ?? 0)
      ).toString(),
      iconBgColor: "bg-soft-info",
      iconColor: "text-info",
      cardIcon: <HugeiconsIcon icon={StudentsIcon} size={26} color={"#000000"} />,
      bgColor: "#EFF7E2",
      subTextOne: "Pre-Primary",
      subTextTwo: "Class I-XII",
      subTextThree: "Staff",
      subCountOne: (response?.transportOpt?.studentCountPrePrimary ?? 0).toString(),
      subCountTwo: (response?.transportOpt?.studentCountGrade ?? 0).toString(),
      subCountThree: (response?.transportOpt?.staffCount ?? 0).toString(),
      overlayColor: "#C7D3B2",
      overlayChildColor: "#DDEABA",
    },
    {
      cardTitle: "Pending Requests",
      cardCount: Object.values(
        response?.pendingRequests?.requestTypeCounts as { [key: string]: { pending: number } }
      )
        .reduce((acc, type) => acc + (type?.pending ?? 0), 0)
        .toString(),
      iconBgColor: "bg-soft-info",
      iconColor: "text-info",
      cardIcon: <HugeiconsIcon icon={ValidationApprovalIcon} size={26} color={"#000000"} />,
      bgColor: "#ebeedf",
      subTextOne: "New Requests",
      subTextTwo: "Change Requests",
      subTextThree: "Termination",
      subCountOne:
        (response?.pendingRequests?.requestTypeCounts?.["NEW_REQUEST"]?.pending ?? 0).toString() +
        "/" +
        (response?.pendingRequests?.requestTypeCounts?.["NEW_REQUEST"]?.total ?? 0).toString(),
      subCountTwo:
        (response?.pendingRequests?.requestTypeCounts?.["CHANGE_REQUEST"]?.pending ?? 0).toString() +
        "/" +
        (response?.pendingRequests?.requestTypeCounts?.["CHANGE_REQUEST"]?.total ?? 0).toString(),
      subCountThree:
        (response?.pendingRequests?.requestTypeCounts?.["TERMINATION_REQUEST"]?.pending ?? 0).toString() +
        "/" +
        (response?.pendingRequests?.requestTypeCounts?.["TERMINATION_REQUEST"]?.total ?? 0).toString(),
      overlayColor: "#C1C4A8",
      overlayChildColor: "#D4D7C3",
    },
  ];
};
