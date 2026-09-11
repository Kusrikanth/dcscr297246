import { useFormik } from "formik";
import AccordionCardBody from "../../../../Components/Common/AccordionCardBody";
import AccordionCardHeader from "../../../../Components/Common/AccordionCardHeader";
import AccordionCardItem from "../../../../Components/Common/AccordionCardItem";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import UncontrolledAccordionCard from "../../../../Components/Common/UncontrolledAccordionCard";
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppSelector } from "../../../../hooks/storehook";
import { getLibraryDetailsListAct } from "../../../../store/library/settings/librarysettingsaction";
import { getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getBookIssuanceUserTypeListAct } from "../../../../store/library/bookissuance/bookissuanceaction";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import BookReturns from "./BookReturns";
import UserDetails from "./UserDetails";
import { saveLibraryBookReturnAct } from "../../../../store/library/bookreturn/bookreturnaction";
import { computeSubmitButtonError } from "./helper";
import Button from "../../../../Components/Common/Button";

const initialValues = {
    academicYearId: "",
    academicYearName: "",
    curriculumId: "",
    userType: "",
    userTypeId:"",
    studentId: "",
    libraryId: "",
    employeeId: "",
    designation: "",
    department: "",
    fineAmtPerDay: null,
    empCategoryId:"",
    recommendedId : "",
    accessionNumber:"",

    recommendedPerson: "",
    personName: "",
};

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic Year is required.").nullable(),
    libraryId: Yup.string().required("Library is required.").nullable(),
    userType: Yup.string().required("User Type is required.").nullable(),
})

