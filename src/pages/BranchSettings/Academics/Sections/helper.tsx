import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { MenuOptionHrtl } from "../../../../Components/Common";

interface ISectionData {
    id: string,
    sectionName: string,
}

interface IAcademicTermTableData {
    id: number,
    className: string,
    sections: Array<ISectionData>,
}

function getSectionsLabel(options: (Array<any> | null)) {
    if (Array.isArray(options) && options.length > 0) {
        return (
            <div className="tw-flex tw-flex-wrap tw-gap-1">
                {options.map((item) => {
                    return (
                        <span
                            key={item.sectionId}
                            className="tw-inline-flex tw-items-center tw-px-2 tw-py-1 tw-text-xs tw-font-medium tw-rounded-md tw-bg-blue-50 tw-text-blue-700"
                        >
                            {item.sectionName}
                        </span>
                    );
                })}
            </div>
        )
    } else {
        return (<span className="tw-text-info text">N/A</span>)
    }
}

function getMenuOptionBySectionCount(sectionLength: any, menuOptions: Array<any>) {
    switch (sectionLength) {
        case 0:
            return menuOptions.filter(item => (item.id === "add"));
        default:
            return menuOptions;
    }
}

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Class",
            accessor: "branchClassName",
        },
        {
            Header: "Sections",
            accessor: "sectionsResponse",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return (
                    getSectionsLabel(value)
                );
            },
        },
        {
            Header: "Actions",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const sectionCount = original?.sectionsResponse?.length || 0;
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original?.branchClassId} />
                );
            },
        },
    ])
}
