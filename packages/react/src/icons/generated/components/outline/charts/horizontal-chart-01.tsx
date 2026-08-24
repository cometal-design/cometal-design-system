import { forwardRef } from 'react';
import { Icon } from '../../../../runtime/Icon';
import type { IconProps } from '../../../../runtime/types';
import definition from '../../../definitions/outline/charts/horizontal-chart-01';

const Cometal_outline_charts_horizontal_chart_01_Icon = forwardRef<SVGSVGElement, IconProps>(function Cometal_outline_charts_horizontal_chart_01_Icon(props, ref) {
  return <Icon definition={definition} ref={ref} {...props} />;
});

export { definition };
export default Cometal_outline_charts_horizontal_chart_01_Icon;
