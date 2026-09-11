import { StatusLabel, UserDetails } from "../../../../Components/Common";
import { getDateWithTimeFormat } from "../../../../utility/dateutility";

export const notificationType = [
  { value: 'EMAIL', label: 'Email' },
  { value: 'SMS', label: 'SMS' },
]

export const statusOptions = [
  {
    name: "FAILED",
  },
  {
    name: "SUCCESS",
  }
]

export function generateColumns() {
  return [
    {
      Header: "Name",
      accessor: "name",
      columnClassName: "sticky-left tw-min-w-200px w-200px tw-max-w-200px",
      Cell: ({ row: { original } }: any) => {
        const { employeeName, employeeCode } = original;

        if (employeeName && employeeCode) {
          return (
            <UserDetails
              showAvatar
              displayNameClass="text-truncate"
              displayName={employeeName}
              displayId={employeeCode}
              size="xs"
              defaultImgType="student"
            />
          );
        }
        else {
          return (
            <span className="tw-text-center">-</span>
          )
        }
      },
    },
    {
      Header: "Created Date",
      accessor: "createdAt",
      disableSortBy: true,
      columnClassName: "tw-text-center tw-min-w-200px w-200px tw-max-w-200px",
      Cell: ({ row: { original } }: any) => {
        return (
          getDateWithTimeFormat(original?.createdAt ? `${original?.createdAt}` : '-')
        );
      }
    },
    {
      Header: "User Name",
      accessor: "userName",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{original.userName ? original.userName : '-'}</span>
        )
      }
    },
    {
      Header: "Notification Type",
      accessor: "notificationType",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{original.notificationType ? original.notificationType : '-'}</span>
        )
      }

    },
    {
      Header: "Template Name",
      accessor: "templateName",
      disableSortBy: true,
      columnClassName: "tw-text-center tw-min-w-200px w-200px tw-max-w-200px",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{original.templateName ? original.templateName.replace(/_/g, ' ') : '-'}</span>
        )
      }
    },
    {
      Header: "Identifier",
      accessor: "identifier",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{original.identifier ? original.identifier : '-'}</span>
        )
      }
    },
    {
      Header: "Message",
      accessor: "failureMessage",
      disableSortBy: true,
      columnClassName: "tw-text-center tw-min-w-300px w-300px tw-max-w-300px",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{original.failureMessage ? original.failureMessage : '-'}</span>
        )
      }
    },
    {
      Header: "Status",
      accessor: "notificationStatus",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel labelName={original.notificationStatus} type={original.notificationStatus} />
        )
      }

    },
  ];
}

export const ignoredKeys = ["searchString", "dateRange", "toDate", "fromDate", "status"]


export function renderOptionsRoute(item: any) {
  return `${item?.smsTemplateName}`;
}

export function renderValueRoute(selectedItems: any) {
  return `${selectedItems?.smsTemplateName}`;
}

export const getOptions = (options: any[]) => {

  return options?.map((option) => {
    const smsTemplateName = option?.smsTemplateName?.split('_')?.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return {
      ...option,
      smsTemplateName,
    }
  });
}