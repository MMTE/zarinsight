import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SparklesIcon, SendHorizontalIcon } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { PageHeader, SectionHeading } from '../components/analytics/PageHeader';
import { CoverageNotice, PrototypeNotice } from '../components/analytics/Notices';
import { LoadingState, InsufficientDataState } from '../components/analytics/States';
import { answers, findAnswer, suggestedQuestions } from '../data/assistant';
import type { AssistantAnswer } from '../data/assistant';
import { getInsight } from '../data/insights';
import { loadingSteps } from '../data/overview';

export function Ask() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const initial = params.get('q') ?? '';
  const [question, setQuestion] = useState(initial);
  const [answer, setAnswer] = useState<AssistantAnswer | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const q = params.get('q');
    if (!q) {
      setAnswer(null);
      setNotFound(false);
      return;
    }
    setQuestion(q);
    setLoading(true);
    setNotFound(false);
    const timer = window.setTimeout(() => {
      const result = findAnswer(q);
      setAnswer(result ?? null);
      setNotFound(!result);
      setLoading(false);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [params]);

  const ask = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setParams({ q: trimmed });
  };

  const insight = answer?.insightId ? getInsight(answer.insightId) : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title="جست‌وجوی تحلیلی"
        description="از داده‌های همین کسب‌وکار سؤال بپرسید. پاسخ‌ها از معیارها و یافته‌های ثابت ساخته می‌شوند، نه از متن آزاد." />
      

      <Card padding="md" elevation="low" className="border-plus-200 bg-plus-50">
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            ask(question);
          }}>
          
          <Input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="مثلاً: چرا فروشم کم شده؟"
            aria-label="پرسش از داده‌های کسب‌وکار"
            startIcon={<SparklesIcon className="h-4 w-4" />}
            inputSize="lg"
            fullWidth />
          
          <Button
            type="submit"
            size="lg"
            trailingIcon={<SendHorizontalIcon className="h-4 w-4 rtl:-scale-x-100" />}>
            
            بپرس
          </Button>
        </form>

        <ul className="mt-3 flex flex-wrap gap-2">
          {suggestedQuestions.map((item) =>
          <li key={item}>
              <button
              type="button"
              onClick={() => ask(item)}
              className="min-h-[32px] rounded-full border border-plus-200 bg-surface-light px-3 py-1 text-[12px] text-gray-900 transition-colors hover:bg-plus-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-plus-600">
              
                {item}
              </button>
            </li>
          )}
        </ul>
      </Card>

      {loading && <LoadingState steps={loadingSteps} done={2} />}

      {!loading && notFound &&
      <InsufficientDataState
        title="برای این سؤال پاسخ آماده‌ای نداریم."
        description="پرسش‌های پیشنهادی بالا را امتحان کنید یا خودتان در بخش بررسی داده‌ها جست‌وجو کنید."
        onAction={() => navigate('/explore')}
        actionLabel="رفتن به بررسی داده‌ها" />

      }

      {!loading && answer &&
      <div className="space-y-4">
          <Card padding="md" elevation="low" className="border-border-light">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
              variant={
              answer.state === 'ok' ? 'success' : answer.state === 'partial' ? 'warning' : 'danger'
              }
              size="sm"
              dot>
              
                {answer.state === 'ok' ?
              'نتیجه پیدا شد' :
              answer.state === 'partial' ?
              'پاسخ قطعی نیست' :
              'داده کافی نیست'}
              </Badge>
              <span className="text-[12px] text-gray-700">{answer.question}</span>
            </div>

            <p className="mt-3 text-[16px] font-bold leading-8 text-gray-950">{answer.headline}</p>
            <div className="mt-2 space-y-1.5">
              {answer.points.map((point) =>
            <p key={point} className="text-[13px] leading-7 text-gray-900">
                  {point}
                </p>
            )}
            </div>

            {answer.ranked &&
          <ol className="mt-4 space-y-2">
                {answer.ranked.map((item, index) =>
            <li
              key={item.label}
              className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2.5">
              
                    <span className="text-[13px] text-gray-900">
                      {index + 1}. {item.label}
                    </span>
                    <span className="text-[13px] font-bold text-gray-950">{item.value}</span>
                  </li>
            )}
              </ol>
          }

            <dl className="mt-4 grid gap-3 sm:grid-cols-3">
              {answer.numbers.map((item) =>
            <div key={item.label} className="rounded-lg border border-border-light px-3 py-2.5">
                  <dt className="text-[11px] text-gray-700">{item.label}</dt>
                  <dd className="mt-1 text-[14px] font-bold text-gray-950">{item.value}</dd>
                </div>
            )}
            </dl>

            {answer.coverage &&
          <div className="mt-4">
                <CoverageNotice>{answer.coverage}</CoverageNotice>
              </div>
          }

            <div className="mt-4 flex flex-wrap gap-2">
              {insight &&
            <>
                  <Button size="sm" onClick={() => navigate(`/insights/${insight.id}`)}>
                    مشاهده یافته
                  </Button>
                  <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/insights/${insight.id}#evidence`)}>
                
                    مشاهده شواهد
                  </Button>
                </>
            }
              {answer.reportTo &&
            <Button size="sm" variant="ghost" onClick={() => navigate(answer.reportTo!)}>
                  {answer.reportLabel}
                </Button>
            }
            </div>
          </Card>

          <Card padding="md" elevation="flat" className="border-border-light">
            <SectionHeading title="ادامه بررسی" />
            <ul className="flex flex-wrap gap-2">
              {answer.followUps.map((item) =>
            <li key={item}>
                  <button
                type="button"
                onClick={() => ask(item)}
                className="min-h-[34px] rounded-full border border-border-strong-light bg-surface-light px-3 py-1.5 text-[12px] text-gray-900 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600">
                
                    {item}
                  </button>
                </li>
            )}
            </ul>
          </Card>
        </div>
      }

      {!loading && !answer && !notFound &&
      <Card padding="md" elevation="flat" className="border-border-light">
          <SectionHeading title="نمونه پرسش‌هایی که می‌توانید بپرسید" />
          <ul className="space-y-2">
            {answers.map((item) =>
          <li key={item.id}>
                <button
              type="button"
              onClick={() => ask(item.question)}
              className="w-full rounded-lg bg-gray-50 px-3 py-2.5 text-start text-[13px] text-gray-900 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-pal-600">
              
                  {item.question}
                </button>
              </li>
          )}
          </ul>
        </Card>
      }

      <PrototypeNotice />
    </div>);

}