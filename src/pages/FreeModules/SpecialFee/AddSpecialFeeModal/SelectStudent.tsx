
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
    TextInput,
    UserDetails, InputCheckbox
} from "../../../../Components/Common";
import NoDataComp from "../../../../Components/Common/NoDataComp";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
    setStudentsListAct,
    setStudentsIdsListAct,
    getStudentsListAct,
    getStudentsIDsListAct,

} from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { toast } from "react-toastify";

//Utility
import { debounce } from "../../../../utility/commonutility";


const SelectStudent = ({ academicYearId, curriculumId,
    classId,
    branchId,
    selectedStudentId, selectedStudentCallback }: any) => {
    const [searchStudentListState, setSearchStudentListState] = useState<any>([]);
    const [selectAllStudentState, setSelectAllStudentState] = useState(false);
    const [currentPageSizeState, setCurrentPageSizeState] = useState<any>(10);
    const [totalStudentCountState, setTotalStudentCountState] = useState(0);
    const [selectedStudentIdState, setSelectedStudentIdState] = useState<any>({});
    const [isLoadingState, setIsLoadingState] = useState(false);
    const [searchStudentState, setSearchStudentState] = useState("");
    const selectedStudentIdsRef = useRef<any>([]);
    const totalStudentIdRef = useRef<any>([]);
    const dispatch = useAppDispatch();
    const { studentsListResp, studentsIdsListResp,
        studentManagementErrorResp } =
        useAppSelector(({ directoryStudent }) => ({
            studentsListResp: directoryStudent.studentsListResp,
            studentsIdsListResp: directoryStudent.studentsIdsListResp,
            studentManagementErrorResp: directoryStudent.studentManagementErrorResp,
        }), shallowEqual);

    const createAccountRespRef = useRef<any>({
        prevStudentsListResp: studentsListResp,
        prevStudentManagementErrorResp: studentManagementErrorResp,
    });

    useEffect(() => {
        const { prevStudentManagementErrorResp } = createAccountRespRef.current;
        if (studentManagementErrorResp && prevStudentManagementErrorResp !== studentManagementErrorResp) {
            const { details } = studentManagementErrorResp;
            toast.error(details || "Something went wrong.");
            setIsLoadingState(false);
        }
    }, [studentManagementErrorResp]);

    useEffect(() => {
        dispatch(setStudentsIdsListAct(undefined));
    }, []);

    useEffect(() => {
        if (branchId && curriculumId && academicYearId && classId) {
            const params = {
                branchId, academicYearId, curriculumId,
                classId,
                pageNo: 0, pageSize: 2000,
            };
            dispatch(getStudentsIDsListAct(generateActionPayload("get_students", undefined, params)));
            setCurrentPageSizeState(10);
            getStudentApiCall({ pageSize: 10 });
            resetState();
        } else {
            dispatch(setStudentsListAct(undefined));
            dispatch(setStudentsIdsListAct(undefined));
            resetState();
        }
    }, [academicYearId, curriculumId, branchId, classId]);

    function resetState() {
        setSearchStudentListState([]);
        setSelectAllStudentState(false);
        setSelectedStudentIdState({});
        selectedStudentIdsRef.current = [];
        setTotalStudentCountState(0);
        setCurrentPageSizeState(10);
        setSearchStudentState("");
        dispatch(setStudentsListAct(undefined));
        dispatch(setStudentsIdsListAct(undefined));
    }

    useEffect(() => {
        const { data, totalRecords } = studentsIdsListResp || {};
        if (Array.isArray(data)) {
            const allStudentIds = data.map(item => item.studentId);
            totalStudentIdRef.current = allStudentIds;
            setTotalStudentCountState(totalRecords);
        }
    }, [studentsIdsListResp]);

    useEffect(() => {
        const { data } = studentsListResp || {};
        if (Array.isArray(data)) {
            const studentData = JSON.parse(JSON.stringify(data));
            const updateStudentList = studentData.map((item: any) => {
                if (selectedStudentIdState[item.studentId]) {
                    return Object.assign(item, { selected: true });
                }
                return item;
            });
            setSearchStudentListState(updateStudentList);
            updateSelectedAllHndlr();
        }
        setIsLoadingState(false);
    }, [studentsListResp, selectedStudentIdState]);

    useEffect(() => {
        if (Array.isArray(selectedStudentId) && selectedStudentId.length > 0 && selectedStudentId !== selectedStudentIdsRef.current) {
            const studentIds = selectedStudentId.reduce((data: any, item: any) => {
                data[item] = true;
                return data;
            }, {});
            setSelectedStudentIdState(studentIds);
            selectedStudentIdsRef.current = selectedStudentId;
        }
    }, [selectedStudentId]);


    function searchStudentByNameHndlr(searchValue: any) {
        getStudentApiCall({ searchString: searchValue });
        setIsLoadingState(true);
    }

    const debouncedHandler = useCallback(debounce(searchStudentByNameHndlr, 500), [
        branchId, academicYearId, curriculumId , classId
    ]);
    function searchFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        // setSearchFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        setSearchStudentState(value);
        if (academicYearId && curriculumId && classId) {
            debouncedHandler(value);
            setCurrentPageSizeState(10);
        }
    }

    function selectAllStudentHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked } = event.target;
        if (checked) {
            if (Array.isArray(totalStudentIdRef.current) && totalStudentIdRef.current.length > 0) {
                const updateSelectedStudentIdState: any = totalStudentIdRef.current.reduce((updatedInfo, item) => {
                    updatedInfo[item] = true;
                    return updatedInfo;
                }, {});
                const selectIdList = Object.keys(updateSelectedStudentIdState);
                setSelectedStudentIdState(updateSelectedStudentIdState);
                selectedStudentIdsRef.current = selectIdList;
                selectedStudentCallback(selectIdList);
            }
        } else {
            setSelectedStudentIdState({});
            selectedStudentIdsRef.current = [];
            selectedStudentCallback([]);
        }
        setSelectAllStudentState(checked);
    }

    function updateSelectedAllHndlr() {
        if (Array.isArray(selectedStudentIdsRef.current) && totalStudentCountState && (selectedStudentIdsRef.current.length === totalStudentCountState)) {
            setSelectAllStudentState(true);
        } else {
            setSelectAllStudentState(false);
        }
    }

    function onSelectStudentHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked } = event.target,
            studentId = event.target.getAttribute("data-id");
        if (studentId) {
            const updateSelectedStudentIdState: any = { ...selectedStudentIdState };
            if (checked) {
                Object.assign(updateSelectedStudentIdState, { [studentId]: true });
            } else {
                delete updateSelectedStudentIdState[studentId];
            }
            const selectIdList = Object.keys(updateSelectedStudentIdState);
            setSelectedStudentIdState(updateSelectedStudentIdState);
            selectedStudentIdsRef.current = selectIdList;
            // updateSelectedAllHndlr();
            selectedStudentCallback(selectIdList);
        }
    }

    function handleScroll(event: any) {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        if (((scrollHeight - scrollTop) - clientHeight) <= 1 && academicYearId && curriculumId && classId) {
            const nextPageSize = currentPageSizeState + 10;
            if (currentPageSizeState === totalStudentCountState) {
                return;
            }
            if (nextPageSize > totalStudentCountState) {
                setCurrentPageSizeState(totalStudentCountState);
                getStudentApiCall({ pageSize: totalStudentCountState });
            } else {
                setCurrentPageSizeState(nextPageSize);
                getStudentApiCall({ pageSize: nextPageSize });
            }
            setIsLoadingState(true);
        }

    }

    function getStudentApiCall(otherProps?: any) {
        const { pageSize, ...otherFilters } = otherProps || {};
        const params = {
            branchId, academicYearId, curriculumId,
            classId,
            searchString: searchStudentState,
            ...otherFilters,
            pageNo: 0, pageSize: pageSize || currentPageSizeState,
        };
        dispatch(getStudentsListAct(generateActionPayload("get_students", undefined, params)));
    }

    return (
        <>
            <label htmlFor="" className="form-label required">Select Students</label>
            <div className="tw-border tw-border-[#CED4DA] tw-rounded-md tw-p-3">
                <div className="search-box">
                    <TextInput
                        name="searchString"
                        value={searchStudentState}
                        onChange={searchFilterHndlr}
                        formgroupClassName="tw-mb-0"
                        placeHolder="Search..."
                    />
                    <i className="ri-search-line search-icon"></i>
                </div>

                <div className="tw-my-3 tw-flex tw-items-center tw-justify-between">
                    <InputCheckbox
                        name="selectAllStudent"
                        labelName="Select All"
                        value={selectAllStudentState}
                        onChange={selectAllStudentHndlr}
                    />

                    <span>
                        <span className="tw-font-semibold tw-mr-1">Total:</span>
                        <span>{totalStudentCountState}</span>
                    </span>
                </div>

                <div className="tw-relative">
                    <div
                        onScroll={handleScroll}
                        className="tw-h-[200px] tw-max-h-[200px] tw-overflow-y-auto tw-overflow-x-hidden"
                    >
                        {searchStudentListState &&
                            searchStudentListState.map((student: any) => {
                                const { studentImageBase64 } = student;
                                const imageBaseUrl = studentImageBase64
                                    ? `data:image/jpeg;base64, ${studentImageBase64}`
                                    : "";

                                return (
                                    <div
                                        key={`student-${student?.studentId}`}
                                        className="tw-flex tw-items-center tw-border-b tw-border-gray-200 tw-mb-2 tw-pb-2"
                                    >
                                        <InputCheckbox
                                            name={`checkbox-${student?.studentId}`}
                                            value={student.selected}
                                            onChange={onSelectStudentHndlr}
                                            dataId={student?.studentId}
                                        />

                                        <UserDetails
                                            imageUrl={imageBaseUrl}
                                            displayName={student?.studentName}
                                            displayId={student?.studentCode}
                                            size="xs"
                                            defaultImgType="student"
                                        />
                                    </div>
                                );
                            })}

                        {searchStudentListState.length === 0 && (
                            <NoDataComp
                                helperText="Select academic year, curriculum id, class id to get the student list."
                            />
                        )}
                    </div>

                    {isLoadingState && (
                        <div className="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-white/60">
                            <div className="tw-h-6 tw-w-6 tw-animate-spin tw-rounded-full tw-border-2 tw-border-blue-600 tw-border-t-transparent" />
                        </div>
                    )}
                </div>
            </div>
</>
    )
}

export default React.memo(SelectStudent);