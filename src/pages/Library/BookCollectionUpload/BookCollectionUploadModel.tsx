import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { AutoSearchInputUpdated, DateInput, SelectInput, TextInputGroup, TextInputWithRegex } from "../../../Components/Common";
import { bookConditionOptions, issueStatus, } from "./helper";
import { default as RupeeSvg } from "../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import * as Yup from 'yup';
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { editLibraryBookCollectionAct, saveLibraryBookCollectionAct, setLibraryBookCollectionListByIdAct } from "../../../store/library/bookcollection/bookcollectionaction";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getLibrarypublisherList, getLibraryrack, getLibraryRooms, getLibraryshelf } from "../../../store/library/settings/librarysettingsaction";
import { resetLibraryRoomAct, resetRackAct, resetShelfAct } from "../../../store/library/settings/librarysettingsslice";
import { format } from "date-fns";
import { getFormYyyyMmDdFormat } from "../../../utility/dateutility";
import Button from "../../../Components/Common/Button";
import { useHistory, useLocation } from "react-router-dom";

interface BookCollectionFormValues {
  libraryId: string;
  roomId: string;
  curriculumId: string;
  shelfId: string;
  rackId: string;
  recordTypeId: string;
  categoryId: string;
  languageId: string;
  accessionCode: string;
  accessionPrefix: string;
  author: string;
  title: string;
  yearOfPublication: string;
  pages: string;
  publisherId: string;
  publisherName: string;
  shortName: string;
  source: string;
  invoiceDate: string;
  price: string;
  barCode: string;
  approval: string;
  bookCondition: string;
}

interface PublisherState {
  publisherId: string;
  publisherName: string;
  shortName: string;
}

const initialValues: BookCollectionFormValues = {
  publisherId: "",
  publisherName: "",
  curriculumId: "",
  shortName: "",
  libraryId: "",
  roomId: "",
  shelfId: "",
  rackId: "",
  recordTypeId: "",
  categoryId: "",
  languageId: "",
  accessionCode: "",
  accessionPrefix: "",
  author: "",
  title: "",
  yearOfPublication: "",
  pages: "",
  source: "",
  invoiceDate: "",
  price: "",
  barCode: "",
  approval: "",
  bookCondition: "New",
};

const isIssuanceScreen = location.pathname === "/library-book-issuance/book-issuance-details";

const validationSchema = Yup.object().shape(
  isIssuanceScreen
    ? {
        curriculumId: Yup.string().required("Curriculum is required."),
        libraryId: Yup.string().required("Library Name is required."),
        roomId: Yup.string().required("Room is required."),
        recordTypeId: Yup.string().required("Record Type is required."),
        title: Yup.string().required("Title is required."),
        publisherId: Yup.string().required("Publisher is required."),
        price: Yup.string().required("Price is required."),
      }
    : {
        curriculumId: Yup.string().required("Curriculum is required."),
        libraryId: Yup.string().required("Library Name is required."),
        roomId: Yup.string().required("Room is required."),
        shelfId: Yup.string().required("Shelf is required."),
        rackId: Yup.string().required("Rack is required."),
        publisherId: Yup.string().required("Publisher is required."),
        recordTypeId: Yup.string().required("Record Type is required."),
        categoryId: Yup.string().required("Category is required."),
        languageId: Yup.string().required("Language is required."),
        accessionCode: Yup.string().when('recordTypeId', {
          is: (recordTypeId: string) => recordTypeId !== "5",
          then: Yup.string().required("Accession Number is required."),
          otherwise: Yup.string(),
        }),
        invoiceDate: Yup.string().required("Invoice Date is required."),
        price: Yup.string().required("Price is required."),
      }
);

