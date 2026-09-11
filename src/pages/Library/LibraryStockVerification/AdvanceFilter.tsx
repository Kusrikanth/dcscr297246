import React, { useEffect, useState } from 'react'
import { DateInput, SelectInput, } from '../../../Components/Common';
import { useAppSelector } from '../../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import { resetRackAct, resetShelfAct } from '../../../store/library/settings/librarysettingsslice';
import { getLibraryCategoryListAct, getLibraryLanguageListAct, getLibraryrack, getLibraryRooms, getLibraryshelf } from '../../../store/library/settings/librarysettingsaction';
import { generateActionPayload } from '../../../utility/reduxutility';
import Button from '../../../Components/Common/Button';

const initialValues = {
    roomId: "",
    shelfId: "",
    rackId: "",
    languageId:""
};

const AdvanceFilterModal = (props: any) => {
    const dispatch = useDispatch();
    const [advanceFilterState, setAdvanceFilterState] =
        useState<any>(props.appliedFilter || initialValues);

    useEffect(() => {
        const payload = { branchId: branchId, pageSize: 500 };
        dispatch(getLibraryLanguageListAct(generateActionPayload("get_library_language", undefined, payload)));
        dispatch(getLibraryCategoryListAct(generateActionPayload("get_library_category", undefined, payload)));
    }, [dispatch]);

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, showApiLoader, libraryRoomsRequestListResp, libraryShelfRequestListResp, libraryRackRequestListResp, libraryLanguageRequestListResp, libraryCategoryRequestListResp } =
        useAppSelector(
            ({ appData, classroomManagmentInfo, globalData, librarysettings }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                showApiLoader: globalData.showApiLoader,
                classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
                libraryRoomsRequestListResp: librarysettings.libraryRoomsRequestListResp,
                libraryShelfRequestListResp: librarysettings.libraryShelfRequestListResp,
                libraryRackRequestListResp: librarysettings.libraryRackRequestListResp,
                libraryLanguageRequestListResp: librarysettings.libraryLanguageRequestListResp,
                libraryCategoryRequestListResp: librarysettings.libraryCategoryRequestListResp,
            }),
            shallowEqual
        );

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
         if (name === 'roomId') {
            setAdvanceFilterState((prev: any) => ({ ...prev, [name]: value, shelfId: "", rackId: "", }));
            const payload = { branchId: branchId, roomId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };
           
              dispatch(resetShelfAct(undefined))
              dispatch(resetRackAct(undefined));
          
              dispatch(getLibraryshelf(generateActionPayload("get_library_shelf", undefined, payload)));
    
          } 
          else if (name === 'shelfId') {
            setAdvanceFilterState((prev: any) => ({ ...prev, [name]: value, }));
             libraryRackList({ [name]: value });
              dispatch(resetRackAct(undefined));
          }
          else if (name === 'rackId') {
            setAdvanceFilterState((prev: any) => ({ ...prev, [name]: value, }));
        }
        else if (name === 'languageId') {
        setAdvanceFilterState((prev: any) => ({ ...prev, [name]: value, }));
       }
       else if (name === 'categoryId') {
        setAdvanceFilterState((prev: any) => ({ ...prev, [name]: value, }));
       }
    }
    const libraryRackList = (otherProps?: any) => {
      const {  libraryId, roomId, shelfId } = advanceFilterState;
      let payload = {
        branchId,
        libraryId,
        shelfId,
        roomId,
        ...otherProps,
      };
  dispatch(getLibraryrack(generateActionPayload("get_library_rack", undefined, payload)))
    };
    function applyFilterHndlr() {
        props.applyFilterCallback({ ...advanceFilterState });
        props.toggleAdvanceFilter()
    }

    return (
        <>
            <div className="offcanvas-body">
                <div className='tw-mb-3'>
                <SelectInput
                  name="roomId"
                  value={advanceFilterState.roomId}
                  onChange={filterHandler}
                  menuItems={libraryRoomsRequestListResp?.content || {}}
                  valueKey="id"
                  textKey="roomName"
                  labelText='Room Name'
                  formgroupClassName="tw-mb-0"
                />
                </div>
                <div className='tw-mb-3'>
                <SelectInput
                  name="shelfId"
                  value={advanceFilterState.shelfId}
                  onChange={filterHandler}
                  menuItems={libraryShelfRequestListResp?.data || {}}
                  valueKey="id"
                  textKey="shelfName"
                  formgroupClassName="tw-mb-0"
                  labelText="Shelf"
                />
                </div>
                <div className='tw-mb-3'>
                <SelectInput
                  name="rackId"
                  value={advanceFilterState.rackId}
                  onChange={filterHandler}
                  menuItems={libraryRackRequestListResp?.content || {}}
                  valueKey="id"
                  textKey="rackName"
                  formgroupClassName="tw-mb-0"
                  labelText="Rack"
                />
                </div>
                <div className='tw-mb-3'>
                <SelectInput
                  name="categoryId"
                  value={advanceFilterState.categoryId}
                  onChange={filterHandler}
                  menuItems={libraryCategoryRequestListResp?.content || {}}
                  valueKey="id"
                  textKey="category"
                  formgroupClassName="tw-mb-0"
                  labelText="Category"
                />
                </div>
                <div className="tw-mb-3">
                <SelectInput
                    name="languageId"
                    value={advanceFilterState.languageId}
                    onChange={filterHandler}
                    menuItems={libraryLanguageRequestListResp?.content || {}}
                    valueKey="id"
                    textKey="language"
                    labelText='Language'
                    formgroupClassName="tw-mb-3"
                  />
                </div>
            </div>
            <div className="tw-border-t tw-p-2 tw-text-center">
                <div className="tw-flex tw-justify-end tw-gap-2">
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={applyFilterHndlr}
                        disabled={showApiLoader}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </>
    )
}

export default AdvanceFilterModal
