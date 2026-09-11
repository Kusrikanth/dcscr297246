import React, { useState } from 'react'
import { DateInput, PhoneInput, SelectInput, StatusLabel, TextArea, TextInput, UploadImage, UserDetails } from '../../../../Components/Common'
import Button from '../../../../Components/Common/Button';
import DefaultStudentImage from "../../../../assets/imagesdps/student-default-img.png";
import AccordionCardItem from '../../../../Components/Common/AccordionCardItem';
import AccordionCardHeader from '../../../../Components/Common/AccordionCardHeader';
import AccordionCardBody from '../../../../Components/Common/AccordionCardBody';
import UncontrolledAccordionCard from '../../../../Components/Common/UncontrolledAccordionCard';
import { useFormik } from 'formik';

const initialValues ={
  searchString : "",
  firstName : "",
  lastName : "",
  email : "",
  phoneNo : "",
  leadOwner : "",
  role:"",
  entity : "",
  institute : ""
}
const AddStaffModel = (props:any) => {
  const [initialData, setInitialData] = useState(initialValues);
  function applyFilterHndlr() {

  }
  const AddStaffForm = useFormik({
    enableReinitialize: true,
    initialValues: initialData,
    onSubmit: (values) => {

    }})
  return (
    <React.Fragment>
     <div className='tw-p-3'>
      <p className='tw-text-xl tw-font-bold tw-mb-1'>Staff Member</p>
      <div className="search-box">
                          <TextInput
                              name="searchString"
                              // value={filterState.searchString}
                              // onChange={filterHandler}
                              inputClassName="tw-bg-gray-100"
                              formgroupClassName="tw-mb-0"
                              placeHolder="Search..."
                          />

                          <i className="ri-search-line search-icon"></i>
                      </div>
     </div>
      <div>
        <UncontrolledAccordionCard
          defaultOpen={[
            '1',
            '2',
            '3',
            '4',
            '5',
            '6'
          ]}
        >
          <AccordionCardItem>
            <AccordionCardHeader targetId="1" title="User Information" accordionHeaderClass="tw-bg-gray-100" titleClass="tw-text-black tw-font-bold" />
            <AccordionCardBody accordionId="1" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px", padding: "0px", border: "0px" }} >
              <div className='tw-flex tw-flex-wrap'>
                <div className='tw-w-[16.666667%]'>
                  <p>Profile Image</p>
                  <UploadImage name="img" acceptFileFormat='image/*' />
                </div>
                <div className='tw-w-[83.333333%]'>
                  <div className='tw-flex-grow'>
                    <div className="tw-flex tw-flex-wrap tw-mb-3">
                      <p className="tw-text-gray-500 tw-w-[16.666667%] tw-mb-0 tw-flex tw-items-center">First Name:</p>
                      <TextInput
                        name='firstName'
                        value={AddStaffForm.values.firstName}
                        onChange={AddStaffForm.handleChange}
                        formgroupClassName="tw-font-bold tw-w-[66.666667%]"
                      />
                    </div>
                    <div className="tw-flex tw-flex-wrap tw-mb-3">
                      <p className="tw-text-gray-500 tw-w-[16.666667%] tw-mb-0 tw-flex tw-items-center">Last Name:</p>
                      <TextInput
                        name='lastName'
                        value={AddStaffForm.values.lastName}
                        onChange={AddStaffForm.handleChange}
                        formgroupClassName="tw-font-bold tw-w-[66.666667%]"
                      />
                    </div>
                    <div className="tw-flex tw-flex-wrap tw-mb-3">
                      <p className="tw-text-gray-500 tw-w-[16.666667%] tw-mb-0 tw-flex tw-items-center">Email:</p>
                      <TextInput
                        name='email'
                        value={AddStaffForm.values.email}
                        onChange={AddStaffForm.handleChange}
                        formgroupClassName="tw-font-bold tw-w-[66.666667%]"
                      />
                    </div>
                    <div className="tw-flex tw-flex-wrap tw-mb-3">
                      <p className="tw-text-gray-500 tw-w-[16.666667%] tw-mb-0 tw-flex tw-items-center">Phone No:</p>
                      <PhoneInput
                        name='phoneNo'
                        labelText=''
                        value={AddStaffForm.values.phoneNo}
                        onChange={AddStaffForm.handleChange}
                        formgroupClassName="tw-font-bold tw-w-[66.666667%]"
                      />
                    </div>
                    <div className="tw-flex tw-flex-wrap tw-mb-3">
                      <p className="tw-text-gray-500 tw-w-[16.666667%] tw-mb-0 tw-flex tw-items-center">D.O.B:</p>
                      <DateInput
                        name='leadOwner'
                        value={AddStaffForm.values.leadOwner}
                        onChange={AddStaffForm.handleChange}
                        formgroupClassName="tw-font-bold tw-w-[66.666667%]"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </AccordionCardBody>
          </AccordionCardItem>

          <AccordionCardItem>
            <AccordionCardHeader targetId="2" title="Additional Information" accordionHeaderClass="tw-bg-gray-100" titleClass="tw-text-black tw-font-bold" />
            <AccordionCardBody accordionId="2" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px", padding: "0px", border: "0px" }} >
            <div className='tw-flex tw-flex-wrap'>
                <div className='tw-w-[16.666667%]'>
                </div>
                <div className='tw-w-[83.333333%]'>
                  <div className='tw-flex-grow'>
                    <div className="tw-flex tw-flex-wrap tw-mb-3">
                      <p className="tw-text-gray-500 tw-w-[16.666667%] tw-mb-0 tw-flex tw-items-center">Role</p>
                      <SelectInput
                        name="role"
                        value={AddStaffForm.values.role}
                        onChange={AddStaffForm.handleChange}
                        menuItems={[]}
                        valueKey="role"
                        textKey="role"
                        defaultSelect="Select Role"
                        formgroupClassName="tw-font-bold tw-w-[66.666667%]"
                      />
                    </div>
                    <div className="tw-flex tw-flex-wrap tw-mb-3">
                      <p className="tw-text-gray-500 tw-w-[16.666667%] tw-mb-0 tw-flex tw-items-center">Entity</p>
                      <SelectInput
                        name="entity"
                        value={AddStaffForm.values.entity}
                        onChange={AddStaffForm.handleChange}
                        menuItems={[]}
                        valueKey="entity"
                        textKey="entity"
                        defaultSelect="Select Entity"
                        formgroupClassName="tw-font-bold tw-w-[66.666667%]"

                      />
                    </div>
                    <div className="tw-flex tw-flex-wrap tw-mb-3">
                      <p className="tw-text-gray-500 tw-w-[16.666667%] tw-mb-0 tw-flex tw-items-center">Institute</p>
                      <SelectInput
                        name="institute"
                        value={AddStaffForm.values.institute}
                        onChange={AddStaffForm.handleChange}
                        menuItems={[]}
                        valueKey="institute"
                        textKey="institute"
                        defaultSelect="Select Institute"
                        formgroupClassName="tw-font-bold tw-w-[66.666667%]"

                      />
                    </div>
                  </div>
                </div>
              </div>

            </AccordionCardBody>
          </AccordionCardItem>
        </UncontrolledAccordionCard>
      </div>
      <div className='tw-p-3'>
        <div className="tw-flex tw-items-center tw-gap-2 tw-py-2 tw-justify-end">
        <Button
            type="submit"
            onClick={applyFilterHndlr}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={applyFilterHndlr}
            variant="primary"
          >
            Save
          </Button>
        </div>
      </div>
    </React.Fragment>

  )
}

export default AddStaffModel