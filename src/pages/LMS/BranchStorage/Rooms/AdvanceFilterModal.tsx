import { useFormik } from 'formik';
import {
  FileUpload,
  SelectInput,
  TextInput,
  UploadImageUpdated,
} from '../../../../Components/Common';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '../../../../hooks/storehook';
import { useEffect } from 'react';
import { preventContextMenu } from '@fullcalendar/core/internal';
import Button from '../../../../Components/Common/Button';

const initialValues: any = {
  academicYearId: '',
  name: '',
  tags: '',
  documentsToInclude: '',
};

const AdvanceFilterModal = ({ toggleAdvanceFilter, isOpen }) => {
  const advanceFilterModalFormik = useFormik({
    initialValues,
    onSubmit: () => {},
  });

  const { academicYearListResp } = useAppSelector(
    ({
      appData,
      instAcademics,

      globalData,
    }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
    }),
    shallowEqual,
  );

  useEffect(() => {
    let yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === 'current',
      )?.academicYearId;

    advanceFilterModalFormik.setValues((prev) => ({
      ...prev,
      academicYearId: yearId,
    }));
  }, [academicYearListResp]);

  const { data: academicYearList } = academicYearListResp || {};

  return (
    <>
      <div className="offcanvas-body">
        <div className="mb-3">
          <SelectInput
            name="academicYearId"
            value={advanceFilterModalFormik.values.academicYearId}
            onChange={advanceFilterModalFormik.handleChange}
            menuItems={academicYearList}
            valueKey="academicYearId"
            textKey="academicYearName"
            formgroupClassName="mb-0"
            labelText="Academic Year"
          />
        </div>

        <div className="tw-mb-4 tw-flex tw-gap-2 tw-items-center">
          <div className="">
            <UploadImageUpdated
              name="name-logo"
              acceptFileFormat="image/png, image/gif, image/jpeg"
              hideHelperText={true}
            ></UploadImageUpdated>
          </div>
          <div className="tw-flex-1">
            <TextInput
              name="name"
              value={advanceFilterModalFormik.values.name}
              onChange={advanceFilterModalFormik.handleChange}
              onBlur={advanceFilterModalFormik.handleBlur}
              placeHolder="Enter name"
              formgroupClassName="tw-mb-0"
              labelText="Name"
            />
          </div>
        </div>

        <div className="tw-mb-4">
          <TextInput
            name="tags"
            value={advanceFilterModalFormik.values.tags}
            onChange={advanceFilterModalFormik.handleChange}
            onBlur={advanceFilterModalFormik.handleBlur}
            placeHolder="Add a tag"
            formgroupClassName="tw-mb-0"
            labelText="Tags"
          />
        </div>
        <div className="tw-mb-4">
          <TextInput
            name="documentsToInclude"
            value={advanceFilterModalFormik.values.documentsToInclude}
            onChange={advanceFilterModalFormik.handleChange}
            onBlur={advanceFilterModalFormik.handleBlur}
            placeHolder="Documents"
            formgroupClassName="tw-mb-0"
            labelText="Documents to include"
          />
        </div>
      </div>
      <div className="offcanvas-footer tw-px-4 tw-py-3 tw-border-t">
        <div className="hstack gap-2 justify-content-end">
          <Button type="button" variant="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdvanceFilterModal;
