import React, { useEffect } from 'react'
import { BrowseFile, DateInput, SelectInput, TextArea, TextInput, Button } from '../../../Components/Common'
import { useFormik } from 'formik';
import { eventType } from './helper';
import { parseAndFormatDate } from '../../../utility/dateutility';
import * as Yup from "yup";
const initialValues = {
  id: '', 
  type: '',
  name: '',
  startDate: '',
  endDate: '',
  location: '',
  description: '',
  uploadImage: '',
  file1: null as File | null,
}
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  startDate: Yup.date().required('Start Date is required'),
  endDate: Yup.date().required('End Date is required'),
  location: Yup.string().required('Location is required'),
  description: Yup.string().required('Description is required'),
})
function AddEditEventModal(props: any) {
    const eventForm = useFormik({
      initialValues,
      validationSchema,
      onSubmit: (values) => {
        props.setEvent(values)
        props.toggle()        
       }
  })
  useEffect(() => {
    const { events } = props;
    
    if (!events || Object.keys(events).length === 0) {
      eventForm.resetForm();
      return;
    }
  
    if (!events?.startDate || !events?.endDate) return;
  
    try {
      eventForm.setValues({
        ...initialValues,
        id: events.id || '',
        type: events.type || '',
        name: events.name || '',
        startDate: parseAndFormatDate(events.startDate),
        endDate: parseAndFormatDate(events.endDate),
        location: events.location || '',
        description: events.description || '',
        uploadImage: events.uploadImage || '',
      });
  
    } catch (error) {
      console.error(error);
      eventForm.resetForm();
    }
  }, [props.events]);
  
  function onChangeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name } = event.target;
    const file1 = event.target.files && event.target.files[0];
    eventForm.setValues((prevState) => ({
        ...prevState, uploadImage: file1 ? file1.name : '',
        file1
    }))
}
  return (
    <>
      <form onSubmit={eventForm.handleSubmit}>
        <div className="modal-body tw-pb-3">
          <div className="tw-grid tw-grid-cols-12 tw-gap-3">
            <div className="tw-col-span-12">
              <SelectInput
                name="type"
                value={eventForm.values.type}
                onChange={eventForm.handleChange}
                menuItems={eventType || []}
                labelText="Type"
                formgroupClassName="tw-mb-0"
                valueKey="id"
                textKey="name"
                labelClass='required'
                invalid={eventForm.touched.type && Boolean(eventForm.errors.type)}
                error={eventForm.touched.type && eventForm.errors.type}
              />
            </div>
            <div className="tw-col-span-12">
              <TextInput
                name="name"
                value={eventForm.values.name}
                onChange={eventForm.handleChange}
                inputClassName="tw-bg-gray-50"
                labelText="Name"
                maxLength={50}
                placeHolder="Enter Name"
                labelClass='required'
                invalid={eventForm.touched.name && Boolean(eventForm.errors.name)}
                error={eventForm.touched.name && eventForm.errors.name}
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <DateInput
                name="startDate"
                labelText="Start Date"
                inputType="datetime-local"
                value={eventForm.values.startDate}
                onChange={eventForm.handleChange}
                labelClass='required'
                invalid={eventForm.touched.startDate && Boolean(eventForm.errors.startDate)}
                error={eventForm.touched.startDate && eventForm.errors.startDate}
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <DateInput
                name="endDate"
                labelText="End Date"
                inputType="datetime-local"
                value={eventForm.values.endDate}
                onChange={eventForm.handleChange}
                labelClass='required'
                invalid={eventForm.touched.endDate && Boolean(eventForm.errors.endDate)}
                error={eventForm.touched.endDate && eventForm.errors.endDate}
              />
            </div>
            <div className="tw-col-span-12">
              <TextInput
                name="location"
                value={eventForm.values.location}
                onChange={eventForm.handleChange}
                inputClassName="tw-bg-gray-50"
                labelText="Location"
                maxLength={50}
                placeHolder="Enter Location"
                labelClass='required'
                invalid={eventForm.touched.location && Boolean(eventForm.errors.location)}
                error={eventForm.touched.location && eventForm.errors.location}
              />
            </div>
            <div className="tw-col-span-12">
              <TextArea
                name="description"
                value={eventForm.values.description}
                onChange={eventForm.handleChange}
                labelText="Description"
                labelClass='required'
                invalid={eventForm.touched.description && Boolean(eventForm.errors.description)}
                error={eventForm.touched.description && eventForm.errors.description}
              />
            </div>
            <div className="tw-col-span-12">
              <BrowseFile
                containerClassName="tw-mb-3"
                labelText="Upload Image"
                name="uploadImage"
                fileName={eventForm.values.uploadImage}
                onChangeFileHndlr={onChangeHndlr}
              />
            </div>
            <div className="tw-col-span-12 tw-flex tw-justify-end">
              <div>
                <Button variant="primary" type="submit">
                 { props.events.id ? "Update Event" : "Add Event"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
export default AddEditEventModal