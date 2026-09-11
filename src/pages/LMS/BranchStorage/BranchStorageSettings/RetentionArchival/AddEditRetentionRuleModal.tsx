import { useFormik } from 'formik';
import { SelectInput, TextInput } from '../../../../../Components/Common';
import Button from '../../../../../Components/Common/Button';

const initialValues = {
  ruleName: '',
  scope: '',
  condition: '',
  Action: '',
  status: '',
};

const AddEditRetentionRuleModal = ({ toggle }) => {
  const addEditOpenModalFormik = useFormik({
    initialValues,
    onSubmit: () => {},
  });

  return (
    <div className="tw-p-4 tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-3">
      <div className="tw-col-span-1 lg:tw-col-span-2">
        <TextInput
          name="ruleName"
          value={addEditOpenModalFormik.values.ruleName}
          onChange={addEditOpenModalFormik.handleChange}
          onBlur={addEditOpenModalFormik.handleBlur}
          labelText="Rule Name"
          placeHolder="e.g. Student Submissions"
          formgroupClassName="tw-mb-0"
        ></TextInput>
      </div>
      <div className="">
        <SelectInput
          name="scope"
          value={addEditOpenModalFormik.values.scope}
          onChange={addEditOpenModalFormik.handleChange}
          onBlur={addEditOpenModalFormik.handleBlur}
          menuItems={[]}
          textKey="label"
          valueKey="id"
          labelText="Scope"
          formgroupClassName="tw-mb-0"
        ></SelectInput>
      </div>
      <div className="">
        <SelectInput
          name="condition"
          value={addEditOpenModalFormik.values.condition}
          onChange={addEditOpenModalFormik.handleChange}
          onBlur={addEditOpenModalFormik.handleBlur}
          labelText="Condition"
          formgroupClassName="tw-mb-0"
          menuItems={[]}
          textKey="label"
          valueKey="id"
        ></SelectInput>
      </div>
      <div className="">
        <SelectInput
          name="Action"
          value={addEditOpenModalFormik.values.Action}
          onChange={addEditOpenModalFormik.handleChange}
          onBlur={addEditOpenModalFormik.handleBlur}
          labelText="Action"
          formgroupClassName="tw-mb-0"
          menuItems={[]}
          textKey="label"
          valueKey="id"
        ></SelectInput>
      </div>
      <div className="">
        <SelectInput
          name="status"
          value={addEditOpenModalFormik.values.status}
          onChange={addEditOpenModalFormik.handleChange}
          onBlur={addEditOpenModalFormik.handleBlur}
          labelText="Status"
          formgroupClassName="tw-mb-0"
          menuItems={[]}
          textKey="label"
          valueKey="id"
        ></SelectInput>
      </div>

      <div className="tw-justify-self-end tw-col-span-1 lg:tw-col-span-2 tw-mt-3">
        <div className="tw-flex tw-gap-2">
          <Button variant="soft">Cancel</Button>
          <Button variant="previous">Add Rule</Button>
        </div>
      </div>
    </div>
  );
};

export default AddEditRetentionRuleModal;
