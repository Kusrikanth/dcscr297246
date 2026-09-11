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
import { AddSMSTemplateModalProps } from './SmsTemplateTypes';
import Button from '../../../../Components/Common/Button';


    const initialValues = {
        featureName: "",
        templateName: "",
        messageType: "SMS",
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
    

const AddSMSTemplateModal: React.FC<AddSMSTemplateModalProps> = (props) => {    

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

    const addSMSTemplateModalForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const classId: string[] = values?.classIds?.map((i) => i?.classId) || [];
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
            console.log(props);
            
            const classIds = props.modalData?.classes?.map(
                (i: { classId: string; classShortName: string }) => ({
                    classId: i.classId || "",
                    shortName: i.classShortName || ""
                }));      
            const { featureName, templateName, messageType, title, description, sendType  } = props.modalData || {};
            addSMSTemplateModalForm.setValues((prev: any) => ({ ...prev, featureName, templateName, messageType, title, description, sendType, classIds }));
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
                addSMSTemplateModalForm.setValues(prev=> ({ ...prev,[name]:value }))
            }
            else {
                dispatch(resetBrchClassAct(undefined));
                addSMSTemplateModalForm.setValues(prev=> ({ ...prev,[name]:value, classId: "" }))
            }
        }
    }
    function onSelectClassHndlr(selectedOptions: { classId: string; shortName: string }[], config?: { name: string }) {
        const { name } = config || {};
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            addSMSTemplateModalForm.setFieldValue(name!, selectedOptions);
        } else {
            addSMSTemplateModalForm.setFieldValue(name!, null);
        }
    }
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};


  return (
    <>
          <form onSubmit={addSMSTemplateModalForm.handleSubmit}>
              <div className='p-4'>
                  <div className='row'>
                      <div className="col-6">
                          <TextInput
                              name="featureName"
                              labelText="Feature Name"
                              labelClass='required'
                              value={addSMSTemplateModalForm?.values.featureName}
                              onChange={addSMSTemplateModalForm.handleChange}
                              onBlur={addSMSTemplateModalForm.handleBlur}
                              invalid={addSMSTemplateModalForm.touched.featureName && Boolean(addSMSTemplateModalForm.errors.featureName)}
                              error={addSMSTemplateModalForm.touched.featureName && addSMSTemplateModalForm.errors.featureName}
                              isReadOnly={props.modalData ? true : false}
                              isDisabled={props.modalData ? true : false}
                              

                          />
                      </div>
                      <div className='col-6'>
                          <TextInput
                              name="templateName"
                              labelText="Template Name"
                              labelClass='required'
                              value={addSMSTemplateModalForm?.values.templateName}
                              onChange={addSMSTemplateModalForm.handleChange}
                              onBlur={addSMSTemplateModalForm.handleBlur}
                              invalid={addSMSTemplateModalForm.touched.templateName && Boolean(addSMSTemplateModalForm.errors.templateName)}
                              error={addSMSTemplateModalForm.touched.templateName && addSMSTemplateModalForm.errors.templateName}
                              isReadOnly={props.modalData ? true : false}
                              isDisabled={props.modalData ? true : false}

                          />
                      </div>
                      <div className="col-6">
                          <SelectInput
                              name="sendType"
                              labelClass='required'
                              value={addSMSTemplateModalForm?.values.sendType}
                              onChange={addSMSTemplateModalForm.handleChange}
                              onBlur={addSMSTemplateModalForm.handleBlur}
                              menuItems={sendTypeOptions}
                              valueKey="id"
                              textKey="name"
                              defaultSelect="Send Type"
                              labelText='Send Type'
                            invalid={addSMSTemplateModalForm.touched.sendType && Boolean(addSMSTemplateModalForm.errors.sendType)}
                            error={addSMSTemplateModalForm.touched.sendType && addSMSTemplateModalForm.errors.sendType}
                            isReadOnly={props.modalData ? true : false}
                              isDisabled={props.modalData ? true : false}

                          />
                      </div>

                      <div className='col-6'>
                          <TextInput
                              name="title"
                              labelText="Title"
                              labelClass='required'
                              value={addSMSTemplateModalForm?.values.title}
                              onChange={addSMSTemplateModalForm.handleChange}
                              isReadOnly={props.modalData ? true : false}
                              isDisabled={props.modalData ? true : false}

                          />
                      </div>
                      {addSMSTemplateModalForm?.values?.sendType === "CLASS" &&
                          <>
                              <div className="col-6">
                                  <SelectInput
                                      name="curriculumId"
                                      labelClass='required'
                                      value={addSMSTemplateModalForm.values.curriculumId}
                                      onChange={filterHandler}
                                      menuItems={curriculumTypes}
                                      valueKey="branchCurriculumId"
                                      textKey="curriculumName"
                                      defaultSelect='Curriculum'
                                      labelText="Curriculum"
                                      isReadOnly={props.modalData ? true : false}
                                      isDisabled={props.modalData ? true : false}

                                  />
                              </div>
                              <div className='col-6'>
                                  <MultiSelectCheckbox
                                      name="classIds"
                                      idKey="id"
                                      labelText='Classes'
                                      labelClass='required'
                                      value={addSMSTemplateModalForm.values.classIds}
                                      renderValue={renderSelectedClass}
                                      renderOptions={renderOptionClass}
                                      onChange={onSelectClassHndlr}
                                      searchKey="shortName"
                                      options={classTypes || []}
                                      isDisabled={props.modalData ? true : false}

                                  />
                              </div></>}

                      <div className='col-6'>
                          <TextInput
                              name="messageType"
                              labelText="Message Type"
                              labelClass='required'
                              value={addSMSTemplateModalForm?.values.messageType}
                              isReadOnly={true}
                              isDisabled={true}
                              invalid={addSMSTemplateModalForm.touched.messageType && Boolean(addSMSTemplateModalForm.errors.messageType)}
                              error={addSMSTemplateModalForm.touched.messageType && addSMSTemplateModalForm.errors.messageType}
                              
                          />
                      </div>
                      <div className='col-6'>
                          <TextArea
                              name="description"
                              labelText="Description"
                              labelClass='required'
                              value={addSMSTemplateModalForm?.values.description}
                              onChange={addSMSTemplateModalForm.handleChange}
                              onBlur={addSMSTemplateModalForm.handleBlur}
                              invalid={addSMSTemplateModalForm.touched.description && Boolean(addSMSTemplateModalForm.errors.description)}
                              error={addSMSTemplateModalForm.touched.description && addSMSTemplateModalForm.errors.description}
                              isReadOnly={props.modalData ? true : false}
                              isDisabled={props.modalData ? true : false}
                          />
                      </div>
                  </div>
                  <div className="row">
                      <div className="d-flex gap-2 w-auto ms-auto">
                          <Button
                              type="button"
                              className={"btn btn-light"}
                              onClick={props.toggle}
                          >
                              Cancel
                          </Button>
                          {props.modalData ? null :<Button
                              type="submit"
                              className="btn btn-success"
                          >
                              Save
                          </Button>}
                      </div>
                  </div>
              </div>
          </form>
    </>
  )
}

export default AddSMSTemplateModal