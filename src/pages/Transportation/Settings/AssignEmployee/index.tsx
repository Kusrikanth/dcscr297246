import { useFormik } from "formik";
import { Card, CardHeader, CardBody, Row, Col, Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import React, { useCallback, useMemo, useState } from "react";
import { ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { ISlabsTermsModal, SlabsTermsFilterProps } from "./SlabsTerms";
import { AcademicYear, generateColumns, SlabsData, TermsTypes } from "./helper";
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { default as DeleteSvg } from "../../../../assets/imagesdps/academics/DeleteIconSvg.svg?react";
import SlabsTermsModal from "./SlabsTermsModal";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import Button from "../../../../Components/Common/Button";

// import SlabsModal from "./SlabsModal";
// import SlabsModal from "./SlabsModal";
// import RoutesTabModal from "./RoutesTabModal";

const initialValues: SlabsTermsFilterProps = {
  search: "",
  academicYear: "20222-23",
  termsType: "",
};

const AssignEmployee = () => {
  const [slabsFilterState, setSlabsFilterState] =
    useState<SlabsTermsFilterProps>(initialValues);
  const [slabsModalState, setSlabsModalState] = useState<ISlabsTermsModal>({
    showModal: false,
    branchId: "",
  });
  const toggleSlabsModal = useCallback(() => {
    setSlabsModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  }, []);
  const slabsFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: slabsFilterState,
    onSubmit: (values) => {},
  });
  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <EditSvg className="d-inline-block" color="#405189" />,
        actionName: "Edit",
        // onClick: () => { },
      },
      // {
      //   id: "delete",
      //   actionIcon: <DeleteSvg className="d-inline-block" color="#405189" />,
      //   actionName: "Delete",
      //   // onClick: () => { },
      // },
    ],
    []
  );
  const roleColumns = useMemo(() => generateColumns(menuOptions), []);

  return (
    <>
      <div className="page-content transportaion_dashboard_wrapper">
      <div className="container-fluid">

          <BreadCrumb title="Dashboard" pageTitle="Transportation" />

          <Card>
            <CardHeader>
              <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">
                Assign Employee
              </h4>
            </CardHeader>

            <CardBody className="tw-p-0">
              <div className="tw-py-4 tw-px-4">

                <div className="tw-inline-block tw-w-full tw-mt-2">

                  <form
                    onSubmit={slabsFilterForm.handleSubmit}
                    className="tw-mb-3 tw-px-4"
                  >
                    <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-items-end">

                      <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                        <div className="tw-relative tw-w-full">
                          <TextInput
                            name="search"
                            value={slabsFilterForm.values.search}
                            onChange={slabsFilterForm.handleChange}
                            inputClassName="tw-bg-gray-100"
                            formgroupClassName="tw-mb-0"
                            placeHolder="Search"
                            labelText="Search"
                            floatingLabel
                          />
                          <i className="ri-search-line tw-absolute tw-right-3 tw-top-1/2 tw--translate-y-1/2 tw-text-gray-400" />
                        </div>
                      </div>

                      <div className="tw-col-span-12 tw-flex tw-justify-end">
                        <Button
                          type="button"
                          onClick={toggleSlabsModal}
                          variant="primary"
                        >
                          <i className="ri-add-line" />
                          Add New
                        </Button>
                      </div>

                    </div>
                  </form>

                  <TableContainer
                    columns={roleColumns || []}
                    data={SlabsData}
                    divClass="tw-overflow-x-auto tw-mb-1"
                    theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                    showPagination={true}
                    totalPages={10}
                    totalRecords={10}
                    callbackPaginationHndlr={() => { }}
                    currentPageNumber={0}
                  />

                </div>

                <ModalContainerUpdated
                  id="add-edit-assign-employees-details"
                  isOpen={slabsModalState.showModal}
                  toggle={toggleSlabsModal}
                  modalTitle={"Add Slabs"}
                  modalSize="md"
                >
                  <SlabsTermsModal
                    isOpen={slabsModalState.showModal}
                    toggle={toggleSlabsModal}
                    modalTitle={"Assign Employees"}
                    instituteId={"1"}
                    instituteName={""}
                    branchId={slabsModalState.branchId}
                    editBranchDetails={""}
                  />
                </ModalContainerUpdated>

              </div>
            </CardBody>
          </Card>

        </div>
      </div>
    </>
  );
};

export default AssignEmployee;
