import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PageHeader } from '../components/analytics/PageHeader';
import { primaryNav, secondaryNav } from '../data/navigation';
import { business } from '../data/overview';
import { useAnalysis } from '../contexts/AnalysisContext';
import { LightbulbIcon, BellIcon } from 'lucide-react';
const extraNav = [
{ to: '/notifications', label: 'تغییرات مهم', icon: BellIcon }];

export function More() {
  const { datasetId, setDatasetId } = useAnalysis();
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [merchantKey, setMerchantKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [datasets, setDatasets] = useState<Array<{ id: string; provider: string }>>([]);

  useEffect(() => {
    fetch('/api/datasets').then((r) => r.json())
      .then((d) => setDatasets(d.datasets ?? [])).catch(() => {});
  }, [busy]);

  async function connect() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch('/api/datasets/connect', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ apiKey, merchantKey }),
      });
      const body = await res.json();
      if (!res.ok) {
        setMessage(body?.error?.fa ?? 'اتصال ناموفق بود');
        return;
      }
      setDatasetId(body.datasetId);
      setMessage(`مجموعه‌دادهٔ ${body.datasetId} ساخته شد (${body.counts.sessions.toLocaleString('fa-IR')} جلسه). کلید شما ذخیره نمی‌شود.`);
    } catch {
      setMessage('خطای شبکه هنگام اتصال');
    } finally {
      setBusy(false);
      setApiKey('');
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader title="بیش‌تر" description={`${business.name} — ${business.meta}`} />

      <Card padding="lg" elevation="low">
        <h2 className="text-[14px] font-bold text-gray-950">اتصال حساب زرین‌پال شما</h2>
        <p className="mt-1 text-[12px] leading-6 text-gray-700">
          با کلید API پذیرنده، تراکنش‌های کسب‌وکار خودتان را همسان‌سازی کنید و تحلیل‌ها را روی دادهٔ واقعی خودتان ببینید.
          کلید فقط برای همین همسان‌سازی استفاده و ذخیره نمی‌شود (ADR-0010).
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Input value={merchantKey} onChange={(e) => setMerchantKey(e.target.value)}
            placeholder="شناسه پذیرنده (مثلاً MYMERCHANT)" aria-label="شناسه پذیرنده" />
          <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)}
            type="password" placeholder="کلید API زرین‌پال" aria-label="کلید API" />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button size="sm" disabled={busy || !apiKey || !merchantKey} onClick={() => void connect()}>
            {busy ? 'در حال همسان‌سازی…' : 'همسان‌سازی و افزودن مجموعه‌داده'}
          </Button>
          {message && <span className="text-[12px] leading-6 text-gray-800">{message}</span>}
        </div>
        {datasets.length > 1 && (
          <div className="mt-4 border-t border-border-light pt-3">
            <p className="text-[12px] font-bold text-gray-950">مجموعه‌داده‌های موجود</p>
            <ul className="mt-1 flex flex-wrap gap-2">
              {datasets.map((d) => (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => { setDatasetId(d.id); navigate('/'); }}
                    className={`rounded-full border px-3 py-1.5 text-[12px] ${
                      d.id === datasetId
                        ? 'border-pal-500 bg-pal-50 text-pal-700'
                        : 'border-border-light bg-white text-gray-700 hover:border-pal-400'}`}>
                    {d.id} · {d.provider}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <Card padding="none" elevation="flat" className="border-border-light">
        <ul className="divide-y divide-border-light">
          {[...primaryNav.slice(1), ...secondaryNav, ...extraNav].map((item) =>
          <li key={item.to}>
              <Link
              to={item.to}
              className="flex min-h-[52px] items-center justify-between gap-3 px-4 py-3 text-[14px] text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pal-600">
              
                <span className="flex items-center gap-2.5">
                  <item.icon className="h-[18px] w-[18px] text-gray-700" aria-hidden="true" />
                  {item.label}
                </span>
                <ChevronLeftIcon className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
              </Link>
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
}
