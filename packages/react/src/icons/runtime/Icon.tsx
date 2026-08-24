import { forwardRef } from 'react';
import type { IconRuntimeProps } from './types';

export const Icon = forwardRef<SVGSVGElement, IconRuntimeProps>(function Icon(
  { definition, idPrefix, decorative = true, label, width, height, ...props },
  ref,
) {
  if (!decorative && (!label || !label.trim())) {
    throw new Error('Informative Cometal icons require a non-empty product-owned label.');
  }
  if (definition.hasReferencedIds && !idPrefix) {
    throw new Error(`Icon ${definition.canonicalName} requires an instance-scoped ID prefix.`);
  }
  const body = idPrefix ? definition.body.replaceAll('__COMETAL_ID__', idPrefix) : definition.body;
  const [minX, minY, viewBoxWidth, viewBoxHeight] = definition.viewBox;
  return (
    <svg
      {...props}
      ref={ref}
      width={width ?? definition.intrinsicWidth ?? viewBoxWidth}
      height={height ?? definition.intrinsicHeight ?? viewBoxHeight}
      viewBox={`${minX} ${minY} ${viewBoxWidth} ${viewBoxHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      data-cometal-icon=""
      data-cometal-icon-library={definition.library}
      data-cometal-icon-paint={definition.paintMode}
      data-cometal-icon-stroke-scaling={definition.strokeScaling}
      aria-hidden={decorative ? 'true' : undefined}
      aria-label={decorative ? undefined : label}
      role={decorative ? undefined : 'img'}
      focusable="false"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
});
