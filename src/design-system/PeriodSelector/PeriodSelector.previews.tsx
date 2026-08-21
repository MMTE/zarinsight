import { useState } from 'react';
import { PeriodSelector, type PeriodOption } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const options: PeriodOption[] = [
{ value: '7d', label: '۷ روز' },
{ value: '30d', label: '۳۰ روز' },
{ value: '90d', label: '۹۰ روز' },
{ value: '1y', label: 'یک سال' }];


function Demo({
  size,
  disabled,
  loading,
  items = options





}: {size?: 'sm' | 'md';disabled?: boolean;loading?: boolean;items?: PeriodOption[];}) {
  const [value, setValue] = useState('30d');
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <PeriodSelector
        options={items}
        value={value}
        onChange={setValue}
        size={size}
        disabled={disabled}
        loading={loading} />
      
    </div>);

}

const previews: ComponentPreviewModule = {
  componentName: 'PeriodSelector',
  importPath: 'components/PeriodSelector',
  previews: [
  {
    name: 'Default',
    description: 'Segmented control with four date ranges',
    render: () => <Demo />
  },
  {
    name: 'Small',
    description: 'Compact density for dense chart headers',
    render: () => <Demo size="sm" />
  },
  {
    name: 'Loading',
    description: 'Subtle pulse while new chart data loads',
    render: () => <Demo loading />
  },
  {
    name: 'Disabled option',
    description: 'One range unavailable, whole control still usable',
    render: () =>
    <Demo
      items={[
      { value: '7d', label: '۷ روز' },
      { value: '30d', label: '۳۰ روز' },
      { value: '90d', label: '۹۰ روز', disabled: true }]
      } />


  },
  {
    name: 'Disabled',
    description: 'Entire control disabled',
    render: () => <Demo disabled />
  }]

};

export default previews;