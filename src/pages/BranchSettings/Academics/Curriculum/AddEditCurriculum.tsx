import React, {  useState, useRef, useEffect } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component
import {TextInput, SelectInput, TextInputWithRegex } from "../../../../Components/Common";

// Formik validation
import * as Yup from "yup";
import {FieldArray, useFormik, ArrayHelpers, FormikProvider } from "formik";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Common Utility
import { generateUniqueNumber } from "../../../../utility/commonutility";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getInstCurriculumAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { addBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";

//Interface and Types
import { IAddCurriculumInfo } from "./currciulumtypes";
import Button from "../../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Select academic year."),
    curriculums: Yup.array().of(
        Yup.object().shape({
            curriculumId: Yup.string().required("Select curriculum.").test("unique-curriculum", "Select unique curriculum.",
                (value: any, schema: any) => {
                    const curriculumList = schema.options.from[1].value.curriculums,
                        uniqueKeys = new Set();
                    for (let i = 0; i < curriculumList.length; i++) {
                        const { curriculumId } = curriculumList[i];
                        if (!curriculumId) {
                            continue;
                        }
                        if (uniqueKeys.has(curriculumId) && value === curriculumId) {
                            return false;
                        }
                        uniqueKeys.add(curriculumId);
                    }
                    return true;
                }),
                affiliationNo: Yup.number().typeError("Enter a valid number.").required("Affiliation number required."),
                schoolCode: Yup.string().required("Short Name is required."),

        })
    )
});

function getInitialState(editData?: any): IAddCurriculumInfo {
    // return { curriculums: [{ uniqueId: generateUniqueNumber(), curriculumId: "" }] }
    const data: any = {
        uniqueId: generateUniqueNumber(),
        instituteCurriculumId: undefined,
        curriculumId: "",
        schoolCode: "",
        affiliationNo: ""
    };
    if (editData) {
        const { curriculumId, instituteCurriculumId, schoolCode, affiliationNo } = editData || {};
        data.uniqueId = instituteCurriculumId;
        data.instituteCurriculumId = instituteCurriculumId;
        data.curriculumId = curriculumId;
        data.schoolCode = schoolCode;
        data.affiliationNo = affiliationNo
    }
    return { curriculums: [data] , academicYearId : "" }
}


