import React, { useEffect, useMemo, useState } from 'react'
import {  DateInput, TimeInput } from '../../../../Components/Common';
import { useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import TableContainer from '../../../../Components/Common/TableContainer';
import { convertTo12HourFormat, convertTo24HourFormat } from '../../../../utility/dateutility';
import { generateColumnsForAbsentStuExamDetails } from './helper';
import * as Yup from "yup";
import { generateActionPayload } from '../../../../utility/reduxutility';
import { editAbsentStudentExamAct, resetByIdExamAbsentStudentAct } from '../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import { toast } from 'react-toastify';
import Button from '../../../../Components/Common/Button';

const validationSchema = Yup.object().shape({
    examDate: Yup.string().required("Exam Date is required"),
    timeSlot: Yup.string().required("Time Slot is required"),
});

const EditAbsentStudentExam = (props:any) => {
    const dispatch = useDispatch(); 
     const [absentStudentList, setAbsentStudentList] = useState<any>([]);

    const {
        showApiLoader,
        getByIdExamAbsentStudentResp,
    }: any = useAppSelector(
        ({applicationSale, globalData }) => ({
            showApiLoader: globalData.showApiLoader,
            getByIdExamAbsentStudentResp:applicationSale.getByIdExamAbsentStudentResp,
        }),
        shallowEqual
    );

    const editAbsStuExamForm = useFormik({
        initialValues: {
            examDate : "",
            timeSlot : "",
        },
        validationSchema,
        onSubmit: (values:any) => {
            if(getByIdExamAbsentStudentResp?.examScheduleId){

                const payload = {
                    examDate : values.examDate,
                    timeSlot : `${convertTo12HourFormat(values.timeSlot) || ""}` || null,
                }
                dispatch(editAbsentStudentExamAct(generateActionPayload("edit_abs_stu_exam", {examScheduleId: getByIdExamAbsentStudentResp?.examScheduleId },{...payload})));
            }else{
                toast.error("No Stundents Found For Edit Reschedule");
            }
        },
    });

    useEffect(() => {
        if(getByIdExamAbsentStudentResp){
            const {examDetails,students} = getByIdExamAbsentStudentResp || {}
            setAbsentStudentList(students || [])
            editAbsStuExamForm.setValues((prev:any)=>({
                ...prev,
                examDate : examDetails?.examDate || "",
                timeSlot : convertTo24HourFormat(examDetails?.timeSlot) || "" ,
            }))
        }
    },[getByIdExamAbsentStudentResp])

    useEffect(() => {
      if(!props.isOpen){
        dispatch(resetByIdExamAbsentStudentAct(undefined));
      }
    }, [props.isOpen])
    

    const editAbsStuDetailsColumn = useMemo(() => generateColumnsForAbsentStuExamDetails(), [absentStudentList]);

  return (
    <>
          <div className="tw-p-4">

              {/* Date & Time Row */}
              <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                  <div className="tw-col-span-12 md:tw-col-span-6">
                      <DateInput
                          name="examDate"
                          value={editAbsStuExamForm.values.examDate}
                          onChange={editAbsStuExamForm.handleChange}
                          onBlur={editAbsStuExamForm.handleBlur}
                          labelText="Examination Date"
                          invalid={editAbsStuExamForm.touched.examDate && editAbsStuExamForm.errors.examDate ? true : false}
                            error={editAbsStuExamForm.touched.examDate && editAbsStuExamForm.errors.examDate ? editAbsStuExamForm.errors.examDate : ""}
                    />
                  </div>

                  <div className="tw-col-span-12 md:tw-col-span-6">
                      <TimeInput
                          name="timeSlot"
                          labelText="Time slot"
                          value={editAbsStuExamForm.values.timeSlot}
                          onChange={editAbsStuExamForm.handleChange}
                          onBlur={editAbsStuExamForm.handleBlur}
                          invalid={editAbsStuExamForm.touched.timeSlot && editAbsStuExamForm.errors.timeSlot ? true : false}
                            error={editAbsStuExamForm.touched.timeSlot && editAbsStuExamForm.errors.timeSlot ? editAbsStuExamForm.errors.timeSlot : ""}
                    />
                  </div>

              </div>

              {/* Table Section */}
              <div className="tw--mx-6 tw-mt-4">
                  <TableContainer
                      columns={editAbsStuDetailsColumn}
                      data={absentStudentList || []}
                      divClass="tw-overflow-x-auto"
                      theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                  />
              </div>

              {/* Buttons */}
              <div className="tw-flex tw-justify-end tw-mt-6 tw-gap-4">

                  <Button
                      type="button"
                      variant='secondary'
                      onClick={() => props.toggle()}
                  >
                      Cancel
                  </Button>

                  <Button
                      type="submit"
                      variant='primary'
                      onClick={(event: any) => {
                          editAbsStuExamForm.handleSubmit(event);
                      }}
                      disabled={showApiLoader}
                  >
                      Submit
                  </Button>

              </div>

          </div>
    </>
  )
}

export default EditAbsentStudentExam