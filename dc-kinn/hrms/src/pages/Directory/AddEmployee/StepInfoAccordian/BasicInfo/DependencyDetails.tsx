import { useState, useEffect, useImperativeHandle, useContext, useRef } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { Formik, FieldArray, Form, ArrayHelpers, FormikErrors, FormikProvider, useFormik } from "formik";

import * as Yup from "yup";
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage
} from "../../../../../Components/Common";

import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";

//Helper
import {
    studentUIDTypes, yesNoOptions, admissionTypes, genderOptions, bloodGroupOptions,
    nationalityOptions, trueFalseOptions, languageOptions,
    houseNameOptions, admissionCategory, motherToungeOptions,
    religionOptions
} from "../helper";
import { StepperFormContext } from "../../helper";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import {
    getNationalityAct, getReligionAct, getRelationTypeAct, getGenderListAct
} from "../../../../../store/masterdata/masterdataactions";
import {
    getInstAcademicYearAct,
} from "../../../../../store/mastersettings/instacademics/instacademicactions";
import {
    getGlobalRecordsAct,
} from "../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";

//Common Utility
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../../Components/Common/Button";

//Old Data
// function getInitialState(initialState: any) {
//     return {
//         admissionAcademicYearId: initialState?.admissionAcademicYearId || "1",
//         admissionNo: initialState?.admissionNo || "2432",
//         dateOfAdmission: initialState?.dateOfAdmission || "2023-01-15T09:45:00",
//         studentName: initialState?.studentName || "Student Name",
//         aadharCardNo: initialState?.aadharCardNo || "123456789012",
//         genderId: initialState?.genderId || "1",
//         dob: initialState?.dob || "1980-10-01T09:45:00",
//         emailId: initialState?.emailId || "stesting@gmail.com",
//         contactNo: initialState?.contactNo || "1234567890",
//         birthPlace: initialState?.birthPlace || "Shars",
//         bloodGroupId: initialState?.bloodGroupId || "1",
//     }
// }

const validationSchema = Yup.object().shape({
    dependencyDetailsList: Yup.array().of(
        Yup.object().shape({
            dependentName: Yup.string().required("Dependent name required."),
            dependentContactNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Contact number with 10 digit is valid.').required("Contact number required."),
            relationTypeId: Yup.string().required("Select relation type."),
        })
    ),
});

// function getInitialState(editData?: any): any {
//     const data: any = {
//         uniqueId: generateUniqueNumber(),
//         dependentName: "",
//         dependentContactNo: "",
//         relationTypeId: ""
//     };
//     if (editData) {
//         const { dependentName, id, dependentContactNo, relationTypeId } = editData || {};
//         data.uniqueId = id;
//         data.id = id;
//         data.dependentName = dependentName;
//         data.dependentContactNo = dependentContactNo;
//         data.relationTypeId = relationTypeId;
//     }
//     return { dependencyDetailsList: [data] }
// }
function getInitialState(editData?: any): any {
    const data: any = [];
    if (Array.isArray(editData)) {
        for (let i = 0; i < editData.length; i++) {
            const { dependentName, id, dependentContactNo, relationTypeId } = editData[i];
            data.push({
                uniqueId: id,
                id: id,
                dependentName: dependentName,
                dependentContactNo: dependentContactNo,
                relationTypeId: relationTypeId
            });
        }
    } else {
        data.push({
            uniqueId: generateUniqueNumber(),
            id: undefined,
            dependentName: "",
            dependentContactNo: "",
            relationTypeId: ""
        });
    }
    return { dependencyDetailsList: data }
}


