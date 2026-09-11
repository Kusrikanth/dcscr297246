import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useModal } from "../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { debounce } from "../../../../utility/commonutility";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import AddSignatureModel from "./AddSignatureModel";
import { useLocation } from "react-router-dom";
import { deleteAdmissionSignatureAct, getAdmissionSignatureByIdAct, getAdmissionSignatureListAct } from "../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";


const initialValues = {
  searchString: "",
  classId: "",
  curriculumId: "",
};

const SignatureConfiguration = () => {
  const { closeModal: closeAoDataUploadModalModal, modalState: aoMappingUploadModalState, openModal: aoMappingUploadModal } = useModal();
  const { closeModal: closeDelAoMappingModal, modalState: delAoMappingModalState, openModal: openDelAoMappingModal } = useModal();
  const dispatch = useAppDispatch();

  const {
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    academicAvailabilityErrorResp,
    getAdmissionSignatureListResp,
    saveAdmissionSignatureResp,
    delAdmissionSignatureResp,
    updateAdmissionSignatureResp,

  } = useAppSelector(
    ({ globalData, branchAcademics, appData, admissionAvailabilityRequest }) => ({
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      academicAvailabilityErrorResp: admissionAvailabilityRequest.academicAvailabilityErrorResp,
      getAdmissionSignatureListResp: admissionAvailabilityRequest.getAdmissionSignatureListResp,
      saveAdmissionSignatureResp: admissionAvailabilityRequest.saveAdmissionSignatureResp,
      delAdmissionSignatureResp: admissionAvailabilityRequest.delAdmissionSignatureResp,
      updateAdmissionSignatureResp: admissionAvailabilityRequest.updateAdmissionSignatureResp,

    }),
    shallowEqual
  );

  const aoMappingRef = useRef({
    prevAcademicAvailabilityErrorResp: academicAvailabilityErrorResp,
    prevSaveAdmissionSignatureResp: saveAdmissionSignatureResp,
    prevDelAdmissionSignatureResp: delAdmissionSignatureResp,
    prevUpdateAdmissionSignatureResp: updateAdmissionSignatureResp,
  })

  useEffect(() => {
    const { prevAcademicAvailabilityErrorResp, prevSaveAdmissionSignatureResp, prevDelAdmissionSignatureResp, prevUpdateAdmissionSignatureResp } = aoMappingRef.current || {}

    if (academicAvailabilityErrorResp && prevAcademicAvailabilityErrorResp !== academicAvailabilityErrorResp) {
      const { details } = academicAvailabilityErrorResp || {}
      toast.error(details || "Something went wrong")
    }
    else if (saveAdmissionSignatureResp && prevSaveAdmissionSignatureResp !== saveAdmissionSignatureResp) {
      toast.success("Signature Add successfully")
      getAdmissionSignatureListApiCall();
      closeAoDataUploadModalModal();
    }
    else if (delAdmissionSignatureResp && prevDelAdmissionSignatureResp !== delAdmissionSignatureResp) {
      toast.success("Signature Deleted successfully")
      getAdmissionSignatureListApiCall();
      closeDelAoMappingModal();
    }
    else if (updateAdmissionSignatureResp && prevUpdateAdmissionSignatureResp !== updateAdmissionSignatureResp) {
      toast.success("Signature Updated successfully")
      getAdmissionSignatureListApiCall();
    }
    aoMappingRef.current.prevAcademicAvailabilityErrorResp = academicAvailabilityErrorResp;
    aoMappingRef.current.prevSaveAdmissionSignatureResp = saveAdmissionSignatureResp;
    aoMappingRef.current.prevDelAdmissionSignatureResp = delAdmissionSignatureResp;
    aoMappingRef.current.prevUpdateAdmissionSignatureResp = updateAdmissionSignatureResp;
  }, [academicAvailabilityErrorResp, saveAdmissionSignatureResp, delAdmissionSignatureResp, updateAdmissionSignatureResp])


  const signatureForm = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (values) => { },
  });


  function editScheduleTaskModalHndlr(event: React.MouseEvent<HTMLElement>) {
    const id = event.currentTarget.getAttribute("data-id");
    aoMappingUploadModal(id);
  }

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={20} />,
        actionName: "Edit",
        onClickHndlr: editScheduleTaskModalHndlr,
      }
    ],
    [getAdmissionSignatureListResp]
  );

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { instituteId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  const getAdmissionSignatureListApiCall = (otherProps?: any) => {
    const payload = {
      branchId,
      curriculumId: signatureForm.values.curriculumId,
      classId: signatureForm.values.classId,
      ...otherProps,
    }
    dispatch(getAdmissionSignatureListAct(generateActionPayload("get_admission_signature_list", undefined, payload)));
  }

  function delModalSubmitHndlr() {
    dispatch(deleteAdmissionSignatureAct(generateActionPayload("delete_admission_signature", { id: delAoMappingModalState.modalData })));
  }

  useEffect(() => {
    getCurriculumApiCall();
  }, [])

  useEffect(() => {
    getAdmissionSignatureListApiCall();
  }, [signatureForm.values.curriculumId, signatureForm.values.classId])

  function search(value: string) {
    getAdmissionSignatureListApiCall({ ...signatureForm.values, searchString: value });
  }

  const debounceFun = useCallback(debounce(search, 200), [getAdmissionSignatureListResp]);

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "searchString") {
      signatureForm.setValues((prev: any) => ({ ...prev, [name]: value }))
      debounceFun(value);
    }
    else if (name === "curriculumId") {
      signatureForm.setValues((prev: any) => ({
        ...prev,
        curriculumId: value,
        classId: "",
      }));

      if (!value) {
        dispatch(resetBrchClassAct(undefined));
        return;
      }

      const payload = {
        branchId,
        curriculumId: value,
        sortBy: "classSequence",
        classFilter: "HIGHER",
        orderBy: "asc",
        pageNo: 0,
        pageSize: 100,
      };

      dispatch(
        getBranchClassAct(
          generateActionPayload(
            "get_brch_curriculum_class",
            undefined,
            payload
          )
        )
      );
    }
    else {
      const updatedValues = { ...signatureForm.values, [name]: value };
      signatureForm.setValues(updatedValues);
      getAdmissionSignatureListApiCall(updatedValues);
    }
  }

  const flatSignatureData = useMemo(() => {
    if (!Array.isArray(getAdmissionSignatureListResp)) return [];

    return getAdmissionSignatureListResp.flatMap(item =>
      item.signatureDto?.map(signature => ({
        ...signature,
        instituteName: item.instituteName,
        branchName: item.branchName,
        branchClassName: item.branchClassName,
        id: signature.id,
      }))
    );
  }, [getAdmissionSignatureListResp]);

  const columns = useMemo(() => generateColumns(menuOptions), [getAdmissionSignatureListResp]);

  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};


  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Admission" pageTitle="Admission" />

          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">Signature Configuration</h4>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="row bg-light mx-3 pt-3 my-3 examination">
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-3">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="mb-0"
                      placeHolder="Search"
                      labelText="Search"
                      floatingLabel
                      inputClassName="bg-light"
                      value={signatureForm.values.searchString}
                      onChange={filterHandler}
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="curriculumId"
                    value={signatureForm.values.curriculumId}
                    onChange={filterHandler}
                    menuItems={curriculumTypes}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    labelText="Curriculum"
                    floatingLabel
                    inputClassName="bg-light"
                  />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="classId"
                    value={signatureForm.values.classId}
                    onChange={filterHandler}
                    menuItems={classTypes}
                    valueKey="id"
                    textKey="shortName"
                    labelText="Class"
                    floatingLabel
                    inputClassName="bg-light"
                  />
                </div>
                <div className="col-auto ms-auto">
                  <button
                    className="btn btn-success float-end d-flex align-items-center"
                    onClick={() => aoMappingUploadModal()}
                  >
                    <i className="ri-add-line me-2" />
                    Add New
                  </button>
                </div>
              </div>

              <TableContainer
                columns={columns || []}
                data={Array.isArray(getAdmissionSignatureListResp) ? getAdmissionSignatureListResp : []}
                tableClass="mb-0"
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle"
                showPagination={false}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-examination"
        isOpen={aoMappingUploadModalState.showModal}
        toggle={() => closeAoDataUploadModalModal()}
        modalTitle={aoMappingUploadModalState.modalData ? "Edit Signature" : "Add Signature"}
        modalSize={aoMappingUploadModalState.modalData ? "xl" : "md"}
      >
        <AddSignatureModel
          id={aoMappingUploadModalState.modalData}
          isOpen={false}
          toggle={() => closeAoDataUploadModalModal()}
          modalTitle="Create Detail"
          instituteId={instituteId}
          branchId={branchId}
          modalData={signatureForm.values}
        />
      </ModalContainerUpdated>

      <ConfirmationModal
        id="delete-examination-ao-mapping"
        isOpen={delAoMappingModalState.showModal}
        confirmMessage="Are you sure you want to delete this record ?"
        cancelHndlr={closeDelAoMappingModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default SignatureConfiguration;
