import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import TableContainer from '../../../../Components/Common/TableContainer';
import { AutoSearchInputUpdated, SelectInput, TextInput, } from '../../../../Components/Common';
import { calculateDaysDifference, generateColumnsUserDetails } from './helper';
import { shallowEqual, useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../hooks/storehook';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { Current_Date } from '../../../../utility/dateutility';
import classnames from "classnames"
import { nanoid } from 'nanoid';
import { getBookListReturnForEmployeeAct, getBookListReturnForRecommendAct, getBookListReturnForStudentAct, getBookReturnEmployeeListAct, getBookReturnListByAccessionNoAct, getBookReturnRecommendListAct, getBookReturnStuListAct, getLibraryBookReturnSaveListAct } from '../../../../store/library/bookreturn/bookreturnaction';
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct, setBrchClassAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { removeLeadingZeros } from '../../../../utility/commonutility';
import { getSectionList } from '../../../../store/academic/classroomManagment/classroommanagmentactions';
import { getLibraryBookCollectionListAct } from '../../../../store/library/bookcollection/bookcollectionaction';


const initialValues = {
    academicYearId: "",
    searchString: "",
    accessionNumber: "",
    curriculumId: "",
    classId: "",
    sectionId: ""
}

const UserDetails = (props: any) => {
    const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);

    const [filterState, setFilterState] = useState(initialValues);
    const { bookReturnForm, setStudentListState, updatedStudentData, setUpdatedStudentData, studentListState, searchStudentState, setSearchStudentState, setSearchEmployeeState, searchEmployeeState, searchRecommendedState, setSearchRecommendedState, setSearchAccessionNoState, searchAccessionNoState } = props || {};
    const dispatch = useDispatch();
    const libraryBookReturnSaveList = (otherProps?: any) => {
        const { userTypeId, libraryId, academicYearId } = bookReturnForm.values;
        const { classId, searchString, sectionId, accessionNumber } = filterState;
        let payload = { branchId, searchString, accessionNumber, classId: classId, sectionId, academicYearId, userTypeId, libraryId, pageNo: 0, pageSize: 20, ...otherProps }
        if (payload.userTypeId && payload.libraryId)
            dispatch(
                getLibraryBookReturnSaveListAct(
                    generateActionPayload("get_book_return_save_list", undefined, payload)
                )
            );
    }

    const {
        academicYearListResp,
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        brchCurriculumResp,
        sectionListResp,
        branchClassResp,
        getEmployeesByFilterResp,
        getBookReturnStuListResp,
        getBookReturnRecommendListResp,
        getBookReturnEmployeeListResp,
        getBookListReturnForStudentResp,
        getBookListReturnForEmployeeResp,
        getBookIssuanceUserTypeListResp,
        getBookListReturnForRecommendResp,
        getBookReturnListByAccessionNoResp,
        getBookReturnSaveResp,
        libraryBookCollectionRequestListResp,
    } = useAppSelector(
        ({ instAcademics, appData, branchAcademics, libraryBookIssuance, directoryEmployee, libraryBookReturn, libraryBookCollection, classroomManagmentInfo }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            sectionListResp: classroomManagmentInfo.sectionListResp,
            branchClassResp: branchAcademics.branchClassResp,
            getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
            getBookReturnStuListResp: libraryBookReturn.getBookReturnStuListResp,
            getBookReturnRecommendListResp: libraryBookReturn.getBookReturnRecommendListResp,
            getBookReturnEmployeeListResp: libraryBookReturn.getBookReturnEmployeeListResp,
            getBookListReturnForStudentResp: libraryBookReturn.getBookListReturnForStudentResp,
            getBookListReturnForEmployeeResp: libraryBookReturn.getBookListReturnForEmployeeResp,
            getBookIssuanceUserTypeListResp: libraryBookIssuance.getBookIssuanceUserTypeListResp,
            getBookListReturnForRecommendResp: libraryBookReturn.getBookListReturnForRecommendResp,
            getBookReturnListByAccessionNoResp: libraryBookReturn.getBookReturnListByAccessionNoResp,
            getBookReturnSaveResp: libraryBookReturn.getBookReturnSaveResp,
            libraryBookCollectionRequestListResp: libraryBookCollection.libraryBookCollectionRequestListResp,
        }),
        shallowEqual
    );

    const libraryShelvesRef = useRef({
        prevGetBookListReturnForStudentResp: getBookListReturnForStudentResp,
        prevGetBookListReturnForEmployeeResp: getBookListReturnForEmployeeResp,
        prevGetBookListReturnForRecommendResp: getBookListReturnForRecommendResp,
        prevGetBookReturnSaveResp: getBookReturnSaveResp,
        prevGetBookReturnListByAccessionNoResp: getBookReturnListByAccessionNoResp,
    })
    useEffect(() => {
        const { prevGetBookListReturnForStudentResp, prevGetBookListReturnForEmployeeResp, prevGetBookListReturnForRecommendResp, prevGetBookReturnListByAccessionNoResp } = libraryShelvesRef.current;

        const { fineAmtPerDay, detailType, classId } = bookReturnForm.values;

        const updateStudentListState = (response: any) => {

            let payload = {};

            if (response[0]?.employeeId) {
                payload = {
                    employeeName: response[0]?.employeeName,
                    employeeCode: response[0]?.employeeCode,
                    employeeId: response[0]?.employeeId,
                };
            } else {
                payload = {
                    nameOfThePerson: response[0]?.nameOfThePerson,
                };
            }

            if (!Array.isArray(response) && response?.bookId) {
                const updatedState = [{
                    matchId: nanoid(),
                    currentDate: Current_Date,
                    noOfLateDays: calculateDaysDifference(response?.returnDate),
                    bookCondition: '',
                    fine: Math.trunc(+fineAmtPerDay * calculateDaysDifference(response?.returnDate)) || '0',
                    totalAmount: Math.trunc(+fineAmtPerDay * calculateDaysDifference(response?.returnDate)) || '0',
                    bookPrice: Math.trunc(+response?.bookPrice) || '0',
                    bookId: response?.bookId,
                    bookName: response?.bookName,
                    authorName: response?.authorName,
                    publisherName: response?.publisherName,
                    accessionNumber: response?.accessionNumber,
                    issuanceDate: response?.issuanceDate,
                    returnDate: response?.returnDate,
                    libraryName: response?.libraryName,
                    ...payload,
                }];
                setStudentListState(updatedState);
                return;
            }

            if (Array.isArray(response)) {
                const updatedState = response.map((book: any) => ({
                    ...book,
                    matchId: nanoid(),
                    currentDate: Current_Date,
                    noOfLateDays: calculateDaysDifference(book?.returnDate),
                    bookCondition: '',
                    fine: Math.trunc(+fineAmtPerDay * calculateDaysDifference(book?.returnDate)) || '0',
                    totalAmount: Math.trunc(+fineAmtPerDay * calculateDaysDifference(book?.returnDate)) || '0',
                    bookPrice: Math.trunc(+book?.bookPrice) || '0',
                    ...payload,
                }));
                setStudentListState(updatedState);
            } else {
                setStudentListState([]);
            }
        };

        const responses = [
            { resp: getBookListReturnForStudentResp, prevResp: prevGetBookListReturnForStudentResp, keyName: 'student' },
            { resp: getBookListReturnForEmployeeResp, prevResp: prevGetBookListReturnForEmployeeResp, keyName: 'employee' },
            { resp: getBookListReturnForRecommendResp, prevResp: prevGetBookListReturnForRecommendResp, keyName: 'recommend' },
            { resp: getBookReturnListByAccessionNoResp, prevResp: prevGetBookReturnListByAccessionNoResp, keyName: 'accession' },
        ];

        for (const { resp, prevResp, keyName } of responses) {
            if (resp && prevResp !== resp) {
                if (keyName === 'accession') {
                    if (resp.books && Array.isArray(resp.books)) {
                        const transformedBooks = resp.books.map(book => ({
                            ...book,
                            employeeId: resp.employeeId,
                            employeeName: resp.employeeName,
                            employeeCode: resp.employeeCode,
                            nameOfThePerson: resp.nameOfThePerson,
                            studentId: resp.studentId,
                            studentName: resp.studentName,
                            studentCode: resp.studentCode
                        }));
                        updateStudentListState(transformedBooks);
                        break;
                    }
                } else if (Array.isArray(resp?.content)) {
                    updateStudentListState(resp.content);
                    break;
                }
            }
        }

        libraryShelvesRef.current.prevGetBookListReturnForStudentResp = getBookListReturnForStudentResp;
        libraryShelvesRef.current.prevGetBookListReturnForEmployeeResp = getBookListReturnForEmployeeResp;
        libraryShelvesRef.current.prevGetBookListReturnForRecommendResp = getBookListReturnForRecommendResp;
        libraryShelvesRef.current.prevGetBookReturnListByAccessionNoResp = getBookReturnListByAccessionNoResp

    }, [getBookListReturnForStudentResp, getBookListReturnForEmployeeResp, getBookListReturnForRecommendResp, getBookReturnListByAccessionNoResp])

    function onInputSearchChangeEmployee(inputString: any) {
        const { academicYearId, libraryId } = bookReturnForm.values;
        if (inputString && libraryId) {

            const params = {
                branchId, academicYearId, libraryId, searchString: inputString,
            };
            if (params.libraryId)
                dispatch(getBookReturnEmployeeListAct(generateActionPayload("get_book_return_employee_list", undefined, params)));
        }
    }

    function onInputSearchChangeRecommended(inputString: any) {
        const { academicYearId, libraryId, userType } = bookReturnForm.values;
        const data = getBookIssuanceUserTypeListResp?.find((item: any) => item.userType === userType)
        const params = {
            branchId, academicYearId, libraryId, userTypeId: data?.id
        };
        if (params.libraryId)
            dispatch(getBookReturnRecommendListAct(generateActionPayload("get_book_return_recommend_list", undefined, params)));
    }
    function onInputSearchChangeAccessionNo(inputString: any) {
        const { academicYearId, libraryId } = bookReturnForm.values;
        const params = {
            branchId, academicYearId, searchString: removeLeadingZeros(inputString), libraryId, sortBy: "accessionNumber", orderBy: "asc",
        };
        if (params.libraryId) {
            dispatch(getLibraryBookCollectionListAct(generateActionPayload("get_library_book_collection", undefined, params)))
        }

    }

    function emptySearchField(userType: string) {
        if (userType === "STUDENT") {
            setSearchStudentState(null);
            bookReturnForm.setFieldValue("studentId", "");
        }
        else if (userType === "EMPLOYEE") {
            setSearchEmployeeState(null);
            bookReturnForm.setFieldValue("employeeId", "");
        }
        else if (userType === "RECOMMENDATION") {
            setSearchRecommendedState(null);
            bookReturnForm.setFieldValue("recommendedId", "");
        }
        else if (userType === "ACCESSION_NO") {
            setSearchAccessionNoState(null);
            bookReturnForm.setFieldValue("accessionNumber", "");
        }
        setStudentListState([])
    }

    function getClassApiCall(curriculumId: string) {
        const payload = {
            pageNo: 0,
            pageSize: 100,
            sortBy: "classSequence",
            orderBy: "asc",
            curriculumId,
            branchId,
        };
        dispatch(
            getBranchClassAct(
                generateActionPayload("get_brch_curriculum_class", undefined, payload)
            )
        );
    }

    function getSectionApiCall(otherProps?: any) {
        const { academicYearId } = bookReturnForm.values;
        const { curriculumId, classId } = filterState;
        const payload = {
            branchId,
            branchClassId: classId,
            masterAcademicYearId: academicYearId,
            curriculumId,
            pageNo: 0,
            pageSize: 100,
            sortBy: "sectionName",
            orderBy: "asc",
            ...otherProps,
        }
        if (payload.branchClassId && payload.masterAcademicYearId) {
            dispatch(
                getSectionList(generateActionPayload("get_section_list", undefined, payload))
            )
        }
    }

    useEffect(() => {
        const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        const { userType } = bookReturnForm.values;

        if (userType === 'STUDENT') {
            libraryBookReturnSaveList();
        }
    }, [filterState, bookReturnForm.values]);

    const filterHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        pagination.current.pageNo = 0;
        if (name === "curriculumId") {
            getClassApiCall(value);
            setFilterState(prevState => ({ ...prevState, [name]: value, classId: "", sectionId: "", }));
        } else if (name === "classId") {
            getSectionApiCall({ branchClassId: value })
            setFilterState(prevState => ({ ...prevState, [name]: value, sectionId: "" }))
            libraryBookReturnSaveList({ [name]: value });
        }
        else {
            setFilterState((prev) => ({ ...prev, [name]: value }))
            libraryBookReturnSaveList({ [name]: value });
        }
    };

    const selectedEmployee = (employee: any) => {
        setSearchEmployeeState(employee);
        emptySearchField("ACCESSION_NO")
        if (!employee) {
            bookReturnForm.setValues((prevValue: any) => ({
                ...prevValue, employeeId: '',
            }));
        } else {

            const { academicYearId, libraryId } = bookReturnForm.values || {};
            const { employeeId, employeeCode } = employee || {};

            bookReturnForm.setValues((prevValue: any) => ({
                ...prevValue, employeeId,
            }));

            const payload = {
                branchId, academicYearId, libraryId, searchString: employeeCode
            }

            dispatch(getBookListReturnForEmployeeAct(generateActionPayload("get_book_list_emp_returns", undefined, payload)));

        }
    }

    const selectedRecommended = (employee: any) => {
        setSearchRecommendedState(employee);
        emptySearchField("ACCESSION_NO")
        if (!employee) {
            bookReturnForm.setValues((prevValue: any) => ({
                ...prevValue, recommendedId: '',
            }));
        } else {

            const { academicYearId, libraryId } = bookReturnForm.values || {};
            const { id, nameOfThePerson } = employee || {};

            bookReturnForm.setValues((prevValue: any) => ({
                ...prevValue, recommendedId: id,
            }));

            const payload = {
                branchId, academicYearId, libraryId, searchString: nameOfThePerson
            }

            dispatch(getBookListReturnForRecommendAct(generateActionPayload("get_book_list_recommend_returns", undefined, payload)));

        }
    }

    const selectedAccessionNo = (book: any) => {
        emptySearchField(bookReturnForm.values.userType)
        setSearchAccessionNoState(book);
        if (!book) {
            bookReturnForm.setValues((prevValue: any) => ({
                ...prevValue, accessionNumber: '',
            }));
        } else {

            const { academicYearId, libraryId, userTypeId } = bookReturnForm.values || {};
            const { id, accessionNumber } = book || {};

            bookReturnForm.setValues((prevValue: any) => ({
                ...prevValue, accessionNumber: id,
            }));
            const params = {
                libraryId, userTypeId, accessionNumber: accessionNumber, academicYearId, branchId,
            };
            if (params.libraryId)
                dispatch(getBookReturnListByAccessionNoAct(generateActionPayload("get_book_return_list_by_accession_no", undefined, params)));

        }
    }

    const onChangeInputHndlr = (matchId: any, value: any, name: any) => {
        const { userType } = bookReturnForm.values;
        if (userType === "STUDENT") {
            let stuList = updatedStudentData?.map((item: any) => {
                if (item.matchId === matchId) {
                    if (name === "bookCondition") {
                        return {
                            ...item,
                            [name]: value,
                            totalAmount: (value !== "Good" && value) ? (+item?.fine + +item?.bookPrice) : item?.fine
                        };
                    }
                    return { ...item, [name]: value };
                }
                return { ...item };
            });
            setUpdatedStudentData(stuList);
        } else if (userType === "EMPLOYEE" || userType === "RECOMMENDATION") {
            let newList = studentListState?.map((item: any) => {
                if (item.matchId === matchId) {
                    if (name === "bookCondition") {
                        return {
                            ...item,
                            [name]: value,
                            totalAmount: (value !== "Good" && value) ? (+item?.fine + +item?.bookPrice) : item?.fine
                        };
                    }
                    return { ...item, [name]: value };
                }
                return { ...item };
            });
            setStudentListState(newList);
        }
    }

    useEffect(() => {
        const { prevGetBookReturnSaveResp } = libraryShelvesRef.current;
        const { fineAmtPerDay, userType } = bookReturnForm.values;

        if (getBookReturnSaveResp && prevGetBookReturnSaveResp !== getBookReturnSaveResp) {
            if (userType === "STUDENT" && Array.isArray(getBookReturnSaveResp?.content)) {
                const updatedData: any[] = getBookReturnSaveResp.content.map((student: any) => ({
                    ...student,
                    studentId: student?.studentId,
                    matchId: nanoid(),
                    isSelected: false,
                    currentDate: Current_Date,
                    noOfLateDays: calculateDaysDifference(student?.returnDate),
                    bookCondition: "",
                    fine: Math.trunc((+fineAmtPerDay) * calculateDaysDifference(student?.returnDate)) || "0",
                    totalAmount: Math.trunc((+fineAmtPerDay) * calculateDaysDifference(student?.returnDate)) || "0",
                    bookPrice: Math.trunc(+student?.bookPrice) || "0",
                }));
                setUpdatedStudentData(updatedData);
            }
        }

        libraryShelvesRef.current.prevGetBookReturnSaveResp = getBookReturnSaveResp;

    }, [getBookReturnSaveResp]);


    const allStudentCheckHndlr = useCallback((event: any) => {
        const { userType } = bookReturnForm.values;
        const { checked } = event.target;
        setAllStudentSelectedState(checked);

        let updateStudentState: any = [];

        if (userType === "STUDENT") {
            updateStudentState = [...updatedStudentData];
            updateStudentState.forEach((item: any) => {
                item.isSelected = checked;
            });
            setUpdatedStudentData(updateStudentState);
        } else if (userType === "EMPLOYEE" || userType === "RECOMMENDATION") {
            updateStudentState = [...studentListState];
            updateStudentState.forEach((item: any) => {
                item.isSelected = checked;
            });
            setStudentListState(updateStudentState);
        }
    }, [updatedStudentData, studentListState, bookReturnForm.values.userType]);

    const singleStudentCheckHndlr = useCallback((event: any) => {
        const { userType } = bookReturnForm.values;
        const { checked } = event.currentTarget;
        const matchId = event.currentTarget.getAttribute("data-id");
        let updateStudentState = [];

        if (userType === "STUDENT") {
            const studentRowIndex = updatedStudentData.findIndex((item: any) => item.matchId === matchId);
            if (studentRowIndex > -1) {
                const studentDetails: any = updatedStudentData[studentRowIndex],
                    updateStudentState: any = [...updatedStudentData];
                updateStudentState.splice(studentRowIndex, 1, {
                    ...studentDetails, isSelected: checked,
                });
                setUpdatedStudentData(updateStudentState);
                const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
                setAllStudentSelectedState(isAllSelected);
            }
        } else if (userType === "EMPLOYEE" || userType === "RECOMMENDATION") {
            const studentRowIndex = studentListState.findIndex((item: any) => item.matchId === matchId);
            if (studentRowIndex > -1) {
                const studentDetails: any = studentListState[studentRowIndex],
                    updateStudentState: any = [...studentListState];
                updateStudentState.splice(studentRowIndex, 1, {
                    ...studentDetails, isSelected: checked,
                });
                setStudentListState(updateStudentState);
                const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
                setAllStudentSelectedState(isAllSelected);
            }
        }
    }, [updatedStudentData, studentListState, bookReturnForm.values.userType]);

    const menuOptions = useMemo(() => (
        [
            {
                id: "delete",
                actionIcon: <i className={classnames("ri-delete-bin-5-fill text-danger fs-16 ms-3")}></i>,
                actionName: "Delete",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    let newArray = studentListState.filter((_: any, index: number) => index !== +id);
                    setStudentListState(newArray)
                },
            }
        ]
    ), [studentListState])

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10,
    });


    const columns = useMemo(() => {
        const newColums = generateColumnsUserDetails(allStudentCheckHndlr, singleStudentCheckHndlr, allStudentSelectedState, menuOptions);
        const { userType } = bookReturnForm.values || {};
        return newColums.filter((item: any) => {
            const { accessor } = item;

            if (["studentName", "curriculumName", "className", "sectionName"].includes(accessor)) {
                return userType === "STUDENT";
            }

            if (accessor === "employeeName") {
                return userType === "EMPLOYEE";
            }

            if (["recommendedBy", "recommendedTo"].includes(accessor)) {
                return userType === "RECOMMENDATION";
            }

            return true;
        });
    }, [studentListState, updatedStudentData, getBookReturnSaveResp, getBookListReturnForStudentResp, bookReturnForm, getEmployeesByFilterResp, allStudentSelectedState]);


    function getBookDataByUserType() {
        const { userType } = bookReturnForm.values;
        let result = [];
        if (userType === "STUDENT") {
            result = updatedStudentData || [];
        } else if (["EMPLOYEE", "RECOMMENDATION", "ACCESSION_NO"].includes(userType)) {
            result = studentListState || [];
        }
        return result;
    }

    const bookData = getBookDataByUserType();

    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = branchClassResp || {};
    const { data: sectionTypes } = sectionListResp || {}

    return (
        <>
            <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-6 tw-gap-3">
                {bookReturnForm.values.userType === "STUDENT" && (
                    <>
                        <div className="lg:tw-col-span-1">
                            <TextInput
                                name="searchString"
                                formgroupClassName="tw-mb-0"
                                placeHolder="Student Name,Code..."
                                value={filterState.searchString}
                                onChange={filterHandler}
                                labelText="Search"
                            />
                        </div>
                        <div className="lg:tw-col-span-1">
                            <TextInput
                                name="accessionNumber"
                                formgroupClassName="tw-mb-0"
                                placeHolder="Search..."
                                value={filterState.accessionNumber}
                                onChange={filterHandler}
                                labelText="Accession Number"
                            />
                        </div>
                    </>
                )}
                {bookReturnForm.values.userType === "EMPLOYEE" && (
                    <>
                        <div className="lg:tw-col-span-2">
                            <AutoSearchInputUpdated
                                formgroupClassName="search-box"
                                name="employeeId"
                                placeHolder="Search..."
                                onChange={(string: any) => {
                                    if (!string) bookReturnForm.setFieldValue("employeeId", "");
                                    onInputSearchChangeEmployee(string);
                                }}
                                onBlur={bookReturnForm.handleBlur}
                                labelText="Employee"
                                valueKey="employeeId"
                                labelHeader="Employee Code"
                                labelKey="employeeCode"
                                subLabelHeader="Employee Name"
                                subLabelKey="employeeName"
                                options={getBookReturnEmployeeListResp || []}
                                selected={searchEmployeeState}
                                selectedOptionCallbck={selectedEmployee}
                                helperText="Note : Please perform the search after selecting the library."
                                invalid={bookReturnForm.touched.employeeId && bookReturnForm.errors.employeeId ? true : false}
                                error={bookReturnForm.touched.employeeId && bookReturnForm.errors.employeeId ? bookReturnForm.errors.employeeId : ""}
                            ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                        </div>
                        <div className="lg:tw-col-span-2">
                            <AutoSearchInputUpdated
                                formgroupClassName="search-box"
                                name="accessionNumber"
                                placeHolder="Search..."
                                onChange={(string: any) => {
                                    if (!string)
                                        bookReturnForm.setFieldValue("accessionNumber", "");
                                    onInputSearchChangeAccessionNo(string);
                                }}
                                labelText="Accession Number"
                                valueKey="id"
                                labelHeader="Acc. No"
                                labelKey="accessionNumber"
                                subLabelHeader="Book Name"
                                subLabelKey="title"
                                notKeyUpHndler={true}
                                options={Array.isArray(libraryBookCollectionRequestListResp?.content) ? libraryBookCollectionRequestListResp?.content : []}
                                selected={searchAccessionNoState}
                                selectedOptionCallbck={selectedAccessionNo}
                                helperText="Note : Please perform the search after selecting the library."
                            ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                        </div>
                    </>
                )}
                {bookReturnForm.values.userType === "RECOMMENDATION" && (
                    <>
                        <div className="lg:tw-col-span-2">
                            <AutoSearchInputUpdated
                                formgroupClassName="search-box"
                                name="recommendedId"
                                placeHolder="Search..."
                                onChange={(string: any) => {
                                    if (!string)
                                        bookReturnForm.setFieldValue("recommendedId", "");
                                    onInputSearchChangeRecommended(string);
                                }}
                                onBlur={bookReturnForm.handleBlur}
                                labelText="Recommended Person"
                                valueKey="id"
                                labelHeader="Person Name"
                                labelKey="nameOfThePerson"
                                subLabelHeader="Recommended Person"
                                subLabelKey="recommendedPerson"
                                options={getBookReturnRecommendListResp || []}
                                selected={searchRecommendedState}
                                selectedOptionCallbck={selectedRecommended}
                                helperText="Note : Please perform the search after selecting the library."
                                invalid={bookReturnForm.touched.recommendedId && bookReturnForm.errors.recommendedId ? true : false}
                                error={bookReturnForm.touched.recommendedId && bookReturnForm.errors.recommendedId ? bookReturnForm.errors.recommendedId : ""}
                            ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                        </div>
                        <div className="lg:tw-col-span-2">
                            <AutoSearchInputUpdated
                                formgroupClassName="search-box"
                                name="accessionNumber"
                                placeHolder="Search..."
                                onChange={(string: any) => {
                                    if (!string)
                                        bookReturnForm.setFieldValue("accessionNumber", "");
                                    onInputSearchChangeAccessionNo(string);
                                }}
                                labelText="Accession Number"
                                valueKey="id"
                                labelHeader="Acc. No"
                                labelKey="accessionNumber"
                                subLabelHeader="Book Name"
                                subLabelKey="title"
                                notKeyUpHndler={true}
                                options={Array.isArray(libraryBookCollectionRequestListResp?.content) ? libraryBookCollectionRequestListResp?.content : []}
                                selected={searchAccessionNoState}
                                selectedOptionCallbck={selectedAccessionNo}
                                helperText="Note : Please perform the search after selecting the library."
                            ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                        </div>
                    </>
                )}
                {bookReturnForm.values.userType === "STUDENT" && (
                    <>
                        <div>
                            <SelectInput
                                name="curriculumId"
                                value={filterState.curriculumId}
                                onChange={filterHandler}
                                menuItems={curriculumTypes}
                                valueKey="branchCurriculumId"
                                textKey="curriculumName"
                                labelText="Curriculum"
                                formgroupClassName="tw-mb-0"
                                defaultSelect="Curriculum"
                            />
                        </div>
                        <div>
                            <SelectInput
                                name="classId"
                                value={filterState.classId}
                                onChange={filterHandler}
                                menuItems={classTypes}
                                valueKey="id"
                                textKey="shortName"
                                labelText="Class"
                                formgroupClassName="tw-mb-0"
                                defaultSelect="Class"
                            />
                        </div>
                        <div>
                            <SelectInput
                                name="sectionId"
                                value={filterState.sectionId}
                                onChange={filterHandler}
                                menuItems={sectionTypes}
                                valueKey="sectionId"
                                textKey="sectionName"
                                labelText="Section"
                                formgroupClassName="tw-mb-0"
                                defaultSelect="Section"
                            />
                        </div>
                    </>
                )}
            </div>
            <div className="tw-mt-3">
                <TableContainer
                    columns={columns || []}
                    data={bookData || []}
                    tableClass="tw-mb-0 tw-mt-3"
                    divClass="tw-overflow-x-auto tw-mb-3"
                    theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                    showPagination={false}
                    onChangeInputHndlr={onChangeInputHndlr}
                />
            </div>
        </>
    )
}

export default UserDetails