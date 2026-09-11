import { useFormik } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    AutoSearchInputUpdated,
    DateInput,
    SelectInput,
    TextArea,
    TextInput,
} from "../../../../../Components/Common";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import {
    generateLedgerColumns,
} from "./helper";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { toast } from "react-toastify";
import { useHistory, useLocation } from "react-router-dom";
import * as Yup from "yup";
import { getHostelOptedStudentsAct, getTerminationStuLedgersAct, saveHostelTerminationAct, setTerminationStuLedgersAct } from "../../../../../store/hostel/hostelrequest/hostelrequestactions";
import Button from "../../../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required('Academic Year is required.'),
    studentId: Yup.string().nullable().required('Student is required.'),
    willEffectDate: Yup.string().required('Will Effect From Date is required.'),
})


function getTerminationRequestData() {
    return ({
        admissionShortListId: "",
        studentId: "",
        academicYearId: "",
        curriculumName: "",
        className: "",
        willEffectDate: "",
        remarks: "",
    })
}

const initialValues = getTerminationRequestData();
const NewHostelTerminationReq = () => {
    const [searchStudentState, setSearchStudentState] = useState<any>();
    const history = useHistory();
    const location: any = useLocation()
    const dispatch = useAppDispatch(),
        {
            academicYearListResp,
            currentBranchIdResp: branchId,
            currentInstIdResp: instituteId,
            hostelRequestErrorResp,
            saveHostelTerminationResp,
            showApiLoader,
            hostelOptedStudentsResp,
            getTerminationStuLedgersResp,
        } = useAppSelector(
            ({ globalData, instAcademics, appData, transportrecords, hostelRequest }) => ({
                academicYearListResp: instAcademics.academicYearListResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                showApiLoader: globalData.showApiLoader,
                hostelRequestErrorResp: hostelRequest.hostelRequestErrorResp,
                saveHostelTerminationResp: hostelRequest.saveHostelTerminationResp,
                hostelOptedStudentsResp: hostelRequest.hostelOptedStudentsResp,
                getTerminationStuLedgersResp: hostelRequest.getTerminationStuLedgersResp,
            }),
            shallowEqual
        );

    const addNewRequestRespRef: any = useRef({
        prevAcademicYearListResp: undefined,
        prevSaveHostelTerminationResp: saveHostelTerminationResp,
        prevHostelRequestErrorResp: hostelRequestErrorResp
    })

    useEffect(() => {
        const { prevAcademicYearListResp, prevSaveHostelTerminationResp,
            prevHostelRequestErrorResp } = addNewRequestRespRef.current;

        if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
            if (Array.isArray(academicYearListResp?.data) && !location?.state?.studentDetails) {
                const { academicYearId } = academicYearListResp.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
                terminationReqForm.setFieldValue("academicYearId", academicYearId);

            }
        } else if (saveHostelTerminationResp && prevSaveHostelTerminationResp !== saveHostelTerminationResp) {
            toast.success('Termination request added successfully.');
            history.push(`/hostel-admissions`);
        }
        else if (hostelRequestErrorResp && prevHostelRequestErrorResp !== hostelRequestErrorResp) {
            const { details, message }: any = hostelRequestErrorResp;
            toast.error(details || message || "Something went wrong.");
        }

        addNewRequestRespRef.current.prevAcademicYearListResp = academicYearListResp;
        addNewRequestRespRef.current.prevSaveHostelTerminationResp = saveHostelTerminationResp;
        addNewRequestRespRef.current.prevHostelRequestErrorResp = hostelRequestErrorResp;
    }, [academicYearListResp,
        saveHostelTerminationResp,
        hostelRequestErrorResp]);

    useEffect(() => {
        return () => {
            dispatch(setTerminationStuLedgersAct(undefined))
        }
    }, [])

    useEffect(() => {
        if (location?.state?.studentDetails) {
            const { studentCode, studentName, studentId, curriculumName, className, academicYearId, id } = location?.state?.studentDetails || {};
            terminationReqForm.setValues((prev:any)=>({
                ...prev,
                studentId,
                curriculumName,
                className,
                academicYearId,
                admissionShortListId: id
            }));
            setSearchStudentState({ studentCode, studentName, studentId })
        }
    }, [location])

    const terminationReqForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const { willEffectDate, admissionShortListId, remarks } = values || {};
            const payload = {
                willEffectDate, admissionShortListId, remarks
            }

            dispatch(saveHostelTerminationAct(generateActionPayload("save_hostel_termination_list", undefined, payload)));
        }
    });

    function onInputSearchChange(inputString: any) {
        if (inputString) {
            getHostelOptedStudentApiCall(inputString)
        }
    }

    const selectStudentHandler = (selectedStudent: any) => {
        if (selectedStudent) {
            const { id, studentId, studentCode, studentName, curriculumName, className } = selectedStudent || {};

            setSearchStudentState({ studentCode, studentName, studentId })
            terminationReqForm.setValues((prev: any) => ({ ...prev, studentId, className, curriculumName, admissionShortListId: id, }));
        } else {
            setSearchStudentState(undefined)
            dispatch(setTerminationStuLedgersAct(undefined))
            terminationReqForm.setValues((prev: any) => ({ ...prev, studentId: "", className: "", curriculumName: "", admissionShortListId: "", }));
        }
    }

    function getHostelOptedStudentApiCall(searchString?: string) {
        const { academicYearId } = terminationReqForm.values || {}
        const payload = {
            branchId,
            academicYearId,
            pageNo: 0, pageSize: 20,
            searchString,
            status: "ACTIVE"
        }
        dispatch(getHostelOptedStudentsAct(generateActionPayload("hostel_opted_students", undefined, payload)));
    }

    const getTermsDetails = (otherProps?: any) => {
        let payload = {
            studentId: terminationReqForm.values.studentId,
            willEffectDate: terminationReqForm.values?.willEffectDate,
            ...otherProps,
        }
        dispatch(getTerminationStuLedgersAct(generateActionPayload('get_termination_stu_ledgers', payload)));
    }

    const changeHndler = (event: any) => {
        const { name, value } = event.target;
        if (name === "willEffectDate") {
            terminationReqForm.handleChange(event)
            if (terminationReqForm.values?.studentId) {
                getTermsDetails({ willEffectDate: value })
            }
        }
    }

    const LedgerColumns = useMemo(() => generateLedgerColumns(), []);

    return (
        <>
            <div className="page-content transportation_change_request_wrap">
                <div className="container-fluid">
                    <BreadCrumb title="Hostel" pageTitle="Hostel" />

                    <form onSubmit={terminationReqForm.handleSubmit}>
                        <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">

                            <div className="tw-font-bold tw-text-lg tw-px-4 tw-py-3 tw-border-b">
                                Termination Request
                            </div>

                            <div className="tw-px-4 tw-py-4">

                                <div className="tw-grid tw-grid-cols-12 tw-gap-6">

                                    <div className="tw-col-span-12 lg:tw-col-span-4">

                                        <SelectInput
                                            name="academicYearId"
                                            value={terminationReqForm.values.academicYearId}
                                            onChange={terminationReqForm.handleChange}
                                            menuItems={academicYearListResp?.data}
                                            onBlur={terminationReqForm.handleBlur}
                                            valueKey="academicYearId"
                                            textKey="academicYearName"
                                            defaultSelect="Academic Year"
                                            formgroupClassName="tw-mb-2"
                                            isDisabled={location?.state?.studentDetails}
                                           invalid={(terminationReqForm.touched.academicYearId && terminationReqForm.errors.academicYearId) ? true : false}
                                            error={(terminationReqForm.touched.academicYearId && terminationReqForm.errors.academicYearId) ? terminationReqForm.errors.academicYearId : ""}
                                        />

                                        <AutoSearchInputUpdated
                                            formgroupClassName="search-box"
                                            name="studentId"
                                            onChange={onInputSearchChange}
                                            onBlur={terminationReqForm.handleBlur}
                                            valueKey="id"
                                            alignRight={true}
                                            labelHeader="Student. Code"
                                            labelKey="studentCode"
                                            subLabelHeader="Student Name"
                                            subLabelKey="studentName"
                                            placeHolder="Search..."
                                            isDisabled={location?.state?.studentDetails}
                                            options={Array.isArray(hostelOptedStudentsResp?.data) ? hostelOptedStudentsResp?.data : []}
                                            selected={searchStudentState}
                                            selectedOptionCallbck={selectStudentHandler}
                                            invalid={(terminationReqForm.touched.studentId && terminationReqForm.errors.studentId) ? true : false}
                                            error={(terminationReqForm.touched.studentId && terminationReqForm.errors.studentId) ? terminationReqForm.errors.studentId : ""}
                                        >
                                            <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/6 tw-text-gray-400"></i>
                                        </AutoSearchInputUpdated>

                                        <TextInput
                                            name="curriculumId"
                                            value={terminationReqForm.values.curriculumName}
                                            onChange={undefined}
                                            formgroupClassName="tw-my-2"
                                            isDisabled={true}
                                            placeHolder="Curriculum"
                                        />
                                        <TextInput
                                            name="classId"
                                            value={terminationReqForm.values.className}
                                            onChange={undefined}
                                            formgroupClassName="tw-mb-2"
                                            isDisabled={true}
                                            placeHolder="Class"
                                        />
                                    </div>

                                    {/* Right Column */}
                                    <div className="tw-col-span-12 lg:tw-col-span-4 lg:tw-col-start-9">

                                        <DateInput
                                            name="willEffectDate"
                                            value={terminationReqForm.values.willEffectDate}
                                            onChange={changeHndler}
                                            onBlur={terminationReqForm.handleBlur}
                                            labelText="Will Effect Date"
                                            invalid={(terminationReqForm.touched.willEffectDate && terminationReqForm.errors.willEffectDate) ? true : false}
                                            error={(terminationReqForm.touched.willEffectDate && terminationReqForm.errors.willEffectDate) ? terminationReqForm.errors.willEffectDate : ""}
                                        />

                                        <TextArea
                                            name="remarks"
                                            value={terminationReqForm.values.remarks}
                                            placeHolder="Enter Remarks..."
                                            labelText="Remarks"
                                            onChange={terminationReqForm.handleChange}
                                        >
                                            <i className="ri-pencil-line tw-text-gray-400"></i>
                                        </TextArea>
                                    </div>

                                </div>

                                <div className="tw-py-3">
                                    <div className="tw-mb-4">
                                        <TableContainer
                                            columns={LedgerColumns || []}
                                            data={
                                                Array.isArray(getTerminationStuLedgersResp)
                                                    ? getTerminationStuLedgersResp
                                                    : []
                                            }
                                            divClass="tw-overflow-x-auto tw-my-3"
                                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                                        />
                                    </div>

                                    <div className="tw-flex tw-justify-end tw-gap-2">
                                        <Button
                                            variant="secondary"
                                            type="button"
                                            onClick={() => history.push("/hostel-admissions")}
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            type="button"
                                            disabled={showApiLoader}
                                            onClick={(event: any) =>
                                                terminationReqForm.handleSubmit(event)
                                            }
                                            variant="primary"
                                        >
                                            Approve
                                        </Button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </form>
                </div>
            </div>


        </>
    );
};

export default NewHostelTerminationReq;
