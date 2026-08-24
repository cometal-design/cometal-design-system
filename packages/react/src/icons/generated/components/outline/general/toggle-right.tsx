import { forwardRef } from 'react';
import { Icon } from '../../../../runtime/Icon';
import type { IconProps } from '../../../../runtime/types';
import definition from '../../../definitions/outline/general/toggle-right';

const Cometal_outline_general_toggle_right_Icon = forwardRef<SVGSVGElement, IconProps>(function Cometal_outline_general_toggle_right_Icon(props, ref) {
  return <Icon definition={definition} ref={ref} {...props} />;
});

export { definition };
export default Cometal_outline_general_toggle_right_Icon;
