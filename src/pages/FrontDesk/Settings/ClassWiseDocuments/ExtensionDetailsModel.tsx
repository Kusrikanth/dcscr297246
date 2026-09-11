import React, { useState, useEffect, useMemo, useRef } from "react";
import { generateColumnsExtensionDetails } from "./helper";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { deleteClassWiseDocumentsListAct, editClassWiseListAct, getClassWiseDocumentsListByIdAct, setClassWiseDocumentsListByIdAct } from "../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import classnames from "classnames"
import { ConfirmationModal } from "../../../../Components/Common";
import { useModal } from "../../../../hooks/modalhook";
import { toast } from "react-toastify";
import Button from "../../../../Components/Common/Button";

const ExtensionDetailsModel: React.FC<any> = (props) => {
  const [classExtList, setClassExtList] = useState<Array<any>>([])
  const { closeModal:closeDelDocModal,modalState:delDocModalState,openModal:openDelDocModal } = useModal();

  const { modalData } = props;
  const dispatch = useAppDispatch();

  const {
    showApiLoader,delClassWiseDocumentsRequestResp,getClassWiseDocumentsListByIdResp,editClassWiseDocumentsResp,
  } = useAppSelector(
    ({ globalData,admissionAvailabilityRequest }) => ({
      showApiLoader: globalData.showApiLoader,
      delClassWiseDocumentsRequestResp: admissionAvailabilityRequest.delClassWiseDocumentsRequestResp,
      getClassWiseDocumentsListByIdResp: admissionAvailabilityRequest.getClassWiseDocumentsListByIdResp,
      editClassWiseDocumentsResp: admissionAvailabilityRequest.editClassWiseDocumentsResp,
    }),
    shallowEqual
  );

  const classWiseDocumentsRef = useRef({
    prevDelClassWiseDocumentsRequestResp: delClassWiseDocumentsRequestResp,
    prevGetClassWiseDocumentsListByIdResp: getClassWiseDocumentsListByIdResp,
    prevEditClassWiseDocumentsResp: editClassWiseDocumentsResp,
  });

  useEffect(() => {
    const {  prevDelClassWiseDocumentsRequestResp,prevGetClassWiseDocumentsListByIdResp,prevEditClassWiseDocumentsResp } = classWiseDocumentsRef.current;
    if (delClassWiseDocumentsRequestResp && prevDelClassWiseDocumentsRequestResp !== delClassWiseDocumentsRequestResp) {
      toast.success("Document Unassigned successfully");
      closeDelDocModal()
      assignClassWiseDocumentsList()
    }
    else if(getClassWiseDocumentsListByIdResp && prevGetClassWiseDocumentsListByIdResp !== getClassWiseDocumentsListByIdResp){
      if(Array.isArray(getClassWiseDocumentsListByIdResp?.masterDocumentsDTOS) && getClassWiseDocumentsListByIdResp?.masterDocumentsDTOS?.length > 0){    
        setClassExtList(getClassWiseDocumentsListByIdResp?.masterDocumentsDTOS?.map((item: any) => ({
          ...item,
          isRequired: item?.isRequired ? "YES" : "NO",
        })))
      }
    }
    else if(editClassWiseDocumentsResp && prevEditClassWiseDocumentsResp !== editClassWiseDocumentsResp){
      toast.success("Class Wise Documents updated successfully.");
      assignClassWiseDocumentsList()
    } 

    classWiseDocumentsRef.current.prevDelClassWiseDocumentsRequestResp = delClassWiseDocumentsRequestResp;
    classWiseDocumentsRef.current.prevGetClassWiseDocumentsListByIdResp = getClassWiseDocumentsListByIdResp;
    classWiseDocumentsRef.current.prevEditClassWiseDocumentsResp = editClassWiseDocumentsResp;

  }, [delClassWiseDocumentsRequestResp,getClassWiseDocumentsListByIdResp,editClassWiseDocumentsResp]);

  const assignClassWiseDocumentsList = () => {
    const classId = modalData?.classId;
    if (classId) {
      dispatch(
        getClassWiseDocumentsListByIdAct(
          generateActionPayload(`get_class_wise_document_list_by_id`, { id: classId })
        )
      );
    }
  };

  useEffect(() => {
    if (modalData?.classId) {
      assignClassWiseDocumentsList()
    }
    return ()=>{
      props.classWiseDocumentsList()
      dispatch(setClassWiseDocumentsListByIdAct(undefined))
    }
  }, [modalData?.classId])

  const onChangeInputHndlr = (id: number, value: string) => {

    const studentRowIndex = classExtList.findIndex((item: any) => +item.id === id);
    if (studentRowIndex > -1) {
      const studentDetails: any = classExtList[studentRowIndex];
      let updateStudentState = [...classExtList];
      updateStudentState.splice(studentRowIndex, 1, {
        ...studentDetails, isRequired: value,
      });
      setClassExtList(updateStudentState);
    }

    dispatch(editClassWiseListAct(generateActionPayload(
      "edit_class_wise_document_by_id",
      { id, isRequired: value === "YES" ? true : false },
    )));
  };

  const menuOptions = useMemo(
    () => [
      {
        id: "delete",
        actionIcon: <i className={classnames("ri-delete-bin-5-fill text-danger fs-16 me-2")}></i>,
        actionName: "Un Assign Document",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          openDelDocModal(id)
        },
      }
    ],
    [getClassWiseDocumentsListByIdResp]
  );

  const delModalSubmitHndlr = ()=>{
    dispatch(deleteClassWiseDocumentsListAct(generateActionPayload("delete_class_wise_document",{ id : delDocModalState.modalData })));
  }

  const extensionDetailsModalColumns = useMemo(() => generateColumnsExtensionDetails(menuOptions), [classExtList]);

  return (
    <>
      <div className="tw-flex tw-flex-col tw-items-center">
        {/* Top Info Section */}
        <div className="tw-w-full tw-px-4 tw-py-2">
          <div className="tw-grid tw-gap-4 tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4">

            {/* Branch */}
            <div className="tw-px-2 tw-py-1">
              <h6>
                <span className="tw-font-bold">Branch :</span>
              </h6>
              <h6>
                <span className="tw-font-bold tw-text-gray-500">{modalData?.branchName || "n/a"}</span>
              </h6>
            </div>

            {/* Curriculum */}
            <div className="tw-px-2 tw-py-1">
              <h6>
                <span className="tw-font-bold">Curriculum :</span>
              </h6>
              <h6>
                <span className="tw-font-bold tw-text-gray-500">{modalData?.curriculumName || "n/a"}</span>
              </h6>
            </div>

            {/* Class */}
            <div className="tw-px-2 tw-py-1">
              <h6>
                <span className="tw-font-bold">Class :</span>
              </h6>
              <h6>
                <span className="tw-font-bold tw-text-gray-500">{modalData?.className || "n/a"}</span>
              </h6>
            </div>

            {/* Short Name */}
            <div className="tw-px-2 tw-py-1">
              <h6>
                <span className="tw-font-bold">Short Name :</span>
              </h6>
              <h6>
                <span className="tw-font-bold tw-text-gray-500">{modalData?.shortName || "n/a"}</span>
              </h6>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="tw-w-full tw-overflow-x-auto">
          <TableContainer
            columns={extensionDetailsModalColumns}
            data={Array.isArray(classExtList) ? classExtList : []}
            onChangeInputHndlr={onChangeInputHndlr}
            rowDataInfo={showApiLoader}
            divClass="tw-overflow-x-auto"
            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
            showCheckbox={false}
          />
        </div>

        {/* Buttons Section */}
        <div className="tw-w-full tw-px-3 tw-pt-3">
          <div className="tw-flex tw-gap-2 tw-justify-end tw-mb-3">
            <Button
            variant="secondary"
              onClick={props.toggle}
            >
              Close
            </Button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        id="un-assign-document-modal"
        isOpen={delDocModalState.showModal}
        confirmMessage="Are you sure you want to un assign this document ?"
        cancelHndlr={closeDelDocModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default ExtensionDetailsModel;
