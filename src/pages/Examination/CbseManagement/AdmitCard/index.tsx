import React, { useEffect, useMemo, useRef } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput, } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns, } from "./helper";
import { default as EyeSvg } from "../../../../assets/imagesdps/academics/EyeSvg.svg?react";
import { default as DownloadSvg } from "../../../../assets/imagesdps/academics/NewDownload.svg?react";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsslice";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getSectionList, resetSectionListAct } from "../../../../store/academic/classroomManagment/classroommanagmentactions";
import { getCbseExaminationListAct, getIgseTermNameListAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import * as Yup from "yup"
import { downloadAdmitCardAct, getAdmitCardDetailsAct, setAdmitCardDetailsAct } from "../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { useModal } from "../../../../hooks/modalhook";
import AddAdmitCard from "./AddAdmitCard";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download04Icon, RepeatIcon } from "@hugeicons-pro/core-stroke-standard";
import { useLocation } from "react-router-dom";
import PreviewAdmitCardModel from "./PreviewAdmitCardModel";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  sectionId: "",
  termId: "",
  examinationId: "",
};

const validationSchema = (pathname: string) =>
  Yup.object().shape({
    academicYearId: Yup.string().required("Academic Year is required."),
    curriculumId: Yup.string().required("Curriculum is required."),
    classId: Yup.string().required("Class is required."),
    termId: Yup.string().when([], {
      is: () => pathname === "/igcse-management",
      then: Yup.string().required("Term is required."),
      otherwise: Yup.string().notRequired(),
    }),
    examinationId: Yup.string().required("Examination is required."),
  });

