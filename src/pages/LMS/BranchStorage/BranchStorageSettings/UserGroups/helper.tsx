import { AvatarGroupUpdated, Button, MenuOptionHrtl, UserDetails } from '../../../../../Components/Common';
import { IOptionsHrtl } from '../../../../../Components/Common/MenuOptions';

export function generateColumns(actionsList: Array<IOptionsHrtl>, onAvatarClick?: (id: number) => void) {
  return [
    {
      Header: 'Group Name',
      accessor: 'groupName',
      disableSortBy: true
    },
    {
      Header: 'Group Code',
      accessor: 'groupCode',
      disableSortBy: true,
    },
    {
      Header: 'Group Type',
      accessor: 'groupType',
      disableSortBy: true,
    },
    {
      Header: "Members",
      accessor: "members",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {

        const hasMembers =
          Array.isArray(original?.members) &&
          original.members.length > 0;

        return hasMembers ? (
          <AvatarGroupUpdated
            avatars={original.members}
            tooltipKey="employeeName"
            numberOfAvatarToShow={3}
            dataId={original?.id}
            showLimitedAvatar={true}
            showAvatarName={true}
            imageKey="employeeImage"
            uniqueAvatarKey="memberId"
            onClickHandler={() => onAvatarClick?.(original.id)}
            onClickMoreAvatarHndlr={() =>
              onAvatarClick?.(original.id)
            }
          />
        ) : (
          <Button
            variant="linkBtn"
            type="button"
            className="!tw-p-0"
            onClick={() => onAvatarClick?.(original.id)}
          >
            + Add Members
          </Button>
        );
      },
    },
    {
      Header: 'Actions',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.id}
          ></MenuOptionHrtl>
        );
      },
    },
  ];
}

export function renderGroupValue(selectedItems: any) {
  return `${selectedItems?.groupName}`;
}

export function renderGroupOptions(item: any) {
  return `${item?.groupName}`;
}

export function renderOptionsEmployee(item: any) {
  return `${item?.employeeName} - ${item?.employeeCode}`;
}

export function renderValueSection(selectedItem: any) {
  return `${selectedItem?.employeeName} - ${selectedItem?.employeeCode}`;
}