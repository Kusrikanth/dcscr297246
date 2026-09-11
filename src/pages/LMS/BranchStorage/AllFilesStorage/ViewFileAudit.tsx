
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft01Icon, UserGroup02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { shallowEqual } from "react-redux";
import Button from "../../../../Components/Common/Button";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import {getBranchStorageAuditsByFileAct, getBranchStorageAuditsByFileGroupsAct, resetBranchStorageManagementFileTypeDetailsAct, resetBranchStorageAuditsByFileAct, resetBranchStorageAuditsByFileGroupsAct} from "../../../../store/branchstorage/branchstoragemanagement/branchstoragemanagementactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { generateViewFileAuditColumns } from "./helper";
import { TextInput } from "../../../../Components/Common";
import { useFormik } from "formik";

interface IViewFileAuditProps {
    id: number | string;
    toggle?: () => void;
    fileName: string;
}

type AuditRecord = Record<string, unknown>;

const initialValues = {
    searchString: '',
};

const ViewFileAudit = ({ id, fileName }: IViewFileAuditProps) => {

    const dispatch = useAppDispatch();
    const [selectedGroupId, setSelectedGroupId] = useState<string | number | null>(null);
    const [selectedGroupName, setSelectedGroupName] = useState("");
    // const INITIAL_VISIBLE_ROWS = 8;

    // const [visibleRowsCount, setVisibleRowsCount] =
    //     useState(INITIAL_VISIBLE_ROWS);

    const branchStorageFileAuditFormik = useFormik({
        initialValues,
        onSubmit: () => { },
    });

    const {
        getBranchStorageAuditsByFileResp,
        getBranchStorageAuditsByFileGroupsResp,
    } = useAppSelector(
        ({ globalData, branchStorageManagement }) => ({
            getBranchStorageAuditsByFileResp:
                branchStorageManagement.getBranchStorageAuditsByFileResp,
            getBranchStorageAuditsByFileGroupsResp:
                branchStorageManagement.getBranchStorageAuditsByFileGroupsResp,
        }),
        shallowEqual
    );
    const handleGroupClick = useCallback((group: AuditRecord) => {
        const groupId = group.groupId ?? group.principalId ?? group.id;

        if (!groupId) return;

        setSelectedGroupId(groupId as string | number);
        setSelectedGroupName(
            String(group.groupName ?? group.principalName ?? "")
        );
    }, []);

    const auditRows = useMemo(
        () => {
            if (selectedGroupId !== null) {
                const groupAudit = getBranchStorageAuditsByFileGroupsResp as {
                    members?: AuditRecord[];
                } | undefined;

                return Array.isArray(groupAudit?.members)
                    ? groupAudit.members.map((member) => ({
                        ...member,
                        id: member.authUserId,
                        principalType: "USER",
                        principalName: member.employeeName,
                        principalCode: member.employeeCode,
                    }))
                    : [];
            }

            return Array.isArray(getBranchStorageAuditsByFileResp)
                ? getBranchStorageAuditsByFileResp
                : [];
        },
        [getBranchStorageAuditsByFileGroupsResp, getBranchStorageAuditsByFileResp, selectedGroupId]
    );

    // const visibleAuditRows = useMemo(() => {
    //     return auditRows.slice(0, visibleRowsCount);
    // }, [auditRows, visibleRowsCount]);

    // const isShowingAll = visibleRowsCount >= auditRows.length;

    // const handleViewMoreLess = () => {
    //     setVisibleRowsCount(
    //         isShowingAll ? INITIAL_VISIBLE_ROWS : auditRows.length
    //     );
    // };
    // useEffect(() => {
    //     setVisibleRowsCount(INITIAL_VISIBLE_ROWS);
    // }, [
    //     selectedGroupId,
    //     branchStorageFileAuditFormik.values.searchString,
    // ]);
    const tableColumns = useMemo(
        () => generateViewFileAuditColumns(handleGroupClick),
        [handleGroupClick]
    );
    useEffect(() => {
        if (!id) return;

        const searchString = branchStorageFileAuditFormik.values.searchString;

        if (selectedGroupId !== null) {
            dispatch(
                getBranchStorageAuditsByFileGroupsAct(
                    generateActionPayload(
                        "get_branch_storage_audits_by_file_groups",
                        {
                            fileId: id,
                            groupId: selectedGroupId,
                        },
                        {
                            searchString,
                        }
                    )
                )
            );
        } else {
            dispatch(
                getBranchStorageAuditsByFileAct(
                    generateActionPayload(
                        "get_branch_storage_audits_by_file",
                        { id },
                        {
                            searchString,
                        }
                    )
                )
            );
        }

        return () => {
            dispatch(resetBranchStorageManagementFileTypeDetailsAct(undefined));
            dispatch(resetBranchStorageAuditsByFileAct(undefined));
            dispatch(resetBranchStorageAuditsByFileGroupsAct(undefined));
        };
    }, [id, selectedGroupId, branchStorageFileAuditFormik.values.searchString]);

    return (
        <div className=" tw-p-4">
            <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-pb-4">
                <div className="tw-col-span-12">
                    <p className="tw-text-sm tw-text-gray-500 tw-mb-1">
                  File name:{" "}
                  <span
                    className="tw-font-semibold tw-text-gray-800"
                    title={fileName}
                  >
                    {fileName || "-"}
                  </span>
                </p>
                    </div>
                <div className="tw-col-span-6">
                    <div className="search-box">
                        <TextInput
                            name="searchString"
                            placeHolder="Search Group Name, Employee Name, Code ...."
                            value={branchStorageFileAuditFormik.values.searchString}
                            onChange={branchStorageFileAuditFormik.handleChange}
                            formgroupClassName="mb-0"
                        />
                        <i className="ri-search-line search-icon"></i>
                    </div>
                </div>
            </div>
            {selectedGroupId !== null && (
                <div className="tw-flex tw-items-center tw-gap-2 tw-mb-3 tw-px-4 tw-py-2.5 tw-bg-gray-50 tw-border tw-border-gray-200 tw-rounded-lg">
                    <Button
                        type="button"
                        variant="linkBtn"
                        onClick={() => {
                            setSelectedGroupId(null);
                            setSelectedGroupName("");
                        }}
                        className="!tw-flex !tw-items-center !tw-gap-1.5 !tw-border-0 !tw-bg-transparent !tw-p-0 !tw-text-primary hover:!tw-text-primary-dark"
                    >
                        <HugeiconsIcon
                            icon={ArrowLeft01Icon}
                            size={17}
                        />
                        <span className="tw-font-medium">
                            Back to file audit
                        </span>
                    </Button>

                    <span className="tw-text-gray-300">
                        /
                    </span>

                    <div className="tw-flex tw-items-center tw-gap-1.5 tw-px-2.5 tw-py-1 tw-bg-white tw-border tw-border-gray-200 tw-rounded-md">
                        <HugeiconsIcon
                            icon={UserGroup02Icon}
                            size={17}
                            className="tw-text-primary"
                        />

                        <span className="tw-text-gray-700 tw-font-semibold">
                            {selectedGroupName}
                        </span>
                    </div>
                </div>
            )}
            <div className="tw-overflow-hidden">
                <TableContainer
                    columns={tableColumns}
                    data={auditRows}
                    divClass="table-responsive tw-border tw-rounded-lg tw-shadow tw-mb-6 max-h-400px"
                    theadClass="table-light text-muted align-middle position-sticky top-0"
                    showPagination={false}
                />
            </div>
            {/* {auditRows.length > INITIAL_VISIBLE_ROWS && (
                <Button
                    type="button"
                    variant="sidebarMenu"
                    onClick={handleViewMoreLess}
                    className="!tw-mt-0 !tw-ml-1 tw-border-0 tw-bg-transparent tw-p-0 !tw-text-[14.5px] tw-font-semibold tw-text-indigo-500 hover:tw-text-indigo-700"
                >
                    {isShowingAll ? "View less" : "View more"}
                </Button>
            )} */}
        </div>
    );
};

export default ViewFileAudit;
