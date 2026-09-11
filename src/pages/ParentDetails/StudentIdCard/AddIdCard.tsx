import { useFormik } from "formik";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { CropModal, FileUpload, ModalContainerUpdated, PhoneInput, SelectInput, TextInput, UploadFileInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { getBloodGroupAct } from "../../../store/masterdata/masterdataactions";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import ImgPreview from "../../../assets/imagesdps/directory/image_preview.png";
import * as Yup from 'yup';
import { validateDimension, uploadFileErrorHndlr/*, createPaymentPayload*/} from "./helper";
import classNames from "classnames";
import { previewStudentIdCardAct, studentsIdCardAct, updateStudentIdCardAct } from "../../../store/academic/languages/languagesactions";
import { toast } from "react-toastify";
import { useModal } from "../../../hooks/modalhook";
import PreviewIdCard from "./PreviewIdCard";
// import { createJodoOrder } from "../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
// import { idCardAmountAct } from "../../../store/academic/notreportingstudents/notreportingstudentsactions";
// import { feePaymentAct } from "../../../store/fee/feecollections/feecollectionactions";
// import { instituteCodeOptions, PaymentGatewayTypes } from "../../../Components/constants/common";
// import { enableCCAvenueHandler } from "../../../utility/commonutility";
// import { getPaymentGatewaysBranchListAct } from "../../../store/mastersettings/feesettings/feesettingsactions";
import Button from "../../../Components/Common/Button";

function setFormData(studentData?: any) {
  return ({
    idCardNo: "",
    studentId: "",
    branchId: "",
    bloodGroupId: "",
    academicYearId: "",
    parentName: "",
    smsPriorityNo: "",
    studentPhoto: "",
    studentPhotoFile: "",
    studentPhotoPreviewUrl: "",
  })
}

const initialValues = setFormData();
const validationSchema = Yup.object().shape({
  smsPriorityNo: Yup.string().required('Emergency Contact Number is required.'),
  bloodGroupId: Yup.string().required('Blood group is required.'),
  studentPhoto: Yup.string().required('Student photo is required.'),
})

const AddIdCard = (props: any) => {
  const dispatch = useAppDispatch();
  const { modalState: previewModalState, closeModal: closePreviewModalHndlr,
    openModal: openPreviewModalHndlr
  } = useModal();
  const { closeModal: closeCropModalState, modalState: cropModalState, openModal: openCropModalState } = useModal()
  // const [paymentInfoState, setPaymentInfoState] = useState({
  //   ccavenueUrl: "",
  //   payloadData: "",
  //   accessCode: "",
  // });
  const paymentGatewayTypeRef = useRef('');
  const { showApiLoader, currentInstIdResp: instituteId,
    currentStudentId, parentChildrensResp, studentsIdcardResp,
    updateStudentIdcardResp, languagesErrorResp, /*createJodoOrderResp,*/
    bloodGroupResp/*, getIdCardAmountResp, feePaymentResp, getPaymentGatewaysBranchListResp*/ } =
    useAppSelector(({ appData, globalData, masterData, directoryStudent, /* feeCollections, instFeeSettings, */languagesInfo /*, applicationSale, notReportingStu*/ }) => ({
      showApiLoader: globalData.showApiLoader,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      bloodGroupResp: masterData.bloodGroupResp,
      currentStudentId: appData.currentStudentId,
      parentChildrensResp: directoryStudent.parentChildrensResp,
      studentsIdcardResp: languagesInfo.studentsIdcardResp,
      updateStudentIdcardResp: languagesInfo.updateStudentIdcardResp,
      // createJodoOrderResp: applicationSale.createJodoOrderResp,
      // getIdCardAmountResp: notReportingStu.getIdCardAmountResp,
      languagesErrorResp: languagesInfo.languagesErrorResp,
      // feePaymentResp: feeCollections.feePaymentResp,
      // getPaymentGatewaysBranchListResp:
      // instFeeSettings.getPaymentGatewaysBranchListResp,
    }), shallowEqual);

  // const { isJodoEnabled, isCcAvenueEnabled, isEasyBuzzEnabled } = useMemo(() => {
  //   const pgs = getPaymentGatewaysBranchListResp?.[0]?.pgs ?? [];
  //   return {
  //     isJodoEnabled: pgs.some((pg: any) => pg.pgName === PaymentGatewayTypes.JODO),
  //     isCcAvenueEnabled: pgs.some((pg: any) => pg.pgName === PaymentGatewayTypes.CCAVENUE),
  //     isEasyBuzzEnabled: pgs.some((pg: any) => pg.pgName === PaymentGatewayTypes.EASEBUZZ),
  //   };
  // }, [getPaymentGatewaysBranchListResp]);

  useEffect(() => {
    dispatch(getBloodGroupAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "blood-group", sortBy: "bloodGroupName", orderBy: "asc", pageNo: 0, pageSize: 100 })));
  }, []);

  const studentIdCardRef = useRef({
    prevStudentsIdcardResp: studentsIdcardResp,
    prevUpdateStudentIdcardResp: updateStudentIdcardResp,
    // prevCreateJodoOrderResp: createJodoOrderResp,
    prevLanguagesErrorResp: languagesErrorResp,
    // prevFeePaymentResp: feePaymentResp,
  })

  useEffect(() => {
    const { prevStudentsIdcardResp, prevUpdateStudentIdcardResp, /*prevCreateJodoOrderResp,*/ prevLanguagesErrorResp,
      // prevFeePaymentResp
    } = studentIdCardRef.current || {};
    if (studentsIdcardResp && prevStudentsIdcardResp !== studentsIdcardResp) {
      const list = studentsIdcardResp?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        const {studentMobileNo, idCadrNo, studentImage, bloodGroup, parentName } = list[0];
        const { bloodGroupId = "" } = bloodGroupResp?.data?.find((item: any) => item.bloodGroupName === bloodGroup) || {};
        studentIdCardForm.setValues((prevValues: any) => ({
          ...prevValues,
          idCardNo: idCadrNo,
          smsPriorityNo: studentMobileNo,
          bloodGroupId,
          studentPhotoPreviewUrl: studentImage,
          parentName: parentName || "",
        }));
      }
    } else if (updateStudentIdcardResp && prevUpdateStudentIdcardResp !== updateStudentIdcardResp) {
      toast.success("Student id card updated successfully.");
      studentIdCardForm.setFieldValue("idCardNo", updateStudentIdcardResp?.idCardNo);
      // const amount = Array.isArray(getIdCardAmountResp) && getIdCardAmountResp.length > 0 ? getIdCardAmountResp[0]?.settingValue : 0;
      // const paymentPayload = createPaymentPayload({
      //   ...studentIdCardForm.values, ...selectedChild, id: updateStudentIdcardResp?.idCardNo, amount,
      //   gateWayType: paymentGatewayTypeRef.current
      // });
      // dispatch(createJodoOrder(generateActionPayload("jodo_order_pay", undefined, paymentPayload)));
    // } else if (createJodoOrderResp && createJodoOrderResp !== prevCreateJodoOrderResp) {
    //   const { data } = createJodoOrderResp;
    //   if (paymentGatewayTypeRef.current === PaymentGatewayTypes.JODO) {
    //     if (data?.redirect_url) {
    //       window.location.assign(data?.redirect_url);
    //     } else {
    //       toast.error("Something went wrong.");
    //     }
    //     paymentGatewayTypeRef.current = "";
    //   } else {
    //     if (data?.order_id) {
    //       const studentDetails: any = parentChildrensResp?.find((i: any) => +i?.childId === +currentStudentId);
    //       const paymentPayload = {
    //         orderRef: data?.order_id,
    //         branchId: studentDetails?.childBranchId,
    //         amount: import.meta.env.VITE_ENVIRONMENT === "dev" ? "1.0" : "200.0",
    //         identifier: {
    //           type: "STUDENT_CODE",
    //           value: studentDetails?.childCode,
    //           studentId: studentDetails?.childId
    //         },
    //         mobileNumber: studentDetails?.smsPriorityNo,
    //         email: studentDetails?.emailId,
    //         studentName: studentDetails?.childName?.trim(),
    //         pgName: paymentGatewayTypeRef.current,
    //         // callbackUrl: `${window.location.origin}/paymentstatus/${studentDetails?.childBranchId}`,
    //         callbackUrl: `${import.meta.env.VITE_APPLICATION_URL}/studentidcardpaymentstatus/${studentDetails?.childBranchId}`,
    //         redirectUrl: `${window.location.origin}/student-id-card`
    //       };
    //       dispatch(feePaymentAct(generateActionPayload("ccavenue_fee_payment", undefined, paymentPayload)));
    //     } else {
    //       toast.error("Something went wrong.");
    //     }
    //   }
    } else if (languagesErrorResp && prevLanguagesErrorResp !== languagesErrorResp) {
      const { message, details } = languagesErrorResp;
      toast.error(details || "Something went wrong.");
    // } else if (feePaymentResp && prevFeePaymentResp !== feePaymentResp) {
    //   const { encRequest, accessCode, actionUrl } = feePaymentResp;
    //   if (paymentGatewayTypeRef.current === PaymentGatewayTypes.EASEBUZZ) {
    //     if (actionUrl) {
    //       window.location.assign(actionUrl);
    //     } else {
    //       toast.error("Something went wrong.");
    //     }
    //   } else if (paymentGatewayTypeRef.current === PaymentGatewayTypes.CCAVENUE) {
    //     setPaymentInfoState({
    //       ccavenueUrl: actionUrl,
    //       payloadData: encRequest,
    //       accessCode: accessCode,
    //     });
    //   }
    //   paymentGatewayTypeRef.current = "";
    }
    studentIdCardRef.current.prevStudentsIdcardResp = studentsIdcardResp;
    studentIdCardRef.current.prevUpdateStudentIdcardResp = updateStudentIdcardResp;
    // studentIdCardRef.current.prevCreateJodoOrderResp = createJodoOrderResp;
    studentIdCardRef.current.prevLanguagesErrorResp = languagesErrorResp;
    // studentIdCardRef.current.prevFeePaymentResp = feePaymentResp;
  }, [bloodGroupResp, studentsIdcardResp, updateStudentIdcardResp, /*createJodoOrderResp, */
    // feePaymentResp,
    languagesErrorResp]);

  const selectedChild = useMemo(() => {
    if (Array.isArray(parentChildrensResp) && parentChildrensResp.length > 0) {
      return parentChildrensResp.find(item => item.childId?.toString() === currentStudentId?.toString());
    }
    return {};
  }, [parentChildrensResp, currentStudentId]);

  // useEffect(() => {
  //   const { childBranchId: branchId, instituteId } = selectedChild || {};
  //   if (branchId && instituteId) {
  //     const payload = {
  //       instituteId,
  //       branchId,
  //     };
  //     dispatch(getPaymentGatewaysBranchListAct(generateActionPayload("get_payment_gateways_branches_list", undefined, payload)));
  //   }
  // }, [selectedChild]);

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
        // idCardStatus: "INPROGRESS",
        smsPriorityNo: values.smsPriorityNo
      };
      const formData = new FormData();
      formData.append("request", JSON.stringify(requestPayload));
      if (values.studentPhotoFile) {
        formData.append("studentPhoto", values.studentPhotoFile);
      }
      // if (!paymentGatewayTypeRef.current) {
      //   paymentGatewayTypeRef.current = PaymentGatewayTypes.JODO;
      // }
      dispatch(updateStudentIdCardAct(generateActionPayload("update_idcard", undefined, formData)));
    },
  });

  useEffect(() => {
    if (selectedChild && bloodGroupResp) {
      const { bloodGroup } = selectedChild,
        { data } = bloodGroupResp;
      const { bloodGroupId = "" } = data?.find((item: any) => item.bloodGroupName === bloodGroup) || {};
      studentIdCardForm.setValues(prevValues => ({
        ...prevValues,
        branchId: selectedChild?.childBranchId,
        bloodGroupId,
        studentId: selectedChild?.childId,
        smsPriorityNo: selectedChild?.smsPriorityNo,
        academicYearId: selectedChild?.academicYearId
      }));
      dispatch(studentsIdCardAct(generateActionPayload("get_students_idcard", undefined, {
        academicYearId: selectedChild?.academicYearId, branchId: selectedChild?.childBranchId,
        searchString: selectedChild?.childCode, pageNo: 0, pageSize: 1
      })));
      // dispatch(idCardAmountAct(generateActionPayload("get_id_card_amount", undefined, { instituteId, branchId: selectedChild?.childBranchId, settingKey: "ID_CARD", })));
    }
  }, [selectedChild, bloodGroupResp]);


  function handleFileUploadHnlr(event: any) {
    const { name } = event.target;
    const file = event.target.files[0];
    event.currentTarget.value = null
    const errorMessage = uploadFileErrorHndlr(file.size, file.type);
    if (errorMessage) {
      studentIdCardForm.setFieldTouched(name, true, false);
      studentIdCardForm.setFieldValue(name, "", false);
      studentIdCardForm.setFieldValue(`${name}File`, "", false);
      studentIdCardForm.setFieldValue(`${name}PreviewUrl`, "", false);
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
      }
    }
  }

  function onChangePhoneInput(phoneNumber: string, otherData: any, event: any) {
    const { target } = event, { name } = target || {},
      updateDate = phoneNumber.substring(2);
    studentIdCardForm.setFieldValue(name, updateDate);
  }

  function previewHandler() {
    const { idCardNo } = studentIdCardForm.values;
    if (idCardNo) {
      openPreviewModalHndlr(idCardNo);
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

  // function handleCcAvenuePayment() {
  //   paymentGatewayTypeRef.current = PaymentGatewayTypes.CCAVENUE;
  //   studentIdCardForm.handleSubmit();
  // }

  // function easeBuzzPaymentHandler() {
  //   paymentGatewayTypeRef.current = PaymentGatewayTypes.EASEBUZZ;
  //   studentIdCardForm.handleSubmit();
  // }

  // const paymentFormRef = useRef<any>(null);
  // useEffect(() => {
  //   const { ccavenueUrl,
  //     payloadData,
  //     accessCode } = paymentInfoState;
  //   if (ccavenueUrl && payloadData && accessCode) {
  //     paymentFormRef?.current?.submit();
  //   }
  // }, [paymentInfoState]);

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="Parent" title="Id Card" />
          <div className="tw-rounded-lg tw-border tw-border-gray-200 tw-bg-white tw-shadow-sm tw-mb-6">
            <div className="tw-p-5">
              <form onSubmit={studentIdCardForm.handleSubmit}>
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                  <div className="tw-col-span-12 md:tw-col-span-6">
                    <TextInput
                      name="studentId"
                      formgroupClassName="tw-mb-0"
                      labelText="Student Id"
                      value={selectedChild?.childCode}
                      onChange={() => { }}
                      isReadOnly={true}
                    />
                  </div>
                  <div className="tw-col-span-12 md:tw-col-span-6">
                    <TextInput
                      name="studentName"
                      formgroupClassName="tw-mb-0"
                      labelText="Student Name"
                      value={selectedChild?.childName}
                      onChange={() => { }}
                      isReadOnly={true}
                    />
                  </div>
                  <div className="tw-col-span-12 md:tw-col-span-6">
                    <TextInput
                      name="class"
                      formgroupClassName="tw-mb-0"
                      labelText="Class"
                      value={selectedChild?.classShortName}
                      onChange={() => { }}
                      isReadOnly={true}
                    />
                  </div>
                  <div className="tw-col-span-12 md:tw-col-span-6">
                    <TextInput
                      name="dateOfBirth"
                      formgroupClassName="tw-mb-0"
                      labelText="DOB"
                      value={selectedChild?.dob || "-"}
                      onChange={() => { }}
                      isReadOnly={true}
                    />
                  </div>
                  <div className="tw-col-span-12 md:tw-col-span-6">
                    <TextInput
                      name="parentName"
                      formgroupClassName="tw-mb-0"
                      labelText="Parent Name"
                      value={studentIdCardForm.values.parentName || selectedChild?.parentName || "-"}
                      onChange={() => { }}
                      isReadOnly={true}
                    />
                  </div>
                  <div className="tw-col-span-12 md:tw-col-span-6">
                    <TextInput
                      name="section"
                      formgroupClassName="tw-mb-0"
                      labelText="section"
                      value={selectedChild?.sectionName || "-"}
                      onChange={() => { }}
                      isReadOnly={true}
                    />
                  </div>
                  <div className="tw-col-span-12 md:tw-col-span-6">
                    <SelectInput
                      name="bloodGroupId"
                      labelText="Blood Group"
                      formgroupClassName="tw-mb-0"
                      labelClass="required"
                      value={studentIdCardForm.values.bloodGroupId}
                      onChange={studentIdCardForm.handleChange}
                      onBlur={studentIdCardForm.handleBlur}
                      menuItems={bloodGroupResp?.data}
                      valueKey="bloodGroupId"
                      textKey="bloodGroupName"
                      invalid={(studentIdCardForm.touched.bloodGroupId && studentIdCardForm.errors.bloodGroupId) ? true : false}
                      error={(studentIdCardForm.touched.bloodGroupId && studentIdCardForm.errors.bloodGroupId) ? studentIdCardForm.errors.bloodGroupId : ""}
                    />
                  </div>
                  <div className="tw-col-span-12 md:tw-col-span-6">
                    <PhoneInput
                      name="smsPriorityNo"
                      labelText="Emergency Contact No"
                      labelClass="required"
                      inputClassName="ng-input"
                      formgroupClassName="tw-mb-0"
                      value={studentIdCardForm.values.smsPriorityNo}
                      onChange={onChangePhoneInput}
                      onBlur={studentIdCardForm.handleBlur}
                      invalid={(studentIdCardForm.touched.smsPriorityNo && studentIdCardForm.errors.smsPriorityNo) ? true : false}
                      error={(studentIdCardForm.touched.smsPriorityNo && studentIdCardForm.errors.smsPriorityNo) ? studentIdCardForm.errors.smsPriorityNo : ""}
                    />
                  </div>
                  <div className="tw-col-span-12">
                    <p className="tw-m-0">
                      <span className="tw-text-red-500 tw-font-bold">
                        Note : Only Blood Group and Emergency Contact Numbers are editable. For other details, corrections please contact admission counselor
                      </span>
                    </p>
                  </div>
                  <div className="tw-col-span-12 md:tw-col-span-6">
                    <div className="tw-flex tw-gap-2">
                      <div className="tw-flex-1">
                        <UploadFileInput
                          name="studentPhoto"
                          labelText="Student Photo"
                          formgroupClassName="tw-mb-0"
                          value={studentIdCardForm.values.studentPhoto || ""}
                          onChange={handleFileUploadHnlr}
                          hideUploadBtn={true}
                          canRemove={false}
                          invalid={(studentIdCardForm.touched.studentPhoto && studentIdCardForm.errors.studentPhoto) ? true : false}
                          error={(studentIdCardForm.touched.studentPhoto && studentIdCardForm.errors.studentPhoto) ? studentIdCardForm.errors.studentPhoto : ""}
                        />
                      </div>
                      <div className="tw-flex-shrink-0">
                        <div className={classNames("tw-flex-shrink-0 tw-ml-2", {
                          "tw-border-2 tw-border-gray-300 tw-rounded": !!studentIdCardForm.values.studentPhotoPreviewUrl
                        })}>
                          <img
                            src={studentIdCardForm.values.studentPhotoPreviewUrl || ImgPreview}
                            style={{ height: "100px", width: "100px" }}
                            className="tw-max-w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <span className="tw-text-red-500 tw-font-bold">
                      *Preferably Digital Photograph of 1 MB Size
                    </span>
                  </div>
                  <div className="tw-col-span-12 tw-flex tw-justify-center tw-items-center tw-flex-wrap tw-gap-4 tw-mt-4 tw-mb-1">
                    {/* {isJodoEnabled && <button
                      type="submit"
                      className="btn btn-success tw-text-nowrap"
                      disabled={showApiLoader}
                    >
                      Pay Through Jodo
                    </button>}
                    {isCcAvenueEnabled && <button
                      type="button"
                      className="btn btn-success tw-text-nowrap"
                      onClick={handleCcAvenuePayment}
                      disabled={showApiLoader}
                    >
                      Pay Through Kotak
                    </button>}
                    {isEasyBuzzEnabled && <button
                      type="button"
                      className="btn btn-success tw-text-nowrap"
                      onClick={easeBuzzPaymentHandler}
                      disabled={showApiLoader}
                    >
                      Pay Through Easebuzz
                    </button>} */}
                    {!studentIdCardForm.values.idCardNo && (
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={showApiLoader}
                      >
                        Submit
                      </Button>
                    )}

                    {studentIdCardForm.values.idCardNo && (
                      <Button
                        type="button"
                        variant="soft"
                        className="!tw-border-none tw-text-gray-500 hover:tw-underline tw-px-4 tw-py-2 disabled:tw-opacity-50"
                        onClick={previewHandler}
                        disabled={showApiLoader}
                      >
                        Preview
                      </Button>
                    )}
                  </div>
                </div>
              </form>

              <div className="tw-p-3 tw-my-5 tw-bg-white tw-rounded">
                <p className="tw-text-center tw-text-lg tw-mb-0 md:tw-pl-4">Guidelines For Scanning Uploading Photgraph</p>
                <p className="tw-text-gray-500 tw-text-[15px] tw-mb-0 md:tw-pl-4">
                  Before applying online a candidate will be required to have a scanned (digital) image of his/her photograph as per the specifications given below.
                </p>
                <div className="tw-text-gray-500 tw-text-[15px] tw-mb-0 tw-opacity-75">
                  <ol className="tw-pl-5 tw-mt-2 tw-space-y-1">
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
      {/* <form id="nonseamless" ref={paymentFormRef} method="post" name="redirect"
        action={paymentInfoState.ccavenueUrl}>
        <input type="hidden" id="encRequest" name="encRequest" value={paymentInfoState.payloadData} />
        <input type="hidden" name="access_code" id="access_code" value={paymentInfoState.accessCode} />
      </form> */}

      <ModalContainerUpdated
        id="changepassword-modal"
        isOpen={previewModalState.showModal}
        modalTitle="Preview Student Id Card"
        toggle={closePreviewModalHndlr}
        modalSize="md"
      >
        <PreviewIdCard
          idCardNo={previewModalState.modalData}
          isOpen={previewModalState.showModal}
        />
      </ModalContainerUpdated>
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
    </React.Fragment>
  );
};
export default AddIdCard;