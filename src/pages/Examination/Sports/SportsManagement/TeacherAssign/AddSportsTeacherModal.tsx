import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import { AutoSearchInputUpdated, MultiSelect, MultiSelectCheckbox, SelectInput } from "../../../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { editSportsTeacherAct, getSportsNamesAct, saveSportsTeacherAct } from "../../../../../store/examination/examinationSports/examinationSportsActions";
import { getTeacherList } from "../../../../../store/academic/classroomManagment/classroommanagmentactions";
import { useEffect, useState } from "react";
import { renderOptionsEmployee, renderValueStaff } from "./helper";
import { itemsEqual } from "@dnd-kit/sortable/dist/utilities";

const initialValues = {
  id:"",
  academicYearId: "",
  sportsId: "",
  teacherId: "",
  teacherIds: [],
  teacherName: "",
  teacherCode: "",
  removedItems:[] as any[]
};

const validationSchema = (editItemId: boolean) =>
  Yup.object().shape({
    academicYearId: Yup.string().required("Academic Year is required"),
    sportsId: Yup.string().required("Sports is required"),
    teacherIds: Yup.array().when([], {
      is: () => !editItemId, 
      then: (schema) => schema.min(1, "At least one teacher is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });
const AddSportsTeacherModal = ({ toggle, isOpen,editItemId }) => {
  const dispatch = useAppDispatch();
  const [selectedTeachers, setSelectedTeachers] = useState<any>([]);

  const mapSportsFormik = useFormik({
    initialValues,
    validationSchema: validationSchema(!!editItemId),
    onSubmit: (values) => {
      const { academicYearId, sportsId, teacherIds,removedItems } = values;

      if(editItemId){
        const activeTeachersPayload = teacherIds.map((item:any) => ({
          id:item.assignId || null,
          teacherId: item.id || item.teacherId,
           sportsId: sportsId,
          academicYearId: academicYearId,
          isDeleted: item.isDeleted ?? false,
        }));

         const finalPayload = [...activeTeachersPayload, ...removedItems];

        dispatch(
          editSportsTeacherAct(
            generateActionPayload(
              "edit_sports_teacher_item",
              undefined,
              finalPayload
            )
          )
        );
      }
      else {
        const teacherPayloadIds = teacherIds.map((item:any) => item.id);
        const payload = {
          sportsId: sportsId,
          academicYearId: academicYearId,
          teacherIds:teacherPayloadIds
        };
  
        dispatch(
          saveSportsTeacherAct(
            generateActionPayload(
              "save_sports_teacher_item",
              undefined,
              payload
            )
          )
        );
      }

    },
  });

  const {
    showApiLoader,
    currentBranchIdResp: branchId,
    academicYearListResp,
    getSportsNamesResp,
    teacherListResp,
    employeeStatusResp,
    employeeCategoriesResp,
    saveSportsTeacherResp,
    getSportsTeacherListResp
  } = useAppSelector(
    ({ globalData, appData, instAcademics, examinationSports, classroomManagmentInfo, masterData }) => ({
      showApiLoader: globalData.showApiLoader,
      currentBranchIdResp: appData.currentBranchIdResp,
      academicYearListResp: instAcademics.academicYearListResp,
      getSportsNamesResp: examinationSports.getSportsNamesResp,
      teacherListResp: classroomManagmentInfo.teacherListResp,
      employeeStatusResp: masterData.employeeStatusResp,
      employeeCategoriesResp: masterData.employeeCategoriesResp,
      saveSportsTeacherResp: examinationSports.saveSportsTeacherResp,
      getSportsTeacherListResp: examinationSports.getSportsTeacherListResp,
    }),
    shallowEqual
  );

  function fetchExaminationSportsNames(otherProps?: any) {
    const payload = { branchId, pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getSportsNamesAct(generateActionPayload("get_sports_names", undefined, payload)));
  }

  function getTeachers(otherProps?: any) {
    const statusID = employeeStatusResp?.find((status: any) => status.empStatusName.toLowerCase() === 'active')?.id;
    // const categoryID = employeeCategoriesResp?.find((category: any) => category.categoryName.toLowerCase() === 'teachers')?.employeeCategoryId;

    const academicYearId = otherProps?.academicYearId || mapSportsFormik.values.academicYearId;

    if (academicYearId && branchId) {
      const params = {
        branchId,
        pageNo: 0,
        pageSize: 2000,
        status: statusID,
        employeeCategoryId: 1,
        // searchString: searchString,
        masterAcademicYearId: academicYearId,
        ...otherProps
      };
      dispatch(getTeacherList(generateActionPayload("get_employees", undefined, params)));
    }
  }

  const selectedTeacherHandler = (selectedItem: any) => {
    if (selectedItem) {
      mapSportsFormik.setFieldValue("teacherId", selectedItem.id);
      mapSportsFormik.setFieldValue("teacherName", selectedItem.employeeName);
      mapSportsFormik.setFieldValue("teacherCode", selectedItem.employeeCode);
    } else {
      mapSportsFormik.setFieldValue("teacherId", "");
      mapSportsFormik.setFieldValue("teacherName", "");
      mapSportsFormik.setFieldValue("teacherCode", "");
    }
  };

  function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === "academicYearId") {
      mapSportsFormik.setValues((prev) => ({
        ...prev,
        [name]: value,
        sportsId: "",
        teacherIds: [],
      }));

      if (value) {
        fetchExaminationSportsNames({ academicYearId: value });
        // getTeachers({ academicYearId: value });
      }
    } else if (name === "sportsId") {
      mapSportsFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        teacherIds: [],
      }));
      if (value) {
         getTeachers({ academicYearId: mapSportsFormik.values.academicYearId });
      }
    }
    
    else {
      mapSportsFormik.setFieldValue(name, value);
    }
  }

  useEffect(() => {
  if (isOpen) {
    const yearId = academicYearListResp?.data.find(
      (year: any) => year.yearStatus.toLowerCase() === "current"
    )?.academicYearId;

    if (yearId) {
      mapSportsFormik.setFieldValue("academicYearId", yearId);

      fetchExaminationSportsNames({ academicYearId: yearId });
      // getTeachers({ academicYearId: yearId });
    }
  } else {
    mapSportsFormik.resetForm();
  }
}, [academicYearListResp, isOpen]);

useEffect(() => {
  if (Array.isArray(teacherListResp)) {
    setSelectedTeachers(teacherListResp);
  }
}, [teacherListResp]);

  const {
    data: sportsTeacherList
  } = getSportsTeacherListResp || {};


  useEffect(() => {
    if(editItemId && sportsTeacherList && sportsTeacherList.length > 0){
      const selectedTeacherData = sportsTeacherList.find((item) => +item?.sportsId === +editItemId)
        const {
          academicYearId,
          sportsId,
          teachersDtoList
        } = selectedTeacherData || {};

        const modifiedTeachersDtoList = teachersDtoList?.map((teacher: any) => ({...teacher, employeeCode : teacher.teacherCode, employeeName: teacher.teacherName, id: teacher.teacherId}));

        mapSportsFormik.setFieldValue("academicYearId",academicYearId)
        mapSportsFormik.setFieldValue("sportsId",sportsId)
        mapSportsFormik.setFieldValue("teacherIds",modifiedTeachersDtoList)

        if (academicYearId) {
          getTeachers({academicYearId:academicYearId});
        }
    }

  },[editItemId,sportsTeacherList])

  const selectedTeacher = mapSportsFormik.values.teacherId ? {
    id: mapSportsFormik.values.teacherId,
    employeeName: mapSportsFormik.values.teacherName,
    employeeCode: mapSportsFormik.values.teacherCode,
  } : undefined;

    function selectTeacherHndlr(selectedOptions: any, config?: any) {
      const { name, actionItem, actionType } = config;

      if (actionType === "remove" && actionItem.assignId) {
        const removedItem:any = {
          id: actionItem.assignId,
          teacherId: actionItem.teacherId || actionItem.id,
          sportsId: mapSportsFormik.values.sportsId,
          academicYearId: mapSportsFormik.values.academicYearId,
          isDeleted: true,
        };

        const currentRemovedItems:any = mapSportsFormik.values.removedItems || [];

        mapSportsFormik.setValues({
          ...mapSportsFormik.values,
          teacherIds: selectedOptions || [],
          removedItems: [...currentRemovedItems, removedItem], 
        });
        return;
      }

      if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
        mapSportsFormik.setFieldValue(name, selectedOptions);
      } else {
        mapSportsFormik.setFieldValue(name, []);
      }
    }

  return (
    <FormikProvider value={mapSportsFormik}>
      <form onSubmit={mapSportsFormik.handleSubmit}>
        <div style={{ padding: "1.25rem" }}>
          <div className="row gx-3">
            <div className="col-12 col-lg-6">
              <SelectInput
                name="academicYearId"
                value={mapSportsFormik.values.academicYearId}
                onChange={filterHandler}
                onBlur={mapSportsFormik.handleBlur}
                menuItems={academicYearListResp?.data}
                valueKey="academicYearId"
                textKey="academicYearName"
                labelText="Academic Year"
                labelClass="required"
                invalid={!!(mapSportsFormik.touched.academicYearId && mapSportsFormik.errors.academicYearId)}
                error={mapSportsFormik.touched.academicYearId ? mapSportsFormik.errors.academicYearId : ""}
                isDisabled={editItemId}
              />
            </div>

            <div className="col-12 col-lg-6">
              <SelectInput
                name="sportsId"
                value={mapSportsFormik.values.sportsId}
                onChange={filterHandler}
                onBlur={mapSportsFormik.handleBlur}
                menuItems={getSportsNamesResp?.data || []}
                valueKey="id"
                textKey="sportName"
                labelText="Sports"
                labelClass="required"
                invalid={!!(mapSportsFormik.touched.sportsId && mapSportsFormik.errors.sportsId)}
                error={mapSportsFormik.touched.sportsId ? mapSportsFormik.errors.sportsId : ""}
                isDisabled={editItemId}
              />
            </div>

            <div className="col-12">
              {/* <AutoSearchInputUpdated
                formgroupClassName="search-box"
                name="teacherId"
                selected={selectedTeacher}
                placeHolder="Search Employee..."
                onChange={getTeachers}
                valueKey={"id"}
                labelKey="employeeCode"
                subLabelKey="employeeName"
                labelHeader="Teacher Code"
                subLabelHeader="Teacher Name"
                labelText="Teachers"
                labelClass="required"
                options={teacherListResp}
                selectedOptionCallbck={selectedTeacherHandler}
                invalid={!!(mapSportsFormik.touched.teacherId && mapSportsFormik.errors.teacherId)}
                error={mapSportsFormik.touched.teacherId ? mapSportsFormik.errors.teacherId : ""}
              >
                <i className="ri-search-line search-icon"></i>
              </AutoSearchInputUpdated> */}

              <MultiSelectCheckbox
                name = "teacherIds"
                idKey="id"
                labelText="Teachers"
                labelClass="required"
                value={mapSportsFormik.values.teacherIds}
                renderValue={renderValueStaff}
                renderOptions={renderOptionsEmployee}
                onChange={selectTeacherHndlr}
                searchKey="employeeName"
                containerClassName="mb-3"
                // onSearchHandler={() => {}}
                options={selectedTeachers}
                invalid={!!(mapSportsFormik.touched.teacherIds && mapSportsFormik.errors.teacherIds)}
                error={mapSportsFormik.touched.teacherIds ? mapSportsFormik.errors.teacherIds : ""}
              ></MultiSelectCheckbox>
            </div>
          </div>

          <div className="row mt-4">
            <div className="d-flex ms-auto w-auto">
              <button type="button" className="btn btn-light me-3" onClick={toggle}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success" disabled={showApiLoader}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </FormikProvider>
  );
};

export default AddSportsTeacherModal;
