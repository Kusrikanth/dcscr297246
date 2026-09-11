import { useFormik } from 'formik';
import { OffCanvasContainer, TextInput } from '../../../../Components/Common';
import Button from '../../../../Components/Common/Button';
import TableContainer from '../../../../Components/Common/TableContainer';
import { useMemo, useState } from 'react';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowDataTransferVerticalIcon,
  FilterIcon,
  GridViewIcon,
  LeftToRightListBulletIcon,
  Link05Icon,
  MoreVerticalCircle01Icon,
  PlusSignIcon,
  Settings01Icon,
} from '@hugeicons-pro/core-stroke-standard';
import { roomsData, generateColumns } from './helper';
import BreadCrumb from '../../../../Components/Common/BreadCrumb';
import UpdatedHorizontalTab from '../../../../Components/Common/UpdatedHorizontalTab';
import AdvanceFilterModal from './AdvanceFilterModal';
import { useHistory } from 'react-router-dom';

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

const tabMenuOptions: Array<IMenuOptions> = [
  {
    id: 'academics',
    labelName: 'Academics',
    customPadding: '0px 5px 5px 5px',
  },
  {
    id: 'nonAcademics',
    labelName: 'Non Academics',
    customPadding: '0px 5px 5px 5px',
  },
];

const Rooms = () => {
  const [activeViewId, setActiveViewId] = useState('table-view');
  const [activeTabId, setActiveTabId] = useState('academics');
  const [openOffcan, setOpenOffcan] = useState<boolean>(false);

  const history = useHistory();
  const branchStorageFormik = useFormik({
    initialValues,
    onSubmit: () => {},
  });

  function handleNavigateRoomDetails(id: any) {
    history.push({
      pathname: '/rooms-details',
      state: {
        selectedItemId: id,
      },
    });
  }

  const menuOptions = useMemo(
    () => [
      {
        id: 'link',
        actionIcon: (
          <HugeiconsIcon icon={Link05Icon} className="text-muted" size={18} />
        ),
        actionName: 'Link',
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
        },
      },
      {
        id: 'configuration',
        actionIcon: (
          <HugeiconsIcon
            icon={Settings01Icon}
            className="text-muted"
            size={18}
          />
        ),
        actionName: 'Configuration',
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
          handleNavigateRoomDetails(id);
        },
      },
      {
        id: 'moreOptions',
        actionIcon: (
          <HugeiconsIcon
            icon={MoreVerticalCircle01Icon}
            className="text-muted"
            size={18}
          />
        ),
        actionName: 'More',
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
        },
      },
    ],
    [],
  );

  function activeViewHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute('data-id') || '';
    setActiveViewId(menuId);
  }
  function activeTabHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute('data-id') || '';
    setActiveTabId(menuId);
  }

  const toggleAdvanceFilter = () => {
    setOpenOffcan((prev: any) => !prev);
  };

  const tableColumns = useMemo(() => generateColumns(menuOptions), []);

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="Rooms" />
          <div className="tw-card">
            <div className="tw-card-header tw-pb-0">
              <div className="tw-flex tw-items-center tw-gap-2 tw-mb-4">
                <h4 className="tw-card-title">Rooms</h4>
                <Button
                  variant="primary"
                  className="tw-flex tw-items-center tw-justify-center"
                  onClick={toggleAdvanceFilter}
                >
                  <HugeiconsIcon icon={PlusSignIcon} size={18}></HugeiconsIcon>
                </Button>
              </div>
              <div>
                <UpdatedHorizontalTab
                  MenuOptions={tabMenuOptions}
                  clickMenuHandler={activeTabHandler}
                  activeTabId={activeTabId}
                  horizontalClass="ps-0"
                />
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
                    <div>
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
                  data={roomsData || []}
                  columns={tableColumns}
                  divClass="tw-border tw-rounded-lg tw-shadow tw-overflow-hidden table-responsive tw-mb-3"
                  theadClass="table-light text-muted align-middle"
                ></TableContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      <OffCanvasContainer
        isOpen={openOffcan}
        headerTitle="Create Room"
        closeHndlr={toggleAdvanceFilter}
        id="all-records-advance-filter"
      >
        <AdvanceFilterModal
          toggleAdvanceFilter={toggleAdvanceFilter}
          isOpen={openOffcan}
        />
      </OffCanvasContainer>
    </>
  );
};

export default Rooms;
