import React from 'react';
import { SelectInput, TextInput } from '../../../../../Components/Common';

export const meetingTypeOptions = [
  { id: 'ZOOM', displayLabel: 'Zoom' },
  // { id: 'GOOGLE_MEET', displayLabel: 'Google Meet' },
  // { id: 'MS_TEAMS', displayLabel: 'Microsoft Teams' },
  // { id: 'WEBEX', displayLabel: 'Webex' },
  // { id: 'OTHER', displayLabel: 'Other' },
];

export function generateColumns({
  handleMeetingChange,
  handleMeetingBlur,
}: any) {
  return [
    {
      Header: 'Section',
      accessor: 'sectionName',
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return <strong>{value || '-'}</strong>;
      },
    },
    {
      Header: 'Meeting Type',
      accessor: 'platform',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <SelectInput
            name={`platform_${original.sectionId}`}
            value="ZOOM"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleMeetingChange(
                original.sectionId,
                'platform',
                e.target.value,
              )
            }
            onBlur={() => handleMeetingBlur(original.sectionId, 'platform')}
            menuItems={meetingTypeOptions}
            valueKey="id"
            textKey="displayLabel"
            formgroupClassName="tw-mb-0"
            invalid={
              original?.touched?.platform && original?.errors?.platform
                ? true
                : false
            }
            error={
              original?.touched?.platform && original?.errors?.platform
                ? original?.errors?.platform
                : ''
            }
            isDisabled={true}
          />
        );
      },
    },
    {
      Header: 'Meeting Link',
      accessor: 'meetingUrl',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <TextInput
            name={`meetingUrl_${original.sectionId}`}
            value={original.meetingUrl || ''}
            placeHolder="Enter the meeting link"
            formgroupClassName="tw-mb-0"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleMeetingChange(
                original.sectionId,
                'meetingUrl',
                e.target.value,
              )
            }
            maxLength={500}
            onBlur={() => handleMeetingBlur(original.sectionId, 'meetingUrl')}
            invalid={
              original?.touched?.meetingUrl && original?.errors?.meetingUrl
                ? true
                : false
            }
            error={
              original?.touched?.meetingUrl && original?.errors?.meetingUrl
                ? original?.errors?.meetingUrl
                : ''
            }
          />
        );
      },
    },
    {
      Header: 'Meeting ID',
      accessor: 'meetingId',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <TextInput
            name={`meetingId_${original.sectionId}`}
            value={original.meetingId || ''}
            placeHolder="Enter the meeting ID"
            formgroupClassName="tw-mb-0"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleMeetingChange(
                original.sectionId,
                'meetingId',
                e.target.value.replace(/\s+/g, ''),
              )
            }
            onBlur={() => handleMeetingBlur(original.sectionId, 'meetingId')}
            invalid={
              original?.touched?.meetingId && original?.errors?.meetingId
                ? true
                : false
            }
            error={
              original?.touched?.meetingId && original?.errors?.meetingId
                ? original?.errors?.meetingId
                : ''
            }
          />
        );
      },
    },
    {
      Header: 'Meeting Password',
      accessor: 'meetingPassword',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <TextInput
            name={`meetingPassword_${original.sectionId}`}
            value={original.meetingPassword || ''}
            placeHolder="Enter the meeting password"
            formgroupClassName="tw-mb-0"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleMeetingChange(
                original.sectionId,
                'meetingPassword',
                e.target.value,
              )
            }
            onBlur={() =>
              handleMeetingBlur(original.sectionId, 'meetingPassword')
            }
            invalid={
              original?.touched?.meetingPassword &&
              original?.errors?.meetingPassword
                ? true
                : false
            }
            error={
              original?.touched?.meetingPassword &&
              original?.errors?.meetingPassword
                ? original?.errors?.meetingPassword
                : ''
            }
          />
        );
      },
    },
  ];
}
