import React, { useEffect } from 'react'
import {  Button, MultiSelectCheckbox, SelectInput, TextArea, TextInput } from '../../../../Components/Common'
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { useFormik } from 'formik';
import { sendTypeOptions } from './helper';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { saveTemplateAct, updateTemplateAct } from '../../../../store/communication/communicationactions';
import * as Yup from 'yup';
import { AddWhatsAppTemplateModalProps } from './WhatsAppDataTypes';


    const initialValues = {
        featureName: "",
        templateName: "",
        messageType: "WHATSAPP",
        title: "",
        description: "",
        sendType: "",
        curriculumId: "",
        classIds: [] as { classId: string; shortName: string }[],
    }

    const validationSchema = Yup.object().shape({
        featureName: Yup.string().required("Feature name is required."),
        templateName: Yup.string().required("Template name is required."),
        messageType: Yup.string().required("Message type is required."),
        description: Yup.string().required("Description is required."),
        sendType: Yup.string().required("Send type is required."),        
    })
    

const AddWhatsAppTemplateModal: React.FC<AddWhatsAppTemplateModalProps> = (props) => {    

    const dispatch = useAppDispatch();
    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        brchCurriculumResp,
        branchClassResp,

    } = useAppSelector(
        ({ appData, globalData, branchAcademics }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
        }),
        shallowEqual
    );

    const addWhatsAppTemplateModalForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const classId: string[]  = values?.classIds?.map((i) => i?.classId) || [];
            if (props.modalData) {
                const payload = {
                    title: values.title,
                    description: values.description,
                }                
                dispatch(updateTemplateAct(generateActionPayload("update_template", {id : props.modalData?.id}, payload)));
            }else{
                const payload = {
                    instituteId: instituteId,
                    branchId: branchId,
                    classIds: classId,
                    featureName: values.featureName,
                    templateName: values.templateName,
                    messageType: values.messageType,
                    title: values.title,
                    description: values.description,
                    sendType: values.sendType,
                }
                dispatch(saveTemplateAct(generateActionPayload("save_template", undefined, payload)));
            }

        },
    });

    useEffect(() => {
        const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        if (props.modalData ) {
            const classIds = props.modalData?.classes.map(
                (i: { classId: string; classShortName: string }) => ({
                    classId: i.classId || "",
                    shortName: i.classShortName || ""
                })); 

            const { featureName, templateName, messageType, title, description, sendType } = props.modalData || {};
            addWhatsAppTemplateModalForm.setValues((prev: any) => ({ ...prev, featureName, templateName, messageType, title, description, sendType, classIds }));
        }
      }, [props.modalData]);

    function renderSelectedClass(selectedItems:  Array<{classId: string, shortName: string}>): JSX.Element | null{
        if (Array.isArray(selectedItems)) {
            return (<div className="text-truncate">
                {
                    selectedItems.map((item, index) => {
                        return item?.shortName + (index !== (selectedItems.length - 1) ? ', ' : '')
                    })
                }
            </div>)
        }
        return null;
    }

    function renderOptionClass(item: { shortName: string }): string {
        return  item.shortName
    }
    const filterHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        if (name === 'curriculumId') {
            if (value) {
                const payload = { branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
                dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
                addWhatsAppTemplateModalForm.setValues(prev=> ({ ...prev,[name]:value }))
            }
            else {
                dispatch(resetBrchClassAct(undefined));
                addWhatsAppTemplateModalForm.setValues((prev: any) => ({ ...prev, [name]: value, classId: "" }))
            }
        }
    }
    function onSelectClassHndlr(selectedOptions: { classId: string; shortName: string }[], config?: { name: string }) {
        const { name } = config || {};
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            addWhatsAppTemplateModalForm.setFieldValue(name!, selectedOptions);
        } else {
            addWhatsAppTemplateModalForm.setFieldValue(name!, null);
        }
    }
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};


  return (
    <>
          <form onSubmit={addWhatsAppTemplateModalForm.handleSubmit}>
              <div className="tw-p-6">

                  {/* Main Grid */}
                  <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">

                      <TextInput
                          name="featureName"
                          labelText="Feature Name"
                          labelClass="required"
                          value={addWhatsAppTemplateModalForm?.values.featureName}
                          onChange={addWhatsAppTemplateModalForm.handleChange}
                          onBlur={addWhatsAppTemplateModalForm.handleBlur}
                          invalid={
                              addWhatsAppTemplateModalForm.touched.featureName &&
                              Boolean(addWhatsAppTemplateModalForm.errors.featureName)
                          }
                          error={
                              addWhatsAppTemplateModalForm.touched.featureName &&
                              addWhatsAppTemplateModalForm.errors.featureName
                          }
                          isReadOnly={props.modalData ? true : false}
                          isDisabled={props.modalData ? true : false}
                      />

                      <TextInput
                          name="templateName"
                          labelText="Template Name"
                          labelClass="required"
                          value={addWhatsAppTemplateModalForm?.values.templateName}
                          onChange={addWhatsAppTemplateModalForm.handleChange}
                          onBlur={addWhatsAppTemplateModalForm.handleBlur}
                          invalid={
                              addWhatsAppTemplateModalForm.touched.templateName &&
                              Boolean(addWhatsAppTemplateModalForm.errors.templateName)
                          }
                          error={
                              addWhatsAppTemplateModalForm.touched.templateName &&
                              addWhatsAppTemplateModalForm.errors.templateName
                          }
                          isReadOnly={props.modalData ? true : false}
                          isDisabled={props.modalData ? true : false}
                      />

                      <SelectInput
                          name="sendType"
                          labelClass="required"
                          value={addWhatsAppTemplateModalForm?.values.sendType}
                          onChange={addWhatsAppTemplateModalForm.handleChange}
                          onBlur={addWhatsAppTemplateModalForm.handleBlur}
                          menuItems={sendTypeOptions}
                          valueKey="id"
                          textKey="name"
                          defaultSelect="Send Type"
                          labelText="Send Type"
                          invalid={
                              addWhatsAppTemplateModalForm.touched.sendType &&
                              Boolean(addWhatsAppTemplateModalForm.errors.sendType)
                          }
                          error={
                              addWhatsAppTemplateModalForm.touched.sendType &&
                              addWhatsAppTemplateModalForm.errors.sendType
                          }
                          isReadOnly={props.modalData ? true : false}
                          isDisabled={props.modalData ? true : false}
                      />

                      <TextInput
                          name="title"
                          labelText="Title"
                          labelClass="required"
                          value={addWhatsAppTemplateModalForm?.values.title}
                          onChange={addWhatsAppTemplateModalForm.handleChange}
                          isReadOnly={props.modalData ? true : false}
                          isDisabled={props.modalData ? true : false}
                      />

                      {/* CLASS Conditional Section */}
                      {addWhatsAppTemplateModalForm?.values?.sendType === "CLASS" && (
                          <>
                              <SelectInput
                                  name="curriculumId"
                                  labelClass="required"
                                  value={addWhatsAppTemplateModalForm.values.curriculumId}
                                  onChange={filterHandler}
                                  menuItems={curriculumTypes}
                                  valueKey="branchCurriculumId"
                                  textKey="curriculumName"
                                  defaultSelect="Curriculum"
                                  labelText="Curriculum"
                                  isReadOnly={props.modalData ? true : false}
                                  isDisabled={props.modalData ? true : false}
                              />

                              <MultiSelectCheckbox
                                  name="classIds"
                                  idKey="id"
                                  labelText="Classes"
                                  labelClass="required"
                                  value={addWhatsAppTemplateModalForm.values.classIds}
                                  renderValue={renderSelectedClass}
                                  renderOptions={renderOptionClass}
                                  onChange={onSelectClassHndlr}
                                  searchKey="shortName"
                                  options={classTypes || []}
                                  isDisabled={props.modalData ? true : false}
                              />
                          </>
                      )}

                      <TextInput
                          name="messageType"
                          labelText="Message Type"
                          labelClass="required"
                          value={addWhatsAppTemplateModalForm?.values.messageType}
                          isReadOnly={true}
                          isDisabled={true}
                          invalid={
                              addWhatsAppTemplateModalForm.touched.messageType &&
                              Boolean(addWhatsAppTemplateModalForm.errors.messageType)
                          }
                          error={
                              addWhatsAppTemplateModalForm.touched.messageType &&
                              addWhatsAppTemplateModalForm.errors.messageType
                          }
                      />

                      <TextArea
                          name="description"
                          labelText="Description"
                          labelClass="required"
                          value={addWhatsAppTemplateModalForm?.values.description}
                          onChange={addWhatsAppTemplateModalForm.handleChange}
                          onBlur={addWhatsAppTemplateModalForm.handleBlur}
                          invalid={
                              addWhatsAppTemplateModalForm.touched.description &&
                              Boolean(addWhatsAppTemplateModalForm.errors.description)
                          }
                          error={
                              addWhatsAppTemplateModalForm.touched.description &&
                              addWhatsAppTemplateModalForm.errors.description
                          }
                          isReadOnly={props.modalData ? true : false}
                          isDisabled={props.modalData ? true : false}
                      />

                  </div>

                  {/* Footer Buttons */}
                  <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-8">
                      <Button
                          type="button"
                          variant="secondary"
                          onClick={props.toggle}
                      >
                          Cancel
                      </Button>

                      {!props.modalData && (
                          <Button
                              type="submit"
                              variant="primary"
                          >
                              Save
                          </Button>
                      )}
                  </div>

              </div>
          </form>
    </>
  )
}

export default AddWhatsAppTemplateModal