export default function DependencyDetails({ instituteId, branchId }: any) {
    const [dependencyDetailsState, setDependencyDetailState] = useState<any>(getInitialState());
    const { currentMultiFormKeys, editEmployeeData,
        storeMultiFormData } = useContext<any>(StepperFormContext);
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

    const dispatch = useAppDispatch();
    const { relationTypeListResp } =
        useAppSelector(({ masterData, instAcademics }) => ({
            relationTypeListResp: masterData.relationTypeListResp
        }), shallowEqual);

    useEffect(() => {
        dispatch(getRelationTypeAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "RELATION", sortBy: "relationType", orderBy: "asc", pageNo: 0, pageSize: 100 })));
    }, []);

    function addDetailsHndlr() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({
                uniqueId: generateUniqueNumber(),
                id: undefined,
                dependentName: "",
                dependentContactNo: "",
                relationTypeId: ""
            });
        }
    }

    function removeDetailsHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }


    const dependencyDetailForm = useFormik({
        enableReinitialize: true,
        initialValues: dependencyDetailsState,
        validationSchema,
        onSubmit: (values: any) => {
            const { dependencyDetailsList } = values,
                payload = dependencyDetailsList.map((item: any) => {
                    const { uniqueId, ...otherInfo } = item;
                    return otherInfo;
                });
            storeMultiFormData("employeeDependentDetails", true, payload);
        }
    })
    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes("employeeDependentDetails"))
            submitHndlr();
    }, [currentMultiFormKeys]);

    useEffect(() => {
        if (editEmployeeData) {
            const { employeeDependentDetails } = editEmployeeData,
                { formData } = employeeDependentDetails || {};
            if (formData)
                setDependencyDetailState(getInitialState(formData));
        }
    }, [editEmployeeData]);


    function onChangePhoneInput(phoneNumber: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = phoneNumber.substring(2);
        dependencyDetailForm.setFieldValue(name, updateDate);
    }

    function submitHndlr() {
        const { dependencyDetailsList = [] } = dependencyDetailForm.values;
        let validateForm = false;
        for (let i = 0; i < dependencyDetailsList.length; i++) {
            const { uniqueId, ...otherInfo } = dependencyDetailsList[i],
                checkValueInField = Object.values(otherInfo).some(item => item);
            if (checkValueInField) {
                validateForm = true;
                break;
            }
        }
        if (validateForm) {
            dependencyDetailForm.handleSubmit();
        } else {
            dependencyDetailForm.resetForm({
                values: { dependencyDetailsList }
            });
            storeMultiFormData("employeeDependentDetails", true, null);
        }
    }
    function onBlurHndlr() {
        const { dependencyDetailsList = [] } = dependencyDetailForm.values,
            { id, dependentName, relationTypeId, dependentContactNo } = dependencyDetailsList[0];
        if (dependencyDetailsList.length === 1 && !id && !dependentName && !relationTypeId && !dependentContactNo) {
            dependencyDetailForm.resetForm({
                values: { dependencyDetailsList }
            })
        }
    }
    return (
        <form>
            <AccordionHeader tag="span" className="tw-text-base" targetId="dependent-details">
                Dependencies
            </AccordionHeader>
            <AccordionBody accordionId="dependent-details">
                <div className="tw-flex tw-flex-wrap tw--mx-2">
                    <div className="tw-w-full tw-px-2">
                        <FormikProvider value={dependencyDetailForm}>
                            <FieldArray name="dependencyDetailsList">
                                {(arrayHelpers: ArrayHelpers) => {
                                    if (!formikArrayHelpers.current) {
                                        formikArrayHelpers.current = arrayHelpers;
                                    }
                                    return (
                                        <>
                                            {dependencyDetailForm.values.dependencyDetailsList.length > 0 &&
                                                dependencyDetailForm.values.dependencyDetailsList.map((details: any, index: any) => {
                                                    const inputFieldErrors: any = Array.isArray(dependencyDetailForm.errors.dependencyDetailsList) && dependencyDetailForm.errors.dependencyDetailsList[index] || {};
                                                    const inputFieldTouched = Array.isArray(dependencyDetailForm.touched.dependencyDetailsList) && dependencyDetailForm.touched.dependencyDetailsList[index] || {};
                                                    return (
                                                        <div key={details.uniqueId} className="tw-flex tw-flex-wrap tw--mx-2">
                                                            <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                                                                <TextInput
                                                                    name={`dependencyDetailsList[${index}].dependentName`}
                                                                    labelText="Name"
                                                                    value={details.dependentName}
                                                                    onChange={dependencyDetailForm.handleChange}
                                                                    onBlur={onBlurHndlr}
                                                                    invalid={(inputFieldTouched.dependentName && inputFieldErrors.dependentName) ? true : false}
                                                                    error={(inputFieldTouched.dependentName && inputFieldErrors.dependentName) ? inputFieldErrors.dependentName : ""}
                                                                />
                                                            </div>
                                                            <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                                                                <SelectInput
                                                                    name={`dependencyDetailsList[${index}].relationTypeId`}
                                                                    labelText="Relationship Type"
                                                                    value={details.relationTypeId}
                                                                    onChange={dependencyDetailForm.handleChange}
                                                                    onBlur={onBlurHndlr}
                                                                    invalid={(inputFieldTouched.relationTypeId && inputFieldErrors.relationTypeId) ? true : false}
                                                                    error={(inputFieldTouched.relationTypeId && inputFieldErrors.relationTypeId) ? inputFieldErrors.relationTypeId : ""}
                                                                    menuItems={relationTypeListResp?.data}
                                                                    valueKey="id"
                                                                    textKey="relationType"
                                                                />
                                                            </div>
                                                            <div className="tw-w-full md:tw-w-3/12 tw-px-2">
                                                                <PhoneInput
                                                                    name={`dependencyDetailsList[${index}].dependentContactNo`}
                                                                    labelText="Phone No"
                                                                    value={details.dependentContactNo}
                                                                    inputClassName="tw-w-80"
                                                                    onChange={onChangePhoneInput}
                                                                    onBlur={onBlurHndlr}
                                                                    invalid={(inputFieldTouched.dependentContactNo && inputFieldErrors.dependentContactNo) ? true : false}
                                                                    error={(inputFieldTouched.dependentContactNo && inputFieldErrors.dependentContactNo) ? inputFieldErrors.dependentContactNo : ""}
                                                                />
                                                            </div>
                                                            <div className="tw-w-full md:tw-w-1/12 tw-px-2 tw-flex tw-items-center tw-justify-center tw-mt-2">
                                                                {(index !== 0) && <Button
                                                                    data-index={index}
                                                                    onClick={removeDetailsHndlr}
                                                                    variant="wrong"
                                                                    color="white"
                                                                    className="!tw-p-2 tw-text-sm !tw-rounded-full "
                                                                >
                                                                    <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-text-red-600" size={18} />
                                                                </Button>}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                        </>
                                    )
                                }}
                            </FieldArray>

                        </FormikProvider>
                    </div>
                    <div className="tw-w-full tw-px-2">
                        <Button
                            type="button"
                            variant="hoverInfo"
                            onClick={addDetailsHndlr}
                            value="click Me"
                        >
                            Add New
                        </Button>
                        {/* <button type="button" onClick={submitHndlr} className="btn btn-success">
                            Submit
                        </button> */}
                    </div>
                </div>
            </AccordionBody>
        </form>
    )
}