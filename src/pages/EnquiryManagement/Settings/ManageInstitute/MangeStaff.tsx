import React, { useMemo } from 'react'
import TableContainer from '../../../../Components/Common/TableContainer'
import { dummyData, dummyDataManageStaff, generateColumns, generateColumnsManageStaff } from './helper';
import { OffCanvasContainer, TextInput } from '../../../../Components/Common';
import { UncontrolledTooltip } from 'reactstrap';
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { useModal } from '../../../../hooks/modalhook';
import CallDetailsModel from './AddStaffModel';
import AddStaffModel from './AddStaffModel';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02StrokeStandard, EyeIcon, PencilEdit02Icon } from '@hugeicons-pro/core-stroke-standard';
import Button from '../../../../Components/Common/Button';


const MangeStaff = () => {
    const { modalState: manageStaff, closeModal: closeManageStaffModalHndlr,
        openModal: openManageStaffModalHndlr
    } = useModal();
  const menuOptions = useMemo(
    () => [
        {
            id: "view",
            actionIcon:<HugeiconsIcon icon={EyeIcon} className="tw-text-gray-500" size={18} />,
            actionName: "View Details",
        },
        {
          id: "edit",
          actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="tw-text-gray-500" size={20} />,
          actionName: "Edit Details",
        },
        {
            id: "delete",
            actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-text-red-500" size={18} />,
            actionName: "Delete Details",
        },
    ], []);

  const roleColumns = useMemo(() => generateColumnsManageStaff(menuOptions),[menuOptions]);

  return (
    <>
        <div className="card">
            <div className="card-header">
                <div className="tw-flex tw-items-center tw-justify-between">
                <div className="tw-w-1/2">
                    <h4 className="card-title tw-mb-0 tw-flex-grow">
                    Manage Form
                    </h4>
                </div>
                <div className="tw-ml-auto tw-flex tw-items-center">
                    <Button
                        variant="primary"
                        onClick={() => openManageStaffModalHndlr()}
                    >
                        Add Staff
                    </Button>
                    <div className="tw-ml-2">
                        <div className="tw-flex">
                            <Button id="export-btn" variant='exportBtn'>
                                <img src={ExportIcon} className="tw-h-5 tw-w-5" />
                                <UncontrolledTooltip placement="bottom" target="export-btn">
                                    Export
                                </UncontrolledTooltip>
                            </Button>
                        </div>
                    </div>
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
            data={dummyDataManageStaff || []}
            divClass="table-responsive tw-mb-3"
            theadClass="table-light tw-text-gray-500 tw-align-middle"
            showPagination={false}
            />
        </div>
        <OffCanvasContainer
        isOpen={manageStaff.showModal}
        headerTitle="Add Staff"
        closeHndlr={closeManageStaffModalHndlr}
        id="AddStaff"
        customClass='w-50'
      >
        <AddStaffModel
        isOpen={manageStaff.showModal}
        toggel={closeManageStaffModalHndlr}
        />
      </OffCanvasContainer>
    </>
  )
}

export default MangeStaff