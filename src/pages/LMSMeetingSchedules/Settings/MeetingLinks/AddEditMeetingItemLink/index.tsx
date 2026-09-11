import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SelectInput } from '../../../../../Components/Common';
import BreadCrumb from '../../../../../Components/Common/BreadCrumb';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import {
  resetBrchClassAct,
  resetBrchCurriculumAct,
} from '../../../../../store/branchsettings/branchacademics/branchacademicsslice';
import {
  getBranchClassAct,
  getBranchCurriculumAct,
} from '../../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import TableContainer from '../../../../../Components/Common/TableContainer';
import { generateColumns } from './helper';
import { useHistory, useLocation } from 'react-router-dom';
import {
  getClassMeetingLinksByIdAct,
  saveClassMeetingLinkByClassAct,
} from '../../../../../store/lms/zoomMeeting/zoomMeetingActions';
import { toast } from 'react-toastify';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon } from '@hugeicons-pro/core-stroke-standard';
import * as Yup from 'yup';

const isValidMeetingUrl = (value?: string) => {
  if (!value) return false;

  try {
    const parsedUrl = new URL(value.trim());
    return ['http:', 'https:'].includes(parsedUrl.protocol) && !!parsedUrl.host;
  } catch {
    return false;
  }
};

const meetingRowValidationSchema = Yup.object().shape({
  platform: Yup.string().required('Meeting type is required'),

  meetingUrl: Yup.string()
    .required('Meeting link is required')
    .test('valid-meeting-url', 'Enter a valid meeting link', (value) =>
      isValidMeetingUrl(value),
    ),

  meetingId: Yup.string()
    .required('Meeting ID is required')
    .matches(/^\S+$/, 'Meeting ID should not contain spaces'),

  meetingPassword: Yup.string().required('Meeting password is required'),
});

export const meetingValidationSchema = Yup.array().of(
  meetingRowValidationSchema,
);

const initialValues = {
  academicYearId: '',
  curriculumId: '',
  branchClassId: '',
};

