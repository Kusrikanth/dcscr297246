import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  DateInput,
  SelectInput,
  TextArea,
  TextInput,
  TimeInput,
} from '../../../Components/Common';
import {
  getBranchClassAct,
  resetBrchClassAct,
} from '../../../store/branchsettings/branchacademics/branchacademicsactions';
import { generateActionPayload } from '../../../utility/reduxutility';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { useEffect } from 'react';
import {
  getSectionList,
  resetSectionListAct,
} from '../../../store/academic/classroomManagment/classroommanagmentactions';
import Button from '../../../Components/Common/Button';
import { getAssignCurriculumListAct } from '../../../store/assignlanguages/assignlanguagesaction';
import { convertUTCToISTTimeOnly, Current_Date_YYYYMMDD } from '../../../utility/dateutility';
import {
  editScheduledMeetingItemByIdAct,
  reScheduleScheduledMeetingItemByIdAct,
  saveScheduledMeetingItemAct,
} from '../../../store/lms/zoomMeeting/zoomMeetingActions';

const getTimeZoneAbbreviation = () => {
  const parts = new Intl.DateTimeFormat('en-IN', {
    timeZoneName: 'short',
  }).formatToParts(new Date());

  return parts.find((part) => part.type === 'timeZoneName')?.value || '';
};

const initialValues = {
  curriculumId: '',
  classId: '',
  sectionId: '',
  sectionName: '',
  title: '',
  description: '',
  date: '',
  startTime: '',
  endTime: '',
  academicYearId: '',
  agenda: '',
  branchName: '',
  schoolName: '',
  rescheduleReason: '',
};

