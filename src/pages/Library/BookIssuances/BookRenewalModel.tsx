import React, { useEffect } from "react";
import { useFormik } from "formik";
import { DateInput, SelectInput, TextInput } from "../../../Components/Common";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import { Current_Date, getDateAfterCurrentDay } from "../../../utility/dateutility";
import { getUserTypeId } from "./helper";
import * as Yup from "yup";
import { saveLibraryBookRenewalAct } from "../../../store/library/bookissuance/bookissuanceaction";
import Button from "../../../Components/Common/Button";

const initialValues = {
  libraryName: "",
  academicYearId: "",
  issuanceDate: "",
  returnDate: "",
  currentDate: "",
  renewalDate: "",
};

const validationSchema = Yup.object().shape({
  currentDate: Yup.date().required("Current date is required.").nullable(),
  renewalDate: Yup.date().required("Renewal Date is required.").nullable(),
});

const BookRenewalModel: React.FC<any> = (props) => {
  const dispatch = useDispatch();

  const BookRenewalForm = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { currentDate, renewalDate } = values || {};
      const payload = {
        issuanceId: props.modalData.id,
        renewalDate: currentDate,
        nextReturnDate: renewalDate,
      }

      dispatch(saveLibraryBookRenewalAct(generateActionPayload("save_library_book_renewal", undefined, payload)));
    },
  });

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    getBookIssuanceUserTypeListResp,
    showApiLoader,
  }: any = useAppSelector(
    ({ instAcademics, appData, libraryBookIssuance, globalData }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getBookIssuanceUserTypeListResp: libraryBookIssuance.getBookIssuanceUserTypeListResp,
      showApiLoader: globalData.showApiLoader,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (props.modalData) {
      const { modalData } = props || {}
      const { academicYearId, libraryName, issuanceDate, returnDate } = modalData || {}
      const returnDays = getBookIssuanceUserTypeListResp?.find((item: any) => +item?.id === getUserTypeId(props.menuId,getBookIssuanceUserTypeListResp))?.maximumDays
      BookRenewalForm.setValues((prev) => ({
        ...prev,
        academicYearId, libraryName, issuanceDate, returnDate, currentDate: Current_Date, renewalDate: getDateAfterCurrentDay(+returnDays)
      }))
    }
  }, [props.modalData])

  const { data: academicYearList } = academicYearListResp || {};

  return (
    <>
      <form>

        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-3 tw-p-5">
          <div>
            <SelectInput
              name="academicYearId"
              labelText="Academic Year"
              value={BookRenewalForm.values.academicYearId}
              onChange={undefined}
              isDisabled={true}
              menuItems={academicYearList || []}
              valueKey="academicYearId"
              textKey="academicYearName"
              formgroupClassName="tw-mb-0"
            />
          </div>
          <div>
            <TextInput
              name="libraryName"
              labelText="Library"
              value={BookRenewalForm.values.libraryName}
              onChange={undefined}
              isDisabled={true}
              formgroupClassName="tw-mb-0"
            />
          </div>
          <div>
            <DateInput
              name="issuanceDate"
              labelText="Issuance Date"
              isDisabled={true}
              value={BookRenewalForm.values.issuanceDate}
              onChange={BookRenewalForm.handleChange}
              formgroupClassName="tw-mb-0"
            />
          </div>
          <div>
            <DateInput
              name="returnDate"
              labelText="Return Date"
              isDisabled={true}
              value={BookRenewalForm.values.returnDate}
              onChange={BookRenewalForm.handleChange}
              formgroupClassName="tw-mb-0"
            />
          </div>
          <div>
            <DateInput
              name="currentDate"
              labelText="Renewal Date"
              value={BookRenewalForm.values.currentDate}
              onChange={BookRenewalForm.handleChange}
              formgroupClassName="tw-mb-0"
              labelClass="required"
              invalid={BookRenewalForm.touched.currentDate && BookRenewalForm.errors.currentDate ? true : false}
              error={BookRenewalForm.touched.currentDate && BookRenewalForm.errors.currentDate ? BookRenewalForm.errors.currentDate : ""}
            />
          </div>
          <div>
            <DateInput
              name="renewalDate"
              labelText="Next Return Date"
              value={BookRenewalForm.values.renewalDate}
              onChange={BookRenewalForm.handleChange}
              formgroupClassName="tw-mb-0"
              labelClass="required"
              invalid={BookRenewalForm.touched.renewalDate && BookRenewalForm.errors.renewalDate ? true : false}
              error={BookRenewalForm.touched.renewalDate && BookRenewalForm.errors.renewalDate ? BookRenewalForm.errors.renewalDate : ""}
            />
          </div>
        </div>
        <div className="tw-flex tw-justify-end tw-gap-2 tw-mx-4 tw-my-3 tw-pb-1">
          <Button type="button" variant="secondary" onClick={props.toggle}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={showApiLoader}
          >
            Submit
          </Button>
        </div>
      </form>
    </>
  );
};

export default BookRenewalModel;
