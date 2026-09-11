import React, { useMemo, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap'
import { useAppSelector } from '../../../../hooks/storehook';
import { getUpdatedMonthDateFormat } from '../../../../utility/dateutility';

// import ConfirmationModal from '../ConfirmationModal';

const fontColor = (action: any) => {
    let act = action && action.toLowerCase();
    switch (act) {
        case "yet to prepare":
        case "on_hold":
            return "#F7B84B"
        case "prepared":
        case "approved":
            return "#0AB39C"
        case "issued":
            return "#299CDB"
    }
}

const titleForStatus = (status:any)=>{
    switch (status?.toLowerCase()) {
        case "on_hold":
          return "On Hold"
        case "accepted":
          return "Accepted"
        case "rejected":
          return "Rejected"
        case "document_resubmission_pending":
          return "Doc Resubmission Pending"
        case "document_approval_pending":
          return "Doc Approval Pending"
        case "document_approved":
          return "Document Approved"
        case "profile_approval_on_hold":
          return "Profile Approval On Hold"
        case "document_resubmitted":
          return "Doc Resubmitted"
        case "profile_approval_pending":
          return "Profile Approval Pending"
        case "profile_approved":
          return "Profile Approved"
        case "head_dept_approval_pending":
          return "Scrutiny Pending"
        case "head_dept_approval_rejected":
          return "Scrutiny Rejected"
        default:
          return "Doc Pending"
      }
}

const PopOver = (props: any) => {
    const dispatch = useDispatch();
    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, tcReqLogRes, preliminaryScrutinyById }: any =
        useAppSelector(
            ({ appData, instAcademics, branchAcademics, classroomManagmentInfo, applicationSale, }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                tcReqLogRes: classroomManagmentInfo.tcReqLogRes,
                preliminaryScrutinyById: applicationSale.preliminaryScrutinyById,
            }),
            shallowEqual
        );
    return (<>
        <div>
            <Popover
                flip
                target={`testing-${props.index}`}
                toggle={props.toggle}
                isOpen={props.popOver}
            >
                <PopoverHeader>

                </PopoverHeader>
                <PopoverBody className='tw-p-0'>
       
                    <table>
                        <tr className='bg-light'>
                            <th className='tw-p-2'>Application Status</th>
                            <th className='tw-p-2'>{titleForStatus(preliminaryScrutinyById?.scrutinyStatus)}</th>
                        </tr>
                        <tr>
                            <td className='tw-p-2 tw-flex tw-relative'> <span style={{ color: "white", background: "#0AB39C", height: "20px", width: "20px", borderRadius: "100%", display: "flex", justifyContent: "center", marginRight: "10px" }}>✔</span> Registration Date :</td><div style={{ transform: "rotate(90deg)", position: "absolute", top: "94px" }}>- - - - -</div>
                            <td className='tw-p-2'>{getUpdatedMonthDateFormat(new Date())}</td>
                        </tr>

                        <tr>
                            <td className='tw-p-2 tw-flex tw-relative'>
                                {preliminaryScrutinyById?.documentApproveStatus?.toLowerCase() === "approved" ? <span style={{ color: "white", background: "#0AB39C", height: "20px", width: "20px", borderRadius: "100%", display: "flex", justifyContent: "center", marginRight: "10px" }}>✔</span> : <span style={{ background: "#9599AD", height: "20px", width: "20px", borderRadius: "100%", marginRight: "10px" }}></span>}
                                Document Approval :</td>
                            {preliminaryScrutinyById?.documentApproveStatus?.toLowerCase() === "approved" && <div style={{ transform: "rotate(90deg)", position: "absolute", top: "150px" }}>- - - - -</div>}
                            <td className='tw-p-2' style={{ color: `${preliminaryScrutinyById?.documentApproveStatus?.toLowerCase() === "approved" ? "#0AB39C" : "#F7B84B"}` }}>{preliminaryScrutinyById?.documentApproveStatus ? preliminaryScrutinyById?.documentApproveStatus : "Pending"}</td>
                        </tr>

                        <tr>
                            <td className='tw-p-2 tw-flex tw-relative'>
                            {preliminaryScrutinyById?.academicsApproveStatus?.toLowerCase() === "approved" ? <span style={{ color: "white", background: "#0AB39C", height: "20px", width: "20px", borderRadius: "100%", display: "flex", justifyContent: "center", marginRight: "10px" }}>✔</span> : <span style={{ background: "#9599AD", height: "20px", width: "20px", borderRadius: "100%", marginRight: "10px" }}></span>}
                                Profile Approval :</td>
                               {preliminaryScrutinyById?.academicsApproveStatus?.toLowerCase() === "approved" && <div style={{ transform: "rotate(90deg)", position: "absolute", top: "210px" }}>- - - - -</div>}
                            <td className='tw-p-2' style={{ color: `${preliminaryScrutinyById?.academicsApproveStatus?.toLowerCase() === "approved" ? "#0AB39C" : "#F7B84B"}` }}>{preliminaryScrutinyById?.academicsApproveStatus ? preliminaryScrutinyById?.academicsApproveStatus : "Pending"}</td>
                        </tr>

                        <tr>
                            <td className='tw-p-2 tw-flex tw-relative'>
                            {preliminaryScrutinyById?.headDeptApproveStatus?.toLowerCase() === "approved" ? <span style={{ color: "white", background: "#0AB39C", height: "20px", width: "20px", borderRadius: "100%", display: "flex", justifyContent: "center", marginRight: "10px" }}>✔</span> : <span style={{ background: "#9599AD", height: "20px", width: "20px", borderRadius: "100%", marginRight: "10px" }}></span>}
                                Scrutiny Approved :</td>
                            <td className='tw-p-2' style={{ color: `${preliminaryScrutinyById?.headDeptApproveStatus?.toLowerCase() === "approved" ? "#0AB39C" : "#F7B84B"}` }}>{preliminaryScrutinyById?.headDeptApproveStatus ? preliminaryScrutinyById?.headDeptApproveStatus : "Pending"}</td>
                        </tr>
                       
                    </table>
                </PopoverBody>
            </Popover>

        </div>

    </>
    )
}

export default PopOver
