import { useState } from 'react';
import { Checkbox } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

function SelectAllExample() {
  const [rows, setRows] = useState([true, false, false]);
  const allChecked = rows.every(Boolean);
  const someChecked = rows.some(Boolean) && !allChecked;

  return (
    <div className="w-64 rounded-lg border border-slate-200 bg-white p-3">
      <Checkbox
        label="Select all transactions"
        checked={allChecked}
        indeterminate={someChecked}
        onChange={(e) => setRows(rows.map(() => e.target.checked))} />
      
      <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3 pl-6">
        {rows.map((checked, i) =>
        <Checkbox
          key={i}
          size="sm"
          label={`Payment #${1024 + i}`}
          checked={checked}
          onChange={(e) =>
          setRows(rows.map((r, idx) => idx === i ? e.target.checked : r))
          } />

        )}
      </div>
    </div>);

}

const previews: ComponentPreviewModule = {
  componentName: 'Checkbox',
  importPath: 'components/Checkbox',
  previews: [
  {
    name: 'Default',
    description: 'Unchecked and checked states with labels',
    render: () =>
    <div className="flex flex-col gap-3">
          <Checkbox label="Remember this device" defaultChecked />
          <Checkbox label="Send me payment receipts" />
        </div>

  },
  {
    name: 'With description',
    description: 'Label plus supporting helper text',
    render: () =>
    <Checkbox
      label="Enable instant settlement"
      description="Funds are transferred to your bank account within minutes."
      defaultChecked />


  },
  {
    name: 'Indeterminate select all',
    description: 'Header checkbox controlling a group of row checkboxes',
    render: () => <SelectAllExample />
  },
  {
    name: 'Disabled and error',
    description: 'Non-interactive and invalid states',
    render: () =>
    <div className="flex flex-col gap-4">
          <Checkbox label="Locked setting" defaultChecked disabled />
          <Checkbox label="Unavailable option" disabled />
          <Checkbox label="Accept the terms of service" error="You must accept the terms to continue." />
        </div>

  },
  {
    name: 'Sizes',
    description: 'Small for dense tables, medium for forms',
    render: () =>
    <div className="flex flex-col gap-3">
          <Checkbox size="sm" label="Small" defaultChecked />
          <Checkbox size="md" label="Medium" defaultChecked />
        </div>

  }]

};

export default previews;