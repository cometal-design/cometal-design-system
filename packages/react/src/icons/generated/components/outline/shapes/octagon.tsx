import { forwardRef } from 'react';
import { Icon } from '../../../../runtime/Icon';
import type { IconProps } from '../../../../runtime/types';
import definition from '../../../definitions/outline/shapes/octagon';

const Cometal_outline_shapes_octagon_Icon = forwardRef<SVGSVGElement, IconProps>(function Cometal_outline_shapes_octagon_Icon(props, ref) {
  return <Icon definition={definition} ref={ref} {...props} />;
});

export { definition };
export default Cometal_outline_shapes_octagon_Icon;
