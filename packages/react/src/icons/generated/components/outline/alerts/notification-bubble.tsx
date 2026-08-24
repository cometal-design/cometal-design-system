import { forwardRef } from 'react';
import { Icon } from '../../../../runtime/Icon';
import type { IconProps } from '../../../../runtime/types';
import definition from '../../../definitions/outline/alerts/notification-bubble';

const Cometal_outline_alerts_notification_bubble_Icon = forwardRef<SVGSVGElement, IconProps>(function Cometal_outline_alerts_notification_bubble_Icon(props, ref) {
  return <Icon definition={definition} ref={ref} {...props} />;
});

export { definition };
export default Cometal_outline_alerts_notification_bubble_Icon;
