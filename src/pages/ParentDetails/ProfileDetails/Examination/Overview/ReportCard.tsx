import { shallowEqual } from "react-redux";
import { useAppSelector } from "../../../../../hooks/storehook";
import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { EyeIcon } from "@hugeicons-pro/core-stroke-standard";
import { generateReportCardColumns, StudentReportData } from "./helper";
import { SelectInput } from "../../../../../Components/Common";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { default as DownloadSvg } from "../../../../../assets/imagesdps/academics/NewDownload.svg?react";

const initialValues: any = {
    search: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    type: "",
    status: ""
};

interface IStudentInfo {
    studentId: number;
    branchId: number;
    instituteId: number;
    academicYearId: string;
    divId: string;
}

const ReportCard = (props: IStudentInfo) => {

    const [studentConcessionFilterState, setStudentConcessionFilterState] =
        useState<any>(initialValues);

    const {
        academicYearListResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
    }: any = useAppSelector(
        ({ instAcademics, appData, feeConcession, }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            studentConcessionList: feeConcession.studentConcessionList,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
        }),
        shallowEqual
    );

    const menuOptions = useMemo(
        () => [
            {
                id: "view",
                actionIcon: <HugeiconsIcon icon={EyeIcon} className="me-2 text-muted" size={18} />,
                actionName: "View Student Info",
            },
            {
                id: "view",
                actionIcon: <DownloadSvg className="me-2 text-muted" />,
                actionName: "View Student Info",
            },
        ],
        []
    );

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setStudentConcessionFilterState((prev: any) => ({ ...prev, [name]: value }))
    }

    const { data: academicYearList } = academicYearListResp || {};

    const roleColumns = useMemo(() => generateReportCardColumns(menuOptions), []);
    return (
        <div id={props.divId}>
            <div className="tw-rounded-lg tw-border tw-border-gray-200 tw-bg-white tw-shadow-sm tw-my-3">
                <div className="tw-p-0">
                    <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-p-3">
                        <div className="tw-col-span-12 lg:tw-col-span-6 tw-flex tw-items-center">
                            <div className="tw-flex tw-justify-center tw-items-center tw-mr-4">
                                Academic Year :
                            </div>
                            <SelectInput
                                name="academicYearId"
                                value={studentConcessionFilterState.academicYearId}
                                onChange={filterHandler}
                                menuItems={academicYearList}
                                valueKey="academicYearId"
                                textKey="academicYearName"
                                formgroupClassName="tw-mb-0"
                                defaultSelect="Academic Year"
                            />
                        </div>
                    </div>
                    <TableContainer
                        columns={roleColumns}
                        data={StudentReportData}
                        divClass="table-responsive"
                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                    />
                </div>
            </div>
        </div>
    )
}

export default ReportCard
