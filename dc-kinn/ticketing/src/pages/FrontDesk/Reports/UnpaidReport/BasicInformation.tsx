import React, { useCallback, useEffect, useMemo, useRef, useState, } from "react";
import { TextInput, } from "../../../../Components/Common";
import { AccordionBody, AccordionHeader } from "reactstrap";

export default function AcademicDetails(props:any) {
  const {initialValues} = props || {}
  return (
    <form>
      <AccordionHeader tag="h5" targetId="basicinformation">
        Basic Information
      </AccordionHeader>
      <AccordionBody accordionId="basicinformation">
        <div className="tw-flex tw-flex-wrap tw--mx-3 tw-gap-y-4" style={{margin:"0 -1.75rem"}}>
          <div className="tw-w-full md:tw-w-1/2 tw-px-3">
            <TextInput
              name="student-name"
              labelText="Student Name"
              labelClass={"tw-font-bold"}
              formgroupClassName="tw-mb-0"
              isDisabled
              value={initialValues.studentName}
            />
          </div>
          <div className="tw-w-full md:tw-w-1/2 tw-px-3">
            <TextInput
              name="fathername"
              labelText="Father Name"
              labelClass={"tw-font-bold"}
              formgroupClassName="tw-mb-0"
              isDisabled
              value={initialValues.fatherName}
            />
          </div>
          <div className="tw-w-full md:tw-w-1/2 tw-px-3">
            <TextInput
              name="contactno"
              labelText="Contact No"
              labelClass={"tw-font-bold"}
              formgroupClassName="tw-mb-0"
              isDisabled
              value={initialValues.contactNo}
            />
          </div>
          <div className="tw-w-full md:tw-w-1/2 tw-px-3">
            <TextInput
              name="email"
              labelText="Email Id"
              labelClass={"tw-font-bold"}
              formgroupClassName="tw-mb-0"
              isDisabled
              value={initialValues.email}
            />
          </div>
          <div className="tw-w-full tw-px-3">
            <TextInput
              name="address"
              labelText="Address"
              labelClass={"tw-font-bold"}
              formgroupClassName="tw-mb-0"
              isDisabled
              value={initialValues.address}
            />
          </div>
        </div>
      </AccordionBody>
    </form>
  );
}
