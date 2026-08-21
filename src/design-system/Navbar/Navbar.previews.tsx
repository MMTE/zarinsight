import { Navbar } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const previews: ComponentPreviewModule = {
  componentName: 'Navbar',
  importPath: 'components/Navbar',
  previews: [
  {
    name: 'Default',
    description: 'Signed-out style bar with hamburger, logo, and action cluster',
    render: () =>
    <div style={{ width: '100%' }}>
          <Navbar />
        </div>

  },
  {
    name: 'With badges',
    description: 'Unread ticket and notification counts with a named user',
    render: () =>
    <div style={{ width: '100%' }}>
          <Navbar ticketCount={2} notificationCount={12} userName="سارا محمدی" />
        </div>

  },
  {
    name: 'Menu open with avatar',
    description: 'Hamburger in open state and a photo avatar',
    render: () =>
    <div style={{ width: '100%' }}>
          <Navbar
        menuOpen
        userName="علی رضایی"
        notificationCount={3}
        avatarUrl="https://i.pravatar.cc/80?img=12" />
      
        </div>

  }]

};

export default previews;