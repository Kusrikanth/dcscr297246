import { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { shallowEqual } from "react-redux";
import { id } from "date-fns/locale";
import { useModal } from "../../../hooks/modalhook";
import AddIdCard from "./AddIdCard";
import { useFilterState } from "../../../hooks/filterhook";
import { generateActionPayload } from "../../../utility/reduxutility";
import { studentsIdCardAct } from "../../../store/academic/languages/languagesactions";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { default as ApproveSvg } from "../../../assets/imagesdps/academics/ApproveSvg.svg?react";
import { default as CrossSvg } from "../../../assets/imagesdps/academics/CrossSvg.svg?react";
import { generateColumns, idCardStatusType } from "./helper";
import { useHistory, useLocation } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { IdentityCardIcon, ImageUploadIcon, PropertyViewIcon } from "@hugeicons-pro/core-stroke-standard";
import PreviewIdCard from "./PreviewIdCard";
import Button from "../../../Components/Common/Button";
import ReuploadStudentImage from "./ReuploadStudentImage";
import { toast } from "react-toastify";
import { resetDownloadStudentIdCardZipAct } from "../../../store/academic/notreportingstudents/notreportingstudentsslice";


const StudentIdCard = () => {
  const dispatch = useAppDispatch()
  const history = useHistory();
  const { pathname } = useLocation();
  const pagination: any = useRef({
    pageNo: 0,
    pageSize: 10
  })
  const { modalState: previewModalState, closeModal: closePreviewModalHndlr,
    openModal: openPreviewModalHndlr
  } = useModal();
    const { closeModal: closeReuploadStudentImageModel, modalState: reuploadStudentImageModelState, openModal: openReuploadStudentImageModel } = useModal();

  const { showApiLoader,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    currentStudentId, parentChildrensResp, studentsIdcardResp, requestReuploadIdCardResp, notReportingStuErrResp} =
    useAppSelector(({ appData, globalData, masterData, directoryStudent, languagesInfo, instAcademics, branchAcademics, notReportingStu }) => ({
      showApiLoader: globalData.showApiLoader,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentStudentId: appData.currentStudentId,
      parentChildrensResp: directoryStudent.parentChildrensResp,
      studentsIdcardResp: languagesInfo.studentsIdcardResp,
      requestReuploadIdCardResp: notReportingStu.requestReuploadIdCardResp,
      notReportingStuErrResp: notReportingStu.notReportingStuErrResp,
    }), shallowEqual);

    const stuIdCardRef = useRef({
        prevRequestReuploadIdCardRespResp: requestReuploadIdCardResp,
        prevNotReportingStuErrResp: notReportingStuErrResp,
    });

    useEffect(() => {

        const { prevRequestReuploadIdCardRespResp, prevNotReportingStuErrResp } = stuIdCardRef.current;
        if (notReportingStuErrResp && notReportingStuErrResp !== prevNotReportingStuErrResp) {
            const { details } = notReportingStuErrResp || {};
            toast.error(details || "Something went wrong");
        }
        else if (requestReuploadIdCardResp && prevRequestReuploadIdCardRespResp !== requestReuploadIdCardResp) {
            dispatch(resetDownloadStudentIdCardZipAct(undefined));
            toast.success("Successfully Updated");
            closeReuploadStudentImageModel();
            stuIdCardListApi();
        }
        stuIdCardRef.current.prevRequestReuploadIdCardRespResp = requestReuploadIdCardResp;
        stuIdCardRef.current.prevNotReportingStuErrResp = notReportingStuErrResp;
    }, [requestReuploadIdCardResp, notReportingStuErrResp ]);

  const selectedChild = useMemo(() => {
    if (Array.isArray(parentChildrensResp) && parentChildrensResp.length > 0) {
      return parentChildrensResp.find(item => item.childId?.toString() === currentStudentId?.toString());
    }
    return {};
  }, [parentChildrensResp, currentStudentId]);

  const stuIdCardListApi = (otherProps?: any) => {

    let payload = {
      branchId,
      academicYearId: selectedChild?.academicYearId,
      searchString: selectedChild?.childCode,
      ...pagination.current,
      ...otherProps,
    };
    if (payload.academicYearId && payload.searchString) {
      dispatch(studentsIdCardAct(generateActionPayload('get_students_idcard', undefined, payload)))
    }
  }

  useEffect(() => {
    if (selectedChild) {
      stuIdCardListApi()
    }
  }, [selectedChild])


  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    stuIdCardListApi(paginationInfo)
  }
  const moveToAddCard = (event: any) => {
    event.preventDefault()
    history.push(`${pathname}/add-card`, {
      pathName: pathname
    })
  }
  const selectedStatus = previewModalState.modalData?.idCardStatus;

  const actionDisplayName = useMemo(() => {
    const hasPaymentPending = studentsIdcardResp?.data?.some(
      (item: any) => item.idCardStatus === "PAYMENT_PENDING"
    );

    return hasPaymentPending ? "Preview Id Card" : "Prepare Id Card";
  }, [studentsIdcardResp]);

  const menuOptions = useMemo(
    () => ([
      {
        id: "prepare-id-card",
        actionIcon: <HugeiconsIcon icon={IdentityCardIcon} className="text-muted" size={18} />,
        actionName: actionDisplayName,
        onClickHndlr: (event: any) => {
          const idCardNo = event.currentTarget.getAttribute("data-id");
          if (idCardNo) {
            openPreviewModalHndlr(idCardNo);
          }
        },
      },
      {
        id: "reupload-student-image",
        actionIcon: <HugeiconsIcon icon={ImageUploadIcon} className="me-2 text-muted tw-rounded-xl" size={20} />,
        actionName: "Re-upload Student Image",
        onClickHndlr: (event: any) => {
          const idCadrNo = event.currentTarget.getAttribute("data-id");
          openReuploadStudentImageModel({ idCadrNo });
        }
      },
    ]), [studentsIdcardResp]);

  const roleColumns = useMemo(() => generateColumns(menuOptions), [studentsIdcardResp]);
  const { totalElements, totalPages, pageble } = studentsIdcardResp || {}
  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Student Id Card" pageTitle="Id Card" />

          <div className="tw-rounded-lg tw-border tw-border-gray-200 tw-bg-white tw-shadow-sm">
            <div className="tw-px-5 tw-py-4 tw-border-b tw-border-gray-200">
              <div className="tw-flex tw-items-center">
                <div className="tw-flex-1">
                  <h4 className="tw-text-base tw-font-semibold tw-m-0">ID Card</h4>
                </div>
                <div className="tw-ml-auto">
                  <Button
                    variant="primary"
                    onClick={moveToAddCard}
                  >
                    <i className="ri-add-line tw-mr-2" />
                    Add Request
                  </Button>
                </div>
              </div>
            </div>
            <TableContainer
              columns={roleColumns}
              data={Array.isArray(studentsIdcardResp?.data) ? studentsIdcardResp?.data : []}
              divClass="table-responsive tw-mb-3"
              theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
              showPagination={true}
              totalPages={totalPages || 0}
              totalRecords={totalElements || 0}
              callbackPaginationHndlr={paginationHndlr}
              currentPageNumber={pageble?.pageNumber || 0}
            />

          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="changepassword-modal"
        isOpen={previewModalState.showModal}
        modalTitle={actionDisplayName}
        toggle={closePreviewModalHndlr}
        modalSize="md"
      >
        <PreviewIdCard
          idCardNo={previewModalState.modalData}
          isOpen={previewModalState.showModal}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="changepassword-modal"
        isOpen={reuploadStudentImageModelState.showModal}
        modalTitle="Re-Upload Student Image"
        toggle={closeReuploadStudentImageModel}
        modalSize="md"
      >
        <ReuploadStudentImage
          idCardNo={reuploadStudentImageModelState.modalData}
          isOpen={reuploadStudentImageModelState.showModal}
        />
      </ModalContainerUpdated>
    </>
  );
};
export default StudentIdCard;