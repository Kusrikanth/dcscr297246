import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from 'yup';

import {
    AutoSearchInput,
    AutoSearchInputUpdated,
    DateInput,
    ModalContainer,
    RadioInput,
    RadioInputContainer,
    SelectInput,
    TextArea,
    TextInput,
    UploadFileInput,
    UploadImageUpdated,
} from "../../../Components/Common";
import {
    BonafideCertificateModalProps,
    bonafideCertificateDataTypes,
} from "./bonafideCertificateTypes";
// import {
//   menuItems,
//   selectData4,
//   selectData5,
//   selectData6,
//   selectData7,
// } from "./helper";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { bonafideCertificateDetailsById, getBonafideCertificateByIdAct, getStudentListForBonafideCertificate, getStudentListForTcReq, setBonafideCertificateRes, setTcReqRes, updateBonafideCertificateDetails } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { getBranchClassAct, getBrchSectionsAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { uploadImageFileErrorHndlr } from "../../../utility/commonutility";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { getFormYyyyMmDdFormat, getParticularFormatDate, getYyyyMmDdFormat } from "../../../utility/dateutility";
import { SearchInputWithAutoSearch } from "../../../Components/Common/SearchInputWithautoSearch";
import { searchInputOptions } from "../../Directory/StudentManagement/helper";
import Button from "../../../Components/Common/Button";

function getFormData(editData?: any) {
    const { dateOfAdmission } = editData || {};
    return (
        {
            academicYearId: editData?.academicYearId || "",
            curriculumId: editData?.curriculumId || "",
            certificateType: "Bonafide Certificate",
            classId: editData?.classId || "",
            sectionId: editData?.sectionId || "",
            studentId: editData?.studentId || "",
            fromClassId: editData?.fromClassId || "",
            toClassId: editData?.toClassId || "",
            dateOfAdmission: dateOfAdmission ? getYyyyMmDdFormat(editData?.dateOfAdmission) : "",
            admissionNumber: editData?.admissionNumber || "",
            motherName: editData?.motherName || "",
            fatherName: editData?.fatherName || "",
            dob: editData?.dob || "",
            purpose: editData?.purpose || "",

            className: editData?.className || "",
            curriculumName: editData?.curriculumName || "",
            sectionName: editData?.sectionName || "",
            fromClassName: editData?.fromClassName || "",
            toClassName: editData?.toClassName || ""
        }
    )
}

