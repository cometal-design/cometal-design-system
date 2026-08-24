import { forwardRef } from 'react';
import { Icon } from '../../../../runtime/Icon';
import type { IconProps } from '../../../../runtime/types';
import definition from '../../../definitions/filled/education/book-01';

const Cometal_filled_education_book_01_Icon = forwardRef<SVGSVGElement, IconProps>(function Cometal_filled_education_book_01_Icon(props, ref) {
  return <Icon definition={definition} ref={ref} {...props} />;
});

export { definition };
export default Cometal_filled_education_book_01_Icon;
