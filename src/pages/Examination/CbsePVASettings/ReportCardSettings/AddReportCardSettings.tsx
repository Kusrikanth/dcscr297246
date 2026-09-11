import React, { useRef, useEffect, useMemo, useState } from "react";
import { FieldArray, useFormik, FormikProvider, ArrayHelpers } from "formik";
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { ModalContainerUpdated, RadioInputContainer, SelectInput } from "../../../../Components/Common";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getCbseExaminationListAct, getIgseTermNameListAct, getReportCardConfigAct, getReportCardSettingsAct, saveCbseInternalSubjectsGradesAct, saveReportCardSettingsAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { nanoid } from "nanoid";
import * as Yup from "yup";
import { mapDisplayOptions, generationType, progressCardTypes, yesNoOptions, generatePayload, generateFormData } from "./helper";
import { getFilterListForCbseAct } from "../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { toast } from "react-toastify";
import { Tooltip } from 'reactstrap';
import { useModal } from "../../../../hooks/modalhook";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { DragDropIcon } from "@hugeicons-pro/core-stroke-standard";

const initialValues = {
    academicYearId: "",
    branchCurriculumId: "",
    branchClassId: "",
    progressCardType: "PVA",
    configClasses: [
        {
            uniqueId: nanoid(),
            generationType: "",
            id: "",
            displayTypes: "",
            isFeeCheckEnabled: true,
            remarks: "",
            displayOrder: 1
        },
    ],
};

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic Year is required."),
    branchCurriculumId: Yup.string().required("Curriculum is required."),
    branchClassId: Yup.string().required("Class is required."),
    progressCardType: Yup.string().required("Progress card type is required."),
    configClasses: Yup.array().of(
        Yup.object().shape({
            generationType: Yup.string().required("Generation type is required."),
            id: Yup.string().when("generationType",{
                is: "EXAM",
                then: (schema) => schema.required("Examination is required for EXAM."),
                otherwise: (schema) => schema.notRequired(),
            }),
        })
    )
});

