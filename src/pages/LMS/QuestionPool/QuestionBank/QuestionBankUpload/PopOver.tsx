import React, { useMemo, useState } from 'react'
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap'

const PopOver = (props: any) => {

  return (<>
    <div>
      <Popover
        flip
        target={`testing-${props.index}`}
        toggle={props.toggle}
        isOpen={props.popOver}
      >
        <PopoverHeader>

        </PopoverHeader>
        <PopoverBody className='p-0'>

          <table>

            <tr className='bg-light'>
              <th className="p-2">Field</th>
              <th className="p-2">Value</th>
            </tr>
            <tr>
              <td className="p-2">Version</td>
              <td className="p-2">1.0</td>
            </tr>
            <tr>
              <td className="p-2">Created Date</td>
              <td className="p-2">2024-07-14</td>
            </tr>
            <tr>
              <td className="p-2">Created By</td>
              <td className="p-2">System Admin</td>
            </tr>
            <tr>
              <td className="p-2">Last Modified Date</td>
              <td className="p-2">2025-07-12</td>
            </tr>
            <tr>
              <td className="p-2">Last Modified By</td>
              <td className="p-2">Reviewer Team</td>
            </tr>
          </table>
        </PopoverBody>
      </Popover>
    </div>
  </>
  )
}

export default PopOver
