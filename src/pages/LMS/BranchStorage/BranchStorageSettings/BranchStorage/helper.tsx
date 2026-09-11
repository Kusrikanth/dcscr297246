import { MenuOptionHrtl, UserDetails } from '../../../../../Components/Common';
import { IOptionsHrtl } from '../../../../../Components/Common/MenuOptions';

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: 'BRANCH',
      accessor: 'branchName',
      disableSortBy: true
    },
    {
      Header: 'USAGE',
      accessor: 'usedBytesConversion',
      disableSortBy: true,
    },
    {
      Header: 'LIMIT',
      accessor: 'allocatedBytesConversion',
      disableSortBy: true,
    },
    {
      Header: 'Avaliable Space',
      accessor: 'availableBytesConversion',
      disableSortBy: true,
    },
    {
      Header: 'UTILIZATION',
      accessor: 'utilization',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const {
          utilizationPercentage,
          usedBytesConversion,
          allocatedBytesConversion,
        } = original || {};

        let gradientStyle = {};

        if (utilizationPercentage >= 80) {
          gradientStyle = {
            background: 'linear-gradient(90deg, #F97316 0%, #EF4444 100%)',
          };
        } else if (utilizationPercentage >= 60) {
          gradientStyle = {
            background: 'linear-gradient(90deg, #FBBF24 0%, #F97316 100%)',
          };
        } else {
          gradientStyle = {
            background: 'linear-gradient(90deg, #34D399 0%, #0AB39C 100%)',
          };
        }

        return (
          <div className="tw-flex tw-flex-col tw-gap-1 tw-min-w-[120px]">
            <div className="tw-flex tw-justify-between tw-items-center tw-text-xs tw-text-gray-500">
              <span>{utilizationPercentage}%</span>
              <span>
                {usedBytesConversion} / {allocatedBytesConversion}
              </span>
            </div>

            <div className="tw-w-full tw-bg-gray-200 tw-rounded-full tw-h-2.5">
              <div
                className="tw-h-2.5 tw-rounded-full"
                style={{
                  width: `${utilizationPercentage}%`,
                  ...gradientStyle,
                }}
              />
            </div>
          </div>
        );
      },
    },
    // {
    //   Header: 'META',
    //   accessor: 'meta',
    //   disableSortBy: true,
    //   Cell: ({ row: { original } }: any) => {
    //     const metaList = Object.entries(original.meta).map((item) => ({
    //       labelNames: item[0],
    //       value: item[1],
    //     }));

    //     return (
    //       <div className="tw-flex tw-gap-2">
    //         {metaList.map((item) => (
    //           <span className="tw-rounded tw-bg-gray-200 tw-px-2 tw-py-1 tw-text-[10px] tw-shrink-0">{`${item.labelNames.toLocaleUpperCase()} :  ${item.value}`}</span>
    //         ))}
    //       </div>
    //     );
    //   },
    // },
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

export function renderOptionsEmployee(item: any) {
  return `${item?.employeeName} - ${item?.employeeCode}`;
}

export function renderValueSection(selectedItem: any) {
  return `${selectedItem?.employeeName} - ${selectedItem?.employeeCode}`;
}