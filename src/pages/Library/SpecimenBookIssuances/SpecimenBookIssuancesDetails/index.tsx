import { useFormik } from "formik";
import { Button, DateInput, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import AccordionCardBody from "../../../../Components/Common/AccordionCardBody";
import AccordionCardHeader from "../../../../Components/Common/AccordionCardHeader";
import AccordionCardItem from "../../../../Components/Common/AccordionCardItem";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import UncontrolledAccordionCard from "../../../../Components/Common/UncontrolledAccordionCard";
import { selectData1, selectData3, } from "../helper";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../../utility/reduxutility";

const initialValues = {
    libraryName: "",
    academicYearId: "",
    userType: "Employee",
    detailType: "Student Wise details",
    search: "",
    class: "",
    section: "",
    accessionNumber: "",
    bookName: "",
    authorName: "",
    publisher: "",
    issuancesDate: "",
    returnDate: "",
    remarks : "",
    recommendedPerson : "",
    personName : "",
    designation : "",
    department : "",
    employee : "",
};
const SpecimenBookIssuancesDetails = () => {
    const dispatch = useDispatch();
    const [SpecimenBookIssuancesFilter, setSpecimenBookIssuancesFilter] = useState(initialValues);
    const [SpecimenBookIssuancess, setSpecimenBookIssuancess] = useState(initialValues);
    const [LibraryDetailsModelState, setLibraryDetailsModelState] =
        useState({
            showModal: false,
            branchId: "",
        });
    const SpecimenBookIssuancessForm = useFormik({
        enableReinitialize: true,
        initialValues: SpecimenBookIssuancess,
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
      }: any = useAppSelector(
        ({ instAcademics, appData, }) => ({
          academicYearListResp: instAcademics.academicYearListResp,
          currentBranchIdResp: appData.currentBranchIdResp,
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
          let yearId = academicYearListResp && academicYearListResp.data.find((year: any) =>  year.yearStatus === "CURRENT").academicYearId
          setSpecimenBookIssuancesFilter((prev: any) => ({ ...prev, academicYearId: yearId }))
          // SpecimenBookIssuancesList(undefined,{academicYearId:yearId})
        }
      }, [academicYearListResp]);
      const { data: academicYearList } = academicYearListResp || {};
    

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
                                        Book Issuance
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
                                            <AccordionCardItem>
                                                <AccordionCardHeader targetId="1" title="Issuances" />
                                                <AccordionCardBody accordionId="1" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px", padding: "0px", border: "0px" }} >
                                                    <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-p-3">
                                                        <div className="tw-col-span-12 lg:tw-col-span-4">
                                                            <SelectInput
                                                                name="academicYearId"
                                                                labelText="Academic Year"
                                                                labelClass="tw-font-bold"
                                                                value={SpecimenBookIssuancessForm.values.academicYearId}
                                                                onChange={SpecimenBookIssuancessForm.handleChange}
                                                                menuItems={academicYearList || []}
                                                                valueKey="academicYearId"
                                                                textKey="academicYearName"
                                                                formgroupClassName="tw-mb-3"
                                                            />
                                                        </div>
                                                        <div className="tw-col-span-12 lg:tw-col-span-4">
                                                            <SelectInput
                                                                name="libraryName"
                                                                labelText="Library Name"
                                                                labelClass="tw-font-bold"
                                                                value={SpecimenBookIssuancessForm.values.libraryName}
                                                                onChange={SpecimenBookIssuancessForm.handleChange}
                                                                menuItems={selectData1}
                                                                valueKey="libraryType"
                                                                textKey="libraryType"
                                                                formgroupClassName="tw-mb-3"
                                                            />
                                                        </div>
                                                        <div className="tw-col-span-12 lg:tw-col-span-4">
                                                            <SelectInput
                                                                name="userType"
                                                                labelText="User Type"
                                                                labelClass="tw-font-bold"
                                                                value={SpecimenBookIssuancessForm.values.userType}
                                                                onChange={SpecimenBookIssuancessForm.handleChange}
                                                                menuItems={selectData3}
                                                                valueKey="userType"
                                                                textKey="userType"
                                                                formgroupClassName="tw-mb-3"
                                                            />
                                                        </div>
                                                    </div>
                                                </AccordionCardBody>
                                            </AccordionCardItem>

                                            <AccordionCardItem>
                                                <AccordionCardHeader targetId="3" title="User Details" />

                                                <AccordionCardBody accordionId="3" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px" }}>
                                                {SpecimenBookIssuancessForm.values.userType === "Employee" && (
                                                        <>
                                                            <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-p-3">
                                                                <div className="tw-col-span-12 lg:tw-col-span-6">
                                                                    <div className="tw-relative search-box">
                                                                        <TextInput
                                                                            name="employee"
                                                                            labelText="Employee"
                                                                            labelClass="tw-font-bold"
                                                                            formgroupClassName="tw-mb-3"
                                                                            placeHolder="Search with Employee Name with code ..."
                                                                            value={SpecimenBookIssuancessForm.values.employee}
                                                                            onChange={SpecimenBookIssuancessForm.handleChange}
                                                                        />
                                                                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-[33px] tw-text-gray-400"></i>
                                                                    </div>
                                                                </div>
                                                                <div className="tw-col-span-12 lg:tw-col-span-6">

                                                                    <TextInput
                                                                        name="department"
                                                                        labelText="Department"
                                                                        labelClass="tw-font-bold"
                                                                        formgroupClassName="tw-mb-3"
                                                                        isDisabled
                                                                        value={SpecimenBookIssuancessForm.values.department}
                                                                        onChange={SpecimenBookIssuancessForm.handleChange}
                                                                    />
                                                                </div>
                                                                <div className="tw-col-span-12">

                                                                    <TextInput
                                                                        name="designation"
                                                                        labelText="Designation"
                                                                        labelClass="tw-font-bold"
                                                                        formgroupClassName="tw-mb-3"
                                                                        isDisabled
                                                                        value={SpecimenBookIssuancessForm.values.designation}
                                                                        onChange={SpecimenBookIssuancessForm.handleChange}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                {SpecimenBookIssuancessForm.values.userType === "Recommended" && (
                                                        <>
                                                            <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-p-3">
                                                                <div className="tw-col-span-12 lg:tw-col-span-6">
                                                                    <div className="tw-relative search-box">
                                                                        <TextInput
                                                                            name="recommendedPerson"
                                                                            labelText="Recommended Person"
                                                                            labelClass="tw-font-bold"
                                                                            formgroupClassName="tw-mb-3"
                                                                            placeHolder="Search with student Name with code ..."
                                                                            value={SpecimenBookIssuancessForm.values.recommendedPerson}
                                                                            onChange={SpecimenBookIssuancessForm.handleChange}
                                                                        />
                                                                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-[33px] tw-text-gray-400"></i>
                                                                    </div>
                                                                </div>
                                                                <div className="tw-col-span-12 lg:tw-col-span-6">

                                                                    <TextInput
                                                                        name="personName"
                                                                        labelText="Name of the Person"
                                                                        labelClass="tw-font-bold"
                                                                        formgroupClassName="tw-mb-3"
                                                                        value={SpecimenBookIssuancessForm.values.personName}
                                                                        onChange={SpecimenBookIssuancessForm.handleChange}
                                                                    />
                                                                </div>
                                                                <div className="tw-col-span-12">

                                                                    <TextInput
                                                                        name="remarks"
                                                                        labelText="Remarks"
                                                                        labelClass="tw-font-bold"
                                                                        formgroupClassName="tw-mb-3"
                                                                        value={SpecimenBookIssuancessForm.values.remarks}
                                                                        onChange={SpecimenBookIssuancessForm.handleChange}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                    

                                                </AccordionCardBody>
                                            </AccordionCardItem>

                                            <AccordionCardItem>
                                                <AccordionCardHeader targetId="4" title="Book Details" />

                                                <AccordionCardBody accordionId="4" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px" }}>
                                                    <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-p-3">
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
                                                                            value={SpecimenBookIssuancessForm.values.accessionNumber}
                                                                            onChange={SpecimenBookIssuancessForm.handleChange}
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
                                                        <div className="tw-col-span-12 lg:tw-col-span-4">

                                                            <TextInput
                                                                name="bookName"
                                                                labelText="Book Name"
                                                                labelClass="tw-font-bold"
                                                                formgroupClassName="tw-mb-3"
                                                                isDisabled
                                                                value={SpecimenBookIssuancessForm.values.bookName}
                                                                onChange={SpecimenBookIssuancessForm.handleChange}
                                                            />
                                                        </div>
                                                        <div className="tw-col-span-12 lg:tw-col-span-4">

                                                            <TextInput
                                                                name="authorName"
                                                                labelText="Author Name"
                                                                labelClass="tw-font-bold"
                                                                formgroupClassName="tw-mb-3"
                                                                isDisabled
                                                                value={SpecimenBookIssuancessForm.values.authorName}
                                                                onChange={SpecimenBookIssuancessForm.handleChange}
                                                            />
                                                        </div>
                                                        <div className="tw-col-span-12 lg:tw-col-span-4">

                                                            <TextInput
                                                                name="publisher"
                                                                labelText="Publisher"
                                                                labelClass="tw-font-bold"
                                                                formgroupClassName="tw-mb-3"
                                                                isDisabled
                                                                value={SpecimenBookIssuancessForm.values.publisher}
                                                                onChange={SpecimenBookIssuancessForm.handleChange}
                                                            />
                                                        </div>
                                                        <div className="tw-col-span-12 lg:tw-col-span-4">

                                                            <DateInput
                                                                name="issuancesDate"
                                                                labelText="Issuance Date"
                                                                labelClass="tw-font-bold"
                                                                isDisabled
                                                                value={SpecimenBookIssuancessForm.values.issuancesDate}
                                                                onChange={SpecimenBookIssuancessForm.handleChange}
                                                                placeHolder="Issuances Date"
                                                            />
                                                        </div>
                                                        <div className="tw-col-span-12 lg:tw-col-span-4">

                                                            <DateInput
                                                                name="returnDate"
                                                                labelText="Return Date"
                                                                labelClass="tw-font-bold"
                                                                isDisabled
                                                                value={SpecimenBookIssuancessForm.values.returnDate}
                                                                onChange={SpecimenBookIssuancessForm.handleChange}
                                                                placeHolder="Issuances Date"
                                                            />
                                                        </div>
                                                    </div>
                                                </AccordionCardBody>
                                            </AccordionCardItem>

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

export default SpecimenBookIssuancesDetails;
