import { forwardRef } from 'react';
import { Icon } from '../../../../runtime/Icon';
import type { IconProps } from '../../../../runtime/types';
import definition from '../../../definitions/outline/communication/phone-off';

const Cometal_outline_communication_phone_off_Icon = forwardRef<SVGSVGElement, IconProps>(function Cometal_outline_communication_phone_off_Icon(props, ref) {
  return <Icon definition={definition} ref={ref} {...props} />;
});

export { definition };
export default Cometal_outline_communication_phone_off_Icon;
