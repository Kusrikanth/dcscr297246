import { StatusLabel, UserDetails } from "../../../../Components/Common";
import { getDdMmYyyyFormat } from "../../../../utility/dateutility";

export function generateColumns() {
  return [
    {
      Header: "Vechile No",
      accessor: "vehicleNumber",
      disableSortBy: true,
    },
    {
      Header: "Route",
      accessor: "routeName",
      disableSortBy: true,
    },
    {
      Header: "Route Code",
      accessor: "routeCode",
      disableSortBy: true,
    },
    {
      Header: "Renewal Date",
      accessor: "renewalDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { renewalDate } = original;
        return getDdMmYyyyFormat(renewalDate);
      }
    },
  ];
}

export function licenseRenewalColumns() {
  return [
    {
      Header: "Driver Name",
      accessor: "driver",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { driverName, driverCode } = original;
        return (
          <UserDetails
            displayName={driverName}
            displayId={driverCode}
            size="xs"
          ></UserDetails>
        );
      },
    },
    {
      Header: "License Id",
      accessor: "licenseNumber",
      disableSortBy: true,
    },
    {
      Header: "Renewal Date",
      accessor: "renewalDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { renewalDate } = original;
        return getDdMmYyyyFormat(renewalDate);
      }
    },
  ];
}
export function InsuranceRenewalColumns() {
  return [
    {
      Header: "Registration Number",
      accessor: "registrationNumber",
      disableSortBy: true,
      Cell: ({ value }: any) => value || "-",
    },
    {
      Header: "Insurance Company",
      accessor: "insuranceCompany",
      disableSortBy: true,
      Cell: ({ value }: any) => value || "-",
    },
    {
      Header: "Insurance Type",
      accessor: "insuranceType",
      disableSortBy: true,
      Cell: ({ value }: any) => value || "-",
    },
    {
      Header: "Insurance Start Date",
      accessor: "insuranceStartDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { insuranceStartDate } = original;

        return insuranceStartDate
          ? getDdMmYyyyFormat(insuranceStartDate)
          : "-";
      },
    },
    {
      Header: "Insurance End Date",
      accessor: "insuranceEndDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { insuranceEndDate } = original;

        return insuranceEndDate
          ? getDdMmYyyyFormat(insuranceEndDate)
          : "-";
      },
    },
    {
      Header: "Insurance Renewal Date",
      accessor: "insuranceRenewalDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { insuranceRenewalDate } = original;

        return insuranceRenewalDate
          ? getDdMmYyyyFormat(insuranceRenewalDate)
          : "-";
      },
    },
  ];
}
