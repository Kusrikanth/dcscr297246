import React, { useEffect, useMemo, useRef } from 'react';
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import {
  ModalContainerUpdated, SelectInput, TextArea, TextInput,
  UploadFileCommunication,
} from '../../../../Components/Common';
import { useFormik } from 'formik';
import {
  extractMediaTypesFromTemplates,
  staffCategoryNamesFromIds,
  studentTypeOptions,
  validateUploadByMedia,
} from './helper';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { shallowEqual } from 'react-redux';
import { getWhatsappTemplatesAct, sendWhatsappMessageAct, uploadWhatsappMediaAct } from '../../../../store/communication/communicationactions';
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { getInstBranchesAct } from '../../../../store/mastersettings/branch/branchactions';
import { toPascalCase } from '../../../../utility/commonutility';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Attachment02StrokeStandard,
  UserGroupIcon,
} from "@hugeicons-pro/core-stroke-standard";
import AudienceSelector from './AudienceSelector';
import { useModal } from '../../../../hooks/modalhook';
import { ArrowRight02Icon } from '@hugeicons-pro/core-solid-standard';
import { twMerge } from 'tailwind-merge';
import { FormFeedback } from "reactstrap";
import { useHistory } from 'react-router-dom';
import Button from '../../../../Components/Common/Button';
const initialValues: any = {
  title: "",
  templateId: "",
  templateName: "",
  templateMessage: "",
  msgBody: "",
  mediaType: "",
  communicationModes: ["WhatsApp"],
  uploadedFileName: "",
  uploadedFile: undefined,
  uploadedFileId: undefined,
  uploadedFileUrl: undefined,
  parentCategory: ["primaryContact"],
  isAudienceSelected: false,
};

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  templateName: Yup.string().required('Template Name is required'),
  msgBody: Yup.string().required('Description is required'),
  uploadedFileId: Yup.mixed<File | null>()
    .test('uploadFileValidation', 'Invalid attachment.', function (value: any) {
      const { mediaType, uploadedFile } = this.parent || {};
      const { valid, message } = validateUploadByMedia(mediaType, uploadedFile, value);
      if (!valid) {
        return this.createError({ message: message || 'Invalid attachment.' });
      }
      return true;
    }),
  isAudienceSelected: Yup.boolean()
    .oneOf([true], 'Please select target audience.')
});



