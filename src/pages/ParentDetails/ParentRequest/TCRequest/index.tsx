import React, { useState, useMemo, useEffect, useRef } from "react";

import {
  generateColumns
} from "./helper";

import { default as PrintSvg } from "../../../../assets/imagesdps/academics/PrintSvg.svg?react";
import { shallowEqual, useDispatch } from "react-redux";

import { toast } from "react-toastify";
import { TransferCertificateFilterhProps } from "../../../NewAcademics/TransferCertificate/transferCertificateTypes";
import { useAppSelector } from "../../../../hooks/storehook";
import { getTcRequestList } from "../../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { sanitizeUrlParams } from "../../../../utility/commonutility";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import PreviewTcRequest from "../../../NewAcademics/TransferCertificate/PreviewTcRequest";
import OfflineTransferCertificateModal from "../../../NewAcademics/TransferCertificate/OfflineTransferCertificateModal";
import BonafideCumStudyCertiModal from "../../../NewAcademics/TransferCertificate/BonafideCumStudyCertiModal";
import { getParentChildrensAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import Button from "../../../../Components/Common/Button";


const initialValues = {
  branchId: "",
  search: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
};

const TCRequest = () => {
  const dispatch = useDispatch();
  const [currentStudent, setCurrentStudent] = useState<any>(null);
  const [transferCertificateFilterState, setTransferCertificateFilterState] =
    useState(initialValues);

  const { academicYearListResp, tcRequestList, addTcReqRes, classroomManagmentErrorResp, parentChildrensResp, currentStudentId }: any =
    useAppSelector(
      ({ appData, instAcademics, classroomManagmentInfo, directoryStudent }) => ({
        loginUserDetailsResp: appData.loginUserDetailsResp,
        academicYearListResp: instAcademics.academicYearListResp,
        tcRequestList: classroomManagmentInfo.tcRequestList,
        addTcReqRes: classroomManagmentInfo.addTcReqRes,
        classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
        parentChildrensResp: directoryStudent.parentChildrensResp,
        currentStudentId: appData.currentStudentId,
      }),
      shallowEqual
    );

  const paginationFilter = useRef({
    pageNo: 0,
    pageSize: 10
  })

  const [
    offlineTransferCertificateModalState,
    setOfflineTransferCertificateModalState,
  ] = useState<any>({
    showModal: false,
    tcId: undefined,
  });

  const [previewTcModalState, setPreviewTcModalState] =
    useState<any>({
      showModal: false,
      tcId: "",
    });

  const getTcRequestListResponse = (otherProps?: any) => {
    let params = { ...transferCertificateFilterState, ...paginationFilter.current, ...otherProps };
    dispatch(getTcRequestList(generateActionPayload('tc_request_list', undefined, sanitizeUrlParams(params))))
  }

  const toggleOfflineTransferCertificateModal = (tcId?: any, apiCall?: any) => {

    if (typeof (apiCall) === "boolean" && apiCall) {
      getTcRequestListResponse();
    }
    setOfflineTransferCertificateModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      tcId: tcId
    }));
  };


  const togglePreviewCertiModal = (tcId?: any, apiCall?: any) => {
    if (typeof (apiCall) === "boolean" && apiCall) {
      getTcRequestListResponse();
    }
    setPreviewTcModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      tcId: tcId
    }));
  };

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationFilter.current = paginationInfo;
    getTcRequestListResponse(paginationInfo);
  }

  const menuOptions = useMemo(
    () => [
      {
        id: "print-tc",
        actionIcon: <PrintSvg className="me-2 d-inline-block" stroke="#707070" />,
        actionName: "Print TC",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
          togglePreviewCertiModal(id);
        },
      }
    ], [tcRequestList]);

  const transferCertificateIssuanceRef = useRef<any>({
    prevAddTcReqRes: addTcReqRes,
    prevClassroomManagmentErrorResp: classroomManagmentErrorResp
  })

  useEffect(() => {
    const { prevAddTcReqRes, prevClassroomManagmentErrorResp } = transferCertificateIssuanceRef.current;
    if (addTcReqRes && addTcReqRes !== prevAddTcReqRes) {
      toast.success('TC Request Added Successfully');
      toggleOfflineTransferCertificateModal(undefined, true);
    }
    else if (classroomManagmentErrorResp && classroomManagmentErrorResp !== prevClassroomManagmentErrorResp) {
      const { details } = classroomManagmentErrorResp || {};
      toast.error(details)
    }

    transferCertificateIssuanceRef.current.prevAddTcReqRes = addTcReqRes;
    transferCertificateIssuanceRef.current.prevClassroomManagmentErrorResp = classroomManagmentErrorResp;
  }, [addTcReqRes, classroomManagmentErrorResp])

  useEffect(() => {
    if (parentChildrensResp) {
      parentChildrensResp?.map((item: any) => {
        if (+item?.childId === +currentStudentId) {
          setCurrentStudent(item);
          getTcRequestListResponse({
            branchId: item?.childBranchId,
            academicYearId: item?.academicYearId, curriculumId: item?.curriculumId, classId: item?.classId,
            search: item?.childCode || ""
          })
          const payload = { instituteId: item?.instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
          dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
          setTransferCertificateFilterState((prev: any) => ({
            ...prev,
            branchId: item?.childBranchId,
            academicYearId: item?.academicYearId, curriculumId: item?.curriculumId,
            classId: item?.classId, search: item?.childCode || ""
          }))
        }
      })
    }
  }, [parentChildrensResp])

  const canApplyTc = useMemo(() => {
    const { data } = tcRequestList || {};
    if (!Array.isArray(data)) {
      return false;
    }
    return !data.length || data.every(item => item?.tcRequestStatus?.toLowerCase() === "cancelled");
  }, [tcRequestList]);

  const { data: TcRequestList, totalElements, totalPages, pageNumber } = tcRequestList || {};
  const roleColumns = useMemo(() => generateColumns(menuOptions), [tcRequestList]);
  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Transfer Certificate" pageTitle="Request" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow">

            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center tw-w-full">

                <div className="tw-flex-1">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    TC Request
                  </h4>
                </div>

                {canApplyTc && (
                  <div className="tw-ml-auto">
                    <Button
                    variant="primary"
                      onClick={() =>
                        toggleOfflineTransferCertificateModal(undefined, undefined)
                      }
                    >
                      <i className="ri-add-line tw-mr-2" />
                      Add Request
                    </Button>
                  </div>
                )}

              </div>
            </div>

            <div className="tw-p-0">
              <TableContainer
                columns={roleColumns}
                data={TcRequestList || []}
                divClass="table-responsive tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
              />
            </div>
          </div>
        </div>
      </div>

      <ModalContainerUpdated
        id="offline-preview-certificate-modal"
        isOpen={previewTcModalState.showModal}
        toggle={() => togglePreviewCertiModal(undefined, undefined)}
        modalTitle="Preview Certificate"
        modalSize="lg"
      >
        <PreviewTcRequest
          isOpen={previewTcModalState.showModal}
          toggle={togglePreviewCertiModal}
          modalTitle="Preview Certificate"
          instituteId={currentStudent?.instituteId}
          instituteName={""}
          branchId={currentStudent?.childBranchId}
          editBranchDetails={""}
          tcId={previewTcModalState.tcId}
          digitalSigned={true}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="offline-transfer-certificate-modal"
        isOpen={offlineTransferCertificateModalState.showModal}
        toggle={() => toggleOfflineTransferCertificateModal(undefined, undefined)}
        modalTitle="Offline Transfer Certificate Request"
        modalSize="lg"
      >
        <OfflineTransferCertificateModal
          isOpen={offlineTransferCertificateModalState.showModal}
          toggle={toggleOfflineTransferCertificateModal}
          modalTitle="Offline Transfer Certificate Request"
          instituteId={currentStudent?.instituteId}
          currentStudent={currentStudent}
          instituteName={"Offline Transfer Certificate Request"}
          branchId={currentStudent?.childBranchId}
          academicYearId={currentStudent?.academicYearId}
          editBranchDetails={""}
          requestType="ONLINE"
        />
      </ModalContainerUpdated>


    </>
  );
};

export default TCRequest;
