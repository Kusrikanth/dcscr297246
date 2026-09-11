import { useFormik } from 'formik';

import { useMemo, useState } from 'react';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowDataTransferVerticalIcon,
  Download01Icon,
  FilterIcon,
  GridViewIcon,
  LeftToRightListBulletIcon,
  Link05Icon,
  MoreVerticalCircle01Icon,
  PlusSignIcon,
  Settings01Icon,
  Upload01Icon,
} from '@hugeicons-pro/core-stroke-standard';
import { fileExplorerData, generateColumns } from './helper';
import BreadCrumb from '../../../../../Components/Common/BreadCrumb';
import UpdatedHorizontalTab from '../../../../../Components/Common/UpdatedHorizontalTab';
import { TextInput } from '../../../../../Components/Common';
import Button from '../../../../../Components/Common/Button';
import TableContainer from '../../../../../Components/Common/TableContainer';
import { useLocation } from 'react-router-dom';
import { roomsData } from '../helper';

const initialValues = {
  searchString: '',
};
interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
  Icon?: any;
}

const viewMenuOptions: Array<IMenuOptions> = [
  {
    id: 'table-view',
    labelName: '',
    Icon: <HugeiconsIcon icon={LeftToRightListBulletIcon}></HugeiconsIcon>,
    customPadding: '',
  },
  {
    id: 'grid-view',
    labelName: '',
    Icon: <HugeiconsIcon icon={GridViewIcon}></HugeiconsIcon>,
    customPadding: '',
  },
];

const RoomsDetails = () => {
  const [activeViewId, setActiveViewId] = useState('table-view');
  const location = useLocation();
  const { selectedItemId }: any = location.state || {};
  const branchStorageFormik = useFormik({
    initialValues,
    onSubmit: () => {},
  });

  const navigatedItem = roomsData.find(
    (item) => +item.uniqueId === +selectedItemId,
  );
  console.log(navigatedItem);
  const { name, type, tags, owner, lastActivity } = navigatedItem || {};

  const menuOptions = useMemo(() => [], []);

  function activeViewHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute('data-id') || '';
    setActiveViewId(menuId);
  }

  const tableColumns = useMemo(() => generateColumns(menuOptions), []);

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="Rooms" />
          <div className="tw-card">
            <div className="tw-card-header">
              <div className="tw-flex tw-justify-between tw-items-center">
                <div>
                  <p className="tw-card-title">{name}</p>
                  <ul className="tw-mb-0 tw-text-zinc-400 tw-text-xs tw-flex tw-gap-x-2 tw-ps-0 tw-list-none">
                    <li className="">{type}</li>
                    <li className="before:tw-content-[''] before:tw-inline-block before:tw-w-1 before:tw-h-1 before:tw-rounded-full before:tw-bg-zinc-400 before:tw-mr-1 before:tw-align-middle">
                      2 Folder
                    </li>
                    <li className="before:tw-content-[''] before:tw-inline-block before:tw-w-1 before:tw-h-1 before:tw-rounded-full before:tw-bg-zinc-400 before:tw-mr-1 before:tw-align-middle">
                      2 Files
                    </li>
                  </ul>
                </div>
                <div className="tw-flex tw-gap-2 tw-items-center">
                  <Button
                    variant="secondary"
                    className="tw-flex tw-items-center tw-gap-2"
                  >
                    <HugeiconsIcon
                      icon={Upload01Icon}
                      size={16}
                    ></HugeiconsIcon>
                    Upload
                  </Button>
                  <Button
                    variant="secondary"
                    className="tw-flex tw-items-center tw-gap-2"
                  >
                    <HugeiconsIcon
                      icon={Download01Icon}
                      size={16}
                    ></HugeiconsIcon>
                    Download All
                  </Button>
                </div>
              </div>
            </div>
            <div className="tw-card-body">
              <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-12 tw-gap-3 tw-items-center tw-mb-4">
                <div className="lg:tw-col-span-4">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      placeHolder="Search..."
                      value={branchStorageFormik.values.searchString}
                      onChange={branchStorageFormik.handleChange}
                      formgroupClassName="mb-0"
                    ></TextInput>
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="lg:tw-col-start-12 tw-justify-self-end">
                  <div className="tw-flex tw-items-center tw-gap-2">
                    <Button variant="secondary">
                      <HugeiconsIcon
                        icon={FilterIcon}
                        size={18}
                      ></HugeiconsIcon>
                    </Button>
                    <Button variant="secondary">
                      <HugeiconsIcon
                        icon={ArrowDataTransferVerticalIcon}
                        size={18}
                      ></HugeiconsIcon>
                    </Button>
                    <div className="tw-shrink-0">
                      <UpdatedHorizontalTab
                        MenuOptions={viewMenuOptions}
                        clickMenuHandler={activeViewHandler}
                        activeTabId={activeViewId}
                        horizontalClass="tw-flex tw-justify-end tw-gap-2 horizontal-menu-updated-style"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <TableContainer
                  data={fileExplorerData || []}
                  columns={tableColumns}
                  divClass="tw-border tw-rounded-lg tw-shadow tw-overflow-hidden table-responsive tw-mb-3"
                  theadClass="table-light text-muted align-middle"
                ></TableContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomsDetails;
