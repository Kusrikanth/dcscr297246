import React, { useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import {  TextInput, SelectInput } from "../../../../Components/Common";
import { toast } from "react-toastify";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
// Formik validation
import * as Yup from "yup";
import {  FieldArray, useFormik,  ArrayHelpers, FormikProvider } from "formik";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { addBrchSectionAct, updateBrchSectionAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";

//Common Utility
import { generateUniqueNumber } from "../../../../utility/commonutility";
import Button from "../../../../Components/Common/Button";

//Interface & Types

function getModalTitle(action: string): string {
    switch (action) {
        case "add":
            return "Add Section";
        case "edit":
            return "Edit Section";
        case "delete":
            return "Delete Section";
        default:
            return "";
    }
}

interface IAddSection {
    academicYearId: string,
    branchCurriculumId: string;
    branchClassId: string;
    sectionNames: { uniqueId: string | number, sectionId?: any; sectionName: string }[]
}
function getAddEditSections(editData?: any): IAddSection {
    if (editData) {
        const sectionNames = editData?.sectionsResponse.map((item: any) => (
            {
                uniqueId: item?.sectionId,
                sectionId: item?.sectionId,
                sectionName: item?.sectionName
            }
        ))
        return {
            academicYearId: editData?.branchAcademicYearId,
            branchCurriculumId: editData?.branchCurriculumId,
            branchClassId: editData?.branchClassId,
            sectionNames
        }

    } else {
        return {
            academicYearId: "",
            branchCurriculumId: "",
            branchClassId: "",
            sectionNames: [{
                uniqueId: generateUniqueNumber(),
                sectionId: undefined,
                sectionName: ""
            }]
        }
    }
}

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic year required."),
    branchCurriculumId: Yup.string().required("Branch curriculum required."),
    branchClassId: Yup.string().required("Branch class required."),
    sectionNames: Yup.array().of(
        Yup.object().shape({
            sectionName: Yup.string().required("Section name required.")
        })
    ),
});


