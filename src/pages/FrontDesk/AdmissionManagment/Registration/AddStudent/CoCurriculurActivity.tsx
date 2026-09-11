import React, { useState, useMemo, useContext, useEffect, useRef } from "react";
import { nanoid } from 'nanoid';
import { toast } from "react-toastify";
import { Formik, FieldArray, useFormik, Form, ArrayHelpers, FormikErrors, FormikProvider } from "formik";
import { shallowEqual } from "react-redux";
import * as Yup from "yup";
import { Label, Input } from "reactstrap";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

//Common Component
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage, SelectWithTextInput, AutoSearchInput, UploadFileInput,
    SingleFileUploadInput,
    NgFileUploader,
    TextArea,
} from "../../../../../Components/Common";


//Common Utility
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import classnames from "classnames";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import {
    getStudentByFilterAct, getSiblingDetailsAct, setGetSiblingDetailsAct
} from "../../../../../store/directory/studentmanagement/studentmanagementactions";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { getBranchCurriculumAct, getBranchClassAct, getBrchSectionsAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import UploadStudent from "../../../../../Components/Common/UploadStudent";
import {
    uploadActivityCertificateAct, getCoCurriculumActivityByIdAct,
    addCocurriculurActivityAct,
} from "../../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
//Helper
import { StepperFormContext, levelOptions, stepInfo, trueFalseOptions, TABS_ACTIONS } from "./helper";
import Button from "../../../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
    activityList: Yup.array().of(
        Yup.object().shape({
            description: Yup.string().test("descriptionCheck", "Description is required if level is selected.",
                (value: any, schema: any) => {
                    const levelSelected = schema.parent.level;
                    if (levelSelected && !value) {
                        return false;
                    }
                    return true;
                }),
        })
    ),
});

function getInitialState(editData?: any) {
    const activityList: any = [];
    if (Array.isArray(editData) && editData.length > 0) {
        for (let i = 0; i < editData.length; i++) {
            const uniqueId = nanoid();
            activityList.push({
                uniqueId: uniqueId,
                coCurricularActivityId: editData[i]?.coCurricularActivityId,
                level: editData[i]?.level,
                description: editData[i]?.description,
                certificateId: editData[i]?.systemFile?.id || "",

                uploadedFile: "",
                fileName: editData[i]?.systemFile?.originalFileName,
                downloadLink: editData[i]?.systemFile?.s3URL,
                isUploaded: editData[i]?.systemFile?.id || false,
            })
        }
    } else {
        const uniqueId = nanoid();
        activityList.push({
            uniqueId: uniqueId,
            coCurricularActivityId: 0,
            level: "",
            description: "",
            certificateId: "",

            uploadedFile: "",
            fileName: "",
            downloadLink: "",
            isUploaded: false
        })
    }
    return { activityList };
}

