import React, { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap'
import { generateActionPayload } from '../../../utility/reduxutility';
import { parentCollectedStatus } from '../../../store/academic/classroomManagment/classroommanagmentactions';
import ConfirmationModal from './ConfirmationModal';
import { ModalContainerUpdated } from '../../../Components/Common';

const fontColor=(action:any)=>{
    let act=action&&action.toLowerCase();
    switch(act){
        case "yet to prepare":
        case "pending":
            return "#F7B84B"
        case "prepared":
        case "approved":
            return "#0AB39C"
        case "issued":
            return "#299CDB"
    }
}

const PopOver = (props: any) => {
    const dispatch=useDispatch();
    const [updateCollectionStatus, setUpdateCollectionStatus] =
    useState<any>({
      showModal: false,
    });
    const certificateCollectedHandler=(event:any)=>{
        const params={tcRequestId:props.id,request:"Yes"}
        const payload={request:"Yes"}
        dispatch(parentCollectedStatus(generateActionPayload('parent_collected_status',{...params,...payload})))
    }
    const certificateNotCollectedHandler=(event:any)=>{
        const params={tcRequestId:props.id}
        const payload={request:"No"}
        dispatch(parentCollectedStatus(generateActionPayload('parent_collected_status',{...params,...payload})))
    }
    const toggleUpdateCollectionStatusModal = () => {
        setUpdateCollectionStatus((prevState:any) => ({
          ...prevState,
          showModal: !prevState.showModal,
        }));
      };

    return (<>
        <div>
            <Popover
                flip
                target={`testing-${props.id}`}
                toggle={props.toggle}
                isOpen={props.popOver}
            >
                <PopoverHeader>

                </PopoverHeader>
                <PopoverBody className='tw-p-0'>
                    <table>
                        <tr className='tw-bg-gray-400'>
                            <th className='tw-p-2'>TC Status</th>
                            <th className='tw-p-2' style={{color:fontColor(props?.data?.tcRequestStatus)}}>{props?.data?.tcRequestStatus}</th>
                        </tr>


                        <tr>
                            <td className='tw-p-2'>TC Application Date :</td>
                            <td className='tw-p-2'>{props?.data?.tcApplicationDate}</td>
                        </tr>

                        <tr>
                            <td className='tw-p-2'>Department Approval :</td>
                            <td className='tw-p-2' style={{color:fontColor(props?.data?.departmentApprovalStatus)}}>{props?.data?.departmentApprovalStatus}</td>
                        </tr>

                        <tr>
                            <td className='tw-p-2'>Tc Preparation Status :</td>
                            <td className='tw-p-2' style={{color:fontColor(props?.data?.tcPreparationStatus)}}>{props?.data?.tcPreparationStatus}</td>
                        </tr>

                        <tr>
                            <td className='tw-p-2'>Tc Issuance Date :</td>
                            <td className='tw-p-2' style={{color:fontColor(props?.data?.tcIssuanceDate)}}>{props?.data?.tcIssuanceDate}</td>
                        </tr>
                        <tr>
                            <td className='tw-p-2'>Parent Collected :</td>
                            {props?.data?.tcRequestStatus==="Issued"?<td className={'tw-p-2 tw-text-info tw-underline tw-cursor-pointer'} onClick={toggleUpdateCollectionStatusModal}>Update here</td>:<td className='tw-p-2'>{props?.data?.parentCollectedStatus}</td>}
                        </tr>
                    </table>
                </PopoverBody>
            </Popover>
            
        </div>
        <ModalContainerUpdated
          id="sms-confirmation-modal"
          isOpen={updateCollectionStatus.showModal}
          toggle={toggleUpdateCollectionStatusModal}
          modalTitle=""
          modalSize="md"
            >

        <ConfirmationModal
        isOpen={updateCollectionStatus.showModal}
        toggle={toggleUpdateCollectionStatusModal}
        modalTitle=""
        instituteId={"1"}
        instituteName={""}
        branchId={""}
        editBranchDetails={""}
        submitTitle={"Collected"}
        cancleTitle={"Not Collected"}
        submitHandler={certificateCollectedHandler}
        cancelHandler={certificateNotCollectedHandler}
        confirmationMessage={"Are you sure you want to update the certificate collection status !!"}
      />
                </ModalContainerUpdated>
        </>
    )
}

export default PopOver
