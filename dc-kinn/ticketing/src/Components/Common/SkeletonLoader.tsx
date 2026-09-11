import classnames from "classnames";
interface ISkeletonLoaderProps {
    height ?: string,
    width ?: string,
    formgroupClassName ?: string,
}

export function SkeletonLoader ({width , height, formgroupClassName} : ISkeletonLoaderProps) {
  return (
    <div className={classnames("tw-bg-gray-200 tw-mb-1 tw-p-2 skeleton-loader rounded ", formgroupClassName)} style={{ width: width || '40%', height: height || '10px' }}></div>
  )
}
