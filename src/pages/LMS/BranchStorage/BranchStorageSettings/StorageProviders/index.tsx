import { useFormik } from 'formik';
import {
  InputCheckbox,
  SelectInput,
  TextInput,
} from '../../../../../Components/Common';
import { Label } from 'reactstrap';
import { useState } from 'react';
import Button from '../../../../../Components/Common/Button';

const initialValues = {
  // Connection Section
  provider: '',
  region: '',
  bucket: 'school-erp-storage',
  prefix: 'docs/',
  endpoint: 'https://s3.example.com',

  // Security & Performance Section
  accessKey: 'AKIAIOSFODNN',
  secretKey: 'wJairXUtnFE',
  encryption: '',
  signedUrlExpiry: '60',
  multipartThreshold: '50',
  versioning: true, // boolean for checkbox
  versioningStatus: 'Enabled', // string for dropdown
};

const providerOptions = [
  { id: 'aws-s3', label: 'AWS S3' },
  { id: 'google-cloud', label: 'Google Cloud Storage' },
  { id: 'azure-blob', label: 'Azure Blob Storage' },
  { id: 'minio', label: 'MinIO' },
  { id: 'custom', label: 'Custom S3 Compatible' },
];

const regionOptions = [
  { id: 'us-east-1', label: 'US East (N. Virginia)' },
  { id: 'us-east-2', label: 'US East (Ohio)' },
  { id: 'us-west-1', label: 'US West (N. California)' },
  { id: 'us-west-2', label: 'US West (Oregon)' },
  { id: 'ap-south-1', label: 'Asia Pacific (Mumbai)' },
  { id: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
  { id: 'ap-southeast-2', label: 'Asia Pacific (Sydney)' },
  { id: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
  { id: 'eu-west-1', label: 'EU (Ireland)' },
  { id: 'eu-central-1', label: 'EU (Frankfurt)' },
];

const encryptionOptions = [
  { id: 'AES256', label: 'AES-256' },
  { id: 'aws-kms', label: 'AWS KMS' },
  { id: 'none', label: 'None' },
];

const StorageProviders = () => {
  const [versioningEnabled, setVersioningEnabled] = useState(true);

  const storageProvidersFormik = useFormik({
    initialValues,
    onSubmit: (values) => {
      console.log('Form submitted:', values);
    },
  });

  // Handle versioning checkbox change
  const handleVersioningChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setVersioningEnabled(checked);
    storageProvidersFormik.setFieldValue('versioning', checked);
    storageProvidersFormik.setFieldValue(
      'versioningStatus',
      checked ? 'Enabled' : 'Disabled',
    );
  };

  return (
    <div className="tw-card">
      <div className="tw-card-header tw-flex tw-justify-between">
        <h4 className="tw-card-title">Storage Providers</h4>
        <div className="tw-flex tw-gap-2">
          <Button variant="soft">Test</Button>
          <Button variant="previous">Save</Button>
        </div>
      </div>
      <div className="tw-card-body">
        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-3">
          <div className="tw-card">
            <div className="tw-card-body">
              <h3 className="tw-text-lg tw-font-semibold tw-text-gray-900 tw-mb-4">
                Connection
              </h3>

              <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-4">
                <div className="">
                  <SelectInput
                    name="provider"
                    value={storageProvidersFormik.values.provider}
                    onChange={storageProvidersFormik.handleChange}
                    onBlur={storageProvidersFormik.handleBlur}
                    menuItems={providerOptions}
                    textKey="label"
                    valueKey="id"
                    labelText="Provider"
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                <div className="">
                  <SelectInput
                    name="region"
                    value={storageProvidersFormik.values.region}
                    onChange={storageProvidersFormik.handleChange}
                    onBlur={storageProvidersFormik.handleBlur}
                    menuItems={regionOptions}
                    textKey="label"
                    valueKey="id"
                    labelText="Region"
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                <div className="tw-col-span-2">
                  <TextInput
                    name="bucket"
                    value={storageProvidersFormik.values.bucket}
                    onChange={storageProvidersFormik.handleChange}
                    onBlur={storageProvidersFormik.handleBlur}
                    labelText="Bucket"
                    placeholder="e.g. school-erp-storage"
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                <div className="tw-col-span-2 lg:tw-col-span-1">
                  <TextInput
                    name="prefix"
                    value={storageProvidersFormik.values.prefix}
                    onChange={storageProvidersFormik.handleChange}
                    onBlur={storageProvidersFormik.handleBlur}
                    labelText="Prefix"
                    placeholder="e.g. docs/"
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                <div className="tw-col-span-2 lg:tw-col-span-1">
                  <TextInput
                    name="endpoint"
                    value={storageProvidersFormik.values.endpoint}
                    onChange={storageProvidersFormik.handleChange}
                    onBlur={storageProvidersFormik.handleBlur}
                    labelText="Endpoint (optional)"
                    placeholder="https://s3.example.com"
                    formgroupClassName="tw-mb-0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security & Performance Section Card */}
          <div className="tw-card">
            <div className="tw-card-body">
              <h3 className="tw-text-lg tw-font-semibold tw-text-gray-900 tw-mb-4">
                Security & Performance
              </h3>

              <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-4 tw-items-center">
                <div className="tw-col-span-2 lg:tw-col-span-1">
                  <TextInput
                    name="accessKey"
                    value={storageProvidersFormik.values.accessKey}
                    onChange={storageProvidersFormik.handleChange}
                    onBlur={storageProvidersFormik.handleBlur}
                    labelText="Access Key"
                    placeholder="e.g. AKIAIOSFODNN"
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                <div className="tw-col-span-2 lg:tw-col-span-1">
                  <TextInput
                    name="secretKey"
                    value={storageProvidersFormik.values.secretKey}
                    onChange={storageProvidersFormik.handleChange}
                    onBlur={storageProvidersFormik.handleBlur}
                    labelText="Secret Key"
                    placeholder="Enter secret key"
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                <div className="">
                  <SelectInput
                    name="encryption"
                    value={storageProvidersFormik.values.encryption}
                    onChange={storageProvidersFormik.handleChange}
                    onBlur={storageProvidersFormik.handleBlur}
                    menuItems={encryptionOptions}
                    textKey="label"
                    valueKey="id"
                    labelText="Encryption"
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                <div className="tw-col-span-2 lg:tw-col-span-1">
                  <TextInput
                    name="signedUrlExpiry"
                    value={storageProvidersFormik.values.signedUrlExpiry}
                    onChange={storageProvidersFormik.handleChange}
                    onBlur={storageProvidersFormik.handleBlur}
                    labelText="Signed URL Expiry"
                    placeholder="60"
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                <div className="tw-col-span-2 lg:tw-col-span-1">
                  <TextInput
                    name="multipartThreshold"
                    value={storageProvidersFormik.values.multipartThreshold}
                    onChange={storageProvidersFormik.handleChange}
                    onBlur={storageProvidersFormik.handleBlur}
                    labelText="Multipart Threshold"
                    placeholder="50"
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                <div className="">
                  <div className="tw-flex tw-items-center tw-justify-between">
                    <Label className="form-label tw-mb-0" for="versioning">
                      Versioning
                    </Label>
                    <InputCheckbox
                      name="versioning"
                      value={storageProvidersFormik.values.versioning}
                      onChange={handleVersioningChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageProviders;
