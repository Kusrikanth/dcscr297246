import React, { useMemo } from 'react'
import TableContainer from '../../../../Components/Common/TableContainer'
import { dummyData, generateColumns } from './helper';
import { ModalContainerUpdated, OffCanvasContainer, TextInput } from '../../../../Components/Common';
import { UncontrolledTooltip } from 'reactstrap';
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { useModal } from '../../../../hooks/modalhook';
import AddTypeofWorkModal from '../../../NewAcademics/TypeofWork/AddTypeofWorkModal';
import AddLeadStatusModal from './AddLeadStatusModal';
import { Delete02StrokeStandard, PencilEdit02Icon } from '@hugeicons-pro/core-stroke-standard';
import { HugeiconsIcon } from '@hugeicons/react';
import Button from '../../../../Components/Common/Button';


const LeadStatus = () => {
    const { modalState: manageStaff, closeModal: closeManageStaffModalHndlr,
        openModal: openManageStaffModalHndlr
    } = useModal();

  const menuOptions = useMemo(
    () => [
        {
          id: "edit",
          actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="tw-text-gray-500" size={20} />,
          actionName: "Edit Details",
        },
        {
            id: "delete",
            actionIcon:<HugeiconsIcon icon={Delete02StrokeStandard} className="tw-text-red-500" size={18} />,
            actionName: "Delete Details",
        },
    ], []);

  const roleColumns = useMemo(() => generateColumns(menuOptions),[menuOptions]);

  return (
    <>
        <div className="card">
            <div className="card-header">
                <div className="tw-flex tw-items-center tw-justify-between">
                <div className="tw-w-1/2">
                    <h4 className="card-title tw-mb-0 tw-flex-grow">
                    Lead Status Type
                    </h4>
                </div>
                <div className="tw-ml-auto">
                    <Button
                        variant="primary"
                        onClick={() => openManageStaffModalHndlr()}
                    >
                        Add Lead Status
                    </Button>
                </div>
                </div>
            </div>
            <div className="card-body">
                <div className="tw-flex tw-flex-wrap tw-gap-3">
                    <div className="tw-w-full lg:tw-w-1/3 xl:tw-w-1/4">
                        <div className="search-box">
                            <TextInput
                                name="searchString"
                                // value={filterState.searchString}
                                // onChange={filterHandler}
                                inputClassName="tw-bg-gray-100"
                                formgroupClassName="tw-mb-0"
                                placeHolder="Search..."
                            />

                            <i className="ri-search-line search-icon"></i>
                        </div>
                    </div>
                </div>
            </div>
            <TableContainer
            columns={roleColumns || []}
            data={[]}
            divClass="table-responsive tw-mb-3"
            theadClass="table-light tw-text-gray-500 tw-align-middle"
            showPagination={false}
            />
            <ModalContainerUpdated
                id="add-upload-documents-modal"
                isOpen={manageStaff.showModal}
                toggle={closeManageStaffModalHndlr}
                modalTitle="Add Lead Status"
                modalSize="md"
            >
                <AddLeadStatusModal toggle={()=>closeManageStaffModalHndlr()} isOpen={manageStaff.showModal} />
            </ModalContainerUpdated>
        </div>
        
    </>
  )
}

export default LeadStatus