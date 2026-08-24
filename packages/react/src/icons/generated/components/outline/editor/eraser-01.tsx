import { forwardRef } from 'react';
import { Icon } from '../../../../runtime/Icon';
import type { IconProps } from '../../../../runtime/types';
import definition from '../../../definitions/outline/editor/eraser-01';

const Cometal_outline_editor_eraser_01_Icon = forwardRef<SVGSVGElement, IconProps>(function Cometal_outline_editor_eraser_01_Icon(props, ref) {
  return <Icon definition={definition} ref={ref} {...props} />;
});

export { definition };
export default Cometal_outline_editor_eraser_01_Icon;
