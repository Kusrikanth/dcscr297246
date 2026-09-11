import { useMemo } from "react";
import TableContainer from "../../../../../../Components/Common/TableContainer";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowReloadHorizontalIcon,
  Cancel01Icon,
  ViewIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { generateColumns, tableData } from "./helper";
import BreadCrumb from "../../../../../../Components/Common/BreadCrumb";

import dummyStudent from "../../../../../../assets/imagesdps/student-default-img.png";
import { TextInput } from "../../../../../../Components/Common";

const ViewStudentQuestionsList = () => {
  const menuOptions = useMemo(
    () => [
      {
        id: "view",
        actionIcon: (
          <HugeiconsIcon
            icon={ViewIcon}
            className="me-2 d-inline-block"
            size={18}
            color="#878a99"
          />
        ),
        actionName: "View",
      },
      //   {
      //     id: "remove",
      //     actionIcon: (
      //       <HugeiconsIcon
      //         icon={Cancel01Icon}
      //         className="me-2 d-inline-block text-danger"
      //         size={18}
      //         color="#878a99"
      //       />
      //     ),
      //     actionName: "Remove",
      //     onClickHndlr: (event: any) => {},
      //   },
    ],
    []
  );

  const tableColumns = useMemo(() => generateColumns(menuOptions), []);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb pageTitle="LMS"></BreadCrumb>

        <div className="card">
          <div className="card-header">
            <div className="tw-border tw-rounded-lg tw-p-4 tw-bg-white tw-flex tw-gap-4">
              <div className="tw-flex tw-items-center tw-gap-4 tw-flex-1">
                <img
                  src={dummyStudent}
                  alt="Student"
                  className="tw-w-16 tw-h-16 tw-rounded-full tw-object-cover tw-flex-shrink-0"
                />
                <div>
                  <h2 className="tw-font-semibold tw-text-lg tw-text-gray-800 tw-mb-0">
                    Anjali Kumar
                  </h2>
                  <p className="tw-text-sm tw-text-gray-600 tw-mb-1">
                    ASM4001 – Math Unit Test (Algebra)
                  </p>
                  <p className="tw-text-gray-500 tw-mb-0">
                    Submitted 15 Aug 2025, 10:20 AM
                  </p>
                </div>
              </div>

              <div>
                <div className="tw-flex tw-gap-4 tw-text-sm tw-mb-4">
                  <div className="tw-flex tw-justify-between tw-bg-slate-200 tw-px-2 tw-py-0.5 tw-rounded">
                    <span className="tw-font-medium tw-text-gray-500 tw-me-2">
                      Attempt:
                    </span>
                    <span>28/30</span>
                  </div>
                  <div className="tw-flex tw-justify-between tw-bg-slate-200 tw-px-2 tw-py-0.5 tw-rounded">
                    <span className="tw-font-medium tw-text-gray-500 tw-me-2">
                      Auto:
                    </span>
                    <span className="tw-text-green-600 tw-font-semibold">
                      45/50
                    </span>
                  </div>
                  <div className="tw-flex tw-justify-between tw-bg-slate-200 tw-px-2 tw-py-0.5 tw-rounded">
                    <span className="tw-font-medium tw-text-gray-500 tw-me-2">
                      Submission:
                    </span>
                    <span>Pending Approval</span>
                  </div>
                  <div className="tw-flex tw-justify-between tw-bg-slate-200 tw-px-2 tw-py-0.5 tw-rounded">
                    <span className="tw-font-medium tw-text-gray-500 tw-me-2">
                      Late:
                    </span>
                    <span>4 5</span>
                  </div>
                </div>
                <div className="tw-flex tw-gap-4 tw-justify-end">
                  <button className="btn btn-sm btn-outline-secondary">
                    Give Overall Feedback
                  </button>
                  <button className="btn btn-sm btn-outline-success">
                    Approve
                  </button>
                  <button className="btn btn-sm btn-outline-primary">
                    Send Back
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="row p-3 g-3">
              <div className="col-12 col-md-6 col-lg-4 col-xl-3">
                <div className="search-box">
                  <TextInput
                    name="searchString"
                    formgroupClassName="mb-0"
                    placeHolder="Search..."
                    value={""}
                    onChange={() => {}}
                    floatingLabel
                    labelText="Search"
                  />
                  <i className="ri-search-line search-icon"></i>
                </div>
              </div>
            </div>
            <TableContainer
              columns={tableColumns || []}
              data={tableData || []}
              divClass="table-responsive mb-3 fs-12"
              tableClass="table-nowrap"
              theadClass="table-light text-muted align-middle"
              showPagination={true}
              // showCheckbox={true}
              totalPages={0}
              totalRecords={0}
            ></TableContainer>
          </div>

          {/* <div className="card-footer">
            <div className="tw-flex tw-items-center">
              <p className="tw-mb-0">
                Over All Feedback : Multi Text Box        
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ViewStudentQuestionsList;
