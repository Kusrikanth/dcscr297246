import React, { useRef, useState } from 'react'
import { AutoSearchInputUpdated, TextInput, } from '../../../../Components/Common'
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { ArrayHelpers, FieldArray, FormikProvider } from 'formik'
import { getMedicenListAct } from '../../../../store/healthrecords/healthrecordsaction'
import { generateActionPayload } from '../../../../utility/reduxutility'
import { generateUniqueNumber } from '../../../../utility/commonutility'
import { Delete02StrokeStandard } from '@hugeicons-pro/core-stroke-standard';
import { HugeiconsIcon } from '@hugeicons/react';
import Button from '../../../../Components/Common/Button';


interface MedicineState {
  medicineId: string;
  searchString: string;
  quantity: string;
  remarks: string;
}
const Medicine = (props: any) => {

  const [searchMedicineState, setSearchMedicineState] = useState<MedicineState | any>(undefined);
  const { addStudentHealthRecordForm, route } = props || {};
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const dispatch = useAppDispatch();

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getMedicenListResp,
  }: any = useAppSelector(
    ({ globalData, appData, healthRecords }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getMedicenListResp: healthRecords.getMedicenListResp,
    }),
    shallowEqual
  );

  const selectedMedicine = (medicine: any, currentIndex: number) => {
    const { medicineId, name } = medicine || {};

    addStudentHealthRecordForm.setFieldValue(`medicineRequestDtos[${currentIndex}].medicineId`, medicineId);
    addStudentHealthRecordForm.setFieldValue(`medicineRequestDtos[${currentIndex}].searchString`, name);

    setSearchMedicineState((prevState: any) => {
      const updatedState = prevState ? [...prevState] : [];
      updatedState[currentIndex] = {
        medicineId,
        name
      };
      return updatedState;
    });
  };


  const getSelectedMedicine = (index: number) => {
    if (searchMedicineState && searchMedicineState[index]) {
      return searchMedicineState[index];
    } else {
      return {
        medicineId: addStudentHealthRecordForm.values.medicineRequestDtos[index].medicineId,
        name: addStudentHealthRecordForm.values.medicineRequestDtos[index].searchString,
      };
    }
  };

  function onInputSearchChangeMedicine(inputString: any) {

    const params = {
      branchId,
      searchString: inputString
    };

    dispatch(getMedicenListAct(generateActionPayload('get_medicen_list', undefined, params)));
  }

  function addNewCommanAlimentsHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        uniqueId: generateUniqueNumber(),
        searchString: "",
        quantity: "",
        medicineRemarks: "",
        isDeleted: false,
      });
    }
  }

  function removeCommanAlinmentsHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined && rowIndex !== null) {
      addStudentHealthRecordForm.setFieldValue(`medicineRequestDtos[${rowIndex}].isDeleted`, true);
    }
  }

  return (
    <>
      <div className="tw-grid tw-grid-cols-12 tw-gap-4">
        <div className="tw-col-span-4 tw-pb-2 tw-font-bold">
          Medicine
        </div>
        <div className="tw-col-span-4 tw-pb-2 tw-font-bold">
          Quantity
        </div>
        <div className="tw-col-span-3 tw-pb-2 tw-font-bold">
          Remarks
        </div>

        <div className="tw-col-span-12">
          <FormikProvider value={addStudentHealthRecordForm}>
            <FieldArray name="medicineRequestDtos">
              {(arrayHelpers: ArrayHelpers) => {
                if (!formikArrayHelpers.current) {
                  formikArrayHelpers.current = arrayHelpers;
                }

                return (
                  <>
                    {Array.isArray(addStudentHealthRecordForm.values.medicineRequestDtos) &&
                      addStudentHealthRecordForm.values.medicineRequestDtos.length > 0 && addStudentHealthRecordForm.values.medicineRequestDtos
                        ?.filter((alignName: any) => !alignName.isDeleted)?.map((alignName: any, index: any) => {
                          const inputFieldErrors: any = addStudentHealthRecordForm.errors.medicineRequestDtos && addStudentHealthRecordForm.errors.medicineRequestDtos[index] || {};
                          const inputFieldTouched = addStudentHealthRecordForm.touched.medicineRequestDtos && addStudentHealthRecordForm.touched.medicineRequestDtos[index] || {};
                          return (
                            <div key={alignName.uniqueId} className="tw-pb-3">
                              <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-items-start">

                                {/* Medicine */}
                                <div className="tw-col-span-12 lg:tw-col-span-4">
                                  <AutoSearchInputUpdated
                                    formgroupClassName="tw-search-box"
                                    name={`medicineRequestDtos[${index}].searchString`}
                                    placeHolder="Search..."
                                    onChange={(string: any) => {
                                      if (!string) {
                                        addStudentHealthRecordForm.setFieldValue(
                                          `medicineRequestDtos[${index}].searchString`,
                                          ""
                                        );
                                      }
                                      onInputSearchChangeMedicine(string);
                                    }}
                                    selectedOptionCallbck={(medicine: any) =>
                                      selectedMedicine(medicine, index)
                                    }
                                    selected={getSelectedMedicine(index)}
                                    valueKey="medicineId"
                                    labelHeader="id"
                                    labelKey="medicineId"
                                    subLabelHeader="Medicine Name"
                                    subLabelKey="name"
                                    options={
                                      Array.isArray(getMedicenListResp?.data)
                                        ? getMedicenListResp?.data
                                        : []
                                    }
                                  >
                                    <i className="ri-search-line" />
                                  </AutoSearchInputUpdated>
                                </div>

                                {/* Quantity */}
                                <div className="tw-col-span-12 lg:tw-col-span-4">
                                  <TextInput
                                    name={`medicineRequestDtos[${index}].quantity`}
                                    formgroupClassName="tw-mb-0"
                                    value={alignName.quantity}
                                    onChange={addStudentHealthRecordForm.handleChange}
                                    onBlur={addStudentHealthRecordForm.handleBlur}
                                    invalid={(inputFieldTouched.quantity && inputFieldErrors.quantity) ? true : false}
                                    error={(inputFieldTouched.quantity && inputFieldErrors.quantity) ? inputFieldErrors.quantity : ""}
                                  />
                                </div>

                                {/* Remarks + Delete */}
                                <div className="tw-col-span-12 lg:tw-col-span-3 tw-flex tw-items-start tw-gap-2">
                                  <TextInput
                                    name={`medicineRequestDtos[${index}].medicineRemarks`}
                                    formgroupClassName="tw-mb-0 tw-w-full"
                                    value={alignName.medicineRemarks}
                                    onChange={addStudentHealthRecordForm.handleChange}
                                    onBlur={addStudentHealthRecordForm.handleBlur}
                                    maxLength={200}
                                    invalid={(inputFieldTouched.medicineRemarks && inputFieldErrors.medicineRemarks) ? true : false}
                                    error={(inputFieldTouched.medicineRemarks && inputFieldErrors.medicineRemarks) ? inputFieldErrors.medicineRemarks : ""}
                                  />

                                  {index !== 0 && (
                                    <Button
                                      type="button"
                                      data-index={index}
                                      onClick={removeCommanAlinmentsHndlr}
                                      variant='wrong'
                                      className='!tw-rounded-full !tw-p-2'
                                      >
                                      <HugeiconsIcon
                                        icon={Delete02StrokeStandard}
                                        size={18}
                                      />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                  </>
                );
              }}
            </FieldArray>
          </FormikProvider>
        </div>
      </div>

      {!props?.alignId && (
        <div className="tw-mt-3">
          <Button
            onClick={addNewCommanAlimentsHndlr}
            variant='primary'
          >
            <i className="ri-add-line" />
            Add New
          </Button>
        </div>
      )}
    </>
  )
}

export default Medicine