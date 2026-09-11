
import { SelectInput, } from '../../Components/Common';
import { useAppSelector } from '../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { generateActionPayload } from '../../utility/reduxutility';
import * as Yup from "yup";
import { copyAssignLanguagesAct, getAssignLanClassListAct } from '../../store/assignlanguages/assignlanguagesaction';
import Button from '../../Components/Common/Button';

const initialValues: any = {
    prevAcademicYearId: "",
    prevCurriculumId: "",
    prevClassId: "",
    currentAcademicYearId: "",
    currentCurriculumId: "",
    currentClassId: "",
};

const validationSchema = Yup.object().shape({
    prevAcademicYearId: Yup.string().required('Prev. Academic Year is required'),
    currentAcademicYearId: Yup.string().required('Curr. Academic Year is required')
        .test('notSame', 'Current and Previous Academic Years should not be the same', function (value) {
            return value !== this.parent.prevAcademicYearId;
        }),
    prevCurriculumId: Yup.string().required('Prev. Curriculum is required'),
    currentCurriculumId: Yup.string().required('Curr. Curriculum is required')
        .test('same', 'Previous and Current Curriculum should be the same', function (value) {
            return value === this.parent.prevCurriculumId;
        }),
    prevClassId: Yup.string().required('Prev. Class is required'),
    currentClassId: Yup.string().required('Curr. Class is required')
        .test('notSame', 'Current and Previous Classes should not be the same', function (value) {
            return value !== this.parent.prevClassId;
        }),
})


