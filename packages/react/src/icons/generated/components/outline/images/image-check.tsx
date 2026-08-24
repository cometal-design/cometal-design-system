import { forwardRef } from 'react';
import { Icon } from '../../../../runtime/Icon';
import type { IconProps } from '../../../../runtime/types';
import definition from '../../../definitions/outline/images/image-check';

const Cometal_outline_images_image_check_Icon = forwardRef<SVGSVGElement, IconProps>(function Cometal_outline_images_image_check_Icon(props, ref) {
  return <Icon definition={definition} ref={ref} {...props} />;
});

export { definition };
export default Cometal_outline_images_image_check_Icon;
