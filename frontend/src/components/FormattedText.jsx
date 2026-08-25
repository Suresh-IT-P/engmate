import React from 'react';

/**
 * Palette of vibrant color styles for inline highlighted badges
 */
const COLOR_BADGES = [
  'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700',
  'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
  'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700',
  'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700',
  'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700',
  'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700'
];

/**
 * Enhanced FormattedText component that safely parses:
 * - Markdown Tables (| col | col |)
 * - Level 2, 3, 4, 5 Headers (##, ###, ####, #####)
 * - Numbered Lists (1., 01.)
 * - Blockquotes (>)
 * - Inline formatting (**bold**, *italics*, `code`)
 */
export default function FormattedText({ text, className = '', highlightVariant = 'badge' }) {
  if (!text || typeof text !== 'string') return null;

  const rawLines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      elements.push(<div key={`blank-${i}`} className="h-2" />);
      i++;
      continue;
    }

    // --- MARKDOWN TABLE PARSER ---
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableRows = [];
      let j = i;

      while (j < rawLines.length && rawLines[j].trim().startsWith('|') && rawLines[j].trim().endsWith('|')) {
        const rowStr = rawLines[j].trim();
        // Skip separator line (|---|---|)
        if (!rowStr.match(/^\|(?:\s*:?-+:?\s*\|)+$/)) {
          const cells = rowStr
            .split('|')
            .slice(1, -1)
            .map(c => c.trim());
          tableRows.push(cells);
        }
        j++;
      }

      if (tableRows.length > 0) {
        const headerRow = tableRows[0];
        const bodyRows = tableRows.slice(1);

        elements.push(
          <div key={`table-${i}`} className="my-4 overflow-x-auto rounded-2xl border border-surface-variant/70 shadow-sm">
            <table className="w-full min-w-[420px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-display">
                  {headerRow.map((cell, cIdx) => (
                    <th key={cIdx} className="px-3 sm:px-4 py-2.5 sm:py-3 font-bold border-b border-indigo-500/30 uppercase tracking-wider text-[11px]">
                      {renderInline(cell, 'header-white', i + cIdx)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant/40 bg-surface-container-lowest">
                {bodyRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className={rIdx % 2 === 0 ? 'bg-surface-container-lowest/50' : 'bg-surface-container/30 hover:bg-primary/5 transition-colors'}
                  >
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 sm:px-4 py-2.5 sm:py-3 font-medium text-on-surface">
                        {renderInline(cell, highlightVariant, i + rIdx + cIdx)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        i = j;
        continue;
      }
    }

    // --- LEVEL 5 HEADER (##### Title) ---
    if (trimmed.startsWith('##### ')) {
      elements.push(
        <div
          key={`h5-${i}`}
          className="mt-4 mb-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-amber-700/60 shadow-2xs flex items-center gap-2.5"
        >
          <span className="material-symbols-outlined text-[18px] text-amber-600 dark:text-amber-400">verified</span>
          <h6 className="text-xs font-black text-amber-950 dark:text-amber-200 font-display tracking-wide flex-1 min-w-0 uppercase">
            {renderInline(trimmed.replace(/^#####\s+/, ''), highlightVariant, i)}
          </h6>
        </div>
      );
      i++;
      continue;
    }

    // --- HORIZONTAL RULE (---) ---
    if (trimmed === '---') {
      elements.push(
        <hr key={`hr-${i}`} className="my-6 border-t-2 border-surface-variant/50 border-dashed" />
      );
      i++;
      continue;
    }

    // --- LEVEL 4 HEADER (#### Title) ---
    if (trimmed.startsWith('#### ')) {
      elements.push(
        <div
          key={`h4-${i}`}
          className="mt-5 mb-3 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-pink-500/15 border border-indigo-300 dark:border-indigo-700/60 shadow-xs flex items-center gap-3"
        >
          <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shrink-0 shadow-sm"></div>
          <h5 className="text-sm font-extrabold text-indigo-950 dark:text-indigo-200 font-display tracking-wide flex-1 min-w-0">
            {renderInline(trimmed.replace(/^####\s+/, ''), highlightVariant, i)}
          </h5>
        </div>
      );
      i++;
      continue;
    }

    // --- LEVEL 3 HEADER (### Title) ---
    if (trimmed.startsWith('### ')) {
      elements.push(
        <div
          key={`h3-${i}`}
          className="mt-6 mb-3 p-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md flex items-center justify-between gap-3"
        >
          <h4 className="text-base font-extrabold font-display flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[22px] text-amber-300">auto_awesome</span>
            {renderInline(trimmed.replace(/^###\s+/, ''), 'header-white', i)}
          </h4>
        </div>
      );
      i++;
      continue;
    }

    // --- LEVEL 2 HEADER (## Title) ---
    if (trimmed.startsWith('## ')) {
      elements.push(
        <div
          key={`h2-${i}`}
          className="mt-8 mb-4 p-4.5 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-lg flex items-center gap-3.5 min-w-0"
        >
          <span className="material-symbols-outlined text-[28px] text-yellow-300">menu_book</span>
          <h3 className="text-lg font-black font-display tracking-tight">
            {renderInline(trimmed.replace(/^##\s+/, ''), 'header-white', i)}
          </h3>
        </div>
      );
      i++;
      continue;
    }

    // --- Q&A STANDARD FORMATTING ---
    // Matches **Q:** or **Question:**
    if (trimmed.match(/^\*\*(Q|Question):\*\*/i)) {
      const qText = trimmed.replace(/^\*\*(Q|Question):\*\*\s*/i, '');
      elements.push(
        <div key={`qa-q-${i}`} className="mt-5 p-4 rounded-t-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3 shadow-xs">
          <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-xl mt-0.5">help_outline</span>
          <div className="flex-1 min-w-0 text-on-surface font-bold text-[13px] leading-relaxed">
            {renderInline(qText, highlightVariant, i)}
          </div>
        </div>
      );
      i++;
      continue;
    }

    // Matches **O:** or **Option:** or **Options:**
    if (trimmed.match(/^\*\*(O|Option|Options):\*\*/i)) {
      const oText = trimmed.replace(/^\*\*(O|Option|Options):\*\*\s*/i, '');
      elements.push(
        <div key={`qa-o-${i}`} className="p-3.5 bg-amber-500/5 border-x border-amber-500/20 flex items-start gap-3">
          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg mt-0.5">list_alt</span>
          <div className="flex-1 min-w-0 text-on-surface text-xs font-medium leading-relaxed">
            {renderInline(oText, highlightVariant, i)}
          </div>
        </div>
      );
      i++;
      continue;
    }

    // Matches **A:** or **Answer:**
    if (trimmed.match(/^\*\*(A|Answer):\*\*/i)) {
      const aText = trimmed.replace(/^\*\*(A|Answer):\*\*\s*/i, '');
      elements.push(
        <div key={`qa-a-${i}`} className="mb-5 p-4 rounded-b-2xl bg-emerald-500/10 border border-emerald-500/20 border-t-0 flex items-start gap-3 shadow-xs">
          <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-xl mt-0.5">check_circle</span>
          <div className="flex-1 min-w-0 text-on-surface text-[13px] leading-relaxed">
            {renderInline(aText, highlightVariant, i)}
          </div>
        </div>
      );
      i++;
      continue;
    }

    // --- BLOCKQUOTE (>) ---
    if (trimmed.startsWith('> ')) {
      elements.push(
        <div
          key={`quote-${i}`}
          className="my-2 p-3.5 rounded-2xl bg-primary-fixed/30 border-l-4 border-primary text-xs font-medium text-on-surface leading-relaxed shadow-2xs"
        >
          {renderInline(trimmed.replace(/^>\s+/, ''), highlightVariant, i)}
        </div>
      );
      i++;
      continue;
    }

    // --- NUMBERED LIST ITEM (1. or 01.) ---
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      const numStr = numMatch[1];
      const itemContent = numMatch[2];
      elements.push(
        <div
          key={`num-${i}`}
          className="my-1.5 p-3 rounded-2xl bg-surface-container/60 border border-surface-variant/40 hover:border-primary/40 transition-all flex items-start gap-3"
        >
          <span className="w-6 h-6 rounded-full bg-primary text-white font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow-xs">
            {numStr}
          </span>
          <div className="flex-1 min-w-0 text-sm font-medium text-on-surface leading-relaxed">
            {renderInline(itemContent, highlightVariant, i)}
          </div>
        </div>
      );
      i++;
      continue;
    }

    // --- BULLET LIST ITEM (? or - or * ) ---
    const isBullet = trimmed.startsWith('?') || trimmed.startsWith('- ') || trimmed.startsWith('* ');
    
    // --- ROMAN/LETTER LIST ITEM ((i), (a), a), i)) ---
    const listMatch = trimmed.match(/^(\([a-zivx]+\)|[a-zivx]+\))\s+(.*)/i);
    
    // --- STEP ITEM (Step 1:, 1:, etc) ---
    const stepMatch = trimmed.match(/^(Step\s+\d+|[A-Za-z]+|\d+)\s*:\s*(.*)/i);

    if (listMatch) {
      elements.push(
        <div key={`sublist-${i}`} className="my-1.5 pl-6 pr-3 py-2 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 flex items-start gap-3">
          <span className="font-bold text-indigo-500 text-sm mt-0.5">{listMatch[1]}</span>
          <div className="flex-1 min-w-0 text-[13.5px] font-medium text-on-surface/90 leading-relaxed">
            {renderInline(listMatch[2], highlightVariant, i)}
          </div>
        </div>
      );
      i++;
      continue;
    }

    if (stepMatch && stepMatch[1].length < 15 && stepMatch[2].length > 0) {
      elements.push(
        <div key={`step-${i}`} className="my-2 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 border-l-4 border-emerald-400 flex flex-col md:flex-row md:items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-800/50 text-emerald-700 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider shrink-0 shadow-xs">
            {stepMatch[1]}
          </span>
          <div className="flex-1 min-w-0 text-[13.5px] font-medium text-on-surface/90 leading-relaxed">
            {renderInline(stepMatch[2], highlightVariant, i)}
          </div>
        </div>
      );
      i++;
      continue;
    }

    // --- TABULAR ROW ITEM (\t) ---
    if (trimmed.includes('\t')) {
      const columns = trimmed.split('\t').filter(c => c.trim() !== '');
      if (columns.length > 1) {
        elements.push(
          <div key={`tabrow-${i}`} className="my-1.5 p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex flex-wrap md:flex-nowrap items-center gap-3 shadow-xs">
            {columns.map((col, cIdx) => (
              <div key={cIdx} className="flex-1 text-[13.5px] font-semibold text-slate-800 dark:text-slate-200 leading-relaxed min-w-[120px]">
                {renderInline(col.trim(), highlightVariant, i + cIdx)}
              </div>
            ))}
          </div>
        );
        i++;
        continue;
      }
    }

    const cleanLine = isBullet ? trimmed.replace(/^[?\-\*]\s*/, '') : line;

    elements.push(
      <div key={`line-${i}`} className={`leading-relaxed my-1 ${isBullet ? 'flex items-start gap-3 pl-2 py-1.5 bg-slate-50/30 dark:bg-slate-800/20 rounded-lg' : 'px-1'}`}>
        {isBullet && (
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500 mt-2 shrink-0 shadow-xs ring-2 ring-indigo-100 dark:ring-indigo-900"></span>
        )}
        <span className={`flex-1 min-w-0 ${!isBullet ? 'text-[14px] text-slate-700 dark:text-slate-300 font-medium' : 'text-[13.5px] text-on-surface/90'}`}>
          {renderInline(cleanLine, highlightVariant, i)}
        </span>
      </div>
    );

    i++;
  }

  return <div className={`space-y-1.5 ${className}`}>{elements}</div>;
}

/**
 * Parses inline formatting: **highlight/bold**, *italic*, `code`
 */
export function renderInline(str, highlightVariant = 'badge', lineIndex = 0) {
  if (!str) return '';

  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let colorCounter = 0;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(cleanRawAsterisks(str.substring(lastIndex, match.index)));
    }

    const token = match[0];

    if (token.startsWith('**') && token.endsWith('**')) {
      const innerText = token.slice(2, -2).trim();

      if (highlightVariant === 'header-white') {
        parts.push(
          <span
            key={match.index}
            className="inline-block font-black bg-amber-300 text-slate-950 px-2 py-0.5 mx-1 rounded-lg text-[0.9em] shadow-sm"
          >
            {innerText}
          </span>
        );
      } else if (highlightVariant === 'badge') {
        const colorStyle = COLOR_BADGES[(colorCounter + lineIndex) % COLOR_BADGES.length];
        colorCounter++;
        parts.push(
          <span
            key={match.index}
            className={`inline-block font-extrabold border px-2.5 py-0.5 mx-0.5 rounded-lg text-[0.92em] shadow-xs ${colorStyle}`}
          >
            {innerText}
          </span>
        );
      } else {
        parts.push(
          <strong key={match.index} className="font-extrabold text-indigo-600 dark:text-indigo-400">
            {innerText}
          </strong>
        );
      }
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={match.index}
          className="font-mono text-xs bg-indigo-950 text-amber-300 dark:bg-indigo-950 dark:text-amber-200 px-2.5 py-0.5 rounded-lg border border-indigo-800 shadow-inner font-semibold"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic text-indigo-700 dark:text-indigo-300 font-semibold">
          {token.slice(1, -1)}
        </em>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < str.length) {
    parts.push(cleanRawAsterisks(str.substring(lastIndex)));
  }

  return parts;
}

function cleanRawAsterisks(text) {
  if (!text) return '';
  return text.replace(/\*\*/g, '').replace(/(?<!\w)\*(?!\w)/g, '');
}
