import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, SelectInput, TextInput, } from "../../../../../../Components/Common";
import TableContainer from "../../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { downloadCbseProgressCardsAct, getProgressCardListAct } from "../../../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import { resetBrchCurriculumAct } from "../../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getSectionList } from "../../../../../../store/academic/classroomManagment/classroommanagmentactions";
import { setExaminationClassSubjectAct, setHolisticProgressCardAct, setProgressCardListAct } from "../../../../../../store/examination/examinationmanagement/examinationmanagementslice";
import { debounce } from "../../../../../../utility/commonutility";
import { useModal } from "../../../../../../hooks/modalhook";
import { HugeiconsIcon } from '@hugeicons/react';
import { RepeatIcon, Search01Icon } from "@hugeicons-pro/core-stroke-standard";
import { toast } from "react-toastify";
import { getClassesByStageAct, getIgseTermNameListAct } from "../../../../../../store/examination/examinationsettings/examinationsettingsaction";
import * as Yup from "yup"
import PreviewProgressCardModel from "./PreviewProgressCardModel";
import GenerateModal from "./GenerateModal";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  sectionId: "",
  termId: "",
};

export const getValidationSchema = () => {
  return Yup.object().shape({
    academicYearId: Yup.string().required("Academic Year is required."),
    classId: Yup.string().required("Class is required.").nullable(),
    sectionId: Yup.string().required("Section is required.").nullable(),
    termId: Yup.string().required("Term is required.").nullable(),
  });
};