const SortableConfigRow = ({ configClass, index, formikForm, inputFieldErrors, inputFieldTouched, generationTypeOptions, getIgseTermNameListResp, getCbseExaminationRequestListResp, getFilterListForCbseResp, onChangeConfigHandler, handleFeeCheckChange, removeGradesHndlr, tooltipOpen, toggleTooltip }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
        id: configClass.uniqueId 
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="row gy-2 mb-3"
        >
            <div className="col-auto d-flex align-items-center" style={{ width: '40px' }}>
                <span {...attributes} {...listeners} style={{ cursor: 'grab', display: 'flex', alignItems: 'center' }}>
                    <HugeiconsIcon style={{ cursor: "grab" }} icon={DragDropIcon} size={28} color={"black"} />
                </span>
            </div>
            <div className="col-12 col-md-3" style={{ flex: '0 0 calc(25% - 40px)', maxWidth: 'calc(25% - 40px)' }}>
                <SelectInput
                    name={`configClasses.${index}.generationType`}
                    labelClass="required"
                    isDisabled={!formikForm.values.branchClassId}
                    value={configClass.generationType}
                    formgroupClassName="mb-0"
                    menuItems={generationTypeOptions}
                    valueKey="id"
                    textKey="name"
                    onChange={onChangeConfigHandler}
                    invalid={inputFieldTouched.generationType && inputFieldErrors.generationType ? true : false}
                    error={inputFieldTouched.generationType && inputFieldErrors.generationType ? inputFieldErrors.generationType : ""}
                />
            </div>
            <div className="col-12 col-md-3">
                {(!configClass.generationType || configClass.generationType === "TERM") && <SelectInput
                    name={`configClasses.${index}.id`}
                    labelClass="required"
                    isDisabled={!formikForm.values.branchClassId || !configClass.generationType}
                    value={configClass.id}
                    formgroupClassName="mb-0"
                    menuItems={getIgseTermNameListResp?.data}
                    valueKey="termId"
                    textKey="termName"
                    defaultSelect={configClass.generationType === "TERM" ? "Both Term" : ""}
                    onChange={formikForm.handleChange}
                    invalid={inputFieldTouched.id && inputFieldErrors.id ? true : false}
                    error={inputFieldTouched.id && inputFieldErrors.id ? inputFieldErrors.id : ""}
                />}
                {configClass.generationType === "EXAM" && <SelectInput
                    name={`configClasses.${index}.id`}
                    labelClass="required"
                    isDisabled={!formikForm.values.branchClassId}
                    value={configClass.id}
                    formgroupClassName="mb-0"
                    menuItems={getCbseExaminationRequestListResp?.data}
                    valueKey="id"
                    textKey="examinationName"
                    onChange={formikForm.handleChange}
                    invalid={inputFieldTouched.id && inputFieldErrors.id ? true : false}
                    error={inputFieldTouched.id && inputFieldErrors.id ? inputFieldErrors.id : ""}
                />}
            </div>
            <div className="col-12 col-md-3 tw-flex tw-gap-3 tw-flex-wrap tw-pt-1">
                <RadioInputContainer
                    name={`configClasses.${index}.displayTypes`}
                    containerClassName="d-flex"
                    labelClassName="mb-0 me-3"
                    formgroupClassName="mb-0"
                    radioOptions={mapDisplayOptions(configClass.generationType, formikForm.values.progressCardType, getFilterListForCbseResp)}
                    value={configClass.displayTypes}
                    onChange={formikForm.handleChange}
                    invalid={inputFieldTouched.displayTypes && inputFieldErrors.displayTypes ? true : false}
                    error={inputFieldTouched.displayTypes && inputFieldErrors.displayTypes ? inputFieldErrors.displayTypes : ""}
                />
            </div>
            <div className="col-12 col-md-2 tw-pt-1 d-flex align-items-center">
                <RadioInputContainer
                    name={`configClasses.${index}.isFeeCheckEnabled`}
                    containerClassName="d-flex"
                    labelClassName="mb-0 me-3"
                    formgroupClassName="mb-0"
                    radioOptions={yesNoOptions}
                    value={configClass.isFeeCheckEnabled?.toString()}
                    onChange={(e) => handleFeeCheckChange(e, index)}
                />
                {configClass.remarks && (
                    <div className="ms-2" style={{ display: 'inline-block' }}>
                        <i
                            id={`remarksTooltip-${index}`}
                            className="ri-information-line text-primary fs-18 cursor-pointer"
                            style={{ cursor: 'pointer' }}
                        />
                        <Tooltip
                            placement="top"
                            isOpen={tooltipOpen[index] || false}
                            target={`remarksTooltip-${index}`}
                            toggle={() => toggleTooltip(index)}
                        >
                            {configClass.remarks}
                        </Tooltip>
                    </div>
                )}
            </div>
            <div className="col-12 col-md-1 justify-content-end d-flex align-items-start">
                <button
                    data-index={index}
                    onClick={removeGradesHndlr}
                    type="button"
                    className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white"
                >
                    <i className="ri-delete-bin-2-fill" />
                </button>
            </div>
        </div>
    );
};

