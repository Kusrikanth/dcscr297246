import React, { useState, useEffect, useMemo, useCallback } from "react";
import { generateColumnsAssignDocuments } from "./helper";
import TableContainer from "../../../../Components/Common/TableContainer";
import { getUnassignClassWiseDocumentsListAct, saveClassWiseDocumentsListAct, setUnassignClassWiseDocumentsListAct } from "../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { toast } from "react-toastify";
import Button from "../../../../Components/Common/Button";

const AssignDocumentModel: React.FC<any> = (props) => {

  const [assignDocList, setAssignDocList] = useState<Array<any>>([])
  const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);

  const dispatch = useAppDispatch();
  const { modalData } = props;

  const unassignClassWiseDocumentsList = () => {
    const classId = modalData?.classId;
    if (classId) {
      dispatch(
        getUnassignClassWiseDocumentsListAct(
          generateActionPayload(`get_unassign_doc_class_list`, { classId: classId })
        )
      );
    }
  };

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getUnassignClassWiseDocumentsListResp,
  } = useAppSelector(
    ({ admissionAvailabilityRequest, appData, globalData, instAcademics, branchAcademics }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      getUnassignClassWiseDocumentsListResp: admissionAvailabilityRequest.getUnassignClassWiseDocumentsListResp,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (modalData?.classId) {
      unassignClassWiseDocumentsList();
    }
    return () => {
      dispatch(setUnassignClassWiseDocumentsListAct(undefined))
    }
  }, [modalData?.classId]);

  useEffect(() => {
    if (Array.isArray(getUnassignClassWiseDocumentsListResp) && getUnassignClassWiseDocumentsListResp.length > 0) {
      setAssignDocList(getUnassignClassWiseDocumentsListResp.map((i:any)=>({...i,isSelected:false})))
    }
  }, [getUnassignClassWiseDocumentsListResp])

  const onChangeInputHndlr = (id: number, value: any) => {
    const studentRowIndex = assignDocList.findIndex((item: any) => +item.id === id);
    if (studentRowIndex > -1) {
        const studentDetails: any = assignDocList[studentRowIndex];
        let updateStudentState = [...assignDocList];
        updateStudentState.splice(studentRowIndex, 1, {
            ...studentDetails, isRequired: value,
        });
        setAssignDocList(updateStudentState);
    }
  }

  const singleStudentCheckHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget,
      id = event.currentTarget.getAttribute("data-id"),
      studentRowIndex = assignDocList.findIndex((item: any) => +item.id === Number(id));
    if (studentRowIndex > -1) {
      const studentDetails: any = assignDocList[studentRowIndex];
      let updateStudentState: any = [...assignDocList];
      updateStudentState.splice(studentRowIndex, 1, {
        ...studentDetails, isSelected: checked , isRequired: checked ? "NO" : "",
      });
      setAssignDocList(updateStudentState);
      const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
      setAllStudentSelectedState(isAllSelected);
    }
  }, [assignDocList]);

  const allStudentCheckHndlr = useCallback((event: any) => {
    const { checked } = event.target;
    setAllStudentSelectedState(checked);
    let updateStudentState = [...assignDocList];
    updateStudentState.forEach((item: any) => {
        item.isSelected = checked;
        item.isRequired = checked ? "NO" : "";
    });
    setAssignDocList(updateStudentState);
}, [assignDocList]);

  const submitHndler = ()=>{
    if(!assignDocList.some((i:any)=>i?.isSelected)){
      toast.warning("Please select atleast one document");
    }else{
      const payload = {
        classId : modalData?.classId,
        assignDocuments : assignDocList.filter((i:any)=>i?.isSelected).map((item:any)=>({
          documentId : item?.id,
          isRequired : item?.isRequired === "YES" ? true : false 
        }))
      }
      dispatch(
        saveClassWiseDocumentsListAct(
          generateActionPayload(`save_class_wise_document_list`, undefined , payload)
        )
      );
    }
  }

  const assignDocumentModelColumns = useMemo(() => generateColumnsAssignDocuments(allStudentCheckHndlr, singleStudentCheckHndlr, allStudentSelectedState), [assignDocList]);

  return (
    <>
      <div className="tw-flex tw-flex-col tw-items-center">
        <div className="tw-w-full tw-px-4 tw-py-2">

          {/* Top Info Rows */}
          <div className="tw-grid tw-gap-4 tw-grid-cols-1 lg:tw-grid-cols-2">

            {/* Branch */}
            <div className="tw-px-2 tw-py-1">
              <div className="tw-grid tw-grid-cols-2 tw-gap-2">
                <h6>
                  <span className="tw-font-bold">Branch :</span>
                </h6>
                <h6>
                  <span className="tw-font-bold tw-text-gray-500">{modalData?.branchName || "n/a"}</span>
                </h6>
              </div>
            </div>

            {/* Curriculum */}
            <div className="tw-px-2 tw-py-1">
              <div className="tw-grid tw-grid-cols-2 tw-gap-2">
                <h6>
                  <span className="tw-font-bold">Curriculum :</span>
                </h6>
                <h6>
                  <span className="tw-font-bold tw-text-gray-500">{modalData?.curriculumName || "n/a"}</span>
                </h6>
              </div>
            </div>

            {/* Class */}
            <div className="tw-px-2 tw-py-1">
              <div className="tw-grid tw-grid-cols-2 tw-gap-2">
                <h6>
                  <span className="tw-font-bold">Class :</span>
                </h6>
                <h6>
                  <span className="tw-font-bold tw-text-gray-500">{modalData?.className || "n/a"}</span>
                </h6>
              </div>
            </div>

            {/* Short Name */}
            <div className="tw-px-2 tw-py-1">
              <div className="tw-grid tw-grid-cols-2 tw-gap-2">
                <h6>
                  <span className="tw-font-bold">Short Name :</span>
                </h6>
                <h6>
                  <span className="tw-font-bold tw-text-gray-500">{modalData?.shortName || "n/a"}</span>
                </h6>
              </div>
            </div>

          </div>
        </div>

        {/* Table */}
        <div className="tw-w-full tw-overflow-x-auto">
          <TableContainer
            columns={assignDocumentModelColumns}
            data={Array.isArray(assignDocList) ? assignDocList : []}
            onChangeInputHndlr={onChangeInputHndlr}
            divClass="tw-overflow-x-auto"
            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
            showCheckbox={false}
          />
        </div>

        {/* Buttons */}
        <div className="tw-w-full">
          <div className="tw-grid tw-gap-3 tw-px-3 tw-pt-3">
            <div className="tw-flex tw-gap-2 tw-justify-end tw-mb-3">
              <Button
              variant="secondary"
                onClick={props.toggle}
                disabled={showApiLoader}
              >
                Close
              </Button>
              <Button
              variant="primary"
                disabled={showApiLoader}
                onClick={submitHndler}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignDocumentModel;