const ProgressCard = () => {

  const [studentData, setStudentData] = useState<any[]>([]);
  const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
  const { closeModal: closePreviewProgressCardModel, modalState: previewProgressCardModelState, openModal: openPreviewProgressCardModel, setModalState: setPreviewProgressCardModalState } = useModal();
  const { closeModal: closeGenerateModel, modalState: generateModelState, openModal: openGenerateModel, setModalState: setGernrateProgressCardModalState } = useModal();
  const validationSchema = getValidationSchema();

  const dispatch = useAppDispatch();
  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })
  const selectedStudentsExist = useMemo(() => studentData?.some((student) => student.isSelected), [studentData])

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    sectionListResp,
    getProgressCardListResp, downloadCbseProgressCardsActResp,
    generateProgressCardActResp, downloadProgressCardActResp, previewProgressCardActResp, downloadAllProgressCardsActResp, 
    examinationManagementErrorResp,
    getClassesByStageResp,
    getIgseTermNameListResp
  } = useAppSelector(
    ({ globalData, instAcademics, appData, classroomManagmentInfo, examinationManagement, examinationSettings }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      sectionListResp: classroomManagmentInfo.sectionListResp,
      getProgressCardListResp: examinationManagement.getProgressCardListResp,
      generateProgressCardActResp: examinationManagement.generateProgressCardActResp,
      downloadProgressCardActResp: examinationManagement.downloadProgressCardActResp,
      downloadAllProgressCardsActResp: examinationManagement.downloadAllProgressCardsActResp,
      previewProgressCardActResp: examinationManagement.previewProgressCardActResp,
      downloadCbseProgressCardsActResp: examinationManagement.downloadCbseProgressCardsActResp,
      examinationManagementErrorResp: examinationManagement.examinationManagementErrorResp,
      getClassesByStageResp: examinationSettings.getClassesByStageResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,


    }),
    shallowEqual
  );

  const studentRemarksRef = useRef({
    prevGenerateProgressCardActResp: generateProgressCardActResp,
    prevDownloadProgressCardActRespActResp: downloadProgressCardActResp,
    prevDownloadAllProgressCardsActResp: downloadAllProgressCardsActResp,
    prevPreviewProgressCardActResp: previewProgressCardActResp,
    prevDownloadCbseProgressCardsActResp: downloadCbseProgressCardsActResp,
    prevStudentRemarksErrorResp: examinationManagementErrorResp,
  })

  useEffect(() => {
    const { prevDownloadAllProgressCardsActResp, prevDownloadProgressCardActRespActResp, prevGenerateProgressCardActResp, prevStudentRemarksErrorResp, prevDownloadCbseProgressCardsActResp } = studentRemarksRef.current;
    if (examinationManagementErrorResp && prevStudentRemarksErrorResp !== examinationManagementErrorResp) {
      const { details } = examinationManagementErrorResp || {};
      toast.error(details || "Something went wrong.");
    }
    else if (generateProgressCardActResp && prevGenerateProgressCardActResp !== generateProgressCardActResp) {
      toast.success("Progress Card Generated successfully");
      getProgressApiCall()
    } else if (downloadProgressCardActResp && prevDownloadProgressCardActRespActResp !== downloadProgressCardActResp) {
      toast.success("Progress Card downloaded successfully");
      convertBlobToReceipt(downloadProgressCardActResp, `ReportCard.pdf`);
      getProgressApiCall()
    }
    else if (downloadCbseProgressCardsActResp && prevDownloadCbseProgressCardsActResp !== downloadCbseProgressCardsActResp) {
      if (previewProgressCardModelState.modalData === "PREVIEW") {
        openPreviewProgressCardModel();
      } else {
        toast.success("Progress Card downloaded successfully");
        convertBase64ToReceipt(downloadCbseProgressCardsActResp?.pdfBase64, `ReportCard.pdf`);
        closeGenerateModel();
        getProgressApiCall();
      }
    }
    else if (downloadAllProgressCardsActResp && prevDownloadAllProgressCardsActResp !== downloadAllProgressCardsActResp) {
      toast.success("All Progress Cards downloaded successfully");
      downloadZipFile(downloadAllProgressCardsActResp, `REPORT_CARD.zip`);
      getProgressApiCall();
    }
    studentRemarksRef.current.prevGenerateProgressCardActResp = generateProgressCardActResp;
    studentRemarksRef.current.prevDownloadProgressCardActRespActResp = downloadProgressCardActResp;
    studentRemarksRef.current.prevDownloadAllProgressCardsActResp = downloadAllProgressCardsActResp;
    studentRemarksRef.current.prevPreviewProgressCardActResp = previewProgressCardActResp;
    studentRemarksRef.current.prevStudentRemarksErrorResp = examinationManagementErrorResp;
  }, [downloadAllProgressCardsActResp, downloadProgressCardActResp, generateProgressCardActResp, downloadCbseProgressCardsActResp, examinationManagementErrorResp]);


  useEffect(() => {
    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(setProgressCardListAct(undefined))
      dispatch(setHolisticProgressCardAct(undefined))
    }
  }, [])

  function downloadZipFile(response: BlobPart, fileName = 'download.zip') {
    const blob = new Blob([response], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  function convertBlobToReceipt(blobStream: any, fileName: any) {
    const url = window.URL.createObjectURL(new Blob([(blobStream)], { type: "application/pdf" }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function convertBase64ToReceipt(base64: any, fileName: any) {
    const link = document.createElement("a");
    link.href = `data:${"application/pdf"};base64,${base64}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const progressCardForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        academicYearId: values.academicYearId || "",
        curriculumId: values.curriculumId || "",
        classId: values.classId || "",
        sectionId: values.sectionId || "",
        searchString: values.searchString || "",
        termId: values.termId || "",
      };
      getProgressApiCall(payload);
    },
  });

  const handleGenerateClick = async () => {
    const errors = await progressCardForm.validateForm();

    progressCardForm.setTouched({
      academicYearId: true,
      curriculumId: true,
      classId: true,
      sectionId: true,
    });

    if (Object.keys(errors).length === 0) {
      const { curriculumId, classId } = progressCardForm.values || {};
      const payload = {
        curriculumId, classId, branchId
      }
      openGenerateModel();
    }
  };


  const menuOptions = useMemo(() => {
    return [
      {
        id: "generate",
        actionIcon: <HugeiconsIcon icon={RepeatIcon} className="me-2 text-muted" size={18} />,
        actionName: "Generate",
        onClickHndlr: (event: any) => {
          const systemFileId = event.currentTarget.getAttribute("data-id");
          openGenerateModel({ isSingleStu: true, id: systemFileId })
        }
      },
    ]
  }, [studentData, allStudentSelectedState]);



  const getProgressApiCall = (otherProps?: any) => {
    const payload = {
      branchId,
      academicYearId: progressCardForm.values.academicYearId,
      curriculumId: progressCardForm.values.curriculumId,
      classId: progressCardForm.values.classId,
      sectionId: progressCardForm.values.sectionId,
      searchString: progressCardForm.values.searchString,
      termId: progressCardForm.values.termId,
      ...otherProps,
    }
    dispatch(getProgressCardListAct(generateActionPayload("get_progress_card_list", undefined, payload)));
  }

  const getCurriculumClassApiCall = (otherProps?: any) => {
      const payload = {
        branchId,
        academicYearId: progressCardForm.values.academicYearId,
        stageId: 1,
        ...otherProps,
      };
  
      dispatch(getClassesByStageAct(generateActionPayload("get_classes_by_stage", undefined, payload)));
    };

  const getSectionListResp = (otherProps?: any) => {
    let payload = { branchClassId: progressCardForm.values.classId || null, masterAcademicYearId: progressCardForm.values.academicYearId, curriculumId: progressCardForm.values.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
    if (payload.branchClassId && payload.masterAcademicYearId) {
      dispatch(
        getSectionList(
          generateActionPayload("get_section_list", undefined, payload)
        )
      );
    }
  }

  useEffect(() => {
    if (Array.isArray(getProgressCardListResp) && getProgressCardListResp.length > 0) {
      setStudentData(getProgressCardListResp);
    } else {
      setStudentData([]);
    }
  }, [getProgressCardListResp]);

  useEffect(() => {
    const yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    progressCardForm.setFieldValue("academicYearId", yearId)
    getCurriculumClassApiCall({ academicYearId: yearId });
  }, [academicYearListResp]);

  function search(value: string) {
    getProgressApiCall({ ...progressCardForm.values, searchString: value });
  }


    const examinationTermList = (curriculumId: string) => {
      if (curriculumId) {
        let payload = {
          branchId,
          curriculumId,
        };
        dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, payload)));
      }
    };
  const debounceFun = useCallback(debounce(search, 200), [studentData]);
  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    if (name === "academicYearId") {
      getCurriculumClassApiCall({ academicYearId: value });
      progressCardForm.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        classId: null,
        curriculumId: prev.curriculumId ? prev.curriculumId : "",
        sectionId: null
      }));
    }
    else if (name === 'classId') {
      progressCardForm.setValues((prev: any) => ({ ...prev, [name]: value, sectionId: "", examinationId: "", subjectId: "" }));
      dispatch(setExaminationClassSubjectAct(undefined))
      if (value) {
        const selectedClass = getClassesByStageResp?.find((i: any) => +i.classId === +value);
        
        if(selectedClass){
          progressCardForm.setFieldValue("curriculumId", selectedClass.curriculumId);
          examinationTermList(selectedClass.curriculumId);
          getSectionListResp({ curriculumId: selectedClass.curriculumId, branchClassId: value })
        }
      }
    }
    else if (name === "searchString") {
      progressCardForm.setValues((prev: any) => ({
        ...prev,
        [name]: value
      }));

      debounceFun(value);
    }
    else {
      progressCardForm.setValues((prev: any) => ({ ...prev, [name]: value }))
    }
  }

  useEffect(() => {
    if (generateProgressCardActResp) {
      setAllStudentSelectedState(false);
      setStudentData((prevData) =>
        prevData.map((student) => ({
          ...student,
          isSelected: false,
        }))
      );
    }
  }, [generateProgressCardActResp]);

   useEffect(() => {
    if(
      Array.isArray(getIgseTermNameListResp?.data) &&
      getIgseTermNameListResp?.data.length > 0
    ){
      const firstTerm = getIgseTermNameListResp?.data?.find((item: any) => item.isCurrent == true);
      progressCardForm.setFieldValue("termId", firstTerm?.termId);
    }
  },[getIgseTermNameListResp])


  const allStudentCheckHndlr = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setAllStudentSelectedState(checked);
    if (!Array.isArray(studentData) || studentData.length === 0) return;
    setStudentData((prevData) =>
      prevData.map((student) => ({
        ...student,
        isSelected: checked,
      }))
    );
  }, [studentData]);

  const singleStudentCheckHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    const studentId = event.currentTarget.getAttribute("data-id");
    if (!studentId) return;
    setStudentData((prevData) => {
      const updatedData = prevData.map((student) =>
        student.studentId.toString() === studentId ? { ...student, isSelected: checked } : student
      );
      const areAllSelected = updatedData.every(student => student.isSelected);
      setAllStudentSelectedState(areAllSelected);
      return updatedData;
    });
  };
  const previewProgressCardsForCbse = async (name: string, modalValues?: any, id?: string, isSingleStu: boolean = false) => {
    const errors: any = await progressCardForm.validateForm();
    if (Object.keys(errors).length > 0) {
      progressCardForm.setTouched(errors);
      return;
    }
    setGernrateProgressCardModalState((prev) => ({ ...prev, modalData: name }));
    setPreviewProgressCardModalState((prev) => ({ ...prev, modalData: name }));
    const { academicYearId, classId, sectionId, termId} = progressCardForm.values;
    const { displayType } = modalValues || {};
    const selectedClass = getClassesByStageResp?.find((i: any) => +i.classId === +classId);


    const params = {
      academicYearId, classId, curriculumId: selectedClass?.curriculumId, sectionId, branchId, instituteId, displayType, termId,
      progressCardType:"HOLISTIC_FS",
      ...(selectedStudentsExist && !isSingleStu && {
        studentIds: studentData
          .filter((i: any) => i.isSelected)
          .map((i: any) => i.studentId)
          .join(","),
      }),
      // ...(isSingleStu && id && { studentIds: id }),
      ...(id && { studentIds: id }),
    };
    dispatch(downloadCbseProgressCardsAct(generateActionPayload("download_cbse_progress_cards", undefined, params)));
  }

  const columns = useMemo(() => generateColumns(allStudentCheckHndlr, singleStudentCheckHndlr, allStudentSelectedState, menuOptions, false), [studentData]);
  const { data: academicYearList } = academicYearListResp || {};

  return (
    <>
      <div className="card d-inline-block w-100 mb-0">
        <div className="bg-light m-3 pt-1 rounded">
          <div className="row p-3 g-3 examination">
            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
              <SelectInput
                name="academicYearId"
                value={progressCardForm.values.academicYearId}
                onChange={filterHandler}
                menuItems={academicYearList || []}
                valueKey="academicYearId"
                textKey="academicYearName"
                formgroupClassName="mb-0"
                labelText="Academic Year"
                labelClass="required"
                inputClassName="bg-light"
                floatingLabel
                invalid={(progressCardForm.touched.academicYearId && progressCardForm.errors.academicYearId) ? true : false}
                error={(progressCardForm.touched.academicYearId && progressCardForm.errors.academicYearId) ? progressCardForm.errors.academicYearId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
              <SelectInput
                name="classId"
                value={progressCardForm.values.classId}
                onChange={filterHandler}
                menuItems={getClassesByStageResp}
                valueKey="classId"
                textKey="className"
                formgroupClassName="mb-0"
                labelText="Curriculum Class"
                inputClassName="bg-light"
                labelClass="required"
                floatingLabel
                invalid={(progressCardForm.touched.classId && progressCardForm.errors.classId) ? true : false}
                error={(progressCardForm.touched.classId && progressCardForm.errors.classId) ? progressCardForm.errors.classId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-3  col-xl-2">
              <SelectInput
                name="sectionId"
                value={progressCardForm.values.sectionId}
                onChange={filterHandler}
                menuItems={sectionListResp?.data}
                valueKey="sectionId"
                textKey="sectionName"
                labelText="Section"
                inputClassName="bg-light"
                formgroupClassName="mb-0"
                floatingLabel
                labelClass="required"
                invalid={(progressCardForm.touched.sectionId && progressCardForm.errors.sectionId) ? true : false}
                error={(progressCardForm.touched.sectionId && progressCardForm.errors.sectionId) ? progressCardForm.errors.sectionId : ""}
              />
            </div>
            <div className="col-xs-12 col-lg-3 col-xl-2">
              <SelectInput
                name="termId"
                value={progressCardForm.values?.termId}
                onChange={filterHandler}
                menuItems={Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : []}
                valueKey="termId"
                textKey="termName"
                formgroupClassName="w-100"
                labelText='Term Name'
                inputClassName="bg-light"
                labelClass="required"
                floatingLabel
                invalid={(progressCardForm.touched.termId && progressCardForm.errors.termId) ? true : false}
                error={(progressCardForm.touched.termId && progressCardForm.errors.termId) ? progressCardForm.errors.termId : ""}
              />
            </div>
            <div className="col-auto ms-auto d-flex align-items-center">
              <button disabled={showApiLoader} type="button" onClick={(event: any) => progressCardForm.handleSubmit(event)} className="btn float-end text-white d-flex justify-content-center align-items-center" style={{ background: "#405189", border: "none" }}><HugeiconsIcon icon={Search01Icon} className="me-2 text-white" size={15} />Search</button>
            </div>
          </div>
        </div>
        <div className="row px-3 g-0 pt-0 mb-2">
          <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3 mt-2">
            <div className="search-box">
              <TextInput
                name="searchString"
                placeHolder="Search"
                labelText="Search"
                floatingLabel
                formgroupClassName="mb-2"
                value={progressCardForm.values.searchString}
                onChange={filterHandler}
              />
              <i className="ri-search-line search-icon"></i>
            </div>
          </div>
          <div className="col-auto mt-0 mb-2 ms-auto d-flex align-items-center">
            {selectedStudentsExist && (
              <button
                disabled={showApiLoader}
                className="btn btn-success float-end d-flex justify-content-center align-items-center"
                onClick={handleGenerateClick}
              >
                <HugeiconsIcon icon={RepeatIcon} className="me-2 text-white" size={18} /> Generate {(!allStudentSelectedState) ? "Selected Students" : "All"}
              </button>
            )}
          </div>
        </div>
        <TableContainer
          columns={columns || []}
          data={studentData || []}
          tableClass="mb-0"
          divClass="table-responsive mb-3"
          theadClass="table-light text-muted align-middle"
          showCheckbox={false}
          showPagination={false}
        />
      </div>
      <ModalContainerUpdated
        id="generate-progress-card"
        isOpen={generateModelState.showModal}
        toggle={() => closeGenerateModel()}
        modalTitle="Generate Progress Card"
        modalSize="md"
      >
        <GenerateModal
          isOpen={false}
          toggle={() => closeGenerateModel()}
          previewProgressCardsForCbse={previewProgressCardsForCbse}
          isSingleStu={generateModelState.modalData?.isSingleStu}
          id={generateModelState.modalData?.id}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="preview-progress-card"
        isOpen={previewProgressCardModelState.showModal}
        toggle={() => closePreviewProgressCardModel()}
        modalTitle="Preview Progress Card"
        modalSize="xl"
      >
        <PreviewProgressCardModel
          id={previewProgressCardModelState.modalData}
          isOpen={false}
          toggle={() => closePreviewProgressCardModel()}
          modalTitle="Create Detail"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default ProgressCard;
