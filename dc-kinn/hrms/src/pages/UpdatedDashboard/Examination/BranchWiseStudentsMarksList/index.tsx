import { useMemo } from "react";
import { Button, TableExpandable, TextInput } from "../../../../Components/Common";
import { generateColumns, tableData } from "./helper";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";

const BranchWiseStudentsMarksList = () => {
  const tableColumns = useMemo(() => generateColumns(), []);
  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Examination" pageTitle="Raw Data"></BreadCrumb>

          <div className="card">
            <div className="card-header">
              <div className="tw-grid tw-grid-cols-12 tw-items-center">
                <div className="tw-col-span-12 lg:tw-col-span-6">
                  <h4 className="card-title tw-mb-0">
                    Branch wise Students Marks
                  </h4>
                </div>
                <div className="tw-col-span-12 lg:tw-col-span-6">
                  <div className="tw-flex">
                    <Button
                      id="export-btn"
                      variant="exportBtn"
                    >
                      <img
                        src={ExportIcon}
                        className="tw-w-5 tw-h-5"
                        alt="Export"
                      />
                      <UncontrolledTooltip
                        placement="bottom"
                        target="export-btn"
                      >
                        Export
                      </UncontrolledTooltip>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body tw-p-0">
              <div className="tw-grid tw-grid-cols-12 tw-p-3 tw-gap-3">
                <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-3">
                  <div className="search-box">
                    <TextInput
                      name="searchStr"
                      formgroupClassName="tw-mb-0"
                      placeHolder="Search..."
                      value={""}
                      onChange={() => {}}
                      labelText="Search"
                      floatingLabel
                    ></TextInput>
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
              </div>
              <TableExpandable
                columns={tableColumns || []}
                data={tableData || []}
                divClass="table-responsive student-log-book tw-mb-2 tw-h-[598px] table-sticky"
                theadClass="text-muted tw-align-middle theadPrimary"
                tableClass="table-bordered table-nowrap"
              ></TableExpandable>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BranchWiseStudentsMarksList;
