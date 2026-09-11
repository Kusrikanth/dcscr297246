import React from "react";
import { UserDetails, Switch } from "../../../Components/Common";

interface IModuleInfo {
    id: string,
    // eslint-disable-next-line no-restricted-globals
    moduleName: string
}
export interface IModuleTableData {
    id: number,
    branchName: string,
    branchId: string,
    branchType: string,
    branchLocation: string,
    modules: Array<IModuleInfo>
}

export function generateColumns(masterModules: any[], updateBranchModuleHndlr: any) {
    return ([
        {
            Header: "Branch Name",
            Cell: ({ row: { original } }: any) => {
                return (
                    <UserDetails
                        displayId={original.code || "N/A"}
                        displayName={original.branchName || "N/A"}
                    />
                );
            },
        },
        {
            Header: "Modules",
            accessor: "branchModulesId",
            Cell: ({ row }: any) => {
                const { index, original } = row, { branchId, branchModulesId } = original || {};
                function moduleHandler(event: any) {
                    updateBranchModuleHndlr(event, branchId);
                }
                return (
                    <div className="d-flex flex-wrap">
                        {Array.isArray(masterModules) && masterModules.map((item: any) => (
                            <div className="w-30" key={item.id}>
                                <Switch
                                    attributeId={`${item.name}-${index}-checkbox`}
                                    labelName={item.name}
                                    dataId={item.id}
                                    checked={Array.isArray(branchModulesId) && branchModulesId.includes(item.id)}
                                    onChangeHndlr={moduleHandler}
                                    className="form-switch-sm form-check-right w-70  mb-3"
                                />
                            </div>))}
                    </div>
                )
            }
        },
    ])
}


export const branchData: Array<IModuleTableData> = [
    {
        id: 1,
        branchName: "Nacharam",
        branchId: "INS00001",
        branchType: "High School",
        branchLocation: "Nacharam",
        modules: [
            { id: "Academics", moduleName: "Academics" },
            { id: "Front Desk", moduleName: "Front Desk" },
            { id: "Directory", moduleName: "Directory" },
            { id: "Usermanagment", moduleName: "Usermanagment" },
            { id: "Transportation", moduleName: "Transportation" },
            { id: "Fee Management", moduleName: "Fee Management" },
            { id: "Examination", moduleName: "Examination" },
            { id: "HRMs", moduleName: "HRMs" },
            { id: "Helpdesk", moduleName: "Helpdesk" },
            { id: "Settings", moduleName: "Settings" }
        ]
    }, {
        id: 2,
        branchName: "Nadergul",
        branchId: "INS00002",
        branchType: "High School",
        branchLocation: "Nadergul",
        modules: [
            { id: "Academics", moduleName: "Academics" },
            { id: "Front Desk", moduleName: "Front Desk" },
            { id: "Directory", moduleName: "Directory" },
            { id: "Usermanagment", moduleName: "Usermanagment" },
            { id: "Transportation", moduleName: "Transportation" },
            { id: "Fee Management", moduleName: "Fee Management" },
            { id: "Examination", moduleName: "Examination" },
            { id: "HRMs", moduleName: "HRMs" },
            { id: "Helpdesk", moduleName: "Helpdesk" },
            { id: "Settings", moduleName: "Settings" }
        ]
    }
]