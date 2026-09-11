import { useEffect, useMemo, useState } from 'react';
import TableContainer from '../../../../../Components/Common/TableContainer';
import { generateColumns } from './helper';
import { useAppSelector } from '../../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { TextInput } from '../../../../../Components/Common';

const ParticipantsList = () => {
  const [activeTab, setActiveTab] = useState<any>('all');
  const [tableData,setTableData] = useState<any>([])
  const [searchString,setSearchString] = useState("")

  const { getScheduledMeetingItemByIdResp } = useAppSelector(
    ({ zoomMeetings }) => ({
      getScheduledMeetingItemByIdResp:
        zoomMeetings.getScheduledMeetingItemByIdResp,
    }),
    shallowEqual,
  );

  const { attendance } = getScheduledMeetingItemByIdResp || {};

  const menuOptions = [
    {
      id: 'all',
      labelName: 'All',
      customPadding: '0px 15px',
    },
    {
      id: 'students',
      labelName: 'Students',
      customPadding: '0px 15px',
    },
    {
      id: 'teachers',
      labelName: 'Teachers',
      customPadding: '0px 15px',
    },
    {
      id: 'otherStaff',
      labelName: 'Other Staff',
      customPadding: '0px 15px',
    },
  ];

  function tabChangeHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute('data-id');
    setActiveTab(menuId);
  }
  const tableColumns = useMemo(() => generateColumns(), []);
  
  useEffect(() => {
    setTableData(Array.isArray(attendance) ? attendance : []);
  }, [attendance]);

  const filteredTableData = useMemo(() => {
    const searchValue = searchString.trim().toLowerCase();

    if (!searchValue) return tableData;

    return tableData.filter((student: any) => {
      const studentName = String(student.studentName || '').toLowerCase();
      const studentCode = String(student.studentCode || '').toLowerCase();

      return (
        studentName.includes(searchValue) ||
        studentCode.includes(searchValue)
      );
    });
  }, [tableData, searchString]);


  return (
    <>
      <div className="tw-card tw-h-full">
        <div className="tw-card-header">
          <div className="tw-flex tw-justify-between tw-items-center">
            <div>
              <h4 className="tw-card-title">Participants List</h4>
            </div>
            <div className="tw-relative">
                <div className="search-box">
                  <TextInput
                    name="searchString"
                    value={searchString}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchString(event.target.value)
                    }
                    formgroupClassName="tw-mb-0"
                    labelText="Search"
                    placeHolder="Search student name or code"
                    floatingLabel
                  />
                  <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400" />
                </div>
              </div>
            {/* <Button size="sm">Add Participants</Button> */}
          </div>
          {/* <UpdatedHorizontalTab
            MenuOptions={menuOptions}
            activeTabId={activeTab}
            showBadge={true}
            horizontalClass="mb-0 overflow-auto text-nowrap"
            clickMenuHandler={tabChangeHandler}
          ></UpdatedHorizontalTab> */}
        </div>
        <div className="tw-card-body p-0">
          <TableContainer
            columns={tableColumns || []}
            data={Array.isArray(filteredTableData) ? filteredTableData : []}
            divClass="table-responsive mb-1 tw-max-h-[320px] tw-overflow-y-auto"
            theadClass="table-light text-muted align-middle tw-sticky tw-top-0 tw-z-10"
            showPagination={false}
          ></TableContainer>

          {/* <div className="tw-px-3 tw-pt-1 tw-pb-3 tw-justify-center tw-flex tw-items-center">
            <p className="text-primary tw-font-semibold tw-mb-0">
              View All Participants
            </p>
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={18}
              className="tw-ms-2 text-primary"
            ></HugeiconsIcon>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default ParticipantsList;
