'use client';

import { forwardRef, useId } from 'react';
import { Icon } from '../../../../runtime/Icon';
import type { IconProps } from '../../../../runtime/types';
import definition from '../../../definitions/outline/system/cursor-pointer';

const Cometal_outline_system_cursor_pointer_Icon = forwardRef<SVGSVGElement, IconProps>(function Cometal_outline_system_cursor_pointer_Icon(props, ref) {
  const reactId = useId();
  const idPrefix = `cometal-${reactId.replace(/[^A-Za-z0-9_-]/g, '')}-`;
  return <Icon definition={definition} idPrefix={idPrefix} ref={ref} {...props} />;
});

export { definition };
export default Cometal_outline_system_cursor_pointer_Icon;
