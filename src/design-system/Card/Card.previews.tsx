import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle } from
'./index';
import type { ComponentPreviewModule } from '../previewTypes';

const previews: ComponentPreviewModule = {
  componentName: 'Card',
  importPath: 'components/Card',
  previews: [
  {
    name: 'Default',
    description: 'Base white surface with hairline border and minimal shadow.',
    render: () =>
    <Card className="max-w-sm">
          <CardTitle>Total transactions</CardTitle>
          <CardDescription>Last 30 days across all gateways.</CardDescription>
          <CardContent>
            <span className="text-3xl font-semibold text-gray-900">۱۲٬۴۸۰</span>
          </CardContent>
        </Card>

  },
  {
    name: 'With header and footer',
    description: 'Dashboard panel composition using header, content, and footer slots.',
    render: () =>
    <Card className="max-w-md">
          <CardHeader>
            <div>
              <CardTitle>Settlement summary</CardTitle>
              <CardDescription>Pending payouts for this week.</CardDescription>
            </div>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              Active
            </span>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-gray-500">Scheduled</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">۴۲۰٬۰۰۰ T</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Completed</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">۳۱۰٬۰۰۰ T</dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter>
            <button
          type="button"
          className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
          
              Details
            </button>
            <button
          type="button"
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
          
              Settle now
            </button>
          </CardFooter>
        </Card>

  },
  {
    name: 'Padding and elevation',
    description: 'Compact flat card next to a roomier elevated card.',
    render: () =>
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
          <Card padding="sm" elevation="flat">
            <CardTitle as="h4">Compact / flat</CardTitle>
            <CardDescription>padding="sm" with no shadow.</CardDescription>
          </Card>
          <Card padding="lg" elevation="medium">
            <CardTitle as="h4">Roomy / medium</CardTitle>
            <CardDescription>padding="lg" with a deeper shadow.</CardDescription>
          </Card>
        </div>

  },
  {
    name: 'Interactive',
    description: 'Clickable panel with hover and keyboard focus affordances.',
    render: () =>
    <Card interactive tabIndex={0} role="button" className="max-w-sm cursor-pointer">
          <CardTitle>Payment gateway</CardTitle>
          <CardDescription>Open configuration for your store gateway.</CardDescription>
        </Card>

  }]

};

export default previews;