const convertUTCToISTTimeInputValue = (utcTime: string) => {
  const istTime = convertUTCToISTTimeOnly(utcTime);
  const [time, period] = istTime.split(' ');
  const [hoursValue, minutesValue] = time.split(':');
  const hoursNumber = Number(hoursValue);

  if (!period || !minutesValue || Number.isNaN(hoursNumber)) return '';

  let hours = hoursNumber;

  if (period.toUpperCase() === 'PM' && hours < 12) {
    hours += 12;
  }

  if (period.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, '0')}:${minutesValue}`;
};

const getCurrentTimeInputValue = () => {
  const currentDate = new Date();
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};

const getValidationSchema = (isReschedule,isEdit) =>
  Yup.object().shape({
    curriculumId: Yup.string().required('Curriculum is required'),
    classId: Yup.string().required('Class is required'),
    sectionId: Yup.string().required('Section is required'),
    title: Yup.string().required('Title is required'),

    description: Yup.string()
      .trim()
      .max(150, 'Description cannot exceed 150 characters')
      .required('Description is required'),

    date: !isEdit ? Yup.string()
      .required('Date is required')
      .test(
        'is-not-past-date',
        'Date should not be past date',
        function (date) {
          if (!date) {
            return true;
          }

          return date >= Current_Date_YYYYMMDD;
        },
      ) : Yup.string().required('Date is required'),
    startTime: !isEdit ?  Yup.string()
      .required('Start Time is required')
      .test(
        'is-not-past-time',
        'Start time should not be past time',
        function (startTime) {
          const { date } = this.parent;

          if (!date || !startTime || date !== Current_Date_YYYYMMDD) {
            return true;
          }

          return startTime >= getCurrentTimeInputValue();
        },
      ) : Yup.string()
      .required('Start Time is required'),

    endTime: Yup.string()
      .required('End Time is required')
      .test(
        'is-greater-than-start-time',
        'End time should be greater than start time',
        function (endTime) {
          const { startTime } = this.parent;

          if (!startTime || !endTime) return true;

          return endTime > startTime;
        },
      ),

    rescheduleReason: isReschedule
      ? Yup.string()
          .trim()
          .required('Reschedule reason is required')
          .max(250, 'Reschedule reason cannot exceed 250 characters')
      : Yup.string().notRequired(),
  });

const AddEditScheduleMeeting = ({ onClose, editItem }: any) => {
  const { id: editItemId, type } = editItem || {};
  const isEdit = type === 'edit';
  const isReSchedule = type === 'reSchedule';
  const dispatch = useAppDispatch();
  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    branchClassResp,
    sectionListResp,
    getAssignListCurriculumResp,
    userMeResp,
    currentInstIdResp: instituteId,
    branchListResp,
    getScheduledMeetingItemByIdResp,
  } = useAppSelector(
    ({
      appData,
      instAcademics,
      branchAcademics,
      classroomManagmentInfo,
      assignLanguages,
      login,
      branch,
      zoomMeetings,
    }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      branchClassResp: branchAcademics.branchClassResp,
      sectionListResp: classroomManagmentInfo.sectionListResp,
      getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
      userMeResp: login.userMeResp,
      currentInstIdResp: appData.currentInstIdResp,
      branchListResp: branch.branchListResp,
      getScheduledMeetingItemByIdResp:
        zoomMeetings.getScheduledMeetingItemByIdResp,
    }),
    shallowEqual,
  );

  const timeZone = getTimeZoneAbbreviation();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: getValidationSchema(isReSchedule,isEdit),
    onSubmit: (values) => {
      const {
        academicYearId,
        curriculumId,
        classId,
        sectionId,
        sectionName,
        title,
        description,
        date,
        startTime,
        endTime,
        agenda,
        branchName,
        schoolName,
        rescheduleReason,
      } = values;

      const scheduledStart = `${date}T${startTime}:00`;
      const scheduledEnd = `${date}T${endTime}:00`;

      if (isEdit) {
        const payload = {
          title,
          description,
          agenda,
          updatedByName: userMeResp?.userInfo?.loginId || '',
        };

        dispatch(
          editScheduledMeetingItemByIdAct(
            generateActionPayload(
              'edit_scheduled_meetings_item_by_id',
              { id: editItemId },
              payload,
            ),
          ),
        );
      } else if (isReSchedule) {
        const payload = {
          newScheduledStart: scheduledStart,
          newScheduledEnd: scheduledEnd,
          reason: rescheduleReason,
          updatedByName: userMeResp?.userInfo?.loginId || '',
        };

        dispatch(
          reScheduleScheduledMeetingItemByIdAct(
            generateActionPayload(
              'reSchedule_scheduled_meetings_item_by_id',
              { id: editItemId },
              payload,
            ),
          ),
        );
      } else if (!isEdit && !isReSchedule) {
        const payload = {
          instituteId,
          branchId,
          academicYearId,
          curriculumId,
          classId,
          sectionId,
          sectionName,
          title,
          description,
          agenda,
          meetingType: 'ONLINE',
          scheduledStart,
          scheduledEnd,
          timeZone,
          createdByName: userMeResp?.userInfo?.loginId || '',
          branchName,
          schoolName,
        };

        dispatch(
          saveScheduledMeetingItemAct(
            generateActionPayload(
              'save_scheduled_meeting_item',
              undefined,
              payload,
            ),
          ),
        );
      }
    },
  });

  function fetchCurriculumList(otherProps?: any) {
    const payload = {
      academicYearId: formik.values.academicYearId,
      branchId,
      pageNo: 0,
      pageSize: 100,
      sortBy: 'curriculumName',
      orderBy: 'asc',
      ...otherProps,
    };

    dispatch(
      getAssignCurriculumListAct(
        generateActionPayload('get_brch_curriculum', undefined, payload),
      ),
    );
  }

  function fetchClassApiCall(otherProps?: any) {
    const payload = {
      academicYearId: formik.values.academicYearId,
      pageNo: 0,
      pageSize: 100,
      sortBy: 'classSequence',
      orderBy: 'asc',
      curriculumId: formik.values.curriculumId,
      branchId,
      moduleName:"EXAMINATION",
      ...otherProps,
    };
    dispatch(
      getBranchClassAct(
        generateActionPayload('get_brch_curriculum_class', undefined, payload),
      ),
    );
  }

  function fetchSectionApiCall(otherProps?: any) {
    const { academicYearId } = formik.values;
    const { classId, curriculumId } = formik.values;
    const payload = {
      branchId,
      branchClassId: classId,
      masterAcademicYearId: academicYearId,
      curriculumId,
      pageNo: 0,
      pageSize: 100,
      sortBy: 'sectionName',
      orderBy: 'asc',
      ...otherProps,
    };
    if (payload.branchClassId && payload.masterAcademicYearId) {
      dispatch(
        getSectionList(
          generateActionPayload('get_section_list', undefined, payload),
        ),
      );
    }
  }

  useEffect(() => {
    const yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === 'current',
      )?.academicYearId;

    if (yearId) {
      formik.setFieldValue('academicYearId', yearId);
      fetchCurriculumList({ academicYearId: yearId });
    }
  }, [academicYearListResp]);

  useEffect(() => {
    if (
      Array.isArray(branchListResp?.data) &&
      branchListResp?.data.length > 0
    ) {
      const branchDetails = branchListResp?.data?.find(
        (branch) => +branch?.branchId === +branchId,
      );
      const { schoolName, branchName }: any = branchDetails || {};
      formik.setFieldValue('branchName', branchName);
      formik.setFieldValue('schoolName', schoolName);
    }
  }, [branchListResp, branchId]);

  function filterHandler(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;

    formik.setFieldValue(name, value);

    if (name === 'curriculumId') {
      formik.setValues((prev) => ({
        ...prev,
        [name]: value,
        classId: '',
        sectionId: '',
        sectionName: '',
      }));

      if (value) {
        fetchClassApiCall({ curriculumId: value });
      } else {
        dispatch(resetBrchClassAct(undefined));
        dispatch(resetSectionListAct(undefined));
      }

      return;
    }

    if (name === 'classId') {
      formik.setValues((prev) => ({
        ...prev,
        [name]: value,
        sectionId: '',
        sectionName: '',
      }));

      if (value) {
        fetchSectionApiCall({ branchClassId: value });
      } else {
        dispatch(resetSectionListAct(undefined));
      }

      return;
    }

    if (name === 'sectionId') {
      const selectedSection = sectionList.find(
        (section: any) => String(section.sectionId) === String(value),
      );

      formik.setValues((prev) => ({
        ...prev,
        [name]: value,
        sectionName: selectedSection?.sectionName || '',
      }));

      return;
    }
  }

  const addMinutesToTime = (time: string, minutesToAdd: number) => {
    if (!time) return '';

    const [hours, minutes] = time.split(':').map(Number);

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + minutesToAdd);
    date.setSeconds(0);

    const updatedHours = String(date.getHours()).padStart(2, '0');
    const updatedMinutes = String(date.getMinutes()).padStart(2, '0');

    return `${updatedHours}:${updatedMinutes}`;
  };

  const handleStartTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const startTime = event.target.value;
    const endTime = addMinutesToTime(startTime, 30);

    formik.setFieldValue('startTime', startTime);
    formik.setFieldValue('endTime', endTime);
  };

  const curriculumList = getAssignListCurriculumResp?.data || [];
  const classList = branchClassResp?.content || [];
  const sectionList = sectionListResp?.data || [];

  useEffect(() => {
    if (getScheduledMeetingItemByIdResp && editItemId) {
      const {
        title,
        description,
        agenda,
        scheduledStart,
        scheduledEnd,
        sectionId,
        sectionName,
        curriculumId,
        classId,
        academicYearId,
        cancellationReason,
        rescheduledReason,
      } = getScheduledMeetingItemByIdResp;

      const startDate = scheduledStart?.split('T')?.[0] || '';
      const startTime = convertUTCToISTTimeInputValue(
        scheduledStart?.split('T')?.[1] || '',
      );

      const endTime = convertUTCToISTTimeInputValue(
        scheduledEnd?.split('T')?.[1] || '',
      );

      formik.setValues((prev) => ({
        ...prev,
        title: title || '',
        description: description || '',
        agenda: agenda || '',
        date: startDate,
        startTime,
        endTime,
        sectionId: sectionId || '',
        sectionName: sectionName || '',
        curriculumId: curriculumId || '',
        classId: classId || '',
        academicYearId: academicYearId || prev.academicYearId,
        rescheduleReason: rescheduledReason || '',
      }));

      if (academicYearId) {
        fetchCurriculumList({ academicYearId });
      }

      if (curriculumId) {
        fetchClassApiCall({ curriculumId });
      }

      if (classId && academicYearId && curriculumId) {
        fetchSectionApiCall({
          masterAcademicYearId: academicYearId,
          branchClassId: classId,
          curriculumId: curriculumId,
        });
      }
    }
  }, [getScheduledMeetingItemByIdResp, editItemId]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="modal-body p-4">
        <div className="row gy-3">
          <div className="col-12">
            <TextInput
              name="title"
              labelText="Meeting Title"
              labelClass="required"
              value={formik.values.title}
              onChange={formik.handleChange}
              formgroupClassName="tw-mb-0"
              onBlur={formik.handleBlur}
              invalid={
                formik.touched.title && formik.errors.title ? true : false
              }
              error={formik.touched.title ? formik.errors.title : ''}
              placeHolder="Enter meeting title"
              isDisabled={isReSchedule}
            />
          </div>

          <div className="col-12">
            <TextArea
              name="description"
              labelText="Description"
              height="50px"
              inputClassName="overflow-auto"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              formgroupClassName="tw-mb-0"
              placeHolder="Enter meeting description"
              invalid={
                formik.touched.description && formik.errors.description
                  ? true
                  : false
              }
              error={
                formik.touched.description ? formik.errors.description : ''
              }
              isDisabled={isReSchedule}
            />
          </div>
          <div className="col-12">
            <TextInput
              name="agenda"
              labelText="Agenda"
              value={formik.values.agenda}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              formgroupClassName="tw-mb-0"
              placeHolder="Enter meeting agenda"
              isDisabled={isReSchedule}
            />
          </div>
          <div className="col-12 col-lg-6">
            <SelectInput
              name="curriculumId"
              labelText="Curriculum"
              labelClass="required"
              formgroupClassName="tw-mb-0"
              value={formik.values.curriculumId}
              onChange={filterHandler}
              onBlur={formik.handleBlur}
              menuItems={curriculumList}
              valueKey="branchCurriculumId"
              textKey="curriculumName"
              invalid={
                formik.touched.curriculumId && formik.errors.curriculumId
                  ? true
                  : false
              }
              error={
                formik.touched.curriculumId ? formik.errors.curriculumId : ''
              }
              isDisabled={isReSchedule || isEdit}
            />
          </div>

          <div className="col-12 col-lg-6">
            <SelectInput
              name="classId"
              labelText="Class"
              labelClass="required"
              value={formik.values.classId}
              onChange={filterHandler}
              formgroupClassName="tw-mb-0"
              onBlur={formik.handleBlur}
              menuItems={classList}
              valueKey="id"
              textKey="shortName"
              invalid={
                formik.touched.classId && formik.errors.classId ? true : false
              }
              error={formik.touched.classId ? formik.errors.classId : ''}
              isDisabled={isReSchedule || isEdit}
            />
          </div>

          <div className="col-12 col-lg-6">
            <SelectInput
              name="sectionId"
              labelText="Section"
              labelClass="required"
              value={formik.values.sectionId}
              onChange={filterHandler}
              onBlur={formik.handleBlur}
              menuItems={sectionList}
              formgroupClassName="tw-mb-0"
              valueKey="sectionId"
              textKey="sectionName"
              invalid={
                formik.touched.sectionId && formik.errors.sectionId
                  ? true
                  : false
              }
              error={formik.touched.sectionId ? formik.errors.sectionId : ''}
              isDisabled={isReSchedule || isEdit}
            />
          </div>

          <div className="col-12 col-lg-6">
            <DateInput
              name="date"
              minDate={Current_Date_YYYYMMDD}
              labelText="Date"
              labelClass="required"
              value={formik.values.date}
              onChange={formik.handleChange}
              formgroupClassName="tw-mb-0"
              onBlur={formik.handleBlur}
              invalid={formik.touched.date && formik.errors.date ? true : false}
              error={formik.touched.date ? formik.errors.date : ''}
              isDisabled={isEdit}
            />
          </div>

          <div className="col-12 col-lg-6">
            <TimeInput
              name="startTime"
              labelText="Start Time"
              labelClass="required"
              value={formik.values.startTime}
              onChange={handleStartTimeChange}
              formgroupClassName="tw-mb-0"
              onBlur={formik.handleBlur}
              invalid={
                formik.touched.startTime && formik.errors.startTime
                  ? true
                  : false
              }
              error={formik.touched.startTime ? formik.errors.startTime : ''}
              isDisabled={isEdit}
            />
          </div>

          <div className="col-12 col-lg-6">
            <TimeInput
              name="endTime"
              labelText="End Time"
              labelClass="required"
              value={formik.values.endTime}
              onChange={formik.handleChange}
              formgroupClassName="tw-mb-0"
              onBlur={formik.handleBlur}
              invalid={
                formik.touched.endTime && formik.errors.endTime ? true : false
              }
              error={formik.touched.endTime ? formik.errors.endTime : ''}
              isDisabled={isEdit}
            />
          </div>
          {isReSchedule ? (
            <div className="col-12">
              <TextInput
                name="rescheduleReason"
                labelText="Reason for reschedule"
                labelClass="required"
                value={formik.values.rescheduleReason}
                onChange={formik.handleChange}
                formgroupClassName="tw-mb-0"
                onBlur={formik.handleBlur}
                invalid={
                  formik.touched.rescheduleReason &&
                  formik.errors.rescheduleReason
                    ? true
                    : false
                }
                error={
                  formik.touched.rescheduleReason
                    ? formik.errors.rescheduleReason
                    : ''
                }
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="modal-footer p-3 border-top">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" onSubmit={formik.submitForm}>
          {editItemId ? 'Update' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

export default AddEditScheduleMeeting;
