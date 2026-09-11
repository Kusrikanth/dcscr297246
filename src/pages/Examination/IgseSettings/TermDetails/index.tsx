import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { useEffect, useMemo, useRef, useState } from "react";
import { useModal } from "../../../../hooks/modalhook";
import { deleteIgseTermDetailsAct, getIgseTermDetailsByIdAct, getIgseTermDetailsListAct, getIgseTermNameListAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useFormik } from "formik";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { setIgseTermDetailsListAct } from "../../../../store/examination/examinationsettings/examinationsettingsslice";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { useFilterState } from "../../../../hooks/filterhook";
import { generateColumns, ignoredKeys } from "./helper";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import TermDetailsModel from "./TermDetailsModel";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  termId: "",
  branchId: "",
  curriculumShortName: "",
};

const validationSchema = Yup.object({
  academicYearId: Yup.string().required("Academic Year is required"),
  curriculumId: Yup.string().required("Curriculum is required"),
  classId: Yup.string().required("Class is required"),
  termId: Yup.string().required("Class is required"),
});

const TermDetails = () => {

  const dispatch = useAppDispatch();
  const { closeModal: closeIgsetermDetailsUploadModal, modalState: igsetermDetailsUploadState, openModal: openIgsetermDetailsUploadModal } = useModal();
  const { closeModal: closeDelIgseTermDetailsModal, modalState: deleteIgseTermDetailsState, openModal: openDelIgseTermDetailsModal } = useModal();
  const { showClearFilterState, count, advanceFilterChange } = useFilterState()

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })

  const igseTermDetails = (otherProps?: any) => {
    const payload = {
      ...igseTermDetailsForm.values,
      branchId: isInstituteAdmin
        ? igseTermDetailsForm.values.branchId
        : branchId,
      ...pagination.current,
      ...otherProps,
    };
    if (payload.academicYearId && payload.curriculumId && payload.classId) {
      dispatch(getIgseTermDetailsListAct(generateActionPayload("get_igse_term_details_list", undefined, payload)));
    }
  };
  const igseTermList = (curriculumId: string) => {
    if (curriculumId) {
      let payload = {
        branchId: isInstituteAdmin
          ? igseTermDetailsForm.values.branchId
          : branchId,
        curriculumId,
      };
      dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, payload)));
    }
  };

  function delModalSubmitHndlr() {
    dispatch(deleteIgseTermDetailsAct(generateActionPayload("delete_igse_term_details", { id: deleteIgseTermDetailsState.modalData })));
  }
  const igseTermDetailsForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => { },
  });
  const isEy = igseTermDetailsForm.values.curriculumShortName === "EY1-EY3"
  const cbse = location.pathname.includes("/cbse-settings/term-details");
  const igcse = igseTermDetailsForm.values.curriculumShortName === "IGCSE"

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    branchListResp,
    loggedInUserRole,
    virtualRoleResp,
    brchCurriculumResp,
    branchClassResp,
    showApiLoader,
    getIgseTermDetailsListResp,
    getIgseTermNameListResp,
    saveIgseTermDetailsResp,
    updateIgseTermDetailsByIdResp,
    deleteIgseTermDetailsByIdResp,
    cbseExaminationErrorAct
  } = useAppSelector(
    ({ instAcademics, branch, branchAcademics, examinationSettings, appData, globalData, }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      branchListResp: branch.branchListResp,
      loggedInUserRole: appData.loggedInUserRole,
      virtualRoleResp: appData.virtualRoleResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      getIgseTermDetailsListResp: examinationSettings.getIgseTermDetailsListResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
      saveIgseTermDetailsResp: examinationSettings.saveIgseTermDetailsResp,
      updateIgseTermDetailsByIdResp: examinationSettings.updateIgseTermDetailsByIdResp,
      deleteIgseTermDetailsByIdResp: examinationSettings.deleteIgseTermDetailsByIdResp,
      cbseExaminationErrorAct: examinationSettings.cbseExaminationErrorAct,
    }),
    shallowEqual
  );

  const cbseExaminationRef = useRef({
    prevSaveIgseTermDetailsResp: saveIgseTermDetailsResp,
    prevUpdateIgseTermDetailsByIdResp: updateIgseTermDetailsByIdResp,
    prevDeleteIgseTermDetailsByIdResp: deleteIgseTermDetailsByIdResp,
    prevcbseExaminationErrorAct: cbseExaminationErrorAct,
    prevCbseExaminationErrorResp: cbseExaminationErrorAct,
  })

  useEffect(() => {
    const { prevSaveIgseTermDetailsResp, prevUpdateIgseTermDetailsByIdResp, prevDeleteIgseTermDetailsByIdResp, prevcbseExaminationErrorAct } = cbseExaminationRef.current;
    if (saveIgseTermDetailsResp && prevSaveIgseTermDetailsResp !== saveIgseTermDetailsResp) {
      toast.success("Term Details added successfully.");
      closeIgsetermDetailsUploadModal()
      igseTermDetails()
    }
    else if (updateIgseTermDetailsByIdResp && prevUpdateIgseTermDetailsByIdResp !== updateIgseTermDetailsByIdResp) {
      toast.success("Term Details updated successfully.");
      closeIgsetermDetailsUploadModal()
      igseTermDetails()
    }
    else if (deleteIgseTermDetailsByIdResp && prevDeleteIgseTermDetailsByIdResp !== deleteIgseTermDetailsByIdResp) {
      toast.success("Term Details deleted successfully.");
      closeDelIgseTermDetailsModal()
      igseTermDetails()
    }
    else if (cbseExaminationErrorAct && prevcbseExaminationErrorAct !== cbseExaminationErrorAct) {
      const { details, error } = cbseExaminationErrorAct || {};
      toast.error(details || error || "Something went wrong.");
    }
    cbseExaminationRef.current.prevDeleteIgseTermDetailsByIdResp = deleteIgseTermDetailsByIdResp;
    cbseExaminationRef.current.prevUpdateIgseTermDetailsByIdResp = updateIgseTermDetailsByIdResp;
    cbseExaminationRef.current.prevSaveIgseTermDetailsResp = saveIgseTermDetailsResp;
    cbseExaminationRef.current.prevcbseExaminationErrorAct = cbseExaminationErrorAct;
  }, [saveIgseTermDetailsResp, updateIgseTermDetailsByIdResp, deleteIgseTermDetailsByIdResp, cbseExaminationErrorAct]);

  const classApiCalled = useRef(false);
  const isInstituteAdmin = loggedInUserRole === "INSTITUTE_ADMIN" && !virtualRoleResp;

  useEffect(() => {
    const selectedBranchId = isInstituteAdmin
      ? igseTermDetailsForm.values.branchId
      : branchId;

    if (!selectedBranchId || !igseTermDetailsForm.values.academicYearId) return;

    getCurriculumApiCall({
      branchId: selectedBranchId,
      academicYearId: igseTermDetailsForm.values.academicYearId,
    });
  }, [isInstituteAdmin, igseTermDetailsForm.values.branchId, igseTermDetailsForm.values.academicYearId]);

  useEffect(() => {
    const { data } = brchCurriculumResp || {};

    if (Array.isArray(data) && data.length > 0 && igseTermDetailsForm.values.academicYearId && !classApiCalled.current) {
      let selectedCurriculum;

      if (location.pathname.includes("/cbse-settings/term-details")) {
        selectedCurriculum = data.find(
          (item: any) =>
            item.shortName === "CBSE"
        );
      } else if (
        location.pathname.includes("/early-years-settings/term-details")
      ) {
        selectedCurriculum = data.find(
          (item: any) => item.shortName === "EY1-EY3"
        );
      } else if (
        location.pathname.includes("/igcse-settings/term-details")
      ) {
        selectedCurriculum = data.find(
          (item: any) => item.shortName === "IGCSE"
        );
      }

      if (!selectedCurriculum) return;

      const payload = {
        branchId: isInstituteAdmin
          ? branchListResp?.data?.[0]?.branchId
          : branchId,
        curriculumId: selectedCurriculum.branchCurriculumId,
        academicYearId: igseTermDetailsForm.values.academicYearId,
        classFilter: isEy ? "EARLY" : "HIGHER",
        sortBy: "classSequence",
        orderBy: "asc",
        pageNo: 0,
        pageSize: 100,
      };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      igseTermDetailsForm.setValues((prev: any) => ({
        ...prev,
        curriculumId: selectedCurriculum.branchCurriculumId,
        curriculumShortName: selectedCurriculum.shortName,
      }));
      dispatch(
        getIgseTermNameListAct(
          generateActionPayload("get_igse_term_name_list", undefined, {
            branchId: isInstituteAdmin
              ? branchListResp?.data?.[0]?.branchId
              : branchId,
            curriculumId: selectedCurriculum.branchCurriculumId,
          })
        )
      );
      classApiCalled.current = true;
    }
  }, [brchCurriculumResp, igseTermDetailsForm.values.academicYearId, location.pathname]);

  useEffect(() => {
    const { content } = branchClassResp || {};
    if (Array.isArray(content) && content.length > 0) {

      igseTermDetailsForm.setValues((prev: any) => ({ ...prev, classId: content[0].id }))
      igseTermDetails({ classId: content[0]?.id });
    }
  }, [branchClassResp])

  useEffect(() => {
    const yearId = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;

    if (!yearId) return;

    const firstBranchId = isInstituteAdmin
      ? branchListResp?.data?.[0]?.branchId
      : branchId;

    igseTermDetailsForm.setValues((prev: any) => ({
      ...prev,
      academicYearId: yearId,
      branchId: firstBranchId || "",
    }));

    if (firstBranchId) {
      getCurriculumApiCall({
        academicYearId: yearId,
        branchId: firstBranchId,
      });
    }

    classApiCalled.current = false;
  }, [academicYearListResp, branchListResp, isInstituteAdmin]);

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className=" text-muted" size={20} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          dispatch(getIgseTermDetailsByIdAct(generateActionPayload("get_igse_term_details_by_id", { id })));
          openIgsetermDetailsUploadModal(id);
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          openDelIgseTermDetailsModal(id)
        },
      },
    ],
    [getIgseTermDetailsListResp]
  );

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    igseTermDetails(paginationInfo);
  }
  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = {
      academicYearId: igseTermDetailsForm.values.academicYearId, branchId:
        otherProps?.branchId ??
        (isInstituteAdmin
          ? igseTermDetailsForm.values.branchId
          : branchId), pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps
    };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function getClassApiCall(curriculumId: string, academicYearId: string) {
    const payload = {
      academicYearId,
      curriculumId,
      branchId: isInstituteAdmin
        ? igseTermDetailsForm.values.branchId
        : branchId,
      pageNo: 0,
      pageSize: 100,
      classFilter: "HIGHER",
      sortBy: "classSequence",
      orderBy: "asc",
    };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;

    igseTermDetailsForm.setValues((prev: any) => {
      const updatedState = { ...prev, [name]: value };

      if (name === "academicYearId") {
        if (!value) {
          dispatch(resetBrchCurriculumAct(undefined))
          dispatch(resetBrchClassAct(undefined))
        }
        else {
          getCurriculumApiCall({ academicYearId: value });
          updatedState.classId = "";
          getClassApiCall(updatedState.curriculumId, value);
        }
      } else if (name === "curriculumId") {
        const selectedCurriculum = brchCurriculumResp?.data?.find(
          (item: any) => String(item.branchCurriculumId) === String(value)
        );

        updatedState.curriculumShortName =
          selectedCurriculum?.shortName || "";

        if (!value) {
          dispatch(resetBrchClassAct(undefined));
          dispatch(setIgseTermDetailsListAct(undefined));
        } else {
          getClassApiCall(
            value,
            igseTermDetailsForm.values.academicYearId
          );
          igseTermList(value);
        }

        updatedState.classId = "";
        igseTermDetails({ ...updatedState, classId: "" });
      } else if (name === "classId") {
        if (value) {
          igseTermDetails(updatedState);
        }
      } else if (name === "branchId") {
        updatedState.curriculumId = "";
        updatedState.classId = "";

        dispatch(resetBrchCurriculumAct(undefined));
        dispatch(resetBrchClassAct(undefined));

        getCurriculumApiCall({
          branchId: value,
          academicYearId: updatedState.academicYearId,
        });
      }
      else {
        igseTermDetails(updatedState);
      }
      advanceFilterChange({ keys: { ...igseTermDetailsForm.values, [name]: value }, ignoredKeys });
      return updatedState;
    });
  };

  function clearFilterHndlr() {
    pagination.current.pageNo = 0;
    const academicYearId =
      igseTermDetailsForm.values.academicYearId;
    const currentBranchId = isInstituteAdmin
      ? igseTermDetailsForm.values.branchId
      : branchId;
    const curriculumId =
      igseTermDetailsForm.values.curriculumId;
    const curriculumShortName =
      igseTermDetailsForm.values.curriculumShortName;
    const classId =
      igseTermDetailsForm.values.classId;
    const clearedValues = {
      ...igseTermDetailsForm.values,
      academicYearId,
      branchId: currentBranchId || "",
      curriculumId,
      curriculumShortName,
      classId,
      searchString: "",
      termId: "",
    };
    igseTermDetailsForm.setValues(clearedValues);
    const payload = {
      ...clearedValues,
      branchId: currentBranchId,
      pageNo: 0,
      pageSize: pagination.current.pageSize,
    };
    if (payload.academicYearId && payload.curriculumId && payload.classId) {
      dispatch(
        getIgseTermDetailsListAct(
          generateActionPayload(
            "get_igse_term_details_list",
            undefined,
            payload
          )
        )
      );
    }
    advanceFilterChange({
      keys: clearedValues,
      ignoredKeys,
    });
  }

  const examinationColumns = useMemo(() => generateColumns(menuOptions, igcse, isInstituteAdmin), [getIgseTermDetailsListResp, igcse, isInstituteAdmin]);
  const { totalElements, totalPages, pageable } = getIgseTermDetailsListResp || {};
  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Examination" pageTitle="Examination" />
          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">Term Details</h4>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="row bg-light m-3 pb-1 px-2 g-3 examination">
                <div className="col-xs-12 col-md-12 col-lg-2 col-xl-2 py-2 mt-2">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="mb-0"
                      labelText='Search'
                      placeHolder="Search"
                      value={igseTermDetailsForm.values.searchString}
                      onChange={onChangeFilterHndlr}
                      floatingLabel
                      inputClassName="bg-light"
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2 py-2 mt-2">
                  <SelectInput
                    name="academicYearId"
                    value={igseTermDetailsForm.values.academicYearId}
                    onChange={onChangeFilterHndlr}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="mb-0"
                    labelText='Academic Year'
                    floatingLabel
                    labelClass="required"
                    inputClassName="bg-light"
                    invalid={(igseTermDetailsForm.touched.academicYearId && igseTermDetailsForm.errors.academicYearId) ? true : false}
                    error={(igseTermDetailsForm.touched.academicYearId && igseTermDetailsForm.errors.academicYearId) ? igseTermDetailsForm.errors.academicYearId : ""}
                  />
                </div>
                {isInstituteAdmin && (
                  <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2 py-2 mt-2">
                    <SelectInput
                      name="branchId"
                      value={igseTermDetailsForm.values.branchId}
                      onChange={onChangeFilterHndlr}
                      menuItems={branchListResp?.data || []}
                      valueKey="branchId"
                      textKey="branchName"
                      labelText="Branch Name"
                      formgroupClassName="mb-0"
                      floatingLabel
                      inputClassName="bg-light"
                    />
                  </div>
                )}
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2 py-2 mt-2">
                  <SelectInput
                    name="curriculumId"
                    value={igseTermDetailsForm.values.curriculumId}
                    onChange={onChangeFilterHndlr}
                    menuItems={curriculumTypes || []}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    formgroupClassName="mb-0"
                    labelText='Curriculum'
                    floatingLabel
                    labelClass="required"
                    inputClassName="bg-light"
                    isDisabled={!(isEy || isInstituteAdmin)}
                    invalid={(igseTermDetailsForm.touched.curriculumId && igseTermDetailsForm.errors.curriculumId) ? true : false}
                    error={(igseTermDetailsForm.touched.curriculumId && igseTermDetailsForm.errors.curriculumId) ? igseTermDetailsForm.errors.curriculumId : ""}
                  />
                </div>
                <div className={`col-xs-12 col-md-12 py-2 mt-2 ${isInstituteAdmin
                  ? "col-lg-2 col-xl-1"
                  : "col-lg-3 col-xl-2"
                  }`}>
                  <SelectInput
                    name="classId"
                    value={igseTermDetailsForm.values.classId}
                    onChange={onChangeFilterHndlr}
                    menuItems={classTypes || []}
                    valueKey="id"
                    textKey="shortName"
                    formgroupClassName="mb-0"
                    labelText='Class'
                    floatingLabel
                    labelClass="required"
                    inputClassName="bg-light"
                    invalid={(igseTermDetailsForm.touched.classId && igseTermDetailsForm.errors.classId) ? true : false}
                    error={(igseTermDetailsForm.touched.classId && igseTermDetailsForm.errors.classId) ? igseTermDetailsForm.errors.classId : ""}
                  />
                </div>
                <div className={`col-xs-12 col-md-12 py-2 mt-2 ${isInstituteAdmin
                  ? "col-lg-2 col-xl-1"
                  : "col-lg-3 col-xl-2"
                  }`}>
                  <SelectInput
                    name="termId"
                    value={igseTermDetailsForm.values.termId}
                    onChange={onChangeFilterHndlr}
                    menuItems={Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : []}
                    valueKey="termId"
                    textKey="termName"
                    formgroupClassName="mb-2 mb-xl-0"
                    labelText='Term Name'
                    inputClassName="bg-light"
                    floatingLabel
                  />
                </div>
                <div className="col-auto d-flex align-items-center">
                  {showClearFilterState && <button type="button" onClick={clearFilterHndlr} className="btn btn-sm btn-ghost-danger">Clear filter</button>}
                </div>
                {isInstituteAdmin && (
                  <div className="col-auto ms-auto d-flex py-2 mt-2 ">
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        if (!igseTermDetailsForm.values.curriculumId) {
                          toast.error("Please select Curriculum");
                          return;
                        }

                        if (!igseTermDetailsForm.values.classId) {
                          toast.error("Please select Class");
                          return;
                        }

                        openIgsetermDetailsUploadModal();
                      }}
                    >
                      <i className="ri-add-line me-2" />
                      Add New
                    </button>
                  </div>
                )}
              </div>
              <TableContainer
                columns={examinationColumns}
                data={igseTermDetailsForm.values.curriculumId ? (Array.isArray(getIgseTermDetailsListResp?.data) ? getIgseTermDetailsListResp?.data : []) : []}
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
        id="add-examination"
        isOpen={igsetermDetailsUploadState.showModal}
        toggle={() => closeIgsetermDetailsUploadModal()}
        modalTitle={igsetermDetailsUploadState.modalData ? "Edit Term Details" : "Create Details"}
        modalSize={igcse ? "xl" : "md"}
      >
        <TermDetailsModel
          id={igsetermDetailsUploadState.modalData}
          isOpen={false}
          toggle={() => closeIgsetermDetailsUploadModal()}
          modalTitle="Create Detail"
          modalData={igseTermDetailsForm.values}
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-examination-modal"
        isOpen={deleteIgseTermDetailsState.showModal}
        confirmMessage="Are you sure you want to delete this Term Details ?"
        cancelHndlr={closeDelIgseTermDetailsModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default TermDetails;
