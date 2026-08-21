import { WalletIcon, CreditCardIcon } from 'lucide-react';
import { StatCard } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const previews: ComponentPreviewModule = {
  componentName: 'StatCard',
  importPath: 'components/StatCard',
  previews: [
  {
    name: 'Default',
    description: 'Amount with currency chip',
    render: () =>
    <div style={{ maxWidth: 320 }}>
          <StatCard label="موجودی کیف پول" amount={12450000} />
        </div>

  },
  {
    name: 'Positive trend',
    description: 'With icon and upward trend',
    render: () =>
    <div style={{ maxWidth: 320 }}>
          <StatCard
        label="درآمد امروز"
        amount={3820500}
        icon={<WalletIcon className="h-5 w-5" />}
        trend={{ direction: 'up', value: 12.4, caption: 'نسبت به دیروز' }} />
      
        </div>

  },
  {
    name: 'Negative trend',
    description: 'Downward trend state',
    render: () =>
    <div style={{ maxWidth: 320 }}>
          <StatCard
        label="تراکنش‌های ناموفق"
        amount={186000}
        icon={<CreditCardIcon className="h-5 w-5" />}
        trend={{ direction: 'down', value: 4.8, caption: 'نسبت به هفته گذشته' }} />
      
        </div>

  },
  {
    name: 'Loading',
    description: 'Skeleton while the value loads',
    render: () =>
    <div style={{ maxWidth: 320 }}>
          <StatCard label="تسویه در انتظار" amount={0} loading />
        </div>

  }]

};

export default previews;