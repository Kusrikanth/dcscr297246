import { useFormik } from "formik";
import { useMemo, useRef, useState } from "react";
import { Button, DateInput, OffCanvasContainer, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import {
  SpecimenBookIssuancesTableData,
  generateColumns,
} from "./helper";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
import AdvanceFilterModal from "./AdvanceFilter";


const initialValues = {
  search: "",
  issuancesDate: "",
};

const SpecimenBookIssuances = () => {
  const history = useHistory()
  const [advanceFilterCountState, setAdvanceFilterCountState] = useState(0);
  const [isAdvanceFilterState, setIsAdvanceFilterState] = useState(false);
  const [SpecimenBookIssuances, setSpecimenBookIssuances] = useState(initialValues);
  const SpecimenBookIssuancesForm = useFormik({
    enableReinitialize: true,
    initialValues: SpecimenBookIssuances,
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
  function advanceFilterCallbckHndlr(appliedFilter: any) {
    advanceFilterRef.current = appliedFilter;
    const filterCount = Object.keys(appliedFilter).reduce((total, item) => {
        if (appliedFilter[item]) {
            total += 1;
        }
        return total;
    }, 0);
}
  function toggleAdvanceFilter() {
    setIsAdvanceFilterState(prevState => !prevState);
}
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
                  Specimen Book Issuances
                  </h4>
                </div>
                <div className="tw-col-span-12 md:tw-col-span-6 tw-flex tw-justify-end tw-gap-2">
                      <Button
                        variant="primary"
                        onClick={() => { history.push('/specimen-book-issuance/specimen-book-issuance-details') }}
                        >
                        Return Book
                      </Button>
                    <Button variant="primary"  >
                        <div className="tw-flex tw-items-center">
                            <span><i className="ri-add-line tw-mr-1" /></span>
                            <span>Export</span>
                        </div>
                    </Button>
                </div>
              </div>
            </div>
            <div className="tw-p-0">
              <form onSubmit={SpecimenBookIssuancesForm.handleSubmit}>
                <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-p-3">
                  <div className="tw-col-span-12 lg:tw-col-span-4">
                    <div className="tw-relative search-box">
                      <TextInput
                        name="search"
                        formgroupClassName="tw-mb-0"
                        placeHolder="Search..."
                        value={SpecimenBookIssuancesForm.values.search}
                        onChange={SpecimenBookIssuancesForm.handleChange}
                      />
                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-[10px] tw-text-gray-400"></i>
                    </div>
                  </div>

                  <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-2">
                  <DateInput
                    name="issuancesDate"
                    labelClass="tw-font-bold"
                    value={SpecimenBookIssuancesForm.values.issuancesDate}
                    onChange={SpecimenBookIssuancesForm.handleChange}
                    placeHolder="Issuances Date"
                  />
                  </div>
                  <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-2">
                    <div className="tw-relative">
                      <button
                            type="button"
                            style={{
                                backgroundColor: "#F4F7FA",
                            }}
                            onClick={toggleAdvanceFilter}
                            className="tw-p-2 tw-rounded tw-border-none tw-flex tw-items-center"
                        >
                            <FilterSvg height={"18px"} width={"18px"} />
                        </button>
                        {!isNaN(advanceFilterCountState) && advanceFilterCountState > 0 && <span className="tw-absolute tw-top-[-10px] tw-left-[30px] tw-bg-[#0ab39c] tw-text-white tw-text-[10px] tw-font-bold tw-px-1.5 tw-py-0.5 tw-rounded-full tw-min-w-[18px] tw-text-center">
                            {advanceFilterCountState}
                        </span>}
                    </div>
                  </div>
                </div>
                
              </form>
              <TableContainer
                columns={columns || []}
                data={SpecimenBookIssuancesTableData}
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
      <OffCanvasContainer
                isOpen={isAdvanceFilterState}
                headerTitle="Advance Filters"
                closeHndlr={toggleAdvanceFilter}
                id="advance-filter"
            >
                <AdvanceFilterModal
                    appliedFilter={advanceFilterRef.current}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    toggleAdvanceFilter={toggleAdvanceFilter}
                    isOpen={isAdvanceFilterState}
                />
            </OffCanvasContainer>
    </>
  );
};

export default SpecimenBookIssuances;
