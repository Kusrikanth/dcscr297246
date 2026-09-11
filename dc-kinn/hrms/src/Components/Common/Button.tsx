import React from 'react';
import classnames from 'classnames';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'exportBtn'
  | 'hoverInfo'
  | 'wrong'
  | 'warning'
  | 'reject'
  | 'soft'
  | 'info'
  | 'previous'
  | "linkBtn"
  | "sidebarMenu";

type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'sm',
  className,
  children,
  ...props
}) => {
  const baseClasses =
    'tw-rounded-md tw-shadow-sm focus:tw-outline-none disabled:tw-opacity-60 disabled:tw-cursor-not-allowed tw-flex tw-items-center tw-justify-center tw-gap-2';

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'tw-text-sm tw-px-3.5 tw-py-2',
    md: 'tw-text-base tw-px-4 tw-py-2',
    lg: 'tw-text-lg tw-px-5 tw-py-2.5',
    xl: 'tw-text-xl tw-px-6 tw-py-3',
    '2xl': 'tw-text-2xl tw-px-7 tw-py-3.5',
  };

  const variantClasses: Record<ButtonVariant, string> = {
    previous:
      'tw-text-[#1bb3a6] tw-bg-[#d1f4f1] hover:tw-bg-[#b8ece7] focus:tw-border-primary focus:tw-border-opacity-60',
    primary:
      'tw-text-white tw-bg-[#1bb3a6] hover:tw-bg-[#099885] focus:tw-border-primary focus:tw-border-opacity-60',
    secondary:
      'tw-bg-gray-100 focus:tw-border-primary focus:tw-border-opacity-60',
    info: 'tw-text-white tw-bg-[#405189] hover:tw-bg-[#33406f]',
    hoverInfo:
      'tw-border tw-border-[#405189] tw-text-[#405189] tw-bg-transparent hover:tw-bg-[#405189] hover:tw-text-white tw-transition-all tw-duration-200',
    reject: 'tw-text-white tw-bg-[#f06548] hover:tw-bg-[#d85c40]',
    wrong:
      'tw-text-red-500 hover:tw-bg-red-50 hover:tw-border-hover focus:tw-border-primary focus:tw-border-opacity-60',
    soft: 'tw-border tw-border-blue-600 tw-text-blue-600 tw-bg-transparent tw-border-default focus:tw-border-primary focus:tw-border-opacity-60',
    warning: 'tw-text-white tw-bg-[#e66a4e] hover:tw-bg-[#d85c40]',
    exportBtn:
      'tw-bg-blue-100 tw-text-[#eff6ff] tw-rounded-full tw-p-2 hover:tw-bg-[#008ed3] hover:tw-text-white tw-transition-all tw-duration-200',
    linkBtn:
      "tw-text-[#0d6efd] hover:tw-text-[#0a58ca] tw-underline tw-bg-transparent !tw-shadow-none tw-p-0 focus:tw-outline-none disabled:tw-opacity-60 disabled:tw-cursor-not-allowed",
    sidebarMenu:
      "tw-bg-transparent !tw-shadow-none !tw-border-0 !tw-p-0 !tw-flex !tw-items-start !tw-justify-start focus:!tw-outline-none disabled:tw-opacity-60 disabled:tw-cursor-not-allowed",
  };

  return (
    <button
      className={classnames(
        baseClasses,
        variantClasses[variant],
        variant !== 'exportBtn' && sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
