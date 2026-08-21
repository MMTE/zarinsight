import { BellIcon, InfoIcon, SettingsIcon } from 'lucide-react';
import { Tooltip } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const iconButtonClass =
'inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2';

const previews: ComponentPreviewModule = {
  componentName: 'Tooltip',
  importPath: 'components/Tooltip',
  previews: [
  {
    name: 'Default',
    description: 'Hint on an icon-only button, shown above the trigger.',
    render: () =>
    <div className="flex w-full items-center justify-center py-8">
          <Tooltip content="Notifications">
            <button type="button" className={iconButtonClass} aria-label="Notifications">
              <BellIcon className="h-5 w-5" />
            </button>
          </Tooltip>
        </div>

  },
  {
    name: 'Placements',
    description: 'Tooltip can be anchored to any side of the trigger.',
    render: () =>
    <div className="flex w-full items-center justify-center gap-4 py-10">
          {(['top', 'bottom', 'left', 'right'] as const).map((placement) =>
      <Tooltip key={placement} content={`Placed ${placement}`} placement={placement}>
              <button
          type="button"
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
          
                {placement}
              </button>
            </Tooltip>
      )}
        </div>

  },
  {
    name: 'Truncated label',
    description: 'Reveals the full text of a truncated label on hover or focus.',
    render: () =>
    <div className="flex w-full items-center justify-center py-8">
          <Tooltip content="درگاه پرداخت اینترنتی زرین‌پال" placement="bottom">
            <span
          tabIndex={0}
          className="block max-w-[180px] truncate rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
          
              درگاه پرداخت اینترنتی زرین‌پال
            </span>
          </Tooltip>
        </div>

  },
  {
    name: 'Disabled',
    description: 'No tooltip is rendered when disabled.',
    render: () =>
    <div className="flex w-full items-center justify-center gap-4 py-8">
          <Tooltip content="This will not show" disabled>
            <button type="button" className={iconButtonClass} aria-label="Settings">
              <SettingsIcon className="h-5 w-5" />
            </button>
          </Tooltip>
          <Tooltip content="Instant hint" delay={0}>
            <button type="button" className={iconButtonClass} aria-label="More info">
              <InfoIcon className="h-5 w-5" />
            </button>
          </Tooltip>
        </div>

  }]

};

export default previews;