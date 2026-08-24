import { forwardRef } from 'react';
import { Icon } from '../../../../runtime/Icon';
import type { IconProps } from '../../../../runtime/types';
import definition from '../../../definitions/filled/charts/chart-breakout-circle';

const Cometal_filled_charts_chart_breakout_circle_Icon = forwardRef<SVGSVGElement, IconProps>(function Cometal_filled_charts_chart_breakout_circle_Icon(props, ref) {
  return <Icon definition={definition} ref={ref} {...props} />;
});

export { definition };
export default Cometal_filled_charts_chart_breakout_circle_Icon;
