import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";

import {
    HostelStudentLedgerTableData,
  generateColumns,
} from "./helper";

const initialValues = {
  search: "",
  year: "2022-23",
  class: "Class",
  curriculam: "Curriculam",
};

const CautionFeeConcessions = () => {
  const [EligibilityPromoteModelState, setEligibilityPromoteModelState] =
  useState({
    showModal: false,
    branchId: "",
  });

  const [EligibilityPromote, setEligibilityPromote] = useState(initialValues);
  const EligibilityPromoteForm = useFormik({
    enableReinitialize: true,
    initialValues: EligibilityPromote,
    onSubmit: (values) => {},
  });

  const menuOptions = useMemo(
    () => [
      // {
      //   id: "removePromotion",
      //   actionIcon: <span className="text-info text-decoration-underline">Remove Promotion</span>,
      //   actionName: "Remove Promotion",
      //   onClick: () => {},
      // },
      {
        id: "revert",
        actionIcon: <span className="text-info text-decoration-underline">Revert</span>,
        actionName: "Revert",
        onClick: () => {},
      },
    ],
    []
  );

  const columns = useMemo(() => generateColumns(), []);

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Eligibility For Promote" pageTitle="Hostel" />

          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">
                  Hostel Caution Fee Concessions
                  </h4>
                </div>

              </div>
            </div>
            <div className="d-inline-block w-100">
              <form onSubmit={EligibilityPromoteForm.handleSubmit}>
                <div className="row px-3 g-3 pb-3 pt-3">
                  <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
                    <div className="search-box">
                      <TextInput
                        name="search"
                        formgroupClassName="mb-0"
                        value={EligibilityPromoteForm.values.search}
                        onChange={EligibilityPromoteForm.handleChange}
                        labelText="Search"
                        placeHolder="Search"
                        floatingLabel
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                    <SelectInput
                      name="year"
                      value={EligibilityPromoteForm.values.year}
                      onChange={EligibilityPromoteForm.handleChange}
                      menuItems={[]}
                      valueKey="yearType"
                      textKey="yearType"
                      formgroupClassName="mb-0"
                      labelText="Academic Year"
                      floatingLabel
                    />
                  </div>
                  <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                    <SelectInput
                      name="curriculam"
                      value={EligibilityPromoteForm.values.curriculam}
                      onChange={EligibilityPromoteForm.handleChange}
                      menuItems={[]}
                      valueKey="curriculamType"
                      textKey="curriculamType"
                      formgroupClassName="mb-0"
                      labelText="Curriculam"
                      floatingLabel
                    />
                  </div>
                  <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                    <SelectInput
                      name="class"
                      value={EligibilityPromoteForm.values.class}
                      onChange={EligibilityPromoteForm.handleChange}
                      menuItems={[]}
                      valueKey="classType"
                      textKey="classType"
                      formgroupClassName="mb-0"
                      labelText="Class"
                      floatingLabel
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="card-body p-0">
              <TableContainer
                columns={columns || []}
                data={HostelStudentLedgerTableData}
                tableClass="mb-0"
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle"
                showCheckbox={false}
                showPagination={true}
                totalPages={10}
                callbackPaginationHndlr={() => {}}
                currentPageNumber={1}
              />
            </div>
          </div>
        </div>
      </div>
      {/* <ModalContainerUpdated
        id="detensions-or-promotions"
        isOpen={EligibilityPromoteModelState.showModal}
        toggle={toggleEligibilityPromoteModel}
        modalTitle="Eligibility For Promote"
        modalSize="xl"
      >
        <EligibilityPromoteModel
          isOpen={EligibilityPromoteModelState.showModal}
          toggle={toggleEligibilityPromoteModel}
          modalTitle="Eligibility For Promote"
          instituteName={"Eligibility For Promote"}
          branchId={EligibilityPromoteModelState.branchId}
          editBranchDetails={""}
        />
      </ModalContainerUpdated> */}
    </>
  );
};

export default CautionFeeConcessions;
