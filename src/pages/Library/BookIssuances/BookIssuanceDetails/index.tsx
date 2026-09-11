import { useFormik } from "formik";
import AccordionCardBody from "../../../../Components/Common/AccordionCardBody";
import AccordionCardHeader from "../../../../Components/Common/AccordionCardHeader";
import AccordionCardItem from "../../../../Components/Common/AccordionCardItem";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import UncontrolledAccordionCard from "../../../../Components/Common/UncontrolledAccordionCard";
import { useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import Issuances from "./Issuances";
import { getLibraryDetailsListAct, getLibraryLanguageListAct, getLibraryRecordListAct } from "../../../../store/library/settings/librarysettingsaction";
import UserDetails from "./UserDetails";
import { getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { computeSubmitButtonError, getUserTypeId } from "./helper";
import {  getBookIssuanceUserTypeListAct, saveLibraryBookIssuanceAct, setBookIssuanceUserTypeListAct } from "../../../../store/library/bookissuance/bookissuanceaction";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { nanoid } from "nanoid";
import { Current_Date, getDateAfterCurrentDay } from "../../../../utility/dateutility";
import Button from "../../../../Components/Common/Button";
import { useModal } from "../../../../hooks/modalhook";

const initialValues = {
    academicYearId: "",
    academicYearName: "",
    curriculumId: "",
    userType: "",
    detailType: "Student Wise details",
    studentId: "",
    classId: "",
    className: "",
    sectionId: "",
    sectionName: "",
    libraryId: "",
    recordTypeId: "",
    employeeId: "",
    designation: "",
    department: "",
    returnDays: null,

    recommendedPerson: "",
    personName: "",
};

const validationSchema = Yup.object().shape({
    libraryId: Yup.string().required("Library is required.").nullable(),
    recordTypeId: Yup.string().required("Record is required.").nullable(),
    userType: Yup.string().required("User Type is required.").nullable(),

})

const BookIssuanceDetails = () => {

    const dispatch = useAppDispatch();
    const history = useHistory();
    const [studentListState, setStudentListState] = useState<any>([])
  const { closeModal: closeBookCollectionUploadModal, modalState: bookCollectionUploadState, openModal: openBookCollectionUploadModal } = useModal();

    const bookIssuancesForm = useFormik({
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {

            const submitButtonError = computeSubmitButtonError(studentListState, values.userType)
            if (submitButtonError === undefined || submitButtonError) {
                toast.warning("Please add all the required fields");
            }
            else {
                const { academicYearId, libraryId, userType } = values;
                const payload: any = {
                    branchId, academicYearId, libraryId,
                    userTypeId: getUserTypeId(userType, getBookIssuanceUserTypeListResp),
                }
                if (userType === "STUDENT") {
                    payload.students = studentListState?.map((item: any) => {
                        if (item?.isSelected) {
                            return {
                                studentId: item?.studentId,
                                bookId: item?.bookId,
                                issuanceDate: item?.issuanceDate,
                                returnDate: item?.returnDate,
                                classId: item?.classId,
                                curriculumId: item?.curriculumId,
                                // sectionId: item?.sectionId,
                            }
                        }
                        return null
                    })?.filter((f: any) => f)
                }
                else if (userType === "EMPLOYEE") {
                    payload.employees = studentListState?.map((item: any) => {
                        if (item?.isSelected) {
                            return {
                                employeeId: item?.employeeId,
                                bookId: item?.bookId,
                                issuanceDate: item?.issuanceDate,
                                returnDate: item?.returnDate,
                            }
                        }
                        return null
                    })?.filter((f: any) => f)
                }
                else if (userType === "RECOMMENDATION") {
                    payload.recommended = studentListState?.map((item: any) => {
                        if (item?.isSelected) {
                            return {
                                bookId: item?.bookId,
                                recommendedTo: item?.recommendedTo,
                                recommendedBy: item?.employeeName,
                                issuanceDate: item?.issuanceDate,
                                returnDate: item?.returnDate,
                            }
                        }
                        return null
                    })?.filter((f: any) => f)
                }

                if (studentListState?.some((item: any) => item?.isSelected)) {
                    dispatch(saveLibraryBookIssuanceAct(generateActionPayload("save_library_book_issuance", undefined, payload)));
                } else {
                    toast.warning(`Please select atleast one ${userType}`);
                }
            }

        },
    });

    const {
        academicYearListResp,
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        saveLibraryBookIssuanceResp,
        showApiLoader,
        getBookIssuanceUserTypeListResp,
        saveLibraryBookCollectionResp,
        libraryRecordRequestListResp,
        libraryBookIssuanceErrorAct,
        libraryBookCollectionErrorAct,
    } = useAppSelector(
        ({ instAcademics, appData, librarysettings, libraryBookIssuance, globalData, libraryBookCollection }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            saveLibraryBookIssuanceResp: libraryBookIssuance.saveLibraryBookIssuanceResp,
            saveLibraryBookCollectionResp: libraryBookCollection.saveLibraryBookCollectionResp,
            getBookIssuanceUserTypeListResp: libraryBookIssuance.getBookIssuanceUserTypeListResp,
            libraryRecordRequestListResp: librarysettings.libraryRecordRequestListResp,
            libraryBookIssuanceErrorAct: libraryBookIssuance.libraryBookIssuanceErrorAct,
            libraryBookCollectionErrorAct: libraryBookCollection.libraryBookCollectionErrorAct,
            showApiLoader: globalData.showApiLoader,
        }),
        shallowEqual
    );

    const libraryShelvesRef = useRef({
        prevSaveLibraryBookIssuanceResp: saveLibraryBookIssuanceResp,
        prevGetBookIssuanceUserTypeListResp: getBookIssuanceUserTypeListResp,
        prevLibraryRecordRequestListResp: libraryRecordRequestListResp,
        prevSaveLibraryBookCollectionResp: saveLibraryBookCollectionResp,
        prevLibraryBookIssuanceErrorAct: libraryBookIssuanceErrorAct,
        prevLibraryBookCollectionErrorResp: libraryBookCollectionErrorAct,
    })
    useEffect(() => {
        const { prevSaveLibraryBookIssuanceResp, prevGetBookIssuanceUserTypeListResp, prevLibraryRecordRequestListResp, prevSaveLibraryBookCollectionResp, prevLibraryBookIssuanceErrorAct, prevLibraryBookCollectionErrorResp } = libraryShelvesRef.current;

        if (saveLibraryBookCollectionResp && prevSaveLibraryBookCollectionResp !== saveLibraryBookCollectionResp) {
            console.log('saveLibraryBookCollectionResp && prevSaveLibraryBookCollectionResp !== saveLibraryBookCollectionResp', saveLibraryBookCollectionResp && prevSaveLibraryBookCollectionResp !== saveLibraryBookCollectionResp);

            toast.success("Book Collection added successfully.");
            closeBookCollectionUploadModal();
        } else if (libraryBookIssuanceErrorAct && prevLibraryBookIssuanceErrorAct !== libraryBookIssuanceErrorAct) {
            const { details } = libraryBookIssuanceErrorAct || {}
            toast.error(details || "Something went wrong")
        }
        else if (saveLibraryBookIssuanceResp && prevSaveLibraryBookIssuanceResp !== saveLibraryBookIssuanceResp) {
            toast.success("Book issued successfully")
            history.push("/library-book-issuance")
        }
        else if (libraryRecordRequestListResp && prevLibraryRecordRequestListResp !== libraryRecordRequestListResp) {
            if (Array.isArray(libraryRecordRequestListResp?.content) && libraryRecordRequestListResp.content.length > 0) {
                const bookRecord = libraryRecordRequestListResp.content.find((item: any) => item.recordType === "BOOK");
                if (!bookIssuancesForm.values.recordTypeId && bookRecord) {
                    bookIssuancesForm.setFieldValue("recordTypeId", bookRecord.id);
                    userList({ recordTypeId: bookRecord.id });
                }
            }
        }
        else if (Array.isArray(getBookIssuanceUserTypeListResp) && getBookIssuanceUserTypeListResp.length > 0) {
            const selectedUserType = bookIssuancesForm.values.userType || "STUDENT";

            const data =
                getBookIssuanceUserTypeListResp.find(
                    (item: any) => item?.userType === selectedUserType
                ) || getBookIssuanceUserTypeListResp[0];

            const maximumDays = data?.maximumDays ?? 0;
            bookIssuancesForm.setFieldValue("userType", data?.userType);
            bookIssuancesForm.setFieldValue("returnDays", maximumDays);
            setStudentListState([{
                matchId: nanoid(),
                isSelected: true,
                bookName: "",
                authorName: "",
                publisherName: "",
                issuanceDate: Current_Date,
                returnDate: getDateAfterCurrentDay(maximumDays),
            }]);
        }
        else if (libraryBookCollectionErrorAct && prevLibraryBookCollectionErrorResp !== libraryBookCollectionErrorAct) {
            const { message, details } = libraryBookCollectionErrorAct || {};
            toast.error(message || details || "Something went wrong.");
        }
        console.log('saveLibraryBookCollectionResp && prevSaveLibraryBookCollectionResp !== saveLibraryBookCollectionResp22', saveLibraryBookCollectionResp && prevSaveLibraryBookCollectionResp !== saveLibraryBookCollectionResp);

        libraryShelvesRef.current.prevSaveLibraryBookIssuanceResp = saveLibraryBookIssuanceResp;
        libraryShelvesRef.current.prevGetBookIssuanceUserTypeListResp = getBookIssuanceUserTypeListResp;
        libraryShelvesRef.current.prevLibraryRecordRequestListResp = libraryRecordRequestListResp;
        libraryShelvesRef.current.prevSaveLibraryBookCollectionResp = saveLibraryBookCollectionResp;
        libraryShelvesRef.current.prevLibraryBookIssuanceErrorAct = libraryBookIssuanceErrorAct;
        libraryShelvesRef.current.prevLibraryBookCollectionErrorResp = libraryBookCollectionErrorAct;

    }, [libraryBookIssuanceErrorAct, saveLibraryBookIssuanceResp, getBookIssuanceUserTypeListResp, libraryRecordRequestListResp, saveLibraryBookCollectionResp, libraryBookCollectionErrorAct, bookIssuancesForm.values.userType])

        useEffect(() => {
            const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            let year = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")

            bookIssuancesForm.setFieldValue("academicYearId", year?.academicYearId)
            bookIssuancesForm.setFieldValue("academicYearName", year?.academicYearName)

        }
    }, [academicYearListResp]);

    useEffect(() => {
        return () => {
            dispatch(setBookIssuanceUserTypeListAct(undefined))
        }
    }, [])

    useEffect(() => {
        dispatch(getLibraryLanguageListAct(generateActionPayload("get_library_language", undefined, {
            pageNo: 0, pageSize: 100
        })));
    }, []);
    
    useEffect(() => {
        if (branchId) {
            libraryRecordList()
            libraryDetailsList({ branchId })
            const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
            dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
        }
    }, [branchId,instituteId,])

    const libraryDetailsList = (otherProps?: any) => {

        let payload = {
            branchId,
            sortBy: "createdAt",
            orderBy: "asc",
            pageNo: 0,
            pageSize: 100,
            ...otherProps,
        };
        dispatch(getLibraryDetailsListAct(generateActionPayload("get_library_details", undefined, payload)));
    };

    const userList = (otherProps?: any) => {
        let payload = {
            branchId,
            recordTypeId: bookIssuancesForm.values.recordTypeId,
            ...otherProps,
        };
        dispatch(getBookIssuanceUserTypeListAct(generateActionPayload("get_book_issuance_user_list", undefined, payload)));
    };
    const libraryRecordList = (otherProps?: any) => {
        let payload = {
          branchId,
          ...otherProps,
        };
        dispatch(getLibraryRecordListAct(generateActionPayload("get_library_record", undefined, payload)));
    };

    const isSpecimen = libraryRecordRequestListResp?.content?.some(
        (item: any) =>
            item?.id == bookIssuancesForm.values.recordTypeId &&
            item?.recordType === "SPECIMEN"
    );

    const props = {
        bookIssuancesForm,
        studentListState,
        setStudentListState,
        isSpecimen,
        openBookCollectionUploadModal,
        closeBookCollectionUploadModal,
        bookCollectionUploadState
    };

    return (
        <>
            <div className="page-content free_payment_record_wrapper">
                <div className="container-fluid">
                    <BreadCrumb title="Library" pageTitle="Library" />
                    <div className="tw-flex tw-justify-center tw-mb-5 tw-gap-2">
                        <div className="tw-w-full">
                            <div className="tw-bg-white tw-rounded-lg tw-shadow">
                                <div className="tw-p-4">
                                    <h4 className="tw-text-lg tw-font-semibold tw-mb-3 tw-flex-grow">
                                        Book Issuance
                                    </h4>
                                    <div>
                                        <UncontrolledAccordionCard defaultOpen={['1', '2', '3']}>
                                            <AccordionCardItem>
                                                <AccordionCardHeader targetId="1" title="Issuances" />
                                                <AccordionCardBody
                                                    accordionId="1"
                                                    className="tw-border-0 tw-rounded-b-md tw-p-0"
                                                >
                                                    <Issuances {...props} />
                                                </AccordionCardBody>
                                            </AccordionCardItem>

                                            <AccordionCardItem>
                                                <AccordionCardHeader targetId="2" title="User Details" />
                                                <AccordionCardBody
                                                    accordionId="2"
                                                    className="tw-border-0 tw-rounded-b-md"
                                                >
                                                    <UserDetails {...props} />
                                                </AccordionCardBody>
                                            </AccordionCardItem>
                                        </UncontrolledAccordionCard>
                                    </div>
                                    <div className="tw-flex tw-justify-end tw-gap-2 tw-mx-4 tw-mb-3">
                                        <Button type="button" variant="secondary" onClick={() => history.push("/library-book-issuance")}>
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            onClick={(event: any) => bookIssuancesForm.handleSubmit(event)}
                                            disabled={showApiLoader}
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default BookIssuanceDetails;