const ComposeMessage = (props: any) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [mediaTypes, setMediaTypes] = React.useState<any[]>([]);
  const { closeModal: closeAudienceModalHandler,
    modalState: audienceModalState, openModal: openAudienceModalHandler } = useModal();
  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    branchListResp,
    uploadWhatsappMediaResp,
    whatsappTemplatesResp,
    sendWhatsappMessageResp,
    communicationErrorResp,
    whatsAppNotificationValidateStudentsResp
  } = useAppSelector(({ appData, branch, globalData, communication }) => ({
    currentInstIdResp: appData.currentInstIdResp,
    currentBranchIdResp: appData.currentBranchIdResp,
    showApiLoader: globalData.showApiLoader,
    branchListResp: branch.branchListResp,
    uploadWhatsappMediaResp: communication.uploadWhatsappMediaResp,
    whatsappTemplatesResp: communication.whatsappTemplatesResp,
    sendWhatsappMessageResp: communication.sendWhatsappMessageResp,
    communicationErrorResp: communication.communicationErrorResp,
    whatsAppNotificationValidateStudentsResp: communication.whatsAppNotificationValidateStudentsResp,
  }), shallowEqual);

  const audienceSelectorRef = useRef<any>(null);

  const composeModalRespRef = useRef({
    prevWhatsappTemplatesResp: whatsappTemplatesResp,
    prevUploadWhatsappMediaResp: uploadWhatsappMediaResp,
    prevSendWhatsappMessageResp: sendWhatsappMessageResp,
    prevCommunicationErrorResp: communicationErrorResp
  });

  useEffect(() => {
    const { prevWhatsappTemplatesResp, prevUploadWhatsappMediaResp, prevSendWhatsappMessageResp, prevCommunicationErrorResp } = composeModalRespRef.current || {};
    if (whatsappTemplatesResp && prevWhatsappTemplatesResp !== whatsappTemplatesResp) {
      const mediaTypesFromTemplates = extractMediaTypesFromTemplates(whatsappTemplatesResp),
        defaultMediaType = whatsappTemplatesResp.find((item: any) => item.templateType === 'NONE');
      setMediaTypes(mediaTypesFromTemplates);
      if (defaultMediaType) {
        const { templateMsg, templateName, templateId } = defaultMediaType || {};
        addUserDefinedTemplate.setValues((prev: any) => ({
          ...prev,
          templateMessage: templateMsg,
          templateName,
          templateId,
          mediaType: defaultMediaType.templateType
        }));
      }
    } else if (uploadWhatsappMediaResp && prevUploadWhatsappMediaResp !== uploadWhatsappMediaResp) {
      const { id, s3Url } = uploadWhatsappMediaResp || {};
      addUserDefinedTemplate.setValues((prev: any) => ({
        ...prev,
        uploadedFileId: id,
        uploadedFileUrl: s3Url,
        uploadedFile: null,
      }));
    } else if (sendWhatsappMessageResp && prevSendWhatsappMessageResp !== sendWhatsappMessageResp) {
      const toastId = toast.loading("Message submission in progress...");
      const isHostelPage = location.pathname.includes(
        "/hostel-whatsapp-notifications"
      );

      setTimeout(() => {
        toast.update(toastId, {
          render: "Message Sent Successfully.",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        history.push({
          pathname: isHostelPage
            ? "/hostel-whatsapp-notifications"
            : "/whatsapp-notifications",
          state: {
            refreshWhatsappNotifications: true,
          },
        });
        props.toggleModal?.(true);
      }, 5000);
    } else if (communicationErrorResp && prevCommunicationErrorResp !== communicationErrorResp) {
      const { message, details } = communicationErrorResp;
      toast.error(message || details || "Something went wrong.");
    }
    composeModalRespRef.current.prevWhatsappTemplatesResp = whatsappTemplatesResp;
    composeModalRespRef.current.prevUploadWhatsappMediaResp = uploadWhatsappMediaResp;
    composeModalRespRef.current.prevSendWhatsappMessageResp = sendWhatsappMessageResp;
    composeModalRespRef.current.prevCommunicationErrorResp = communicationErrorResp;
  }, [whatsappTemplatesResp, uploadWhatsappMediaResp, sendWhatsappMessageResp, communicationErrorResp]);


  useEffect(() => {
    if (branchId) {
      dispatch(getWhatsappTemplatesAct(generateActionPayload("whatsapp_templates_v1", { branchId }, {
        moduleName: 'POST_ADMISSION'
      })));
    }
  }, [branchId]);

  useEffect(() => {
    if (instituteId) {
      dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, {
        pageSize: 100, pageNo: 0, instituteId,
      })));
    }
  }, [instituteId]);

  const branchInfo = useMemo(() => {
    const { data = [] } = branchListResp || {};
    return data.find((branch: any) => branch.branchId === +branchId);
  }, [branchListResp, instituteId, branchId]);

  const manualStudentIds = useMemo(() => {
    return whatsAppNotificationValidateStudentsResp?.data?.data?.map((item: any) => item?.studentId) || [];
  }, [whatsAppNotificationValidateStudentsResp]);

  const addUserDefinedTemplate = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { curriculumState, studentType, employeeType, recipientType, employeeCategory, studentIds, employeeIds } = audienceSelectorRef.current || {};
      const selectedSectionIds: any = [];
      const selectedStudentIds: any = [];
      const selectedEmployeeIds: any = [];
      curriculumState.forEach((curriculum: any) => {
        curriculum.classes.forEach((cls: any) => {
          cls.sections.forEach((section: any) => {
            if (section.isSelected) {
              selectedSectionIds.push(section.sectionId);
            }
          });
        });
      });
      if (studentIds.length > 0) {
        const studentId = studentIds.map((student: any) => student.id);
        selectedStudentIds.push(...studentId);
      }
      if (employeeIds.length > 0) {
        const employeeId = employeeIds.map((employee: any) => employee.id);
        selectedEmployeeIds.push(...employeeId);
      }
      const payload: any = {
        instituteId: instituteId,
        branchId: branchId,
        module: location.pathname === "/hostel-whatsapp-notifications/compose"
          ? "HOSTEL"
          : "FEE",
        title: values.title,
        mediaType: values.mediaType,
        templateName: values.templateName,
        queryParam1: toPascalCase(recipientType),
        queryParam2: toPascalCase(branchInfo?.branchName),
        queryParam3: values.msgBody.replace(/[\r\n]+/g, " "),
        filesIds: values.uploadedFileId ? [values.uploadedFileId] : [],
        communicationModes: values.communicationModes,
        recipientType: recipientType,
        pageNo: 0,
        pageSize: 50000
      }
      if (recipientType === 'PARENT') {
        if (studentType === 'all-student') {
          payload.parentDetails = {
            sections: selectedSectionIds,
            studentIds: [],
          };
        }
        else if(studentType === 'manual-entry'){
          payload.parentDetails = {
            section: [],
            studentIds: manualStudentIds,
          }
        }
        else {
          payload.parentDetails = {
            section: [],
            studentIds: selectedStudentIds,
          }
        }
      } else if (recipientType === 'STAFF') {
        if (employeeType === 'all-employee') {
          payload.staffDetails = {
            categories: employeeCategory,
            employeeIds: [],
          };
        }
        else {
          payload.staffDetails = {
            categories: [],
            employeeIds: selectedEmployeeIds,
          };
        }
      }
      dispatch(sendWhatsappMessageAct(generateActionPayload("send_whatsapp_message", undefined, payload)));
    },
  });

  function onChangeMediaTypeHndlr(event: React.ChangeEvent<HTMLSelectElement>) {
    const { name, value } = event.target;
    const template = whatsappTemplatesResp?.find((item: any) => item.templateType === value);
    const { templateMsg = "", templateName = "", templateId = "" } = template ?? {};
    addUserDefinedTemplate.setValues((prev: any) => ({
      ...prev,
      templateMessage: templateMsg,
      templateName,
      templateId,
      uploadedFile: null,
      uploadedFileName: "",
      [name]: template ? value : ""
    }));
  }

  function onChangeFileHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const { name } = input;
    const file = input.files?.[0] ?? null;
    if (!file) return;
    addUserDefinedTemplate.setFieldTouched(name, true, false);
    addUserDefinedTemplate.setValues((prevValues: any) => ({
      ...prevValues,
      [name]: file,
      uploadedFileName: file.name,
      uploadedFileId: undefined,
      uploadedFileUrl: undefined,
    }))
  }

  function uploadFileHandler() {
    const { mediaType, uploadedFile } = addUserDefinedTemplate.values;
    const formData = new FormData();
    formData.append("file", uploadedFile);
    dispatch(uploadWhatsappMediaAct(generateActionPayload("upload_whatsapp_media", {
      branchId,
      mediaType,
    }, formData)));

  }

  function selectAudienceHandler(audience: any) {
    addUserDefinedTemplate.setFieldValue('isAudienceSelected', Boolean(audience?.recipientType), true);
    audienceSelectorRef.current = audience;
    closeAudienceModalHandler();
  }

  function removeFileHandler() {
    addUserDefinedTemplate.setValues((prevValues: any) => ({
      ...prevValues,
      uploadedFileName: "",
      uploadedFile: undefined,
      uploadedFileId: undefined,
      uploadedFileUrl: "",
    }));
  }

  const formattedTemplateMessage = React.useMemo(() => {
    const { recipientType } = audienceSelectorRef.current || {};
    let message = addUserDefinedTemplate.values.templateMessage || "";
    message = message.replace(/{{\s*1\s*}}/g, toPascalCase(recipientType));
    message = message.replace(/{{\s*2\s*}}/g, toPascalCase(branchInfo?.branchName));
    message = message.replace(/{{\s*3\s*}}/g, addUserDefinedTemplate.values.msgBody || "");
    return message;
  }, [
    addUserDefinedTemplate.values.templateMessage,
    audienceSelectorRef.current?.recipientType,
    branchInfo?.branchName,
    addUserDefinedTemplate.values.msgBody
  ]);

  const { recipientType, studentType, employeeCategory } = audienceSelectorRef.current || {};  
  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Communication" pageTitle="Communication" />
          <div className="card tw-w-[85%] tw-mx-auto !tw-rounded-[10px]">
            <div className="card-header">
              <div className="align-items-center">
                <h4 className="card-title mb-0 flex-grow-1">Compose Whatsapp Notifications</h4>
              </div>
            </div>
            <div className="card-body p-0">
              <form onSubmit={addUserDefinedTemplate.handleSubmit}>
                <div className="tw-grid tw-grid-cols-10">
                  <div className="tw-col-span-6 tw-px-6 tw-py-4">
                    <TextInput
                      name="title"
                      value={addUserDefinedTemplate.values.title}
                      onChange={addUserDefinedTemplate.handleChange}
                      inputClassName="bg-soft-light"
                      invalid={(addUserDefinedTemplate.touched.title && addUserDefinedTemplate.errors.title) ? true : false}
                      error={(addUserDefinedTemplate.touched.title && addUserDefinedTemplate.errors.title) ? addUserDefinedTemplate.errors.title : ""}
                      labelText='Title'
                      labelClass='required'
                    />
                    <SelectInput
                      name="mediaType"
                      value={addUserDefinedTemplate.values.mediaType}
                      onChange={onChangeMediaTypeHndlr}
                      inputClassName="bg-soft-light"
                      invalid={(addUserDefinedTemplate.touched.mediaType && addUserDefinedTemplate.errors.mediaType) ? true : false}
                      error={(addUserDefinedTemplate.touched.mediaType && addUserDefinedTemplate.errors.mediaType) ? addUserDefinedTemplate.errors.mediaType : ""}
                      menuItems={mediaTypes}
                      hideSelectOption={Boolean(mediaTypes?.length > 0)}
                      labelText='Media Type'
                      labelClass='required'
                      valueKey='id'
                      textKey='name'
                    />
                    <div className="tw-flex tw-flex-col tw-mb-4">
                      <label className=' required form-label'>
                        Target Audience
                      </label>
                      <div className="tw-flex tw-gap-3 tw-items-center">
                        <button type="button"
                          className={twMerge(
                            "tw-flex tw-items-center tw-justify-center tw-rounded-md tw-self-start tw-py-2 tw-px-4 tw-bg-[#ffffff]",
                            "tw-border tw-border-[#ced4da]",
                            "tw-transition-colors tw-duration-200 hover:tw-bg-gray-200 !tw-mb-0"
                          )}
                          onClick={openAudienceModalHandler}
                        >
                          <HugeiconsIcon size={20}
                            className='tw-mr-1'
                            icon={UserGroupIcon}>
                          </HugeiconsIcon>
                          Select Audience
                        </button>
                        <div className="tw-flex tw-items-center tw-flex-wrap tw-gap-2">
                          {!recipientType ? (
                            <span className="tw-text-sm text-muted mb-0">No audience selected</span>
                          ) : (
                            <>
                              {recipientType === 'PARENT' && (
                                <span className="tw-text-sm tw-bg-gray-100 tw-px-3 tw-py-1 tw-rounded-full">
                                  Parent
                                  <HugeiconsIcon size={20}
                                    className='tw-mr-1 tw-ml-1'
                                    icon={ArrowRight02Icon}>
                                  </HugeiconsIcon>
                                  {studentTypeOptions.find(opt => opt.id === studentType)?.name || "-"}
                                </span>
                              )}

                              {recipientType === 'STAFF' && (
                                <span className="tw-text-sm tw-bg-gray-100 tw-px-3 tw-py-1 tw-rounded-full">
                                  Staff
                                  <HugeiconsIcon size={20}
                                    className='tw-mr-1 tw-ml-1'
                                    icon={ArrowRight02Icon}>
                                  </HugeiconsIcon>
                                  {staffCategoryNamesFromIds(employeeCategory)}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      {(addUserDefinedTemplate.touched.isAudienceSelected && addUserDefinedTemplate.errors.isAudienceSelected) && (
                        <FormFeedback type="invalid" className="d-block">{addUserDefinedTemplate.errors.isAudienceSelected}</FormFeedback>
                      )}
                    </div>
                    <TextArea
                      name='msgBody'
                      labelClass='required'
                      labelText='Description'
                      placeHolder='Enter Description'
                      height='160px'
                      maxLength={900}
                      showRemainingChars
                      value={addUserDefinedTemplate.values.msgBody}
                      onChange={addUserDefinedTemplate.handleChange}
                      invalid={(addUserDefinedTemplate.touched.msgBody && addUserDefinedTemplate.errors.msgBody) ? true : false}
                      error={(addUserDefinedTemplate.touched.msgBody && addUserDefinedTemplate.errors.msgBody) ? addUserDefinedTemplate.errors.msgBody : ""}
                    />
                    <UploadFileCommunication
                      name="uploadedFile"
                      labelText="Attachment"
                      labelClass={addUserDefinedTemplate.values.mediaType === 'NONE' || !addUserDefinedTemplate.values.mediaType ? '' : 'required'}
                      isDisabled={addUserDefinedTemplate.values.mediaType === 'NONE' || !addUserDefinedTemplate.values.mediaType}
                      value={addUserDefinedTemplate.values.uploadedFileName}
                      onChange={onChangeFileHandler}
                      uploadHandler={uploadFileHandler}
                      removeFileHandler={removeFileHandler}
                      // hideUploadBtn={
                      //   Boolean(addUserDefinedTemplate.values.uploadedFileId)                    // hide when already uploaded
                      //   || !Boolean(addUserDefinedTemplate.values.uploadedFile)                 // hide when no file selected
                      //   || Boolean(addUserDefinedTemplate.errors.uploadedFileId)                // hide when invalid
                      // }
                      canRemove={true}
                      invalid={(addUserDefinedTemplate.touched.uploadedFileId && addUserDefinedTemplate.errors.uploadedFileId) ? true : false}
                      error={(addUserDefinedTemplate.touched.uploadedFileId && addUserDefinedTemplate.errors.uploadedFileId) ? addUserDefinedTemplate.errors.uploadedFileId : ""}
                    />
                  </div>
                  <div className="tw-col-span-4 tw-bg-[#F9FAFB] tw-p-4">
                    <label className="tw-font-semibold tw-mb-2 tw-block">Preview:</label>

                    <div className="tw-flex tw-justify-end tw-bg-[#ffffff] tw-border tw-border-gray-200 tw-rounded-lg tw-p-4">
                      <div className="tw-relative tw-max-w-[100%] tw-bg-gray-100 tw-border tw-border-gray-200 tw-rounded-2xl 
                      tw-shadow-sm tw-px-3 tw-py-3 tw-leading-snug tw-text-gray-800 tw-text-[13px]">

                        {/* Attachment section */}
                        {(addUserDefinedTemplate.values.uploadedFileId ||
                          addUserDefinedTemplate.values.uploadedFile ||
                          addUserDefinedTemplate.values.uploadedFileName) && (
                            <div className="tw-bg-gray-50 tw-rounded-sm tw-px-2 tw-py-2 tw-mb-2 tw-flex tw-items-center tw-justify-between tw-gap-2">
                              <div className="tw-flex-1 tw-truncate">
                                <div className="tw-flex tw-items-center tw-gap-1 tw-font-medium tw-text-gray-700">
                                  <HugeiconsIcon
                                    size={20}
                                    className="tw-rotate-45"
                                    icon={Attachment02StrokeStandard}
                                  />
                                  <span>Attachment</span>
                                </div>

                                {addUserDefinedTemplate.values.uploadedFileUrl ? (
                                  <a
                                    href={addUserDefinedTemplate.values.uploadedFileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="tw-block tw-text-gray-800 tw-underline tw-truncate"
                                    title={addUserDefinedTemplate.values.uploadedFileName}
                                  >
                                    {addUserDefinedTemplate.values.uploadedFileName}
                                  </a>
                                ) : (
                                  <span
                                    className="tw-block tw-text-gray-800 tw-truncate"
                                    title={addUserDefinedTemplate.values.uploadedFileName}
                                  >
                                    {addUserDefinedTemplate.values.uploadedFileName}
                                  </span>
                                )}
                              </div>

                              {addUserDefinedTemplate.values.uploadedFileId && (
                                <span className="tw-bg-success tw-text-white tw-px-2 tw-py-[2px] tw-rounded-md tw-shrink-0">
                                  Uploaded
                                </span>
                              )}
                            </div>
                          )}

                        {/* Message body */}
                        {addUserDefinedTemplate.values.templateMessage && (
                          <div className="tw-mb-2 tw-whitespace-pre-wrap tw-px-1 tw-whitespace-div-wrap tw-break-words tw-text-gray-800">
                            {formattedTemplateMessage}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>


                </div>
                <div className='tw-px-4 tw-py-3'>
                  <div className="hstack gap-2 justify-content-end mt-4 mb-1">
                    <Button
                      type="button"
                      variant='secondary'
                      onClick={props.toggle}
                    >
                      Close
                    </Button>
                    <Button
                      type="submit"
                      variant='primary'
                      className={`btn btn-success`}
                      disabled={showApiLoader}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div >
      </div >
      <ModalContainerUpdated
        isOpen={audienceModalState.showModal}
        modalSize="lg"
        id="audience-selector-modal"
        modalTitle='Select Audience'
        toggle={closeAudienceModalHandler}
      >
        <AudienceSelector
          instituteId={instituteId}
          initialAudience={audienceSelectorRef.current}
          toggle={closeAudienceModalHandler}
          selectAudienceHandler={selectAudienceHandler}
          branchId={branchId}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default ComposeMessage;