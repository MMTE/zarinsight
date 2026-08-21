import {
  ArrowRightIcon,
  DownloadIcon,
  MoreVerticalIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon } from
'lucide-react';
import { IconButton } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const previews: ComponentPreviewModule = {
  componentName: 'IconButton',
  importPath: 'components/IconButton',
  previews: [
  {
    name: 'Variants',
    description: 'Primary, secondary, ghost, and danger styles.',
    render: () =>
    <div className="flex items-center gap-3">
          <IconButton variant="primary" label="افزودن" icon={<PlusIcon />} />
          <IconButton
        variant="secondary"
        label="دانلود"
        icon={<DownloadIcon />} />
      
          <IconButton variant="ghost" label="ویرایش" icon={<PencilIcon />} />
          <IconButton variant="danger" label="حذف" icon={<Trash2Icon />} />
        </div>

  },
  {
    name: 'Sizes',
    description: 'Square 32 / 40 / 48px targets.',
    render: () =>
    <div className="flex items-center gap-3">
          <IconButton size="sm" label="More" icon={<MoreVerticalIcon />} />
          <IconButton size="md" label="More" icon={<MoreVerticalIcon />} />
          <IconButton size="lg" label="More" icon={<MoreVerticalIcon />} />
        </div>

  },
  {
    name: 'RTL directional',
    description:
    'Directional icons mirror automatically inside an RTL container.',
    render: () =>
    <div className="flex items-center gap-6">
          <div dir="ltr" className="flex items-center gap-2">
            <span className="text-xs text-slate-500">LTR</span>
            <IconButton
          variant="primary"
          directional
          label="Next"
          icon={<ArrowRightIcon />} />
        
          </div>
          <div dir="rtl" className="flex items-center gap-2">
            <span className="text-xs text-slate-500">RTL</span>
            <IconButton
          variant="primary"
          directional
          label="بعدی"
          icon={<ArrowRightIcon />} />
        
          </div>
        </div>

  },
  {
    name: 'Loading & disabled',
    description: 'Busy and non-interactive states.',
    render: () =>
    <div className="flex items-center gap-3">
          <IconButton variant="primary" loading label="در حال ذخیره" icon={<PlusIcon />} />
          <IconButton variant="secondary" loading label="Loading" icon={<DownloadIcon />} />
          <IconButton variant="secondary" disabled label="Disabled" icon={<PencilIcon />} />
        </div>

  }]

};

export default previews;