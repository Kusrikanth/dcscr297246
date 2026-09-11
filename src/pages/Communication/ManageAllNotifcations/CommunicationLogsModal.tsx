import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, DateInput, SelectInput, TextInput } from '../../../Components/Common'
import { useFormik } from 'formik';
import { StatusCommunicationLogsTableData, communicationChannel, generateStatusCommunicationLogsColumns, userTypeOptions } from './helper';
import TableContainer from '../../../Components/Common/TableContainer';
import { UncontrolledTooltip } from 'reactstrap';
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";

const initialValues = {
  search: "",
  communicationChannel: "",
  userType: "",
  date: "",
};

const CommunicationLogsModal = (props: any) => {

  const [examinationName, setExaminationName] = useState(initialValues);

  const userDefinedTemplateForm = useFormik({
    enableReinitialize: true,
    initialValues: examinationName,
    onSubmit: (values) => { },
  });

  const columns = useMemo(() => generateStatusCommunicationLogsColumns(), []);

  return (
    <>
      <form>
        <div className="!tw-pt-2 !tw-gap-3">
            <div className="!tw-flex !tw-flex-wrap !tw-px-3 !tw-gap-3">
              <div className="!tw-w-full lg:!tw-w-1/4 xl:!tw-w-1/4">
                <div className="search-box">
                  <TextInput
                    name="search"
                    formgroupClassName="!tw-mb-0"
                    placeHolder="Search..."
                    labelText="Search"
                    value={userDefinedTemplateForm.values.search}
                    onChange={userDefinedTemplateForm.handleChange}
                  />
                  <i className="ri-search-line search-icon !tw-mt-3"></i>
                </div>
              </div>
              <div className="!tw-w-full lg:!tw-w-1/6 xl:!tw-w-1/6">
                <SelectInput
                  name="communicationChannel"
                  value={userDefinedTemplateForm.values.communicationChannel}
                  onChange={userDefinedTemplateForm.handleChange}
                  menuItems={communicationChannel}
                  valueKey="id"
                  textKey="name"
                  labelText='Communication Channel'
                  labelClass=' '
                  formgroupClassName='!tw-mb-1'
                  defaultSelect='Select'
                  invalid={(userDefinedTemplateForm.touched.communicationChannel && userDefinedTemplateForm.errors.communicationChannel) ? true : false}
                  error={(userDefinedTemplateForm.touched.communicationChannel && userDefinedTemplateForm.errors.communicationChannel) ? userDefinedTemplateForm.errors.communicationChannel : ""}
                />
              </div>
              <div className="!tw-w-full lg:!tw-w-1/6 xl:!tw-w-1/6">
                <SelectInput
                  name="userType"
                  value={userDefinedTemplateForm.values.userType}
                  onChange={userDefinedTemplateForm.handleChange}
                  menuItems={userTypeOptions}
                  valueKey="id"
                  textKey="name"
                  labelText='User Type'
                  labelClass=' '
                  formgroupClassName='!tw-mb-1'
                  defaultSelect='Select'
                  invalid={(userDefinedTemplateForm.touched.userType && userDefinedTemplateForm.errors.userType) ? true : false}
                  error={(userDefinedTemplateForm.touched.userType && userDefinedTemplateForm.errors.userType) ? userDefinedTemplateForm.errors.userType : ""}
                />
              </div>
              <div className="!tw-w-full lg:!tw-w-1/6 xl:!tw-w-1/6">
                <DateInput
                  name="date"
                  labelText="Date"
                  value={userDefinedTemplateForm.values.date}
                  onChange={userDefinedTemplateForm.handleChange}
                  placeHolder="Date"
                />
              </div>
              <div className="!tw-w-auto !tw-ml-auto !tw-flex !tw-items-center">
                <Button 
                  id="export-btn" 
                  variant="exportBtn"
                  type="button"
                >
                  <img src={ExportIcon} className="!tw-max-w-full !tw-h-full" />
                  <UncontrolledTooltip placement="bottom" target="export-btn">
                    Export
                  </UncontrolledTooltip>
                </Button>
              </div>
            </div>

        </div>
        <TableContainer
          columns={columns}
          data={StatusCommunicationLogsTableData}
          tableClass="!tw-mb-0"
          divClass="table-responsive !tw-mb-3"
          theadClass="table-light !tw-text-gray-500 !tw-align-middle"
          showPagination={true}
          showCheckbox={false}
          totalPages={10}
          callbackPaginationHndlr={() => { }}
          currentPageNumber={1}
        />
      </form>
    </>
  )
}

export default CommunicationLogsModal