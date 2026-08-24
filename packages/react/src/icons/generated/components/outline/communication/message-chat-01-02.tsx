import { forwardRef } from 'react';
import { Icon } from '../../../../runtime/Icon';
import type { IconProps } from '../../../../runtime/types';
import definition from '../../../definitions/outline/communication/message-chat-01-02';

const Cometal_outline_communication_message_chat_01_02_Icon = forwardRef<SVGSVGElement, IconProps>(function Cometal_outline_communication_message_chat_01_02_Icon(props, ref) {
  return <Icon definition={definition} ref={ref} {...props} />;
});

export { definition };
export default Cometal_outline_communication_message_chat_01_02_Icon;
