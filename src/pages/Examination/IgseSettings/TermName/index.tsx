import React, { useEffect, useMemo, useRef } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { useFormik } from "formik";
import TermNameModel from "./TermNameModel";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { useModal } from "../../../../hooks/modalhook";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { deleteIgseTermNameAct, getIgseTermNameByIdAct, getIgseTermNameListAct, resetIgseTermNameListAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";

const initialValues = {
  searchString: "",
  curriculumId: "",
  branchId: "",
};

const TermName = () => {

  const dispatch = useAppDispatch();
  const { closeModal: closeIgseTermNameUploadModal, modalState: igseTermNameUploadState, openModal: openIgseTermNameUploadModal } = useModal();
  const { closeModal: closeDelIgseTermNameModal, modalState: deleteIgseTermNameState, openModal: openDelIgseTermNameModal } = useModal();

  const isEy = location.pathname.includes("/early-years-settings/term-name");
  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })

  const igseTermList = (otherProps?: any) => {
    const payload = {
      branchId: isInstituteAdmin
        ? otherProps?.branchId ?? termNameFormik.values.branchId
        : otherProps?.branchId ?? branchId,
      curriculumId:
        otherProps?.curriculumId ?? termNameFormik.values.curriculumId,
      searchString:
        otherProps?.searchString ?? termNameFormik.values.searchString,
      ...pagination.current,
      ...otherProps,
    };
    dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, payload)));
  };

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { branchId: isInstituteAdmin ? termNameFormik.values.branchId : branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function delModalSubmitHndlr() {
    dispatch(deleteIgseTermNameAct(generateActionPayload("delete_igse_term_name", { termId: deleteIgseTermNameState.modalData })));
  }

  const termNameFormik = useFormik({
    initialValues,
    onSubmit: (values) => { },
  });

  const {
    currentBranchIdResp: branchId,
    branchListResp,
    currentInstIdResp: instituteId,
    showApiLoader,
    getIgseTermNameListResp,
    saveIgseTermNameResp,
    updateIgseTermNameByIdResp,
    deleteIgseTermNameByIdResp,
    brchCurriculumResp,
    loggedInUserRole,
    virtualRoleResp,
    cbseExaminationErrorAct
  } = useAppSelector(
    ({ branch, branchAcademics, examinationSettings, appData, globalData, }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      branchListResp: branch.branchListResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
      saveIgseTermNameResp: examinationSettings.saveIgseTermNameResp,
      updateIgseTermNameByIdResp: examinationSettings.updateIgseTermNameByIdResp,
      deleteIgseTermNameByIdResp: examinationSettings.deleteIgseTermNameByIdResp,
      loggedInUserRole: appData.loggedInUserRole,
      virtualRoleResp: appData.virtualRoleResp,
      cbseExaminationErrorAct: examinationSettings.cbseExaminationErrorAct,
    }),
    shallowEqual
  );

  const igseTermNameRef = useRef({
    prevSaveIgseTermNameResp: saveIgseTermNameResp,
    prevUpdateIgseTermNameByIdResp: updateIgseTermNameByIdResp,
    prevDeleteIgseTermNameByIdResp: deleteIgseTermNameByIdResp,
    prevcbseExaminationErrorAct: cbseExaminationErrorAct,
  })

  useEffect(() => {
    const { prevSaveIgseTermNameResp, prevUpdateIgseTermNameByIdResp, prevDeleteIgseTermNameByIdResp, prevcbseExaminationErrorAct } = igseTermNameRef.current;
    if (saveIgseTermNameResp && prevSaveIgseTermNameResp !== saveIgseTermNameResp) {
      toast.success("Term added successfully.");
      closeIgseTermNameUploadModal()
      igseTermList()
    }
    else if (updateIgseTermNameByIdResp && prevUpdateIgseTermNameByIdResp !== updateIgseTermNameByIdResp) {
      toast.success("Term updated successfully.");
      closeIgseTermNameUploadModal()
      igseTermList()
    }
    else if (deleteIgseTermNameByIdResp && prevDeleteIgseTermNameByIdResp !== deleteIgseTermNameByIdResp) {
      toast.success("Term deleted successfully.");
      closeDelIgseTermNameModal()
      igseTermList()
    }
    else if (cbseExaminationErrorAct && prevcbseExaminationErrorAct !== cbseExaminationErrorAct) {
      const { details, error } = cbseExaminationErrorAct || {};
      toast.error(details || error || "Something went wrong.");
    }
    igseTermNameRef.current.prevDeleteIgseTermNameByIdResp = deleteIgseTermNameByIdResp;
    igseTermNameRef.current.prevUpdateIgseTermNameByIdResp = updateIgseTermNameByIdResp;
    igseTermNameRef.current.prevSaveIgseTermNameResp = saveIgseTermNameResp;
    igseTermNameRef.current.prevcbseExaminationErrorAct = cbseExaminationErrorAct;
  }, [saveIgseTermNameResp, updateIgseTermNameByIdResp, deleteIgseTermNameByIdResp, cbseExaminationErrorAct]);

  const isInstituteAdmin = loggedInUserRole === "INSTITUTE_ADMIN" && !virtualRoleResp;

  useEffect(() => {
    if (!isInstituteAdmin) return;
    if (!branchListResp?.data?.length) return;

    const firstBranchId = branchListResp.data[0].branchId;

    termNameFormik.setFieldValue("branchId", firstBranchId);
  }, [isInstituteAdmin, branchListResp]);

  useEffect(() => {
    const selectedBranchId = isInstituteAdmin
      ? termNameFormik.values.branchId
      : branchId;

    if (!selectedBranchId) return;

    getCurriculumApiCall({
      branchId: selectedBranchId,
    });
  }, [isInstituteAdmin, termNameFormik.values.branchId, branchId]);

  const classApiCalled = useRef(false);

  useEffect(() => {
    dispatch(resetIgseTermNameListAct(undefined));
  }, []);

  useEffect(() => {
    const { data } = brchCurriculumResp || {};

    if (!Array.isArray(data) || data.length === 0) return;

    if (isInstituteAdmin) {
      const selectedBranchId = termNameFormik.values.branchId;
      if (!selectedBranchId) return;
      const firstCurriculum = data[0];

      termNameFormik.setFieldValue(
        "curriculumId",
        firstCurriculum.branchCurriculumId
      );

      igseTermList({
        branchId: selectedBranchId,
        curriculumId: firstCurriculum.branchCurriculumId,
      });
      return;
    }

    const curriculumMapping: Record<string, string> = {
      "/early-years-settings/term-name": "EY1-EY3",
      "/cbse-settings/term-name": "CBSE",
      "/igcse-settings/term-name": "IGCSE",
    };
    const selectedCurriculum = data.find(
      (item: any) => item.shortName === curriculumMapping[location.pathname]
    );
    if (selectedCurriculum && branchId) {
      termNameFormik.setFieldValue(
        "curriculumId",
        selectedCurriculum.branchCurriculumId
      );

      igseTermList({
        branchId,
        curriculumId: selectedCurriculum.branchCurriculumId,
      });
    }
  }, [brchCurriculumResp, isInstituteAdmin, branchId]);

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className=" text-muted" size={20} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const termId = event.currentTarget.getAttribute("data-id");
          dispatch(getIgseTermNameByIdAct(generateActionPayload("get_igse_term_name_by_id", { termId })));
          openIgseTermNameUploadModal(termId);
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const termId = event.currentTarget.getAttribute("data-id");
          openDelIgseTermNameModal(termId)
        },
      },
    ],
    [getIgseTermNameListResp]
  );

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    termNameFormik.setFieldValue(name, value);
    pagination.current.pageNo = 0;
    if (name === "branchId") {
      termNameFormik.setFieldValue("curriculumId", "");
      dispatch(resetIgseTermNameListAct(undefined));
      return;
    }
    if (name === "curriculumId") {
      dispatch(resetIgseTermNameListAct(undefined));

      igseTermList({
        curriculumId: value,
        branchId: isInstituteAdmin
          ? termNameFormik.values.branchId
          : branchId,
      });
      return;
    }
    igseTermList({ [name]: value });
  };

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    igseTermList(paginationInfo);
  }

  const columns = useMemo(() => generateColumns(menuOptions, isInstituteAdmin), [isInstituteAdmin]);
  const { totalElements, totalPages, pageable } = getIgseTermNameListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Examination" pageTitle="Examination" />
          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">Term Name</h4>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="row bg-light m-3 pb-3 px-2 g-3 examination">
                <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="mb-0"
                      placeHolder="Search"
                      labelText="Search"
                      inputClassName="bg-light"
                      value={termNameFormik.values.searchString}
                      onChange={filterHandler}
                      floatingLabel
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                {isInstituteAdmin && (
                  <div className="col-xs-12 col-md-12 col-lg-2">
                    <SelectInput
                      name="branchId"
                      valueKey="branchId"
                      textKey="branchName"
                      value={termNameFormik.values.branchId}
                      menuItems={branchListResp?.data}
                      onChange={filterHandler}
                      labelText="Branch Name"
                      floatingLabel
                      inputClassName="bg-light"
                      formgroupClassName="tw-mb-0"
                    />
                  </div>
                )}
                <div className="col-xs-12 col-md-12 col-lg-2">
                  <SelectInput
                    name="curriculumId"
                    value={termNameFormik.values.curriculumId}
                    onChange={filterHandler}
                    menuItems={curriculumTypes || []}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    formgroupClassName="mb-0"
                    labelText='Curriculum'
                    floatingLabel
                    labelClass="required"
                    inputClassName="bg-light"
                    isDisabled={!(isEy || isInstituteAdmin)}
                  />
                </div>
                {isInstituteAdmin && (
                  <div className="col-auto ms-auto">
                    <button
                      className="btn btn-success float-end d-flex align-items-center"
                      onClick={() => openIgseTermNameUploadModal()}
                    >
                      <i className="ri-add-line me-2" />
                      Add New
                    </button>
                  </div>
                )}
              </div>
              <TableContainer
                columns={columns || []}
                data={Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : []}
                tableClass="mb-0"
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle"
                showCheckbox={false}
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageable?.pageNumber || 0}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-term-name"
        isOpen={igseTermNameUploadState.showModal}
        toggle={() => closeIgseTermNameUploadModal()}
        modalTitle={igseTermNameUploadState.modalData ? "Edit Term Name" : "Create Details"}
        modalSize="md"
      >
        <TermNameModel
          id={igseTermNameUploadState.modalData}
          isOpen={false}
          toggle={() => closeIgseTermNameUploadModal()}
          modalTitle="Create Detail"
          modalData={termNameFormik.values}
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-examination-modal"
        isOpen={deleteIgseTermNameState.showModal}
        confirmMessage="Are you sure you want to delete this Term Name ?"
        cancelHndlr={closeDelIgseTermNameModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default TermName;
