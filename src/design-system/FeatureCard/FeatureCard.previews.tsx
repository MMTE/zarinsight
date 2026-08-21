import { ShieldCheckIcon, CreditCardIcon, ZapIcon, ArrowLeftIcon } from 'lucide-react';
import { FeatureCard } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

const previews: ComponentPreviewModule = {
  componentName: 'FeatureCard',
  importPath: 'components/FeatureCard',
  previews: [
  {
    name: 'Default',
    description: 'Icon, heading, and description on a light surface.',
    render: () =>
    <div className="w-80">
          <FeatureCard
        icon={ShieldCheckIcon}
        title="Secure payments"
        description="Every transaction is protected end to end with bank-grade encryption and continuous fraud monitoring." />
      
        </div>

  },
  {
    name: 'Dark surface',
    description: 'Dark variant for use over deep navy marketing sections.',
    render: () =>
    <div className="w-80 rounded-2xl bg-slate-950 p-6">
          <FeatureCard
        variant="dark"
        icon={ZapIcon}
        title="Instant settlement"
        description="Funds land in your account within minutes, so cash flow never waits on a payout cycle." />
      
        </div>

  },
  {
    name: 'Centered with action',
    description: 'Centered alignment plus a link action, rendered as a clickable card.',
    render: () =>
    <div className="w-80">
          <FeatureCard
        align="center"
        icon={CreditCardIcon}
        href="#"
        title="Payment gateway"
        description="Accept cards and wallets on your site with a single integration."
        action={
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                Learn more
                <ArrowLeftIcon className="h-4 w-4" />
              </span>
        } />
      
        </div>

  },
  {
    name: 'Feature grid',
    description: 'Equal-height cards in a marketing grid.',
    render: () =>
    <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
        icon={ShieldCheckIcon}
        title="Trusted for 15 years"
        description="A payment partner relied on by hundreds of thousands of online businesses." />
      
          <FeatureCard
        icon={CreditCardIcon}
        title="Simple onboarding"
        description="Get verified and start collecting payments the same day you sign up." />
      
          <FeatureCard
        icon={ZapIcon}
        title="Developer friendly"
        description="Clear REST APIs, SDKs, and sandbox keys for a fast first integration." />
      
        </div>

  }]

};

export default previews;