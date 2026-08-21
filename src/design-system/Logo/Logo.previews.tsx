import { Logo } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const previews: ComponentPreviewModule = {
  componentName: 'Logo',
  importPath: 'components/Logo',
  previews: [
  {
    name: 'Lockup',
    description: 'Full brand lockup at every size.',
    render: () =>
    <div className="flex w-full flex-wrap items-end justify-center gap-8 p-6">
          <Logo size="sm" />
          <Logo size="md" />
          <Logo size="lg" />
          <Logo size="xl" />
        </div>

  },
  {
    name: 'Tones',
    description: 'Color, all-black, and all-white (shown on a dark plate).',
    render: () =>
    <div className="flex w-full flex-wrap items-center justify-center gap-6 p-6">
          <div className="rounded-lg bg-white p-5">
            <Logo size="lg" tone="color" />
          </div>
          <div className="rounded-lg bg-white p-5">
            <Logo size="lg" tone="black" />
          </div>
          <div className="rounded-lg bg-black p-5">
            <Logo size="lg" tone="white" />
          </div>
        </div>

  },
  {
    name: 'Mark and badge',
    description:
    'Logomark alone, plus the badge form on white and black plates for busy or low-contrast backgrounds.',
    render: () =>
    <div className="flex w-full flex-wrap items-center justify-center gap-6 bg-neutral-200 p-6">
          <Logo variant="mark" size="xl" />
          <Logo variant="badge" size="xl" badgeBackground="white" />
          <Logo variant="badge" size="xl" badgeBackground="black" tone="white" />
        </div>

  }]

};

export default previews;