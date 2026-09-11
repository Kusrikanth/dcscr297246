import { useMemo } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { generateColumns, tableData } from "./helper";
import { TextInput } from "../../../Components/Common";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import StatusCard from "./FeedBackStats";
import Button from "../../../Components/Common/Button";

const FeedbackRating = () => {
  const tableColumns = useMemo(() => generateColumns(), []);

  return (
    <>
      <div className="tw-p-6">
        <div className="tw-max-w-full">
          <BreadCrumb title="Feedback" pageTitle="Helpdesk" />

          <StatusCard />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mt-4">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <h4 className="tw-text-lg tw-font-semibold tw-flex-grow tw-mb-0">
                  Ratings
                </h4>
              </div>
            </div>

            <div className="tw-p-0">
              <div className="tw-p-4">
                <div className="tw-grid tw-grid-cols-12 tw-gap-3">

                  <div className="tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-3">
                    <div className="tw-relative">
                      <TextInput
                        name="searchString"
                        value={""}
                        onChange={() => { }}
                        inputClassName="tw-bg-gray-100"
                        formgroupClassName="tw-mb-0"
                        placeHolder="Search"
                        labelText="Search"
                        floatingLabel
                      />
                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400" />
                    </div>
                  </div>

                  <div className="tw-col-span-9 tw-ml-auto tw-flex tw-items-end">
                    <Button
                      id="export-btn"
                      variant="exportBtn"
                      onClick={() => { }}
                    >
                      <img
                        src={ExportIcon}
                        alt="export-icon"
                        className="tw-h-5 tw-w-5"
                      />
                    </Button>

                    <UncontrolledTooltip placement="bottom" target="export-btn">
                      Export
                    </UncontrolledTooltip>
                  </div>

                </div>
              </div>

              <TableContainer
                columns={tableColumns || []}
                data={tableData || []}
                tableClass="tw-mb-0"
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showPagination={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackRating;
