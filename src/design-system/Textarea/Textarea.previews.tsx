import { Textarea } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const previews: ComponentPreviewModule = {
  componentName: 'Textarea',
  importPath: 'components/Textarea',
  previews: [
  {
    name: 'Default',
    description: 'Labelled textarea with helper text',
    render: () =>
    <div className="w-full max-w-md">
          <Textarea
        label="Support note"
        placeholder="Describe the issue in detail…"
        hint="Include transaction IDs where possible." />
      
        </div>

  },
  {
    name: 'With character count',
    description: 'Counter shown against a maxLength limit',
    render: () =>
    <div className="w-full max-w-md">
          <Textarea
        label="Business description"
        placeholder="Tell us about your business"
        maxLength={200}
        showCount
        defaultValue="Online store selling handmade goods." />
      
        </div>

  },
  {
    name: 'Error',
    description: 'Invalid state with an error message',
    render: () =>
    <div className="w-full max-w-md">
          <Textarea
        label="Refund reason"
        required
        error="Please provide at least 20 characters."
        defaultValue="Wrong amount" />
      
        </div>

  },
  {
    name: 'Sizes',
    description: 'Small, medium and large scales',
    render: () =>
    <div className="flex w-full max-w-md flex-col gap-4">
          <Textarea size="sm" label="Small" placeholder="Short note" />
          <Textarea size="md" label="Medium" placeholder="Standard note" />
          <Textarea size="lg" label="Large" placeholder="Long-form note" />
        </div>

  },
  {
    name: 'Disabled',
    description: 'Non-editable state',
    render: () =>
    <div className="w-full max-w-md">
          <Textarea
        label="Internal notes"
        disabled
        resize="none"
        defaultValue="Only visible to administrators." />
      
        </div>

  }]

};

export default previews;