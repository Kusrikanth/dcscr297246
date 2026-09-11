import React, { useEffect, useMemo } from "react";
import {  StatusLabel } from "../../../Components/Common";
import { shallowEqual, useDispatch } from "react-redux";
import { getTcApprovalStatus } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppSelector } from "../../../hooks/storehook";

const ApprovalStatusModal = (props: any) => {
    const dispatch = useDispatch();

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, tcApprovalStatusList }: any =
        useAppSelector(
            ({ appData, classroomManagmentInfo }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                tcApprovalStatusList: classroomManagmentInfo.tcApprovalStatusList,
            }),
            shallowEqual
        );

    useEffect(() => {
        if (props.tcId&&props.isOpen) {
            dispatch(getTcApprovalStatus(generateActionPayload('tc_approval_list', { tcRequestId: props.tcId })))
        }
    }, [props.isOpen])
    return (
        <>
           
            <div className="tw-flex tw-flex-col tw-items-center" style={{ padding: "0 1.25rem" }}>
                <table className="tw-w-full">
                    <thead>
                        <tr>
                            <th className="tw-pt-3 tw-text-[16px] tw-text-left">
                                Department
                            </th>
                            <th className="tw-pt-3 tw-text-[16px] tw-text-right">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tcApprovalStatusList && tcApprovalStatusList.data.map((status: any, index: number) => (
                            <tr key={index}>
                                <td className="tw-py-3 tw-text-[14px]">
                                    {status.departmentName}
                                </td>
                                <td className="tw-py-3 tw-text-right tw-text-[14px]">
                                    <StatusLabel type={status.status} labelName={status.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

           
        </>
    );
};

export default ApprovalStatusModal;
