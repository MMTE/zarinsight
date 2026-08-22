import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SparklesIcon, SendHorizontalIcon } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { PageHeader, SectionHeading } from '../components/analytics/PageHeader';
import { CoverageNotice, PrototypeNotice } from '../components/analytics/Notices';
import { LoadingState, InsufficientDataState } from '../components/analytics/States';
import { answers, findAnswer, suggestedQuestions } from '../data/assistant';
import type { AssistantAnswer } from '../data/assistant';
import { loadingSteps } from '../data/overview';
import { api, faIrr } from '../lib/api';


interface Turn {
  role: 'user' | 'assistant';
  text: string;
}

/** Live analyst agent «تحلیلگر بینش» via the eve child (ADR-0011).
 *  Health-gated: without the agent (or a model key) the deterministic FAQ
 *  fallback from the evidence payload answers instead (spec §4.12). */
export function Ask() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initial = params.get('q') ?? '';
  const [question, setQuestion] = useState(initial);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [agentUp, setAgentUp] = useState<boolean | null>(null);
  const [fallback, setFallback] = useState<AssistantAnswer | null>(null);
  const [notFound, setNotFound] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/eve/v1/health').then((r) => setAgentUp(r.ok)).catch(() => setAgentUp(false));
  }, []);

  useEffect(() => {
    if (initial) void ask(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [turns, fallback]);

  async function ask(q: string) {
    const trimmed = q.trim();
    if (!trimmed || busy) return;
    setQuestion('');
    setBusy(true);
    setFallback(null);
    setNotFound(false);
    setTurns((t) => [...t, { role: 'user', text: trimmed }]);
    try {
      const start = await fetch('/eve/v1/session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!start.ok) throw new Error('agent-unavailable');
      const { sessionId } = (await start.json()) as { sessionId?: string };
      if (!sessionId) throw new Error('no-session');
      const stream = await fetch(`/eve/v1/session/${encodeURIComponent(sessionId)}/stream?startIndex=0`);
      if (!stream.ok || !stream.body) throw new Error('no-stream');
      const reply = await readReply(stream.body, trimmed);
      setTurns((t) => [...t, { role: 'assistant', text: reply }]);
    } catch {
      // deterministic FAQ fallback (ADR-0011 §5) — same payload, no LLM
      const result = await faqFallback(trimmed);
      if (result) {
        setFallback(result.answer);
        setTurns((t) => [...t, { role: 'assistant', text: result.text }]);
      } else {
        setNotFound(true);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="پرسش و پاسخ"
        description="از تحلیلگر بینش بپرسید؛ هر عدد از موتور تحلیل می‌آید، نه از حافظهٔ مدل." />
      <CoverageNote agentUp={agentUp} />
      <Card padding="md" elevation="low">
        <div ref={listRef} className="max-h-[420px] space-y-3 overflow-y-auto">
          {turns.length === 0 && !fallback && (
            <p className="text-[13px] leading-7 text-gray-700">
              یک سؤال بنویسید یا از پیشنهادها شروع کنید. مثلاً: «چرا نرخ موفقیت ژوئن افت کرد؟»
            </p>
          )}
          {turns.map((t, i) =>
            t.role === 'user' ? (
              <div key={i} dir="rtl"
                className="ml-8 rounded-xl bg-pal-600 px-3.5 py-2.5 text-[13px] leading-7 text-white">
                {t.text}
              </div>
            ) : (
              // Markdown so agent citations (docs deep links, /insights/:id)
              // are clickable — ADR-0013.
              <div key={i} dir="rtl"
                className="mr-8 rounded-xl bg-gray-50 px-3.5 py-2.5 text-[13px] leading-7 text-gray-900
                  [&_a]:break-all [&_a]:text-pal-600 [&_a]:underline
                  [&_ul]:list-disc [&_ul]:pr-5 [&_ol]:list-decimal [&_ol]:pr-5
                  [&_li]:mb-0.5 [&_p]:mb-1.5 [&_p:last-child]:mb-0
                  [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:text-[12px]
                  [&_strong]:font-semibold">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{t.text}</ReactMarkdown>
              </div>
            ),
          )}
          {busy && <LoadingState steps={loadingSteps} />}
          {notFound && (
            <InsufficientDataState
              title="پاسخی برای این پرسش ندارم"
              description="پرسش را به یکی از بینش‌های موجود نزدیک کنید یا از صفحهٔ بینش‌ها شروع کنید."
              actionLabel="رفتن به بینش‌ها" onAction={() => navigate('/insights')} />
          )}
        </div>
        <form
          className="mt-4 flex items-center gap-2"
          onSubmit={(e) => { e.preventDefault(); void ask(question); }}>
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="سؤال خود را بنویسید…"
            aria-label="سؤال" />
          <Button type="submit" disabled={busy || !question.trim()}
            trailingIcon={<SendHorizontalIcon className="h-4 w-4" />}>
            بپرس
          </Button>
        </form>
      </Card>

      <section aria-label="پرسش‌های پیشنهادی">
        <SectionHeading title="پرسش‌های پیشنهادی" />
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((s) => (
            <button key={s} type="button"
              onClick={() => void ask(s)}
              className="rounded-full border border-border-light bg-white px-3 py-1.5 text-[12px] text-gray-700 transition-colors hover:border-pal-400 hover:text-pal-700">
              {s}
            </button>
          ))}
        </div>
      </section>
      {fallback && <FallbackCard answer={fallback} />}
    </div>
  );
}

async function readReply(body: ReadableStream<Uint8Array>, question: string): Promise<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let raw = '';
  while (raw.length < 5_000_000) {
    const { done, value } = await reader.read();
    if (done) break;
    raw += decoder.decode(value, { stream: true });
    // Fast-path model failures; for turn completion, wait until the event's
    // LINE is fully received — breaking on the bare substring can cut the
    // final deltas/message line mid-transit and truncate the reply.
    if (raw.includes('MODEL_CALL_FAILED')) break;
    const lastNewline = raw.lastIndexOf('\n');
    if (raw.slice(0, lastNewline).includes('"type":"turn.completed"')) break;
  }
  // NDJSON; skip a malformed/truncated tail line instead of failing the turn.
  const events = raw.split('\n').filter((l) => l.startsWith('{'))
    .flatMap((l) => {
      try { return [JSON.parse(l) as EveEvent]; } catch { return []; }
    });
  // eve 0.44 protocol: the full assistant message arrives as a string on
  // message.completed; message.appended carries per-step messageDelta chunks.
  let reply = '';
  for (const ev of events) {
    if (ev.type === 'error' || ev.data?.code === 'MODEL_CALL_FAILED') {
      throw new Error('model-unconfigured');
    }
    if (ev.type === 'message.completed' && typeof ev.data?.message === 'string') {
      reply = ev.data.message;
    }
  }
  if (!reply) {
    for (const ev of events) {
      if (ev.type === 'message.appended' && typeof ev.data?.messageDelta === 'string') {
        reply += ev.data.messageDelta;
      }
    }
  }
  if (!reply.trim() || reply.trim() === question.trim()) throw new Error('empty-reply');
  return reply;
}

interface EveEvent {
  type?: string;
  data?: { code?: string; message?: string; messageDelta?: string };
}

/** Deterministic FAQ from live insight payloads (spec §4.12 fallback). */
async function faqFallback(q: string): Promise<{ text: string; answer: AssistantAnswer } | null> {
  const local = findAnswer(q);
  if (local) return { text: local.headline, answer: local };
  try {
    const rows = await api.insights(undefined, 5);
    const top = rows[0];
    if (!top) return null;
    const text = `${top.title} — ${top.summary}`;
    return {
      text,
      answer: {
        id: top.id,
        question: q,
        state: 'ok',
        headline: top.title,
        points: [top.summary],
        numbers: top.impact?.amountIrr
          ? [{ label: 'برآورد اثر ماهانه', value: faIrr(top.impact.amountIrr) }]
          : [],
        followUps: suggestedQuestions.slice(0, 3),
      },
    };
  } catch {
    return null;
  }
}

function CoverageNote({ agentUp }: { agentUp: boolean | null }) {
  if (agentUp === null) return null;
  return (
    <CoverageNotice>
      {agentUp
        ? 'تحلیلگر بینش متصل است؛ پاسخ‌ها فقط با ابزارهای خواندنی روی موتور تحلیل ساخته می‌شوند.'
        : 'عامل تحلیلگر در دسترس نیست؛ با پاسخ‌های قطعی از محتوای بینش‌ها خدمت می‌کنیم (بدون مدل زبانی).'}
    </CoverageNotice>
  );
}

function FallbackCard({ answer }: { answer: AssistantAnswer }) {
  const navigate = useNavigate();
  return (
    <Card padding="md" elevation="flat">
      <SectionHeading title="پاسخ قطعی (بدون مدل زبانی)" />
      <p className="mt-2 text-[13px] font-bold leading-7 text-gray-950">{answer.headline}</p>
      {answer.points.map((p) => (
        <p key={p} className="mt-1 text-[13px] leading-7 text-gray-800">{p}</p>
      ))}
      {answer.numbers.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {answer.numbers.map((n) => (
            <li key={n.label}>
              <Badge variant="neutral" size="sm">{n.label}: {n.value}</Badge>
            </li>
          ))}
        </ul>
      )}
      {answer.id && (
        <Button size="sm" variant="outline" className="mt-3"
          onClick={() => navigate(`/insights/${encodeURIComponent(answer.id)}`)}>
          مشاهدهٔ بینش و محاسبه
        </Button>
      )}
    </Card>
  );
}

void answers; void useMemo;
