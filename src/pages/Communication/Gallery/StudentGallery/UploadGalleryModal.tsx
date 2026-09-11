import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import {
  BrowseFile,
  DateInput,
  FileUpload,
  InputCheckbox,
  ModalContainerUpdated,
  MultipleFileUpload,
  MultiSelectCheckbox,
  RadioInputContainer,
  SelectInput,
  SingleFileUploadInput,
  TextArea,
  TextInput,
  TextInputGroup,
  UploadFileInput,
} from "../../../../Components/Common";
import {
  userTypeOptions,
  galleryCategory,
  statusOptionsStaff,
  renderValueStaff,
  renderOptionsEmployee,
  statusOptionsParent,
  renderValueStudent,
  renderOptionsStudent,
  studentTypeOptions,
  Student,
  Employee,
} from "./helper";
import React, { useEffect, useRef, useState } from "react";
interface LocationData {
  address: string;
  lat: number;
  long: number;
}
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getStudentByFilterAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getEmployeeByFilterAct } from "../../../../store/directory/employeemanagement/employeemanagementactions";
import { getCurriculumClassSectAct, getGalleryCategoriesAct, saveGalleryManagementItemAct, updateGalleryManagementItemAct } from "../../../../store/communication/communicationactions";
import TreeComponent from "../../ManageAllNotifcations/TreeComponent";
import { CurriculumSelectorProvider } from "../../ManageAllNotifcations/helper";
import { convertFullTime } from "../../../../utility/dateutility";
import Button from "../../../../Components/Common/Button";
import { useModal } from "../../../../hooks/modalhook";
import LocationSelectorModal from "./LocationSelectorModal";
import { getLocalStorage } from "../../../../utility/storageUtility";

const initialValues: any = {
  academicYearId: "",
  galleryTitle: "",
  description: "",
  category: "",
  eventDate: "",
  tags: "",
  location: "",
  latitude: "",
  longitude: "",
  document: [],
  urlList: [
    {
      urlLink: "",
      uniqueId: generateUniqueNumber(),
    },
  ],
  recipientType: "",
  studentType: "",
  employeeIds: [],
  studentIds: [],
  employeeCategory: [],
  parentCategory: [],
  galleryRecipientId: "",
};

const validationSchema = Yup.object({
  // academicYearId: Yup.string().required("Academic Year is required"),

  galleryTitle: Yup.string().required("Gallery Title is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Gallery Category is required"),
  tags: Yup.string().required("Tag is required"),
  location: Yup.string().required("Location is required"),

  // uploadType: Yup.string()
  //   .required("Upload Type is required")
  //   .oneOf(["url", "direct"], "Invalid Upload Type"),

  // urlList: Yup.array().of(
  //   Yup.object().shape({
  //     urlLink: Yup.string().required("URL Link is required"),
  //   })
  // ),
  // uploadImgList: Yup.array().of(
  //   Yup.object().shape({
  //     uploadedImg: Yup.string().required("Image is required"),
  //   })
  // ),
});

