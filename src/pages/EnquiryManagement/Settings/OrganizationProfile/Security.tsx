import React from 'react'
import { Switch } from '../../../../Components/Common'

const Security = () => {
  return (
    <div className='card'>
<div className='container tw-mt-4 tw-mb-5 '>
      <div className='tw-flex tw-flex-wrap'>
        <div className='tw-w-full'>
          <div className='tw-flex tw-justify-between tw-items-center'>
            <div >
              <h5 className='tw-text-xl tw-font-bold'>Secure your Account with 2FA</h5>
              <p className="tw-text-gray-500">Don't wait—secure your account now!</p>
            </div>
            <div className="tw-flex tw-items-center">
              <Switch attributeId='' className='tw-form-switch-lg' />
            </div>
          </div>
        </div>
      </div>

      <div className='tw-flex tw-flex-wrap tw-mt-3'>
        <div className='tw-w-full'>
          <div className='tw-border tw-p-4 tw-bg-gray-100 tw-rounded'>
            <div className='tw-flex tw-justify-between'>
              <div className='tw-flex tw-gap-3'>
                <h6 className='tw-text-base tw-font-bold'>Email Authentication</h6>
                <small className="tw-text-gray-500">(if no other setup is done)</small>
              </div>
            </div>
            <p className="tw-mb-1 tw-text-gray-500">
              Email Authentication is set by default for your account. A 6-digit authentication code will be sent to your registered email during login.
            </p>
            <div className='tw-flex tw-items-center tw-text-emerald-500'>
              <p className='tw-mb-0'>Enabled</p>
              <i className="ri-checkbox-circle-line tw-text-xl tw-ml-2"></i>
            </div>
          </div>
        </div>
      </div>

      <div className='tw-flex tw-flex-wrap tw-mt-3'>
        <div className='tw-w-full'>
          <div className='tw-border tw-p-4 tw-bg-gray-100 tw-rounded'>
            <div className='tw-flex tw-justify-between tw-items-center'>
              <div className='tw-flex tw-gap-3'>
                <h6 className='tw-text-base tw-font-bold'>Phone Number Authentication</h6>
                <small className="tw-text-gray-500">(only for Indian numbers)</small>
              </div>
            </div>
            <p className="tw-mb-1 tw-text-gray-500">
              Enter a one-time code sent via text message on your registered phone number.
            </p>
            <div className="tw-flex tw-justify-end tw-items-center tw-gap-3">
              <button className='tw-p-0 tw-text-blue-500'>Setup Authentication</button>
              <i className="ri-arrow-right-s-line tw-text-blue-500"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
  )
}

export default Security