const AddReportCardSettings = (props: any) => {
    const { instituteId, branchId, modalData } = props || {};
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const { closeModal: closeExportSectionModalHnldr, openModal: openExportSectionModalHnldr, modalState: exportSectionModalState } = useModal();
    const [currentConfigIndex, setCurrentConfigIndex] = useState<number | null>(null);
    const [tooltipOpen, setTooltipOpen] = useState<{[key: number]: boolean}>({});

    const dispatch = useAppDispatch();

    const { academicYearListResp,
        getCbseExaminationRequestListResp, getFilterListForCbseResp,
        reportCardConfigResp,
        getIgseTermNameListResp, saveReportCardSettingsResp, examinationCurriculumResp, examinationClassResp,
        showApiLoader } = useAppSelector(
            ({ instAcademics, examinationSettings, examinationManagement, branchAcademics, globalData }) => ({
                academicYearListResp: instAcademics.academicYearListResp,
                examinationCurriculumResp: branchAcademics.branchCurriculumScopeResp?.examination,
                examinationClassResp: branchAcademics.branchClassScopeResp?.examination,
                getCbseExaminationRequestListResp: examinationSettings.getCbseExaminationRequestListResp,
                getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
                saveReportCardSettingsResp: examinationSettings.saveReportCardSettingsResp,
                reportCardConfigResp: examinationSettings.reportCardConfigResp,
                getFilterListForCbseResp: examinationManagement.getFilterListForCbseResp,
                showApiLoader: globalData.showApiLoader,
            }),
            shallowEqual
        );

    const reportCardSettingsRespRef = useRef({
        prevReportCardConfigResp: reportCardConfigResp,
        prevSaveReportCardSettingsResp: saveReportCardSettingsResp
    });

    useEffect(() => {
        const { prevReportCardConfigResp, prevSaveReportCardSettingsResp } = reportCardSettingsRespRef.current || {};
        if (reportCardConfigResp && prevReportCardConfigResp !== reportCardConfigResp) {
            const configClasses = generateFormData(reportCardSettingsForm.values.progressCardType,
                reportCardConfigResp);
            reportCardSettingsForm.setValues((prev: any) => ({
                ...prev,
                configClasses,
            }));
        } else if (saveReportCardSettingsResp && prevSaveReportCardSettingsResp !== saveReportCardSettingsResp) {
            toast.success("Report card settings updated successfully.");
            props.toggle(true);
        }
        reportCardSettingsRespRef.current.prevReportCardConfigResp = reportCardConfigResp;
        reportCardSettingsRespRef.current.prevSaveReportCardSettingsResp = saveReportCardSettingsResp;
    }, [reportCardConfigResp, saveReportCardSettingsResp]);

    const reportCardSettingsForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const valuesWithOrder = {
                ...values,
                configClasses: values.configClasses.map((item, index) => ({
                    ...item,
                    displayOrder: index + 1
                }))
            };
            
            const payload = generatePayload(valuesWithOrder, {
                instituteId, branchId
            });
            dispatch(saveReportCardSettingsAct(generateActionPayload('save_report_card_settings', undefined, payload)));
        },
    });

    function getClassApiCall(otherProps?: any) {
        const payload = {
            academicYearId: reportCardSettingsForm.values.academicYearId,
            curriculumId: reportCardSettingsForm.values.branchCurriculumId,
            branchId,
            pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",
            ...otherProps
        };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload, {
            scope: 'examination'
        })));
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: reportCardSettingsForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1, { scope: 'examination' })));
    }

    const toggleTooltip = (index: number) => {
        setTooltipOpen(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const reportCardConfigApiCall = (otherProps?: any) => {
        const { branchClassId: classId, branchCurriculumId: curriculumId,
            academicYearId, progressCardType,
        } = reportCardSettingsForm.values || {};
        const payload = {
            instituteId,
            branchId,
            academicYearId,
            curriculumId,
            classId,
            progressCardType,
            ...otherProps
        };
        dispatch(getReportCardConfigAct(generateActionPayload("report_card_config", undefined, payload)));
    };

    const igseTermsApiCall = (otherProps?: any) => {
        const { branchCurriculumId } = reportCardSettingsForm.values;
        let payload = {
            branchId,
            curriculumId: branchCurriculumId,
            ...otherProps
        };
        dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, payload)));
    };

    function getExaminationListApiCall(otherProps?: any) {
        const { academicYearId, branchCurriculumId: curriculumId, branchClassId: classId } = reportCardSettingsForm.values;
        const payload = {
            branchId,
            curriculumId,
            academicYearId,
            classId,
            pageNo: 0,
            pageSize: 100,
            ...otherProps
        };
        dispatch(getCbseExaminationListAct(generateActionPayload("get_cbse_examination_list", undefined, payload)));
    }

    function filterListForCbseApiCall(otherProps?: any) {
        const { branchCurriculumId: curriculumId, branchClassId: classId } = reportCardSettingsForm.values;
        const payload = {
            curriculumId: curriculumId, classId: classId, branchId,
            ...otherProps
        }
        dispatch(getFilterListForCbseAct(generateActionPayload('get_cbse_progress_card_filter_list', undefined, payload)))
    }

    const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        reportCardSettingsForm.setFieldValue(name, value);
        if (value) {
            if (name === "academicYearId") {
                reportCardSettingsForm.setValues((prev) => ({
                    ...prev,
                    academicYearId: value,
                    branchCurriculumId: "",
                    branchClassId: "",
                    configClasses: [
                        {
                            uniqueId: nanoid(),
                            generationType: "",
                            id: "",
                            displayTypes: "",
                            isFeeCheckEnabled: true,
                            remarks: "",
                            displayOrder: 1
                        },
                    ],
                }));
                getCurriculumApiCall({ academicYearId: value });
            } else if (name === "branchClassId") {
                getExaminationListApiCall({ classId: value });
                reportCardConfigApiCall({
                    classId: value,
                });
                filterListForCbseApiCall({ classId: value });
                reportCardSettingsForm.setValues((prev) => ({
                    ...prev,
                    branchClassId: value,
                    configClasses: [
                        {
                            uniqueId: nanoid(),
                            generationType: "",
                            id: "",
                            displayTypes: "",
                            isFeeCheckEnabled: true,
                            remarks: "",
                            displayOrder: 1
                        },
                    ],
                }));
            } else if (name === "progressCardType") {
                reportCardConfigApiCall({ progressCardType: value });
                reportCardSettingsForm.setValues((prev) => ({
                    ...prev,
                    progressCardType: value,
                    configClasses: [
                        {
                            uniqueId: nanoid(),
                            generationType: "",
                            id: "",
                            displayTypes: "",
                            isFeeCheckEnabled: true,
                            remarks: "",
                            displayOrder: 1
                        },
                    ],
                }));
            }
        }
    }

    useEffect(() => {
        if (modalData) {
            reportCardSettingsForm.setValues(prevValues => ({
                ...prevValues,
                academicYearId: modalData?.academicYearId,
                branchCurriculumId: modalData?.curriculumId,
                branchClassId: modalData?.classId,
                progressCardType: modalData?.progressCardType || "PVA",
            }));
            getCurriculumApiCall({ academicYearId: modalData?.academicYearId });
            igseTermsApiCall({ curriculumId: modalData?.curriculumId, });
            getClassApiCall({ academicYearId: modalData?.academicYearId, curriculumId: modalData?.curriculumId });
            if (modalData?.classId) {
                reportCardConfigApiCall({
                    academicYearId: modalData?.academicYearId,
                    curriculumId: modalData?.curriculumId,
                    classId: modalData?.classId,
                    progressCardType: modalData?.progressCardType || "PVA",
                });
                filterListForCbseApiCall({
                    curriculumId: modalData?.curriculumId,
                    classId: modalData?.classId,
                });
                getExaminationListApiCall({
                    academicYearId: modalData?.academicYearId,
                    curriculumId: modalData?.curriculumId,
                    classId: modalData?.classId
                });
            }
        }
    }, [modalData, instituteId, branchId]);

    function addWeightageHandler() {
        if (formikArrayHelpers.current) {
            const newOrder = reportCardSettingsForm.values.configClasses.length + 1;
            formikArrayHelpers.current.push({
                uniqueId: generateUniqueNumber(),
                generationType: "",
                id: "",
                displayTypes: "",
                isFeeCheckEnabled: true,
                remarks: "",
                displayOrder: newOrder
            });
        }
    }

    function removeGradesHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }

    function onChangeConfigHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        const documentIndexKey = name.split(".")[1];
        reportCardSettingsForm.setFieldValue(name, value);
        reportCardSettingsForm.setFieldValue(`configClasses.${documentIndexKey}.id`, "");
        reportCardSettingsForm.setFieldValue(`configClasses.${documentIndexKey}.displayTypes`, "");
    }

    function handleFeeCheckChange(event: React.ChangeEvent<HTMLInputElement>, index: number) {
        const { name, value } = event.target;
        const boolValue = value === "true";
        
        if (!boolValue) {
            setCurrentConfigIndex(index);
            openExportSectionModalHnldr();
        } else {
            reportCardSettingsForm.setFieldValue(name, boolValue);
            reportCardSettingsForm.setFieldValue(`configClasses.${index}.remarks`, "");
        }
    }

    function submitExportHndlr(remarks: string) {        
        if (currentConfigIndex !== null) {
            reportCardSettingsForm.setFieldValue(`configClasses.${currentConfigIndex}.isFeeCheckEnabled`, false);
            reportCardSettingsForm.setFieldValue(`configClasses.${currentConfigIndex}.remarks`, remarks);
            closeExportSectionModalHnldr();
            setCurrentConfigIndex(null);
        }
    }

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        
        if (active.id !== over.id) {
            const oldIndex = reportCardSettingsForm.values.configClasses.findIndex(
                (item: any) => item.uniqueId === active.id
            );
            const newIndex = reportCardSettingsForm.values.configClasses.findIndex(
                (item: any) => item.uniqueId === over.id
            );
            
            const newConfigClasses = arrayMove(
                reportCardSettingsForm.values.configClasses,
                oldIndex,
                newIndex
            );
            
            reportCardSettingsForm.setFieldValue('configClasses', newConfigClasses);
        }
    };

    const generationTypeOptions = useMemo(() => {
        if (reportCardSettingsForm.values.progressCardType === "SPORTS") {
            return generationType.filter(item => item.id !== "EXAM");
        }
        return generationType;
    }, [generationType, reportCardSettingsForm.values.progressCardType]);

    return (
        <>
            <form>
                <div className="row g-3 mb-2 px-4 py-3">
                    <div className="col-12 col-md-3 col-lg-2">
                        <SelectInput
                            name="academicYearId"
                            labelText="Academic Year"
                            labelClass="required"
                            formgroupClassName="mb-0"
                            value={reportCardSettingsForm.values.academicYearId}
                            onChange={handleSelectChange}
                            menuItems={academicYearListResp?.data}
                            valueKey="academicYearId"
                            textKey="academicYearName"
                            invalid={(reportCardSettingsForm.touched.academicYearId && reportCardSettingsForm.errors.academicYearId) ? true : false}
                            error={(reportCardSettingsForm.touched.academicYearId && reportCardSettingsForm.errors.academicYearId) ? reportCardSettingsForm.errors.academicYearId : ""}
                        />
                    </div>
                    <div className="col-12 col-md-3 col-lg-2">
                        <SelectInput
                            name="branchCurriculumId"
                            labelText="Curriculum"
                            formgroupClassName="mb-0"
                            value={reportCardSettingsForm.values.branchCurriculumId}
                            onChange={reportCardSettingsForm.handleChange}
                            menuItems={examinationCurriculumResp?.data}
                            isDisabled
                            valueKey="branchCurriculumId"
                            textKey="curriculumName"
                            labelClass="required"
                            invalid={(reportCardSettingsForm.touched.branchCurriculumId && reportCardSettingsForm.errors.branchCurriculumId) ? true : false}
                            error={(reportCardSettingsForm.touched.branchCurriculumId && reportCardSettingsForm.errors.branchCurriculumId) ? reportCardSettingsForm.errors.branchCurriculumId : ""}
                        />
                    </div>
                    <div className="col-12 col-md-3 col-lg-2">
                        <SelectInput
                            name="branchClassId"
                            labelText="Class"
                            formgroupClassName="mb-0"
                            value={reportCardSettingsForm.values.branchClassId}
                            onChange={handleSelectChange}
                            menuItems={examinationClassResp?.content}
                            valueKey="id"
                            textKey="shortName"
                            labelClass="required"
                            invalid={(reportCardSettingsForm.touched.branchClassId && reportCardSettingsForm.errors.branchClassId) ? true : false}
                            error={(reportCardSettingsForm.touched.branchClassId && reportCardSettingsForm.errors.branchClassId) ? reportCardSettingsForm.errors.branchClassId : ""}
                        />
                    </div>
                    <div className="col-12 col-md-3 col-lg-2">
                        <SelectInput
                            name="progressCardType"
                            labelText="Progress Card Type"
                            formgroupClassName="mb-0"
                            value={reportCardSettingsForm.values.progressCardType}
                            onChange={handleSelectChange}
                            menuItems={progressCardTypes}
                            valueKey="id"
                            textKey="name"
                            labelClass="required"
                            invalid={(reportCardSettingsForm.touched.progressCardType && reportCardSettingsForm.errors.progressCardType) ? true : false}
                            error={(reportCardSettingsForm.touched.progressCardType && reportCardSettingsForm.errors.progressCardType) ? reportCardSettingsForm.errors.progressCardType : ""}
                        />
                    </div>
                </div>
                <div className="bg-light py-2 px-4">
                    <div className="row gy-2">
                        <div className="col-auto" style={{ width: '40px' }}></div>
                        <div className="col-12 col-md-3 d-flex align-items-center" style={{ flex: '0 0 calc(25% - 40px)', maxWidth: 'calc(25% - 40px)' }}>Generation Type&nbsp;<span className="text-danger">*</span></div>
                        <div className="col-12 col-md-3 d-flex align-items-center">Exam/Term Name&nbsp;<span className="text-danger">*</span></div>
                        <div className="col-12 col-md-3 d-flex align-items-center">Display&nbsp;<span className="text-danger">*</span></div>
                        <div className="col-12 col-md-2 d-flex align-items-center tw-whitespace-nowrap">Restrict Fee Due students&nbsp;<span className="text-danger">*</span></div>
                        <div className="col-12 col-md-1 justify-content-end d-flex align-items-center">
                            <button
                                onClick={addWeightageHandler}
                                type="button"
                                disabled={!reportCardSettingsForm.values.branchClassId}
                                className="btn-sm btn-icon btn btn-outline-primary"
                            >
                                <i className="ri-add-line fs-18" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="pt-3 px-4">
                    <FormikProvider value={reportCardSettingsForm}>
                        <FieldArray name="configClasses">
                            {(arrayHelpers: ArrayHelpers) => {
                                if (!formikArrayHelpers.current) {
                                    formikArrayHelpers.current = arrayHelpers;
                                }
                                return (
                                    <DndContext 
                                        collisionDetection={closestCenter} 
                                        onDragEnd={handleDragEnd}
                                    >
                                        <SortableContext 
                                            items={reportCardSettingsForm.values.configClasses.map((item: any) => item.uniqueId)} 
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {reportCardSettingsForm.values.configClasses.length > 0 &&
                                                reportCardSettingsForm.values.configClasses.map(
                                                    (configClass: any, index: number) => {
                                                        const inputFieldErrors: any = reportCardSettingsForm.errors.configClasses && reportCardSettingsForm.errors.configClasses[index] || {};
                                                        const inputFieldTouched: any = reportCardSettingsForm.touched.configClasses && reportCardSettingsForm.touched.configClasses[index] || {};
                                                        return (
                                                            <SortableConfigRow
                                                                key={configClass.uniqueId}
                                                                configClass={configClass}
                                                                index={index}
                                                                formikForm={reportCardSettingsForm}
                                                                inputFieldErrors={inputFieldErrors}
                                                                inputFieldTouched={inputFieldTouched}
                                                                generationTypeOptions={generationTypeOptions}
                                                                getIgseTermNameListResp={getIgseTermNameListResp}
                                                                getCbseExaminationRequestListResp={getCbseExaminationRequestListResp}
                                                                getFilterListForCbseResp={getFilterListForCbseResp}
                                                                onChangeConfigHandler={onChangeConfigHandler}
                                                                handleFeeCheckChange={handleFeeCheckChange}
                                                                removeGradesHndlr={removeGradesHndlr}
                                                                tooltipOpen={tooltipOpen}
                                                                toggleTooltip={toggleTooltip}
                                                            />
                                                        );
                                                    }
                                                )}
                                        </SortableContext>
                                    </DndContext>
                                );
                            }}
                        </FieldArray>
                    </FormikProvider>
                </div>
                <div className="row">
                    <div className="d-flex gap-2 w-auto ms-auto mx-4 mt-2 mb-3">
                        <button
                            type="button"
                            className={"btn btn-light"}
                            onClick={props.toggle}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className={`btn btn-success`}
                            disabled={showApiLoader}
                            onClick={(event: any) => reportCardSettingsForm.handleSubmit(event)}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </form>
            <ModalContainerUpdated
                id="export-section-modal"
                isOpen={exportSectionModalState.showModal}
                toggle={closeExportSectionModalHnldr}
                modalTitle="Enter Remarks for Fee Restriction"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportSectionModalState.showModal}
                    toggle={closeExportSectionModalHnldr}
                    instituteId={instituteId}
                    submitHndlr={submitExportHndlr}
                    feature="examination"
                    subFeature="progress_card_config"
                    remarksText="Please enter remarks for restricting fee due students"
                    hideEnterRemarks={false}
                    showEnterRemarks
                />
            </ModalContainerUpdated>
        </>
    );
};

export default AddReportCardSettings;