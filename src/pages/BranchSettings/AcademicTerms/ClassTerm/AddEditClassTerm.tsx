import { FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { DateInput, SelectInput, TextInput } from "../../../../Components/Common";
import { useAppSelector } from "../../../../hooks/storehook";
import { addClassWiseTermDateAct, getBranchClassAct, resetBrchClassAct, updateClassWiseTermDateAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getInstAcademicYearAct, getInstTermAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import * as Yup from 'yup';
import { addEditClassTermModalProps } from "./ClassTermTypes";
import { getAssignCurriculumListAct, getAssignLanClassListAct } from "../../../../store/assignlanguages/assignlanguagesaction";
import { resetAssignLanClassListAct, resetAssignListCurriculumAct } from "../../../../store/assignlanguages/assignlanguagesslice";
import Button from "../../../../Components/Common/Button";

interface ITermsState {
    id: number,
    termName: string
}

const AddEditPrePrimary = (props: addEditClassTermModalProps) => {
    const intialValues = (modalData?: any) => {

        return {
            academicYear: modalData ? modalData.academicYearId : "",
            curriculumType: modalData ? modalData.curriculumId : "",
            classType: modalData ? modalData.classId : "",
            // terms:modalData?modalData.terms:[{
            //     termId:"",
            //     termName:"",
            //     startDate:"",
            //     endDate:""
            // }]
            terms: modalData ? modalData.terms ? modalData.terms : [{
                termId: modalData.id,
                termName: modalData.termName,
                startDate: modalData.startDate,
                endDate: modalData.endDate
            }] : [],
        }
    }
    const [termsListState, setTermsListState] = useState<Array<ITermsState>>([]);
    const [classTermsState, setClassTermsState] = useState<any>(intialValues());
    // const addClassTermForm = useFormik({
    //     enableReinitialize: true,
    //     initialValues: classTermsState,
    //     onSubmit: (values) => {

    // {
    //     "id" : "",
    //     "branchId" : 20,
    //     "academicYearId" : 1,
    //     "curriculumId" : 1,
    //     "branchAcademicClassStartDTOS" : [
    //         {
    //             "classId" : 10,
    //             "startDate" : "2022-12-31",
    //             "endDate" : "2023-12-31"
    //         }
    //     ]
    // }
    //     },
    //   });
    const intialValue = {
        academicYear: "",
        curriculumType: "",
        classType: ""
    }

    const validationSchema = Yup.object().shape({
        academicYear: Yup.string().required("Academic Year is required."),
        curriculumType: Yup.string().required("Curriculum Type is required."),
        classType: Yup.string().required("Class Type is required."),
        terms: Yup.array().of(
            Yup.object().shape({
                termName: Yup.string().required("Term Name is required."),
                startDate: Yup.string().required("Start Date is required."),
                endDate: Yup.string().required("End Date is required.")
            })
        ),
        // endDate: Yup.string().required("End date required."),
        // startYear: Yup.string().required("Start Year required."),
        // endYear: Yup.string().required("End Year required."),
        // isChallanDisplay: Yup.string().required("Challan Display required."),
    });

    const ClassTermsFilterForm: any = useFormik({
        enableReinitialize: true,
        initialValues: classTermsState,
        validationSchema,
        onSubmit: (values) => {
            if (props.modalData) {
                // const params = { academicYearId: props.academicYearId },
                // { termTypeId, ...payload } = values;

                const payload = {
                    branchId: +props.branchId,
                    id: values.terms[0].termId,
                    startDate: values.terms[0].startDate,
                    endDate: values.terms[0].endDate
                }

                dispatch(updateClassWiseTermDateAct(generateActionPayload("update_class_wise_terms_date", undefined, payload)));
            } else {
                // const apiParams={ instituteId: props.instituteId,instituteAcademicYearId:values.academicYear,masterTermTypeId:values.termTypeId };
                // const payload=values.terms.map((v)=>{
                //     return v.fromDate&&v.endDate&&{
                //         instituteTermId:v.termId,
                //         startDate:v.fromDate,
                //         endDate:v.endDate
                //     }
                // })
                const branchTermsStartDateDTOS = values.terms.map((v: any) => {
                    return v.endDate && v.startDate && {
                        termId: v.termId,
                        startDate: v.startDate,
                        endDate: v.endDate
                    }
                })
                const payload = {
                    id: "",
                    branchId: +props.branchId,
                    academicYearId: +values.academicYear,
                    curriculumId: +values.curriculumType,
                    classId: +values.classType,
                    branchTermsStartDateDTOS
                }

                dispatch(
                    addClassWiseTermDateAct(
                        generateActionPayload(
                            "add_class_wise_terms_date", undefined, payload)
                    )
                );
            }
        },
    });
    const dispatch = useDispatch();
    function addTermHandler() {
        const length: number = termsListState.length,
            updatedRolesList: Array<ITermsState> = [...termsListState],
            lastId: number = updatedRolesList[length - 1].id;
        updatedRolesList.push({ id: (lastId + 1), termName: "New Testing" });
        setTermsListState(updatedRolesList);
    }

    function removeTermHndlr(event: React.MouseEvent<HTMLElement>) {
        const roleIndex: (string | null) = event.currentTarget.getAttribute("data-index"),
            updatedRolesList: Array<ITermsState> = [...termsListState];
        if (roleIndex) {
            updatedRolesList.splice(Number(roleIndex), 1);
            setTermsListState(updatedRolesList);
        }
    }
    const { academicYearListResp, getAssignListCurriculumResp, getAssignLanClassListResp, termListResp,showApiLoader } = useAppSelector(
        ({ instAcademics, branchAcademics,globalData, assignLanguages }: any) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            //   instCurriculumResp: instAcademics.instCurriculumResp,
            getAssignListCurriculumResp:assignLanguages.getAssignListCurriculumResp,
            getAssignLanClassListResp:assignLanguages.getAssignLanClassListResp,
            //   classWiseTermsDateResp:branchAcademics.classWiseTermsDateResp,
            termListResp: instAcademics.termListResp,
            showApiLoader:globalData.showApiLoader,
        }),
        shallowEqual
    );
    useEffect(() => {
        const payload = { instituteId: props.instituteId,sortBy:"termName",orderBy:"asc" };
        dispatch(getInstTermAct(generateActionPayload("get_inst_term", undefined, payload)));
        return () => {
            dispatch(resetAssignListCurriculumAct(undefined));
            dispatch(resetAssignLanClassListAct(undefined));
        }
    }, [])
    useEffect(() => {

        // const payload = { branchId:20,curriculumId:props., pageNo: 0, pageSize: 100 };
        // dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class",undefined,payload)));
        let terms = termListResp && termListResp.data.filter((term:any)=>term.masterTermTypeName==="EXAMINATION TERM").map((term: any) => {
            return {
                termId: term.instituteTermId,
                termName: term.termName,
                startDate: "",
                endDate: ""
            }
        });
        !props.modalData && setClassTermsState(intialValues({ academicYearId: "", curriculumId: "", classId: "", terms: terms }))
    }, [termListResp, props.modalData])
    useEffect(() => {
        if (!academicYearListResp) {
            const payload = { instituteId: props.instituteId,pageNo:0,pageSize:100,orderBy:"desc",sortBy:"academicYearName" };
            dispatch(
                getInstAcademicYearAct(
                    generateActionPayload("get_inst_academic_year", undefined, payload)
                )
            );
        }
    }, [props.instituteId, academicYearListResp]);
    const curriculumHandler = (event: any) => {
        if (event.target.value !== "") {
            const payload = { branchId: +props.branchId, curriculumId: event.target.value, academicYearId: ClassTermsFilterForm.values.academicYear ? ClassTermsFilterForm.values.academicYear : props.academicYearId, pageNo: 0, pageSize: 100 };
            dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
        }
        else {
            dispatch(resetBrchClassAct(undefined));
        }
        // getClassWiseTermsDateApiCall({academicYearId:ClassTermsFilterForm.values.academicYear,curriculumId:event.target.value});
    }

    useEffect(() => {

        props.modalData && setClassTermsState(intialValues(props.modalData));
        const payload = props.modalData && { branchId: +props.branchId, curriculumId: props.modalData.curriculumId, academicYearId: props.modalData.academicYearId, pageNo: 0, pageSize: 100 };
        props.modalData && dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
        

    }, [props.modalData]);

    useEffect(() => {
        if (!props.isOpen) {
            setClassTermsState(intialValues({ academicYearId: "", curriculumId: "", classId: "", terms: [] }))
        }
        dispatch(resetBrchClassAct(undefined));

    }, [props.isOpen])

    useEffect(() => {
        if (ClassTermsFilterForm.values.academicYear) {
            const payload1 = { academicYearId: ClassTermsFilterForm.values.academicYear, branchId: +props.branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
            dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
        }
    }, [ClassTermsFilterForm.values.academicYear])
    const { data: academiYear } = academicYearListResp || {};
    const { data: curriculumTypes } = getAssignListCurriculumResp || {};
    const { content: classTypes } = getAssignLanClassListResp || {};
    return (<>
     
        <div className="tw-p-5">

            <FormikProvider value={ClassTermsFilterForm}>

                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-12 tw-mb-3">
                        <SelectInput
                            name="academicYear"
                            menuItems={academiYear}
                            valueKey="academicYearId"
                            textKey="academicYearName"
                            onChange={ClassTermsFilterForm.handleChange}
                            value={ClassTermsFilterForm.values.academicYear}
                            defaultSelect="Academic Year"
                            labelText="Academic Year"
                            isDisabled={props.modalData}
                            invalid={(ClassTermsFilterForm.touched.academicYear && ClassTermsFilterForm.errors.academicYear) ? true : false}
                            error={(ClassTermsFilterForm.touched.academicYear && ClassTermsFilterForm.errors.academicYear) ? ClassTermsFilterForm.errors.academicYear : ""}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-6 tw-mb-4">
                        <SelectInput
                            name="curriculumType"
                            menuItems={curriculumTypes}
                            valueKey="branchCurriculumId"
                            textKey="curriculumName"
                            onChange={(event: any) => {
                                ClassTermsFilterForm.handleChange(event);
                                curriculumHandler(event);
                            }}
                            value={ClassTermsFilterForm.values.curriculumType}
                            defaultSelect="Curriculum Type"
                            labelText="Curriculum"
                            isDisabled={props.modalData}
                            invalid={(ClassTermsFilterForm.touched.curriculumType && ClassTermsFilterForm.errors.curriculumType) ? true : false}
                            error={(ClassTermsFilterForm.touched.curriculumType && ClassTermsFilterForm.errors.curriculumType) ? ClassTermsFilterForm.errors.curriculumType : ""}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-6 tw-mb-4">
                        <SelectInput
                            name="classType"
                            menuItems={classTypes}
                            valueKey="id"
                            textKey="shortName"
                            onChange={ClassTermsFilterForm.handleChange}
                            value={ClassTermsFilterForm.values.classType}
                            defaultSelect="Class"
                            labelText="Class"
                            isDisabled={props.modalData}
                            invalid={(ClassTermsFilterForm.touched.classType && ClassTermsFilterForm.errors.classType) ? true : false}
                            error={(ClassTermsFilterForm.touched.classType && ClassTermsFilterForm.errors.classType) ? ClassTermsFilterForm.errors.classType : ""}
                        />
                    </div>

                    {ClassTermsFilterForm.values.classType &&
                        ClassTermsFilterForm.values.curriculumType && (
                            <div className="tw-col-span-12 tw-mb-3">
                                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                                    <div className="tw-col-span-4">
                                        <h6 className="tw-text-sm tw-font-semibold tw-mb-0">
                                            Term Name
                                        </h6>
                                    </div>
                                    <div className="tw-col-span-4">
                                        <h6 className="tw-text-sm tw-font-semibold tw-mb-0">
                                            Start Date
                                        </h6>
                                    </div>
                                    <div className="tw-col-span-4">
                                        <h6 className="tw-text-sm tw-font-semibold tw-mb-0">
                                            End Date
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        )}

                    {ClassTermsFilterForm.values.classType &&
                        ClassTermsFilterForm.values.curriculumType && (
                            <div className="tw-col-span-12">
                                {ClassTermsFilterForm.values.terms &&
                                    ClassTermsFilterForm.values.terms.map(
                                        (item: any, index: number) => {
                                            const inputFieldErrors: any =
                                                (ClassTermsFilterForm.errors.terms &&
                                                    ClassTermsFilterForm.errors.terms[index]) ||
                                                {};

                                            const inputFieldTouched: any =
                                                (ClassTermsFilterForm.touched.terms &&
                                                    ClassTermsFilterForm.touched.terms[index]) ||
                                                {};

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4"
                                                >
                                                    <div className="tw-col-span-4">
                                                        <TextInput
                                                            name={`terms.${index}.termName`}
                                                            data-index={index}
                                                            value={item.termName}
                                                            formgroupClassName="tw-mb-0"
                                                            onChange={ClassTermsFilterForm.handleChange}
                                                            isDisabled={true}
                                                            invalid={inputFieldTouched.termName &&
                                                                inputFieldErrors.termName
                                                                ? true
                                                                : false}
                                                            error={inputFieldTouched.termName &&
                                                                inputFieldErrors.termName
                                                                ? inputFieldErrors.termName
                                                                : ""}
                                                        />
                                                    </div>
                                                    <div className="tw-col-span-4">
                                                        <DateInput
                                                            name={`terms.${index}.startDate`}
                                                            value={item.startDate}
                                                            formgroupClassName="tw-mb-0"
                                                            onChange={ClassTermsFilterForm.handleChange}
                                                            invalid={inputFieldTouched.startDate &&
                                                                inputFieldErrors.startDate
                                                                ? true
                                                                : false}
                                                            error={inputFieldTouched.startDate &&
                                                                inputFieldErrors.startDate
                                                                ? inputFieldErrors.startDate
                                                                : ""}
                                                        />
                                                    </div>

                                                    <div className="tw-col-span-4">
                                                        <DateInput
                                                            name={`terms.${index}.endDate`}
                                                            value={item.endDate}
                                                            formgroupClassName="tw-mb-0"
                                                            onChange={ClassTermsFilterForm.handleChange}
                                                            invalid={inputFieldTouched.endDate &&
                                                                inputFieldErrors.endDate
                                                                ? true
                                                                : false}
                                                            error={inputFieldTouched.endDate &&
                                                                inputFieldErrors.endDate
                                                                ? inputFieldErrors.endDate
                                                                : ""}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                            </div>
                        )}

                </div>

            </FormikProvider>

            <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-4">
                <Button
                    type="button"
                    onClick={props.toggle}
                    variant="secondary"
                >
                    Cancel
                </Button>

                <Button
                    type="button"
                    onClick={(event: any) =>
                        ClassTermsFilterForm.handleSubmit(event)
                    }
                    disabled={showApiLoader}
                    variant="primary"
                >
                    Save
                </Button>
            </div>

        </div>
        
    </>
    )
}

export default AddEditPrePrimary;
