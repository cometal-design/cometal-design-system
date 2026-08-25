import FilterIcon from '../icons/generated/components/outline/general/filter';
import RefreshIcon from '../icons/generated/components/outline/arrows/arrow-refresh-01';
import DownloadIcon from '../icons/generated/components/outline/general/download-01';
import PlusIcon from '../icons/generated/components/outline/general/plus-01';

export const widgetToolbarIconTypes = ['filter', 'refresh', 'download', 'plus'] as const;

export type WidgetToolbarIconType = (typeof widgetToolbarIconTypes)[number];

export interface WidgetToolbarIconProps {
  type: WidgetToolbarIconType;
  inverse?: boolean;
}

/**
 * @deprecated Pass generated icons directly to `IconButton` or `Button`.
 * Compatibility wrapper backed by the canonical generated icon library.
 */
export function WidgetToolbarIcon({ type, inverse = false }: WidgetToolbarIconProps) {
  const color = inverse
    ? 'var(--cometal-semantic-color-global-icon-inverse)'
    : 'var(--cometal-semantic-color-global-icon-primary)';
  const Icon = { filter: FilterIcon, refresh: RefreshIcon, download: DownloadIcon, plus: PlusIcon }[type];
  return <Icon width={16} height={16} style={{ color }} />;
}
