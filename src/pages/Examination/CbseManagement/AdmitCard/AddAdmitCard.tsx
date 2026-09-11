import React, { useState, useEffect, useMemo } from "react";
import { useFormik, } from "formik";
import { SelectInput } from "../../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import * as Yup from "yup"
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getCbseExaminationListAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { getAssignCurriculumListAct, getAssignLanClassListAct, getAssignLanSectionListAct } from "../../../../store/assignlanguages/assignlanguagesaction";
import { resetAssignLanClassListAct, resetAssignLanSectionListAct } from "../../../../store/assignlanguages/assignlanguagesslice";
import { generateAdmitCardAct } from "../../../../store/examination/examinationmanagement/examinationmanagementactions";

const initialValues = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
    sectionId: "",
    examinationId: "",
};

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic Year is required."),
    curriculumId: Yup.string().required("Curriculum is required."),
    classId: Yup.string().required("Class is required."),
    examinationId: Yup.string().required("Examination is required."),
});


const AddAdmitCard: React.FC<any> = (props: any) => {
    const dispatch = useAppDispatch()

    const {
        academicYearListResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getCbseExaminationRequestListResp,
        getAssignListCurriculumResp,
        getAssignLanClassListResp,
        getAssignLanSectionListResp,
    } = useAppSelector(
        ({ globalData, instAcademics, appData, examinationSettings, assignLanguages }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getCbseExaminationRequestListResp: examinationSettings.getCbseExaminationRequestListResp,
            getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
            getAssignLanClassListResp: assignLanguages.getAssignLanClassListResp,
            getAssignLanSectionListResp: assignLanguages.getAssignLanSectionListResp,
        }),
        shallowEqual
    );

    const addAdmitCardForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const payload = { branchId, ...values }
            dispatch(generateAdmitCardAct(generateActionPayload("generate_admit_card", undefined, payload)));
        },
    });

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: addAdmitCardForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }
    const getClassApiCall = (otherProps?: any) => {
        const payload = { branchId: branchId, academicYearId: addAdmitCardForm.values?.academicYearId, curriculumId: addAdmitCardForm.values.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
        dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const getSectionListResp = (otherProps?: any) => {

        let payload = { branchClassId: addAdmitCardForm.values.classId || null, masterAcademicYearId: addAdmitCardForm.values.academicYearId, curriculumId: addAdmitCardForm.values.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
        if (payload.branchClassId && payload.masterAcademicYearId) {
            dispatch(
                getAssignLanSectionListAct(
                    generateActionPayload("get_section_list", undefined, payload)
                )
            );
        }
    }

    const cbseExaminationList = (otherProps?: any) => {
        let payload = {
            branchId,
            ...addAdmitCardForm.values,
            pageNo: 0, pageSize: 100,
            ...otherProps,
        };
        dispatch(getCbseExaminationListAct(generateActionPayload("get_cbse_examination_list", undefined, payload)));
    };

    useEffect(() => {

        if (props.filterState) {
            const { academicYearId, curriculumId, classId, sectionId, examinationId } = props.filterState || {};
            addAdmitCardForm.setValues((prev: any) => ({ ...prev, academicYearId, curriculumId, classId, sectionId, examinationId }));

            if (academicYearId) {
                getCurriculumApiCall({ academicYearId })
            }
            if (curriculumId) {
                getClassApiCall({ academicYearId, curriculumId })
            }
            if (classId) {
                getSectionListResp({ masterAcademicYearId: academicYearId, curriculumId, branchClassId: classId, })
            }
            if (academicYearId && curriculumId && classId) {
                cbseExaminationList({ academicYearId, curriculumId, classId })
            }
        }

        return () => {
            dispatch(resetAssignLanClassListAct(undefined))
            dispatch(resetAssignLanSectionListAct(undefined))
        }
    }, [])

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        if (name === "academicYearId") {
            addAdmitCardForm.setValues((prev: any) => ({ ...prev, [name]: value, curriculumId: "", classId: "", sectionId: "" }))
            getCurriculumApiCall({ academicYearId: value });
            dispatch(resetAssignLanClassListAct(undefined))
            dispatch(resetAssignLanSectionListAct(undefined))
        }
        else if (name === 'curriculumId') {
            addAdmitCardForm.setValues((prev: any) => ({ ...prev, [name]: value, classId: "", sectionId: "" }))
            if (!value) {
                dispatch(resetAssignLanClassListAct(undefined))
                dispatch(resetAssignLanSectionListAct(undefined))
            }
            else {
                getClassApiCall({ curriculumId: value, academicYearId: addAdmitCardForm.values.academicYearId });
            }
        }
        else if (name === 'classId') {
            addAdmitCardForm.setValues((prev: any) => ({ ...prev, [name]: value, sectionId: "" }))
            cbseExaminationList({ classId: value })
            if (!value) {
                dispatch(resetAssignLanSectionListAct(undefined))
            } else {
                getSectionListResp({ branchClassId: value })
            }
        } else {
            cbseExaminationList({ [name]: value })
            addAdmitCardForm.setValues((prev: any) => ({ ...prev, [name]: value }))
        }
    }

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = getAssignListCurriculumResp || {}
    const { content: classTypes } = getAssignLanClassListResp || {};
    const { data: sectionTypes } = getAssignLanSectionListResp || {};

    return (
        <>
            <form onSubmit={addAdmitCardForm.handleSubmit}>
                <div className="row px-4">
                    <div className="row g-3 mt-0">
                        <div className="col-12 col-md-6">
                            <SelectInput
                                name="academicYearId"
                                value={addAdmitCardForm.values.academicYearId}
                                onChange={filterHandler}
                                menuItems={academicYearList || []}
                                valueKey="academicYearId"
                                textKey="academicYearName"
                                formgroupClassName="mb-0"
                                labelText="Academic Year"
                                labelClass="required"
                                invalid={(addAdmitCardForm.touched.academicYearId && addAdmitCardForm.errors.academicYearId) ? true : false}
                                error={(addAdmitCardForm.touched.academicYearId && addAdmitCardForm.errors.academicYearId) ? addAdmitCardForm.errors.academicYearId : ""}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <SelectInput
                                name="curriculumId"
                                value={addAdmitCardForm.values.curriculumId}
                                onChange={filterHandler}
                                menuItems={curriculumTypes}
                                valueKey="branchCurriculumId"
                                textKey="curriculumName"
                                formgroupClassName="mb-0"
                                labelText="Curriculum"
                                labelClass="required"
                                invalid={(addAdmitCardForm.touched.curriculumId && addAdmitCardForm.errors.curriculumId) ? true : false}
                                error={(addAdmitCardForm.touched.curriculumId && addAdmitCardForm.errors.curriculumId) ? addAdmitCardForm.errors.curriculumId : ""}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <SelectInput
                                name="classId"
                                value={addAdmitCardForm.values.classId}
                                onChange={filterHandler}
                                menuItems={classTypes}
                                valueKey="id"
                                textKey="shortName"
                                formgroupClassName="mb-0"
                                labelText="Class"
                                labelClass="required"
                                invalid={(addAdmitCardForm.touched.classId && addAdmitCardForm.errors.classId) ? true : false}
                                error={(addAdmitCardForm.touched.classId && addAdmitCardForm.errors.classId) ? addAdmitCardForm.errors.classId : ""}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <SelectInput
                                name="sectionId"
                                value={addAdmitCardForm.values.sectionId}
                                onChange={filterHandler}
                                menuItems={sectionTypes}
                                valueKey="sectionId"
                                textKey="sectionName"
                                formgroupClassName="mb-0"
                                labelText="Section"
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <SelectInput
                                name="examinationId"
                                value={addAdmitCardForm.values.examinationId}
                                onChange={addAdmitCardForm.handleChange}
                                menuItems={getCbseExaminationRequestListResp?.data}
                                valueKey="id"
                                textKey="examinationShortName"
                                formgroupClassName="mb-0"
                                labelText="Examination"
                                labelClass="required"
                                invalid={(addAdmitCardForm.touched.examinationId && addAdmitCardForm.errors.examinationId) ? true : false}
                                error={(addAdmitCardForm.touched.examinationId && addAdmitCardForm.errors.examinationId) ? addAdmitCardForm.errors.examinationId : ""}
                            />
                        </div>
                    </div>
                </div>

                <tr style={{ color: "#38414A26" }} />
                <div className="row">
                    <div className="d-flex gap-2 w-auto ms-auto mx-4 my-3">
                        <button
                            type="button"
                            className={"btn btn-light"}
                            onClick={props.toggle}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`btn btn-success`}
                            disabled={showApiLoader}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default AddAdmitCard;
