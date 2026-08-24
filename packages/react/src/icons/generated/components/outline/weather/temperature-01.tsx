import { forwardRef } from 'react';
import { Icon } from '../../../../runtime/Icon';
import type { IconProps } from '../../../../runtime/types';
import definition from '../../../definitions/outline/weather/temperature-01';

const Cometal_outline_weather_temperature_01_Icon = forwardRef<SVGSVGElement, IconProps>(function Cometal_outline_weather_temperature_01_Icon(props, ref) {
  return <Icon definition={definition} ref={ref} {...props} />;
});

export { definition };
export default Cometal_outline_weather_temperature_01_Icon;
