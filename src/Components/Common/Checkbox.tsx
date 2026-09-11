import React from "react";

export const Checkbox = React.forwardRef(({ indeterminate, ...rest }: any, ref: any) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <div className="form-check !tw-mb-0" >
        <input className="form-check-input" type="checkbox" ref={resolvedRef} {...rest} />
      </div>
    </>
  );
}
);

Checkbox.displayName = "Checkbox";