import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon, SendHorizontalIcon } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';

interface AskBoxProps {
  suggestions: string[];
  title?: string;
  description?: string;
}

export function AskBox({
  suggestions,
  title = 'از داده‌های کسب‌وکارتان بپرسید',
  description = 'پاسخ‌ها از همان معیارها و یافته‌های این محصول ساخته می‌شوند، نه از متن آزاد.'
}: AskBoxProps) {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');

  const submit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    navigate(`/ask?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <Card padding="md" elevation="flat" className="border-plus-200 bg-plus-50">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-plus-100 text-plus-700">
          <SparklesIcon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[15px] font-bold text-gray-950">{title}</h2>
          <p className="mt-1 text-[12px] leading-6 text-gray-800">{description}</p>

          <form
            className="mt-3 flex flex-col gap-2 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              submit(question);
            }}>
            
            <Input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="مثلاً: چرا فروشم کم شده؟"
              aria-label="پرسش از داده‌های کسب‌وکار"
              inputSize="md"
              fullWidth />
            
            <Button
              type="submit"
              size="md"
              trailingIcon={<SendHorizontalIcon className="h-4 w-4 rtl:-scale-x-100" />}>
              
              بپرس
            </Button>
          </form>

          <ul className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((item) =>
            <li key={item}>
                <button
                type="button"
                onClick={() => submit(item)}
                className="min-h-[32px] rounded-full border border-plus-200 bg-surface-light px-3 py-1 text-[12px] text-gray-900 transition-colors hover:bg-plus-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-plus-600">
                
                  {item}
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </Card>);

}