const AddEditMeetingItemLink = () => {
  const [filtersState, setFiltersState] = useState({ ...initialValues });
  const [tableData, setTableData] = useState<any[]>([]);
  const [originalTableData, setOriginalTableData] = useState<any[]>([]);

  const history = useHistory();
  const location = useLocation();
  const {
    selectedCurriculumId,
    selectedAccademicYearId,
    selectedClassData,
    selectedClassId,
  }: any = location.state;

  const dispatch = useAppDispatch();

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    brchCurriculumResp,
    branchClassResp,
    getClassMeetingLinksByIdResp,
    userMeResp,
    saveClassMeetingLinkByClassResp,
    getzoomMeetingErrorResp,
  } = useAppSelector(
    ({ appData, instAcademics, branchAcademics, zoomMeetings, login }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      getClassMeetingLinksByIdResp: zoomMeetings.getClassMeetingLinksByIdResp,
      saveClassMeetingLinkByClassResp:
        zoomMeetings.saveClassMeetingLinkByClassResp,
      getzoomMeetingErrorResp: zoomMeetings.getzoomMeetingErrorResp,
      userMeResp: login.userMeResp,
    }),
    shallowEqual,
  );

  const fetchCurriculumList = (otherProps?: any) => {
    if (!branchId) return;

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
  };

  const fetchClassApiCall = (otherProps?: any) => {
    const payload = {
      branchId: branchId,
      academicYearId: filtersState?.academicYearId,
      curriculumId: filtersState?.curriculumId,
      sortBy: 'classSequence',
      orderBy: 'asc',
      pageNo: 0,
      pageSize: 100,
      ...otherProps,
    };
    dispatch(
      getBranchClassAct(
        generateActionPayload('get_brch_curriculum_class', undefined, payload),
      ),
    );
  };

  function fetchClassMeetingLinksById(otherProps?: any) {
    const { academicYearId, curriculumId, branchClassId } = filtersState || {};
    const payload = {
      branchId,
      academicYearId,
      curriculumId,
      classId: branchClassId,
      ...otherProps,
    };

    dispatch(
      getClassMeetingLinksByIdAct(
        generateActionPayload(
          'get_all_section_meeting_link',
          undefined,
          payload,
        ),
      ),
    );
  }

  const addEditMeetingsRef = useRef({
    prevSaveClassMeetingLinkByClassResp: saveClassMeetingLinkByClassResp,
    prevGetzoomMeetingErrorResp: getzoomMeetingErrorResp,
  });

  useEffect(() => {
    const { prevSaveClassMeetingLinkByClassResp, prevGetzoomMeetingErrorResp } =
      addEditMeetingsRef.current;

    if (
      saveClassMeetingLinkByClassResp &&
      saveClassMeetingLinkByClassResp !== prevSaveClassMeetingLinkByClassResp
    ) {
      toast.success('Class Meetings deatils updated successfully');
      fetchClassMeetingLinksById();
    } else if (
      getzoomMeetingErrorResp &&
      getzoomMeetingErrorResp !== prevGetzoomMeetingErrorResp
    ) {
      const { message } = getzoomMeetingErrorResp;
      toast.error(message || 'Something went wrong');
    }

    addEditMeetingsRef.current.prevSaveClassMeetingLinkByClassResp =
      saveClassMeetingLinkByClassResp;
    addEditMeetingsRef.current.prevGetzoomMeetingErrorResp =
      getzoomMeetingErrorResp;
  }, [saveClassMeetingLinkByClassResp, getzoomMeetingErrorResp]);

  const filterHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    if (name === 'academicYearId') {
      setFiltersState((prev) => ({
        ...prev,
        academicYearId: value,
        curriculumId: '',
      }));

      if (value) {
        fetchCurriculumList({ academicYearId: value });
      } else {
        dispatch(resetBrchCurriculumAct(undefined));
      }

      return;
    } else if (name === 'curriculumId') {
      setFiltersState((prev) => ({ ...prev, curriculumId: value }));
      if (value) {
        fetchClassApiCall({
          curriculumId: value,
          academicYearId: filtersState.academicYearId,
        });
      } else {
        dispatch(resetBrchClassAct(undefined));
      }
    }

    setFiltersState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
    };
  }, []);

  const validateMeetingField = (
    row: any,
    field: 'platform' | 'meetingUrl' | 'meetingId' | 'meetingPassword',
  ) => {
    try {
      meetingRowValidationSchema.validateSyncAt(field, row);
      return '';
    } catch (error: any) {
      return error.message;
    }
  };

  const handleMeetingChange = useCallback(
    (
      sectionId: string | number,
      field: 'platform' | 'meetingUrl' | 'meetingId' | 'meetingPassword',
      value: string,
    ) => {
      setTableData((prev) =>
        prev.map((section) => {
          if (String(section.sectionId) !== String(sectionId)) {
            return section;
          }

          const updatedSection = {
            ...section,
            [field]: value,
            touched: {
              ...section.touched,
              [field]: true,
            },
          };

          const errorMessage = validateMeetingField(updatedSection, field);

          return {
            ...updatedSection,
            errors: {
              ...section.errors,
              [field]: errorMessage,
            },
          };
        }),
      );
    },
    [],
  );

  const handleMeetingBlur = useCallback(
    (
      sectionId: string | number,
      field: 'platform' | 'meetingUrl' | 'meetingId' | 'meetingPassword',
    ) => {
      setTableData((prev) =>
        prev.map((section) => {
          if (String(section.sectionId) !== String(sectionId)) {
            return section;
          }

          const errorMessage = validateMeetingField(section, field);

          return {
            ...section,
            touched: {
              ...section.touched,
              [field]: true,
            },
            errors: {
              ...section.errors,
              [field]: errorMessage,
            },
          };
        }),
      );
    },
    [],
  );

  const tableColumns = useMemo(
    () =>
      generateColumns({
        handleMeetingChange,
        handleMeetingBlur,
      }),
    [handleMeetingChange, handleMeetingBlur],
  );

  useEffect(() => {
    const yearId = academicYearListResp?.data?.find(
      (year: any) => +year?.academicYearId === +selectedAccademicYearId,
    )?.academicYearId;

    if (yearId) {
      setFiltersState((prev) => ({
        ...prev,
        academicYearId: yearId,
      }));

      fetchCurriculumList({ academicYearId: yearId });
    }
  }, [academicYearListResp, selectedAccademicYearId]);

  useEffect(() => {
    if (brchCurriculumResp?.data?.length > 0) {
      const curId = brchCurriculumResp?.data?.find(
        (cur: any) => +cur?.branchCurriculumId === +selectedCurriculumId,
      )?.branchCurriculumId;
      if (curId) {
        setFiltersState((prev) => ({
          ...prev,
          curriculumId: curId,
        }));
        fetchClassApiCall({ curriculumId: curId });
      }
    }
  }, [brchCurriculumResp, selectedCurriculumId]);

  useEffect(() => {
    const { content } = branchClassResp || {};

    if (Array.isArray(content) && content.length > 0) {
      const clsId = content.find(
        (cls: any) => +cls?.id === +selectedClassId,
      )?.id;

      setFiltersState((prev) => ({
        ...prev,
        branchClassId: clsId,
      }));
      fetchClassMeetingLinksById({ classId: clsId });
    }
  }, [branchClassResp, selectedClassId]);

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};

  const { content: getClassMeetingList } = getClassMeetingLinksByIdResp || {};

  useEffect(() => {
    if (getClassMeetingList) {
      const sections = Array.isArray(getClassMeetingList?.[0]?.sections)
        ? getClassMeetingList[0]?.sections?.map((section: any) => ({
            ...section,
            platform: section.platform || 'ZOOM',
            meetingUrl: section.meetingUrl ?? '',
            meetingId: section.meetingId ?? '',
            meetingPassword: section.meetingPassword ?? '',
            touched: {},
            errors: {},
          }))
        : [];

      setTableData(sections);

      setOriginalTableData(sections.map((section: any) => ({ ...section })));
    }
  }, [getClassMeetingList]);

  const handleDiscard = () => {
    setTableData(originalTableData.map((section: any) => ({ ...section })));
  };

  const validateMeetingRows = async () => {
    const updatedRows = await Promise.all(
      tableData.map(async (row) => {
        try {
          await meetingRowValidationSchema.validate(row, {
            abortEarly: false,
          });

          return {
            ...row,
            touched: {
              platform: true,
              meetingUrl: true,
              meetingId: true,
              meetingPassword: true,
            },
            errors: {},
          };
        } catch (error: any) {
          const errors: any = {};

          error.inner?.forEach((err: any) => {
            if (err.path) {
              errors[err.path] = err.message;
            }
          });

          return {
            ...row,
            touched: {
              platform: true,
              meetingUrl: true,
              meetingId: true,
              meetingPassword: true,
            },
            errors,
          };
        }
      }),
    );

    setTableData(updatedRows);

    const isValid = updatedRows.every(
      (row) => Object.keys(row.errors || {}).length === 0,
    );

    return {
      isValid,
      updatedRows,
    };
  };

  async function handleSubmit() {
    const { isValid, updatedRows } = await validateMeetingRows();

    if (!isValid) {
      return;
    }

    const { curriculumId, branchClassId, academicYearId } = filtersState || {};

    const { curriculumName = '', className = '' } =
      getClassMeetingList?.[0] || {};

    const sectionsPayload = updatedRows.map((section) => ({
      sectionId: section.sectionId,
      sectionName: section.sectionName,
      meetingUrl: section.meetingUrl.trim(),
      meetingId: section.meetingId.trim(),
      meetingPassword: section.meetingPassword,
      platform: section.platform,
    }));

    const payload = {
      branchId,
      curriculumId,
      curriculumName,
      classId: branchClassId,
      className,
      academicYearId,
      createdByName: userMeResp?.userInfo?.loginId || '',
      sections: sectionsPayload,
    };

    dispatch(
      saveClassMeetingLinkByClassAct(
        generateActionPayload(
          'save_class_meeting_link_by_class',
          undefined,
          payload,
        ),
      ),
    );
  }

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb title="Meeting Schedules" pageTitle="Meeting Schedules" />

        <div className="tw-mb-4">
          <button className="text-info" onClick={() => history.goBack()}>
            <HugeiconsIcon icon={ArrowLeft02Icon} size={18} className="me-2" />
            Back to Meeting links
          </button>
        </div>

        <div className="tw-card">
          <div className="tw-card-header tw-py-5">
            <div className="tw-mb-6">
              <h4 className="tw-card-title tw-flex tw-items-center tw-text-xl">
                Meeting Link Settings
              </h4>
              <p className="tw-card-subTitle tw-mt-0">
                Configure meeting links for classes and their sections.
              </p>
            </div>
            <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-3">
              <div className="tw-col-span-6 xl:tw-col-span-2">
                <SelectInput
                  name="academicYearId"
                  value={filtersState.academicYearId}
                  onChange={filterHandler}
                  menuItems={academicYearList || []}
                  formgroupClassName="tw-mb-0"
                  valueKey="academicYearId"
                  textKey="academicYearName"
                  defaultSelect="Academic Year"
                  labelText="Academic Year"
                  floatingLabel
                  isDisabled={true}
                />
              </div>

              <div className="tw-col-span-6 xl:tw-col-span-2">
                <SelectInput
                  name="curriculumId"
                  value={filtersState.curriculumId}
                  onChange={filterHandler}
                  menuItems={curriculumTypes || []}
                  valueKey="branchCurriculumId"
                  textKey="curriculumName"
                  defaultSelect="Curriculum"
                  labelText="Curriculum"
                  floatingLabel
                  formgroupClassName="tw-mb-0"
                  isDisabled={true}
                />
              </div>

              <div className="tw-col-span-6 xl:tw-col-span-2">
                <SelectInput
                  name="branchClassId"
                  value={filtersState.branchClassId}
                  onChange={filterHandler}
                  menuItems={classTypes || []}
                  valueKey="id"
                  textKey="shortName"
                  defaultSelect="Class"
                  labelText="Class"
                  floatingLabel
                  formgroupClassName="tw-mb-0"
                  isDisabled={true}
                />
              </div>
            </div>
          </div>

          <div className="tw-card-body p-0">
            <TableContainer
              columns={tableColumns}
              data={tableData}
              divClass="table-responsive tw-mb-3"
              theadClass="tw-bg-gray-100 tw-text-muted tw-align-middle"
              showPagination={false}
            />
            <div className="tw-mt-2 tw-flex tw-justify-end tw-w-full tw-p-4 tw-gap-4">
              <button
                className="btn btn-outline-secondary d-flex align-items-center"
                onClick={handleDiscard}
              >
                Discard Settings
              </button>
              <button
                className="btn btn-success d-flex align-items-center"
                onClick={handleSubmit}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditMeetingItemLink;