const AdmitCard = () => {

  const dispatch = useAppDispatch()
  const { closeModal: closeAdmitCardModal, modalState: admitCardModalState, openModal: openAdmitCardModal } = useModal()
  const { closeModal: closeDownloadAdmitCardModal, modalState: downloadAdmitCardModalState, openModal: openDownloadAdmitCardModal } = useModal()
  const { closeModal: closePreviewAdmitCardModel, modalState: previewAdmitCardModelState, openModal: openPreviewAdmitCardModel } = useModal();
  const location = useLocation();
  const isIgcseManagementPage = location.pathname === "/igcse-management";
  const classApiCalled = useRef(false);

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getCbseExaminationRequestListResp,
    sectionListResp,
    getAdmitCardDetailsResp,
    generateAdmitCardResp,
    downloadAdmitCardResp,
    getIgseTermNameListResp,
    examinationManagementErrorResp,
  } = useAppSelector(
    ({ globalData, instAcademics, branchAcademics, appData, classroomManagmentInfo, examinationManagement, examinationSettings }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      sectionListResp: classroomManagmentInfo.sectionListResp,
      getCbseExaminationRequestListResp: examinationSettings.getCbseExaminationRequestListResp,
      getAdmitCardDetailsResp: examinationManagement.getAdmitCardDetailsResp,
      generateAdmitCardResp: examinationManagement.generateAdmitCardResp,
      downloadAdmitCardResp: examinationManagement.downloadAdmitCardResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
      examinationManagementErrorResp: examinationManagement.examinationManagementErrorResp,
    }),
    shallowEqual
  );

  const admitCardRef = useRef({
    prevGenerateAdmitCardResp: generateAdmitCardResp,
    prevExaminationManagementErrorResp: examinationManagementErrorResp,
    prevDownloadAdmitCardResp: downloadAdmitCardResp,
  })

  useEffect(() => {
    const { prevGenerateAdmitCardResp, prevDownloadAdmitCardResp, prevExaminationManagementErrorResp } = admitCardRef.current || {}

    if (generateAdmitCardResp && prevGenerateAdmitCardResp !== generateAdmitCardResp) {
      toast.success("Admit Card Generated Successfully")
      getAdmitCardDetailsApiCall()
      closeAdmitCardModal()
    }
    else if (downloadAdmitCardResp && prevDownloadAdmitCardResp !== downloadAdmitCardResp) {
      const { fileName, pdfBase64 } = downloadAdmitCardResp || {};
      const modalData = downloadAdmitCardModalState.showModal
        ? downloadAdmitCardModalState.modalData
        : previewAdmitCardModelState.modalData;
      const viewType = modalData?.viewType;
      if (pdfBase64) {
        const byteArray = Uint8Array.from(atob(pdfBase64), char => char.charCodeAt(0));
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(blob);

        if (viewType === "DOWNLOAD") {
          convertBlobToReceipt(blob, `${fileName || "AdmitCard"}.pdf`);
          toast.success("Admit Card Downloaded Successfully");
        }
        URL.revokeObjectURL(fileURL);
      }
      closeDownloadAdmitCardModal();
    }
    else if (examinationManagementErrorResp && prevExaminationManagementErrorResp !== examinationManagementErrorResp) {
      const { details } = examinationManagementErrorResp || {}
      toast.error(details || "Something went wrong")
    }

    admitCardRef.current.prevGenerateAdmitCardResp = generateAdmitCardResp;
    admitCardRef.current.prevDownloadAdmitCardResp = downloadAdmitCardResp;
    admitCardRef.current.prevExaminationManagementErrorResp = examinationManagementErrorResp;
  }, [generateAdmitCardResp, downloadAdmitCardResp, examinationManagementErrorResp])

  function convertBlobToReceipt(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const admitCardForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      getAdmitCardDetailsApiCall({ ...values, searchString: "" })
      admitCardForm.setFieldValue("searchString", "");
    },
  });

  const getAdmitCardDetailsApiCall = (otherProps?: any) => {
    const selectedClassId = admitCardForm.values.classId;
    const selectedClass = branchClassResp?.content?.find((item: any) => item.id === Number(selectedClassId));
    const shouldIncludeClassSequence = selectedClass?.classSequence === 14 || selectedClass?.classSequence === 15;
    const payload = { branchId, ...admitCardForm.values, ...pagination.current, ...otherProps, ...(shouldIncludeClassSequence && { classSequence: selectedClass.classSequence }), };
    dispatch(getAdmitCardDetailsAct(generateActionPayload("get_cbse_admit_card_details", undefined, payload)));
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: admitCardForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }
  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, classFilter: "HIGHER", academicYearId: admitCardForm.values?.academicYearId, curriculumId: admitCardForm.values.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const examinationTermList = (curriculumId: string) => {
    if (curriculumId) {
      let payload = {
        branchId,
        curriculumId: admitCardForm.values.curriculumId,
      };
      dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, payload)));
    }
  };

  const getSectionListResp = (otherProps?: any) => {

    let payload = { branchClassId: admitCardForm.values.classId || null, masterAcademicYearId: admitCardForm.values.academicYearId, curriculumId: admitCardForm.values.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
    if (payload.branchClassId && payload.masterAcademicYearId) {
      dispatch(
        getSectionList(
          generateActionPayload("get_section_list", undefined, payload)
        )
      );
    }
  }

  const cbseExaminationList = (otherProps?: any) => {
    let payload = {
      branchId,
      ...admitCardForm.values,
      pageNo: 0, pageSize: 100,
      ...otherProps,
    };
    dispatch(getCbseExaminationListAct(generateActionPayload("get_cbse_examination_list", undefined, payload)));
  };

  useEffect(() => {
    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
      dispatch(resetSectionListAct(undefined))
      dispatch(setAdmitCardDetailsAct(undefined))
    }
  }, []);

  useEffect(() => {
    examinationTermList(admitCardForm.values.curriculumId);
  }, [admitCardForm.values.curriculumId]);
  useEffect(() => {
    const { data } = brchCurriculumResp || {};
    const curriculumMapping: Record<string, string> = {
      "/early-years-management": "EY1-EY3",
      "/cbse-management": "CBSE",
      "/examination-parent":"CBSE",
      "/igcse-management": "IGCSE",
    };
    const selectedCurriculumName = curriculumMapping[location.pathname];
    classApiCalled.current = false;

    admitCardForm.setValues((prev: any) => ({
      ...prev,
      classId: "",
      sectionId: "",
      termId: "",
      examinationId: "",
      subjectId: "",
      scholasticType: "",
      coScholasticType: "",
      skillArea: "",
      subjectType: "SCHOLASTIC",
      subjectsHeaderName: "",
      languageId: "",
      searchString: "",
    }));

    if (Array.isArray(data) && data.length > 0 && admitCardForm.values.academicYearId && !classApiCalled.current) {
      const selectedCurriculum = data.find(
        (item) => item.shortName === selectedCurriculumName
      );
      if (!selectedCurriculum) {
        admitCardForm.setValues((prev: any) => ({
          ...prev,
          curriculumId: undefined,
        }));
        return;
      }
      const payload = {
        branchId,
        academicYearId: admitCardForm.values.academicYearId,
        curriculumId: selectedCurriculum.branchCurriculumId,
        sortBy: "classSequence",
        classFilter: "HIGHER",
        orderBy: "asc",
        pageNo: 0,
        pageSize: 100,
      };
      dispatch(
        getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload))
      );
      dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, { branchId, curriculumId: selectedCurriculum.branchCurriculumId })));
      admitCardForm.setValues((prev: any) => ({
        ...prev,
        curriculumId: selectedCurriculum.branchCurriculumId,
      }));
      classApiCalled.current = true;
    }
  }, [location.pathname, brchCurriculumResp, admitCardForm.values.academicYearId,]);

  useEffect(() => {
    const yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    admitCardForm.setFieldValue("academicYearId", yearId)
    getCurriculumApiCall({ academicYearId: yearId });
  }, [academicYearListResp]);

  const menuOptions = useMemo(
    () => [
      {
        id: "viewDetails",
        actionIcon: <EyeSvg className="me-2 d-inline-block" fill="#878a99" />,
        actionName: "View Details",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          const findData = getAdmitCardDetailsResp?.content?.find((item: any) => +item.admitCardDetailsId === +id);
          if (findData) {
            openPreviewAdmitCardModel({ ...findData, viewType: "VIEW" });
          }},
      },
      {
        id: "print",
        actionIcon: <DownloadSvg className="me-2 d-inline-block" stroke="#707070" />,
        actionName: "Download",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          const findData = getAdmitCardDetailsResp?.content?.find((item: any) => +item.admitCardDetailsId === +id);
          openDownloadAdmitCardModal({ ...findData, viewType: "DOWNLOAD" });
        },
      },
    ],
    [getAdmitCardDetailsResp]
  );

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    if (name === "academicYearId") {
      admitCardForm.setValues((prev: any) => ({ ...prev, [name]: value, curriculumId: "", classId: "", sectionId: "" }))
      getCurriculumApiCall({ academicYearId: value });
    }
    else if (name === 'curriculumId') {
      admitCardForm.setValues((prev: any) => ({ ...prev, [name]: value, classId: "", sectionId: "" }))
      if (!value) {
        dispatch(resetBrchClassAct(undefined))
      }
      else {
        getClassApiCall({ curriculumId: value, academicYearId: admitCardForm.values.academicYearId });
      }
    }
    else if (name === 'classId') {
      admitCardForm.setValues((prev: any) => ({ ...prev, [name]: value, sectionId: "" }))
      cbseExaminationList({ classId: value })
      if (!value) {
        dispatch(resetSectionListAct(undefined))
      } else {
        getSectionListResp({ branchClassId: value })
      }
    }
    else if (name === "searchString") {
      admitCardForm.setValues((prev: any) => ({ ...prev, [name]: value }))
      getAdmitCardDetailsApiCall({ searchString: value });
    }
    else {
      cbseExaminationList({ [name]: value })
      admitCardForm.setValues((prev: any) => ({ ...prev, [name]: value }))
    }
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    getAdmitCardDetailsApiCall(paginationInfo);
  }

  const confirmDonloadAdmitCardHndler = () => {
    const { studentId, viewType } = downloadAdmitCardModalState.modalData || {}
    const selectedClassId = admitCardForm.values.classId;
    const selectedClass = branchClassResp?.content?.find((item: any) => item.id === Number(selectedClassId));
    const shouldIncludeClassSequence = selectedClass?.classSequence === 14 || selectedClass?.classSequence === 15;
    const payload = { ...admitCardForm.values, branchId, viewType, studentId, ...(shouldIncludeClassSequence && { classSequence: selectedClass.classSequence }), };
    dispatch(downloadAdmitCardAct(generateActionPayload("download_admit_card", undefined, payload)));
  }

  const handleDownload = async () => {
    const errors :any = await admitCardForm.validateForm();
    if (Object.keys(errors).length > 0) {
      admitCardForm.setTouched(errors);
      return;
    }
    openDownloadAdmitCardModal({ viewType: "DOWNLOAD" });
  };

  const columns = useMemo(() => generateColumns(menuOptions), [getAdmitCardDetailsResp]);

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: studentAdmitCardResp, totalElements, totalPages, pageable } = getAdmitCardDetailsResp || {}
  const { content: classTypes } = branchClassResp || {};
  const { studentId, viewType } = previewAdmitCardModelState.modalData || {};
  const selectedClassId = admitCardForm.values;
  const selectedClass = branchClassResp?.content?.find(
    (item: any) => item.id === Number(selectedClassId)
  );
  const shouldIncludeClassSequence =
    selectedClass?.classSequence === 14 || selectedClass?.classSequence === 15;

  return (
    <>
      <div className="card d-inline-block w-100">
        <div className="bg-light pt-1 pb-3 m-3 rounded">
          <div className="row p-3 pb-0 g-3 examination">
            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
              <SelectInput
                name="academicYearId"
                value={admitCardForm.values.academicYearId}
                onChange={filterHandler}
                menuItems={academicYearList || []}
                valueKey="academicYearId"
                textKey="academicYearName"
                inputClassName="bg-light"
                formgroupClassName="mb-0"
                labelText="Academic Year"
                labelClass="required"
                floatingLabel
                invalid={(admitCardForm.touched.academicYearId && admitCardForm.errors.academicYearId) ? true : false}
                error={(admitCardForm.touched.academicYearId && admitCardForm.errors.academicYearId) ? admitCardForm.errors.academicYearId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
              <SelectInput
                name="curriculumId"
                value={admitCardForm.values.curriculumId}
                onChange={filterHandler}
                menuItems={curriculumTypes}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                inputClassName="bg-light"
                formgroupClassName="mb-0"
                labelText="Curriculum"
                labelClass="required"
                floatingLabel
                isDisabled={true}
                invalid={(admitCardForm.touched.curriculumId && admitCardForm.errors.curriculumId) ? true : false}
                error={(admitCardForm.touched.curriculumId && admitCardForm.errors.curriculumId) ? admitCardForm.errors.curriculumId : ""}
              />
            </div>

            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
              <SelectInput
                name="classId"
                value={admitCardForm.values.classId}
                onChange={filterHandler}
                menuItems={classTypes}
                valueKey="id"
                textKey="shortName"
                inputClassName="bg-light"
                formgroupClassName="mb-0"
                labelText="Class"
                labelClass="required"
                floatingLabel
                invalid={(admitCardForm.touched.classId && admitCardForm.errors.classId) ? true : false}
                error={(admitCardForm.touched.classId && admitCardForm.errors.classId) ? admitCardForm.errors.classId : ""}
              />
            </div>

            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
              <SelectInput
                name="sectionId"
                value={admitCardForm.values.sectionId}
                onChange={filterHandler}
                menuItems={sectionListResp?.data}
                valueKey="sectionId"
                textKey="sectionName"
                inputClassName="bg-light"
                formgroupClassName="mb-0"
                labelText="Section"
                floatingLabel
              />
            </div>
            {isIgcseManagementPage && (
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="termId"
                  value={admitCardForm.values.termId}
                  onChange={admitCardForm.handleChange}
                  menuItems={Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : []}
                  valueKey="termId"
                  textKey="termName"
                  formgroupClassName="mb-0"
                  labelText="Term Name"
                  labelClass="required"
                  floatingLabel
                  inputClassName="bg-light"
                  invalid={(admitCardForm.touched.termId && admitCardForm.errors.termId) ? true : false}
                  error={(admitCardForm.touched.termId && admitCardForm.errors.termId) ? admitCardForm.errors.termId : ""}
                />
              </div>
            )}
            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
              <SelectInput
                name="examinationId"
                value={admitCardForm.values.examinationId}
                onChange={admitCardForm.handleChange}
                menuItems={getCbseExaminationRequestListResp?.data}
                valueKey="id"
                textKey="examinationName"
                inputClassName="bg-light"
                formgroupClassName="mb-0"
                labelText="Examination"
                labelClass="required"
                floatingLabel
                invalid={(admitCardForm.touched.examinationId && admitCardForm.errors.examinationId) ? true : false}
                error={(admitCardForm.touched.examinationId && admitCardForm.errors.examinationId) ? admitCardForm.errors.examinationId : ""}
              />
            </div>
          </div>
        </div>
        <div className="row px-3 g-3">
          <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3 my-3">
            <div className="search-box">
              <TextInput
                name="searchString"
                value={admitCardForm.values.searchString}
                onChange={filterHandler}
                inputClassName="bg-soft-light"
                formgroupClassName="mb-0"
                placeHolder="Search"
              />

              <i className="ri-search-line search-icon"></i>
            </div>
          </div>
          <div className="col-auto ms-auto">
            {studentAdmitCardResp?.length > 0 && (
              <>
                <button
                  className="btn btn-3 me-2 text-white"
                  style={{ background: "#405189", border: "none" }}
                  onClick={handleDownload}
                >
                  <HugeiconsIcon icon={Download04Icon} className="me-2 text-white" size={18} /> Download All
                </button>
                <button
                  className="btn btn-3 btn-success"
                  onClick={() => openAdmitCardModal()}
                >
                  <div className="d-flex align-items-center text-white">
                    <HugeiconsIcon icon={RepeatIcon} className="me-2 text-white" size={18} />
                    <span>Generate</span>
                  </div>
                </button>
              </>
            )}
            <button
              disabled={showApiLoader}
              type="button"
              onClick={(event: any) => admitCardForm.handleSubmit(event)}
              className="btn btn-success float-end ms-2"
            >
              Search
            </button>
          </div>
        </div>
        <TableContainer
          columns={columns || []}
          data={Array.isArray(studentAdmitCardResp) ? studentAdmitCardResp : []}
          tableClass="mb-0"
          divClass="table-responsive mb-3"
          theadClass="table-light text-muted align-middle"
          showPagination={true}
          showCheckbox={false}
          totalPages={totalPages || 0}
          totalRecords={totalElements || 0}
          callbackPaginationHndlr={paginationHndlr}
          currentPageNumber={pageable?.pageNumber || 0}
        />
      </div>
      <ModalContainerUpdated
        id="generate-admit-card-modal"
        isOpen={admitCardModalState.showModal}
        toggle={closeAdmitCardModal}
        modalTitle={`Generate Admit Card`}
        modalSize="md"
      >
        <AddAdmitCard
          isOpen={admitCardModalState.showModal}
          modalData={admitCardModalState.modalData}
          toggle={closeAdmitCardModal}
          filterState={admitCardForm.values}
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="download-admit-card-modal"
        isOpen={downloadAdmitCardModalState.showModal}
        confirmMessage={`Are you sure you want to ${downloadAdmitCardModalState.modalData?.viewType} Admit Card ?`}
        cancelHndlr={closeDownloadAdmitCardModal}
        confirmHndlr={confirmDonloadAdmitCardHndler}
        isDisble={showApiLoader}
        showImgIcon={true}
        iconType="approve"
        btnClassName="btn w-sm btn-success"
      />
      <ModalContainerUpdated
        id="preview-progress-card"
        isOpen={previewAdmitCardModelState.showModal}
        toggle={() => closePreviewAdmitCardModel()}
        modalTitle="Preview Admit Card"
        modalSize="xl"
      >
        <PreviewAdmitCardModel
          data={previewAdmitCardModelState.modalData}
          isOpen={previewAdmitCardModelState.showModal}
          toggle={() => closePreviewAdmitCardModel()}
          modalTitle="Create Detail"
          studentId={studentId}
          viewType={viewType}
          selectedClassId={selectedClassId}
          shouldIncludeClassSequence={shouldIncludeClassSequence}
        />
      </ModalContainerUpdated>

    </>
  );
};

export default AdmitCard;
