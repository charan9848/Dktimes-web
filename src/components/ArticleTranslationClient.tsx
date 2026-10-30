'use client';

import { useState } from 'react';
import { Globe, Check, Loader2 } from 'lucide-react';

interface Props {
  title: string;
  summary: string;
  content: string;
}

export default function ArticleTranslationClient({ title, summary, content }: Props) {
  const [translated, setTranslated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transTitle, setTransTitle] = useState('');
  const [transSummary, setTransSummary] = useState('');

  const handleTranslate = async () => {
    if (translated) {
      setTranslated(false);
      return;
    }

    if (transTitle && transSummary) {
      setTranslated(true);
      return;
    }

    setLoading(true);
    try {
      // Use the Google Translate free proxy endpoint uncovered via REA
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(
        title
      )}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data[0]) {
        const text = data[0].map((item: any) => item[0]).join('');
        setTransTitle(text);
      }

      const sumUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(
        summary
      )}`;
      const sumRes = await fetch(sumUrl);
      const sumData = await sumRes.json();
      if (sumData && sumData[0]) {
        const sText = sumData[0].map((item: any) => item[0]).join('');
        setTransSummary(sText);
      }

      setTranslated(true);
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4">
      <button
        onClick={handleTranslate}
        disabled={loading}
        className="inline-flex items-center gap-1.5 bg-[#1C3D5A]/10 hover:bg-[#1C3D5A]/20 text-[#1C3D5A] text-xs font-bold px-3 py-1.5 rounded-lg transition"
      >
        {loading ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <Globe size={13} />
        )}
        {translated ? 'Show Original Language' : 'Translate to English (Google Translate)'}
      </button>

      {translated && (
        <div className="mt-4 p-4 bg-blue-50/70 border border-blue-200/60 rounded-xl space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
            Google Translated Preview
          </span>
          <h2 className="text-xl font-bold text-[#1C3D5A]">{transTitle || title}</h2>
          <p className="text-sm text-[#211D18]/80">{transSummary || summary}</p>
        </div>
      )}
    </div>
  );
}
