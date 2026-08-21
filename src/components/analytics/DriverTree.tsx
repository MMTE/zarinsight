import React from 'react';
import type { DriverNode } from '../../types/analytics';

function Node({ node, depth }: {node: DriverNode;depth: number;}) {
  return (
    <li className={depth > 0 ? 'border-s border-border-strong-light ps-3' : ''}>
      <div
        className={`rounded-lg px-3 py-2 ${
        depth === 0 ? 'bg-gray-950 text-gray-50' : depth === 1 ? 'bg-gray-100' : 'bg-gray-50'}`
        }>
        
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className={`text-[13px] font-bold ${depth === 0 ? 'text-gray-50' : 'text-gray-950'}`}>
            {node.label}
          </span>
          {node.value &&
          <span className={`text-[12px] ${depth === 0 ? 'text-gray-300' : 'text-gray-800'}`}>
              {node.value}
            </span>
          }
        </div>
        {node.relation &&
        <p className="mt-0.5 text-[11px] text-gray-600">{node.relation} این تغییر</p>
        }
      </div>
      {node.children && node.children.length > 0 &&
      <ul className="mt-2 space-y-2">
          {node.children.map((child) =>
        <Node key={child.label} node={child} depth={depth + 1} />
        )}
        </ul>
      }
    </li>);

}

export function DriverTree({ root }: {root: DriverNode;}) {
  return (
    <>
      <ul className="space-y-2">
        <Node node={root} depth={0} />
      </ul>
      <p className="mt-3 text-[11px] leading-6 text-gray-600">
        این نمودار رابطه آماری را نشان می‌دهد، نه علت قطعی.
      </p>
    </>);

}