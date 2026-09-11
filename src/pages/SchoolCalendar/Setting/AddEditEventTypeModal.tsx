import React, { useRef } from 'react'
import { TextInput, Button } from '../../../Components/Common'
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from 'formik';
import { generateUniqueNumber } from '../../../utility/commonutility';
import { Input } from 'reactstrap';
const initialValues = {
    bedRequestDtos: [
        {
          id: generateUniqueNumber(),
          type: "",
          color: "",
        }
      ],
}
const AddEditEventTypeModal = (props: any) => {
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const addHostelRoomDetails = useFormik({
        initialValues,
        onSubmit: (values) => {
          
        },
      });
      function addNewHostelRoomDetailsHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        if (formikArrayHelpers.current) {
          formikArrayHelpers.current.push({
            id: generateUniqueNumber(),
            type: "",
            color: "",
          });
        }
      }
      function removeCommanAlinmentsHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
          formikArrayHelpers.current?.remove(Number(rowIndex));
        }
      }
  return (
    <>
         <div className='modal-body tw-pb-3'>
            <div className='tw-grid tw-grid-cols-12 tw-gap-3'>
                <div className="tw-col-span-12">
                <div className="tw-flex tw-flex-wrap tw-py-2 tw-mx-0 tw-items-center">
                    <div className="tw-w-1/2">
                    <h6 className="tw-mb-0">Event Type</h6>
                    </div>
                    <div className="tw-w-1/2">
                    <h6 className="tw-mb-0">Color Code</h6>
                    </div>
                </div>
                </div>
                <div className="tw-col-span-12">
                <FormikProvider value={addHostelRoomDetails}>
                    <FieldArray name="bedRequestDtos">
                    {(arrayHelpers: ArrayHelpers) => {
                        formikArrayHelpers.current = arrayHelpers;
                        return (
                        <>
                            {addHostelRoomDetails.values.bedRequestDtos.map((color: any, index: any) => {
                            const inputFieldErrors: any = addHostelRoomDetails.errors.bedRequestDtos && addHostelRoomDetails.errors.bedRequestDtos[index] || {};
                            const inputFieldTouched = addHostelRoomDetails.touched.bedRequestDtos && addHostelRoomDetails.touched.bedRequestDtos[index] || {};
                            return (
                                <div key={color.id} className="tw-mb-3 tw-flex tw-flex-wrap tw-mx-0 tw-items-center">
                                <div className="tw-w-1/2 tw-pr-2">
                                    <TextInput
                                    name={`bedRequestDtos[${index}].color`}
                                    onChange={addHostelRoomDetails.handleChange}
                                    onBlur={addHostelRoomDetails.handleBlur}
                                    value={color.color}
                                    formgroupClassName='tw-mb-0'
                                    
                                    
                                    />
                                </div>
                                <div className="tw-w-5/12 tw-px-2">
                                    <Input
                                    type="color"
                                    className="tw-w-full tw-p-1 tw-h-9 tw-border tw-border-gray-300 tw-rounded tw-cursor-pointer"
                                    id="colorPicker"
                                    defaultValue="#364574"
                                    />
                                </div>
                                <div className="tw-w-1/12 tw-text-right tw-pl-2">
                                    {index !== 0 && (
                                    <Button
                                        data-index={index}
                                        variant='wrong'
                                        onClick={removeCommanAlinmentsHndlr}
                                        // className="tw-w-8 tw-h-8 tw-inline-flex tw-items-center tw-justify-center tw-rounded-full tw-text-red-500 hover:tw-bg-red-50 tw-transition-colors tw-ml-1"
                                        type="button"
                                    >
                                        <i className="ri-delete-bin-2-fill tw-text-lg" />
                                    </Button>
                                    )}
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
                {!props?.alignId && <div className="tw-col-span-12">
                    <div className="tw-w-full">
                        <Button
                        variant="soft"
                        onClick={addNewHostelRoomDetailsHndlr}
                        className="tw-px-2 tw-py-1 tw-text-sm"
                        >
                        <i className="ri-add-line" />
                        Add New
                        </Button>
                    </div>
                    </div>}
                <div className="tw-col-span-12 tw-flex tw-gap-2 tw-justify-end tw-mt-4 tw-p-3">
            <Button
              variant="secondary"
              onClick={props.toggle}
            >
              Cancel
            </Button>
            <Button 
                variant="primary"
                onClick={(event: any) => { addHostelRoomDetails.handleSubmit(event) }}
            >
              {props.id ? "Update" : "Save"}
            </Button>
          </div>
            </div>
        </div>
    </>
  )
}
export default AddEditEventTypeModal