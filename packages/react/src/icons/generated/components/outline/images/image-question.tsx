import { forwardRef } from 'react';
import { Icon } from '../../../../runtime/Icon';
import type { IconProps } from '../../../../runtime/types';
import definition from '../../../definitions/outline/images/image-question';

const Cometal_outline_images_image_question_Icon = forwardRef<SVGSVGElement, IconProps>(function Cometal_outline_images_image_question_Icon(props, ref) {
  return <Icon definition={definition} ref={ref} {...props} />;
});

export { definition };
export default Cometal_outline_images_image_question_Icon;
