import { useFormik } from "formik";
import { Button, DateInput, ModalContainerUpdated, SelectInput, TextArea, TextInput, TextInputGroup } from "../../../../Components/Common";
import AccordionCardBody from "../../../../Components/Common/AccordionCardBody";
import AccordionCardHeader from "../../../../Components/Common/AccordionCardHeader";
import AccordionCardItem from "../../../../Components/Common/AccordionCardItem";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import UncontrolledAccordionCard from "../../../../Components/Common/UncontrolledAccordionCard";
import { selectData1, selectData2, selectData3, selectData4, selectData7, selectData6, selectData5,selectData9, EmployeeDataTableDetails, EmployeeDataTableData } from "../helper";
import { useEffect, useMemo, useState } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { proposedAdmissionListAct } from "../../../../store/FrontDesk/AdmissionSettings/admissionsettingaction";

const initialValues = {
    libraryName: "",
    academicYearId: "",
    userType: "Student",
    detailType: "Student Wise details",
    search: "",
    class: "",
    section: "",
    accessionNumber: "",
    bookName: "",
    bookTitle: "",
    authorName: "",
    publisher: "",
    issuancesDate: "",
    returnDate: "",
    currentDate: "",
    daysLate: "",
    bookCondition: "",
    price: "",
    bookCost: "",
    totalCost: "",
    room: "",
    shelf: "",
    rack: "",
    remarks: "",
    curriculumType: "",
    employeeCategory: "",
    employeeName: "",
    personName: "",
    designation: "",
    department: "",
    employee: "",
    selectionType: "Accession No Wise",
};
const SpecimenBookReturnsDetails = () => {
    const dispatch = useDispatch();
    const [SpecimenBookReturnFilter, setSpecimenBookReturnFilter] = useState(initialValues);
    const [SpecimenBookReturns, setSpecimenBookReturns] = useState(initialValues);
    const [LibraryDetailsModelState, setLibraryDetailsModelState] =
        useState({
            showModal: false,
            branchId: "",
        });
    const SpecimenBookReturnsForm = useFormik({
        enableReinitialize: true,
        initialValues: SpecimenBookReturns,
        onSubmit: (values) => { },
    });

    const toggleLibraryDetailsModel = () => {
        setLibraryDetailsModelState((prevState) => ({
            ...prevState,
            showModal: !prevState.showModal,
        }));
    };

    const {
        academicYearListResp,
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
    }: any = useAppSelector(
        ({ instAcademics, appData, }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
        }),
        shallowEqual
    );
    useEffect(() => {
        const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
        dispatch(
          getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload))
        );
      }, []);
      useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
          let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId
          setSpecimenBookReturnFilter((prev: any) => ({ ...prev, academicYearId: yearId }))
          // BookReturnList(undefined,{academicYearId:yearId})
        }
      }, [academicYearListResp]);
    const { data: academicYearList } = academicYearListResp || {};

    const employeeColumns = useMemo(() => EmployeeDataTableDetails(), []);

    return (
        <>
            <div className="page-content free_payment_record_wrapper">
                <div className="container-fluid">
                    <BreadCrumb title="Library" pageTitle="Library" />
                    <div className="tw-flex tw-justify-center">
                        <div className='tw-w-3/4'>
                            <div className='tw-bg-white tw-rounded tw-shadow'>
                                <div className='tw-p-5'>
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-3">
                                        Book Return
                                    </h4>
                                    <div>
                                        <UncontrolledAccordionCard
                                            defaultOpen={[
                                                '1',
                                                '2',
                                                '3',
                                                '4',
                                                '5',
                                                '6'
                                            ]}
                                        >
                                         
                                            {SpecimenBookReturnsForm.values.selectionType === "Accession No Wise" && (
                                                <>
                                                    <AccordionCardItem>
                                                        <AccordionCardHeader targetId="1" title="Return" />
                                                        <AccordionCardBody accordionId="1" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px", padding: "0px", border: "0px" }} >
                                                            <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-p-3">
                                                                <div className="tw-col-span-12 lg:tw-col-span-4">
                                                                    <SelectInput
                                                                        name="academicYearId"
                                                                        labelText="Academic Year"
                                                                        labelClass="tw-font-bold"
                                                                        value={SpecimenBookReturnsForm.values.academicYearId}
                                                                        onChange={SpecimenBookReturnsForm.handleChange}
                                                                        menuItems={academicYearList || []}
                                                                        valueKey="academicYearId"
                                                                        textKey="academicYearName"
                                                                        formgroupClassName="tw-mb-3"
                                                                        isDisabled={true}
                                                                        defaultSelect="2024-2025"
                                                                    />
                                                                </div>
                                                                <div className="tw-col-span-12 lg:tw-col-span-4">
                                                                    <SelectInput
                                                                        name="selectionType"
                                                                        labelText="Type"
                                                                        labelClass="tw-font-bold"
                                                                        value={SpecimenBookReturnsForm.values.selectionType}
                                                                        onChange={SpecimenBookReturnsForm.handleChange}
                                                                        menuItems={selectData3}
                                                                        valueKey="selectionType"
                                                                        textKey="selectionType"
                                                                        formgroupClassName="tw-mb-3"
                                                                    />
                                                                </div>
                                                                <div className="tw-col-span-12 lg:tw-col-span-4">
                                                                    <div className="tw-grid tw-grid-cols-12">
                                                                        <div className="tw-col-span-12 md:tw-col-span-8">
                                                                            <div className="tw-relative search-box">
                                                                                <TextInput
                                                                                    name="accessionNumber"
                                                                                    labelText="Accession Number"
                                                                                    labelClass="tw-font-bold"
                                                                                    formgroupClassName="tw-mb-3"
                                                                                    placeHolder="Search ..."
                                                                                    value={SpecimenBookReturnsForm.values.accessionNumber}
                                                                                    onChange={SpecimenBookReturnsForm.handleChange}
                                                                                />
                                                                                <i className="ri-search-line tw-absolute tw-left-3 tw-top-[33px] tw-text-gray-400"></i>
                                                                            </div>
                                                                        </div>
                                                                        <div className="tw-col-span-12 md:tw-col-span-4 tw-flex tw-items-center">
                                                                            <Button variant="info" type="button" onClick={toggleLibraryDetailsModel}>
                                                                                View
                                                                            </Button>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </AccordionCardBody>
                                                    </AccordionCardItem>
                                                    <AccordionCardItem>
                                                        <AccordionCardHeader targetId="3" title="User Details" />

                                                        <AccordionCardBody accordionId="3" className="tw-border-t-0 tw-rounded-b">
                                                            <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-p-3">
                                                                <div className="tw-col-span-12 lg:tw-col-span-4">
                                                                    <SelectInput
                                                                        name="libraryName"
                                                                        labelText="Library"
                                                                        labelClass="tw-font-bold"
                                                                        value={SpecimenBookReturnsForm.values.libraryName}
                                                                        onChange={SpecimenBookReturnsForm.handleChange}
                                                                        menuItems={selectData1}
                                                                        valueKey="libraryType"
                                                                        textKey="libraryType"
                                                                        isDisabled
                                                                        formgroupClassName="tw-mb-3"
                                                                    />
                                                                </div>
                                                                <div className="tw-col-span-12 lg:tw-col-span-4">

                                                                    <TextInput
                                                                        name="bookTitle"
                                                                        labelText="Book Title"
                                                                        labelClass="tw-font-bold"
                                                                        formgroupClassName="tw-mb-3"
                                                                        isDisabled
                                                                        value={SpecimenBookReturnsForm.values.bookTitle}
                                                                        onChange={SpecimenBookReturnsForm.handleChange}
                                                                    />
                                                                </div>
                                                                <div className="tw-col-span-12 lg:tw-col-span-4">

                                                                    <DateInput
                                                                        name="issuancesDate"
                                                                        labelText="Issuance Date"
                                                                        labelClass="tw-font-bold"
                                                                        isDisabled
                                                                        value={SpecimenBookReturnsForm.values.issuancesDate}
                                                                        onChange={SpecimenBookReturnsForm.handleChange}
                                                                        placeHolder="Issuances Date"
                                                                    />
                                                                </div>
                                                                <div className="tw-col-span-12 lg:tw-col-span-4">

                                                                    <DateInput
                                                                        name="returnDate"
                                                                        labelText="Return Date"
                                                                        labelClass="tw-font-bold"
                                                                        isDisabled
                                                                        value={SpecimenBookReturnsForm.values.returnDate}
                                                                        onChange={SpecimenBookReturnsForm.handleChange}
                                                                        placeHolder="Issuances Date"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </AccordionCardBody>
                                                    </AccordionCardItem>

                                                    <AccordionCardItem>
                                                        <AccordionCardHeader targetId="4" title="Book Details" />

                                                        <AccordionCardBody accordionId="4"  style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px" }}>
                                                            <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-p-3">
                                                                <div className="tw-col-span-12 lg:tw-col-span-4">

                                                                    <DateInput
                                                                        name="currentDate"
                                                                        labelText="Current Date"
                                                                        labelClass="tw-font-bold"
                                                                        value={SpecimenBookReturnsForm.values.currentDate}
                                                                        onChange={SpecimenBookReturnsForm.handleChange}
                                                                        placeHolder="Issuances Date"
                                                                    />
                                                                </div>
                                                                <div className="tw-col-span-12 lg:tw-col-span-4">

                                                                    <TextInput
                                                                        name="daysLate"
                                                                        labelText="No Of Days Late"
                                                                        labelClass="tw-font-bold"
                                                                        formgroupClassName="tw-mb-3"
                                                                        value={SpecimenBookReturnsForm.values.daysLate}
                                                                        onChange={SpecimenBookReturnsForm.handleChange}
                                                                    />
                                                                </div>
                                                                <div className="tw-col-span-12 lg:tw-col-span-4">
                                                                    <SelectInput
                                                                        name="bookCondition"
                                                                        labelText="Book Condition"
                                                                        labelClass="tw-font-bold"
                                                                        value={SpecimenBookReturnsForm.values.bookCondition}
                                                                        onChange={SpecimenBookReturnsForm.handleChange}
                                                                        menuItems={selectData4}
                                                                        valueKey="conditionType"
                                                                        textKey="conditionType"
                                                                        formgroupClassName="tw-mb-3"
                                                                    />
                                                                </div>
                                                                <div className='tw-col-span-12 lg:tw-col-span-4'>
                                                                    <TextInputGroup
                                                                        name="price"
                                                                        labelText="Price"
                                                                        labelClass="tw-font-bold"
                                                                        formgroupClassName="tw-mb-0"
                                                                        inputgroupClassName="input-group-sm"
                                                                        inputClassName="form-control-sm"
                                                                        allowedInputRegex="^[0-9]+\.?[0-9]*$"
                                                                        inputGroupStart={true}
                                                                        value={SpecimenBookReturnsForm.values.price}
                                                                        onChange={SpecimenBookReturnsForm.handleChange}
                                                                    >
                                                                        <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                                                                    </TextInputGroup>
                                                                </div>
                                                                <div className='tw-col-span-12 lg:tw-col-span-4'>
                                                                    <TextInputGroup
                                                                        name="bookCost"
                                                                        labelText="Book Cost"
                                                                        labelClass="tw-font-bold"
                                                                        formgroupClassName="tw-mb-0"
                                                                        inputgroupClassName="input-group-sm"
                                                                        inputClassName="form-control-sm"
                                                                        allowedInputRegex="^[0-9]+\.?[0-9]*$"
                                                                        inputGroupStart={true}
                                                                        value={SpecimenBookReturnsForm.values.bookCost}
                                                                        onChange={SpecimenBookReturnsForm.handleChange}
                                                                    >
                                                                        <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                                                                    </TextInputGroup>
                                                                </div>
                                                                <div className='tw-col-span-12 lg:tw-col-span-4'>
                                                                    <TextInputGroup
                                                                        name="totalCost"
                                                                        labelText="Total Cost"
                                                                        labelClass="tw-font-bold"
                                                                        formgroupClassName="tw-mb-0"
                                                                        inputgroupClassName="input-group-sm"
                                                                        inputClassName="form-control-sm"
                                                                        allowedInputRegex="^[0-9]+\.?[0-9]*$"
                                                                        inputGroupStart={true}
                                                                        isDisabled
                                                                        value={SpecimenBookReturnsForm.values.totalCost}
                                                                        onChange={SpecimenBookReturnsForm.handleChange}
                                                                    >
                                                                        <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                                                                    </TextInputGroup>
                                                                </div>
                                                                <div className="tw-col-span-12 lg:tw-col-span-4">
                                                                    <SelectInput
                                                                        name="room"
                                                                        labelText="Room"
                                                                        labelClass="tw-font-bold"
                                                                        value={SpecimenBookReturnsForm.values.room}
                                                                        onChange={SpecimenBookReturnsForm.handleChange}
                                                                        menuItems={selectData5}
                                                                        valueKey="roomType"
                                                                        textKey="roomType"
                                                                        formgroupClassName="tw-mb-3"
                                                                    />
                                                                </div>
                                                                <div className="tw-col-span-12 lg:tw-col-span-4">
                                                                    <SelectInput
                                                                        name="rack"
                                                                        labelText="Rack"
                                                                        labelClass="tw-font-bold"
                                                                        value={SpecimenBookReturnsForm.values.rack}
                                                                        onChange={SpecimenBookReturnsForm.handleChange}
                                                                        menuItems={selectData6}
                                                                        valueKey="rackType"
                                                                        textKey="rackType"
                                                                        formgroupClassName="tw-mb-3"
                                                                    />
                                                                </div>
                                                                <div className="tw-col-span-12 lg:tw-col-span-4">
                                                                    <SelectInput
                                                                        name="shelf"
                                                                        labelText="Shelf"
                                                                        labelClass="tw-font-bold"
                                                                        value={SpecimenBookReturnsForm.values.shelf}
                                                                        onChange={SpecimenBookReturnsForm.handleChange}
                                                                        menuItems={selectData7}
                                                                        valueKey="shelfType"
                                                                        textKey="shelfType"
                                                                        formgroupClassName="tw-mb-3"
                                                                    />
                                                                </div>
                                                                <div className="tw-col-span-12">
                                                                    <TextArea
                                                                        name="remarks"
                                                                        labelText="Remarks"
                                                                        labelClass="tw-font-bold"
                                                                        value={SpecimenBookReturnsForm.values.remarks}
                                                                        onChange={SpecimenBookReturnsForm.handleChange}
                                                                    >
                                                                    </TextArea>
                                                                </div>
                                                            </div>
                                                        </AccordionCardBody>
                                                    </AccordionCardItem>

                                                </>
                                            )}
                                            {SpecimenBookReturnsForm.values.selectionType === "Employee Wise" && (
                                                <>
                                                    <AccordionCardItem>
                                                        <AccordionCardHeader targetId="1" title="Return" />
                                                        <AccordionCardBody accordionId="1" className="tw-border-t-0 tw-rounded-b tw-p-0 tw-border-0" >
                                                            <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-p-3">
                                                                <div className="tw-col-span-12 lg:tw-col-span-6">
                                                                    <SelectInput
                                                                        name="academicYearId"
                                                                        labelText="Academic Year"
                                                                        labelClass="tw-font-bold"
                                                                        value={SpecimenBookReturnsForm.values.academicYearId}
                                                                        onChange={SpecimenBookReturnsForm.handleChange}
                                                                        menuItems={academicYearList || []}
                                                                        valueKey="academicYearId"
                                                                        textKey="academicYearName"
                                                                        formgroupClassName="tw-mb-3"
                                                                        isDisabled={true}
                                                                        defaultSelect="2024-2025"
                                                                    />
                                                                </div>
                                                                <div className="tw-col-span-12 lg:tw-col-span-6">
                                                                    <SelectInput
                                                                        name="selectionType"
                                                                        labelText="Type"
                                                                        labelClass="tw-font-bold"
                                                                        value={SpecimenBookReturnsForm.values.selectionType}
                                                                        onChange={SpecimenBookReturnsForm.handleChange}
                                                                        menuItems={selectData3}
                                                                        valueKey="selectionType"
                                                                        textKey="selectionType"
                                                                        formgroupClassName="tw-mb-3"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </AccordionCardBody>
                                                    </AccordionCardItem>
                                                    <AccordionCardItem>
                                                        <AccordionCardHeader targetId="3" title="Teacher Details" />

                                                        <AccordionCardBody accordionId="3" className="tw-border-t-0 tw-rounded-b">
                                                            <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-p-3">
                                                                <div className="tw-col-span-12 lg:tw-col-span-6">
                                                                    <SelectInput
                                                                        name="employeeCategory"
                                                                        labelText="Employee Category"
                                                                        labelClass="tw-font-bold"
                                                                        value={SpecimenBookReturnsForm.values.employeeCategory}
                                                                        onChange={SpecimenBookReturnsForm.handleChange}
                                                                        menuItems={selectData9}
                                                                        valueKey="employeeCategoryType"
                                                                        textKey="employeeCategoryType"
                                                                        formgroupClassName="tw-mb-3"
                                                                    />
                                                                </div>
                                                                <div className="tw-col-span-12 lg:tw-col-span-6">
                                                                    <div className="tw-relative search-box">
                                                                        <TextInput
                                                                            name="employeeName"
                                                                            labelText="Employee"
                                                                            labelClass="tw-font-bold"
                                                                            formgroupClassName="tw-mb-3"
                                                                            value={SpecimenBookReturnsForm.values.employeeName}
                                                                            onChange={SpecimenBookReturnsForm.handleChange}
                                                                        />
                                                                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-[33px] tw-text-gray-400"></i>
                                                                    </div>
                                                                </div>
                                                                <div className="tw-col-span-12">

                                                                    <TextInput
                                                                        name="designation"
                                                                        labelText="Designation"
                                                                        labelClass="tw-font-bold"
                                                                        formgroupClassName="tw-mb-3"
                                                                        isDisabled
                                                                        value={SpecimenBookReturnsForm.values.designation}
                                                                        onChange={SpecimenBookReturnsForm.handleChange}
                                                                    />
                                                                </div>
                                                                <div className="tw-col-span-12">
                                                                    <TableContainer
                                                                        columns={employeeColumns || []}
                                                                        data={EmployeeDataTableData}
                                                                        tableClass="tw-mb-0"
                                                                        divClass="tw-overflow-x-auto tw-mb-3"
                                                                        theadClass="tw-bg-gray-50 tw-text-[#6c757d]"
                                                                        showCheckbox={false}
                                                                        showPagination={true}
                                                                        totalPages={10}
                                                                        callbackPaginationHndlr={() => { }}
                                                                        currentPageNumber={1}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </AccordionCardBody>
                                                    </AccordionCardItem>
                                                </>
                                            )}

                                        </UncontrolledAccordionCard>
                                    </div>

                                    <div className="tw-flex">
                                        <div className="tw-flex tw-gap-2 tw-ml-auto tw-mx-4 tw-my-3">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                            >
                                                Reset
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="primary"
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
            </div>
        </>
    );
};

export default SpecimenBookReturnsDetails;
