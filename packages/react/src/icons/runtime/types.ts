import type { CSSProperties, ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';

export type IconLibrary = 'outline' | 'filled' | 'feature-icons-and-logos';
export type IconPaintMode = 'currentColor' | 'intrinsic';

export interface IconManifestRecord {
  readonly canonicalName: string;
  readonly library: IconLibrary;
  readonly family: string;
  readonly categoryPath: readonly string[];
  readonly nodeId: string;
  readonly componentKey: string;
  readonly sourcePath: string;
  readonly importPath: string;
  readonly sourceSha256: string;
  readonly viewBox: readonly [number, number, number, number];
  readonly intrinsicWidth?: number;
  readonly intrinsicHeight?: number;
  readonly paintMode: IconPaintMode;
}

export interface IconManifestMetadata {
  readonly schemaVersion: string;
  readonly generatorVersion: string;
  readonly sourceFingerprintSha256: string;
  readonly total: number;
  readonly libraries: Readonly<Record<IconLibrary, number>>;
  readonly families: Readonly<Record<string, number>>;
}

export interface CompiledIconDefinition extends IconManifestRecord {
  readonly body: string;
  readonly hasReferencedIds: boolean;
}

type UnsafeSvgProp =
  | 'children'
  | 'color'
  | 'dangerouslySetInnerHTML'
  | 'role'
  | 'tabIndex'
  | `aria-${string}`
  | `on${string}`;

type SafeSvgProps = {
  [Key in keyof SVGProps<SVGSVGElement> as Key extends UnsafeSvgProp ? never : Key]: SVGProps<SVGSVGElement>[Key];
};

interface IconPresentationProps extends SafeSvgProps {
  readonly className?: string;
  readonly style?: CSSProperties;
}

export interface DecorativeIconProps extends IconPresentationProps {
  readonly decorative?: true;
  readonly label?: never;
}

export interface InformativeIconProps extends IconPresentationProps {
  readonly decorative: false;
  readonly label: string;
}

export type IconProps = DecorativeIconProps | InformativeIconProps;

export type IconRuntimeProps = IconProps & {
  readonly definition: CompiledIconDefinition;
  readonly idPrefix?: string;
};

export type IconComponent = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;

export interface IconModule {
  readonly default: IconComponent;
  readonly definition: CompiledIconDefinition;
}
