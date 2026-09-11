import React, { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns, ExaminationWeightageTableData, } from "./helper";
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { default as DeleteIconSvg } from "../../../../assets/imagesdps/academics/DeleteIconSvg.svg?react";
import { useFormik } from "formik";
import classnames from "classnames";
import { UncontrolledTooltip } from "reactstrap";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  search: "",
  year: "2022-23",
  class: "Class",
  term: "term",
};

const CommunicationBatchReport = () => {

  const [communicationReports, setCommunicationReports] = useState(initialValues);
  const communicationBatchForm = useFormik({
    enableReinitialize: true,
    initialValues: communicationReports,
    onSubmit: (values) => { },
  });

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <EditSvg color="#405189" />,
        actionName: "Edit",
      },
      {
        id: "view",
        actionIcon: <i className={classnames("me-2 ri-eye-fill text-primary fs-16")}></i>,
        actionName: "View Details",
      },
      {
        id: "delete",
        actionIcon: <DeleteIconSvg className="me-2" fill="#f06548" />,
        actionName: "Delete",
        onClick: () => { },
      },
    ],
    []
  );

  const columns = useMemo(() => generateColumns(menuOptions), []);

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Communication" pageTitle="Communication" />

          <div className="tw-bg-white tw-rounded tw-shadow">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Communication Batch Reports
                  </h4>
                </div>

                <div className="tw-ml-auto tw-flex tw-items-center">
                  <Button
                    id="export-btn"
                    variant="exportBtn"
                  >
                    <img src={ExportIcon} className="tw-h-full tw-w-auto" />
                    <UncontrolledTooltip placement="bottom" target="export-btn">
                      Export
                    </UncontrolledTooltip>
                  </Button>
                </div>
              </div>
            </div>

            <div className="tw-p-0">
              <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-4 tw-gap-3 tw-px-4 tw-py-4">
                <div className="lg:tw-col-span-1">
                  <div className="tw-relative">
                    <div className="search-box">
                      <TextInput
                        name="search"
                        formgroupClassName="tw-mb-0"
                        placeHolder="Search..."
                        value={communicationBatchForm.values.search}
                        onChange={communicationBatchForm.handleChange}
                      />
                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <TableContainer
              columns={columns || []}
              data={ExaminationWeightageTableData}
              tableClass="tw-mb-0"
              divClass="tw-overflow-x-auto tw-mb-3"
              theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
              showPagination={true}
              totalPages={10}
              callbackPaginationHndlr={() => { }}
              currentPageNumber={1}
            />
          </div>
        </div>
      </div>

          </>
          );
};

          export default CommunicationBatchReport;
