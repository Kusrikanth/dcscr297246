import { useFormik } from "formik";
import { useState } from "react";
import { FileUpload, SelectInput, TextInput, Button } from "../../Components/Common";
import BreadCrumb from "../../Components/Common/BreadCrumb";
//Component
//Images
//Helpers
const initialValues = {
  studentId: "",
  studentName: "",
  section: "",
  class: "",
  dateOfBirth: "",
  parentName: "",
  bloodGroup: "",
  emergencyContact: "",
};
const selectData1 = [
  {
    bloodType: "o+",
  },
  {
    bloodType: "b+",
  },
  {
    bloodType: "AB-",
  },
];
const StudentIdCard = () => {
  const [StudentIdCard, setStudentIdCard] = useState(initialValues);
  const StudentIdCardForm = useFormik({
    enableReinitialize: true,
    initialValues: StudentIdCard,
    onSubmit: (values) => {},
  });
  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb title="Id Card" />
        <div className="card">
          <div className="card-header">
            <div className="tw-flex tw-items-center">
              <div className="tw-grow">
                <h4 className="card-title tw-mb-0">Student ID Card</h4>
              </div>
              <div className="tw-shrink-0">
                <div className="tw-flex"></div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <form>
              <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                <div className="tw-col-span-12 md:tw-col-span-6">
                  <TextInput
                    name="studentId"
                    formgroupClassName="tw-mb-0"
                    labelText="Student Id"
                    value={StudentIdCardForm.values.studentId}
                    onChange={StudentIdCardForm.handleChange}
                  />
                </div>
                <div className="tw-col-span-12 md:tw-col-span-6">
                  <TextInput
                    name="studentName"
                    formgroupClassName="tw-mb-0"
                    labelText="Student Name"
                    value={StudentIdCardForm.values.studentName}
                    onChange={StudentIdCardForm.handleChange}
                  />
                </div>
                <div className="tw-col-span-12 md:tw-col-span-6">
                  <TextInput
                    name="class"
                    formgroupClassName="tw-mb-0"
                    labelText="Class"
                    value={StudentIdCardForm.values.class}
                    onChange={StudentIdCardForm.handleChange}
                  />
                </div>
                <div className="tw-col-span-12 md:tw-col-span-6">
                  <TextInput
                    name="dateOfBirth"
                    formgroupClassName="tw-mb-0"
                    labelText="DOB"
                    value={StudentIdCardForm.values.dateOfBirth}
                    onChange={StudentIdCardForm.handleChange}
                  />
                </div>
                <div className="tw-col-span-12 md:tw-col-span-6">
                  <TextInput
                    name="parentName"
                    formgroupClassName="tw-mb-0"
                    labelText="Parent Name"
                    value={StudentIdCardForm.values.parentName}
                    onChange={StudentIdCardForm.handleChange}
                  />
                </div>
                <div className="tw-col-span-12 md:tw-col-span-6">
                  <TextInput
                    name="section"
                    formgroupClassName="tw-mb-0"
                    labelText="section"
                    value={StudentIdCardForm.values.section}
                    onChange={StudentIdCardForm.handleChange}
                  />
                </div>
                <div className="tw-col-span-12 md:tw-col-span-6">
                  <SelectInput
                    name="bloodGroup"
                    labelText="Blood Group"
                    value={StudentIdCardForm.values.bloodGroup}
                    onChange={StudentIdCardForm.handleChange}
                    menuItems={selectData1}
                    valueKey="bloodType"
                    textKey="bloodType"
                    formgroupClassName="tw-mb-0"
                  />
                </div>
                <div className="tw-col-span-12 md:tw-col-span-6">
                  <TextInput
                    name="emergencyContact"
                    formgroupClassName="tw-mb-0"
                    labelText="Emergency Contact No"
                    value={StudentIdCardForm.values.emergencyContact}
                    onChange={StudentIdCardForm.handleChange}
                  />
                </div>
                <div className="tw-col-span-12">
                  <p className="tw-mb-4">
                    <span className="tw-text-red-500 tw-font-bold">
                      Note : Only Blood Group and Emergency Contact Numbers are
                      editable. For other details, corrections please contact
                      admission counselor
                    </span>
                  </p>
                </div>
                <div className="tw-col-span-12 md:tw-col-span-6">
                  <FileUpload
                    labelText="Student Photo"
                    name="Student Photo"
                    containerClassName="tw-mb-3"
                    showPreview={true}
                  />
                  <span className="tw-text-red-500 tw-font-bold">
                    *Preferably Digital Photograph of 50KB Size
                  </span>
                </div>
                <div className="tw-col-span-12 tw-flex tw-justify-center tw-mt-4 tw-mb-1">
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-w-full md:tw-w-1/2">
                    <Button
                      variant="primary"
                      type="button"
                      className="tw-w-full"
                    >
                      Submit
                    </Button>
                    <Button
                      variant="light"
                      type="button"
                      className="tw-w-full"
                    >
                      Preview
                    </Button>
                  </div>
                </div>
              </div>
            </form>
            <div className="shadow-lg tw-p-6 tw-my-10 tw-bg-white tw-rounded-lg">
              <p className="tw-text-center tw-text-lg tw-mb-4 md:tw-pl-4">
                Guidelines For Scanning Uploading Photograph
              </p>
              <p className="tw-text-gray-500 tw-text-base tw-mb-4 md:tw-pl-4">
                Before applying online a candidate will be required to have a scanned (digital) image of his/her photograph as per the specifications given below.
              </p>
              <div className="tw-text-gray-500 tw-text-base tw-opacity-75">
                <ol className="list-decimal tw-pl-10 tw-space-y-2">
                  <li>
                    Photograph must be a recent passport size Color photograph in uniform.
                  </li>
                  <li>
                    Make sure that the picture is in colour, taken against a light-coloured, preferably white, background.
                  </li>
                  <li>
                    Look straight at the camera with a relaxed face.
                  </li>
                  <li>
                    If you wear glasses make sure that there are no reflections and your eyes can be clearly seen.
                  </li>
                  <li>
                    Caps, hats and dark glasses are not acceptable. Religious headwear is allowed but it must not cover your face.
                  </li>
                  <li>
                    Dimensions 200 x 230 pixels (preferred).
                  </li>
                  <li>
                    Ensure that the size of the scanned image is not more than 50 KB. If the size of the file is more than 50 KB, then adjust the settings and upload.
                  </li>
                  <li>
                    The image file should be JPG or JPEG format. An example file name is : image01.jpg or image01.jpeg Image dimensions can be checked by listing the folder files or moving the mouse over the file image icon. Note : Candidates using MS Windows/MSOffice can easily obtain photo and signature in .jpeg format not exceeding 50 KB respectively by using MS Paint or MSOffice Picture Manager. Scanned photograph in any format can be saved in .jpg format by using Save As option in the File menu and size can be reduced below 50 KB(photograph) by using crop and then resize option age menu. Similar options are available in other photo editor also. If the file size and format are not as prescribed, an error message will be displayed.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StudentIdCard;