import { forwardRef } from 'react';
import { Icon } from '../../../../runtime/Icon';
import type { IconProps } from '../../../../runtime/types';
import definition from '../../../definitions/outline/arrows/chevron-double-down';

const Cometal_outline_arrows_chevron_double_down_Icon = forwardRef<SVGSVGElement, IconProps>(function Cometal_outline_arrows_chevron_double_down_Icon(props, ref) {
  return <Icon definition={definition} ref={ref} {...props} />;
});

export { definition };
export default Cometal_outline_arrows_chevron_double_down_Icon;