const UploadGalleryModal = (props: any) => {
  const formikUploadImgArrayHelpers = useRef<ArrayHelpers | null>(null);
  const formikUrlListHelpers = useRef<ArrayHelpers | null>(null);
  const [curriculumState, setCurriculumState] = useState<any>([]);
  const [contactInfoStaff, setContactInfoStaff] = useState(statusOptionsStaff);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [document, setDocument] = useState<any>([]);
  const { modalState: mapModalState, closeModal: closeMapModalHndlr, openModal: openMapModalHndlr } = useModal();
  const selectedLocation = useRef<LocationData | null>(null);
  

  const dispatch = useAppDispatch();

  const {
    showApiLoader,
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    academicYearListResp,
    getEmployeesByFilterResp,
    getStudentsByFilterResp,
    curriculumClassSectResp,
    getGalleryManagementListResp,
    getGalleryCategoriesResp
  } = useAppSelector(
    ({
      globalData,
      appData,
      instAcademics,
      directoryEmployee,
      directoryStudent,
      communication,
    }) => ({
      showApiLoader: globalData.showApiLoader,
      currentBranchIdResp: appData.currentBranchIdResp,
      academicYearListResp: instAcademics.academicYearListResp,
      currentInstIdResp: appData.currentInstIdResp,
      getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
      getStudentsByFilterResp: directoryStudent.getStudentsByFilterResp,
      getGalleryManagementListResp: communication.getGalleryManagementListResp,
      curriculumClassSectResp: communication.curriculumClassSectResp,
      getGalleryCategoriesResp: communication.getGalleryCategoriesResp
    }),
    shallowEqual
  );

  const uploadImageGalleryFormik = useFormik({
    initialValues,
    // validationSchema: validationSchema,
    onSubmit: (values: any) => {
      const payload: any = {
        branchId,
        academicYearId: values.academicYearId,
        url: values.urlList.map((url: any) => url.urlLink),
        location: values.location,
        latitude: values.latitude,
        longitude: values.longitude,
        title: values.galleryTitle,
        tags: values.tags,
        recipientsTypes: values.recipientType,
        categoryId: values.category,
        description: values.description,
        eventDate: convertFullTime(values.eventDate),
      }  
      if(props.id){
        payload.galleryRecipientId = values.galleryRecipientId
      }    

      let formData = new FormData()
      formData.append("request", JSON.stringify(payload));

      if (values.document.length > 0) {
        document.map((file: any) => {
          formData.append("files", file);
        })
      }
      if(props.id){
        dispatch(updateGalleryManagementItemAct(generateActionPayload("update_gallery_managament_item", {galleryId: props?.id}, formData)));
      }
      else{        
        dispatch(saveGalleryManagementItemAct(generateActionPayload("save_gallery_managament_item", undefined, formData)));
      }

                
    },
  });

  useEffect(() => {
    dispatch(
          getGalleryCategoriesAct(
            generateActionPayload("get_gallery_category", undefined, undefined)
          )
        );
  },[])

  const handleFileChange = (files: any) => {
    setDocument(files);
    uploadImageGalleryFormik.setFieldValue("document", files);
  };

  function addNewUrlListItem(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (formikUrlListHelpers.current) {
      formikUrlListHelpers.current.push({
        urlLink: "",
        uniqueId: generateUniqueNumber(),
      });
    }
  }

  function removeUrlListItem(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikUrlListHelpers.current?.remove(Number(rowIndex));
    }
  }


  useEffect(() => {
    const { data } = curriculumClassSectResp || {};
    if (Array.isArray(data)) {
      const updateData = data.map((item) => ({
        ...item,
        isSelected: false, // Add isSelected
        classes: item.classes.map((cls: any) => ({
          ...cls,
          isSelected: false, // Add isSelected for classes
          sections: cls.sections.map((section: any) => ({
            ...section,
            isSelected: false, // Add isSelected for sections
          })),
        })),
      }));
      setCurriculumState(updateData);
    }
  }, [curriculumClassSectResp]);

  const onChangeFilterHndlr = (event: any) => {
    const { name, value } = event.target;
    if (name === "recipientType") {
      if (value === "PARENT") {
        uploadImageGalleryFormik.setValues((prev: any) => ({
          ...prev,
          [name]: value,
          employeeCategory: [],
          parentCategory: ["father", "mother"],
          studentType: "all-student",
        }));
      } else if (value === "STAFF") {
        uploadImageGalleryFormik.setValues((prev: any) => ({
          ...prev,
          [name]: value,
          employeeCategory: ["admin", "nonTeaching"],
          parentCategory: [],
          studentType: "",
        }));
      } else {
        uploadImageGalleryFormik.setValues((prev: any) => ({
          ...prev,
          [name]: value,
          employeeCategory: [],
          parentCategory: [],
          studentType: "",
        }));
      }
    } else {
      uploadImageGalleryFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  function onSelectStaffHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked, name } = event.target;
    const { employeeCategory } = uploadImageGalleryFormik.values;
    if (checked) {
      employeeCategory.push(name);
      uploadImageGalleryFormik.setFieldValue(
        "employeeCategory",
        employeeCategory
      );
    } else {
      uploadImageGalleryFormik.setFieldValue(
        "employeeCategory",
        employeeCategory.filter((item: any) => item !== name)
      );
    }
  }

  function selectStudentHndlr(selectedOptions: any, config?: any) {
    const { name } = config;
    if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
      uploadImageGalleryFormik.setValues((prevState: any) => ({
        ...prevState,
        [name]: selectedOptions,
      }));
    } else {
      uploadImageGalleryFormik.setValues((prevState: any) => ({
        ...prevState,
        [name]: null,
      }));
    }
  }

  function onSearchMultiSelectHandler(name: any, value: any) {
    if (value) {
      const { academicYearId } =
        academicYearListResp?.data.find(
          (year: any) => year?.yearStatus?.toLowerCase() === "current"
        ) || {};
      dispatch(
        getStudentByFilterAct(
          generateActionPayload("get_students_by_name", undefined, {
            instituteId,
            branchId: branchId,
            academicYearId: academicYearId,
            studentName: value,
            pageNo: 0,
            pageSize: 50,
          })
        )
      );
    }
  }

  function onSelectParentHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked, name } = event.target;
    const { parentCategory } = uploadImageGalleryFormik.values;
    if (checked) {
      parentCategory.push(name);
      uploadImageGalleryFormik.setFieldValue("parentCategory", parentCategory);
    } else {
      uploadImageGalleryFormik.setFieldValue(
        "parentCategory",
        parentCategory.filter((item: any) => item !== name)
      );
    }
  }

  function onSearchMultiSelectHandleremployee(name: any, value: string) {
    if (value) {
      const params = { searchString: value };
      dispatch(
        getEmployeeByFilterAct(
          generateActionPayload("get_employee_by_name", params, {
            instituteGroupId: 1,
          })
        )
      );
    }
  }
  function selecteAllHndlr() {
    setIsAllSelected((prevState) => !prevState);
    if (isAllSelected) {
      const updateData = curriculumState.map((item: any) => ({
        ...item,
        isSelected: false, // Add isSelected
        classes: item.classes.map((cls: any) => ({
          ...cls,
          isSelected: false, // Add isSelected for classes
          sections: cls.sections.map((section: any) => ({
            ...section,
            isSelected: false, // Add isSelected for sections
          })),
        })),
      }));
      setCurriculumState(updateData);
    } else {
      const updateData = curriculumState.map((item: any) => ({
        ...item,
        isSelected: true, // Add isSelected
        classes: item.classes.map((cls: any) => ({
          ...cls,
          isSelected: true, // Add isSelected for classes
          sections: cls.sections.map((section: any) => ({
            ...section,
            isSelected: true, // Add isSelected for sections
          })),
        })),
      }));
      setCurriculumState(updateData);
    }
  }

  function selectTreeRowHndlr(selectedInfo: any) {
    const { rowType, curriculumId, sectionId, classId, checked } = selectedInfo;
    if (!rowType) return;
    const updatedCurriculumData = [...curriculumState];
    if (rowType === "CURRICULUM") {
      const curriculumRowIndex = curriculumState.findIndex(
        (item: any) =>
          item.curriculumId?.toString() === curriculumId?.toString()
      );
      if (curriculumRowIndex > -1) {
        const rowInfo = curriculumState[curriculumRowIndex];
        const updateRowInfo = { ...rowInfo };
        updateRowInfo.isSelected = checked;
        const classesUpdate = updateRowInfo.classes.map((cls: any) => ({
          ...cls,
          isSelected: checked, // Add isSelected for classes
          sections: cls.sections.map((section: any) => ({
            ...section,
            isSelected: checked, // Add isSelected for sections
          })),
        }));
        updateRowInfo.classes = classesUpdate;
        updatedCurriculumData.splice(curriculumRowIndex, 1, updateRowInfo);
      }
    } else if (rowType === "CLASS") {
      const curriculumRowIndex = curriculumState.findIndex(
        (item: any) =>
          item.curriculumId?.toString() === curriculumId?.toString()
      );
      if (curriculumRowIndex > -1) {
        const curriuculumRowInfo = curriculumState[curriculumRowIndex];
        const updatedCurriculumRowInfo = { ...curriuculumRowInfo };
        const curriculumClasses = [...updatedCurriculumRowInfo.classes];
        const classRowIndex = curriculumClasses.findIndex(
          (item: any) => item.classId?.toString() === classId?.toString()
        );
        if (classRowIndex > -1) {
          const classRowInfo = curriculumClasses[classRowIndex];
          const updateClassRowInfo = { ...classRowInfo };
          updateClassRowInfo.isSelected = checked;
          const sectionUpdate = updateClassRowInfo.sections.map(
            (sections: any) => ({
              ...sections,
              isSelected: checked,
            })
          );
          updateClassRowInfo.sections = sectionUpdate;
          curriculumClasses.splice(classRowIndex, 1, updateClassRowInfo);
          updatedCurriculumRowInfo.isSelected = curriculumClasses.every(
            (item: any) => item.isSelected
          );
          updatedCurriculumRowInfo.classes = curriculumClasses;
          updatedCurriculumData.splice(
            curriculumRowIndex,
            1,
            updatedCurriculumRowInfo
          );
        }
      }
    } else {
      const curriculumRowIndex = curriculumState.findIndex(
        (item: any) =>
          item.curriculumId?.toString() === curriculumId?.toString()
      );
      if (curriculumRowIndex > -1) {
        const curriuculumRowInfo = curriculumState[curriculumRowIndex];
        const updatedCurriculumRowInfo = { ...curriuculumRowInfo };
        const curriculumClasses = [...updatedCurriculumRowInfo.classes];
        const classRowIndex = curriculumClasses.findIndex(
          (item: any) => item.classId?.toString() === classId?.toString()
        );
        if (classRowIndex > -1) {
          const classRowInfo = curriculumClasses[classRowIndex];
          const updateClassRowInfo = { ...classRowInfo };
          const sectionUpdate = updateClassRowInfo.sections.map(
            (sections: any) => {
              if (sections?.sectionId?.toString() === sectionId?.toString()) {
                return { ...sections, isSelected: checked };
              }
              return { ...sections };
            }
          );
          updateClassRowInfo.isSelected = sectionUpdate.every(
            (item: any) => item.isSelected
          );
          updateClassRowInfo.sections = sectionUpdate;
          curriculumClasses.splice(classRowIndex, 1, updateClassRowInfo);
          updatedCurriculumRowInfo.isSelected = curriculumClasses.every(
            (item: any) => item.isSelected
          );
          updatedCurriculumRowInfo.classes = curriculumClasses;
          updatedCurriculumData.splice(
            curriculumRowIndex,
            1,
            updatedCurriculumRowInfo
          );
        }
      }
    }
    setIsAllSelected(
      updatedCurriculumData?.every((item: any) => item.isSelected)
    );
    setCurriculumState(updatedCurriculumData);
  }

  useEffect(() => {
    const yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;

    uploadImageGalleryFormik.setFieldValue("academicYearId", yearId);
  }, [academicYearListResp]);

  useEffect(() => {
    if (props.id && getGalleryManagementListResp) {
      const data = getGalleryManagementListResp?.data?.find((item: any) => +item.id === +props.id);

      const uploadFiles = data?.galleryFilesDto?.filter((i: any) => i.type === "UPLOAD");
      const urlFiles = data?.galleryFilesDto?.filter((i: any) => i.type === "URL");

      const files = uploadFiles?.map((i: any) => ({ ...i, name: i?.systemFileName }));
      setDocument(files);
      uploadImageGalleryFormik.setFieldValue("document", files);

      const urlList = urlFiles?.length > 0
        ? urlFiles.map((i: any) => ({
          urlLink: i.url,
          uniqueId: generateUniqueNumber(),
        }))
        : [{ urlLink: "", uniqueId: generateUniqueNumber() }];

      uploadImageGalleryFormik.setFieldValue("academicYearId", data?.academicYearId);
      uploadImageGalleryFormik.setFieldValue("galleryTitle", data?.title);
      uploadImageGalleryFormik.setFieldValue("description", data?.description);
      uploadImageGalleryFormik.setFieldValue("eventDate", data?.eventDate);
      uploadImageGalleryFormik.setFieldValue("category", data?.categoryId);
      uploadImageGalleryFormik.setFieldValue("tags", data?.tags);
      uploadImageGalleryFormik.setFieldValue("location", data?.location);
      uploadImageGalleryFormik.setFieldValue("longitude", data?.longitude);
      uploadImageGalleryFormik.setFieldValue("latitude", data?.latitude);
      uploadImageGalleryFormik.setFieldValue("urlList", urlList); 
      uploadImageGalleryFormik.setFieldValue("galleryRecipientId", data?.galleryRecipientId); 
      uploadImageGalleryFormik.setFieldValue("recipientType", data?.recipientsTypes); 
    }
  }, [getGalleryManagementListResp, props.id]);

  const toggleMapModal = (address?: string, lat?: number, long?: number) => {
    if (getLocalStorage("accesstoken") && address && lat && long) {
      selectedLocation.current = {
        address, lat, long
      }
      uploadImageGalleryFormik.setFieldValue('location', address);
      uploadImageGalleryFormik.setFieldValue('longitude', long);
      uploadImageGalleryFormik.setFieldValue('latitude', lat);
    }
    closeMapModalHndlr();
  }
    
  const { employeeCategory, parentCategory, studentType } =
    uploadImageGalleryFormik.values;

  useEffect(() => {
    if (branchId && instituteId) {
      dispatch(
        getCurriculumClassSectAct(
          generateActionPayload("get_curriculum_class_section", undefined, {
            branchId,
          })
        )
      );
    }
  }, [branchId, instituteId]);

  return (
    <>
      <form onSubmit={uploadImageGalleryFormik.handleSubmit}>
        <div style={{ padding: "1.25rem" }}>
          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-12 md:tw-col-span-7">
              <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                <div className="tw-col-span-12">
                  <TextInput
                    name="galleryTitle"
                    value={uploadImageGalleryFormik.values.galleryTitle}
                    onChange={uploadImageGalleryFormik.handleChange}
                    inputClassName="tw-bg-gray-100"
                    labelText="Title"
                    placeHolder="Title"
                    labelClass="required"
                    invalid={
                      uploadImageGalleryFormik.touched.galleryTitle &&
                      uploadImageGalleryFormik.errors.galleryTitle
                        ? true
                        : false
                    }
                    error={
                      uploadImageGalleryFormik.touched.galleryTitle &&
                      uploadImageGalleryFormik.errors.galleryTitle
                        ? uploadImageGalleryFormik.errors.galleryTitle
                        : ""
                    }
                  />
                </div>

                <div className="tw-col-span-12">
                  <TextArea
                    name="description"
                    value={uploadImageGalleryFormik.values.description}
                    onChange={uploadImageGalleryFormik.handleChange}
                    labelText="Description"
                    invalid={
                      uploadImageGalleryFormik.touched.description &&
                      uploadImageGalleryFormik.errors.description
                        ? true
                        : false
                    }
                    error={
                      uploadImageGalleryFormik.touched.description &&
                      uploadImageGalleryFormik.errors.description
                        ? uploadImageGalleryFormik.errors.description
                        : ""
                    }
                  />
                </div>

                {/* <div className="tw-col-span-12 lg:tw-col-span-6">
                  <TextInput
                    name="canonicalTitle"
                    value={uploadImageGalleryFormik.values.canonicalTitle}
                    onChange={uploadImageGalleryFormik.handleChange}
                    labelText="Canonical Title"
                  />
                </div> */}

                <div className="tw-col-span-12 lg:tw-col-span-6">
                  <DateInput
                    name="eventDate"
                    inputType='datetime-local'
                    value={uploadImageGalleryFormik.values.eventDate}
                    onChange={uploadImageGalleryFormik.handleChange}
                    formgroupClassName="tw-mb-0"
                    labelText="Event Date"
                  />
                </div>

                <div className="tw-col-span-12 lg:tw-col-span-6">
                  <SelectInput
                    name="category"
                    value={uploadImageGalleryFormik.values.category}
                    onChange={uploadImageGalleryFormik.handleChange}
                    menuItems={getGalleryCategoriesResp}
                    valueKey="id"
                    textKey="categoryName"
                    labelText="Gallery Category"
                    labelClass="required"
                    defaultSelect="Select"
                    invalid={
                      uploadImageGalleryFormik.touched.category &&
                      uploadImageGalleryFormik.errors.category
                        ? true
                        : false
                    }
                    error={
                      uploadImageGalleryFormik.touched.category &&
                      uploadImageGalleryFormik.errors.category
                        ? uploadImageGalleryFormik.errors.category
                        : ""
                    }
                  />
                  </div>
                  <div className="tw-col-span-12 lg:tw-col-span-6">

                  <TextInput
                    name="tags"
                    value={uploadImageGalleryFormik.values.tags}
                    onChange={uploadImageGalleryFormik.handleChange}
                    inputClassName="tw-bg-gray-100"
                    labelText="Tags"
                    placeHolder="Enter tags here"
                    labelClass="required"
                    invalid={
                      uploadImageGalleryFormik.touched.tags &&
                      uploadImageGalleryFormik.errors.tags
                        ? true
                        : false
                    }
                    error={
                      uploadImageGalleryFormik.touched.tags &&
                      uploadImageGalleryFormik.errors.tags
                        ? uploadImageGalleryFormik.errors.tags
                        : ""
                    }
                  />
                </div>

                <div className="tw-col-span-12">
                  <TextInputGroup
                    name="location"
                    labelText="Location"
                    inputgroupClassName="tw-flex tw-items-center tw-gap-2"
                    inputClassName="tw-bg-white"
                    formgroupClassName="tw-mb-3"
                    value={uploadImageGalleryFormik.values.location}
                    onChange={uploadImageGalleryFormik.handleChange}
                    invalid={
                      uploadImageGalleryFormik.touched.location &&
                      uploadImageGalleryFormik.errors.location
                        ? true
                        : false
                    }
                    error={
                      uploadImageGalleryFormik.touched.location &&
                      uploadImageGalleryFormik.errors.location
                        ? uploadImageGalleryFormik.errors.location
                        : ""
                    }
                  >
                    <i onClick={openMapModalHndlr} className="tw-text-xl ri-map-pin-fill tw-text-emerald-600 tw-cursor-pointer" />
                  </TextInputGroup>
                </div>

                <div className="tw-col-span-12 tw-mb-3">
                  <div className="tw-mb-2">
                    <p className="tw-mb-0">Attached files</p>
                  </div>
                  <MultipleFileUpload
                    name="document"
                    labelText="Upload Images"
                    prevFiles={document}
                    onChange={handleFileChange}
                    containerClass="tw-col-span-12"
                    maxSizeInMb={2}
                    helperText="Note : Max File Size is 2MB"
                  />
                </div>

                <div className="tw-col-span-12">
                  <div className="tw-grid tw-grid-cols-12">
                    <div className="tw-col-span-12 tw-flex tw-items-center tw-gap-2 tw-mb-2">
                      <h6 className="tw-mb-0">Add URL</h6>
                      <Button
                        variant="soft"
                        onClick={addNewUrlListItem}
                        className="!tw-w-5 !tw-h-7 !tw-flex !tw-items-center !tw-justify-center"
                      >
                        <i className="ri-add-line tw-text-lg" />
                      </Button>
                    </div>

                    <div className="tw-col-span-12 tw-border tw-rounded tw-p-3 tw-pb-0">
                      <FormikProvider value={uploadImageGalleryFormik}>
                        <FieldArray name="urlList">
                          {(arrayHelpers: ArrayHelpers) => {
                            if (!formikUrlListHelpers.current) {
                              formikUrlListHelpers.current = arrayHelpers;
                            }

                            return (
                              <>
                                {uploadImageGalleryFormik.values.urlList.length > 0 &&
                                  uploadImageGalleryFormik.values.urlList.map(
                                    (urlItem: any, index: number) => (
                                      <div
                                        key={index}
                                        className="tw-grid tw-grid-cols-12 tw-gap-2 tw-mb-3 tw-items-center"
                                      >
                                        <div className="tw-col-span-11">
                                          <TextInput
                                            name={`urlList[${index}].urlLink`}
                                            value={urlItem.urlLink}
                                            onChange={uploadImageGalleryFormik.handleChange}
                                            inputClassName="tw-bg-gray-100"
                                            placeHolder="URL"
                                            formgroupClassName="tw-mb-0"
                                          />
                                        </div>
                                        <div className="tw-col-span-1 tw-flex tw-items-center tw-justify-center">
                                          {index !== 0 && (
                                            <Button
                                              type="button"
                                              data-index={index}
                                              onClick={removeUrlListItem}
                                              variant="wrong"
                                            >
                                              <i
                                                className="ri-delete-bin-5-fill tw-text-red-500"
                                                style={{ fontSize: "16px" }}
                                              />
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    )
                                  )}
                              </>
                            );
                          }}
                        </FieldArray>
                      </FormikProvider>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-col-span-12 md:tw-col-span-5 tw-border-l tw-pl-4">
              <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                <div className="tw-col-span-12">
                  <SelectInput
                    name="recipientType"
                    value={uploadImageGalleryFormik.values.recipientType}
                    onChange={onChangeFilterHndlr}
                    menuItems={userTypeOptions}
                    valueKey="id"
                    textKey="name"
                    labelText="User Type"
                    labelClass="required"
                    defaultSelect="Select"
                    invalid={
                      uploadImageGalleryFormik.touched.recipientType &&
                        uploadImageGalleryFormik.errors.recipientType ? true : false
                    }
                    error={
                      uploadImageGalleryFormik.touched.recipientType &&
                        uploadImageGalleryFormik.errors.recipientType
                        ? uploadImageGalleryFormik.errors.recipientType : ""
                    }
                  />
                </div>

                {uploadImageGalleryFormik.values.recipientType === "STAFF" && (
                  <>
                    <div className="tw-col-span-12">
                      <h4 className="tw-font-semibold tw-my-2">Staff</h4>
                      <div className="tw-flex tw-gap-4 tw-mb-3">
                        {contactInfoStaff.map((item: any) => (
                          <InputCheckbox
                            name={`${item.id}`}
                            key={item.id}
                            formgroupClassName="tw-mr-3"
                            labelName={item.name}
                            onChange={onSelectStaffHndlr}
                            value={
                              (Array.isArray(employeeCategory) &&
                                employeeCategory.includes(item.id)) || false
                            }
                            dataId={item.id}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="tw-col-span-12">
                      <MultiSelectCheckbox
                        name="employeeIds"
                        labelText="Employee"
                        containerClassName="tw-mb-3"
                        idKey="id"
                        value={uploadImageGalleryFormik.values.employeeIds}
                        renderValue={renderValueStaff}
                        renderOptions={renderOptionsEmployee}
                        onChange={selectStudentHndlr}
                        onSearchHandler={onSearchMultiSelectHandleremployee}
                        options={getEmployeesByFilterResp}
                      />
                    </div>
                  </>
                )}

                {uploadImageGalleryFormik.values.recipientType === "PARENT" && (
                  <>
                    <div className="tw-col-span-12">
                      <h4 className="tw-font-semibold tw-my-2">Parent</h4>
                      <div className="tw-flex tw-gap-4 tw-mb-3">
                        {statusOptionsParent.map((item: any) => (
                          <InputCheckbox
                            key={item.id}
                            formgroupClassName="tw-mr-3"
                            name={`${item.id}`}
                            labelName={item.name}
                            value={
                              (Array.isArray(parentCategory) &&
                                parentCategory.includes(item.id)) || false
                            }
                            onChange={onSelectParentHndlr}
                            dataId={item.id}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="tw-col-span-12">
                      <RadioInputContainer
                        name="studentType"
                        labelText="Student Type"
                        inputContainerClassName="tw-mt-1"
                        radioOptions={studentTypeOptions}
                        value={uploadImageGalleryFormik.values.studentType}
                        onChange={uploadImageGalleryFormik.handleChange}
                      />
                    </div>

                    {studentType === "all-student" && (
                      <div className="tw-col-span-12 tw-mb-3">
                        <CurriculumSelectorProvider.Provider value={{ selectTreeRowHndlr }}>
                          <TreeComponent
                            isAllSelected={isAllSelected}
                            selecteAllHndlr={selecteAllHndlr}
                            curriculumClass={curriculumState}
                          />
                        </CurriculumSelectorProvider.Provider>
                      </div>
                    )}

                    {studentType === "selected-student" && (
                      <div className="tw-col-span-12">
                        <MultiSelectCheckbox
                          name="studentIds"
                          labelText="Students"
                          containerClassName="tw-mb-3"
                          idKey="id"
                          value={uploadImageGalleryFormik.values.studentIds}
                          renderValue={renderValueStudent}
                          renderOptions={renderOptionsStudent}
                          onChange={selectStudentHndlr}
                          onSearchHandler={onSearchMultiSelectHandler}
                          options={getStudentsByFilterResp}
                        />
                      </div>
                    )}
                  </>
                )}

                {uploadImageGalleryFormik.values.recipientType === "ALL" && (
                  <div className="tw-col-span-12" />
                )}

              </div>
            </div>

            <div className="tw-col-span-12 tw-flex tw-justify-end tw-gap-3 tw-mt-6">
              <Button type="button" variant="secondary" onClick={props.toggle}>
                Close
              </Button>
              <Button type="submit" variant="primary">
                Save
              </Button>
            </div>
          </div>
        </div>
      </form>
      <ModalContainerUpdated
        id="map-modal"
        isOpen={mapModalState.showModal}
        toggle={toggleMapModal}
        modalTitle="Add Location"
        modalSize="lg"
      >
        <LocationSelectorModal
          isOpen={mapModalState.showModal}
          selectedLocation={selectedLocation.current}
          toggle={toggleMapModal}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default UploadGalleryModal;
