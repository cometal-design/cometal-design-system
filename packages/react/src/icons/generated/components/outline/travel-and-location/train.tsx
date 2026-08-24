import { forwardRef } from 'react';
import { Icon } from '../../../../runtime/Icon';
import type { IconProps } from '../../../../runtime/types';
import definition from '../../../definitions/outline/travel-and-location/train';

const Cometal_outline_travel_and_location_train_Icon = forwardRef<SVGSVGElement, IconProps>(function Cometal_outline_travel_and_location_train_Icon(props, ref) {
  return <Icon definition={definition} ref={ref} {...props} />;
});

export { definition };
export default Cometal_outline_travel_and_location_train_Icon;
