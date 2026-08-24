import { forwardRef } from 'react';
import { Icon } from '../../../../runtime/Icon';
import type { IconProps } from '../../../../runtime/types';
import definition from '../../../definitions/outline/files/file-branch';

const Cometal_outline_files_file_branch_Icon = forwardRef<SVGSVGElement, IconProps>(function Cometal_outline_files_file_branch_Icon(props, ref) {
  return <Icon definition={definition} ref={ref} {...props} />;
});

export { definition };
export default Cometal_outline_files_file_branch_Icon;
