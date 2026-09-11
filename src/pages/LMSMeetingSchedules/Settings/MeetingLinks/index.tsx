import { SelectInput, TextInput } from '../../../../Components/Common';
import BreadCrumb from '../../../../Components/Common/BreadCrumb';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import {
  getBranchCurriculumAct,
  resetBrchCurriculumAct,
} from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import './_treecomponent.scss';

import { ModuleTree } from './ModuleTree';
import { TreeContextProvider } from './helper';
import { useHistory } from 'react-router-dom';
import { getAllSectionMeetingLinksAct } from '../../../../store/lms/zoomMeeting/zoomMeetingActions';
import NoDataComp from '../../../../Components/Common/NoDataComp';

const initialValues = {
  academicYearId: '',
  curriculumId: '',
};

const MettingLinks = () => {
  const [filtersState, setFiltersState] = useState({ ...initialValues });
  const dispatch = useAppDispatch();
  const history = useHistory();

  const [expandCollapseState, setExpandCollapseState] = useState({
    action: '',
    ids: [] as string[],
  });

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    brchCurriculumResp,
    getAllSectionMeetingLinksResp,
  } = useAppSelector(
    ({ appData, instAcademics, branchAcademics, zoomMeetings }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      getAllSectionMeetingLinksResp: zoomMeetings.getAllSectionMeetingLinksResp,
    }),
    shallowEqual,
  );

  const showInstituteAdminUI = true;

  function fetchCurriculumList(otherProps?: any) {
    const payload = {
      academicYearId: filtersState.academicYearId,
      branchId,
      pageNo: 0,
      pageSize: 100,
      sortBy: 'curriculumName',
      orderBy: 'asc',
      ...otherProps,
    };

    dispatch(
      getBranchCurriculumAct(
        generateActionPayload('get_brch_curriculum', undefined, payload),
      ),
    );
  }

  function fetchAllSectionMeetingLinks(otherProps?: any) {
    const { academicYearId, curriculumId } = filtersState || {};
    const payload = {
      branchId,
      academicYearId,
      curriculumId,
      ...otherProps,
    };

    dispatch(
      getAllSectionMeetingLinksAct(
        generateActionPayload(
          'get_all_section_meeting_link',
          undefined,
          payload,
        ),
      ),
    );
  }

  function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === 'academicYearId') {
      setFiltersState((prev) => ({
        ...prev,
        [name]: value,
        curriculumId: '',
      }));

      if (value) {
        fetchCurriculumList({ academicYearId: value });
      } else {
        dispatch(resetBrchCurriculumAct(undefined));
      }

      return;
    } else if (name === 'curriculumId') {
      setFiltersState((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (value) {
        fetchAllSectionMeetingLinks({ curriculumId: value });
      }
    }

    setFiltersState((prev) => ({ ...prev, [name]: value }));
  }

  function expandCollapseHndlr(action: string, ids: string[]) {
    setExpandCollapseState({ action, ids });
  }

  function editModuleHandler(data: any) {
    const selectedClassId = data.classId;
    history.push('/meeting-links/edit-meeting-links', {
      selectedCurriculumId: filtersState.curriculumId,
      selectedAccademicYearId: filtersState.academicYearId,
      selectedClassId,
    });
  }

  useEffect(() => {
    const yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === 'current',
      )?.academicYearId;

    if (yearId) {
      setFiltersState((prev) => ({ ...prev, academicYearId: yearId }));
      fetchCurriculumList({ academicYearId: yearId });
    }
  }, [academicYearListResp]);

  useEffect(() => {
    if (brchCurriculumResp && brchCurriculumResp.data.length > 0) {
      const firstCurriculumId =
        brchCurriculumResp?.data?.[0]?.branchCurriculumId;

      if (firstCurriculumId) {
        setFiltersState((prev) => ({
          ...prev,
          curriculumId: firstCurriculumId,
        }));
        fetchAllSectionMeetingLinks({ curriculumId: firstCurriculumId });
      }
    }
  }, [brchCurriculumResp]);

  const { content: getAllSectionMeetingData } =
    getAllSectionMeetingLinksResp || {};

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb title="Seetings" pageTitle="Settings" />

        <div className="tw-mb-4">
          <h4 className="tw-card-title tw-flex tw-items-center tw-text-xl">
            Meeting Links
          </h4>
          <p className="tw-card-subTitle">
            Manage meeting links for classes and sections.
          </p>
        </div>

        <div className="tw-card">
          <div className="tw-card-header tw-py-4">
            <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-3">

              <div className="tw-col-span-6 xl:tw-col-span-2">
                <SelectInput
                  name="academicYearId"
                  value={filtersState.academicYearId}
                  onChange={filterHandler}
                  menuItems={academicYearListResp?.data}
                  formgroupClassName="tw-mb-0"
                  valueKey="academicYearId"
                  textKey="academicYearName"
                  defaultSelect="Academic Year"
                  labelText="Academic Year"
                  floatingLabel
                />
              </div>

              <div className="tw-col-span-6 xl:tw-col-span-2">
                <SelectInput
                  name="curriculumId"
                  value={filtersState.curriculumId}
                  onChange={filterHandler}
                  menuItems={brchCurriculumResp?.data}
                  valueKey="branchCurriculumId"
                  textKey="curriculumName"
                  labelText="Curriculum"
                  floatingLabel
                  formgroupClassName="tw-mb-0"
                />
              </div>
            </div>
          </div>

          <div className="tw-card-body p-0">
            <TreeContextProvider.Provider
              value={{
                value: expandCollapseState,
                toggle: expandCollapseHndlr,
                editModuleHandler,
              }}
            >
              <div className="meeting-tree-container">
                {Array.isArray(getAllSectionMeetingData) &&
                getAllSectionMeetingData.length > 0 ? (
                  getAllSectionMeetingData?.map((item, index) => (
                    <ModuleTree
                      key={item.classId}
                      level={1}
                      parentsInfo={[]}
                      defaultOpen={false}
                      {...item}
                      showInstituteAdminUI={showInstituteAdminUI}
                    />
                  ))
                ) : (
                  <div className="tw-w-full">
                    <NoDataComp />
                  </div>
                )}
              </div>
            </TreeContextProvider.Provider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MettingLinks;
