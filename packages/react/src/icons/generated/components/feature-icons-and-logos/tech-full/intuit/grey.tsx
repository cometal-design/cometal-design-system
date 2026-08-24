'use client';

import { forwardRef, useId } from 'react';
import { Icon } from '../../../../../runtime/Icon';
import type { IconProps } from '../../../../../runtime/types';
import definition from '../../../../definitions/feature-icons-and-logos/tech-full/intuit/grey';

const Cometal_feature_icons_and_logos_tech_full_intuit_grey_Icon = forwardRef<SVGSVGElement, IconProps>(function Cometal_feature_icons_and_logos_tech_full_intuit_grey_Icon(props, ref) {
  const reactId = useId();
  const idPrefix = `cometal-${reactId.replace(/[^A-Za-z0-9_-]/g, '')}-`;
  return <Icon definition={definition} idPrefix={idPrefix} ref={ref} {...props} />;
});

export { definition };
export default Cometal_feature_icons_and_logos_tech_full_intuit_grey_Icon;