const filterSearchOptions = searchInputOptions.slice(0, 4);
const initialValues = getFormData();
const NewBonafideCertificateModal = (
    props: BonafideCertificateModalProps
) => {
    const dispatch = useDispatch();
    const [selectedStudentState, setSelectedStudentState] = useState<any>(undefined);
    const [searchCategory, setSearchCategory] = useState('global');

    const { currentBranchIdResp: branchId,
        currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp, branchClassResp, studentListBonafideCertificate, addTcReqRes, brchSectionsResp, bonafideCerificateById, classroomManagmentErrorResp, showApiLoader }: any =
        useAppSelector(
            ({ appData, instAcademics, branchAcademics, classroomManagmentInfo, globalData }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                academicYearListResp: instAcademics.academicYearListResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                branchClassResp: branchAcademics.branchClassResp,
                brchSectionsResp: branchAcademics.brchSectionsResp,
                studentListBonafideCertificate: classroomManagmentInfo.studentListBonafideCertificate,
                bonafideCerificateById: classroomManagmentInfo.bonafideCerificateById,
                addTcReqRes: classroomManagmentInfo.addTcReqRes,
                classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
                showApiLoader: globalData.showApiLoader,

            }),
            shallowEqual
        );

    const cerificateModalRespRef = useRef({
        prevBonafideCerificateById: bonafideCerificateById
    });

    useEffect(() => {
        const { prevBonafideCerificateById } = cerificateModalRespRef.current;
        if (bonafideCerificateById && prevBonafideCerificateById !== bonafideCerificateById) {
            const formData = getFormData(bonafideCerificateById);
            bonafideCertificateForm.setValues((prev: any) => ({ ...prev, ...formData }))
            setSelectedStudentState({
                studentId: bonafideCerificateById?.studentId,
                studentCode: bonafideCerificateById?.studentCode,
                studentName: bonafideCerificateById?.studentName,
            });
        }
        cerificateModalRespRef.current.prevBonafideCerificateById = bonafideCerificateById;
    }, [bonafideCerificateById]);

    const getCurrentAcademicYearId = () => {
        if (academicYearListResp && academicYearListResp.data) {
            const currentYear = academicYearListResp.data.find((year: any) =>
                year.yearStatus?.toLowerCase() === "current" || year.yearStatus === "CURRENT"
            );
            return currentYear?.academicYearId || "";
        }
        return "";
    };

    const getInitialValues = () => {
        const currentAcademicYearId = getCurrentAcademicYearId();
        const baseFormData = getFormData();

        if (props.academicYearId) {
            baseFormData.academicYearId = props.academicYearId;
        } else if (currentAcademicYearId) {
            baseFormData.academicYearId = currentAcademicYearId;
        }

        return baseFormData;
    };

    const validationSchema = Yup.object().shape({
        academicYearId: Yup.string().required('Academic Year is required'),
        fromClassId: Yup.string().when('$bonafideId', {
            is: (bonafideId: any) => !!bonafideId,
            then: Yup.string().required('From Class is required'),
            otherwise: Yup.string(),
        }),
        toClassId: Yup.string().when('$bonafideId', {
            is: (bonafideId: any) => !!bonafideId,
            then: Yup.string().required('To Class is required'),
            otherwise: Yup.string(),
        }),
        studentId: Yup.string().required('Student is required'),
        purpose: Yup.string()
            .required('Purpose is required')
            .max(500, 'Purpose cannot exceed 500 characters'),
    });


    const bonafideCertificateForm = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: (values: any) => {
            let payload = { ...values, requestType: props.requestBy === 'PARENT' ? "Online" : "Offline" };
            delete payload.className;
            delete payload.curriculumName;
            delete payload.sectionName;
            delete payload.fromClassName;
            delete payload.toClassName;
            if (props.bonafideId) {
                dispatch(updateBonafideCertificateDetails(generateActionPayload('update_bonafide_details', { bonafideRequestId: props.bonafideId }, payload)))
            }
            else {
                dispatch(setBonafideCertificateRes(generateActionPayload('add_bonafide_certificate_req', undefined, payload)))
            }
        },
    });

    useEffect(() => {
        if (props.directory) {
            const academicYearId = props.bonafideCertificateDetails?.academicYearId;
            const search = props.bonafideCertificateDetails?.studentCode;

            if (search && academicYearId) {
                bonafideCertificateForm.setFieldValue("academicYearId", academicYearId);
                const params = { academicYearId, branchId, search: search };
                dispatch(getStudentListForBonafideCertificate(generateActionPayload("student_list_for_bonafide_certificate", undefined, params)));
            }
        }
    }, [bonafideCertificateForm.values.academicYearId, props.directory, props.bonafideCertificateDetails?.studentCode]);

    useEffect(() => {
        if (props.directory && studentListBonafideCertificate && studentListBonafideCertificate.length === 1) {
            selectStudentHandler(studentListBonafideCertificate[0]);
        }
    }, [studentListBonafideCertificate]);

    function onInputSearchChange(name: string, inputString: any) {
        const { academicYearId } = bonafideCertificateForm.values;
        console.log(academicYearId, "academicYearId");

        if (inputString && academicYearId) {
            const params = {
                academicYearId: academicYearId,
                branchId: props.branchId,
                search: inputString,
                globalSearch: globalFilterRef.current,
            };
            console.log(params, "params");
            dispatch(getStudentListForBonafideCertificate(generateActionPayload("student_list_for_bonafide_certificate", undefined, params)));
        }
    }

    const globalFilterRef = useRef<string>("global");

    function handleCategoryChange(name: string, value: string) {
        const category = value || "global";
        globalFilterRef.current = category;
        setSearchCategory(category);
        setSelectedStudentState(undefined);
        bonafideCertificateForm.setValues(prevValues => ({
            ...prevValues,
            studentId: "",
            classId: "",
            className: "",
            curriculumId: "",
            curriculumName: "",
            sectionId: "",
            sectionName: "",
            fromClassId: "",
            fromClassName: "",
            toClassId: "",
            toClassName: "",
            dateOfAdmission: "",
            admissionNumber: "",
            fatherName: "",
            motherName: "",
            dob: "",
        }));
    }

    function selectStudentHandler(selectedStudent: any) {
        setSelectedStudentState(selectedStudent);

        if (selectedStudent) {
            const { studentId } = selectedStudent;
            const params = { studentId, };
            // dispatch(getStudentListForBonafideCertificate(generateActionPayload("student_list_for_bonafide_certificate", params, { branchId: props.branchId, academicYearId: bonafideCertificateForm.values.academicYearId })));
            bonafideCertificateForm.setValues((values: any) => ({
                ...values,
                studentId: selectedStudent?.studentId || "",
                classId: selectedStudent?.studentClassId || "",
                className: selectedStudent?.studentClassName || "",
                curriculumId: selectedStudent?.curriculumId || "",
                curriculumName: selectedStudent?.curriculumName || "",
                sectionId: selectedStudent?.studentSectionId || "",
                sectionName: selectedStudent?.studentSectionName || "",
                fromClassId: selectedStudent?.fromClassId || "",
                fromClassName: selectedStudent?.fromClassName || "",
                toClassId: selectedStudent?.toClassId || "",
                toClassName: selectedStudent?.toClassName || "",
                admissionNumber: selectedStudent?.admissionNumber || "",
                fatherName: selectedStudent?.fatherName || "",
                motherName: selectedStudent?.motherName || "",
                dob: selectedStudent?.dob || "",
                dateOfAdmission: selectedStudent?.dateOfAdmission || ""
            }));
        } else {
            bonafideCertificateForm.setFieldValue('studentId', '');
        }
    }

    const filterHandler = (event: any) => {
        bonafideCertificateForm.handleChange(event);
        const { name, value } = event.target;
        if (name === "curriculumId") {
            const payload = { branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
        }
        if (name === "classId") {
            const payload1 = { branchId: props.branchId, academicYearId: bonafideCertificateForm.values.academicYearId, branchCurriculumId: bonafideCertificateForm.values.curriculumId, classId: value, pageNo: 0, pageSize: 100 };
            dispatch(getBrchSectionsAct(generateActionPayload("get_brch_sections", undefined, payload1)));
            // const payload = { branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            // dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
        }
        // if(name==="curriculumId"){
        //   const payload=
        //   dispatch(getStudentListForTcReq(generateActionPayload('student_list_for_tc_req',undefined,)))
        // }
    }
    function getClassApiCall(curriculumId: string) {
        const payload = { academicYearId: bonafideCertificateForm.values.academicYearId, curriculumId: bonafideCertificateForm.values.curriculumId, pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", branchId };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }
    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current").academicYearId
        if (!props.currentStudent) {
            bonafideCertificateForm.setFieldValue('academicYearId', yearId)
        }
        // setTransferCertificateFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    }, [academicYearListResp])

    useEffect(() => {
        if (!props.bonafideId && !props.academicYearId && academicYearListResp) {
            let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT").academicYearId
            bonafideCertificateForm.setFieldValue('academicYearId', yearId)
        } else if (!props.bonafideId && props.academicYearId) {
            bonafideCertificateForm.setFieldValue('academicYearId', props.academicYearId);
        }
    }, [props.bonafideId, props.academicYearId, academicYearListResp])

    useEffect(() => {
        return () => {
            dispatch(getBonafideCertificateByIdAct(undefined));
        }
    }, []);

    useEffect(() => {
        const { isOpen, bonafideId, currentStudent } = props;
        if (isOpen && bonafideId) {
            dispatch(bonafideCertificateDetailsById(generateActionPayload('bonafide_request_by_id', { bonafideRequestId: props.bonafideId })))
        } else if (isOpen && currentStudent) {
            const { academicYearId, childBranchId, childName } = currentStudent;
            if (academicYearId) {
                const params = {
                    academicYearId: academicYearId, branchId: childBranchId,
                    search: childName
                };
                dispatch(getStudentListForBonafideCertificate(generateActionPayload("student_list_for_bonafide_certificate", undefined, params)));
            }
        }
    }, [props.isOpen, props.bonafideId, props.currentStudent])


    useEffect(() => {
        if (studentListBonafideCertificate && props.currentStudent) {
            const student = studentListBonafideCertificate.find((student: any) => student?.studentId === props?.currentStudent?.childId);
            if (student) {
                selectStudentHandler(student);
            }
        }
    }, [studentListBonafideCertificate])


    const { data: academicYearList } = academicYearListResp || {};
    const { content: classTypes } = branchClassResp || {};
    return (
        <>
            <div style={{ padding: "1.25rem" }}>
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                    <div className="tw-col-span-1">
                        <SelectInput
                            name="academicYearId"
                            labelText="Academic Year"
                            labelClass={(props.bonafideId || props.requestBy === "PARENT") ? "" : "required"}
                            value={bonafideCertificateForm.values.academicYearId}
                            onChange={filterHandler}
                            menuItems={academicYearList}
                            valueKey="academicYearId"
                            textKey="academicYearName"
                            isDisabled={props.requestBy === "PARENT" || props.directory}
                            invalid={bonafideCertificateForm.touched.academicYearId && bonafideCertificateForm.errors.academicYearId ? true : false}
                            error={bonafideCertificateForm.touched.academicYearId && bonafideCertificateForm.errors.academicYearId ? bonafideCertificateForm.errors.academicYearId : ""}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <label className="tw-block tw-text-sm tw-font-medium tw-mb-1">
                            Student
                        </label>
                        <SearchInputWithAutoSearch
                            className="tw-mb-3"
                            name="studentSearchCategory"
                            labelClassName={!!props.currentStudent ? "" : "required"}
                            menuItems={filterSearchOptions}
                            idKey="id"
                            value={searchCategory}
                            onChange={handleCategoryChange}
                            renderOptions={(item: any) => item.name}
                            renderSelectedValue={(item: any) => item?.name || "Global Search"}
                            searchHandler={onInputSearchChange}
                            searchOptions={studentListBonafideCertificate || []}
                            labelKey="studentName"
                            subLabelKey="studentCode"
                            valueKey="studentId"
                            labelHeaderName="Student Name"
                            subLabelHeaderName="Student Code"
                            hideDefaultSelect={true}
                            selected={selectedStudentState}
                            selectedOptionCallbck={selectStudentHandler}
                            isDisabled={(props.bonafideId || props.currentStudent || props.directory) ? true : false}
                            invalid={(bonafideCertificateForm.touched.studentId && bonafideCertificateForm.errors.studentId) ? true : false}
                            error={(bonafideCertificateForm.touched.studentId && bonafideCertificateForm.errors.studentId) ? bonafideCertificateForm.errors.studentId : ""}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextInput
                            name="curriculumName"
                            labelText="Curriculum"
                            value={bonafideCertificateForm.values.curriculumName}
                            onChange={null}
                            isReadOnly={true}
                        // inputClassName="bg-light"
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextInput
                            name="certificateType"
                            labelText="Certificate"
                            value={bonafideCertificateForm.values.certificateType}
                            onChange={null}
                            isReadOnly={true}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextInput
                            name="className"
                            labelText="Class"
                            value={bonafideCertificateForm.values.className}
                            onChange={null}
                            isReadOnly={true}
                        // inputClassName="bg-light"
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextInput
                            name="sectionName"
                            labelText="Section"
                            value={bonafideCertificateForm.values.sectionName}
                            onChange={null}
                            isReadOnly={true}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        {
                            !props.bonafideId ? (
                                <TextInput
                                    name="fromClassName"
                                    labelText="From Class"
                                    value={bonafideCertificateForm.values.fromClassName}
                                    onChange={filterHandler}
                                    isDisabled={props?.bonafideId ? false : true}
                                />
                            ) : (
                                <SelectInput
                                    name="fromClassId"
                                    labelText="From Class"
                                    labelClass={(props.bonafideId || props.requestBy === "PARENT") ? "" : "required"}
                                    isDisabled={props?.bonafideId ? false : true}
                                    value={bonafideCertificateForm.values.fromClassId}
                                    onChange={filterHandler}
                                    menuItems={classTypes}
                                    valueKey="id"
                                    textKey="shortName"
                                    invalid={bonafideCertificateForm.touched.fromClassId && bonafideCertificateForm.errors.fromClassId ? true : false}
                                    error={bonafideCertificateForm.touched.fromClassId && bonafideCertificateForm.errors.fromClassId ? bonafideCertificateForm.errors.fromClassId : ""}
                                />
                            )
                        }
                    </div>

                    <div className="tw-col-span-1">
                        {
                            !props.bonafideId ? (
                                <TextInput
                                    name="toClassName"
                                    labelText="To Class"
                                    value={bonafideCertificateForm.values.toClassName}
                                    onChange={filterHandler}
                                    isDisabled={props?.bonafideId ? false : true}
                                />
                            ) : (
                                <SelectInput
                                    name="toClassId"
                                    labelText="To Class"
                                    labelClass={(props.bonafideId || props.requestBy === "PARENT") ? "" : "required"}
                                    isDisabled={props?.bonafideId ? false : true}
                                    value={bonafideCertificateForm.values.toClassId}
                                    onChange={filterHandler}
                                    menuItems={classTypes}
                                    valueKey="id"
                                    textKey="shortName"
                                    invalid={bonafideCertificateForm.touched.toClassId && bonafideCertificateForm.errors.toClassId ? true : false}
                                    error={bonafideCertificateForm.touched.toClassId && bonafideCertificateForm.errors.toClassId ? bonafideCertificateForm.errors.toClassId : ""}
                                />
                            )
                        }
                    </div>
                    <div className="tw-col-span-1">
                        <DateInput
                            name="dateOfAdmission"
                            labelText="Date of Admission"
                            value={bonafideCertificateForm.values.dateOfAdmission}
                            onChange={bonafideCertificateForm.handleChange}
                            isReadOnly={true}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextInput
                            name="admissionNumber"
                            labelText="Admission No."
                            value={bonafideCertificateForm.values.admissionNumber}
                            onChange={null}
                            isReadOnly={true}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextInput
                            name="motherName"
                            labelText="Mother Name"
                            value={bonafideCertificateForm.values.motherName}
                            onChange={null}
                            isReadOnly={true}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <TextInput
                            name="fatherName"
                            labelText="Father Name"
                            value={bonafideCertificateForm.values.fatherName}
                            onChange={null}
                            isReadOnly={true}
                        />
                    </div>
                    <div className="tw-col-span-1">
                        <DateInput
                            name="dob"
                            labelText="Date of Birth"
                            value={bonafideCertificateForm.values.dob}
                            onChange={null}
                            isDisabled={true}
                        />
                    </div>
                    <div className="tw-col-span-2">
                        <TextArea
                            name="purpose"
                            labelText="Purpose"
                            labelClass="required"
                            value={bonafideCertificateForm.values.purpose}
                            onChange={bonafideCertificateForm.handleChange}
                            onBlur={bonafideCertificateForm.handleBlur}
                            invalid={bonafideCertificateForm.touched.purpose && bonafideCertificateForm.errors.purpose ? true : false}
                            error={bonafideCertificateForm.touched.purpose && bonafideCertificateForm.errors.purpose ? bonafideCertificateForm.errors.purpose : ""}
                        />
                    </div>
                </div>
                <div className="tw-flex tw-flex-row tw-gap-2 tw-justify-end tw-mb-1 tw-mt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => props.toggle(undefined, undefined)}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        variant="primary"
                        onClick={(event: any) => bonafideCertificateForm.handleSubmit(event)}
                        disabled={showApiLoader}
                    >
                        {props.bonafideId ? "Update" : "Submit"}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default NewBonafideCertificateModal;
