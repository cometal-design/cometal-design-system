import { forwardRef } from 'react';
import { Icon } from '../../../../runtime/Icon';
import type { IconProps } from '../../../../runtime/types';
import definition from '../../../definitions/outline/general/thumb-up';

const Cometal_outline_general_thumb_up_Icon = forwardRef<SVGSVGElement, IconProps>(function Cometal_outline_general_thumb_up_Icon(props, ref) {
  return <Icon definition={definition} ref={ref} {...props} />;
});

export { definition };
export default Cometal_outline_general_thumb_up_Icon;
