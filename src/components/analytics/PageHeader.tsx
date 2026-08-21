import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-[20px] font-bold leading-8 text-gray-950 lg:text-[24px]">{title}</h1>
        {description &&
        <p className="mt-1 max-w-2xl text-[13px] leading-7 text-gray-700">{description}</p>
        }
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>);

}

interface SectionHeadingProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  as?: 'h2' | 'h3';
}

export function SectionHeading({ title, description, action, as = 'h2' }: SectionHeadingProps) {
  const Tag = as;
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <Tag className="text-[15px] font-bold leading-7 text-gray-950">{title}</Tag>
        {description && <p className="mt-1 text-[12px] leading-6 text-gray-700">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>);

}