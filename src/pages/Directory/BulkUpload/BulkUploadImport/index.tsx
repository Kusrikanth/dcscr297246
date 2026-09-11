import { useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import BulkUploadImportStatsList from "./BulkUploadImportStatsList";
import { generateColums } from "./helper";
import { useHistory } from "react-router-dom";
import Button from "../../../../Components/Common/Button";

const tableData = [
  {
    dataImportStatus: "Data Import success from row No.1",
  },
  {
    dataImportStatus: "Data Import success from row No.2",
  },
  {
    dataImportStatus: "Data Import success from row No.3",
  },
  {
    dataImportStatus: "Data Import success from row No.4",
  },
  {
    dataImportStatus: "Data Import success from row No.5",
  },
];

const BulkUploadImport = () => {
  const tableColumns = useMemo(() => generateColums(), []);
  const history = useHistory()

  return (
    <div className="bulk-upload-import-container">
      <BulkUploadImportStatsList></BulkUploadImportStatsList>

      {/* <div>
        <TableContainer
          columns={tableColumns || []}
          data={tableData || []}
          tableClass="mb-0"
          divClass="table-responsive mb-3"
          theadClass="table-light text-muted align-middle"
          showPagination={true}
        ></TableContainer>
      </div> */}

      <div className="tw-flex tw-justify-end tw-mt-10 tw-gap-3">
        <Button
        variant="secondary"
          onClick={() => history.push('/bulk-upload/raw-data')}
        >
          Preview
        </Button>

        <Button
        variant="primary"
          >
          Done
        </Button>
      </div>

    </div>
  );
};

export default BulkUploadImport;
