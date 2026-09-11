import { InputCheckbox, MenuOptionHrtl, StatusLabel, UserDetails } from "../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../Components/Common/MenuOptions";
import { UpdatedUserDetails } from "../../../Components/Common/UpdatedUserDetails";
import { formatCustomDate, formatCustomTime, Today_Date } from "../../../utility/dateutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>, allStudentSelectedState: any, allStudentCheckHndlr: any, singleStudentCheckHndlr: any) {
  return [
    {
      Header: () => {
        return (
          <InputCheckbox
            name={"all-student"}
            value={allStudentSelectedState}
            onChange={allStudentCheckHndlr}
            formgroupClassName="tw-mb-0"
          />
        );
      },
      accessor: "isStudentChecked",
      columnClassName: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { studentId, isSelected } = original;
        return (
          <>
            <InputCheckbox
              name={`student-${studentId}`}
              value={isSelected}
              onChange={singleStudentCheckHndlr}
              dataId={studentId}
              formgroupClassName="tw-mb-0"
            />
          </>
        );
      }
    },

    {
      Header: "Registered Name",
      accessor: "registeredName",
      columnClassName: "tw-w-[200px] tw-min-w-[200px]",
      disableSortBy: true,
    Cell: ({ row: { original } }: any) => {
      const { studentCode, registeredName, studentImageBase64 } = original,
          imageBaseUrl = studentImageBase64 ? `data:image/jpeg;base64, ${studentImageBase64}` : "";
      return (
          <UserDetails
              imageUrl={imageBaseUrl}
              displayName={registeredName}
              displayId={studentCode}
              size="xs"
              defaultImgType="student"
          />
      )
  }
    },
    
    {
      Header: "Registered Email",
      accessor: "registeredEmail",
      disableSortBy: true,
    },
    {
      Header: "Registered Mobile",
      accessor: "registeredMobile",
      disableSortBy: true,
    },
    {
      Header: "Primary Registration Campaign",
      accessor: "primaryRegistrationCampaign",
      disableSortBy: true,
      columnClassName: 'tw-text-center',
 
    },
    {
      Header: "User Registration Date",
      accessor: "userRegistrationDate",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        const [date, time] = original.userRegistrationDate.split(", ");
        return (
          <>
            <span>{date}</span>,{" "}
            <span className="tw-text-gray-500 tw-text-[10px]">{time}</span>
          </>
        );
      },
    },
    {
      Header: "Last Activity",
      accessor: "lastActivityDate",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        const [date, time] = original.userRegistrationDate.split(", ");
        return (
          <>
            <span>{date}</span>,{" "}
            <span className="tw-text-gray-500 tw-text-[10px]">{time}</span>
          </>
        );
      },
    },
    {
      Header: "Lead Owner",
      accessor: "leadOwner",
      disableSortBy: true,
      columnClassName: "tw-text-center",
    },
    {
        Header: "Lead Stage",
        accessor: "leadStage",
        disableSortBy: true,
        columnClassName: "tw-text-center",
        Cell: ({ row: { original } }: any) => {
        const data = original?.leadStage?.split(" ")[0]
          return (
            <StatusLabel type={data} labelName={data} />
          );
        },
      },
   {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
            return (
              <MoreActions actionOptions={actionsList} rowId={original.id} isHorizontal={true}/>
            );
          },
    },
  ];
}

export const enquiryData = [
    {
        id: 1,
        registeredName: "John Doe",
        registeredEmail: "bq5mZ@example.com",
        registeredMobile: "1234567890",
        primaryRegistrationCampaign: "Primary Registration Campaign",
        userRegistrationDate: formatCustomDate(Today_Date) + ", " + formatCustomTime(Today_Date),
        lastActivityDate: formatCustomDate(Today_Date)+ ", " + formatCustomTime(Today_Date),
        leadOwner: "John Doe",
        leadStage: "Lead Stage"
    },
    {
      id: 1,
      registeredName: "John Doe",
      registeredEmail: "bq5mZ@example.com",
      registeredMobile: "1234567890",
      primaryRegistrationCampaign: "Primary Registration Campaign",
      userRegistrationDate: formatCustomDate(Today_Date)+ ", " + formatCustomTime(Today_Date),
      lastActivityDate: formatCustomDate(Today_Date)+ ", " + formatCustomTime(Today_Date),
      leadOwner: "John Doe",
      leadStage: "Lead Stage"
  },
  {
    id: 1,
    registeredName: "John Doe",
    registeredEmail: "bq5mZ@example.com",
    registeredMobile: "1234567890",
    primaryRegistrationCampaign: "Primary Registration Campaign",
    userRegistrationDate: formatCustomDate(Today_Date)+ ", " + formatCustomTime(Today_Date),
    lastActivityDate: formatCustomDate(Today_Date)+ ", " + formatCustomTime(Today_Date),
    leadOwner: "John Doe",
    leadStage: "Lead Stage"
},{
  id: 1,
  registeredName: "John Doe",
  registeredEmail: "bq5mZ@example.com",
  registeredMobile: "1234567890",
  primaryRegistrationCampaign: "Primary Registration Campaign",
  userRegistrationDate: formatCustomDate(Today_Date)+ ", " + formatCustomTime(Today_Date),
  lastActivityDate: formatCustomDate(Today_Date)+ ", " + formatCustomTime(Today_Date),
  leadOwner: "John Doe",
  leadStage: "Lead Stage"
}
]



