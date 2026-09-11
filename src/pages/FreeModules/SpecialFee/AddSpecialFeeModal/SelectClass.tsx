
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { InputCheckbox
} from "../../../../Components/Common";
import NoDataComp from "../../../../Components/Common/NoDataComp";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
    getBranchClassAct,
} from "../../../../store/branchsettings/branchacademics/branchacademicsactions";


const SelectClass = ({ curriculumId,
    branchId,
    selectedClassId, selectedClassCallback, academicYearId }: any) => {

    const [classListState, setClassListState] = useState<any>([]);
    const [selectAllStudentState, setSelectAllStudentState] = useState(false);
    const [selectedClassIdState, setSelectedClassIdState] = useState<any>({});
    const selectedClassIdsRef = useRef<any>([]);

    const dispatch = useAppDispatch();
    const { branchClassResp } =
        useAppSelector(({ branchAcademics }) => ({
            branchClassResp: branchAcademics.branchClassResp,
        }), shallowEqual);

    useEffect(() => {
        const { content } = branchClassResp || {};
        if (Array.isArray(content)) {
            const classData = JSON.parse(JSON.stringify(content));
            const updatedClassListState = classData.map((item: any) => {
                if (selectedClassIdState[item.id]) {
                    return Object.assign(item, { selected: true });
                }
                return item;
            });
            setClassListState(updatedClassListState);
            updateSelectedAllHndlr(updatedClassListState);
        }
    }, [branchClassResp, selectedClassIdState]);

    useEffect(() => {
        if (Array.isArray(selectedClassId) && selectedClassId.length > 0 && selectedClassId !== selectedClassIdsRef.current) {
            const updatedSelectedClassId = selectedClassId.reduce((data: any, item: any) => {
                data[item] = true;
                return data;
            }, {});
            setSelectedClassIdState(updatedSelectedClassId);
            selectedClassIdsRef.current = selectedClassId;
        }
    }, [selectedClassId]);

    useEffect(() => {
        if (curriculumId) {
            setClassListState([]);
            selectedClassIdsRef.current = [];
            getClassesApiCall();
        }
    }, [curriculumId]);

    function selectAllClassHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked } = event.target;
        if (checked) {
            if (Array.isArray(classListState)) {
                const updateSelectedClassIdState: any = classListState.reduce((updatedInfo, item) => {
                    updatedInfo[item.id] = true;
                    return updatedInfo;
                }, {});
                const selectIdList = Object.keys(updateSelectedClassIdState);
                setSelectedClassIdState(updateSelectedClassIdState);
                selectedClassIdsRef.current = selectIdList;
                selectedClassCallback(selectIdList);
            }
        } else {
            setSelectedClassIdState({});
            selectedClassIdsRef.current = [];
            selectedClassCallback([]);
        }
        setSelectAllStudentState(checked);
        // const { checked } = event.target;
        // setSelectAllStudentState(checked);
        // const updatedClassListState = [...classListState];
        // updatedClassListState.forEach((item: any) => {
        //     item.selected = checked;
        // });
        // setClassListState(updatedClassListState);
    }

    function updateSelectedAllHndlr(classList: any) {
        const isAnyUnselected = classList.some((item: any) => !item.selected);
        setSelectAllStudentState(!isAnyUnselected);
    }

    function onSelectClassHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked } = event.target,
            classId: any = event.target.getAttribute("data-id");
        if (classId) {
            const updatedSelectedClassIdState: any = { ...selectedClassIdState };
            if (checked) {
                Object.assign(updatedSelectedClassIdState, { [classId]: true });
            } else {
                delete updatedSelectedClassIdState[classId];
            }
            const selectIdList = Object.keys(updatedSelectedClassIdState);
            setSelectedClassIdState(updatedSelectedClassIdState);
            selectedClassIdsRef.current = selectIdList;
            selectedClassCallback(selectIdList);
        }
    }

    function getClassesApiCall() {
        const payload = { curriculumId: curriculumId, branchId, academicYearId, pageNo: 0, pageSize: 100 };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }


    return (
        <>
            <label htmlFor="" className="form-label required">Select Classes</label>
            <div className="tw-border tw-border-[#CED4DA] tw-rounded-md tw-p-3">
                <div className="tw-mb-3">
                    <InputCheckbox
                        name="selectAllStudent"
                        labelName="Select All"
                        value={selectAllStudentState}
                        onChange={selectAllClassHndlr}
                    />
                </div>

                <div className="tw-h-[200px] tw-max-h-[200px] tw-overflow-y-auto tw-overflow-x-hidden">
                    {classListState &&
                        classListState.map((item: any) => (
                            <div key={item.id} className="tw-w-full">
                                <InputCheckbox
                                    name={`class-${item.id}`}
                                    labelName={item.shortName}
                                    value={item.selected}
                                    onChange={onSelectClassHndlr}
                                    dataId={item.id}
                                />
                            </div>
                        ))}

                    {classListState.length === 0 && (
                        <NoDataComp helperText="Select curriculum to get the classes." />
                    )}
                </div>
            </div>
</>
    )
}

export default React.memo(SelectClass);