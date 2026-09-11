import { useFormik } from "formik";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { SlabsFilterProps } from "./SlabsTypes";
import { generateColumns } from "./helper";
import SlabsModal from "./SlabsModal";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getSlabsListAct, getSlabsListByIdAct } from "../../../../store/transportation/transportationaction";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { toast } from "react-toastify";
import { useModal } from "../../../../hooks/modalhook";
import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";


const initialValues: SlabsFilterProps = {
  search: "",
  academicYear: "20222-23",
};

const Slabs = () => {

  const dispatch = useAppDispatch()

  const { modalState: slabsModal, closeModal: closeSlabsModalHndlr,
    openModal: openSlabsModalHndlr
  } = useModal();

  const { currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    transportationErrorAct,
    getSlabsListResp,
    createSlabsListResp,
    deleteSlabsListResp,
    editSlabsListResp,
  } = useAppSelector(({ transportrequest, appData, globalData }) => ({

    currentBranchIdResp: appData.currentBranchIdResp,
    currentInstIdResp: appData.currentInstIdResp,
    showApiLoader: globalData.showApiLoader,
    getSlabsListResp: transportrequest.getSlabsListResp,
    transportationErrorAct: transportrequest.transportationErrorAct,
    createSlabsListResp: transportrequest.createSlabsListResp,
    deleteSlabsListResp: transportrequest.deleteSlabsListResp,
    editSlabsListResp: transportrequest.editSlabsListResp,
  }), shallowEqual);

  const slabsRespRef = useRef({
    prevTransportationErrorAct: transportationErrorAct,
    prevCreateSlabsListResp: createSlabsListResp,
    prevDeleteSlabsListResp: deleteSlabsListResp,
    prevEditSlabsListResp: editSlabsListResp,

  });

  useEffect(() => {
    const { prevTransportationErrorAct, prevCreateSlabsListResp, prevDeleteSlabsListResp, prevEditSlabsListResp } = slabsRespRef.current;
    if (transportationErrorAct && prevTransportationErrorAct !== transportationErrorAct) {
      const { details } = transportationErrorAct || {};
      toast.error(details || "Something went wrong.");
    }
    else if (createSlabsListResp && prevCreateSlabsListResp !== createSlabsListResp) {
      closeSlabsModalHndlr()
      toast.success("Slabs Added Successfully.")
      getSlabsList("")
    }
    else if (editSlabsListResp && prevEditSlabsListResp !== editSlabsListResp) {
      closeSlabsModalHndlr()
      toast.success("Slabs Edited Successfully.")
      getSlabsList("")
    }
    slabsRespRef.current.prevTransportationErrorAct = transportationErrorAct;
    slabsRespRef.current.prevCreateSlabsListResp = createSlabsListResp;
    slabsRespRef.current.prevDeleteSlabsListResp = deleteSlabsListResp;
    slabsRespRef.current.prevEditSlabsListResp = editSlabsListResp;

  }, [createSlabsListResp, deleteSlabsListResp, transportationErrorAct, editSlabsListResp]);

  const slabsFilterForm = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {

    },
  });
  const menuOptions = useMemo((): IOptionsHrtl[] => ([{
    id: "edit",
    actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={20} />,
    actionName: "Edit",
    onClickHndlr: editSlabsListHndlr,
  },
  ]), []);

  function editSlabsListHndlr(event: any) {
    const slabId = event.currentTarget.getAttribute("data-id")
    if (slabId) {
      dispatch(getSlabsListByIdAct(generateActionPayload("get_slabs_list_by_id", { slabId }, undefined)))
    }
    openSlabsModalHndlr(slabId)
  }
  function getSlabsList(otherProps?: any) {
    dispatch(getSlabsListAct(generateActionPayload("get_slabs_list", undefined, { slabName: otherProps || null, branchId, instituteId })));
  }

  useEffect(() => {
    getSlabsList()
  }, [branchId, instituteId])

  const filterHandler = (event: any) => {
    slabsFilterForm.handleChange(event)
    getSlabsList(event.target.value)
  }

  const roleColumns = useMemo(() => generateColumns(menuOptions), []);

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Transport Concession" pageTitle="Transportation" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            <div className="tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center tw-justify-between">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">
                  Slabs
                </h4>
                <div className="lg:tw-col-span-9 xl:tw-col-span-10 tw-flex tw-justify-end">
                  <Button
                    onClick={() => openSlabsModalHndlr()}
                    variant="primary"
                  >
                    <i className="ri-add-line" />
                    Add New
                  </Button>
                </div>
              </div>
            </div>

            <div className="tw-p-4">
              <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-4 tw-items-end">
                <div className="lg:tw-col-span-3 xl:tw-col-span-4">
                  <div>
                    <div className="search-box tw-relative">
                      <TextInput
                        name="search"
                        value={slabsFilterForm.values.search}
                        onChange={filterHandler}
                        formgroupClassName="tw-mb-0"
                        placeHolder="Search"
                        labelText="Search"
                        floatingLabel
                      />
                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-2 tw-text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <TableContainer
              columns={roleColumns || []}
              data={getSlabsListResp || []}
              divClass="tw-overflow-x-auto tw-mb-1"
              theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
            />
          </div>
        </div>
        <ModalContainerUpdated
          id="add-edit-slabs-details"
          isOpen={slabsModal.showModal}
          toggle={closeSlabsModalHndlr}
          modalTitle={slabsModal.modalData ? "Edit Slabs" : "Add Slabs"}
          modalSize="md"
        >
          <SlabsModal
            isOpen={slabsModal.showModal}
            toggle={closeSlabsModalHndlr}
            modalTitle="Add Slabs"
            slabId={slabsModal.modalData}
            editBranchDetails=""
          />
        </ModalContainerUpdated>
      </div>
    </>
  );
};

export default Slabs;
