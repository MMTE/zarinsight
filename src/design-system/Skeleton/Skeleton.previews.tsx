import { Skeleton, SkeletonText, SkeletonCard, SkeletonTable, SkeletonChart } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const previews: ComponentPreviewModule = {
  componentName: 'Skeleton',
  importPath: 'components/Skeleton',
  previews: [
  {
    name: 'Primitives',
    description: 'Base shapes: rectangle, text lines, and circle.',
    render: () =>
    <div className="flex w-full max-w-md flex-col gap-5">
          <Skeleton width="100%" height="3rem" />
          <SkeletonText lines={3} />
          <div className="flex items-center gap-3">
            <Skeleton variant="circle" width="3rem" height="3rem" />
            <Skeleton variant="text" width="10rem" />
          </div>
        </div>

  },
  {
    name: 'Card',
    description: 'Card placeholder with avatar and optional media block.',
    render: () =>
    <div className="grid w-full max-w-3xl gap-4 md:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard media avatar={false} lines={2} />
        </div>

  },
  {
    name: 'Table rows',
    description: 'Tabular loading state with header and five rows.',
    render: () =>
    <div className="w-full max-w-3xl">
          <SkeletonTable rows={5} columns={4} />
        </div>

  },
  {
    name: 'Chart',
    description: 'Bar chart placeholder with title, legend, and axis labels.',
    render: () =>
    <div className="w-full max-w-2xl">
          <SkeletonChart bars={8} />
        </div>

  },
  {
    name: 'Static (no animation)',
    description: 'Animation disabled for reduced-motion or screenshot contexts.',
    render: () =>
    <div className="w-full max-w-md">
          <SkeletonCard animate={false} />
        </div>

  }]

};

export default previews;