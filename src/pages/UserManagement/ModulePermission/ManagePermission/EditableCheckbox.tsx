import React from "react";
const EditableCell = ({
  value: initialValue,
  row: { index, original },
  column: { id },
  updateMydata, // This is a custom function that we supplied to our table instance
}: any) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState<boolean>(initialValue);
  const onChange = (e: any) => {
    setValue((pre) => !pre);
    updateMydata({ rowId: original.id, id, value: e.target.checked });
  };
  // We'll only update the external data when the input is blurred
  //   const onBlur = () => {
  //     updateMyData(index, id, value);
  //   };
  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  return <input type="checkbox" onChange={onChange} checked={value} />;
};
export default EditableCell;
