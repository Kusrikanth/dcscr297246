import { useFormik } from "formik";
import React, { useMemo, useState } from "react";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { totalFeedueOfClassFilterTypes } from "../feeDueSummaryTypes";
import { generateColumns, TotalFeedueOfClassData } from "../helper";

const initialValues: totalFeedueOfClassFilterTypes = {
  search: "",
};

const TotalFeedueOfClass = () => {
  const [totalFeedueOfClassFilterState, setTotalFeedueOfClassFilterState] =
    useState<totalFeedueOfClassFilterTypes>(initialValues);

  const TotalFeedueOfClassFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: totalFeedueOfClassFilterState,
    onSubmit: (values) => {},
  });

  const roleColumns = useMemo(() => generateColumns(), []);

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="tw-flex tw-items-center tw-mb-3">
            <div className="tw-w-1/2">
              <h4 className="card-title tw-mb-0 tw-flex-grow">
                Total Fee due of Class VII
              </h4>
            </div>

            <div className="tw-w-auto tw-ml-auto">
              <div className="tw-flex tw-items-baseline tw-p-2 tw-bg-red-50 tw-rounded-md">
                <RupeeSvg
                  height="13px"
                  width="13px"
                  fill={"#f06548"}
                  className="tw-mr-1"
                />
                <span className="tw-text-red-500 tw-text-base tw-font-bold">50.5 lac</span>
              </div>
            </div>
          </div>

          <div className="tw-inline-block tw-w-full tw-mb-3">
            <div className="search-box">
              <TextInput
                name="search"
                value={TotalFeedueOfClassFilterForm.values.search}
                onChange={TotalFeedueOfClassFilterForm.handleChange}
                inputClassName="tw-bg-gray-100"
                formgroupClassName="tw-mb-0"
                placeHolder="Search Student..."
              />

              <i className="ri-search-line search-icon"></i>
            </div>
          </div>

          <TableContainer
            columns={roleColumns || []}
            data={TotalFeedueOfClassData}
            divClass="table-responsive tw-mb-1"
            theadClass="table-light tw-text-gray-500 tw-align-middle"
            showCheckbox={true}
            showPagination={true}
            totalPages={10}
            totalRecords={10}
            callbackPaginationHndlr={() => {}}
            currentPageNumber={0}
          />
        </div>
      </div>
    </>
  );
};

export default TotalFeedueOfClass;
