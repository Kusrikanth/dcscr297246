  import React, { useEffect } from "react";
  import { BrowseFile, InputCheckbox, MultiSelectCheckbox, SelectInput, TextInput } from "../../../Components/Common";
  import { shallowEqual, useDispatch } from 'react-redux';
  import { useFormik } from 'formik';
  import * as Yup from "yup";
  import { useAppSelector } from "../../../hooks/storehook";
  import { getBranchClassAct, getBranchCurriculumAct, setBrchClassAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
  import { generateActionPayload } from "../../../utility/reduxutility";
  import { addUploadDocumentsAct, getSectionByMultipleClassesAct } from "../../../store/academic/academicRequest/academicrequestactions";
import { getAssignedClassSubjectsList, resetAssignedClassSubjectsListAct } from "../../../store/academic/classSubjects/classsubjectsactions";
import Button from "../../../Components/Common/Button";
import { getSecoundLanguagesList } from "../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";

  const initialValues = {
      academicYearId: "",
      curriculumId: "",
      classId: "",
      typeOfWorkId:"",
      subject:"",
      sectionId:[],
      comment : "",

      fileName: "",
      file: null,
      previewUrl: "",
      languageId: "",
      subjectId: "",
      linkCheckBox: false,
      fileError: "",
    }

  const getValidationSchema = (linkCheckBox: boolean) => Yup.object().shape({
    academicYearId: Yup.string().nullable().required("Academic year is required."),
    curriculumId: Yup.string().nullable().required("Curriculum is required."),
    classId: Yup.string().required("Class is required.").nullable(),
    comment: Yup.string().required("Topic is required.").nullable(),
    file: Yup.mixed().nullable().when('linkCheckBox', {
      is: false,
      then: Yup.mixed().required("File is required."),
      otherwise: Yup.mixed().nullable(),
    }),
    sectionId: Yup.array().min(1, "Section is required.").required("Section is required.").nullable(),
    // subject: Yup.string().nullable().required("Subject is required."),
    typeOfWorkId: Yup.string().nullable().required("Type of work is required."),
  });


  const AddUploadDocumnets: React.FC<any> = (props) => {
    const uploadDocumentForm = useFormik({
      validationSchema: getValidationSchema(initialValues.linkCheckBox),
      initialValues,
      onSubmit: (values) => {

       const sectionIds = values.sectionId?.map((item: any) => item?.sectionId),
          payload = {
            instituteId: props.instituteId,
            academicYearId: values.academicYearId,
            branchId: props.branchId,
            curriculumId: values.curriculumId,
            classIds: [values.classId],
            sectionIds : sectionIds,
            subject:values.subject,
            subjectId: values.subjectId,
            typeOfWorkId:values.typeOfWorkId,
            comment : values.comment,
            languageId : values.languageId,
          };
        const formData = new FormData();
        formData.append("request", JSON.stringify(payload));
        if (values.file) {
          formData.append("file", values.file);
        }
        dispatch(addUploadDocumentsAct(generateActionPayload("add_upload_documents", undefined, formData)));
      },
    });
    const dispatch = useDispatch();
    const { showApiLoader, academicYearListResp, brchCurriculumResp, branchClassResp, getWorkTypesListResp,getSectionByMultipleClassesResp,assignedClassSubjectsListResp, secoundLanguageResp, loggedInUserRole } =
      useAppSelector(({ branchAcademics, globalData, instAcademics, academicRequest,classSubjectsInfo, appData, applicationSale }) => ({
        showApiLoader: globalData.showApiLoader,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        branchClassResp: branchAcademics.branchClassResp,
        academicYearListResp: instAcademics.academicYearListResp,
        getWorkTypesListResp: academicRequest.getWorkTypesListResp,
        getSectionByMultipleClassesResp: academicRequest.getSectionByMultipleClassesResp,
        assignedClassSubjectsListResp : classSubjectsInfo.assignedClassSubjectsListResp,
        secoundLanguageResp: applicationSale.secoundLanguageResp,
        loggedInUserRole: appData.loggedInUserRole,
      }), shallowEqual);

      useEffect(() => {
        if (!props.isOpen) {
          uploadDocumentForm.resetForm();
          uploadDocumentForm.setFieldValue("fileError", "");
        }
       }, [props.isOpen]);
       useEffect(() => {
        const newSchema = getValidationSchema(uploadDocumentForm.values.linkCheckBox);
        uploadDocumentForm.setErrors({});
        uploadDocumentForm.validateForm().then((errors) => {
          uploadDocumentForm.setErrors(errors);
        });
      }, [uploadDocumentForm.values.linkCheckBox]);

    useEffect(() => {
      const { data } = academicYearListResp || {};
      if (Array.isArray(data) && data.length > 0) {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        uploadDocumentForm.setFieldValue("academicYearId", yearId);
        const payload1: any = { academicYearId: yearId, branchId: props.branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
        if (loggedInUserRole === "TEACHER") {
            payload1.moduleName = "EXAMINATION";
        }
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
      }
    }, [academicYearListResp]);
      

    function renderOptionsTerms(item: any) {
      return item?.shortName;
    }
    function renderOptionsTermsForSections(item: any) {
      return item?.sectionName
    }
    function renderValueTerms(selectedItems: any) {
      if (Array.isArray(selectedItems)) {
        return (<div className="text-truncate">
          {
            selectedItems.map((item, index) => {
              return item?.shortName + (index !== (selectedItems.length - 1) ? ', ' : '')
            })
          }
        </div>)
      }
    }
    function renderValueTermsForSections(selectedItems: any) {
      if (Array.isArray(selectedItems)) {
        return (<div className="text-truncate">
          {
            selectedItems.map((item, index) => {
              return item?.sectionName + (index !== (selectedItems.length - 1) ? ', ' : '')
            })
          }
        </div>)
      }
    }
    function onSelectOptionHandler(selectedOptions: any, config?: any) {
      getSectionApiCall(selectedOptions?.map((item: any) => item?.id)?.join(","))
      const { name } = config;
      if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
        if(name === "")
        uploadDocumentForm.setFieldValue(name, selectedOptions);
      } else {
        uploadDocumentForm.setFieldValue(name, []);
      }
    }
    function onSelectSectionHandler(selectedOptions: any, config?: any) {
      const { name } = config;
      if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
        uploadDocumentForm.setFieldValue(name, selectedOptions);
      } else {
        uploadDocumentForm.setFieldValue(name, []);
      }
    }

    function onChangeCurriculumHndlr(event: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = event.target;
      const { branchId } = props;
      const { academicYearId } = uploadDocumentForm.values;    
      if (name === "academicYearId") {
        uploadDocumentForm.setValues((prevState: any) => ({ ...prevState, curriculumId: "", classId: "", [name]: value, }));
        if (value) {
          const brchCurriculumParams: any = { academicYearId: value, branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", };
          if (loggedInUserRole === "TEACHER") {
            brchCurriculumParams.moduleName = "EXAMINATION";
        }
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumParams)));
        } else {
          dispatch(setBrchClassAct(undefined));
        }
      } else if (name === "curriculumId") {
        uploadDocumentForm.setValues((prevState: any) => ({ ...prevState, classId: "",subject:"" ,sectionId:'', [name]: value, }));    
        if (value) {
          const payload: any = { academicYearId, branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, };
          if (loggedInUserRole === "TEACHER") {
            payload.moduleName = "EXAMINATION";
        }
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
        } else {
          dispatch(setBrchClassAct(undefined));
        }
      } else if(name === "classId"){
        uploadDocumentForm.setValues((prevState:any) => ({ ...prevState, [name]: value,subject:"",sectionId :"" }));
        if(value){
          classSubjectListApicall({ branchClassId: value });
          getSectionApiCall(value)
        }else{
          dispatch(resetAssignedClassSubjectsListAct(undefined));
        }
      } else {
        uploadDocumentForm.setValues((prevState) => ({ ...prevState, [name]: value, }));
      }
    }  

    function getClassApiCall(curriculumId: string) {
      const payload: any = {
        curriculumId, branchId: props.branchId,
        pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",
      };
      if (loggedInUserRole === "TEACHER") {
            payload.moduleName = "EXAMINATION";
        }
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }
    function getSectionApiCall(classIds: string) {
      const { academicYearId,curriculumId } = uploadDocumentForm.values
      const payload: any = {
        branchId: props.branchId, academicYearId, curriculumId, classIds
      };
      if (loggedInUserRole === "TEACHER") {
        payload.moduleName = "EXAMINATION";
      }
      dispatch(getSectionByMultipleClassesAct(generateActionPayload("get_section_by_multiple_class", undefined, payload)));
    }

    const classSubjectListApicall = (otherProps?: any) => {
        const { academicYearId, classId, curriculumId } = uploadDocumentForm.values;
        const payload = { academicYearId: academicYearId, curriculumId: curriculumId, branchClassId: classId, ...otherProps, pageNo: 0, pageSize: 100, };
        if (payload.academicYearId && payload.branchClassId) {
          dispatch(
            getAssignedClassSubjectsList(
              generateActionPayload("get_assigned_class_subject_list", undefined, payload)
            )
          );
        }
      }

    const getSecondLanguageList = ({ classId, type, index }: { classId: any, type: string, index: number }) => {
      const params = {
        instituteId: props.instituteId,
        academicYearId: uploadDocumentForm.values.academicYearId,
        branchId: props.branchId,
        curriculumId: uploadDocumentForm.values.curriculumId,
        classId,
        type,
      };
      if (classId && type) {
        dispatch(getSecoundLanguagesList(generateActionPayload("get_secound_language_list", undefined, params)));
      }
    };

    const acceptedImageFileTypes = ["image/jpeg", "image/jpg", "image/png"];
    const acceptedDocumentFileTypes = ["application/pdf", ...acceptedImageFileTypes];

    function uploadFileErrorHndlr(fileSize: number, fileType?: string, allowedTypes: string[] = acceptedImageFileTypes): string {
      if (!fileType || !allowedTypes.includes(fileType)) {
        return `Upload file should be of format ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`;
      }

      if (!isNaN(fileSize) && fileSize > 5 * 1024 * 1024) {
        return `Upload file should be less than 5MB, You are uploading ${(fileSize / (1024 * 1024)).toFixed(2)}MB file.`;
      }

      return "";
    }

    function onChangeFileInputHndlr(event: any) {
      const { name } = event.target;
      const file = event.target.files[0];
      const error = uploadFileErrorHndlr(file.size, file.type, acceptedDocumentFileTypes);
      
      uploadDocumentForm.setValues((prevState: any) => ({
        ...prevState, 
        fileName: error === "" ? file.name : "",
        file: error === "" ? file : null,
        fileError: error
      }))
    }

    const selectedSubject = assignedClassSubjectsListResp?.data?.find(
      (item: any) =>
        String(item.subjectId) === String(uploadDocumentForm.values.subjectId)
    );

    const isLanguageSubject =
      selectedSubject?.languageType === "THIRD" ||
      selectedSubject?.languageType === "SECOND" &&
      selectedSubject?.languageType !== undefined;

    function onChangeSubjectHandler(event: React.ChangeEvent<HTMLInputElement>) {
      const { value } = event.target;
      const selectedSubject =
        assignedClassSubjectsListResp?.data?.find(
          (item: any) => String(item.subjectId) === String(value)
        );

      uploadDocumentForm.setValues((prev: any) => ({
        ...prev,
        subjectId: value,
        subject: selectedSubject?.subjectName || "",
        languageId: "",
      }));

      if (selectedSubject?.classSubjectId && selectedSubject?.languageType) {
        getSecondLanguageList({
          classId: uploadDocumentForm.values.classId,
          type: selectedSubject.languageType,
          index: 0,
        });
      }
    }

    return (
      <form onSubmit={uploadDocumentForm.handleSubmit}>
        <div className="tw-px-5 tw-pt-4 tw-pb-0">
          <div className="tw-grid tw-grid-cols-12 tw-gap-4">

            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="academicYearId"
                labelText="Academic Year"
                value={uploadDocumentForm.values.academicYearId}
                onChange={onChangeCurriculumHndlr}
                menuItems={academicYearListResp?.data}
                valueKey="academicYearId"
                textKey="academicYearName"
                formgroupClassName="tw-mb-0"
                labelClass="required"
                invalid={(uploadDocumentForm.touched.academicYearId && uploadDocumentForm.errors.academicYearId) ? true : false}
                error={(uploadDocumentForm.touched.academicYearId && uploadDocumentForm.errors.academicYearId) ? uploadDocumentForm.errors.academicYearId : ""}
              />
            </div>

            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="curriculumId"
                labelText="Curriculum"
                value={uploadDocumentForm.values.curriculumId}
                onChange={onChangeCurriculumHndlr}
                menuItems={brchCurriculumResp?.data}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                formgroupClassName="tw-mb-0"
                labelClass="required"
                invalid={(uploadDocumentForm.touched.curriculumId && uploadDocumentForm.errors.curriculumId) ? true : false}
                error={(uploadDocumentForm.touched.curriculumId && uploadDocumentForm.errors.curriculumId) ? uploadDocumentForm.errors.curriculumId : ""}

              />
            </div>

            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="classId"
                value={uploadDocumentForm.values.classId}
                onChange={onChangeCurriculumHndlr}
                menuItems={branchClassResp?.content || []}
                valueKey="id"
                textKey="shortName"
                formgroupClassName="tw-mb-0"
                labelText="Class"
                labelClass="required"
                invalid={(uploadDocumentForm.touched.classId && uploadDocumentForm.errors.classId) ? true : false}
                error={(uploadDocumentForm.touched.classId && uploadDocumentForm.errors.classId) ? uploadDocumentForm.errors.classId : ""}
              />
            </div>

            <div className="tw-col-span-12 md:tw-col-span-6">
              <MultiSelectCheckbox
                name="sectionId"
                idKey="sectionId"
                labelText="Section"
                labelClass="required"
                value={uploadDocumentForm.values.sectionId}
                onChange={onSelectSectionHandler}
                options={getSectionByMultipleClassesResp || []}
                searchKey="sectionName"
                renderValue={renderValueTermsForSections}
                renderOptions={renderOptionsTermsForSections}
                invalid={(uploadDocumentForm.touched.sectionId && uploadDocumentForm.errors.sectionId) ? true : false}
                error={(uploadDocumentForm.touched.sectionId && uploadDocumentForm.errors.sectionId) ? uploadDocumentForm.errors.sectionId : ""}
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="subjectId"
                value={uploadDocumentForm.values.subjectId}
                onChange={onChangeSubjectHandler}
                menuItems={assignedClassSubjectsListResp?.data || []}
                valueKey="subjectId"
                textKey="subjectName"
                labelText="Subject"
                defaultSelect="Select"
                // labelClass="required"
                invalid={(uploadDocumentForm.touched.subjectId && uploadDocumentForm.errors.subjectId) ? true : false}
                error={(uploadDocumentForm.touched.subjectId && uploadDocumentForm.errors.subjectId) ? uploadDocumentForm.errors.subjectId : ""}
              />
            </div>
            {isLanguageSubject && (
              <div className="tw-col-span-12 md:tw-col-span-6">
                <SelectInput
                  name="languageId"
                  value={uploadDocumentForm.values.languageId}
                  onChange={uploadDocumentForm.handleChange}
                  menuItems={secoundLanguageResp?.data || []}
                  valueKey="languageId"
                  textKey="languageName"
                  labelText="Language"
                  defaultSelect="Select"
                />
              </div>
            )}
            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="typeOfWorkId"
                value={uploadDocumentForm.values.typeOfWorkId}
                onChange={uploadDocumentForm.handleChange}
                menuItems={getWorkTypesListResp?.data || []}
                valueKey="examinationWorkId"
                textKey="workTypeName"
                labelText="Type of Work"
                formgroupClassName="tw-mb-0"
                defaultSelect="Select"
                labelClass="required"
                invalid={(uploadDocumentForm.touched.typeOfWorkId && uploadDocumentForm.errors.typeOfWorkId) ? true : false}
                error={(uploadDocumentForm.touched.typeOfWorkId && uploadDocumentForm.errors.typeOfWorkId) ? uploadDocumentForm.errors.typeOfWorkId : ""}
              />
            </div>

            <div className="tw-col-span-12">
              <InputCheckbox
                name="linkCheckBox"
                labelName="If Topic is a Link"
                value={uploadDocumentForm.values.linkCheckBox}
                onChange={uploadDocumentForm.handleChange}
                formgroupClassName="tw-mb-0"
              />
            </div>

            <div className="tw-col-span-12">
              <TextInput
                name="comment"
                value={uploadDocumentForm.values.comment}
                onChange={uploadDocumentForm.handleChange}
                labelText="Topic"
                maxLength={500}
                labelClass="required"
                formgroupClassName="tw-mb-0"
                invalid={(uploadDocumentForm.touched.comment && uploadDocumentForm.errors.comment) ? true : false}
                error={(uploadDocumentForm.touched.comment && uploadDocumentForm.errors.comment) ? uploadDocumentForm.errors.comment : ""}
              />
            </div>

            <div className="tw-col-span-12">
              <BrowseFile
                containerClassName="tw-mb-3"
                labelText="Upload File"
                name="file"
                labelClass={!uploadDocumentForm.values.linkCheckBox ? "required" : ""}
                fileName={uploadDocumentForm.values.fileName}
                onChangeFileHndlr={onChangeFileInputHndlr}
                invalid={(uploadDocumentForm.touched.file && uploadDocumentForm.errors.file) || uploadDocumentForm.values.fileError !== "" ? true : false}
                error={uploadDocumentForm.values.fileError || (uploadDocumentForm.touched.file && uploadDocumentForm.errors.file) || ""}
              />
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="tw-px-6 tw-py-4">
          <div className="tw-flex tw-justify-end tw-gap-3">
            <Button type="button" variant="secondary" onClick={props.toggle}>
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={showApiLoader || uploadDocumentForm.values.fileError !== ""}
            >
              Save
            </Button>
          </div>
        </div>

      </form >
    );
  };

  export default AddUploadDocumnets;
