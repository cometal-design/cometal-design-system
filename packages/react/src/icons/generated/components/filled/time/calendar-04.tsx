import { forwardRef } from 'react';
import { Icon } from '../../../../runtime/Icon';
import type { IconProps } from '../../../../runtime/types';
import definition from '../../../definitions/filled/time/calendar-04';

const Cometal_filled_time_calendar_04_Icon = forwardRef<SVGSVGElement, IconProps>(function Cometal_filled_time_calendar_04_Icon(props, ref) {
  return <Icon definition={definition} ref={ref} {...props} />;
});

export { definition };
export default Cometal_filled_time_calendar_04_Icon;
