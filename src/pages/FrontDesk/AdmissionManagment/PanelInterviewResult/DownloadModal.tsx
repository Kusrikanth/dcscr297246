import React, { useMemo, useState } from "react";
import {
    AutoSearchInput,
    DateInput,
    ModalContainer,
    SelectInput,
    Switch,
    TextInput,
    UploadImage,
} from "../../../../Components/Common";
import { useFormik } from "formik";

import TableContainer from "../../../../Components/Common/TableContainer";
import { shallowEqual, useDispatch } from "react-redux";
import { getStudentByFilterAct, getStudentsListAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppSelector } from "../../../../hooks/storehook";
import UploadStudent from "../../../../Components/Common/UploadStudent";
import Button from "../../../../Components/Common/Button";

const initialValues: any = {
    curriculumId: "",
    academicYearId: "",
    classId: "",
    date: "",
    registrationNo: "",
    studentId: ""
};

const PanelInterviewResultModal = (props: any) => {
    const dispatch = useDispatch();
    const [feeStuctureModalFilterState, setFeeStuctureModalFilterState] =
        useState<any>(initialValues);
    const [studentDetails, setStudentDetails] = useState({});

    const ObservationandInterviewerReportForm = useFormik({
        enableReinitialize: true,
        initialValues: feeStuctureModalFilterState,
        onSubmit: (values) => { },
    });

    const { brchCurriculumResp, branchClassResp, brchSectionsResp, studentsListResp, getSiblingDetailsResp, currentBranchIdResp: branchId, currentInstIdResp: instituteId } =
        useAppSelector(({ branchAcademics, directoryStudent, appData }) => ({
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            brchSectionsResp: branchAcademics.brchSectionsResp,
            studentsListResp: directoryStudent.studentsListResp,
            getSiblingDetailsResp: directoryStudent.getSiblingDetailsResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,

        }), shallowEqual);

    function onInputSearchChange(inputString: any) {
        const { academicYearId, classId, curriculumId } = ObservationandInterviewerReportForm.values;
        if (inputString) {
            const params = {
                branchId, academicYearId, classId: classId,
                curriculumId: curriculumId, searchString: inputString,
            };
            dispatch(getStudentsListAct(generateActionPayload("get_students", undefined, params)));
        }
    }
    function selectedStudentHndlr(student: any) {
        setStudentDetails(student);
    }



    return (<>
        <div>
            <UploadStudent
                containerClass="tw-px-4 tw-py-3"
                uploadBtnText="Download Template"
            />

            <div className="tw-w-full tw-flex tw-justify-end tw-items-center tw-gap-2 tw-px-4 tw-mb-3">
                <Button
                    type="button"
                    onClick={props.toggle}
                    variant="secondary"
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                >
                    Upload
                </Button>
            </div>
        </div>
    </>
    );
};

export default PanelInterviewResultModal
