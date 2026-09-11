import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getSectionList, setSectionListAct } from "../../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { DateInput, SelectInput } from "../../../../Components/Common";

const initialValues = {
    searchString: "",
    academicYearId: "",
    classId: "",
    sectionId: "",
    examinationId: "",
};

const AdvanceFilterModal = (props: any) => {
    
    const [advanceFilterState, setAdvanceFilterState] = useState<any>(props.appliedFilter || initialValues);
    const dispatch = useAppDispatch();

    const {
        currentBranchIdResp: branchId,
        sectionListResp,
    } = useAppSelector(
        ({ appData, classroomManagmentInfo, }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            sectionListResp: classroomManagmentInfo.sectionListResp,
        }),
        shallowEqual
    );

    const getSectionListResp = (otherProps?: any) => {
        let payload = { branchClassId: advanceFilterState.classId || null, masterAcademicYearId: advanceFilterState.academicYearId, curriculumId: advanceFilterState.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
        if (payload.branchClassId && payload.masterAcademicYearId) {
            dispatch(
                getSectionList(
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
    
    const { data: sectionTypes } = sectionListResp || [];

    return (
        <>
            <div className="offcanvas-body">
                <div className='mb-3'>
                    <SelectInput
                        name="sectionId"
                        value={advanceFilterState.sectionId}
                        onChange={filterHandler}
                        menuItems={sectionTypes}
                        valueKey="sectionId"
                        textKey="sectionName"
                        formgroupClassName="mb-0"
                        defaultSelect="Section"
                        labelText='Section'
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
