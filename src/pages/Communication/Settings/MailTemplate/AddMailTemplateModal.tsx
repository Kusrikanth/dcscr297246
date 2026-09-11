import React, { useEffect } from 'react'
import {  MultiSelectCheckbox, SelectInput, TextArea, TextInput } from '../../../../Components/Common'
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { useFormik } from 'formik';
import { sendTypeOptions } from './helper';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { saveTemplateAct, updateTemplateAct } from '../../../../store/communication/communicationactions';
import * as Yup from 'yup';
import { AddMailTemplateModalProps } from './MailTemplateTypes';
import Button from '../../../../Components/Common/Button';


    const initialValues = {
        featureName: "",
        templateName: "",
        messageType: "EMAIL",
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
    

const AddMailTemplateModal: React.FC<AddMailTemplateModalProps> = (props) => {    

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

    const addMailTemplateModalForm = useFormik({
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
            addMailTemplateModalForm.setValues((prev: any) => ({ ...prev, featureName, templateName, messageType, title, description, sendType, classIds }));
        }
      }, [props.modalData]);

    function renderSelectedClass(selectedItems: Array<{classId: string, shortName: string}>): JSX.Element | null {
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
        return item.shortName;
    }
    const filterHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        if (name === 'curriculumId') {
            if (value) {
                const payload = { branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
                dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
                addMailTemplateModalForm.setValues((prev: any) => ({ ...prev, [name]: value }))
            }
            else {
                dispatch(resetBrchClassAct(undefined));
                addMailTemplateModalForm.setValues((prev: any) => ({ ...prev,[name]:value, classId: "" }))
            }
        }
    }
    function onSelectClassHndlr(selectedOptions: { classId: string; shortName: string }[], config?: { name: string }) {
        const { name } = config || {};
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            addMailTemplateModalForm.setFieldValue(name!, selectedOptions);
        } else {
            addMailTemplateModalForm.setFieldValue(name!, null);
        }
    }
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};


  return (
    <>
          <form onSubmit={addMailTemplateModalForm.handleSubmit}>
              <div className="tw-p-4">
                  {/* Form Grid */}
                  <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                      <div className="tw-col-span-12 md:tw-col-span-6">
                          <TextInput
                              name="featureName"
                              labelText="Feature Name"
                              labelClass="required"
                              value={addMailTemplateModalForm.values.featureName}
                              onChange={addMailTemplateModalForm.handleChange}
                              onBlur={addMailTemplateModalForm.handleBlur}
                              invalid={addMailTemplateModalForm.touched.featureName && Boolean(addMailTemplateModalForm.errors.featureName)}
                              error={addMailTemplateModalForm.touched.featureName && addMailTemplateModalForm.errors.featureName}
                              isReadOnly={props.modalData ? true : false}
                              isDisabled={props.modalData ? true : false}
                              

                          />
                      </div>

                      <div className="tw-col-span-12 md:tw-col-span-6">
                          <TextInput
                              name="templateName"
                              labelText="Template Name"
                              labelClass="required"
                              value={addMailTemplateModalForm.values.templateName}
                              onChange={addMailTemplateModalForm.handleChange}
                              onBlur={addMailTemplateModalForm.handleBlur}
                              invalid={addMailTemplateModalForm.touched.templateName && Boolean(addMailTemplateModalForm.errors.templateName)}
                              error={addMailTemplateModalForm.touched.templateName && addMailTemplateModalForm.errors.templateName}
                              isReadOnly={props.modalData ? true : false}
                              isDisabled={props.modalData ? true : false}

                          />
                      </div>

                      <div className="tw-col-span-12 md:tw-col-span-6">
                          <SelectInput
                              name="sendType"
                              labelClass="required"
                              value={addMailTemplateModalForm.values.sendType}
                              onChange={addMailTemplateModalForm.handleChange}
                              onBlur={addMailTemplateModalForm.handleBlur}
                              menuItems={sendTypeOptions}
                              valueKey="id"
                              textKey="name"
                              defaultSelect="Send Type"
                              labelText='Send Type'
                            invalid={addMailTemplateModalForm.touched.sendType && Boolean(addMailTemplateModalForm.errors.sendType)}
                            error={addMailTemplateModalForm.touched.sendType && addMailTemplateModalForm.errors.sendType}
                            isReadOnly={props.modalData ? true : false}
                              isDisabled={props.modalData ? true : false}

                          />
                      </div>

                      <div className="tw-col-span-12 md:tw-col-span-6">
                          <TextInput
                              name="title"
                              labelText="Title"
                              labelClass="required"
                              value={addMailTemplateModalForm.values.title}
                              onChange={addMailTemplateModalForm.handleChange}
                              isReadOnly={props.modalData ? true : false}
                              isDisabled={props.modalData ? true : false}
                              

                          />
                      </div>

                      {addMailTemplateModalForm.values.sendType === "CLASS" && (
                          <>
                              <div className="tw-col-span-12 md:tw-col-span-6">
                                  <SelectInput
                                      name="curriculumId"
                                      labelClass="required"
                                      value={addMailTemplateModalForm.values.curriculumId}
                                      onChange={filterHandler}
                                      menuItems={curriculumTypes}
                                      valueKey="branchCurriculumId"
                                      textKey="curriculumName"
                                      defaultSelect="Curriculum"
                                      labelText="Curriculum"
                                      isReadOnly={props.modalData ? true : false}
                              isDisabled={props.modalData ? true : false}

                                  />
                              </div>

                              <div className="tw-col-span-12 md:tw-col-span-6">
                                  <MultiSelectCheckbox
                                      name="classIds"
                                      idKey="id"
                                      labelText="Classes"
                                      labelClass="required"
                                      value={addMailTemplateModalForm.values.classIds}
                                      renderValue={renderSelectedClass}
                                      renderOptions={renderOptionClass}
                                      onChange={onSelectClassHndlr}
                                      searchKey="shortName"
                                      options={classTypes || []}
                              isDisabled={props.modalData ? true : false}

                                  />
                              </div>
                          </>
                      )}

                      <div className="tw-col-span-12 md:tw-col-span-6">
                          <TextInput
                              name="messageType"
                              labelText="Message Type"
                              labelClass='required'
                              value={addMailTemplateModalForm?.values.messageType}
                              isReadOnly={true}
                              isDisabled={true}
                              invalid={addMailTemplateModalForm.touched.messageType && Boolean(addMailTemplateModalForm.errors.messageType)}
                              error={addMailTemplateModalForm.touched.messageType && addMailTemplateModalForm.errors.messageType}
                              
                          />
                      </div>

                      <div className="tw-col-span-12 md:tw-col-span-6">
                          <TextArea
                              name="description"
                              labelText="Description"
                              labelClass="required"
                              value={addMailTemplateModalForm.values.description}
                              onChange={addMailTemplateModalForm.handleChange}
                              onBlur={addMailTemplateModalForm.handleBlur}
                              invalid={addMailTemplateModalForm.touched.description && Boolean(addMailTemplateModalForm.errors.description)}
                              error={addMailTemplateModalForm.touched.description && addMailTemplateModalForm.errors.description}
                              isReadOnly={props.modalData ? true : false}
                              isDisabled={props.modalData ? true : false}
                          />
                      </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-6">
                      <Button
                          type="button"
                          variant='secondary'
                          onClick={props.toggle}
                      >
                          Cancel
                      </Button>

                      {!props.modalData && (
                          <Button
                              type="submit"
                              variant="primary">
                              Save
                          </Button>
                      )}
                  </div>
              </div>
          </form>
    </>
  )
}

export default AddMailTemplateModal