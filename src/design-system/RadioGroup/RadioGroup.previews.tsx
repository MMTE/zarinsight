import { RadioGroup, RadioGroupItem } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const previews: ComponentPreviewModule = {
  componentName: 'RadioGroup',
  importPath: 'components/RadioGroup',
  previews: [
  {
    name: 'Default',
    description: 'Vertical single-choice group with a label.',
    render: () =>
    <div className="w-full max-w-md">
          <RadioGroup
        label="Settlement cycle"
        description="How often payouts are sent to your bank account."
        defaultValue="daily">
        
            <RadioGroupItem value="daily" label="Daily" description="Every business day at 9:00" />
            <RadioGroupItem value="weekly" label="Weekly" description="Every Saturday" />
            <RadioGroupItem value="manual" label="Manual" description="Request payouts yourself" />
          </RadioGroup>
        </div>

  },
  {
    name: 'Card options',
    description: 'Selectable cards with trailing values, ideal for settlement accounts.',
    render: () =>
    <div className="w-full max-w-md">
          <RadioGroup label="Settlement account" defaultValue="mellat">
            <RadioGroupItem
          variant="card"
          value="mellat"
          label="Bank Mellat"
          description="IR•• •••• •••• 4821"
          trailing="Default" />
        
            <RadioGroupItem
          variant="card"
          value="saman"
          label="Saman Bank"
          description="IR•• •••• •••• 1170" />
        
            <RadioGroupItem
          variant="card"
          value="closed"
          label="Parsian Bank"
          description="Account closed"
          disabled />
        
          </RadioGroup>
        </div>

  },
  {
    name: 'Horizontal with error',
    description: 'Inline layout showing the invalid state.',
    render: () =>
    <div className="w-full max-w-md">
          <RadioGroup
        label="Fee payer"
        orientation="horizontal"
        error="Select who pays the transaction fee.">
        
            <RadioGroupItem value="merchant" label="Merchant" />
            <RadioGroupItem value="customer" label="Customer" />
          </RadioGroup>
        </div>

  },
  {
    name: 'Disabled group',
    description: 'All options locked, e.g. while a plan change is pending.',
    render: () =>
    <div className="w-full max-w-md">
          <RadioGroup label="Plan" defaultValue="pro" disabled>
            <RadioGroupItem value="basic" label="Basic" />
            <RadioGroupItem value="pro" label="Pro" description="Current plan" />
          </RadioGroup>
        </div>

  }]

};

export default previews;