const BookReturnsDetails = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const [filterState, setFilterState] = useState(initialValues);
    const [studentListState, setStudentListState] = useState<any>([])
    const [updatedStudentData, setUpdatedStudentData] = useState<any[]>([]);
    const [searchStudentState, setSearchStudentState] = useState<any>(null);
    const [searchEmployeeState, setSearchEmployeeState] = useState<any>(null);
    const [searchRecommendedState, setSearchRecommendedState] = useState<any>(null);
    const [searchAccessionNoState, setSearchAccessionNoState] = useState<any>(null);

    const bookReturnForm = useFormik({
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            let payload;
            const { userType } = bookReturnForm.values;
            if (userType === "STUDENT") {
                payload = updatedStudentData?.filter((item: any) => item?.isSelected)?.map((item: any) => {
                    return {
                        libraryIssuanceId: item?.libraryIssuanceId || item?.id,
                        returnDate: item?.returnDate,
                        lateReturnDate: item?.currentDate,
                        bookCondition: item?.bookCondition,
                        fineAmount: +item?.fine,
                        bookCost: +item?.bookPrice,
                        totalAmount: +item?.totalAmount,
                    };
                });
            } else if (userType === "EMPLOYEE" || userType === "RECOMMENDATION") {
                payload = studentListState?.filter((item: any) => item?.isSelected)?.map((item: any) => {
                    return {
                        libraryIssuanceId: item?.libraryIssuanceId || item?.id,
                        returnDate: item?.returnDate,
                        lateReturnDate: item?.currentDate,
                        bookCondition: item?.bookCondition,
                        fineAmount: +item?.fine,
                        bookCost: +item?.bookPrice,
                        totalAmount: +item?.totalAmount,
                    };
                });
            }
            if (payload?.length > 0) {
                dispatch(saveLibraryBookReturnAct(generateActionPayload("save_library_book_return", undefined, payload)));
            }
        },
    });
    
    

    const {
        academicYearListResp,
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        showApiLoader,
        getBookIssuanceUserTypeListResp,
        saveLibraryBookReturnResp,
        bookReturnErrorResp,
    } = useAppSelector(
        ({ instAcademics, appData, libraryBookIssuance, globalData, libraryBookReturn, }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            getBookIssuanceUserTypeListResp: libraryBookIssuance.getBookIssuanceUserTypeListResp,
            showApiLoader: globalData.showApiLoader,
            saveLibraryBookReturnResp: libraryBookReturn.saveLibraryBookReturnResp,
            bookReturnErrorResp: libraryBookReturn.bookReturnErrorResp,
        }),
        shallowEqual
    );

    const libraryShelvesRef = useRef({
        prevSaveLibraryBookReturnResp: saveLibraryBookReturnResp,
        prevGetBookIssuanceUserTypeListResp: getBookIssuanceUserTypeListResp,
        prevBookReturnErrorResp: bookReturnErrorResp,
    })
    useEffect(() => {
        const { prevSaveLibraryBookReturnResp, prevGetBookIssuanceUserTypeListResp, prevBookReturnErrorResp, } = libraryShelvesRef.current;

        if (bookReturnErrorResp && prevBookReturnErrorResp !== bookReturnErrorResp) {
            const { details } = bookReturnErrorResp || {}
            toast.error(details || "Something went wrong")
        }
        else if (saveLibraryBookReturnResp && prevSaveLibraryBookReturnResp !== saveLibraryBookReturnResp) {
            toast.success("Book Returned successfully")
            history.push("/library-book-return")
        }
        else if (getBookIssuanceUserTypeListResp && prevGetBookIssuanceUserTypeListResp !== getBookIssuanceUserTypeListResp) {
            if (Array.isArray(getBookIssuanceUserTypeListResp) && getBookIssuanceUserTypeListResp.length > 0) {
                const findIdxStu = getBookIssuanceUserTypeListResp.findIndex((item: any) => item?.userType === "STUDENT");
                const data = findIdxStu > -1 ? getBookIssuanceUserTypeListResp[findIdxStu] : getBookIssuanceUserTypeListResp[0]
                bookReturnForm.setFieldValue("userType", data?.userType)
                bookReturnForm.setFieldValue("userTypeId", data?.id)
                bookReturnForm.setFieldValue("fineAmtPerDay", data?.fineAmountPerDay)
            }
        }

        libraryShelvesRef.current.prevSaveLibraryBookReturnResp = saveLibraryBookReturnResp;
        libraryShelvesRef.current.prevGetBookIssuanceUserTypeListResp = getBookIssuanceUserTypeListResp;
        libraryShelvesRef.current.prevBookReturnErrorResp = bookReturnErrorResp;

    }, [bookReturnErrorResp, saveLibraryBookReturnResp, getBookIssuanceUserTypeListResp])

    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            let year = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")

            bookReturnForm.setFieldValue("academicYearId", year?.academicYearId)
            bookReturnForm.setFieldValue("academicYearName", year?.academicYearName)

        }
    }, [academicYearListResp]);

    useEffect(() => {
        if (branchId) {
            dispatch(getBookIssuanceUserTypeListAct(generateActionPayload("get_book_issuance_user_list")));
        }
    }, [branchId,instituteId,])

    const props = {
        bookReturnForm,
        filterState, 
        setFilterState,
        studentListState,
        setStudentListState,
        updatedStudentData, 
        setUpdatedStudentData,
        searchStudentState,
        setSearchStudentState,
        setSearchEmployeeState,
        searchEmployeeState,
        setSearchRecommendedState,
        searchRecommendedState,
        searchAccessionNoState,
        setSearchAccessionNoState,
    };

    return (
        <>
            <div className="page-content free_payment_record_wrapper">
                <div className="container-fluid">
                    <BreadCrumb title="Library" pageTitle="Library" />
                    <div className="tw-flex tw-justify-center tw-gap-2 tw-mb-6">
                        <div className="tw-w-full">
                            <div className="tw-bg-white tw-rounded-lg tw-shadow">
                                <div className="tw-p-4">
                                    <h4 className="tw-text-lg tw-font-semibold tw-mb-3 tw-flex-grow">
                                        Book Return
                                    </h4>
                                    <div>
                                        <UncontrolledAccordionCard defaultOpen={['1', '2']}>
                                            <AccordionCardItem>
                                                <AccordionCardHeader targetId="1" title="Returns" />
                                                <AccordionCardBody
                                                    accordionId="1"
                                                    className="tw-border-0 tw-rounded-b-md tw-p-0"
                                                >
                                                    <BookReturns {...props} />
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
                                    <div className="tw-flex tw-justify-end tw-gap-2 tw-mx-4 tw-my-3">
                                        <Button type="button" variant="secondary" onClick={() => history.push("/library-book-return")}>
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            onClick={(event: any) => bookReturnForm.handleSubmit(event)}
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

export default BookReturnsDetails;
