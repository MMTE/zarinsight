import React from 'react';
import { Switch } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

function ControlledExample() {
  const [enabled, setEnabled] = React.useState(true);
  return (
    <div className="flex flex-col gap-3">
      <Switch
        checked={enabled}
        onChange={setEnabled}
        label="اعلان‌های ایمیلی"
        description="دریافت خلاصه تراکنش‌های روزانه" />
      
      <p className="text-sm text-slate-500">
        وضعیت: {enabled ? 'روشن' : 'خاموش'}
      </p>
    </div>);

}

const previews: ComponentPreviewModule = {
  componentName: 'Switch',
  importPath: 'components/Switch',
  previews: [
  {
    name: 'Default',
    description: 'Uncontrolled switch, off by default',
    render: () => <Switch aria-label="Enable notifications" />
  },
  {
    name: 'With label',
    description: 'Label and helper text for a settings row',
    render: () =>
    <Switch
      defaultChecked
      label="Push notifications"
      description="Get alerted when a payment is received." />


  },
  {
    name: 'Sizes',
    description: 'Small, medium, and large',
    render: () =>
    <div className="flex items-center gap-4">
          <Switch size="sm" defaultChecked aria-label="Small" />
          <Switch size="md" defaultChecked aria-label="Medium" />
          <Switch size="lg" defaultChecked aria-label="Large" />
        </div>

  },
  {
    name: 'Disabled',
    description: 'Disabled in both states',
    render: () =>
    <div className="flex flex-col gap-3">
          <Switch disabled label="Disabled off" />
          <Switch disabled defaultChecked label="Disabled on" />
        </div>

  },
  {
    name: 'Controlled',
    description: 'State owned by the parent component',
    render: () => <ControlledExample />
  }]

};

export default previews;