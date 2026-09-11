
import { SelectInput, } from '../../../Components/Common';
import { useAppSelector } from '../../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { generateActionPayload } from '../../../utility/reduxutility';
import * as Yup from "yup";
import { copyAssignLanguagesAct, getAssignLanClassListAct } from '../../../store/assignlanguages/assignlanguagesaction';
import { getSectionList } from '../../../store/academic/classroomManagment/classroommanagmentactions';

const initialValues: any = {
    prevAcademicYearId: "",
    prevCurriculumId: "",
    prevClassId: "",
    prevSectionId:"",
    currentAcademicYearId: "",
    currentCurriculumId: "",
    currentClassId: "",
    currentSectionId:"",
};


const CopyAssignLanguageModal = (props: any) => {

    const dispatch = useDispatch();


    const {
        academicYearListResp,
        brchCurriculumResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getAssignLanClassListResp,
        sectionListResp,
    }: any = useAppSelector(
        ({  globalData, instAcademics, branchAcademics, appData, assignLanguages,classroomManagmentInfo }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getAssignLanClassListResp: assignLanguages.getAssignLanClassListResp,
            sectionListResp:classroomManagmentInfo.sectionListResp,
        }),
        shallowEqual
    );

    const copySubjectAllocationForm = useFormik({
        initialValues,
        enableReinitialize: true,
        onSubmit: (values: any) => {
            // dispatch(copyAssignLanguagesAct(generateActionPayload("copy_assign_language", undefined, {...values,branchId})));
        },
    });

    const getSectionListResp = (otherProps?: any) => {
        const { prevClassId, prevAcademicYearId , prevCurriculumId } = copySubjectAllocationForm.values;
        let payload = { branchClassId: prevClassId || null, masterAcademicYearId: prevAcademicYearId, curriculumId: prevCurriculumId || "", pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
        if (payload.branchClassId && payload.masterAcademicYearId) {
            dispatch(
                getSectionList(
                    generateActionPayload("get_section_list", undefined, payload)
                )
            );
        }
    }

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        if (name === "prevCurriculumId") {
            const payload = { branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));

            copySubjectAllocationForm.setValues((prev: any) => ({ ...prev, prevCurriculumId: value, currentCurriculumId:value, prevClassId: "", currentClassId: "" }));
        }
        else if(name === "prevAcademicYearId"){
            let yearId = academicYearListResp && academicYearListResp?.data?.length > 0 && academicYearListResp?.data[0]?.academicYearId

            copySubjectAllocationForm.setValues((prev:any)=>({...prev,prevAcademicYearId:value, currentAcademicYearId : +value === +yearId ?  "" : +value+1}))
            
        }
        else if(name === "prevClassId"){
            const { content } = getAssignLanClassListResp || {};
            if (Array.isArray(content) && content.length > 0) {
                const prevSeqno = content?.find((i:any)=>+i?.id === +value)?.classSequence;
                const nextSeqnoClassId = content?.find((i:any)=>+i?.classSequence === +prevSeqno+1)?.id;

                copySubjectAllocationForm.setValues((prev:any)=>({...prev,prevClassId:value, currentClassId:nextSeqnoClassId}))
                getSectionListResp({ branchClassId: value })
            }
        }
        else{
            copySubjectAllocationForm.handleChange(event)
        }

    }

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = getAssignLanClassListResp || {};

    return (
        <>
            <div className=''>
                <div className='row p-4'>

                    <div className="col-12">
                        <SelectInput
                            name="prevAcademicYearId"
                            value={copySubjectAllocationForm.values.prevAcademicYearId}
                            onChange={filterHandler}
                            onBlur={copySubjectAllocationForm.handleBlur}
                            menuItems={academicYearList || []}
                            valueKey="academicYearId"
                            textKey="academicYearName"
                            formgroupClassName="mb-0"
                            defaultSelect="Select"
                            labelText='Prev. Academic Year'
                            labelClass='required'
                            invalid={copySubjectAllocationForm.touched.prevAcademicYearId && copySubjectAllocationForm.errors.prevAcademicYearId ? true : false}
                            error={copySubjectAllocationForm.touched.prevAcademicYearId && copySubjectAllocationForm.errors.prevAcademicYearId ? copySubjectAllocationForm.errors.prevAcademicYearId : ""}
                        />
                    </div>
                    <div className="col-4 mt-4">
                        <SelectInput
                            name="prevCurriculumId"
                            value={copySubjectAllocationForm.values.prevCurriculumId}
                            onChange={filterHandler}
                            menuItems={curriculumTypes || []}
                            valueKey="branchCurriculumId"
                            onBlur={copySubjectAllocationForm.handleBlur}
                            textKey="curriculumName"
                            formgroupClassName="mb-0"
                            defaultSelect="Select"
                            labelText='Prev. Curriculum'
                            labelClass='required'
                            invalid={copySubjectAllocationForm.touched.prevCurriculumId && copySubjectAllocationForm.errors.prevCurriculumId ? true : false}
                            error={copySubjectAllocationForm.touched.prevCurriculumId && copySubjectAllocationForm.errors.prevCurriculumId ? copySubjectAllocationForm.errors.prevCurriculumId : ""}
                        />
                    </div>


                    <div className='col-4 mt-4'>
                        <SelectInput
                            name="prevClassId"
                            value={copySubjectAllocationForm.values.prevClassId}
                            onChange={filterHandler}
                            onBlur={copySubjectAllocationForm.handleBlur}
                            menuItems={classTypes || []}
                            valueKey="id"
                            textKey="shortName"
                            defaultSelect="Select"
                            labelText='Prev. Classes'
                            formgroupClassName="mb-0"
                            labelClass='required'
                            invalid={copySubjectAllocationForm.touched.prevClassId && copySubjectAllocationForm.errors.prevClassId ? true : false}
                            error={copySubjectAllocationForm.touched.prevClassId && copySubjectAllocationForm.errors.prevClassId ? copySubjectAllocationForm.errors.prevClassId : ""}
                        />
                    </div>
                    <div className='col-4 mt-4'>
                        <SelectInput
                            name="prevSectionId"
                            value={copySubjectAllocationForm.values.prevSectionId}
                            onChange={filterHandler}
                            onBlur={copySubjectAllocationForm.handleBlur}
                            menuItems={sectionListResp?.data || []}
                            valueKey="sectionId"
                            textKey="sectionName"
                            defaultSelect="Select"
                            labelText='Prev. Sections'
                            formgroupClassName="mb-0"
                            labelClass='required'
                            invalid={copySubjectAllocationForm.touched.prevSectionId && copySubjectAllocationForm.errors.prevSectionId ? true : false}
                            error={copySubjectAllocationForm.touched.prevSectionId && copySubjectAllocationForm.errors.prevSectionId ? copySubjectAllocationForm.errors.prevSectionId : ""}
                        />
                    </div>

                </div>
                <div style={{ height: "3rem", background: "#F3F6F9", color: "#707070", fontWeight: "600", fontSize: "1rem" }} className='d-flex align-items-center'>
                    <span className='ms-4'>Copy To</span>
                </div>
                <div className='row p-4'>

                    <div className="col-12">
                        <SelectInput
                            name="currentAcademicYearId"
                            value={copySubjectAllocationForm.values.currentAcademicYearId}
                            onChange={filterHandler}
                            onBlur={copySubjectAllocationForm.handleBlur}
                            menuItems={academicYearList || []}
                            valueKey="academicYearId"
                            textKey="academicYearName"
                            formgroupClassName="mb-0"
                            defaultSelect="Select"
                            labelText='Curr. Academic Year'
                            labelClass='required'
                            invalid={copySubjectAllocationForm.touched.currentAcademicYearId && copySubjectAllocationForm.errors.currentAcademicYearId ? true : false}
                            error={copySubjectAllocationForm.touched.currentAcademicYearId && copySubjectAllocationForm.errors.currentAcademicYearId ? copySubjectAllocationForm.errors.currentAcademicYearId : ""}
                        />
                    </div>
                    <div className="col-4 mt-4">
                        <SelectInput
                            name="currentCurriculumId"
                            value={copySubjectAllocationForm.values.currentCurriculumId}
                            onChange={filterHandler}
                            menuItems={curriculumTypes || []}
                            valueKey="branchCurriculumId"
                            onBlur={copySubjectAllocationForm.handleBlur}
                            textKey="curriculumName"
                            formgroupClassName="mb-0"
                            defaultSelect="Select"
                            labelText='Curr. Curriculum'
                            labelClass='required'
                            invalid={copySubjectAllocationForm.touched.currentCurriculumId && copySubjectAllocationForm.errors.currentCurriculumId ? true : false}
                            error={copySubjectAllocationForm.touched.currentCurriculumId && copySubjectAllocationForm.errors.currentCurriculumId ? copySubjectAllocationForm.errors.currentCurriculumId : ""}
                        />
                    </div>


                    <div className='col-4 mt-4'>
                        <SelectInput
                            name="currentClassId"
                            value={copySubjectAllocationForm.values.currentClassId}
                            onChange={filterHandler}
                            onBlur={copySubjectAllocationForm.handleBlur}
                            menuItems={classTypes || []}
                            valueKey="id"
                            textKey="shortName"
                            defaultSelect="Select"
                            labelText='Curr. Classes'
                            formgroupClassName="mb-0"
                            labelClass='required'
                            invalid={copySubjectAllocationForm.touched.currentClassId && copySubjectAllocationForm.errors.currentClassId ? true : false}
                            error={copySubjectAllocationForm.touched.currentClassId && copySubjectAllocationForm.errors.currentClassId ? copySubjectAllocationForm.errors.currentClassId : ""}
                        />
                    </div>
                    <div className='col-4 mt-4'>
                        <SelectInput
                            name="currentSectionId"
                            value={copySubjectAllocationForm.values.currentSectionId}
                            onChange={filterHandler}
                            onBlur={copySubjectAllocationForm.handleBlur}
                            menuItems={sectionListResp?.data || []}
                            valueKey="sectionId"
                            textKey="sectionName"
                            defaultSelect="Select"
                            labelText='Curr. Sections'
                            formgroupClassName="mb-0"
                            labelClass='required'
                            invalid={copySubjectAllocationForm.touched.currentSectionId && copySubjectAllocationForm.errors.currentSectionId ? true : false}
                            error={copySubjectAllocationForm.touched.currentSectionId && copySubjectAllocationForm.errors.currentSectionId ? copySubjectAllocationForm.errors.currentSectionId : ""}
                        />
                    </div>

                </div>

                <div className='row p-4 pt-0'>
                    <div className='d-flex w-auto ms-auto mt-2'>
                        <button
                            type="submit"
                            className="btn btn-light text-success mx-3"
                            onClick={props.toggle}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-success px-4"
                            onClick={(event: any) => { copySubjectAllocationForm.handleSubmit(event) }}
                            disabled={showApiLoader}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CopyAssignLanguageModal