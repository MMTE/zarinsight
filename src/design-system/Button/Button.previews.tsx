import { ArrowLeftIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { Button } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const previews: ComponentPreviewModule = {
  componentName: 'Button',
  importPath: 'components/Button',
  previews: [
  {
    name: 'Variants',
    description: 'Primary, secondary (gold accent), outline, ghost and destructive actions.',
    render: () =>
    <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Sign up</Button>
          <Button variant="secondary">Upgrade plan</Button>
          <Button variant="outline">View details</Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </div>

  },
  {
    name: 'Sizes',
    description: 'Small, medium and large heights for different densities.',
    render: () =>
    <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>

  },
  {
    name: 'With icons',
    description: 'Leading and trailing icons for added context.',
    render: () =>
    <div className="flex flex-wrap items-center gap-3">
          <Button leadingIcon={<PlusIcon className="h-4 w-4" />}>
            New payment link
          </Button>
          <Button
        variant="outline"
        trailingIcon={<ArrowLeftIcon className="h-4 w-4" />}>
        
            Continue
          </Button>
          <Button
        variant="destructive"
        leadingIcon={<TrashIcon className="h-4 w-4" />}>
        
            Remove
          </Button>
        </div>

  },
  {
    name: 'Loading and disabled',
    description: 'Loading blocks interaction and shows a spinner; disabled dims the button.',
    render: () =>
    <div className="flex flex-wrap items-center gap-3">
          <Button loading>Processing</Button>
          <Button variant="outline" loading>
            Processing
          </Button>
          <Button disabled>Disabled</Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
        </div>

  },
  {
    name: 'Full width',
    description: 'Stretches to fill its container — used in forms and mobile layouts.',
    render: () =>
    <div className="w-72">
          <Button fullWidth size="lg">
            Create account
          </Button>
        </div>

  }]

};

export default previews;