const BookCollectionUploadModel: React.FC<any> = (props) => {

  const [searchPublisherState, setSearchPublisherState] = useState<PublisherState | undefined>(undefined);
  const dispatch = useDispatch();
    const location = useLocation();

  const {
    brchCurriculumResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    libraryDetailsRequestListResp,
    libraryRoomsRequestListResp,
    libraryShelfRequestListResp,
    libraryRackRequestListResp,
    libraryRecordRequestListResp,
    libraryLanguageRequestListResp,
    libraryCategoryRequestListResp,
    libraryPublisherRequestListResp,
    getLibraryBookCollectionListByIdResp,
  } = useAppSelector(
    ({ branchAcademics, libraryBookCollection, librarysettings, appData, globalData, }) => ({
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      libraryDetailsRequestListResp: librarysettings.libraryDetailsRequestListResp,
      libraryRoomsRequestListResp: librarysettings.libraryRoomsRequestListResp,
      libraryShelfRequestListResp: librarysettings.libraryShelfRequestListResp,
      libraryRackRequestListResp: librarysettings.libraryRackRequestListResp,
      libraryRecordRequestListResp: librarysettings.libraryRecordRequestListResp,
      libraryLanguageRequestListResp: librarysettings.libraryLanguageRequestListResp,
      libraryCategoryRequestListResp: librarysettings.libraryCategoryRequestListResp,
      libraryPublisherRequestListResp: librarysettings.libraryPublisherRequestListResp,
      getLibraryBookCollectionListByIdResp: libraryBookCollection.getLibraryBookCollectionListByIdResp,

    }),
    shallowEqual
  );
  const singleBookUploadForm = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      const {
        curriculumId, libraryId, roomId, shelfId, rackId, recordTypeId, categoryId, languageId,
        accessionCode, accessionPrefix, author, title, yearOfPublication, pages, publisherId, source,
        invoiceDate, price, bookCondition
      } = values;

      const formattedInvoiceDate = invoiceDate
        ? format(new Date(invoiceDate), "yyyy-MM-dd'T'HH:mm:ss")
        : null;
      const payload = {
        branchId, instituteId, curriculumId, libraryId, roomId, shelfId, rackId, recordTypeId,
        categoryId, languageId, accessionCode, accessionPrefix, author, title, yearOfPublication,
        pages, publisherId, source, invoiceDate: formattedInvoiceDate, price, bookCondition
      };

      if (props?.id) {
        dispatch(editLibraryBookCollectionAct(generateActionPayload("edit_library_book_collection_list", { id: props.id }, payload)));
      } else {
        dispatch(saveLibraryBookCollectionAct(generateActionPayload("save_Library_book_collection", undefined, payload)));
      }
    },
  });

  useEffect(() => {
    return () => {
      dispatch(setLibraryBookCollectionListByIdAct(undefined))
    }
  }, []);

  const filterHandler = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    singleBookUploadForm.setFieldValue(name, value);
    if (value) {
      if (name === 'libraryId') {
        const payload = { branchId, libraryId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };
        dispatch(resetShelfAct(undefined));
        dispatch(resetRackAct(undefined));
        dispatch(resetLibraryRoomAct(undefined));
        dispatch(getLibraryRooms(generateActionPayload("get_library_rooms", undefined, payload)));
      } else if (name === 'roomId') {
        const payload = { branchId, roomId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };
        dispatch(resetShelfAct(undefined));
        dispatch(resetRackAct(undefined));
        dispatch(getLibraryshelf(generateActionPayload("get_library_shelf", undefined, payload)));
      } else if (name === 'shelfId') {
        const payload = { branchId, shelfId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };
        dispatch(resetRackAct(undefined));
        dispatch(getLibraryrack(generateActionPayload("get_library_rack", undefined, payload)));
      }
    }
  };


  const onInputSearchChange = (inputString: any) => {
    if (branchId && inputString) {
      const params = {
        branchId,
        publisherName: inputString,
      };
      dispatch(getLibrarypublisherList(generateActionPayload("get_library_publisher", undefined, params)));
    }
  };

  const selectedPublisher = (publisher: any) => {
    const { publisherId, publisherName, shortName } = publisher || {};
    singleBookUploadForm.setValues((prev: any) => ({ ...prev, publisherId, publisherName, shortName }));
    setSearchPublisherState(publisher);
  };

  useEffect(() => {
    if (props?.id && getLibraryBookCollectionListByIdResp) {

      const payload1 = { branchId, libraryId: getLibraryBookCollectionListByIdResp?.libraryId, pageNo: 0, pageSize: 100 };
      const payload2 = { branchId, roomId: getLibraryBookCollectionListByIdResp?.roomId, pageNo: 0, pageSize: 100 };
      const payload3 = { branchId, shelfId: getLibraryBookCollectionListByIdResp?.shelfId, pageNo: 0, pageSize: 100 };

      dispatch(getLibraryRooms(generateActionPayload("get_library_rooms", undefined, payload1)));
      dispatch(getLibraryshelf(generateActionPayload("get_library_shelf", undefined, payload2)));
      dispatch(getLibraryrack(generateActionPayload("get_library_rack", undefined, payload3)));

      const { curriculumId, libraryId, roomId, shelfId, rackId, recordTypeId, categoryId, languageId, accessionCode, accessionPrefix, author, title, yearOfPublication, pages, publisherId, publisherName, publisherShortName, source, invoiceDate, price, barCode, approval, bookCondition } = getLibraryBookCollectionListByIdResp || {}
      const formattedInvoiceDate = getFormYyyyMmDdFormat(invoiceDate);
      singleBookUploadForm.setValues((prev: any) => ({ ...prev, curriculumId, libraryId, roomId, shelfId, rackId, recordTypeId, categoryId, languageId, accessionCode, accessionPrefix, author, title, yearOfPublication, pages, publisherId, shortName: publisherShortName, publisherName, source, invoiceDate: formattedInvoiceDate, price, barCode, approval, bookCondition }));
      setSearchPublisherState({ publisherId, publisherName, shortName: publisherShortName });
    } else {
      singleBookUploadForm.resetForm();
    }
  }, [getLibraryBookCollectionListByIdResp]);

  const { content: PublisherList } = libraryPublisherRequestListResp || {};

  return (
    <>
      <div className="tw-p-4">
        <form onSubmit={singleBookUploadForm.handleSubmit}>
          <div className="tw-relative tw-border tw-border-gray-300 tw-rounded tw-p-5 tw-mb-6">
            <p className="tw-absolute tw--top-3 tw-left-4 tw-bg-white tw-px-2 tw-text-gray-600">
              Library Info
            </p>
            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
              <div className="tw-col-span-12 lg:tw-col-span-4">
                <SelectInput
                  name="curriculumId"
                  labelText="Curriculum"
                  labelClass="required"
                  value={singleBookUploadForm.values.curriculumId}
                  onChange={filterHandler}
                  menuItems={brchCurriculumResp?.data}
                  valueKey="branchCurriculumId"
                  textKey="curriculumName"
                  formgroupClassName="tw-mb-0"
                  onBlur={singleBookUploadForm.handleBlur}
                  invalid={singleBookUploadForm.touched.curriculumId && singleBookUploadForm.errors.curriculumId ? true : false}
                  error={singleBookUploadForm.touched.curriculumId && singleBookUploadForm.errors.curriculumId ? singleBookUploadForm.errors.curriculumId : ""}
                />
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-4">
                <SelectInput
                  name="libraryId"
                  labelText="Library Name"
                  labelClass="required"
                  value={singleBookUploadForm.values.libraryId}
                  onChange={filterHandler}
                  menuItems={libraryDetailsRequestListResp?.content || []}
                  valueKey="id"
                  textKey="libraryName"
                  formgroupClassName="tw-mb-0"
                  invalid={singleBookUploadForm.touched.libraryId && singleBookUploadForm.errors.libraryId ? true : false}
                  error={singleBookUploadForm.touched.libraryId && singleBookUploadForm.errors.libraryId ? singleBookUploadForm.errors.libraryId : ""}
                />
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-4">
                <SelectInput
                  name="roomId"
                  labelText="Room"
                  labelClass="required"
                  value={singleBookUploadForm.values.roomId}
                  onChange={filterHandler}
                  menuItems={libraryRoomsRequestListResp?.content || []}
                  valueKey="id"
                  textKey="roomName"
                  formgroupClassName="tw-mb-0"
                  invalid={singleBookUploadForm.touched.roomId && singleBookUploadForm.errors.roomId ? true : false}
                  error={singleBookUploadForm.touched.roomId && singleBookUploadForm.errors.roomId ? singleBookUploadForm.errors.roomId : ""}
                />
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-4">
                <SelectInput
                  name="shelfId"
                  labelText="Shelf"
                  labelClass={isIssuanceScreen ? "" : "required"}
                  value={singleBookUploadForm.values.shelfId}
                  onChange={filterHandler}
                  menuItems={libraryShelfRequestListResp?.data || []}
                  valueKey="id"
                  textKey="shelfName"
                  formgroupClassName="tw-mb-0"
                  invalid={singleBookUploadForm.touched.shelfId && singleBookUploadForm.errors.shelfId ? true : false}
                  error={singleBookUploadForm.touched.shelfId && singleBookUploadForm.errors.shelfId ? singleBookUploadForm.errors.shelfId : ""}
                />
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-4">
                <SelectInput
                  name="rackId"
                  labelText="Rack"
                  labelClass={isIssuanceScreen ? "" : "required"}
                  value={singleBookUploadForm.values.rackId}
                  onChange={filterHandler}
                  menuItems={libraryRackRequestListResp?.content || []}
                  valueKey="id"
                  textKey="rackName"
                  formgroupClassName="tw-mb-0"
                  invalid={singleBookUploadForm.touched.rackId && singleBookUploadForm.errors.rackId ? true : false}
                  error={singleBookUploadForm.touched.rackId && singleBookUploadForm.errors.rackId ? singleBookUploadForm.errors.rackId : ""}
                />
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-4">
                <SelectInput
                  name="recordTypeId"
                  labelText="Record Type"
                  labelClass="required"
                  value={singleBookUploadForm.values.recordTypeId}
                  onChange={singleBookUploadForm.handleChange}
                  menuItems={libraryRecordRequestListResp?.content || []}
                  valueKey="id"
                  textKey="recordType"
                  formgroupClassName="tw-mb-0"
                  invalid={singleBookUploadForm.touched.recordTypeId && singleBookUploadForm.errors.recordTypeId ? true : false}
                  error={singleBookUploadForm.touched.recordTypeId && singleBookUploadForm.errors.recordTypeId ? singleBookUploadForm.errors.recordTypeId : ""}
                />
              </div>

              <div className="tw-col-span-12 lg:tw-col-span-4">
                <SelectInput
                  name="categoryId"
                  labelText="Category"
                  labelClass={isIssuanceScreen ? "" : "required"}
                  value={singleBookUploadForm.values.categoryId}
                  onChange={singleBookUploadForm.handleChange}
                  menuItems={libraryCategoryRequestListResp?.content || []}
                  valueKey="id"
                  textKey="category"
                  formgroupClassName="tw-mb-0"
                  invalid={singleBookUploadForm.touched.categoryId && singleBookUploadForm.errors.categoryId ? true : false}
                  error={singleBookUploadForm.touched.categoryId && singleBookUploadForm.errors.categoryId ? singleBookUploadForm.errors.categoryId : ""}
                />
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-4">
                <SelectInput
                  name="languageId"
                  labelText="Language"
                  labelClass={isIssuanceScreen ? "" : "required"}
                  value={singleBookUploadForm.values.languageId}
                  onChange={singleBookUploadForm.handleChange}
                  menuItems={libraryLanguageRequestListResp?.content || []}
                  valueKey="id"
                  textKey="language"
                  formgroupClassName="tw-mb-0"
                  invalid={singleBookUploadForm.touched.languageId && singleBookUploadForm.errors.languageId ? true : false}
                  error={singleBookUploadForm.touched.languageId && singleBookUploadForm.errors.languageId ? singleBookUploadForm.errors.languageId : ""}
                />
              </div>
            </div>
          </div>
          <div className="tw-relative tw-border tw-border-gray-300 tw-rounded tw-p-5 tw-mb-6">
            <p className="tw-absolute tw--top-3 tw-left-4 tw-bg-white tw-px-2 tw-text-gray-600">
              Book Info
            </p>
            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
              <div className="tw-col-span-12 lg:tw-col-span-4">
                <TextInputWithRegex
                  labelText="Accession Number"
                  name="accessionCode"
                  value={singleBookUploadForm.values.accessionCode}
                  onChange={singleBookUploadForm.handleChange}
                  maxLength={50}
                  formgroupClassName="tw-mb-0"
                  allowedInputRegex="^[0-9]+$"
                />
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-4">
                <TextInputWithRegex
                  labelText="Accession Prefix"
                  name="accessionPrefix"
                  value={singleBookUploadForm.values.accessionPrefix}
                  onChange={singleBookUploadForm.handleChange}
                  maxLength={4}
                  formgroupClassName="tw-mb-0"
                  allowedInputRegex="^[a-z]+$"
                />
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-4">
                <TextInputWithRegex
                  name="author"
                  labelText="Author"
                  formgroupClassName="tw-mb-0"
                  value={singleBookUploadForm.values.author}
                  onChange={singleBookUploadForm.handleChange}
                />
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-4">
                <TextInputWithRegex
                  name="title"
                  labelText="Title"
                  labelClass={isIssuanceScreen ? "required" : ""}
                  formgroupClassName="tw-mb-0"
                  value={singleBookUploadForm.values.title}
                  onChange={singleBookUploadForm.handleChange}
                  invalid={singleBookUploadForm.touched.title && singleBookUploadForm.errors.title ? true : false}
                  error={singleBookUploadForm.touched.title && singleBookUploadForm.errors.title ? singleBookUploadForm.errors.title : ""}
                />
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-4">
                <TextInputWithRegex
                  name="yearOfPublication"
                  labelText="Year of Publication"
                  value={singleBookUploadForm.values.yearOfPublication}
                  onChange={singleBookUploadForm.handleChange}
                  maxLength={4}
                  allowedInputRegex="^[0-9]+$"
                  formgroupClassName="tw-mb-0"
                />
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-4">
                <TextInputWithRegex
                  name="pages"
                  labelText="Pages"
                  value={singleBookUploadForm.values.pages}
                  onChange={singleBookUploadForm.handleChange}
                  allowedInputRegex="^[0-9]+$"
                  formgroupClassName="tw-mb-0"
                />
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-4">
                <AutoSearchInputUpdated
                  formgroupClassName="search-box tw-mb-0"
                  name="publisherId"
                  placeHolder="Search..."
                  onChange={(string: any) => {
                    if (!string) singleBookUploadForm.setFieldValue('publisherId', "");
                    onInputSearchChange(string);
                  }}
                  onBlur={singleBookUploadForm.handleBlur}
                  valueKey="publisherId"
                  labelHeader="Short Name"
                  labelKey="shortName"
                  subLabelHeader="Publisher Name"
                  subLabelKey="publisherName"
                  labelText="Publisher"
                  labelClass='required'
                  options={PublisherList}
                  selected={searchPublisherState}
                  selectedOptionCallbck={selectedPublisher}
                  invalid={singleBookUploadForm.touched.publisherId && singleBookUploadForm.errors.publisherId ? true : false}
                  error={singleBookUploadForm.touched.publisherId && singleBookUploadForm.errors.publisherId ? singleBookUploadForm.errors.publisherId : ""}
                ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-4">
                <TextInputWithRegex
                  name="source"
                  labelText="Source"
                  formgroupClassName="tw-mb-0"
                  value={singleBookUploadForm.values.source}
                  onChange={singleBookUploadForm.handleChange}
                  maxLength={250}
                />
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-4">
                <DateInput
                  name="invoiceDate"
                  labelText="Invoice Date"
                  labelClass={isIssuanceScreen ? "" : "required"}
                  formgroupClassName="tw-mb-0"
                  value={singleBookUploadForm.values.invoiceDate}
                  onChange={singleBookUploadForm.handleChange}
                  onBlur={singleBookUploadForm.handleBlur}
                  invalid={singleBookUploadForm.touched.invoiceDate && singleBookUploadForm.errors.invoiceDate ? true : false}
                  error={singleBookUploadForm.touched.invoiceDate && singleBookUploadForm.errors.invoiceDate ? singleBookUploadForm.errors.invoiceDate : ""}
                />
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-4">
                <TextInputGroup
                  name="price"
                  labelText="Price"
                  labelClass='required'
                  formgroupClassName="tw-mb-0"
                  allowedInputRegex="^[0-9]+\.?[0-9]*$"
                  inputGroupStart={true}
                  value={singleBookUploadForm.values.price}
                  onChange={singleBookUploadForm.handleChange}
                  onBlur={singleBookUploadForm.handleBlur}
                  invalid={singleBookUploadForm.touched.price && singleBookUploadForm.errors.price ? true : false}
                  error={singleBookUploadForm.touched.price && singleBookUploadForm.errors.price ? singleBookUploadForm.errors.price : ""}

                >
                  <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                </TextInputGroup>
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-4">
                <SelectInput
                  name="bookCondition"
                  value={singleBookUploadForm.values.bookCondition}
                  onChange={singleBookUploadForm.handleChange}
                  menuItems={bookConditionOptions}
                  valueKey="bookConditionType"
                  textKey="bookConditionTypeName"
                  formgroupClassName="tw-mb-3"
                  labelText='Book Condition'
                />
              </div>
            </div>
          </div>
          <div className="tw-flex tw-justify-end tw-gap-3">
            <Button type="button" variant="secondary" onClick={props.toggle}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="tw-px-2 tw-py-1"
              disabled={showApiLoader}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BookCollectionUploadModel;
