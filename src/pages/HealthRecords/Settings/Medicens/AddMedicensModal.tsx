import { useFormik } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { shallowEqual } from 'react-redux'
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { editMedicenListAct, saveMedicenListAct } from '../../../../store/healthrecords/healthrecordsaction';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { TextInput } from '../../../../Components/Common';
import Button from '../../../../Components/Common/Button';

const initialValues = {
  name: "",
  remarks: "",
  quantity: "",
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Medicen is required.").nullable(),
  quantity: Yup.string().matches(/^\d+$/, "Quantity must be a number.").required("Quantity is required.").nullable(),
});


const AddMedicensModal = (props: any) => {

  const dispatch = useAppDispatch();

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getMedicenListByIdResp,
  } = useAppSelector(
    ({ globalData, healthRecords, appData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getMedicenListByIdResp: healthRecords.getMedicenListByIdResp,
    }),
    shallowEqual
  );

  const addMedicensRef = useRef({
    prevGetMedicenListByIdResp: getMedicenListByIdResp,
  })

  useEffect(() => {
    const { prevGetMedicenListByIdResp } = addMedicensRef.current || {};

    if (getMedicenListByIdResp && prevGetMedicenListByIdResp !== getMedicenListByIdResp) {
      if (props?.medicineId) {
        const { quantity, remarks, name } = getMedicenListByIdResp || {}
        addMedicensForm.setValues((prev: any) => ({ ...prev, quantity, remarks, name }))
      }
    }

    addMedicensRef.current.prevGetMedicenListByIdResp = getMedicenListByIdResp;

  }, [getMedicenListByIdResp])

  const addMedicensForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (props?.medicineId) {
        dispatch(editMedicenListAct(generateActionPayload("edit_medicen_list", { medicineId: props?.medicineId }, { ...values })));
      } else {
        dispatch(saveMedicenListAct(generateActionPayload("save_medicen_list", undefined, { branchId, ...values })));
      }
    }
  })

  return (
    <>
      <form onSubmit={addMedicensForm.handleSubmit}>
        {/* Card Body */}
        <div className="tw-p-4">
          <div className="tw-grid tw-grid-cols-1 tw-gap-4">

            <div className="tw-col-span-1">
              <TextInput
                name="name"
                labelText="Medicine"
                labelClass="required"
                value={addMedicensForm.values.name}
                onChange={addMedicensForm.handleChange}
                invalid={
                  addMedicensForm.touched.name &&
                  Boolean(addMedicensForm.errors.name)
                }
                error={
                  addMedicensForm.touched.name && addMedicensForm.errors.name
                    ? addMedicensForm.errors.name
                    : ""
                }
              />
            </div>

            <div className="tw-col-span-1">
              <TextInput
                name="quantity"
                labelText="Quantity"
                labelClass="required"
                value={addMedicensForm.values.quantity}
                onChange={addMedicensForm.handleChange}
                invalid={
                  addMedicensForm.touched.quantity &&
                  Boolean(addMedicensForm.errors.quantity)
                }
                error={
                  addMedicensForm.touched.quantity && addMedicensForm.errors.quantity
                    ? addMedicensForm.errors.quantity
                    : ""
                }
              />
            </div>

            <div className="tw-col-span-1">
              <TextInput
                name="remarks"
                labelText="Remarks"
                value={addMedicensForm.values.remarks}
                onChange={addMedicensForm.handleChange}
              />
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="tw-border-t tw-shadow-inner tw-p-4">
          <div className="tw-flex tw-gap-2 tw-justify-end">

            <Button
              type="button"
              variant='secondary'
              onClick={props.toggle}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant='primary'
              disabled={showApiLoader}
            >
              {props.medicineId ? "Update" : "Submit"}
            </Button>

          </div>
        </div>
      </form>
    </>
  )
}

export default AddMedicensModal