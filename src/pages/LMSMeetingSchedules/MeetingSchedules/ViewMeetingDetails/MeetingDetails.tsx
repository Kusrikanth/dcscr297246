import {
  Calendar03Icon,
  Copy01Icon,
  Link01Icon,
  Notification02Icon,
} from '@hugeicons-pro/core-stroke-standard';
import { HugeiconsIcon } from '@hugeicons/react';
import { useFormik } from 'formik';
import { StatusLabel, TextInput } from '../../../../Components/Common';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';

const initialValues = {
  meetingDetailsUrl: '',
  meetingId: '',
  meetingPassword: '',
};

const remindersData = [
  {
    id: 1,
    title: '10 mins before start time',
    time: '08:50 AM',
    status: 'Enabled',
  },
  {
    id: 2,
    title: 'At start time',
    time: '09:00 AM',
    status: 'Enabled',
  },
  {
    id: 3,
    title: '1 hr before start time',
    time: '08:00 AM',
    status: 'Enabled',
  },
];

const MeetingDetails = () => {
  const formik = useFormik({
    initialValues,
    onSubmit: () => {},
  });

  const { getScheduledMeetingItemByIdResp } = useAppSelector(
    ({ zoomMeetings }) => ({
      getScheduledMeetingItemByIdResp:
        zoomMeetings.getScheduledMeetingItemByIdResp,
    }),
    shallowEqual,
  );

  const { meetingLink } = getScheduledMeetingItemByIdResp || {};

  const meetingLinkValue = formik.values.meetingDetailsUrl?.trim();
  const meetingIdValue = formik.values.meetingId?.trim();
  const meetingPasswordValue = formik.values.meetingPassword?.trim();

  async function copyToClipboard(value: string, label: string) {
    if (!value) {
      toast.error(`${label} is empty`);
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error(`Unable to copy ${label.toLowerCase()}`);
    }
  }

  useEffect(() => {
    if (getScheduledMeetingItemByIdResp) {
      formik.setFieldValue('meetingDetailsUrl', meetingLink.meetingUrl);
      formik.setFieldValue('meetingId', meetingLink.meetingId);
      formik.setFieldValue('meetingPassword', meetingLink.meetingPassword);
    }
  }, [getScheduledMeetingItemByIdResp]);

  return (
    <div className="tw-card tw-h-full">
      <div className="tw-card-header">
        <div className="tw-flex tw-gap-2">
          <HugeiconsIcon icon={Link01Icon} size={16}></HugeiconsIcon>
          <h4 className="tw-card-title">Meeting Details</h4>
        </div>
      </div>
      <div className="tw-card-body">
        {
          <div className="row gy-3">
            <div className="col-12 col-md-4">
              <div className="tw-flex tw-items-end tw-gap-2">
                <TextInput
                  name="meetingDetailsUrl"
                  labelText="Meeting Title"
                  value={formik.values.meetingDetailsUrl}
                  onChange={formik.handleChange}
                  formgroupClassName="tw-mb-0 tw-flex-1"
                  onBlur={formik.handleBlur}
                  placeholder="Enter meeting link"
                  autoComplete="new-password"
                  isDisabled={true}
                />
                <button
                  type="button"
                  className="tw-w-8 tw-h-8 tw-rounded-lg tw-border tw-border-[#E5E7EB] tw-bg-white tw-flex tw-items-center tw-justify-center disabled:tw-cursor-not-allowed disabled:tw-opacity-50"
                  disabled={!meetingLinkValue}
                  onClick={() =>
                    copyToClipboard(meetingLinkValue || '', 'Meeting link')
                  }
                >
                  <HugeiconsIcon icon={Copy01Icon} size={16}></HugeiconsIcon>
                </button>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="tw-flex tw-items-end tw-gap-2">
                <TextInput
                  name="meetingId"
                  labelText="Meeting Id"
                  value={formik.values.meetingId}
                  onChange={formik.handleChange}
                  formgroupClassName="tw-mb-0 tw-flex-1"
                  onBlur={formik.handleBlur}
                  placeholder="Enter Meeting Id"
                  autoComplete="new-password"
                  isDisabled={true}
                />
                <button
                  type="button"
                  className="tw-w-8 tw-h-8 tw-rounded-lg tw-border tw-border-[#E5E7EB] tw-bg-white tw-flex tw-items-center tw-justify-center disabled:tw-cursor-not-allowed disabled:tw-opacity-50"
                  disabled={!meetingIdValue}
                  onClick={() =>
                    copyToClipboard(meetingIdValue || '', 'Meeting Id')
                  }
                >
                  <HugeiconsIcon icon={Copy01Icon} size={16}></HugeiconsIcon>
                </button>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="tw-flex tw-items-end tw-gap-2">
                <TextInput
                  name="meetingPassword"
                  labelText="Meeting Password"
                  value={formik.values.meetingPassword}
                  onChange={formik.handleChange}
                  formgroupClassName="tw-mb-0 tw-flex-1"
                  onBlur={formik.handleBlur}
                  placeholder="Enter Meeting Password"
                  autoComplete="new-password"
                  isDisabled={true}
                />
                <button
                  type="button"
                  className="tw-w-8 tw-h-8 tw-rounded-lg tw-border tw-border-[#E5E7EB] tw-bg-white tw-flex tw-items-center tw-justify-center disabled:tw-cursor-not-allowed disabled:tw-opacity-50"
                  disabled={!meetingPasswordValue}
                  onClick={() =>
                    copyToClipboard(
                      meetingPasswordValue || '',
                      'Meeting Password',
                    )
                  }
                >
                  <HugeiconsIcon icon={Copy01Icon} size={16}></HugeiconsIcon>
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default MeetingDetails;
