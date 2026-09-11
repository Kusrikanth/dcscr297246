import { HugeiconsIcon } from '@hugeicons/react';

import {
  Delete03Icon,
  PencilEdit02Icon,
  Shield01Icon,
  UserAdd01Icon,
} from '@hugeicons-pro/core-stroke-standard';

import { generateColumns, userManagementData } from './helper';
import { useMemo } from 'react';

import AddEditPermissionsModal from './AddEditPermissionsModal';
import { useModal } from '../../../../../../hooks/modalhook';
import BreadCrumb from '../../../../../../Components/Common/BreadCrumb';
import Button from '../../../../../../Components/Common/Button';
import TableContainer from '../../../../../../Components/Common/TableContainer';
import { ModalContainerUpdated } from '../../../../../../Components/Common';

const BranchStorageConfiguration = () => {
  const {
    openModal: addEditPermissionsOpenModal,
    closeModal: addEditPermissionsCloseModal,
    modalState: addEditPermissionsModalState,
  } = useModal();

  const menuOptions = useMemo(
    () => [
      {
        id: 'edit',
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="text-muted"
            size={18}
          />
        ),
        actionName: 'Edit',
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
          addEditPermissionsOpenModal(id);
        },
      },
      {
        id: 'delete',
        actionIcon: (
          <HugeiconsIcon
            icon={Delete03Icon}
            className="tw-text-red-500"
            size={18}
          />
        ),
        actionName: 'Settings',
        onClickHndlr: (event: any) => {},
      },
    ],
    [],
  );

  const tableColumns = useMemo(() => generateColumns(menuOptions), []);

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="Branch Storage" />

          <div className="tw-card">
            <div className="tw-card-header">
              <div className="tw-w-full tw-flex tw-justify-between tw-items-center">
                <div className="tw-flex tw-gap-3 tw-items-center">
                  <div className="tw-h-10 tw-w-10 tw-rounded tw-border tw-bg-[#EFF6FF] tw-flex tw-items-center tw-justify-center">
                    <HugeiconsIcon
                      icon={Shield01Icon}
                      size={18}
                      className="tw-text-[#1E3A8A]"
                    ></HugeiconsIcon>
                  </div>
                  <div>
                    <h4 className="tw-card-title">DPS Hitech City</h4>
                    <ul className="tw-mb-0 tw-text-zinc-400 tw-text-xs tw-flex tw-gap-x-2 tw-ps-0 tw-list-none">
                      <li className="before:tw-content-[''] before:tw-inline-block before:tw-w-1 before:tw-h-1 before:tw-rounded-full before:tw-bg-zinc-400 before:tw-mr-1 before:tw-align-middle">
                        DPS009
                      </li>
                      <li className="before:tw-content-[''] before:tw-inline-block before:tw-w-1 before:tw-h-1 before:tw-rounded-full before:tw-bg-zinc-400 before:tw-mr-1 before:tw-align-middle">
                        10 users
                      </li>
                      <li className="before:tw-content-[''] before:tw-inline-block before:tw-w-1 before:tw-h-1 before:tw-rounded-full before:tw-bg-zinc-400 before:tw-mr-1 before:tw-align-middle">
                        DPS009
                      </li>
                      <li className="before:tw-content-[''] before:tw-inline-block before:tw-w-1 before:tw-h-1 before:tw-rounded-full before:tw-bg-zinc-400 before:tw-mr-1 before:tw-align-middle">
                        2 admins, 4 managers, 4 staff
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="tw-flex tw-items-center tw-gap-2">
                  <Button variant="secondary">Export</Button>
                  <Button
                    variant="primary"
                    className="tw-flex tw-gap-2 tw-items-center"
                    onClick={() => addEditPermissionsOpenModal()}
                  >
                    <HugeiconsIcon
                      icon={UserAdd01Icon}
                      size={18}
                    ></HugeiconsIcon>
                    Add User
                  </Button>
                </div>
              </div>
            </div>
            <div className="tw-card-body">
              <div>
                <TableContainer
                  data={userManagementData || []}
                  columns={tableColumns}
                  divClass="tw-border tw-rounded-lg tw-overflow-hidden table-responsive mb-3"
                  theadClass="table-light text-muted align-middle"
                  showPagination={true}
                  totalPages={10}
                  totalRecords={100}
                  currentPageNumber={0}
                  callbackPaginationHndlr={() => {}}
                  paginationContainerClass="tw-p-0"
                ></TableContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="addEditPermissionsModal"
        isOpen={addEditPermissionsModalState.showModal}
        toggle={addEditPermissionsCloseModal}
        modalTitle={
          addEditPermissionsModalState.modalData
            ? 'Edit Access Permissions'
            : 'Add Access Permissions'
        }
        modalSize="md"
      >
        <AddEditPermissionsModal
          editItemId={addEditPermissionsModalState.modalData}
          toggle={addEditPermissionsCloseModal}
        ></AddEditPermissionsModal>
      </ModalContainerUpdated>
    </>
  );
};

export default BranchStorageConfiguration;
