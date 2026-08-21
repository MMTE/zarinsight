import { CheckIcon } from 'lucide-react';
import { Badge } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const previews: ComponentPreviewModule = {
  componentName: 'Badge',
  importPath: 'components/Badge',
  previews: [
  {
    name: 'Variants',
    description: 'All tonal variants',
    render: () =>
    <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="brand">Brand</Badge>
          <Badge variant="success">Active</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="danger">Failed</Badge>
          <Badge variant="info">Info</Badge>
        </div>

  },
  {
    name: 'Counts',
    description: 'Compact numeric labels',
    render: () =>
    <div className="flex items-center gap-2">
          <Badge size="sm">3</Badge>
          <Badge size="sm" variant="brand">
            12
          </Badge>
          <Badge variant="danger">99+</Badge>
        </div>

  },
  {
    name: 'With dot and icon',
    description: 'Status dot or leading icon',
    render: () =>
    <div className="flex flex-wrap items-center gap-2">
          <Badge variant="success" dot>
            Online
          </Badge>
          <Badge variant="warning" dot size="sm">
            Review
          </Badge>
          <Badge variant="brand" icon={<CheckIcon />}>
            Verified
          </Badge>
        </div>

  }]

};

export default previews;