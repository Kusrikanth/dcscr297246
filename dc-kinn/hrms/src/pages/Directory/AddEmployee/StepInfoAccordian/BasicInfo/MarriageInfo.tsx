import { useState, useEffect, useImperativeHandle, useContext, useRef } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { useFormik } from "formik";
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
    getNationalityAct, getReligionAct, getBloodGroupAct, getGenderListAct
} from "../../../../../store/masterdata/masterdataactions";
import {
    getInstAcademicYearAct,
} from "../../../../../store/mastersettings/instacademics/instacademicactions";
import {
    getGlobalRecordsAct,
} from "../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";

//Utility
import {
    Current_Date_YYYYMMDD,
    Current_Date_DDMMYYYY,
    MinDate_YYYYMMDD,
    Min_Date
} from "../../../../../utility/dateutility";

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
    marriageCertificateDor: Yup.date().min(MinDate_YYYYMMDD, `Marriage registration date should be more than ${Min_Date}.`)
        .max(Current_Date_YYYYMMDD, `Marriage registration date cannot be future date.`).required("Date of registration is required."),
    marriageCertificateNo: Yup.number().typeError("Enter valid number").required("Certificate number required."),
});

function getInitialState(initialState?: any) {
    return {
        employeeId: initialState?.employeeId || undefined,
        marriageCertificateDor: initialState?.marriageCertificateDor || "",
        marriageCertificateNo: initialState?.marriageCertificateNo || "",
    }
}

export default function MarriageInfo({ branchId, instituteId }: any) {
    const [marriageInfoState, setMarriageInfoState] = useState<any>(getInitialState());
    const { currentMultiFormKeys, editEmployeeData,
        storeMultiFormData } = useContext<any>(StepperFormContext);

    const dispatch = useAppDispatch();
    const { genderListResp, bloodGroupResp,
        academicYearListResp, instAcademicErrorResp, masterDataErrorResp } =
        useAppSelector(({ masterData, instAcademics }) => ({
            genderListResp: masterData.genderListResp,
            bloodGroupResp: masterData.bloodGroupResp,
            academicYearListResp: instAcademics.academicYearListResp,
            instAcademicErrorResp: instAcademics.instAcademicErrorResp,
            masterDataErrorResp: masterData.masterDataErrorResp
        }), shallowEqual);

    // useEffect(() => {
    //     const payload = { instituteId: 49, pageNo: 0, pageSize: 100 };
    //     dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
    //     dispatch(getGenderListAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "gender" })));
    //     dispatch(getBloodGroupAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "blood-group" })));
    // }, []);


    const marriageInfoForm = useFormik({
        enableReinitialize: true,
        initialValues: marriageInfoState,
        validationSchema,
        onSubmit: (values: any) => {
            const formData = {
                ...values
            }
            storeMultiFormData("employeeMarriageInfo", true, formData);
        }
    })
    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes("employeeMarriageInfo"))
            submitBtnHndlr();
    }, [currentMultiFormKeys]);


    useEffect(() => {
        if (editEmployeeData) {
            const { employeeMarriageInfo } = editEmployeeData,
                { formData } = employeeMarriageInfo || {};
            if (formData)
                setMarriageInfoState(getInitialState(formData));
        }
    }, [editEmployeeData]);

    function submitBtnHndlr() {
        const { employeeId, ...otherInfo } = marriageInfoForm.values,
            formFieldContainValue = Object.values(otherInfo).some((item: any) => item);
        if (formFieldContainValue) {
            marriageInfoForm.handleSubmit();
        } else {
            marriageInfoForm.resetForm();
            storeMultiFormData("employeeMarriageInfo", true, null);
        }
    }

    // function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    //     const { name, value } = event.target,
    //         { marriageCertificateNo, marriageCertificateDor } = marriageInfoForm.values;
    //     if (name === "marriageCertificateNo" && !value && !marriageCertificateDor) {
    //         marriageInfoForm.resetForm({
    //             values: { marriageCertificateDor: "", [name]: "" }
    //         });
    //     } else if (name === "marriageCertificateDor" && !value && !marriageCertificateNo) {
    // marriageInfoForm.resetForm({
    //     values: { marriageCertificateNo: "", [name]: "" }
    // });
    //     } else {
    //         marriageInfoForm.setFieldValue(name, value);
    //     }
    // }

    function onBlurHndlr(event: any) {
        const { marriageCertificateDor, marriageCertificateNo } = marriageInfoForm.values;
        if (!marriageCertificateDor && !marriageCertificateNo) {
            marriageInfoForm.resetForm({
                values: { marriageCertificateNo: "", marriageCertificateDor: "" }
            });
        } else {
            marriageInfoForm.handleBlur(event);
        }
    }
    return (
        <form>
            <AccordionHeader
                tag="span"
                className="tw-text-base tw-font-medium"
                targetId="marriage-info"
            >
                Marriage Info
            </AccordionHeader>
            <AccordionBody accordionId="marriage-info">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="marriageCertificateNo"
                            labelText="Certificate No."
                            value={marriageInfoForm.values.marriageCertificateNo}
                            onChange={marriageInfoForm.handleChange}
                            onBlur={onBlurHndlr}
                            invalid={(marriageInfoForm.touched.marriageCertificateNo && marriageInfoForm.errors.marriageCertificateNo) ? true : false}
                            error={(marriageInfoForm.touched.marriageCertificateNo && marriageInfoForm.errors.marriageCertificateNo) ? marriageInfoForm.errors.marriageCertificateNo : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <DateInput
                            name="marriageCertificateDor"
                            labelText="Date of Registration"
                            value={marriageInfoForm.values.marriageCertificateDor}
                            onChange={marriageInfoForm.handleChange}
                            onBlur={onBlurHndlr}
                            invalid={(marriageInfoForm.touched.marriageCertificateDor && marriageInfoForm.errors.marriageCertificateDor) ? true : false}
                            error={(marriageInfoForm.touched.marriageCertificateDor && marriageInfoForm.errors.marriageCertificateDor) ? marriageInfoForm.errors.marriageCertificateDor : ""}
                            maxDate={Current_Date_YYYYMMDD}
                        />
                        {/* <TextInput
                            name="marriageCertificateDor"
                            labelText="Date of Registration"
                            value={marriageInfoForm.values.marriageCertificateDor}
                            onChange={marriageInfoForm.handleChange}
                            invalid={(marriageInfoForm.touched.marriageCertificateDor && marriageInfoForm.errors.marriageCertificateDor) ? true : false}
                            error={(marriageInfoForm.touched.marriageCertificateDor && marriageInfoForm.errors.marriageCertificateDor) ? marriageInfoForm.errors.marriageCertificateDor : ""}
                        /> */}
                    </div>
                    {/* <div className="col-12">
                        <input type="submit" onClick={submitBtnHndlr} value="Handle Submit" />
                    </div> */}

                </div>
            </AccordionBody>
        </form>
    )
}