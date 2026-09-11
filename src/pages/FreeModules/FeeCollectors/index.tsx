import React, { useMemo, useState } from "react";
import { SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useFormik } from "formik";
import { FeeCollectorsProps } from "./FeeCollectorsType";
import { FeeCollectorsData, generateColumns } from "./helper";
import TableContainer from "../../../Components/Common/TableContainer";

const initialValues: FeeCollectorsProps = {
  search: "",
};

const FeeCollectors = () => {
  const [feeCollectorsFilterState, setFeeCollectorsFilterState] =
    useState<FeeCollectorsProps>(initialValues);

  const feeCollectorsFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: feeCollectorsFilterState,
    onSubmit: (values) => {},
  });

  const roleColumns = useMemo(() => generateColumns(), []);

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Employee Concession" pageTitle="Fee" />
          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">
                    Fee Collectors
                  </h4>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="py-3 px-3">
                <form>
                  <div className="row">
                    <div className="col-2">
                      <div className="search-box">
                        <TextInput
                          name="search"
                          value={feeCollectorsFilterForm.values.search}
                          onChange={feeCollectorsFilterForm.handleChange}
                          inputClassName="bg-soft-light"
                          formgroupClassName="mb-0"
                          placeHolder="Search..."
                        />

                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <TableContainer
                columns={roleColumns || []}
                data={FeeCollectorsData}
                divClass="table-responsive mb-1"
                theadClass="table-light text-muted"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeeCollectors;
