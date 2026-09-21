import React from "react";
import { FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { InputCheckboxUpdated, TextInput } from "../../../../Components/Common";
import Button from "../../../../Components/Common/Button";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import {
  ITcRetentionMaster,
  TcRetentionMasterInput,
  TcRetentionMasterType,
} from "../../../../utility/tcretentionutility";
import { tcRetentionMasterConfigs } from "./helper";

interface IMasterRow {
  uniqueId: string;
  name: string;
  isClosure: boolean;
}

interface IAddTcRetentionMasterModal {
  type: TcRetentionMasterType;
  editItem?: ITcRetentionMaster;
  existingRecords: Array<ITcRetentionMaster>;
  toggle: () => void;
  submitHndlr: (items: Array<TcRetentionMasterInput>) => void;
}

const createRow = (item?: ITcRetentionMaster, index = 0): IMasterRow => ({
  uniqueId: `${generateUniqueNumber()}-${index}`,
  name: item?.name || "",
  isClosure: !!item?.isClosure,
});

const normalizeName = (name: string) => name.trim().toLowerCase();

const AddTcRetentionMasterModal: React.FC<IAddTcRetentionMasterModal> = (props) => {
  const { type, editItem, existingRecords, toggle, submitHndlr } = props;
  const { title, showClosure } = tcRetentionMasterConfigs[type];

  const masterForm = useFormik({
    initialValues: { rows: [createRow(editItem)] },
    validationSchema: Yup.object().shape({
      rows: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().trim().required(`${title} Name is required`),
        })
      ),
    }),
    onSubmit: (values, { setErrors }) => {
      const existingNames = existingRecords
        .filter((record) => `${record.id}` !== `${editItem?.id}`)
        .map((record) => normalizeName(record.name));
      const enteredNames: Array<string> = [];
      let hasDuplicate = false;
      const rowErrors = values.rows.map((row) => {
        const name = normalizeName(row.name);
        const isDuplicate = existingNames.includes(name) || enteredNames.includes(name);
        enteredNames.push(name);
        hasDuplicate = hasDuplicate || isDuplicate;
        return isDuplicate ? { name: `${title} already exists` } : {};
      });
      if (hasDuplicate) {
        setErrors({ rows: rowErrors as any });
        return;
      }
      submitHndlr(
        values.rows.map((row) => ({
          name: row.name.trim(),
          ...(showClosure ? { isClosure: row.isClosure } : {}),
        }))
      );
    },
  });

  return (
    <div className="tw-p-5">
      <h6 className="tw-text-sm tw-font-medium tw-mb-2">
        {title} Name <span className="tw-text-red-500">*</span>
      </h6>
      {showClosure && (
        <p className="tw-text-xs tw-text-gray-500 tw-mb-4">
          A status that closes the follow-up (e.g. Retained) doesn&apos;t ask for a next follow-up date.
        </p>
      )}
      <FormikProvider value={masterForm}>
        <FieldArray name="rows">
          {(arrayHelpers) => (
            <>
              {masterForm.values.rows.map((row, index) => {
                const rowErrors: any = (masterForm.errors.rows as any)?.[index] || {};
                const rowTouched: any = (masterForm.touched.rows as any)?.[index] || {};
                return (
                  <div key={row.uniqueId} className="tw-flex tw-items-start tw-gap-3 tw-mb-3">
                    <TextInput
                      name={`rows[${index}].name`}
                      value={row.name}
                      formgroupClassName="tw-mb-0 tw-flex-1"
                      onChange={masterForm.handleChange}
                      onBlur={masterForm.handleBlur}
                      invalid={!!(rowTouched.name && rowErrors.name)}
                      error={rowTouched.name && rowErrors.name ? rowErrors.name : ""}
                    />
                    {showClosure && (
                      <InputCheckboxUpdated
                        name={`rows[${index}].isClosure`}
                        labelName="Closes Follow-Up"
                        value={row.isClosure}
                        onChange={masterForm.handleChange}
                        formgroupClassName="tw-mb-0 tw-mt-2 tw-shrink-0"
                      />
                    )}
                    {!editItem && index !== 0 && (
                      <Button
                        type="button"
                        variant="wrong"
                        onClick={() => arrayHelpers.remove(index)}
                        className="!tw-px-2 !tw-py-1 tw-mt-1"
                      >
                        <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-text-red-500" size={18} />
                      </Button>
                    )}
                  </div>
                );
              })}
              {!editItem && (
                <div className="tw-mt-2">
                  <Button
                    type="button"
                    variant="hoverInfo"
                    onClick={() => arrayHelpers.push(createRow(undefined, masterForm.values.rows.length))}
                    className="!tw-px-3 !tw-py-1"
                  >
                    Add New
                  </Button>
                </div>
              )}
            </>
          )}
        </FieldArray>
      </FormikProvider>
      <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-6">
        <Button type="button" variant="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button type="button" variant="primary" onClick={(event: any) => masterForm.handleSubmit(event)}>
          {editItem ? "Update" : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default AddTcRetentionMasterModal;
