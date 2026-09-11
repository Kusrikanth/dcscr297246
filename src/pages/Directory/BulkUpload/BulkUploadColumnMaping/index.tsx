import { useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColums } from "./helper";
import { useHistory } from "react-router-dom";
import Button from "../../../../Components/Common/Button";

const tableData = [
  {
    fileHeader: "Student Name",
    attributes: "",
    attributesValues: "Ramesh, Sunil, Anil",
  },
  {
    fileHeader: "Roll No",
    attributes: "",
    attributesValues: "1217812, 1217813, 1217814",
  },
  {
    fileHeader: "English",
    attributes: "",
    attributesValues: "78, 72, 90",
  },
  {
    fileHeader: "SL",
    attributes: "",
    attributesValues: "78, 72, 90",
  },
  {
    fileHeader: "Maths",
    attributes: "",
    attributesValues: "78, 72, 90",
  },
  {
    fileHeader: "Sciense",
    attributes: "",
    attributesValues: "78, 72, 90",
  },
  {
    fileHeader: "Social",
    attributes: "",
    attributesValues: "78, 72, 90",
  },
  {
    fileHeader: "IT",
    attributes: "",
    attributesValues: "78, 72, 90",
  },
];

const BulkUploadColumnMaping = () => {
  const tableColumns = useMemo(() => generateColums(), []);

  return (
   <div className="tw-space-y-6">

  <div className="tw-space-y-1">
    <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
      Bulk Upload
    </h4>
    <p className="tw-text-sm tw-text-gray-600">
      Select the Digital campus record type and each source field to target
      a Digital campus field. We suggest that you map all the required
      fields before you click on next.
    </p>
  </div>

  <div>
    <TableContainer
      columns={tableColumns || []}
      data={tableData || []}
      tableClass="tw-mb-0"
      divClass="tw-overflow-x-auto tw-mb-4"
      theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
    />
  </div>

  <div className="tw-flex tw-justify-end tw-gap-3 tw-pt-6">
    <Button
    variant="secondary"
    >
      Previous
    </Button>

    <Button
    variant="primary"
    >
      Next
    </Button>
  </div>

</div>

  );
};

export default BulkUploadColumnMaping;
