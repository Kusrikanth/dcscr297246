import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardBody, Col, Container, Row, CardHeader } from "reactstrap";
import { DateInput, ModalContainerUpdated, SearchInput, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useFormik } from "formik";
import {
  BonafideCertificateFilterhProps,
  BonafideCertificateModal,
} from "./bonafideCertificateTypes";
import {
  generateColumns,
  selectData3,
} from "./helper";
import TableContainer from "../../../Components/Common/TableContainer";
import BonafideCertiPrintModal from "./BonafideCertiPrintModal";
// import ConfirmationModal from "../TransferCertificate/ConfirmationModal";
import ApprovalStatusModal from "./ApprovalStatusModal";
import ApprovalStatusBatchModal from "./ApprovalStatusBatchModal";
import { shallowEqual, useDispatch } from "react-redux";
import { bonafideCerificateList, bonafideCertiSendEmailAct, exportBonafiedListAct, issueBonafideCertificate } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppSelector } from "../../../hooks/storehook";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { getBranchClassAct, setBrchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { IPaginationState } from "../../../Components/Common/Pagination";
import NewBonafideCertificateModal from "./NewBonafideCertificateModal";
import { toast } from "react-toastify";
import { ConfirmationModal } from "../../../Components/Common";
import { useModal } from "../../../hooks/modalhook";
import { downloadExcelFile } from "../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, PencilEdit02Icon, PrinterIcon, Upload03Icon } from "@hugeicons-pro/core-stroke-standard";
import { searchInputOptions } from "../../Directory/StudentManagement/helper";
import Button from "../../../Components/Common/Button";
import ExportModal from "../../Directory/StudentManagement/ExportModal";

const initialValues: BonafideCertificateFilterhProps = {
  search: "",
  nameFilterType: "global",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  preparationStatus: "",
  issuanceDate: "",
};

const filterSearchOptions = searchInputOptions.slice(0, 4);

const BonafideCertificate = () => {
  const [bonafideCertificateFilterState, setBonafideCertificateFilterState] =
    useState<BonafideCertificateFilterhProps>(initialValues);
  const { modalState: confirmDigitalSignModalState, closeModal: closeDigitalSignModalHndlr,
    openModal: openDigitalSignModalHndlr
  } = useModal();
  const { closeModal: closeExportExcelModal, modalState: exportExcelState, openModal: openExportExcelModal } = useModal();
  const { closeModal: closeEmailConfirmModal, openModal: openEmailConfirmModal, modalState: emailConfirmModalState } = useModal();
  const dispatch = useDispatch();
  const [searchTcState, setSearchTcState] = useState("global");

  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp, branchClassResp, bonafideCerificates, addBonafideCertificateRes, updateBonafideCerificateRes, issueBonafideCerificateRes, showApiLoader, exportBonafiedListResp, bonafideCertiSendEmailResp, classroomManagmentErrorResp } =
    useAppSelector(
      ({ appData, instAcademics, globalData, branchAcademics, classroomManagmentInfo }) => ({
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        showApiLoader: globalData.showApiLoader,
        academicYearListResp: instAcademics.academicYearListResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        branchClassResp: branchAcademics.branchClassResp,
        bonafideCerificates: classroomManagmentInfo.bonafideCerificates,
        addBonafideCertificateRes: classroomManagmentInfo.addBonafideCertificateRes,
        updateBonafideCerificateRes: classroomManagmentInfo.updateBonafideCerificateRes,
        issueBonafideCerificateRes: classroomManagmentInfo.issueBonafideCerificateRes,
        exportBonafiedListResp: classroomManagmentInfo.exportBonafiedListResp,
        bonafideCertiSendEmailResp: classroomManagmentInfo.bonafideCertiSendEmailResp,
        classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
      }),
      shallowEqual
    );
  const BonafideCertificateRef = useRef({
    prevAddBonafideCertificateRes: addBonafideCertificateRes,
    prevUpdateBonafideCerificateRes: updateBonafideCerificateRes,
    prevIssueBonafideCerificateRes: issueBonafideCerificateRes,
    prevExportBonafiedListResp: exportBonafiedListResp,
    prevBonafideCertiSendEmailResp: bonafideCertiSendEmailResp,
    prevClassroomManagmentErrorResp: classroomManagmentErrorResp
  })

  useEffect(() => {
    const { prevAddBonafideCertificateRes, prevUpdateBonafideCerificateRes, prevIssueBonafideCerificateRes, prevExportBonafiedListResp, prevBonafideCertiSendEmailResp, prevClassroomManagmentErrorResp } = BonafideCertificateRef.current;
    if (addBonafideCertificateRes && addBonafideCertificateRes !== prevAddBonafideCertificateRes) {
      toast.success('Bonafide Certificate Request Added Successfully.');
      toggleBonafideCertificateModal(true);
    }
    else if (updateBonafideCerificateRes && updateBonafideCerificateRes !== prevUpdateBonafideCerificateRes) {
      toast.success('Bonafide Certificate Request Updated Successfully.');
      toggleBonafideCertificateModal(true);
    }
    else if (issueBonafideCerificateRes && issueBonafideCerificateRes !== prevIssueBonafideCerificateRes) {
      toast.success('Bonafide Certificate Request Issued Successfully.');
      toggleConfimationModalModal(true);
    }
    else if (exportBonafiedListResp && exportBonafiedListResp !== prevExportBonafiedListResp) {
      toast.success("Bonafied Certificate Excel Downloaded Successfully.")
      downloadExcelFile(exportBonafiedListResp, 'Bonafied_Certificate_Excel.xlsx')
      closeExportExcelModal();
    }
    else if (bonafideCertiSendEmailResp && bonafideCertiSendEmailResp !== prevBonafideCertiSendEmailResp) {
      toast.success("Bonafide Certificate Send Successfully.")
      closeEmailConfirmModal()
    }
    else if (classroomManagmentErrorResp && classroomManagmentErrorResp !== prevClassroomManagmentErrorResp) {
      const { details } = classroomManagmentErrorResp;
      toast.error(details);
    }

    BonafideCertificateRef.current.prevAddBonafideCertificateRes = addBonafideCertificateRes;
    BonafideCertificateRef.current.prevIssueBonafideCerificateRes = issueBonafideCerificateRes;
    BonafideCertificateRef.current.prevUpdateBonafideCerificateRes = updateBonafideCerificateRes;
    BonafideCertificateRef.current.prevExportBonafiedListResp = exportBonafiedListResp;
    BonafideCertificateRef.current.prevBonafideCertiSendEmailResp = bonafideCertiSendEmailResp;
    BonafideCertificateRef.current.prevClassroomManagmentErrorResp = classroomManagmentErrorResp;
  }, [classroomManagmentErrorResp, addBonafideCertificateRes, issueBonafideCerificateRes, exportBonafiedListResp, bonafideCertiSendEmailResp, updateBonafideCerificateRes])


  const getBonafideCertificateList = (otherProps?: any) => {
    let params = { ...bonafideCertificateFilterState, branchId: branchId, ...paginationFilter.current, ...otherProps }
    let { academicYearId, curriculumId } = params;
    dispatch(bonafideCerificateList(generateActionPayload('bonafide_certificate_list', undefined, params)))
  }

  const [
    bonafideCertificatePrintModalState,
    setBonafideCertificatePrintModalState,
  ] = useState({
    showModal: false,
    branchId: "",
    bonafideRequestId: "",
    digitalSigned: false
  });

  const [confimationModalState, setConfimationModalModalState] =
    useState<any>({
      showModal: false,
      certificateId: "",
    });

  const [approvalStatusModalState, setApprovalStatusModalState] =
    useState<BonafideCertificateModal>({
      showModal: false,
      branchId: "",
    });

  const [approvalStatusBatchModalState, setApprovalStatusBatchModalState] =
    useState<BonafideCertificateModal>({
      showModal: false,
      branchId: "",
    });
  const [newBonafideCertificateModalState, setNewBonafideCertificateModalState] =
    useState<any>({
      showModal: false,
      bonafideId: "",
    });

  const exportExcelHndler = () => {

    dispatch(exportBonafiedListAct(generateActionPayload("export_bonafide_certificate_list", undefined, { ...bonafideCertificateFilterState, branchId, instituteId }, {
      responseType: 'blob'
    })));
  }

  const toggleBonafideCertificatePrintModal = useCallback(
    (bonafideRequestId: any, apiCall?: boolean) => {
      setBonafideCertificatePrintModalState((prevState) => ({
        ...prevState,
        showModal: !prevState.showModal,
        bonafideRequestId: bonafideRequestId,
      }));
    }, [bonafideCerificates]);

  const toggleConfimationModalModal = (apiCall?: boolean, certificateId?: any) => {
    setConfimationModalModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      certificateId: certificateId
    }));
    if (typeof (apiCall) === 'boolean' && apiCall) {
      getBonafideCertificateList();
    }
  }

  const toggleApprovalStatusModalModal = (apiCall?: boolean) => {
    setApprovalStatusModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  }

  const toggleApprovalStatusBatchModal = (apiCall?: boolean) => {
    setApprovalStatusBatchModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  }
  const toggleBonafideCertificateModal = (apiCall?: any, bonafideId?: any) => {
    setNewBonafideCertificateModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      bonafideId: bonafideId
    }));
    if (typeof (apiCall) === 'boolean' && apiCall) {
      getBonafideCertificateList();
    }
  }
  const menuOptions = useMemo(
    () => [
      {
        id: "email",
        actionIcon: <HugeiconsIcon icon={Mail01Icon} className="me-2 text-muted" size={18} />,
        actionName: "Email",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
          openEmailConfirmModal(id)
        },
      },
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          toggleBonafideCertificateModal(undefined, id)

        },
      },
      {
        id: "issue",
        actionIcon: <HugeiconsIcon icon={Upload03Icon} className="me-2 text-muted" size={18} />,
        actionName: "Issue",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          toggleConfimationModalModal(undefined, id)
        }
      },
      {
        id: "print",
        actionIcon: <HugeiconsIcon icon={PrinterIcon} className="me-2 text-muted" size={18} />,
        actionName: "Bonafide Certificate Print",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          openDigitalSignModalHndlr({ bonafideId: id });
        },
      },
    ], [bonafideCerificates]
  );

  const roleColumns = useMemo(
    () =>
      generateColumns(
        menuOptions,
        toggleConfimationModalModal,
        toggleApprovalStatusModalModal,
        toggleApprovalStatusBatchModal
      ),
    [bonafideCerificates]
  );

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: bonafideCertificateFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function getClassApiCall(curriculumId: string) {
    const payload = { academicYearId: bonafideCertificateFilterState.academicYearId, pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId, branchId };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    paginationFilter.current.pageNo = 0;
    
    if (name === "academicYearId") {
      const updatedState = { ...bonafideCertificateFilterState, [name]: value, classId: "", curriculumId: "" };
      getCurriculumApiCall({ academicYearId: value });
      dispatch(resetBrchClassAct(undefined));
      setBonafideCertificateFilterState(updatedState);
      getBonafideCertificateList({ [name]: value, classId: "", curriculumId: "" });
    }
    else if (name === "curriculumId") {
      if (value) {
        getClassApiCall(value);
      }
      else {
        dispatch(resetBrchClassAct(undefined));
      }
      getBonafideCertificateList({ [name]: value, classId: "" });
      setBonafideCertificateFilterState((prevState: any) => ({ ...prevState, [name]: value, classId: "" }));
    } else {
      setBonafideCertificateFilterState((prevState: any) => ({ ...prevState, [name]: value }));
      getBonafideCertificateList({ [name]: value, });
    }
  }

  const IssueBonafideCertificateHandler = () => {
    let payload = {
      "status": "ISSUED",
      "reason": ""
    }
    dispatch(issueBonafideCertificate(generateActionPayload('issue_bonafide_certificate', { bonafideRequestId: confimationModalState.certificateId }, payload)))
  }

  useEffect(() => {
    if (academicYearListResp) {
      const { academicYearId = "" } = academicYearListResp && academicYearListResp.data.find(((year: any) => year.isAdmissionDefault)) || {}
      getCurriculumApiCall({ academicYearId });
      setBonafideCertificateFilterState((prev: any) => ({ ...prev, academicYearId }))
      getBonafideCertificateList({ academicYearId, curriculumId: bonafideCertificateFilterState.curriculumId })
    }
  }, [academicYearListResp]);

  useEffect(() => {
    const { data } = brchCurriculumResp || {};
    if (Array.isArray(data) && data.length > 0) {
      const { branchCurriculumId } = data?.find((item: any) => item?.curriculumName === "CBSE") || {};
      getClassApiCall(branchCurriculumId);
      setBonafideCertificateFilterState((prev: any) => ({ ...prev, curriculumId: branchCurriculumId }))

    }
  }, [brchCurriculumResp])




  const paginationFilter = useRef({
    pageNo: 0,
    pageSize: 10
  })


  function paginationHndlr(paginationInfo: IPaginationState) {
    // setPaginationFilter(paginationInfo);
    paginationFilter.current = paginationInfo;
    getBonafideCertificateList(paginationInfo);
  }

  function withDigitalSignModalHndlr() {
    const { modalData } = confirmDigitalSignModalState,
      { bonafideId } = modalData || {};
    if (bonafideId) {
      setBonafideCertificatePrintModalState((prevState) => ({
        ...prevState,
        showModal: true,
        bonafideRequestId: bonafideId,
        digitalSigned: true
      }));
      closeDigitalSignModalHndlr();
    }
  }
  function withoutDigitalSignModalHndlr() {
    const { modalData } = confirmDigitalSignModalState,
      { bonafideId } = modalData || {};
    if (bonafideId) {
      setBonafideCertificatePrintModalState((prevState) => ({
        ...prevState,
        showModal: true,
        bonafideRequestId: bonafideId,
        digitalSigned: false
      }));
      closeDigitalSignModalHndlr();
    }
  }

  function onSearchHandler(name: string, value: any) {
    paginationFilter.current.pageNo = 0;

    setBonafideCertificateFilterState((prevState) => {
      const updatedState = {
        ...prevState,
        search: value,
      };
      getBonafideCertificateList(updatedState);
      return updatedState;
    });
  }

  function onChangeHandler(name: string, id: any, item: any) {
    setSearchTcState(id);
    paginationFilter.current.pageNo = 0;

    setBonafideCertificateFilterState((prevState) => {
      const updatedState = {
        ...prevState,
        nameFilterType: id,
        search: ""
      };
      getBonafideCertificateList(updatedState);
      return updatedState;
    });
  }


  const emailConfirmSubmitHndler = () => {
    const payload = ["EMAIL"]
    dispatch(bonafideCertiSendEmailAct(generateActionPayload('bonafide_send_email', { bonafideRequestId: emailConfirmModalState.modalData }, payload)))
  }

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curricularList } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};
  const { data: bonafideCerificateData, totalPages, totalElements, pageNumber } = bonafideCerificates || {};
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Bonafide Certificate" pageTitle="Admissions" />

          <Card>
            <CardHeader className="tw-py-2">
              <div className="tw-flex tw-flex-col lg:tw-flex-row tw-items-center">
                <div className="tw-w-full lg:tw-w-1/3">
                  <h4 className="card-title !tw-mb-0 tw-flex-grow tw-justify-center">
                    Bonafide Certificate
                  </h4>
                </div>
                <div className="tw-w-auto tw-ml-auto">
                  <div className="tw-flex tw-gap-2">
                    <Button
                      variant="primary"
                      onClick={toggleBonafideCertificateModal}
                    >
                      <i className="ri-add-line" />
                      Add Request
                    </Button>
                    <Button
                      variant="info"
                      onClick={() => openExportExcelModal()}
                    >
                      <div className="tw-flex tw-items-center tw-text-white">
                        <span>
                          <i className="ri-add-line tw-mr-1" />
                        </span>
                        <span>Export</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>

            <div className="tw-p-0">
              <div className="tw-py-3 tw-px-3">
                {/* <form onSubmit={BonafideCertificateFilterForm.handleSubmit}> */}
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-6 xl:tw-grid-cols-12 tw-gap-3">
                  <div className="lg:tw-col-span-3 xl:tw-col-span-3">
                    <div className="tw-search-box">
                      <SearchInput
                        hideDefaultSelect
                        name="search"
                        value={searchTcState}
                        menuItems={filterSearchOptions}
                        idKey="id"
                        labelName="Search With"
                        searchHandler={onSearchHandler}
                        onChange={onChangeHandler}
                        renderSelectedValue={(item: any) => item?.name}
                        renderOptions={(item: any) => item?.name}
                      />
                    </div>
                  </div>
                  <div className="lg:tw-col-span-2 xl:tw-col-span-2">
                    <SelectInput
                      name="academicYearId"
                      value={bonafideCertificateFilterState.academicYearId}
                      onChange={filterHandler}
                      menuItems={academicYearList}
                      valueKey="academicYearId"
                      textKey="academicYearName"
                      // inputClassName="bg-light"
                      formgroupClassName="tw-mb-0"
                      labelText="Academic Year"
                      floatingLabel
                    />
                  </div>

                  <div className="lg:tw-col-span-2 xl:tw-col-span-2">
                    <SelectInput
                      name="curriculumId"
                      value={bonafideCertificateFilterState.curriculumId}
                      onChange={filterHandler}
                      menuItems={curricularList}
                      valueKey="branchCurriculumId"
                      textKey="curriculumName"
                      // inputClassName="bg-light"
                      formgroupClassName="tw-mb-0"
                      labelText="Curriculum"
                      floatingLabel
                    />
                  </div>
                  <div className="lg:tw-col-span-1 xl:tw-col-span-1">
                    <SelectInput
                      name="classId"
                      value={bonafideCertificateFilterState.classId}
                      onChange={filterHandler}
                      menuItems={classTypes}
                      valueKey="id"
                      textKey="shortName"
                      // inputClassName="bg-light"
                      formgroupClassName="tw-mb-0"
                      labelText="Class"
                      floatingLabel
                    />
                  </div>

                  <div className="lg:tw-col-span-2 xl:tw-col-span-2">
                    <SelectInput
                      name="preparationStatus"
                      value={bonafideCertificateFilterState.preparationStatus}
                      onChange={filterHandler}
                      menuItems={selectData3}
                      valueKey="statusTypeId"
                      textKey="statusType"
                      // inputClassName="bg-light"
                      formgroupClassName="tw-mb-0"
                      labelText="Status"
                      floatingLabel
                    />
                  </div>
                  <div className="lg:tw-col-span-2 xl:tw-col-span-2">
                    <DateInput
                      name="issuanceDate"
                      value={bonafideCertificateFilterState.issuanceDate}
                      onChange={filterHandler}
                      // inputClassName="bg-light"
                      formgroupClassName="tw-mb-0"
                    />
                  </div>

                  {/* <div className="lg:tw-col-span-2 xl:tw-col-span-2">
              <button
                className="tw-btn tw-bg-blue-600 tw-text-white tw-float-right tw-flex tw-items-center tw-px-4 tw-py-2 tw-rounded hover:tw-bg-blue-700"
                onClick={toggleCertificateIssuaModal}
              >
                <i className="ri-equalizer-fill tw-mr-2" />
                Apply Fillters
              </button>
            </div> */}
                </div>
                {/* </form> */}
              </div>

              <TableContainer
                columns={roleColumns || []}
                data={bonafideCerificateData || []}
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
              />
            </div>
          </Card>
        </Container>
      </div>

      <ModalContainerUpdated
        id="bonafide-certificate-print-modal"
        isOpen={bonafideCertificatePrintModalState.showModal}
        toggle={() => toggleBonafideCertificatePrintModal(undefined)}
        modalTitle="Bonafide Certificate"
        modalSize="xl"
      >
        <BonafideCertiPrintModal
          isOpen={bonafideCertificatePrintModalState.showModal}
          bonafideRequestId={bonafideCertificatePrintModalState.bonafideRequestId}
          toggle={toggleBonafideCertificatePrintModal}
          modalTitle={"Bonafide Certificate"}
          branchId={bonafideCertificatePrintModalState.branchId}
          digitalSign={bonafideCertificatePrintModalState.digitalSigned}
          editBranchDetails={""}
        />
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="bonafide-certificate-modal"
        isOpen={confimationModalState.showModal}
        toggle={toggleConfimationModalModal}
        modalTitle=""
        modalSize="md"
        hideHeader={true}
      >
        <ConfirmationModal
          id="confirm-issue-tc"
          isOpen={confimationModalState.showModal}
          cancelHndlr={toggleConfimationModalModal}
          iconType="approve"
          btnClassName="btn btn-success"
          confirmTitle={"Bonafide Certificate Class"}
          confirmMessage={"Are you sure you want to issue the bonafide certificate!"}
          confirmHndlr={IssueBonafideCertificateHandler}
        />
      </ModalContainerUpdated>


      <ConfirmationModal
        id="digitally-signed-bc"
        isOpen={confirmDigitalSignModalState.showModal}
        cancelHndlr={withoutDigitalSignModalHndlr}
        iconType="approve"
        btnClassName="btn btn-success w-sm"
        confirmTitle="Confirmation"
        confirmMessage="Do you want the document to get digitally signed?"
        noteMessage={
          branchId === '1'
            ? 'Note : Please ensure that A5 size paper is used for printouts.'
            : undefined
        }
        confirmHndlr={withDigitalSignModalHndlr}
        confirmBtnText="Yes"
        cancelBtnText="No"
      />

      <ApprovalStatusModal
        isOpen={approvalStatusModalState.showModal}
        toggle={toggleApprovalStatusModalModal}
        modalTitle={"Approval Status"}
        branchId={approvalStatusModalState.branchId}
        editBranchDetails={""}
      />

      <ApprovalStatusBatchModal
        isOpen={approvalStatusBatchModalState.showModal}
        toggle={toggleApprovalStatusBatchModal}
        modalTitle={"Approval Status"}
        branchId={approvalStatusBatchModalState.branchId}
        editBranchDetails={""}
      />
      <ModalContainerUpdated
        id="offline-bonafide-certificate-modal"
        isOpen={newBonafideCertificateModalState.showModal}
        toggle={toggleBonafideCertificateModal}
        modalTitle={`${newBonafideCertificateModalState.bonafideId ? "Edit" : "Add"} Request`}
        modalSize="lg"
      >

        <NewBonafideCertificateModal
          isOpen={newBonafideCertificateModalState.showModal}
          toggle={toggleBonafideCertificateModal}
          modalTitle={`${newBonafideCertificateModalState.bonafideId ? "Edit" : "Add"} Request`}
          instituteId={"1"}
          instituteName={""}
          branchId={branchId}
          academicYearId={bonafideCertificateFilterState?.academicYearId}
          bonafideId={newBonafideCertificateModalState.bonafideId}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="bonafied-certificate-export"
        isOpen={exportExcelState.showModal}
        toggle={closeExportExcelModal}
        modalTitle="Export Bonafide Certificate"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportExcelState.showModal}
          toggle={closeExportExcelModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportExcelHndler}
          feature="admission"
          subFeature="bonafide_certificates"
          remarksText="Enter remarks to download the excel file?"
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="bonofide-email-confirmation-modal"
        isOpen={emailConfirmModalState.showModal}
        confirmMessage="Do you want to Send Email Notification ?"
        cancelHndlr={closeEmailConfirmModal}
        confirmHndlr={emailConfirmSubmitHndler}
        isDisble={showApiLoader}
        showImgIcon={true}
        iconType='approve'
        btnClassName='btn w-sm btn-success'
      />
    </>
  );
};

export default BonafideCertificate;
