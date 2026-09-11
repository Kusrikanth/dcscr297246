import { useFormik } from "formik";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { AutoSearchInputUpdated, CropModal, ModalContainerUpdated, SelectInput, TextInput, UploadFileInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { getBloodGroupAct } from "../../../store/masterdata/masterdataactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import ImgPreview from "../../../assets/imagesdps/directory/image_preview.png";
import * as Yup from 'yup';
import { validateDimension, uploadFileErrorHndlr } from "./helper";
import classNames from "classnames";
import { updateStudentIdCardAct } from "../../../store/academic/languages/languagesactions";
import { getStuDetailsAct } from "../../../store/academic/notreportingstudents/notreportingstudentsactions";
import { toast } from "react-toastify";
import { debounce } from "../../../utility/commonutility";
import { useHistory } from "react-router-dom";
import { useModal } from "../../../hooks/modalhook";

const initialValues = {
  academicYearId: "",
  studentId: "",
  branchId: "",
  bloodGroupId: "",
  bloodGroupName: "",
  class: "",
  dateOfBirth: "",
  parentName: "",
  section: "",
  smsPriorityNo: "",
  studentPhoto: "",
  studentPhotoFile: "",
  studentPhotoPreviewUrl: "",
}
const validationSchema = Yup.object().shape({
  studentPhoto: Yup.string().required('Student photo is required.'),
  academicYearId: Yup.string().required('Academic Year is required.'),
  studentId: Yup.string().required('Student is required.'),
})

const AddStudentIdCard = (props: any) => {
  const dispatch = useAppDispatch();
  const { closeModal: closeCropModalState, modalState: cropModalState, openModal: openCropModalState } = useModal()
  const [searchStudentState, setSearchStudentState] = useState(null);
  const history = useHistory();

  const { showApiLoader, currentInstIdResp: instituteId, languagesErrorResp, updateStudentIdcardResp, getStuDetailsResp, academicYearListResp,
    currentBranchIdResp: branchId, } =
    useAppSelector(({ appData, globalData, languagesInfo, instAcademics, notReportingStu, }) => ({
      showApiLoader: globalData.showApiLoader,
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getStuDetailsResp: notReportingStu.getStuDetailsResp,
      languagesErrorResp: languagesInfo.languagesErrorResp,
      updateStudentIdcardResp: languagesInfo.updateStudentIdcardResp,
    }), shallowEqual);

  const studentIdCardRef = useRef({
    prevUpdateStudentIdcardResp: updateStudentIdcardResp,
    prevNotReportingStuErrResp: languagesErrorResp,
  })

  useEffect(() => {
    const { prevUpdateStudentIdcardResp, prevNotReportingStuErrResp } = studentIdCardRef.current;
    if (updateStudentIdcardResp && prevUpdateStudentIdcardResp !== updateStudentIdcardResp) {
      toast.success('Id Card Added successfully.');
      studentIdCardForm.setValues({
        ...initialValues,
        academicYearId: studentIdCardForm.values.academicYearId,
      });
      history.push('/id-card');
    }
    else if (languagesErrorResp && languagesErrorResp !== prevNotReportingStuErrResp) {
      const { details } = languagesErrorResp || {};
      toast.error(details || "Something went wrong");
    }
    studentIdCardRef.current.prevUpdateStudentIdcardResp = updateStudentIdcardResp;
    studentIdCardRef.current.prevNotReportingStuErrResp = languagesErrorResp;
  }, [updateStudentIdcardResp, languagesErrorResp]);

  const studentIdCardForm = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const requestPayload = {
        studentId: values.studentId,
        branchId: values.branchId,
        bloodGroupId: values.bloodGroupId,
        academicYearId: values.academicYearId,
        smsPriorityNo: values.smsPriorityNo
      };
      const formData = new FormData();
      formData.append("request", JSON.stringify(requestPayload));
      if (values.studentPhotoFile) {
        formData.append("studentPhoto", values.studentPhotoFile);
      }
      dispatch(updateStudentIdCardAct(generateActionPayload("update_idcard", undefined, formData)));
    },
  });

  function handleFileUploadHnlr(event: any) {
    const { name } = event.target;
    const file = event.target.files[0];
    const errorMessage = uploadFileErrorHndlr(file.size, file.type);
    if (errorMessage) {
      studentIdCardForm.setFieldTouched(name, true, false);
      studentIdCardForm.setFieldValue(name, "", false);
      studentIdCardForm.setFieldValue(`${name}File`, "");
      studentIdCardForm.setFieldValue(`${name}PreviewUrl`, "");
      studentIdCardForm.setFieldError(name, errorMessage);
    } else {
      const previewUrl = URL.createObjectURL(file);
      const image = new Image();
      image.src = previewUrl;
      image.onload = () => {
        openCropModalState({
          imageName: file?.name,
          imageType: file.type,
          imageSrc: previewUrl || '',
          cropWidth: 208,
          cropHeight: 264,
          rotate: 0,
        })
      };
    }
  }

  function uploadCroppedImgHndlr(blobFile: any) {
    const { imageName } = cropModalState.modalData;
    const imgUrl = URL.createObjectURL(blobFile)
    const newImage = new File([blobFile], blobFile.name, { type: blobFile.type });
    studentIdCardForm.setValues((prevValues: any) => ({
      ...prevValues,
      studentPhoto: imageName,
      studentPhotoFile: newImage,
      studentPhotoPreviewUrl: imgUrl
    }))
    closeCropModalState();
  }

  function onInputSearchChange(inputString: string) {
    const { academicYearId } = studentIdCardForm.values;
    if (inputString && academicYearId) {
      const params = {
        branchId,
        academicYearId,
        searchString: inputString.trim(),
      };
      dispatch(getStuDetailsAct(generateActionPayload("get_student_details_id_card", undefined, params)));
    }
  }

  const debouncedSearch = debounce(onInputSearchChange, 1000);

  function selectedStudent(student: any) {
    if (student) {
      studentIdCardForm.setFieldValue("studentId", student.studentId);
      studentIdCardForm.setFieldValue("studentName", student.studentName);
      studentIdCardForm.setFieldValue("class", student.className);
      studentIdCardForm.setFieldValue("dateOfBirth", student.dob);
      studentIdCardForm.setFieldValue("parentName", student.parentName);
      studentIdCardForm.setFieldValue("section", student.sectionName);
      studentIdCardForm.setFieldValue("smsPriorityNo", student.smsPriorityNo);
      studentIdCardForm.setFieldValue("bloodGroupId", student.bloodGroupId);
      studentIdCardForm.setFieldValue("bloodGroupName", student.bloodGroupName);
      studentIdCardForm.setFieldValue("academicYearId", student.academicYearId);
      setSearchStudentState(student);
    }
  }

  useEffect(() => {
    if (!props?.id) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      studentIdCardForm.setFieldValue("academicYearId", yearId)
    }
  }, [academicYearListResp])

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "academicYearId") {
      studentIdCardForm.setValues((prev: any) => ({ ...prev, [name]: value }))
    } else {
      studentIdCardForm.setValues((prev: any) => ({ ...prev, [name]: value }))
    }
  }

  function handleStudentSearchChange(inputString: string) {
    if (!inputString) {
      studentIdCardForm.setValues({
        ...studentIdCardForm.values,
        studentId: "",
        class: "",
        dateOfBirth: "",
        parentName: "",
        section: "",
        smsPriorityNo: "",
        bloodGroupId: "",
        bloodGroupName: "",
      });
      setSearchStudentState(null);
    } else {
      debouncedSearch(inputString);
    }
  }

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="Academics" />
          <div className="card">
            <div className="card-body">
              <form onSubmit={studentIdCardForm.handleSubmit}>
                <div className="row g-3">
                  <div className="col-xs-12 col-md-6">
                    <SelectInput
                      name="academicYearId"
                      labelText="Academic Year"
                      value={studentIdCardForm.values.academicYearId}
                      onChange={filterHandler}
                      menuItems={academicYearListResp?.data}
                      isDisabled={props?.id && true}
                      valueKey="academicYearId"
                      textKey="academicYearName"
                      formgroupClassName="mb-0"
                      labelClass="required"
                      invalid={(studentIdCardForm.touched.academicYearId && studentIdCardForm.errors.academicYearId) ? true : false}
                      error={(studentIdCardForm.touched.academicYearId && studentIdCardForm.errors.academicYearId) ? studentIdCardForm.errors.academicYearId : ""}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <AutoSearchInputUpdated
                      formgroupClassName="search-box mb-4"
                      name="studentId"
                      placeHolder="Search..."
                      onChange={handleStudentSearchChange}
                      valueKey="studentId"
                      labelHeader="Student Code"
                      labelKey="studentCode"
                      subLabelHeader="Student Name"
                      subLabelKey="studentName"
                      labelText="Student"
                      labelClass="required"
                      options={Array.isArray(getStuDetailsResp) ? getStuDetailsResp : []}
                      selected={searchStudentState}
                      selectedOptionCallbck={selectedStudent}
                      invalid={studentIdCardForm.touched.studentId && studentIdCardForm.errors.studentId ? true : false}
                      error={studentIdCardForm.touched.studentId && studentIdCardForm.errors.studentId ? studentIdCardForm.errors.studentId : ""}
                    >
                      <i className="ri-search-line search-icon"></i>
                    </AutoSearchInputUpdated>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="col-6">
                        <div className="d-flex gap-2">
                          <div className="flex-grow-1">
                            <UploadFileInput
                              name="studentPhoto"
                              labelText="Student Photo"
                              formgroupClassName="mb-0"
                              labelClass="required"
                              value={studentIdCardForm.values.studentPhoto || ""}
                              onChange={handleFileUploadHnlr}
                              hideUploadBtn={true}
                              canRemove={false}
                              invalid={(studentIdCardForm.touched.studentPhoto && studentIdCardForm.errors.studentPhoto) ? true : false}
                              error={(studentIdCardForm.touched.studentPhoto && studentIdCardForm.errors.studentPhoto) ? studentIdCardForm.errors.studentPhoto : ""}
                            />
                          </div>
                          <div className="flex-shrink-0">
                            <div className={classNames("flex-shrink-0 preview-img ms-2 ", { "border border-2 rounded": !!studentIdCardForm.values.studentPhotoPreviewUrl })}>
                              <img src={studentIdCardForm.values.studentPhotoPreviewUrl || ImgPreview} style={{ height: "100px", width: "100px" }} className="img-fluid" />
                            </div>
                          </div>
                        </div>
                        <span className="text-danger fw-bold">
                          *Preferably Digital Photograph of 1 MB Size
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <TextInput
                      name="class"
                      formgroupClassName="mb-0"
                      labelText="Class"
                      value={studentIdCardForm.values.class}
                      onChange={() => { }}
                      isReadOnly={true}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <TextInput
                      name="dateOfBirth"
                      formgroupClassName="mb-0"
                      labelText="DOB"
                      value={studentIdCardForm.values.dateOfBirth}
                      onChange={() => { }}
                      isReadOnly={true}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <TextInput
                      name="parentName"
                      formgroupClassName="mb-0"
                      labelText="Parent Name"
                      value={studentIdCardForm.values.parentName}
                      onChange={() => { }}
                      isReadOnly={true}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <TextInput
                      name="section"
                      formgroupClassName="mb-0"
                      labelText="section"
                      value={studentIdCardForm.values.section}
                      onChange={() => { }}
                      isReadOnly={true}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <TextInput
                      name="bloodGroupId"
                      formgroupClassName="mb-0"
                      labelText="Blood Group"
                      value={studentIdCardForm.values.bloodGroupName}
                      onChange={() => { }}
                      isReadOnly={true}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <TextInput
                      name="smsPriorityNo"
                      formgroupClassName="mb-0"
                      labelText="Emergency Contact No"
                      value={studentIdCardForm.values.smsPriorityNo}
                      onChange={() => { }}
                      isReadOnly={true}
                    />
                  </div>
                  <div className="col-12">
                    <p className="m-0">
                      <span className="text-danger fw-bold">
                        Note : Only Blood Group and Emergency Contact Numbers are
                        editable. For other details, corrections please contact
                        admission counselor
                      </span>
                    </p>
                  </div>
                  <div className="col-12 justify-content-center d-grid mt-4 mb-1">
                    <div className="row gap-2">
                      <div className="col-12">
                        <button
                          type="submit"
                          className={`btn btn-success w-100`}
                          disabled={showApiLoader}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              <div className="shadow-lg p-3 my-5 bg-white rounded">
                <p className="align-items-baseline text-center fs-18 mb-0 ps-md-4">Guidelines For Scanning Uploading Photgraph</p>
                <p className="text-muted align-items-baseline fs-15 mb-0 ps-md-4">
                  Before applying online a candidate will be required to have a scanned (digital) image of his/her photograph as per the specifications given below.
                </p>
                <div className="text-muted align-items-baseline fs-15 mb-0 opacity-75">
                  <ol>
                    <li>
                      Photograph must be a recent passport size Color photograph in uniform.
                    </li>
                    <li>
                      Make sure that the picture is in colour, taken against a light-coloured, preferably white, background.
                    </li>
                    <li>
                      Look straight at the camera with a relaxed face.
                    </li>
                    <li>
                      If you wear glasses make sure that there are no reflections and your eyes can be clearly seen.
                    </li>
                    <li>
                      Caps, hats and dark glasses are not acceptable. Religious headwear is allowed but it must not cover your face.
                    </li>
                    <li>
                      Dimensions 200 x 230 pixels (preferred).
                    </li>
                    <li>
                      Ensure that the size of the scanned image is not more than 1 MB. If the size of the file is more than 1 MB, then adjust the settings and upload.
                    </li>
                    <li>
                      The image file should be JPG or JPEG format. An example file name is : image01.jpg or image01.jpeg Image dimensions can be checked by listing the folder files or moving the mouse over the file image icon. Note : Candidates using MS Windows/MSOffice can easily obtain photo and signature in .jpeg format not exceeding 1 MB respectively by using MS Paint or MSOffice Picture Manager. Scanned photograph in any format can be saved in .jpg format by using Save As option in the File menu and size can be reduced below 1 MB(photograph) by using crop and then resize option age menu. Similar options are available in other photo editor also. If the file size and format are not as prescribed, an error message will be displayed.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="upload-new-image-modal"
        isOpen={cropModalState.showModal}
        toggle={closeCropModalState}
        modalTitle={"Upload Image"}
        modalSize="md"
      >
        <CropModal
          closeModalHndler={closeCropModalState}
          modalData={cropModalState.modalData}
          uploadCroppedImgHndlr={uploadCroppedImgHndlr}
        />
      </ModalContainerUpdated>
    </>
  );
};
export default AddStudentIdCard;