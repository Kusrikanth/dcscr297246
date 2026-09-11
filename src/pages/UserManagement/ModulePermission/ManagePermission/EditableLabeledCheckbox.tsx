import React from "react";
import { InputCheckbox } from "../../../../Components/Common/InputCheckbox";
const EditableLabeledCheckboxCell = ({
  value: initialValue,
  row: { index, original },
  column: { id },
  array,
  checkAll, // This is a custom function that we supplied to our table instance
}: any) => {
  // We need to keep and update the state of the cell normally
  let intial =
    original.edit && original.create && original.delete && original.view;
  const [value, setValue] = React.useState<boolean>(intial);
  const onChange = (e: any) => {
    setValue((pre) => !pre);
    // updateMydata({ index, id, value: e.target.checked });
  };
  // We'll only update the external data when the input is blurred
  //   const onBlur = () => {
  //     updateMyData(index, id, value);
  //   };
  // If the initialValue is changed external, sync it up with our state
  // React.useEffect(() => {
  //   setValue(initialValue);
  // }, [initialValue]);
  return (
    <InputCheckbox
      name={`${original.submodule}`}
      // formgroupClassName=
      labelName={`${original.submodule}`}
      onChange={(e: any) => {
        onChange(e);
        checkAll({ id: original.id, checkedValue: e.target.checked, array });
      }}
      value={value}
      dataId={original.id}
    />
  );
};
export default EditableLabeledCheckboxCell;
