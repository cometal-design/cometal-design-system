import { forwardRef } from 'react';
import { Icon } from '../../../../runtime/Icon';
import type { IconProps } from '../../../../runtime/types';
import definition from '../../../definitions/outline/general/link-broken';

const Cometal_outline_general_link_broken_Icon = forwardRef<SVGSVGElement, IconProps>(function Cometal_outline_general_link_broken_Icon(props, ref) {
  return <Icon definition={definition} ref={ref} {...props} />;
});

export { definition };
export default Cometal_outline_general_link_broken_Icon;
