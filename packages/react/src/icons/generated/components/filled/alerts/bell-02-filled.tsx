import { forwardRef } from 'react';
import { Icon } from '../../../../runtime/Icon';
import type { IconProps } from '../../../../runtime/types';
import definition from '../../../definitions/filled/alerts/bell-02-filled';

const Cometal_filled_alerts_bell_02_filled_Icon = forwardRef<SVGSVGElement, IconProps>(function Cometal_filled_alerts_bell_02_filled_Icon(props, ref) {
  return <Icon definition={definition} ref={ref} {...props} />;
});

export { definition };
export default Cometal_filled_alerts_bell_02_filled_Icon;
