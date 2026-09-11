import { useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { getSectionList, setSectionListAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { SelectInput } from "../../../Components/Common";
import { getAssignLanSectionListAct } from "../../../store/assignlanguages/assignlanguagesaction";
import { AdmissionType } from "./helper";


const initialValues = {
    admissionType: "",
};

const AdvanceFilterModal = (props: any) => {

    const [advanceFilterState, setAdvanceFilterState] = useState<any>(props.appliedFilter || initialValues);
    const dispatch = useAppDispatch();

    const {
        currentBranchIdResp: branchId,
        getAssignLanSectionListResp,
        getExaminationListResp,
    } = useAppSelector(
        ({ appData, classroomManagmentInfo, assignLanguages, examinationSettings }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            getAssignLanSectionListResp: assignLanguages.getAssignLanSectionListResp,
            getExaminationListResp: examinationSettings.getExaminationListResp,

        }),
        shallowEqual
    );

    const getSectionListResp = (otherProps?: any) => {
        let payload = { branchClassId: advanceFilterState.classId || null, masterAcademicYearId: advanceFilterState.academicYearId, curriculumId: advanceFilterState.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
        if (payload.branchClassId && payload.masterAcademicYearId) {
            dispatch(
                getAssignLanSectionListAct(
                    generateActionPayload("get_section_list", undefined, payload)
                )
            );
        }
    }

    useEffect(() => {
        const { academicYearId, curriculumId, classId } = props.appliedFilter || {};
        setAdvanceFilterState((prev: any) => ({
            ...prev,
            academicYearId,
            curriculumId,
            classId,
        }));
        if (academicYearId && curriculumId && classId) {
            getSectionListResp({ academicYearId, curriculumId, classId });
            dispatch(setSectionListAct(undefined));
        }
    }, [props.appliedFilter.academicYearId, props.appliedFilter.curriculumId, props.appliedFilter.classId]);

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === 'classId') {
            setAdvanceFilterState((prev: any) => ({ ...prev, [name]: value, sectionId: "" }))
            getSectionListResp({ branchClassId: value })
            if (!value) {
                dispatch(setSectionListAct(undefined))
            }
        } else {
            setAdvanceFilterState((prev: any) => ({ ...prev, [name]: value }))
        }
    }

    const applyFilterHndlr = () => {
        props.applyFilterCallback({ ...advanceFilterState });
        props.toggleAdvanceFilter();
    };

    const { data: sectionTypes } = getAssignLanSectionListResp || [];

    return (
        <>
            <div className="offcanvas-body">
                <div className='mb-3'>
                    <SelectInput
                        name="admissionType"
                        value={advanceFilterState.admissionType}
                        onChange={filterHandler}
                        menuItems={AdmissionType}
                        valueKey="value"
                        textKey="label"
                        formgroupClassName="mb-0"
                        labelText='Admission Type'
                    />
                </div>
            </div>
            <div className="border-top p-2 text-center">
                <div className="hstack gap-2 justify-content-end">
                    <button
                        type="submit"
                        onClick={applyFilterHndlr}
                        className="btn btn-success"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdvanceFilterModal;
