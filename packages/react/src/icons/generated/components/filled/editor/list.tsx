import { forwardRef } from 'react';
import { Icon } from '../../../../runtime/Icon';
import type { IconProps } from '../../../../runtime/types';
import definition from '../../../definitions/filled/editor/list';

const Cometal_filled_editor_list_Icon = forwardRef<SVGSVGElement, IconProps>(function Cometal_filled_editor_list_Icon(props, ref) {
  return <Icon definition={definition} ref={ref} {...props} />;
});

export { definition };
export default Cometal_filled_editor_list_Icon;
