'use client';

import { forwardRef, useId } from 'react';
import { Icon } from '../../../../runtime/Icon';
import type { IconProps } from '../../../../runtime/types';
import definition from '../../../definitions/outline/profiles-and-users/user-profile-03-02';

const Cometal_outline_profiles_and_users_user_profile_03_02_Icon = forwardRef<SVGSVGElement, IconProps>(function Cometal_outline_profiles_and_users_user_profile_03_02_Icon(props, ref) {
  const reactId = useId();
  const idPrefix = `cometal-${reactId.replace(/[^A-Za-z0-9_-]/g, '')}-`;
  return <Icon definition={definition} idPrefix={idPrefix} ref={ref} {...props} />;
});

export { definition };
export default Cometal_outline_profiles_and_users_user_profile_03_02_Icon;
