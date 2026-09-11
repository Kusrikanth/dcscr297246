import React, { useState, useEffect, useRef } from "react";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { Button, DateInput, SelectInput, TextInput, TextInputGroup } from "../../../Components/Common";
import { IChangeBookRenewalProps } from "./BookRenewalTypes";
import { selectData1, } from "./helper";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storehook";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";

const initialValues = {
  library: "",
  academicYearId: "",
  accessionNumber: "",
  issuancesDate: "",
  returnDate: "",
  currentDate: "",
  renewalDate: "",
};

const BookRenewalModel: React.FC<IChangeBookRenewalProps> = (props) => {
  const dispatch = useDispatch();
  const [BookRenewalModelFilter, setBookRenewalModelFilter] = useState(initialValues);
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const [BookRenewal, setBookRenewal] =
    useState(initialValues);

  const BookRenewalForm = useFormik({
    enableReinitialize: true,
    initialValues: BookRenewal,
    onSubmit: (values) => { },
  });

  useEffect(() => {
    if (!props.isOpen) {
      BookRenewalForm.resetForm();
    }
  }, [props.isOpen]);

  const {
    academicYearListResp,
    currentInstIdResp: instituteId,
  }: any = useAppSelector(
    ({ instAcademics, appData, }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
    }),
    shallowEqual
  );
  useEffect(() => {
    const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    dispatch(
      getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload))
    );
  }, []);
  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT").academicYearId
      setBookRenewalModelFilter((prev: any) => ({ ...prev, academicYearId: yearId }))
      // BookRenewalModelList(undefined,{academicYearId:yearId})
    }
  }, [academicYearListResp]);
  const { data: academicYearList } = academicYearListResp || {};
  return (
    <>
      <form>
        <div className="tw-flex tw-flex-wrap tw-gap-y-3 tw-my-3 tw-px-4">
          <div className="tw-w-full md:tw-w-1/2 tw-px-2">
            <SelectInput
              name="academicYearId"
              labelText="Academic Year"
              labelClass="tw-font-bold"
              value={BookRenewalForm.values.academicYearId}
              onChange={BookRenewalForm.handleChange}
              menuItems={academicYearList || []}
              valueKey="academicYearId"
              textKey="academicYearName"
              formgroupClassName="tw-mb-3"
            />
          </div>
          <div className="tw-w-full md:tw-w-1/2 tw-px-2">
            <SelectInput
              name="library"
              labelClass="tw-font-bold"
              labelText="Library"
              value={BookRenewalForm.values.library}
              onChange={BookRenewalForm.handleChange}
              menuItems={selectData1}
              valueKey="libraryType"
              textKey="libraryType"
              formgroupClassName="tw-mb-3"
            />
          </div>
          <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "10px", marginTop: "20px" }}>
            <p className='tw-text-sm' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>Book Info</p>
            <div>
              <div className='tw-flex tw-flex-wrap'>
                <div className='tw-w-full tw-px-2'>
                  <div className="tw-relative search-box">
                    <TextInput
                      name="accessionNumber"
                      labelText="Accession No"
                      labelClass="tw-font-bold"
                      formgroupClassName="tw-mb-3"
                      placeHolder="Search by Accession No or Book Name ..."
                      value={BookRenewalForm.values.accessionNumber}
                      onChange={BookRenewalForm.handleChange}
                    />
                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-[38px] tw-text-gray-400"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tw-flex tw-flex-wrap tw-px-4 tw-pb-4">
          <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "10px", marginTop: "20px" }}>
            <p className='tw-text-sm' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>Issuance Info</p>
            <div className="tw-flex tw-flex-wrap">
              <div className="tw-w-full md:tw-w-1/2 tw-px-2">
                <DateInput
                  name="issuancesDate"
                  labelText="Issuance Date"
                  labelClass="tw-font-bold"
                  isDisabled
                  value={BookRenewalForm.values.issuancesDate}
                  onChange={BookRenewalForm.handleChange}
                />
              </div>
              <div className="tw-w-full md:tw-w-1/2 tw-px-2">
                <DateInput
                  name="returnDate"
                  labelText="Return Date"
                  labelClass="tw-font-bold"
                  isDisabled
                  value={BookRenewalForm.values.returnDate}
                  onChange={BookRenewalForm.handleChange}
                />
              </div>
              <div className="tw-w-full md:tw-w-1/2 tw-px-2">
                <DateInput
                  name="currentDate"
                  labelText="Current Date"
                  labelClass="tw-font-bold"
                  value={BookRenewalForm.values.currentDate}
                  onChange={BookRenewalForm.handleChange}
                />
              </div>
              <div className="tw-w-full md:tw-w-1/2 tw-px-2">
                <DateInput
                  name="renewalDate"
                  labelText="Renewal Date"
                  labelClass="tw-font-bold"
                  value={BookRenewalForm.values.renewalDate}
                  onChange={BookRenewalForm.handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="tw-flex tw-justify-end tw-gap-2 tw-mx-4 tw-my-3">
          <Button
            type="button"
            variant="secondary"
            onClick={props.toggle}
          >
            Reset
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={(event: any) =>
              BookRenewalForm.handleSubmit(event)
            }
          >
            Submit
          </Button>
        </div>
      </form>
    </>
  );
};

export default BookRenewalModel;