const AddEditCurriculum: React.FC<any> = (props) => {
    const [curriculumListState, setCurriculumListState] = useState<IAddCurriculumInfo>(() => getInitialState());
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

    const dispatch = useAppDispatch();
    const { instCurriculumResp, addBrchCurriculumResp,academicYearListResp,showApiLoader } = useAppSelector(({ instAcademics, branchAcademics,globalData }) => ({
        instCurriculumResp: instAcademics.instCurriculumResp,
        academicYearListResp: instAcademics.academicYearListResp,
        addBrchCurriculumResp: branchAcademics.addBrchCurriculumResp,
        showApiLoader:globalData.showApiLoader,
    }), shallowEqual);

    const addDepartmentRespRef = useRef<any>({
        prevAddBrchCurriculumResp: addBrchCurriculumResp,
    });

    useEffect(() => {
        if (props.isOpen && !instCurriculumResp) {
            const { instituteId } = props, params = { instituteId, pageNo: 0, pageSize: 100 };
            dispatch(getInstCurriculumAct(generateActionPayload("get_inst_curriculum", undefined, params)));
        }
        if (!props.isOpen) {
            addNewCurriculumForm.resetForm();
        }
    }, [props.isOpen, instCurriculumResp]);

    useEffect(() => {
        if (props.editRoleDetails) {
            setCurriculumListState(getInitialState(props.editRoleDetails));
        } else {
            setCurriculumListState(getInitialState());
        }
    }, [props.editRoleDetails]);

    useEffect(() => {
        const { prevAddBrchCurriculumResp } = addDepartmentRespRef.current;
        if (addBrchCurriculumResp && prevAddBrchCurriculumResp !== addBrchCurriculumResp) {
            props.toggle(true);
            toast.success("Curriculum added successfully.");
        }
        addDepartmentRespRef.current.prevAddBrchCurriculumResp = addBrchCurriculumResp;
    }, [addBrchCurriculumResp]);

    function addNewCurriculumHndlr() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), curriculumId: "", affiliationNo: "", schoolCode: "" });
        }
    }

    function removeCurriculumHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }

    const addNewCurriculumForm = useFormik({
        enableReinitialize: true,
        initialValues: curriculumListState,
        validationSchema,
        onSubmit: (values) => {
            const params = { branchId: props.branchId },
                payload = values.curriculums.map(item => ({instituteCurriculumId:item.curriculumId, affiliationNo:item.affiliationNo, schoolCode:item.schoolCode , academicYearId:values.academicYearId}) );
                // headerConfig = { headers: { academicYearId: "arfds-af32dfd-s233" } };
                 dispatch(addBranchCurriculumAct(generateActionPayload("add_brch_curriculum", params, payload)));
        },
    });
    return (

        <div className="tw-p-5">

            <div className="tw-mb-6">
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-4 tw-mb-4">
                    <div className="md:tw-col-span-4">
                        <SelectInput
                            name="academicYearId"
                            value={addNewCurriculumForm.values.academicYearId}
                            onChange={addNewCurriculumForm.handleChange}
                            menuItems={academicYearListResp?.data}
                            valueKey="academicYearId"
                            textKey="academicYearName"
                            formgroupClassName="tw-mb-0"
                            labelText="Academic Year"
                            invalid={(addNewCurriculumForm.touched.academicYearId && addNewCurriculumForm.errors.academicYearId) ? true : false}
                            error={(addNewCurriculumForm.touched.academicYearId && addNewCurriculumForm.errors.academicYearId) ? addNewCurriculumForm.errors.academicYearId : ""}
                            />
                    </div>
                </div>

                <div className="tw-grid tw-grid-cols-12 tw-mb-3">
                    <div className="tw-col-span-5">
                        <h6 className="tw-mb-0">Curriculum Name</h6>
                    </div>
                    <div className="tw-col-span-7">
                        <div className="tw-grid tw-grid-cols-2">
                            <div>
                                <h6 className="tw-mb-0">Affiliation No</h6>
                            </div>
                            <div>
                                <h6 className="tw-mb-0">School Code</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FormikProvider value={addNewCurriculumForm}>
                <FieldArray name="curriculums">
                    {(arrayHelpers: ArrayHelpers) => {
                        if (!formikArrayHelpers.current) {
                            formikArrayHelpers.current = arrayHelpers;
                        }

                        return (
                            <>
                                {addNewCurriculumForm.values.curriculums.length > 0 &&
                                    addNewCurriculumForm.values.curriculums.map(
                                        (curriculum: any, index: number) => {
                                            const inputFieldErrors: any =
                                                (addNewCurriculumForm.errors.curriculums &&
                                                    addNewCurriculumForm.errors.curriculums[index]) ||
                                                {};
                                            const inputFieldTouched =
                                                (addNewCurriculumForm.touched.curriculums &&
                                                    addNewCurriculumForm.touched.curriculums[index]) ||
                                                {};

                                            return (
                                                <div
                                                    key={curriculum.uniqueId}
                                                    className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4"
                                                >
                                                    <div className="tw-col-span-5">
                                                        <SelectInput
                                                            name={`curriculums.${index}.curriculumId`}
                                                            data-index={index}
                                                            value={curriculum.curriculumId}
                                                            formgroupClassName="tw-mb-0"
                                                            onChange={addNewCurriculumForm.handleChange}
                                                            onBlur={addNewCurriculumForm.handleBlur}
                                                            invalid={(inputFieldTouched.curriculumId && inputFieldErrors.curriculumId) ? true : false}
                                                            error={(inputFieldTouched.curriculumId && inputFieldErrors.curriculumId) ? inputFieldErrors.curriculumId : ""}
                                                            menuItems={instCurriculumResp?.data}
                                                            valueKey="instituteCurriculumId"
                                                            textKey="curriculumName"
                                                        />
                                                    </div>

                                                    <div className="tw-col-span-7">
                                                        <div className="tw-grid tw-grid-cols-2 tw-gap-4">

                                                            <div>
                                                                <TextInputWithRegex
                                                                    name={`curriculums.${index}.affiliationNo`}
                                                                    data-index={index}
                                                                    value={curriculum.affiliationNo}
                                                                    formgroupClassName="tw-mb-0"
                                                                    onChange={addNewCurriculumForm.handleChange}
                                                                    invalid={(inputFieldTouched.affiliationNo && inputFieldErrors.affiliationNo) ? true : false}
                                                                    error={(inputFieldTouched.affiliationNo && inputFieldErrors.affiliationNo) ? inputFieldErrors.affiliationNo : ""}
                                                                    maxLength={10}
                                                                    allowedInputRegex="^[0-9]+$"
                                                                />
                                                            </div>

                                                            <div className="tw-flex tw-items-center tw-gap-2">
                                                                <TextInput
                                                                    name={`curriculums.${index}.schoolCode`}
                                                                    data-index={index}
                                                                    value={curriculum.schoolCode}
                                                                    formgroupClassName="tw-mb-0 tw-flex-1"
                                                                    onChange={addNewCurriculumForm.handleChange}
                                                                      invalid={(inputFieldTouched.schoolCode && inputFieldErrors.schoolCode) ? true : false}
                                                                    error={(inputFieldTouched.schoolCode && inputFieldErrors.schoolCode) ? inputFieldErrors.schoolCode : ""}
                                                                />

                                                                {index !== 0 && (
                                                                    <Button
                                                                        variant="wrong"
                                                                        data-index={index}
                                                                        onClick={removeCurriculumHndlr}
                                                                        className="!tw-p-2 !tw-rounded-full "
                                                                    >
                                                                        <i className="ri-delete-bin-2-fill" />
                                                                    </Button>
                                                                )}
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                            </>
                        );
                    }}
                </FieldArray>
            </FormikProvider>

            <div className="tw-mb-6">
                <Button
                    variant="hoverInfo"
                    onClick={addNewCurriculumHndlr}
                    type="button"
                >
                    Add New
                </Button>
            </div>

            <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-6 tw-mb-1">
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
                        addNewCurriculumForm.handleSubmit(event)
                    }
                    disabled={showApiLoader}
                >
                    Submit
                </Button>
            </div>

        </div>
   
    )
}

export default AddEditCurriculum;
