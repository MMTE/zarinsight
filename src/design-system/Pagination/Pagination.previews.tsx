import React, { useState } from 'react';
import { Pagination } from './index';
import type { ComponentPreviewModule } from '../previewTypes';

function InteractiveRtl() {
  const [page, setPage] = useState(4);
  return <Pagination page={page} totalPages={12} onPageChange={setPage} />;
}

function InteractiveLtr() {
  const [page, setPage] = useState(1);
  return <Pagination dir="ltr" page={page} totalPages={8} onPageChange={setPage} />;
}

const previews: ComponentPreviewModule = {
  componentName: 'Pagination',
  importPath: 'components/Pagination',
  previews: [
  {
    name: 'RTL (default)',
    description: 'Persian digits with mirrored prev/next arrows.',
    render: () =>
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <InteractiveRtl />
        </div>

  },
  {
    name: 'LTR',
    description: 'Left-to-right direction with English labels.',
    render: () =>
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <InteractiveLtr />
        </div>

  },
  {
    name: 'Compact',
    description: 'Small size for dense table footers.',
    render: () =>
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Pagination size="sm" page={7} totalPages={20} onPageChange={() => {}} />
        </div>

  },
  {
    name: 'Few pages & disabled',
    description: 'No ellipsis when pages fit, plus a fully disabled state.',
    render: () =>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        width: '100%'
      }}>
      
          <Pagination page={1} totalPages={3} onPageChange={() => {}} />
          <Pagination disabled page={2} totalPages={5} onPageChange={() => {}} />
        </div>

  }]

};

export default previews;