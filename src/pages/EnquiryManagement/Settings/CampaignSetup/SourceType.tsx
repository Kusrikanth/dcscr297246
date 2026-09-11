import React, { useMemo } from 'react'
import TableContainer from '../../../../Components/Common/TableContainer'
import { dummyData, generateColumns } from './helper';
import { ModalContainerUpdated, OffCanvasContainer, TextInput } from '../../../../Components/Common';
import { UncontrolledTooltip } from 'reactstrap';
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { useModal } from '../../../../hooks/modalhook';
import AddTypeofWorkModal from '../../../NewAcademics/TypeofWork/AddTypeofWorkModal';
import AddSourceTypeModal from './AddSourceTypeModal';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02StrokeStandard, PencilEdit02Icon } from '@hugeicons-pro/core-stroke-standard';


const SourceType = () => {
    const { modalState: manageStaff, closeModal: closeManageStaffModalHndlr,
        openModal: openManageStaffModalHndlr
    } = useModal();
  const menuOptions = useMemo(
    () => [
        {
          id: "edit",
          actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={20} />,
          actionName: "Edit Details",
        },
        {
            id: "delete",
            actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
            actionName: "Delete Details",
        },
    ], []);

  const roleColumns = useMemo(() => generateColumns(menuOptions),[menuOptions]);

  return (
    <>
        <div className="card ">
            <div className="card-header">
                <div className="row align-items-center">
                <div className="col-6">
                    <h4 className="card-title mb-0 flex-grow-1">
                    Source Types
                    </h4>
                </div>
                <div className="col-auto ms-auto">
                    <button
                        className="btn btn-success float-end d-flex align-items-center"
                        onClick={() => openManageStaffModalHndlr()}
                    >
                        Add Source Status
                    </button>
                </div>
                </div>
            </div>
            <div className="card-body">
                <div className="row g-3">
                    <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
                        <div className="search-box">
                            <TextInput
                                name="searchString"
                                inputClassName="bg-soft-light"
                                formgroupClassName="mb-0"
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
            divClass="table-responsive mb-3"
            theadClass="table-light text-muted align-middle"
            showPagination={false}
            />
            <ModalContainerUpdated
                id="add-upload-documents-modal"
                isOpen={manageStaff.showModal}
                toggle={closeManageStaffModalHndlr}
                modalTitle="Add Source Types "
                modalSize="md"
            >
                <AddSourceTypeModal toggle={()=>closeManageStaffModalHndlr()} isOpen={manageStaff.showModal} />
            </ModalContainerUpdated>
        </div>
        
    </>
  )
}

export default SourceType