import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import TableContainer from '../../../../Components/Common/TableContainer';
import { generateColumnsUserDetails } from './helper';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '../../../../hooks/storehook';
import { Current_Date, getDateAfterCurrentDay } from '../../../../utility/dateutility';
import classnames from "classnames"
import { nanoid } from 'nanoid';
import { Delete02StrokeStandard } from '@hugeicons-pro/core-stroke-standard';
import { HugeiconsIcon } from '@hugeicons/react';
import Button from '../../../../Components/Common/Button';
import { ModalContainerUpdated } from '../../../../Components/Common';
import BookCollectionUploadModel from '../../BookCollectionUpload/BookCollectionUploadModel';
import { useModal } from '../../../../hooks/modalhook';

const UserDetails = (props: any) => {
    const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);

    const { bookIssuancesForm, setStudentListState, studentListState, isSpecimen, openBookCollectionUploadModal, closeBookCollectionUploadModal, bookCollectionUploadState } = props || {};

    const {
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        studentsListResp,
        getEmployeesByFilterResp,
        libraryBookCollectionRequestListResp,
    } = useAppSelector(
        ({ instAcademics, appData, directoryStudent, libraryBookCollection, branchAcademics, classroomManagmentInfo, directoryEmployee }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            studentsListResp: directoryStudent.studentsListResp,
            getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
            libraryBookCollectionRequestListResp: libraryBookCollection.libraryBookCollectionRequestListResp,
        }),
        shallowEqual
    );

    const libraryShelvesRef = useRef({
        prevStudentsListResp: studentsListResp,
    })
    useEffect(() => {
        const { prevStudentsListResp, } = libraryShelvesRef.current;
        if (studentsListResp && prevStudentsListResp !== studentsListResp) {
            if (bookIssuancesForm.values.detailType === "Class Wise Details" && bookIssuancesForm.values.classId && Array.isArray(studentsListResp?.data)) {
                setStudentListState(studentsListResp?.data?.map((student: any, index: number) => ({ ...student, studentId: student?.studentId, matchId: nanoid(), isSelected: false, bookName: "", authorName: "", publisherName: "", issuanceDate: Current_Date, returnDate: getDateAfterCurrentDay(7) })))
            }
        }
        libraryShelvesRef.current.prevStudentsListResp = studentsListResp;

    }, [studentsListResp,])

    useEffect(() => {
        if(bookIssuancesForm.values.userType){
            setAllStudentSelectedState(true)
        }
    }, [bookIssuancesForm.values.userType])

    const onChangeInputHndlr = (name: string, book?: any, matchId?: any) => {
        let newList = [];
        if (["issuanceDate"].includes(name)) {
            newList = studentListState?.map((item: any) =>
                item.matchId === matchId
                    ? { ...item, [name]: book }
                    : item
            );
 
            setStudentListState(newList);
            return;
        }
 
        if (["accession", "employee", "recommendedTo", "student"].includes(name)) {
            newList = studentListState?.map((item: any) => {
                if (item.matchId === matchId) {
                    switch (name) {
                        case "accession":
                            return book
                                ? { ...item, bookName: book.title, authorName: book.author, publisherName: book.publisherName, bookId: book.id, accessionNumber: book.accessionNumber, title: book.title }
                                : { ...item, bookName: "", authorName: "", publisherName: "", bookId: "", accessionNumber: "", title: "" };
                        case "employee":
                            return book
                                ? { ...item, ...book, employeeId: book.id }
                                : { ...item, employeeCode: "", employeeName: "", employeeId: "" };
                        case "student":
                            return book
                                ? { ...item, ...book, studentId: book.studentId }
                                : { ...item, studentCode: "", studentName: "", studentId: "" };
                        case "recommendedTo":
                            return { ...item, recommendedTo: book };
                        default:
                            return item;
                    }
                } else {
                    return item;
                }
            });
        }
 
        setStudentListState(newList);
    };

    const addNewHndlr = () => {
        setStudentListState([...studentListState, { matchId: nanoid(), isSelected: true, bookName: "", authorName: "", publisherName: "", issuanceDate: Current_Date, returnDate: getDateAfterCurrentDay(+bookIssuancesForm.values.returnDays) }])
    }

    const allStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.target;
        setAllStudentSelectedState(checked);
        let updateStudentState = [...studentListState];
        updateStudentState.forEach((item: any) => {
            item.isSelected = checked;
        });
        setStudentListState(updateStudentState);
    }, [studentListState]);

    const singleStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.currentTarget,
            matchId = event.currentTarget.getAttribute("data-id"),
            studentRowIndex = studentListState.findIndex((item: any) => item.matchId === matchId);
        if (studentRowIndex > -1) {
            const studentDetails: any = studentListState[studentRowIndex];
            let updateStudentState: any = [...studentListState];
            updateStudentState.splice(studentRowIndex, 1, {
                ...studentDetails, isSelected: checked,
            });
            setStudentListState(updateStudentState);
            const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
            setAllStudentSelectedState(isAllSelected);
        }
    }, [studentListState]);

    const menuOptions = useMemo(() => (
        [
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-ml-3 tw-text-red-500" size={18} />,
                actionName: "Delete",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    let newArray = studentListState.filter((_: any, index: number) => index !== +id);
                    setStudentListState(newArray)
                },
            }
        ]
    ), [studentListState])

    const columns = useMemo(() => {
        const newColums = generateColumnsUserDetails(allStudentCheckHndlr, singleStudentCheckHndlr, allStudentSelectedState, menuOptions);
        const { userType } = bookIssuancesForm.values || {};
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
    }, [libraryBookCollectionRequestListResp, studentListState, bookIssuancesForm, getEmployeesByFilterResp, allStudentSelectedState, studentsListResp]);
    
    return (
        <>
            <div className="tw-flex tw-flex-col tw-gap-3">
                <div className="tw-w-full">
                    <TableContainer
                        columns={columns || []}
                        data={studentListState || []}
                        tableClass="tw-mb-0 tw-mt-3"
                        divClass="tw-overflow-x-auto tw-mb-3"
                        theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                        showPagination={false}
                        onChangeInputHndlr={onChangeInputHndlr}
                        rowDataInfo={{
                            bookList: libraryBookCollectionRequestListResp?.content || [],
                            values: bookIssuancesForm.values,
                            branchId,
                            employeeList: getEmployeesByFilterResp || [],
                            studentList: studentsListResp?.data || [],
                            isSpecimen,
                            openModal: openBookCollectionUploadModal
                        }}
                    />
                </div>
                {bookIssuancesForm.values.userType && (
                    <div className="tw-self-start">
                        <Button type="button" variant="soft" onClick={() => addNewHndlr()}>Add New</Button>
                    </div>
                )}
            </div>
            
                <ModalContainerUpdated
                    id="book-collection"
                    isOpen={bookCollectionUploadState.showModal}
                    toggle={closeBookCollectionUploadModal}
                    modalTitle={bookCollectionUploadState.modalData ? "Edit Book Collection" : "Add Book Collection"}
                    modalSize="xl"
                  >
                    <BookCollectionUploadModel
                      id={bookCollectionUploadState.modalData}
                      isOpen={false}
                      toggle={closeBookCollectionUploadModal}
                      modalTitle="Book Collection"
                    />
                  </ModalContainerUpdated>
        </>
    )
}

export default UserDetails