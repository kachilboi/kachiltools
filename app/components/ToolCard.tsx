import React from 'react';
import Link from 'next/link';

interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  href: string;
  category: string;
  iconComponent: React.ElementType;
  isPopular?: boolean;
}

export default function ToolCard({
  title,
  description,
  href,
  category,
  iconComponent: IconComp,
  isPopular,
}: ToolCardProps) {
  return (
    <article className="group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-950/5 transition-all duration-200">
      <div>
        {/* Top: Icon & Category */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
            <IconComp className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            {isPopular && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 rounded border border-amber-200 dark:border-amber-800">
                Popular
              </span>
            )}
            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
              {category}
            </span>
          </div>
        </div>

        {/* Middle: Title & Description */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1.5">
          {title}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          {description}
        </p>
      </div>

      {/* Bottom: Action Link */}
      <Link
        href={href}
        className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-600 text-slate-700 dark:text-slate-200 hover:text-white font-semibold text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-600 transition-all text-center flex items-center justify-center gap-1.5 group/btn"
      >
        <span>Open tool</span>
        <span className="group-hover/btn:translate-x-1 transition-transform duration-200" aria-hidden="true">
          &rarr;
        </span>
      </Link>
    </article>
  );
}