const AddEditSections: React.FC<any> = (props) => {
    const [addSectionState, setAddSectionState] = useState<IAddSection>(() => getAddEditSections(undefined));
    const [classListState, setClassListState] = useState([]);
    const dispatch = useAppDispatch();
    const { addBrchSectionResp, updateBrchSectionResp, brchCurriculumResp, branchClassResp, academicYearListResp,showApiLoader } = useAppSelector((
        { branchAcademics, instAcademics,globalData }) => ({
            addBrchSectionResp: branchAcademics.addBrchSectionResp,
            updateBrchSectionResp: branchAcademics.updateBrchSectionResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            academicYearListResp: instAcademics.academicYearListResp,
            showApiLoader:globalData.showApiLoader,
        }), shallowEqual);
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

    const addSectionRespRef = useRef<any>({
        prevAddBrchSectionResp: addBrchSectionResp,
        prevUpdateBrchSectionResp: updateBrchSectionResp,
        prevBranchClassResp: branchClassResp,
    });

    useEffect(() => {
        const { prevAddBrchSectionResp, prevUpdateBrchSectionResp, prevBranchClassResp } = addSectionRespRef.current;
        if (addBrchSectionResp && prevAddBrchSectionResp !== addBrchSectionResp) {
            props.toggle(true);
            toast.success("Section added successfully.");
        } else if (updateBrchSectionResp && prevUpdateBrchSectionResp !== updateBrchSectionResp) {
            props.toggle(true);
            toast.success("Section updated successfully.");
        } else if (branchClassResp && prevBranchClassResp !== branchClassResp) {
            setClassListState(branchClassResp?.content || []);
        }
        addSectionRespRef.current.prevAddBrchSectionResp = addBrchSectionResp;
        addSectionRespRef.current.prevUpdateBrchSectionResp = updateBrchSectionResp;
        addSectionRespRef.current.prevBranchClassResp = branchClassResp;
    }, [addBrchSectionResp, updateBrchSectionResp, branchClassResp]);


    useEffect(() => {
        if (props.isOpen && brchCurriculumResp) {
            if (!props.editSectionDetails) {
                const { branchCurriculumId } = brchCurriculumResp?.data[0] || {};
                setAddSectionState(getAddEditSections(props.editSectionDetails));
            } else if (props.editSectionDetails) {
                const { branchCurriculumId } = props.editSectionDetails;
                setAddSectionState(getAddEditSections(props.editSectionDetails));
            }
        } else if (!props.isOpen) {
            addSectionForm.resetForm();
            setAddSectionState(getAddEditSections(undefined));
        }
    }, [props.isOpen, brchCurriculumResp, props.editSectionDetails]);

    function removeSectionHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }

    function addNewSectionHndlr() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), sectionName: "" });
        }
    }

    const addSectionForm = useFormik({
        enableReinitialize: true,
        initialValues: addSectionState,
        validationSchema,
        onSubmit: (values) => {
            if (props.classId) {
                const { sectionNames, academicYearId } = values,
                    params = { branchClassId: props.classId, academicYearId },
                    payloadUpdateSections = sectionNames.map(item => { const { uniqueId, ...sectionDetails } = item; return sectionDetails; });
                dispatch(updateBrchSectionAct(generateActionPayload("update_brch_section", params, payloadUpdateSections)));
            } else {
                const params = { branchId: props.branchId },
                    { sectionNames, ...otherInfo } = values,
                    payloadSectionName = sectionNames.map(item => item.sectionName);
                const payload: any = Object.assign(otherInfo, { sectionNames: payloadSectionName })
                dispatch(addBrchSectionAct(generateActionPayload("add_brch_section", params, payload)));
            }
        },
    });
    useEffect(() => {
        const { academicYearId, branchCurriculumId } = addSectionForm.values;
        if (academicYearId && branchCurriculumId) {
            getBranchClassApiCall(branchCurriculumId, academicYearId);
        }
    }, [addSectionForm.values.academicYearId, addSectionForm.values.branchCurriculumId]);
    
    function getBranchClassApiCall(curriculumId: string, academicYearId: string) {
        const payload = {
            academicYearId, curriculumId, branchId: props.branchId, pageSize: 100, pageNo: 0,
            sortBy: "classSequence", orderBy: "asc",
        };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    function onChangeCurriculumHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        addSectionForm.setValues((prevState: any) => ({ ...prevState, [name]: value, branchClassId: "" }));
        setClassListState([]);
    }
    return (

        <div className="tw-p-5">
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">

                <div className="tw-mb-3">
                    <SelectInput
                        name="academicYearId"
                        labelText="Academic Year"
                        labelClass="required"
                        value={addSectionForm.values.academicYearId}
                        onChange={addSectionForm.handleChange}
                        invalid={(addSectionForm.touched.academicYearId && addSectionForm.errors.academicYearId) ? true : false}
                        error={(addSectionForm.touched.academicYearId && addSectionForm.errors.academicYearId) ? addSectionForm.errors.academicYearId : ""}
                        menuItems={academicYearListResp?.data}
                        formgroupClassName="tw-mb-0"
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        isDisabled={!!props.classId}
                    />
                </div>

                <div className="tw-mb-3">
                    <SelectInput
                        name="branchCurriculumId"
                        labelText="Curriculum"
                        labelClass="required"
                        value={addSectionForm.values.branchCurriculumId}
                        onChange={onChangeCurriculumHndlr}
                        invalid={(addSectionForm.touched.branchCurriculumId && addSectionForm.errors.branchCurriculumId) ? true : false}
                        error={(addSectionForm.touched.branchCurriculumId && addSectionForm.errors.branchCurriculumId) ? addSectionForm.errors.branchCurriculumId : ""}
                        menuItems={brchCurriculumResp?.data}
                        formgroupClassName="tw-mb-0"
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        isDisabled={!!props.classId}
                    />
                </div>

                <div className="md:tw-col-span-2 tw-mb-4">
                    <SelectInput
                        name="branchClassId"
                        labelText="Class"
                        labelClass="required"
                        value={addSectionForm.values.branchClassId}
                        onChange={addSectionForm.handleChange}
                        invalid={(addSectionForm.touched.branchClassId && addSectionForm.errors.branchClassId) ? true : false}
                        error={(addSectionForm.touched.branchClassId && addSectionForm.errors.branchClassId) ? addSectionForm.errors.branchClassId : ""}
                        menuItems={classListState}
                        formgroupClassName="tw-mb-0"
                        valueKey="id"
                        textKey="shortName"
                        isDisabled={!!props.classId}
                    />
                </div>

                <div className="md:tw-col-span-2 tw-mb-3">
                    <div className="tw-flex tw-items-center">
                        <h6 className="tw-mb-0 tw-mr-2 required">Section</h6>
                    </div>
                </div>

                <div className="md:tw-col-span-2">
                    <FormikProvider value={addSectionForm}>
                        <FieldArray name="sectionNames">
                            {(arrayHelpers: ArrayHelpers) => {
                                if (!formikArrayHelpers.current) {
                                    formikArrayHelpers.current = arrayHelpers;
                                }

                                return (
                                    <>
                                        {addSectionForm.values.sectionNames?.map((term, index) => {
                                            const inputFieldErrors: any  =
                                                addSectionForm.errors.sectionNames?.[index] || {};

                                            const inputFieldTouched: any  =
                                                addSectionForm.touched.sectionNames?.[index] || {};

                                            return (
                                                <div key={term.uniqueId} className="tw-mb-3">
                                                    <div className="tw-flex tw-items-center tw-gap-4">

                                                        <div className="tw-flex-1">
                                                            <TextInput
                                                                name={`sectionNames.${index}.sectionName`}
                                                                data-index={index}
                                                                value={term.sectionName}
                                                                formgroupClassName="tw-mb-0"
                                                                onChange={addSectionForm.handleChange}
                                                                invalid={inputFieldTouched.sectionName && inputFieldErrors.sectionName}
                                                                error={inputFieldTouched.sectionName && inputFieldErrors.sectionName ? inputFieldErrors.sectionName : ""}
                                                            />
                                                        </div>

                                                        {((index !== 0) || props.classId) && (
                                                            <Button
                                                                data-index={index}
                                                                onClick={removeSectionHndlr}
                                                                variant="wrong"
                                                                className="!tw-rounded-full"
                                                            >
                                                                <i className="ri-delete-bin-2-fill tw-text-red-600" />
                                                            </Button>
                                                        )}

                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </>
                                );
                            }}
                        </FieldArray>
                    </FormikProvider>

                    {!props.classId && (
                        <div className="tw-mt-2">
                            <Button
                                onClick={addNewSectionHndlr}
                                type="button"
                                variant="hoverInfo"
                            >
                                Add New
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-4 tw-mb-1">
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
                    onClick={(event: any) => addSectionForm.handleSubmit(event)}
                    disabled={showApiLoader}
                >
                    Submit
                </Button>
            </div>
        </div>

 
    )
}

export default AddEditSections;

{/* <Col xs={10}>
<Input type="text" placeholder="" id="branchName" />
</Col>
<Col xs={"auto"} className="ms-auto">
{(index !== 0) &&
    <Button data-id={item.id} data-index={index} onClick={removeTermHndlr} color="white" className="btn-sm btn-icon btn-rounded btn-hover-danger"><i className="ri-delete-bin-2-fill" />
    </Button>}
</Col> */}