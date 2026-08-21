import { Avatar } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const photo =
'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop';

const previews: ComponentPreviewModule = {
  componentName: 'Avatar',
  importPath: 'components/Avatar',
  previews: [
  {
    name: 'With image',
    description: 'Circular user photo, default medium size.',
    render: () => <Avatar src={photo} name="Sara Ahmadi" />
  },
  {
    name: 'Initials fallback',
    description: 'Derived initials when no image is available.',
    render: () =>
    <div className="flex items-center gap-3">
          <Avatar name="Sara Ahmadi" />
          <Avatar name="Reza" />
          <Avatar initials="ZP" />
          <Avatar />
        </div>

  },
  {
    name: 'Sizes',
    description: 'xs through xl.',
    render: () =>
    <div className="flex items-end gap-3">
          <Avatar src={photo} name="Sara Ahmadi" size="xs" />
          <Avatar src={photo} name="Sara Ahmadi" size="sm" />
          <Avatar src={photo} name="Sara Ahmadi" size="md" />
          <Avatar src={photo} name="Sara Ahmadi" size="lg" />
          <Avatar src={photo} name="Sara Ahmadi" size="xl" />
        </div>

  },
  {
    name: 'Status and shape',
    description: 'Presence dot and rounded-square variant.',
    render: () =>
    <div className="flex items-center gap-3">
          <Avatar name="Sara Ahmadi" status="online" />
          <Avatar name="Ali Karimi" status="busy" />
          <Avatar name="Mina Tehrani" status="away" />
          <Avatar name="Omid Naderi" status="offline" />
          <Avatar src={photo} name="Sara Ahmadi" square />
        </div>

  },
  {
    name: 'Interactive / stacked',
    description: 'Clickable top-bar avatar and an overlapping group.',
    render: () =>
    <div className="flex items-center gap-6">
          <Avatar src={photo} name="Sara Ahmadi" onClick={() => {}} />
          <div className="flex -space-x-2">
            <Avatar name="Sara Ahmadi" size="sm" ring />
            <Avatar name="Ali Karimi" size="sm" ring />
            <Avatar name="Mina Tehrani" size="sm" ring />
            <Avatar initials="+3" size="sm" ring />
          </div>
        </div>

  }]

};

export default previews;