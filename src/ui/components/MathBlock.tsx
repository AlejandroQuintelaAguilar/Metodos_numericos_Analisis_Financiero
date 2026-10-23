/**
 * @file MathBlock.tsx
 * @description Componente React para renderizar fórmulas matemáticas en notación LaTeX mediante KaTeX.
 */

import React, { useMemo } from 'react';
import katex from 'katex';

interface MathBlockProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathBlock: React.FC<MathBlockProps> = ({
  math,
  block = false,
  className = ''
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false
      });
    } catch {
      return math;
    }
  }, [math, block]);

  if (block) {
    return (
      <div
        className={`overflow-x-auto py-2 my-1 text-center ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
