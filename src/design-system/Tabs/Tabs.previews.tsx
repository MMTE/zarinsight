import { Tabs, TabPanel } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const items = [
{ value: 'overview', label: 'Overview' },
{ value: 'transactions', label: 'Transactions', badge: 12 },
{ value: 'payouts', label: 'Payouts' },
{ value: 'archive', label: 'Archive', disabled: true }];


const previews: ComponentPreviewModule = {
  componentName: 'Tabs',
  importPath: 'components/Tabs',
  previews: [
  {
    name: 'Segmented',
    description: 'Default segmented switcher with a badge and a disabled tab.',
    render: () =>
    <div className="w-full max-w-xl">
          <Tabs items={items} aria-label="Dashboard sections" />
        </div>

  },
  {
    name: 'Underline with panels',
    description: 'Underline variant wired to tab panels.',
    render: () =>
    <div className="w-full max-w-xl">
          <Tabs
        variant="underline"
        items={[
        { value: 'profile', label: 'Profile' },
        { value: 'security', label: 'Security' },
        { value: 'api', label: 'API keys', badge: 3 }]
        }
        aria-label="Account settings">
        
            <TabPanel value="profile">Update your business name, logo, and contact details.</TabPanel>
            <TabPanel value="security">Manage two-factor authentication and active sessions.</TabPanel>
            <TabPanel value="api">Create and revoke merchant API keys.</TabPanel>
          </Tabs>
        </div>

  },
  {
    name: 'Full width, small',
    description: 'Compact tabs stretched to fill their container.',
    render: () =>
    <div className="w-full max-w-md">
          <Tabs
        size="sm"
        fullWidth
        defaultValue="monthly"
        items={[
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' }]
        }
        aria-label="Report range" />
      
        </div>

  }]

};

export default previews;