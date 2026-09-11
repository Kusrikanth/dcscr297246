
import { SelectInput, } from '../../../Components/Common';
import { useAppSelector } from '../../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { generateActionPayload } from '../../../utility/reduxutility';
import * as Yup from "yup";
import { copyAssignLanguagesAct, getAssignLanClassListAct } from '../../../store/assignlanguages/assignlanguagesaction';
import { getSectionList, setSectionListAct } from '../../../store/academic/classroomManagment/classroommanagmentactions';
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from '../../../store/branchsettings/branchacademics/branchacademicsactions';
import { copyPreviousSubjectAllocationAct, copyToCurrentClassAct, copyToCurrentSectionAct, setCopyToCurrentClassAct, setCopyToCurrentSectionAct } from '../../../store/academic/classSubjects/classsubjectsactions';
import { useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import Button from '../../../Components/Common/Button';

const initialValues = {
    previousAcademicYearId: "",
    previousCurriculumId: "",
    previousClassId: "",
    previousSectionId: "",
    newAcademicYearId: "",
    newCurriculumId: "",
    newClassId: "",
    newSectionId: "",
};


const validationSchema = Yup.object().shape({
    previousAcademicYearId: Yup.string().required("Academic year required."),
    previousCurriculumId: Yup.string().required("Curriculum required."),
    previousClassId: Yup.string().required("Class required."),
    previousSectionId: Yup.string().required("Section required."),
    newAcademicYearId: Yup.string().required("Academic year required."),
    newCurriculumId: Yup.string().required("Curriculum required."),
    newClassId: Yup.string().required("Class required."),
    newSectionId: Yup.string().required("Section required."),
});


const CopyAssignLanguageModal = ({ branchId, closeModalHndlr, props }: any) => {
    const dispatch = useDispatch();
    const {
        academicYearListResp,
        showApiLoader, brchCurriculumResp, branchClassResp,
        sectionListResp, copyToCurrentClassResp, copyToCurrentSectionResp,
        copyPreviousSubjectAllocationResp
    }: any = useAppSelector(
        ({ globalData, instAcademics, classSubjectsInfo, branchAcademics, classroomManagmentInfo }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            showApiLoader: globalData.showApiLoader,
            sectionListResp: classroomManagmentInfo.sectionListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            copyToCurrentClassResp: classSubjectsInfo.copyToCurrentClassResp,
            copyToCurrentSectionResp: classSubjectsInfo.copyToCurrentSectionResp,
            copyPreviousSubjectAllocationResp: classSubjectsInfo.copyPreviousSubjectAllocationResp
        }),
        shallowEqual
    );

    const allocateSubjectRespRef = useRef({
        prevCopyPreviousSubjectAllocationResp: copyPreviousSubjectAllocationResp
    });

    
    useEffect(() => {
        const { prevCopyPreviousSubjectAllocationResp } = allocateSubjectRespRef.current;
        if (copyPreviousSubjectAllocationResp && prevCopyPreviousSubjectAllocationResp !== copyPreviousSubjectAllocationResp) {
            toast.success("Subject allocation updated successfully.");
            closeModalHndlr(true);
        }
        allocateSubjectRespRef.current.prevCopyPreviousSubjectAllocationResp = copyPreviousSubjectAllocationResp;
    }, [copyPreviousSubjectAllocationResp]);


    const copySubjectAllocationForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values: any) => {
            const payload = {
                branchId,
                ...values,
            }
            dispatch(copyPreviousSubjectAllocationAct(generateActionPayload("copy_previous_subject", undefined, payload)));
        },
    });

    const getSectionListResp = (otherProps?: any) => {
        const { previousClassId, previousAcademicYearId, previousCurriculumId } = copySubjectAllocationForm.values;
        let payload = { branchClassId: previousClassId || null, masterAcademicYearId: previousAcademicYearId, curriculumId: previousCurriculumId || "", pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
        dispatch(
            getSectionList(
                generateActionPayload("get_section_list", undefined, payload)
            )
        );
    }
    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = {   academicYearId: otherProps?.academicYearId || copySubjectAllocationForm.values.previousAcademicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }
    const getNewSectionListResp = (otherProps?: any) => {
        const { newCurriculumId, newAcademicYearId, newClassId } = copySubjectAllocationForm.values;
        let payload = {
            branchClassId: newClassId,
            masterAcademicYearId: newAcademicYearId,
            curriculumId: newCurriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps
        }
        dispatch(
            copyToCurrentSectionAct(
                generateActionPayload("get_section_list", undefined, payload)
            )
        );
    }

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        if (name === "previousAcademicYearId") {
            copySubjectAllocationForm.setFieldValue(name, value);
            if (value) {
                getCurriculumApiCall({ academicYearId: value });
            }
        } else if (name === "previousCurriculumId") {
            copySubjectAllocationForm.setFieldValue(name, value);
            if (value) {
                const payload = { academicYearId: copySubjectAllocationForm.values.previousAcademicYearId, branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
                dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
            dispatch(resetBrchClassAct(undefined));
            dispatch(setSectionListAct(undefined));
            copySubjectAllocationForm.setFieldValue("previousClassId", "");
            copySubjectAllocationForm.setFieldValue("previousSectionId", "");
        } else if (name === "previousClassId") {
            copySubjectAllocationForm.setFieldValue(name, value);
            if (value) {
                getSectionListResp({ branchClassId: value });
            }
            dispatch(setSectionListAct(undefined));
            copySubjectAllocationForm.setFieldValue("previousSectionId", "");
        } else if (name === "newAcademicYearId") {
            copySubjectAllocationForm.setFieldValue(name, value);
            if (value) {
                getCurriculumApiCall({ academicYearId: value });
            }
        } else if (name === "newCurriculumId") {
            copySubjectAllocationForm.setFieldValue(name, value);
            if (value) {
                const payload = {  academicYearId: copySubjectAllocationForm.values.previousAcademicYearId, branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
                dispatch(copyToCurrentClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
            dispatch(setCopyToCurrentClassAct(undefined));
            dispatch(setCopyToCurrentSectionAct(undefined));
            copySubjectAllocationForm.setFieldValue("newClassId", "");
            copySubjectAllocationForm.setFieldValue("newSectionId", "");
        } else if (name === "newClassId") {
            copySubjectAllocationForm.setFieldValue(name, value);
            if (value) {
                getNewSectionListResp({ branchClassId: value });
            }
            dispatch(setCopyToCurrentSectionAct(undefined));
            copySubjectAllocationForm.setFieldValue("newSectionId", "");
        }
    }
    const availablePreviousClasses = useMemo(() => {
        const { content } = branchClassResp || {};
        if (Array.isArray(content)) {
            return content?.filter(item => Number(item.classSequence) > 13);
        }
        return [];
    }, [branchClassResp]);

    const availableCurrentClasses = useMemo(() => {
        const { content } = copyToCurrentClassResp || {};
        if (Array.isArray(content)) {
            return content?.filter(item => Number(item.classSequence) > 13);
        }
        return [];
    }, [copyToCurrentClassResp]);

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    return (
        <>
            <div className=''>
                <div className="tw-p-6 tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-12">
                        <SelectInput
                            name="previousAcademicYearId"
                            value={copySubjectAllocationForm.values.previousAcademicYearId}
                            onChange={filterHandler}
                            onBlur={copySubjectAllocationForm.handleBlur}
                            menuItems={academicYearList}
                            valueKey="academicYearId"
                            textKey="academicYearName"
                            formgroupClassName="tw-mb-0"
                            defaultSelect="Select"
                            labelText="Prev. Academic Year"
                            labelClass="required"
                            invalid={copySubjectAllocationForm.touched.previousAcademicYearId && copySubjectAllocationForm.errors.previousAcademicYearId ? true : false}
                            error={copySubjectAllocationForm.touched.previousAcademicYearId && copySubjectAllocationForm.errors.previousAcademicYearId ? copySubjectAllocationForm.errors.previousAcademicYearId : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="previousCurriculumId"
                            value={copySubjectAllocationForm.values.previousCurriculumId}
                            onChange={filterHandler}
                            onBlur={copySubjectAllocationForm.handleBlur}
                            menuItems={curriculumTypes}
                            valueKey="branchCurriculumId"
                            textKey="curriculumName"
                            formgroupClassName="tw-mb-0"
                            defaultSelect="Select"
                            labelText="Prev. Curriculum"
                            labelClass="required"
                            invalid={copySubjectAllocationForm.touched.previousCurriculumId && copySubjectAllocationForm.errors.previousCurriculumId ? true : false}
                            error={copySubjectAllocationForm.touched.previousCurriculumId && copySubjectAllocationForm.errors.previousCurriculumId ? copySubjectAllocationForm.errors.previousCurriculumId : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="previousClassId"
                            value={copySubjectAllocationForm.values.previousClassId}
                            onChange={filterHandler}
                            onBlur={copySubjectAllocationForm.handleBlur}
                            menuItems={availablePreviousClasses}
                            valueKey="id"
                            textKey="shortName"
                            defaultSelect="Select"
                            labelText="Prev. Classes"
                            formgroupClassName="tw-mb-0"
                            labelClass="required"
                            invalid={copySubjectAllocationForm.touched.previousClassId && copySubjectAllocationForm.errors.previousClassId ? true : false}
                            error={copySubjectAllocationForm.touched.previousClassId && copySubjectAllocationForm.errors.previousClassId ? copySubjectAllocationForm.errors.previousClassId : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="previousSectionId"
                            value={copySubjectAllocationForm.values.previousSectionId}
                            onChange={copySubjectAllocationForm.handleChange}
                            onBlur={copySubjectAllocationForm.handleBlur}
                            menuItems={sectionListResp?.data}
                            valueKey="sectionId"
                            textKey="sectionName"
                            defaultSelect="Select"
                            labelText="Prev. Sections"
                            formgroupClassName="tw-mb-0"
                            labelClass="required"
                            invalid={copySubjectAllocationForm.touched.previousSectionId && copySubjectAllocationForm.errors.previousSectionId ? true : false}
                            error={copySubjectAllocationForm.touched.previousSectionId && copySubjectAllocationForm.errors.previousSectionId ? copySubjectAllocationForm.errors.previousSectionId : ""}
                        />
                    </div>
                </div>
                <div className="tw-bg-gray-100 tw-text-gray-600 tw-font-semibold tw-text-base tw-px-6 tw-py-3">
                    Copy To
                </div>
                <div className="tw-p-6 tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-12">
                        <SelectInput
                            name="newAcademicYearId"
                            value={copySubjectAllocationForm.values.newAcademicYearId}
                            onChange={filterHandler}
                            onBlur={copySubjectAllocationForm.handleBlur}
                            menuItems={academicYearList}
                            valueKey="academicYearId"
                            textKey="academicYearName"
                            formgroupClassName="tw-mb-0"
                            defaultSelect="Select"
                            labelText="Curr. Academic Year"
                            labelClass="required"
                            invalid={copySubjectAllocationForm.touched.newAcademicYearId && copySubjectAllocationForm.errors.newAcademicYearId ? true : false}
                            error={copySubjectAllocationForm.touched.newAcademicYearId && copySubjectAllocationForm.errors.newAcademicYearId ? copySubjectAllocationForm.errors.newAcademicYearId : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="newCurriculumId"
                            value={copySubjectAllocationForm.values.newCurriculumId}
                            onChange={filterHandler}
                            onBlur={copySubjectAllocationForm.handleBlur}
                            menuItems={curriculumTypes}
                            valueKey="branchCurriculumId"
                            textKey="curriculumName"
                            formgroupClassName="tw-mb-0"
                            defaultSelect="Select"
                            labelText="Curr. Curriculum"
                            labelClass="required"
                            invalid={copySubjectAllocationForm.touched.newCurriculumId && copySubjectAllocationForm.errors.newCurriculumId ? true : false}
                            error={copySubjectAllocationForm.touched.newCurriculumId && copySubjectAllocationForm.errors.newCurriculumId ? copySubjectAllocationForm.errors.newCurriculumId : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="newClassId"
                            value={copySubjectAllocationForm.values.newClassId}
                            onChange={filterHandler}
                            onBlur={copySubjectAllocationForm.handleBlur}
                            menuItems={availableCurrentClasses}
                            valueKey="id"
                            textKey="shortName"
                            defaultSelect="Select"
                            labelText="Curr. Classes"
                            formgroupClassName="tw-mb-0"
                            labelClass="required"
                            invalid={copySubjectAllocationForm.touched.newClassId && copySubjectAllocationForm.errors.newClassId ? true : false}
                            error={copySubjectAllocationForm.touched.newClassId && copySubjectAllocationForm.errors.newClassId ? copySubjectAllocationForm.errors.newClassId : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="newSectionId"
                            value={copySubjectAllocationForm.values.newSectionId}
                            onChange={copySubjectAllocationForm.handleChange}
                            onBlur={copySubjectAllocationForm.handleBlur}
                            menuItems={copyToCurrentSectionResp?.data}
                            valueKey="sectionId"
                            textKey="sectionName"
                            defaultSelect="Select"
                            labelText="Curr. Sections"
                            formgroupClassName="tw-mb-0"
                            labelClass="required"
                            invalid={copySubjectAllocationForm.touched.newSectionId && copySubjectAllocationForm.errors.newSectionId ? true : false}
                            error={copySubjectAllocationForm.touched.newSectionId && copySubjectAllocationForm.errors.newSectionId ? copySubjectAllocationForm.errors.newSectionId : ""}
                        />
                    </div>
                </div>
                <div className="tw-flex tw-justify-end tw-gap-4 tw-px-6 tw-pb-6">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={closeModalHndlr}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={(event: any) => copySubjectAllocationForm.handleSubmit(event)}
                        disabled={showApiLoader}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </>
    )
}

export default CopyAssignLanguageModal