import { useFormik } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, DateInput, OffCanvasContainer, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import {
  SpecimenBookReturnsTableData,
  generateColumns,
  selectData2,
} from "./helper";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppSelector } from "../../../hooks/storehook";


const initialValues = {
  search: "",
  academicYearId: "",
  issuancesDate: "",
};

const SpecimenBookReturns = () => {
  const history = useHistory()
  const dispatch = useDispatch();
  const [BookReturnFilter, setBookReturnFilter] = useState(initialValues);
  const [isAdvanceFilterState, setIsAdvanceFilterState] = useState(false);
  const [SpecimenBookReturns, setSpecimenBookReturns] = useState(initialValues);
  const SpecimenBookReturnsForm = useFormik({
    enableReinitialize: true,
    initialValues: SpecimenBookReturns,
    onSubmit: (values) => { },
  });
  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <i className="text-primary ri-pencil-fill fs-16"></i>,
        actionName: "Edit",
      },
      {
        id: "delete",
        actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
        actionName: "Delete",
        onClick: () => { },
      },
    ],
    []
  );

  const advanceFilterRef = useRef();

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
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT").academicYearId
    setBookReturnFilter((prev: any) => ({ ...prev, academicYearId: yearId }))
    // BookReturnList(undefined,{academicYearId:yearId})
  }
}, [academicYearListResp]);
const { data: academicYearList } = academicYearListResp || {};
  const columns = useMemo(() => generateColumns(menuOptions), []);

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Library" pageTitle="Library" />

          <div className="tw-bg-white tw-rounded tw-shadow">
            <div className="tw-px-4 tw-py-3 tw-border-b">
              <div className="tw-grid tw-grid-cols-12 tw-items-center">
                <div className="tw-col-span-12 md:tw-col-span-6">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  Specimen Book Returns Details List
                  </h4>
                </div>
                <div className="tw-col-span-12 md:tw-col-span-6 tw-flex tw-justify-end tw-gap-2">
                      <Button
                        variant="primary"
                        onClick={() => { history.push('/specimen-book-return/specimen-book-return-details') }}
                        >
                        Return Book
                      </Button>
                    <Button variant="info">
                        <div className="tw-flex tw-items-center">
                            <span><i className="ri-add-line tw-mr-1" /></span>
                            <span>Export</span>
                        </div>
                    </Button>
                </div>
              </div>
            </div>
            <div className="tw-p-0">
              <form onSubmit={SpecimenBookReturnsForm.handleSubmit}>
                <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-p-3">
                  <div className="tw-col-span-12 lg:tw-col-span-4">
                    <div className="tw-relative search-box">
                      <TextInput
                        name="search"
                        formgroupClassName="tw-mb-0"
                        placeHolder="Search..."
                        value={SpecimenBookReturnsForm.values.search}
                        onChange={SpecimenBookReturnsForm.handleChange}
                      />
                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-[10px] tw-text-gray-400"></i>
                    </div>
                  </div>
                  <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={SpecimenBookReturnsForm.values.academicYearId}
                    onChange={SpecimenBookReturnsForm.handleChange}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="tw-mb-0"
                    defaultSelect="Academic Year"
                  />
                  </div>

                  <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-2">
                  <DateInput
                    name="issuancesDate"
                    labelClass="tw-font-bold"
                    value={SpecimenBookReturnsForm.values.issuancesDate}
                    onChange={SpecimenBookReturnsForm.handleChange}
                    placeHolder="Issuances Date"
                  />
                  </div>
                </div>
                
              </form>
              <TableContainer
                columns={columns || []}
                data={SpecimenBookReturnsTableData}
                tableClass="tw-mb-0"
                divClass="table-responsive tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showCheckbox={false}
                showPagination={true}
                totalPages={10}
                callbackPaginationHndlr={() => { }}
                currentPageNumber={1}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpecimenBookReturns;
