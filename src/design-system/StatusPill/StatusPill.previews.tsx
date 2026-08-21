import { StatusPill } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const previews: ComponentPreviewModule = {
  componentName: 'StatusPill',
  importPath: 'components/StatusPill',
  previews: [
  {
    name: 'Success',
    description: 'Successful payment',
    render: () => <StatusPill status="success" />
  },
  {
    name: 'All statuses',
    description: 'Every payment state',
    render: () =>
    <div dir="rtl" className="flex flex-wrap items-center gap-2">
          <StatusPill status="success" />
          <StatusPill status="pending" />
          <StatusPill status="failed" />
          <StatusPill status="refunded" />
          <StatusPill status="inProgress" />
        </div>

  },
  {
    name: 'Small, dot only',
    description: 'Compact variant for dense transaction tables',
    render: () =>
    <div dir="rtl" className="flex flex-wrap items-center gap-2">
          <StatusPill status="success" size="sm" hideIcon />
          <StatusPill status="pending" size="sm" hideIcon />
          <StatusPill status="failed" size="sm" hideIcon />
        </div>

  },
  {
    name: 'In a table',
    description: 'Usage inside a transaction list',
    render: () =>
    <table dir="rtl" className="w-full max-w-md text-right text-sm">
          <thead>
            <tr className="text-slate-500">
              <th className="px-3 py-2 font-medium">شناسه</th>
              <th className="px-3 py-2 font-medium">مبلغ</th>
              <th className="px-3 py-2 font-medium">وضعیت</th>
            </tr>
          </thead>
          <tbody className="text-slate-800">
            <tr className="border-t border-slate-200">
              <td className="px-3 py-2">۱۰۲۴۵</td>
              <td className="px-3 py-2">۲۵۰,۰۰۰ ریال</td>
              <td className="px-3 py-2">
                <StatusPill status="success" size="sm" />
              </td>
            </tr>
            <tr className="border-t border-slate-200">
              <td className="px-3 py-2">۱۰۲۴۶</td>
              <td className="px-3 py-2">۹۸۰,۰۰۰ ریال</td>
              <td className="px-3 py-2">
                <StatusPill status="failed" size="sm" />
              </td>
            </tr>
            <tr className="border-t border-slate-200">
              <td className="px-3 py-2">۱۰۲۴۷</td>
              <td className="px-3 py-2">۱۲۰,۰۰۰ ریال</td>
              <td className="px-3 py-2">
                <StatusPill status="refunded" size="sm" />
              </td>
            </tr>
          </tbody>
        </table>

  }]

};

export default previews;