const initialValues = getInitialState();
export const CocurriculurActivity: React.FC<any> = ({ stepId, branchId, instiuteId, academicYearId }) => {
    const { isViewMode, studentId, tabsFilledInfo, nextStepHndlr, currentMultiFormKeys, submitCurrentFormCllbck } = useContext<any>(StepperFormContext);
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const [removeIdState, setRemoveIdState] = useState<any>([]);
    const dispatch = useAppDispatch();
    const { showApiLoader, uploadActivityCertificateResp, coCurriculumActivityByIdResp, addCocurrilurActivityResp } =
        useAppSelector(({ globalData, admissionRegistration }) => ({
            showApiLoader: globalData.showApiLoader,
            uploadActivityCertificateResp: admissionRegistration.uploadActivityCertificateResp,
            coCurriculumActivityByIdResp: admissionRegistration.coCurriculumActivityByIdResp,
            addCocurrilurActivityResp: admissionRegistration.addCocurrilurActivityResp
        }), shallowEqual);

    const coCurriculurActivityRef = useRef({
        prevUploadActivityCertificateResp: uploadActivityCertificateResp,
        prevCoCurriculumActivityByIdResp: coCurriculumActivityByIdResp,
        prevAddCocurrilurActivityResp: addCocurrilurActivityResp
    });

    const formsKeys = useMemo(() => {
        if (stepId) {
            const { multiFormKeys } = stepInfo.find(item => item.id === stepId) || {};
            if (Array.isArray(multiFormKeys)) {
                return multiFormKeys;
            }
            return [];
        }
        return [];
    }, [stepId]);

    useEffect(() => {
        const { prevUploadActivityCertificateResp, prevCoCurriculumActivityByIdResp, prevAddCocurrilurActivityResp } = coCurriculurActivityRef.current;
        if (uploadActivityCertificateResp && prevUploadActivityCertificateResp !== uploadActivityCertificateResp) {
            const { uploadFileId, } = uploadActivityCertificateResp;
            if (uploadFileId) {
                toast.success("File uploaded successfully");
                const rowIndex = coCurriculumForm.values?.activityList.findIndex((item: any) => item.uniqueId === uploadFileId);
                if (rowIndex >= 0) {
                    const updatedRowDetails = {
                        ...coCurriculumForm.values?.activityList[rowIndex],
                        certificateId: uploadActivityCertificateResp?.id, isUploaded: true,
                        uploadedFile: "",
                        downloadLink: uploadActivityCertificateResp?.s3URL
                    };
                    formikArrayHelpers.current?.replace(rowIndex, updatedRowDetails);
                }
            }
        } else if (coCurriculumActivityByIdResp && prevCoCurriculumActivityByIdResp !== coCurriculumActivityByIdResp) {
            const formData = getInitialState(coCurriculumActivityByIdResp);
            coCurriculumForm.resetForm({
                values: formData
            })
        } else if (addCocurrilurActivityResp && prevAddCocurrilurActivityResp !== addCocurrilurActivityResp) {
            toast.success("Co-curriculur activity updated successfully.");
            nextStepHndlr(stepId, null);
        }
        coCurriculurActivityRef.current.prevUploadActivityCertificateResp = uploadActivityCertificateResp;
        coCurriculurActivityRef.current.prevCoCurriculumActivityByIdResp = coCurriculumActivityByIdResp;
        coCurriculurActivityRef.current.prevAddCocurrilurActivityResp = addCocurrilurActivityResp;
    }, [uploadActivityCertificateResp, coCurriculumActivityByIdResp, addCocurrilurActivityResp]);

    const coCurriculumForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            if (!coCurriculumForm.dirty && tabsFilledInfo[stepId]) {
                nextStepHndlr(stepId, null);
                return;
            }
            const payload = values.activityList.filter((item: any) => item.level).map((item: any) => {
                return {
                    coCurricularActivityId: item.coCurricularActivityId,
                    level: item.level,
                    description: item.description,
                    certificateId: item.certificateId
                };
            });
            const removedIds = removeIdState?.join(",");
            const params = { studentId, removedIds };
            dispatch(addCocurriculurActivityAct(generateActionPayload("add_cocurriculur_activity", params, payload)));
        }
    });

    function removeRoleHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            const rowInfo: any = coCurriculumForm.values.activityList[Number(rowIndex)];
            if (rowInfo?.coCurricularActivityId) {
                const updateRemoveId: any = [...removeIdState];
                updateRemoveId.push(rowInfo?.coCurricularActivityId);
                setRemoveIdState(updateRemoveId);
            }
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }

    function addNewActivityHandler() {
        var uniqueId = nanoid();
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push(
                {
                    uniqueId: uniqueId,
                    coCurricularActivityId: 0,
                    level: "",
                    description: "",
                    certificateId: "",

                    uploadedFile: "",
                    fileName: "",
                    downloadLink: "",
                    isUploaded: false
                }
            );
        }
    }

    function onChangeFileInputHndlr(event: any) {
        const file = event.target.files[0];
        const documentIndexKey = event.target.name.split(".")[1];
        coCurriculumForm.setFieldValue(`activityList.${documentIndexKey}.fileName`, file.name);
        coCurriculumForm.setFieldValue(`activityList.${documentIndexKey}.downloadLink`, "");
        coCurriculumForm.setFieldValue(`activityList.${documentIndexKey}.uploadedFile`, file);
        coCurriculumForm.setFieldValue(`activityList.${documentIndexKey}.isUploaded`, false);
    }

    function fileUploadHndlr(event: React.MouseEvent<HTMLInputElement>) {
        const uploadFileId = event.currentTarget.getAttribute("data-id") || "",
            rowFileInfo: any = coCurriculumForm.values?.activityList.find((item: any) => item.uniqueId === uploadFileId);
        if (rowFileInfo) {
            const formData = new FormData();
            formData.append("file", rowFileInfo.uploadedFile);
            dispatch(uploadActivityCertificateAct(generateActionPayload("upload_activity_file", {
                fileId: rowFileInfo.certificateId
            }, formData, { uploadFileId })));
        }
    }

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(stepId)) {
            coCurriculumForm.handleSubmit();
        }
    }, [currentMultiFormKeys]);

    useEffect(() => {
        if (studentId) {
            const params = { studentId };
            dispatch(getCoCurriculumActivityByIdAct(generateActionPayload("get_cocurriculur_byregno", params)));
        }
    }, [studentId]);

    function submitHndlr(e: any) {
        submitCurrentFormCllbck(formsKeys, TABS_ACTIONS.NEXT_TAB);
    }

    function previousBtnHndlr(e: any) {
        submitCurrentFormCllbck(formsKeys, TABS_ACTIONS.PREVIOUS_TAB);
    }


    function onChangeLevelHandler(event: any) {
        const { value } = event.target;
        const documentIndexKey = event.target.name.split(".")[1];
        coCurriculumForm.setFieldValue(`activityList.${documentIndexKey}.level`, value);
        if (!value) {
            coCurriculumForm.setFieldValue(`activityList.${documentIndexKey}.description`, "");
            coCurriculumForm.setFieldValue(`activityList.${documentIndexKey}.fileName`, "");
            coCurriculumForm.setFieldValue(`activityList.${documentIndexKey}.fileName`, "");
            coCurriculumForm.setFieldValue(`activityList.${documentIndexKey}.downloadLink`, "");
            coCurriculumForm.setFieldValue(`activityList.${documentIndexKey}.uploadedFile`, "");
            coCurriculumForm.setFieldValue(`activityList.${documentIndexKey}.isUploaded`, false);
        }

    }

    return (
        <React.Fragment>
            <form id="cocurriculur-form" onSubmit={coCurriculumForm.handleSubmit}>
                <UncontrolledAccordion open="coCurriculumActivity" defaultOpen={["coCurriculumActivity"]} stayOpen>
                    <AccordionItem>
                        <AccordionHeader tag="h4" targetId="coCurriculumActivity">
                            DOCUMENT INFORMATION
                        </AccordionHeader>
                        <AccordionBody accordionId="coCurriculumActivity">
                            <FormikProvider value={coCurriculumForm}>
                                <FieldArray name="activityList">
                                    {(arrayHelpers: ArrayHelpers) => {
                                        if (!formikArrayHelpers.current) {
                                            formikArrayHelpers.current = arrayHelpers;
                                        }
                                        return (
                                            <>
                                                {coCurriculumForm.values.activityList.length > 0 &&
                                                    coCurriculumForm.values.activityList.map((activity, index) => {
                                                        const inputFieldErrors: any = coCurriculumForm.errors.activityList && coCurriculumForm.errors.activityList[index] || {};
                                                        const inputFieldTouched = coCurriculumForm.touched.activityList && coCurriculumForm.touched.activityList[index] || {};
                                                        return (
                                                            <div
                                                                key={activity.uniqueId}
                                                                className="tw-grid tw-grid-cols-12 tw-gap-x-3 tw-mb-4"
                                                            >
                                                                <div className="tw-col-span-12 lg:tw-col-span-3">
                                                                    <SelectInput
                                                                        name={`activityList.${index}.level`}
                                                                        menuItems={levelOptions}
                                                                        valueKey="id"
                                                                        textKey="name"
                                                                        labelText="Level"
                                                                        onChange={onChangeLevelHandler}
                                                                        value={activity.level}
                                                                        isDisabled={isViewMode}
                                                                        invalid={(inputFieldTouched.level && inputFieldErrors.level) ? true : false}
                                                                        error={(inputFieldTouched.level && inputFieldErrors.level) ? inputFieldErrors.level : ""}
                                                                    />
                                                                </div>

                                                                <div className="tw-col-span-12">
                                                                    <TextArea
                                                                        name={`activityList.${index}.description`}
                                                                        inputClassName="tw-resize-none"
                                                                        value={activity.description}
                                                                        onChange={coCurriculumForm.handleChange}
                                                                        labelText="Description"
                                                                        isDisabled={isViewMode || !activity.level}
                                                                        invalid={inputFieldTouched.description &&
                                                                            inputFieldErrors.description
                                                                            ? true
                                                                            : false}
                                                                        error={inputFieldTouched.description &&
                                                                            inputFieldErrors.description
                                                                            ? inputFieldErrors.description
                                                                            : ""}
                                                                    />
                                                                </div>

                                                                <div className="tw-col-span-12 lg:tw-col-span-6 2xl:tw-col-span-6">
                                                                    <NgFileUploader
                                                                        formgroupClassName="tw-mb-3"
                                                                        uploadBtnClassName="upload-label-btn-sm"
                                                                        labelText="Upload Certificate"
                                                                        name={`activityList.${index}.uploadedFile`}
                                                                        fileName={activity.fileName}
                                                                        onChangeFileHndlr={onChangeFileInputHndlr}
                                                                        uploadHndlr={fileUploadHndlr}
                                                                        uploadedFile={activity.uploadedFile}
                                                                        downloadLink={activity.downloadLink}
                                                                        isUploaded={activity.isUploaded}
                                                                        dataId={activity.uniqueId}
                                                                        isDisabled={isViewMode || !activity.level || showApiLoader}
                                                                        invalid={(inputFieldTouched.isUploaded && inputFieldErrors.isUploaded) ? true : false}
                                                                        error={(inputFieldTouched.isUploaded && inputFieldErrors.isUploaded) ? inputFieldErrors.isUploaded : ""}
                                                                    />
                                                                </div>

                                                                <div className="tw-col-span-12 lg:tw-col-span-6 2xl:tw-col-span-6 tw-flex tw-justify-end">
                                                                    {index !== 0 && (
                                                                        <div className="lg:tw-pt-4 lg:tw-mt-3">
                                                                            <Button
                                                                                data-index={index}
                                                                                onClick={removeRoleHndlr}
                                                                                variant="reject"
                                                                            >
                                                                                Remove
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>)
                                                    })}
                                            </>
                                        )
                                    }}

                                </FieldArray >
                            </FormikProvider>
                            {!isViewMode && <div className="tw-grid tw-grid-cols-12 tw-gap-3">

                                {/* Add New */}
                                <div className="tw-col-span-12">
                                    <Button
                                        onClick={addNewActivityHandler}
                                        variant="soft"
                                    >
                                        Add New
                                    </Button>
                                </div>

                                {/* Navigation Buttons */}
                                <div className="tw-col-span-12 tw-text-end tw-mt-2 tw-gap-2 tw-ml-auto tw-flex">
                                    <Button
                                        disabled={showApiLoader}
                                        type="button"
                                        onClick={previousBtnHndlr}
                                        variant="previous"
                                    >
                                        Previous
                                    </Button>

                                    <Button
                                        type="button"
                                        disabled={showApiLoader}
                                        onClick={submitHndlr}
                                        variant="primary"
                                    >
                                        Next
                                    </Button>
                                </div>

                            </div>}
                        </AccordionBody>
                    </AccordionItem>
                </UncontrolledAccordion>
            </form>
        </React.Fragment>

    )
}

export default CocurriculurActivity;