const CopyAssignLanguageModal = (props: any) => {

    const dispatch = useDispatch();


    const {
        academicYearListResp,
        brchCurriculumResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getAssignLanClassListResp,
    }: any = useAppSelector(
        ({  globalData, instAcademics, branchAcademics, appData, assignLanguages }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getAssignLanClassListResp: assignLanguages.getAssignLanClassListResp,
        }),
        shallowEqual
    );

    const copyAssignLanguageForm = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values: any) => {
            dispatch(copyAssignLanguagesAct(generateActionPayload("copy_assign_language", undefined, {...values,branchId})));
        },
    });


    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        if (name === "prevCurriculumId") {
            const payload = { branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));

            copyAssignLanguageForm.setValues((prev: any) => ({ ...prev, prevCurriculumId: value, currentCurriculumId:value, prevClassId: "", currentClassId: "" }));
        }
        else if(name === "prevAcademicYearId"){
            let yearId = academicYearListResp && academicYearListResp?.data?.length > 0 && academicYearListResp?.data[0]?.academicYearId

            copyAssignLanguageForm.setValues((prev:any)=>({...prev,prevAcademicYearId:value, currentAcademicYearId : +value === +yearId ?  "" : +value+1}))
            
        }
        else if(name === "prevClassId"){
            const { content } = getAssignLanClassListResp || {};
            if (Array.isArray(content) && content.length > 0) {
                const prevSeqno = content?.find((i:any)=>+i?.id === +value)?.classSequence;
                const nextSeqnoClassId = content?.find((i:any)=>+i?.classSequence === +prevSeqno+1)?.id;

                copyAssignLanguageForm.setValues((prev:any)=>({...prev,prevClassId:value, currentClassId:nextSeqnoClassId}))
            }
        }
        else{
            copyAssignLanguageForm.handleChange(event)
        }

    }

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = getAssignLanClassListResp || {};

    return (
        <>
            <div className=''>
                <div className="">
                    <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-pt-5 tw-px-6">
                        <div className="tw-col-span-12">
                            <SelectInput
                                name="prevAcademicYearId"
                                value={copyAssignLanguageForm.values.prevAcademicYearId}
                                onChange={filterHandler}
                                onBlur={copyAssignLanguageForm.handleBlur}
                                menuItems={academicYearList || []}
                                valueKey="academicYearId"
                                textKey="academicYearName"
                                formgroupClassName="tw-mb-0"
                                defaultSelect="Select"
                                labelText="Prev. Academic Year"
                                labelClass="required"
                                invalid={copyAssignLanguageForm.touched.prevAcademicYearId && copyAssignLanguageForm.errors.prevAcademicYearId ? true : false}
                                error={copyAssignLanguageForm.touched.prevAcademicYearId && copyAssignLanguageForm.errors.prevAcademicYearId ? copyAssignLanguageForm.errors.prevAcademicYearId : ""}
                            />
                        </div>
                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <SelectInput
                                name="prevCurriculumId"
                                value={copyAssignLanguageForm.values.prevCurriculumId}
                                onChange={filterHandler}
                                onBlur={copyAssignLanguageForm.handleBlur}
                                menuItems={curriculumTypes || []}
                                valueKey="branchCurriculumId"
                                textKey="curriculumName"
                                formgroupClassName="tw-mb-0"
                                defaultSelect="Select"
                                labelText="Prev. Curriculum"
                                labelClass="required"
                                invalid={copyAssignLanguageForm.touched.prevCurriculumId && copyAssignLanguageForm.errors.prevCurriculumId ? true : false}
                                error={copyAssignLanguageForm.touched.prevCurriculumId && copyAssignLanguageForm.errors.prevCurriculumId ? copyAssignLanguageForm.errors.prevCurriculumId : ""}
                            />
                        </div>
                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <SelectInput
                                name="prevClassId"
                                value={copyAssignLanguageForm.values.prevClassId}
                                onChange={filterHandler}
                                onBlur={copyAssignLanguageForm.handleBlur}
                                menuItems={classTypes || []}
                                valueKey="id"
                                textKey="shortName"
                                formgroupClassName="tw-mb-0"
                                defaultSelect="Select"
                                labelText="Prev. Classes"
                                labelClass="required"
                                invalid={copyAssignLanguageForm.touched.prevClassId && copyAssignLanguageForm.errors.prevClassId ? true : false}
                                error={copyAssignLanguageForm.touched.prevClassId && copyAssignLanguageForm.errors.prevClassId ? copyAssignLanguageForm.errors.prevClassId : ""}
                            />
                        </div>
                    </div>
                    <div className="tw-h-12 tw-bg-gray-100 tw-px-3 tw-flex tw-items-center tw-mt-6 tw-rounded-md">
                        <span className="tw-ml-4 tw-font-semibold tw-text-gray-600">
                            Copy To
                        </span>
                    </div>
                    <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mt-4 tw-px-6">
                        <div className="tw-col-span-12">
                            <SelectInput
                                name="currentAcademicYearId"
                                value={copyAssignLanguageForm.values.currentAcademicYearId}
                                onChange={filterHandler}
                                onBlur={copyAssignLanguageForm.handleBlur}
                                menuItems={academicYearList || []}
                                valueKey="academicYearId"
                                textKey="academicYearName"
                                formgroupClassName="tw-mb-0"
                                defaultSelect="Select"
                                labelText="Curr. Academic Year"
                                labelClass="required"
                                invalid={copyAssignLanguageForm.touched.currentAcademicYearId && copyAssignLanguageForm.errors.currentAcademicYearId ? true : false}
                                error={copyAssignLanguageForm.touched.currentAcademicYearId && copyAssignLanguageForm.errors.currentAcademicYearId ? copyAssignLanguageForm.errors.currentAcademicYearId : ""}
                            />
                        </div>
                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <SelectInput
                                name="currentCurriculumId"
                                value={copyAssignLanguageForm.values.currentCurriculumId}
                                onChange={filterHandler}
                                onBlur={copyAssignLanguageForm.handleBlur}
                                menuItems={curriculumTypes || []}
                                valueKey="branchCurriculumId"
                                textKey="curriculumName"
                                formgroupClassName="tw-mb-0"
                                defaultSelect="Select"
                                labelText="Curr. Curriculum"
                                labelClass="required"
                                invalid={copyAssignLanguageForm.touched.currentCurriculumId && copyAssignLanguageForm.errors.currentCurriculumId ? true : false}
                                error={copyAssignLanguageForm.touched.currentCurriculumId && copyAssignLanguageForm.errors.currentCurriculumId ? copyAssignLanguageForm.errors.currentCurriculumId : ""}
                            />
                        </div>
                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <SelectInput
                                name="currentClassId"
                                value={copyAssignLanguageForm.values.currentClassId}
                                onChange={filterHandler}
                                onBlur={copyAssignLanguageForm.handleBlur}
                                menuItems={classTypes || []}
                                valueKey="id"
                                textKey="shortName"
                                formgroupClassName="tw-mb-0"
                                defaultSelect="Select"
                                labelText="Curr. Classes"
                                labelClass="required"
                                invalid={copyAssignLanguageForm.touched.currentClassId && copyAssignLanguageForm.errors.currentClassId ? true : false}
                                error={copyAssignLanguageForm.touched.currentClassId && copyAssignLanguageForm.errors.currentClassId ? copyAssignLanguageForm.errors.currentClassId : ""}
                            />
                        </div>
                    </div>
                    <div className="tw-flex tw-pb-5 tw-px-6 tw-justify-end tw-gap-3 tw-mt-8">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={props.toggle}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={(event: any) =>
                                copyAssignLanguageForm.handleSubmit(event)
                            }
                            disabled={showApiLoader}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CopyAssignLanguageModal