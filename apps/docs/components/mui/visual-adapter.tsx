'use client';

import { forwardRef } from 'react';
import type { SVGProps } from 'react';
import FormControl from '@mui/material/FormControl';
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import ChevronDown from '@cometal/react/icons/outline/arrows/chevron-down';

export type LmsSize = 'l' | 'm' | 's';
export type LmSize = Exclude<LmsSize, 's'>;
export type DemoSizeState = {
  button: LmsSize; textfield: LmsSize; textarea: LmSize; select: LmsSize; combobox: LmsSize;
  multiselect: LmSize; checkbox: LmsSize; radiobutton: LmsSize; switch: LmsSize; tabs: LmsSize;
};
export const supportedSizes = { lms: ['l', 'm', 's'], lm: ['l', 'm'] } as const;
export const sizeLabels = { l: 'Large', m: 'Medium', s: 'Small' } as const;
const controlToken = (size: LmsSize) => `var(--cometal-semantic-size-global-control-${size})`;
const iconTokens = { l: 'var(--cometal-primitive-size-20)', m: 'var(--cometal-primitive-size-16)', s: 'var(--cometal-primitive-size-14)' };
const fieldInset = (size: LmsSize) => size === 's' ? 'var(--cometal-primitive-spacing-50)' : `var(--cometal-semantic-spacing-global-input-${size}-inset)`;
const typography = (family: 'body' | 'control', size: LmsSize) => {
  const name = family === 'body' ? `body-${size}-default` : `control-${size}`;
  return { fontFamily: `var(--cometal-typography-${name}-font-family)`, fontSize: `var(--cometal-typography-${name}-font-size)`, fontWeight: `var(--cometal-typography-${name}-font-weight)`, lineHeight: `var(--cometal-typography-${name}-line-height)`, letterSpacing: `var(--cometal-typography-${name}-letter-spacing)` };
};

export const fieldWidth = 'min(100%, calc(var(--cometal-primitive-size-40) * 10))';
export const focusStyles = {
  outline: 'var(--cometal-semantic-stroke-global-state-focus) solid var(--cometal-semantic-color-global-state-focus-ring)',
  outlineOffset: 'var(--cometal-primitive-spacing-25)',
};
export const bodyStyles = {
  fontFamily: 'var(--cometal-typography-body-m-default-font-family)',
  fontSize: 'var(--cometal-typography-body-m-default-font-size)',
  fontWeight: 'var(--cometal-typography-body-m-default-font-weight)',
  lineHeight: 'var(--cometal-typography-body-m-default-line-height)',
  letterSpacing: 'var(--cometal-typography-body-m-default-letter-spacing)',
  color: 'var(--cometal-semantic-color-global-text-primary)',
};
export const stackStyles = { display: 'grid', gap: 'var(--cometal-primitive-spacing-100)', minWidth: 0, maxWidth: '100%', ...bodyStyles };
export const labelStyles = {
  fontFamily: 'var(--cometal-typography-caption-label-label-font-family)',
  fontSize: 'var(--cometal-typography-caption-label-label-font-size)',
  lineHeight: 'var(--cometal-typography-caption-label-label-line-height)',
  letterSpacing: 'var(--cometal-typography-caption-label-label-letter-spacing)',
  color: 'var(--cometal-component-input-label-default)',
};

export const buttonStyles = {
  fontFamily: 'var(--cometal-typography-control-m-font-family)',
  fontSize: 'var(--cometal-typography-control-m-font-size)',
  fontWeight: 'var(--cometal-typography-control-m-font-weight)',
  lineHeight: 'var(--cometal-typography-control-m-line-height)',
  letterSpacing: 'var(--cometal-typography-control-m-letter-spacing)',
  textTransform: 'none',
  minWidth: 'var(--cometal-semantic-size-global-button-m)',
  height: 'var(--cometal-semantic-size-global-button-m)',
  padding: '0 calc(var(--cometal-semantic-spacing-global-button-m-inset-icon) + var(--cometal-semantic-spacing-global-button-content-label-inset))',
  borderRadius: 'var(--cometal-semantic-radius-global-button)',
  backgroundColor: 'var(--cometal-component-button-primary-surface-default)',
  color: 'var(--cometal-component-button-primary-content-default)',
  boxShadow: 'none',
  '&:hover': { backgroundColor: 'var(--cometal-component-button-primary-surface-hover)', boxShadow: 'none' },
  '&:active': { backgroundColor: 'var(--cometal-component-button-primary-surface-pressed)', boxShadow: 'none' },
  '&.Mui-focusVisible': focusStyles,
  '&.Mui-disabled': { backgroundColor: 'var(--cometal-component-button-primary-surface-disabled)', color: 'var(--cometal-component-button-primary-content-disabled)' },
};

export const badgeStyles = {
  height: 'var(--cometal-semantic-size-global-badge)',
  borderRadius: 'var(--cometal-semantic-radius-global-badge)',
  backgroundColor: 'var(--cometal-component-badge-light-surface-green)',
  color: 'var(--cometal-component-badge-light-content)',
  fontFamily: 'var(--cometal-typography-control-s-font-family)',
  fontSize: 'var(--cometal-typography-control-s-font-size)',
  lineHeight: 'var(--cometal-typography-control-s-line-height)',
  letterSpacing: 'var(--cometal-typography-control-s-letter-spacing)',
  '& .MuiChip-label': { padding: '0 var(--cometal-primitive-spacing-50) var(--cometal-semantic-spacing-global-badge-optical-text-bottom)' },
};

export const textFieldStyles = {
  width: '100%',
  '& .MuiInputBase-root': {
    ...bodyStyles,
    height: 'var(--cometal-semantic-size-global-control-m)',
    borderRadius: 'var(--cometal-semantic-radius-global-input)',
    backgroundColor: 'var(--cometal-component-input-surface-default)',
    '&:has(input:focus-visible, textarea:focus-visible)': focusStyles,
    '&:hover': { backgroundColor: 'var(--cometal-component-input-surface-hover)' },
  },
  '&&& .MuiInputBase-root .MuiOutlinedInput-notchedOutline': {
    borderWidth: 'var(--cometal-primitive-stroke-100)',
    borderColor: 'var(--cometal-component-input-border-default)',
  },
  '& .MuiInputBase-input': { ...bodyStyles, padding: '0 var(--cometal-semantic-spacing-global-input-m-inset)', height: '100%', boxSizing: 'border-box' },
  '& .MuiInputBase-input::placeholder': { color: 'var(--cometal-component-input-placeholder-default)', opacity: 1 },
  '& .MuiInputBase-multiline': { height: 'auto', padding: 'var(--cometal-primitive-spacing-75)', alignItems: 'start' },
  '& .MuiInputBase-inputMultiline': { padding: 0, height: 'auto' },
  '& .MuiFormHelperText-root': { ...bodyStyles, margin: 'var(--cometal-semantic-spacing-global-input-helper-gap) 0 0', color: 'var(--cometal-component-input-helper-default)', fontSize: 'var(--cometal-typography-body-s-default-font-size)' },
};

export const autocompleteStyles = {
  ...textFieldStyles,
  '&&& .MuiAutocomplete-inputRoot': { padding: '0 var(--cometal-semantic-spacing-global-input-m-inset)' },
  '&&& .MuiAutocomplete-inputRoot .MuiAutocomplete-input': { padding: 0, height: 'var(--cometal-semantic-size-global-control-m)' },
  '& [data-cometal-stroke-scale]': { vectorEffect: 'non-scaling-stroke' },
};

export const choiceLabelStyles = { margin: 0, gap: 'var(--cometal-primitive-spacing-50)', '& .MuiFormControlLabel-label': bodyStyles };
// M presentation from packages/react/src/Selection; native inputs remain MUI-owned.
const SelectionIcon = styled('span')({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box',
  width: 'var(--cometal-primitive-size-16)', height: 'var(--cometal-primitive-size-16)',
  border: 'var(--cometal-primitive-stroke-100) solid var(--cometal-semantic-color-global-border-default)',
  borderRadius: 'var(--cometal-semantic-radius-global-checkbox)',
  backgroundColor: 'var(--cometal-semantic-color-global-surface-canvas)',
  pointerEvents: 'none',
  transition: 'background-color var(--cometal-motion-duration-state) var(--cometal-motion-easing-standard), border-color var(--cometal-motion-duration-state) var(--cometal-motion-easing-standard)',
  '& svg': { display: 'block', width: '100%', height: '100%', color: 'var(--cometal-semantic-color-global-text-inverse)' },
  '&[data-kind="radio"]': { borderRadius: '50%' },
  '&[data-kind="radio"][data-checked="true"]::after': {
    content: '""', borderRadius: '50%',
    width: 'calc(var(--cometal-primitive-spacing-25) + var(--cometal-primitive-spacing-12))',
    height: 'calc(var(--cometal-primitive-spacing-25) + var(--cometal-primitive-spacing-12))',
    backgroundColor: 'currentColor',
  },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  '&[data-size="l"]': { width: iconTokens.l, height: iconTokens.l, '&[data-kind="radio"][data-checked="true"]::after': { width: 'var(--cometal-primitive-spacing-50)', height: 'var(--cometal-primitive-spacing-50)' } },
  '&[data-size="s"]': { width: iconTokens.s, height: iconTokens.s, '&[data-kind="radio"][data-checked="true"]::after': { width: 'var(--cometal-primitive-spacing-25)', height: 'var(--cometal-primitive-spacing-25)' } },
});

const checkGeometry = {
  l: { viewBox: '0 0 20 20', path: 'M6 9.92L8.56 12.48L14 6.72' },
  m: { viewBox: '0 0 16 16', path: 'M4.5 7.88L6.74 10.12L11.5 5.08' },
  s: { viewBox: '0 0 14 14', path: 'M4 6.84L5.92 8.76L10 4.44' },
} satisfies Record<LmsSize, { viewBox: string; path: string }>;
export function CheckboxIcon({ checked = false, size = 'm' }: { checked?: boolean; size?: LmsSize }) {
  return <SelectionIcon data-pilot-selection-icon data-kind="checkbox" data-size={size} aria-hidden="true">
    {checked && <svg viewBox={checkGeometry[size].viewBox} fill="none" focusable="false">
      {/* Exact size-specific marks from Selection.tsx, never a scaled M path. */}
      <path d={checkGeometry[size].path} stroke="currentColor" strokeWidth="var(--cometal-primitive-stroke-140)" strokeLinecap="round" strokeLinejoin="round" />
    </svg>}
  </SelectionIcon>;
}
export function RadioIcon({ checked = false, size = 'm' }: { checked?: boolean; size?: LmsSize }) {
  return <SelectionIcon data-pilot-selection-icon data-kind="radio" data-size={size} data-checked={checked} aria-hidden="true" />;
}

export const selectionControlStyles = {
  padding: 0, marginTop: 'var(--cometal-primitive-spacing-25)',
  '&:hover': { backgroundColor: 'transparent' },
  '&.Mui-focusVisible [data-pilot-selection-icon]': { ...focusStyles, outlineOffset: 'var(--cometal-primitive-spacing-12)' },
  '&.Mui-checked [data-kind="checkbox"]': { borderWidth: 0, backgroundColor: 'var(--cometal-semantic-color-global-action-brand-default)' },
  '&.Mui-checked [data-kind="radio"]': { borderColor: 'var(--cometal-semantic-color-global-action-brand-default)', color: 'var(--cometal-semantic-color-global-action-brand-default)' },
  '&.Mui-disabled [data-kind="checkbox"]': { borderColor: 'var(--cometal-semantic-color-global-border-disabled)', backgroundColor: 'var(--cometal-semantic-color-global-surface-muted)' },
  '&.Mui-disabled.Mui-checked [data-kind="checkbox"]': { backgroundColor: 'var(--cometal-semantic-color-global-action-brand-disabled)' },
  '&.Mui-disabled [data-kind="radio"]': { borderColor: 'var(--cometal-semantic-color-global-border-disabled)', backgroundColor: 'var(--cometal-semantic-color-global-surface-subtle)', color: 'var(--cometal-semantic-color-global-action-brand-disabled)' },
};
const selectionLabelStyles = {
  margin: 0, display: 'inline-grid', gridTemplateColumns: 'auto minmax(0, 1fr)', alignItems: 'start',
  maxWidth: '100%', padding: 'var(--cometal-primitive-spacing-25)', gap: 'var(--cometal-primitive-spacing-50)',
  '& .MuiFormControlLabel-label': { ...bodyStyles, width: 'calc(var(--cometal-primitive-size-20) * 11)', maxWidth: '100%', overflowWrap: 'anywhere', '&.Mui-disabled': { color: 'var(--cometal-semantic-color-global-text-disabled)' } },
};
export const checkboxLabelStyles = {
  ...selectionLabelStyles,
  '&:hover .MuiCheckbox-root:not(.Mui-disabled):not(.Mui-checked) [data-pilot-selection-icon]': { backgroundColor: 'var(--cometal-semantic-color-global-surface-subtle)' },
  '&:hover .MuiCheckbox-root:not(.Mui-disabled).Mui-checked [data-pilot-selection-icon]': { backgroundColor: 'var(--cometal-semantic-color-global-action-brand-hover)' },
  '&:active .MuiCheckbox-root:not(.Mui-disabled):not(.Mui-checked) [data-pilot-selection-icon]': { borderColor: 'var(--cometal-semantic-color-global-action-brand-default)', backgroundColor: 'var(--cometal-semantic-color-global-action-neutral-pressed)' },
  '&:active .MuiCheckbox-root:not(.Mui-disabled).Mui-checked [data-pilot-selection-icon]': { backgroundColor: 'var(--cometal-semantic-color-global-action-brand-pressed)' },
};
export const radioLabelStyles = {
  ...selectionLabelStyles,
  '&:hover .MuiRadio-root:not(.Mui-disabled) [data-pilot-selection-icon]': { borderColor: 'var(--cometal-semantic-color-global-border-strong)' },
  '&:hover .MuiRadio-root:not(.Mui-disabled).Mui-checked [data-pilot-selection-icon]': { borderColor: 'var(--cometal-semantic-color-global-action-brand-hover)', color: 'var(--cometal-semantic-color-global-action-brand-hover)' },
  '&:active .MuiRadio-root:not(.Mui-disabled) [data-pilot-selection-icon]': { borderColor: 'var(--cometal-semantic-color-global-action-brand-default)' },
  '&:active .MuiRadio-root:not(.Mui-disabled).Mui-checked [data-pilot-selection-icon]': { borderColor: 'var(--cometal-semantic-color-global-action-brand-pressed)', color: 'var(--cometal-semantic-color-global-action-brand-pressed)' },
};

export const switchStyles = {
  width: 'var(--cometal-primitive-size-36)', height: 'var(--cometal-primitive-size-20)',
  padding: 0, margin: 'var(--cometal-primitive-spacing-25)', overflow: 'visible',
  '& .MuiSwitch-switchBase': {
    padding: 'var(--cometal-primitive-spacing-12)',
    '&.Mui-checked': { transform: 'translateX(calc(var(--cometal-primitive-size-36) - var(--cometal-primitive-size-20)))', color: 'var(--cometal-semantic-color-global-surface-canvas)' },
    '&.Mui-focusVisible': focusStyles,
    '&.Mui-checked + .MuiSwitch-track': { backgroundColor: 'var(--cometal-semantic-color-global-action-brand-default)', opacity: 1 },
  },
  '& .MuiSwitch-thumb': { width: 'var(--cometal-primitive-size-16)', height: 'var(--cometal-primitive-size-16)', color: 'var(--cometal-semantic-color-global-surface-canvas)', boxShadow: 'none' },
  '& .MuiSwitch-track': { borderRadius: 'var(--cometal-primitive-size-20)', backgroundColor: 'var(--cometal-semantic-color-global-border-strong)', opacity: 1 },
};

// Shared by board navigation and inner Tabs: 6px control gap, 4px focus envelope.
export const tabStyles = {
  ...bodyStyles, textTransform: 'none', minWidth: 0, minHeight: 'var(--cometal-semantic-size-global-control-m)',
  padding: '0 var(--cometal-primitive-spacing-75)',
  borderRadius: 'var(--cometal-semantic-radius-global-button)',
  '&.Mui-selected': { color: 'var(--cometal-semantic-color-global-action-brand-default)' },
  '&:hover': { backgroundColor: 'var(--cometal-semantic-color-global-surface-subtle)' },
  '&.Mui-focusVisible': { ...focusStyles, outlineOffset: 'var(--cometal-primitive-spacing-12)', scrollSnapAlign: 'start' },
};
export const tabsStyles = {
  minHeight: 'var(--cometal-semantic-size-global-control-m)', minWidth: 0, maxWidth: '100%',
  '& .MuiTabs-indicator': { height: 'var(--cometal-primitive-stroke-200)', backgroundColor: 'var(--cometal-semantic-color-global-action-brand-default)' },
  '& .MuiTabs-scroller': {
    // Only keyboard focus is a snap target; pointer browsing has no snap target.
    scrollSnapType: 'x mandatory',
    scrollPaddingInline: 'var(--cometal-primitive-spacing-25)',
    paddingTop: 'var(--cometal-primitive-spacing-25)',
    paddingInline: 'var(--cometal-primitive-spacing-25)',
    paddingBottom: 'calc(var(--cometal-primitive-spacing-25) + var(--cometal-primitive-spacing-12) + var(--cometal-primitive-stroke-200))',
  },
  '& .MuiTabs-list': { width: 'max-content', minWidth: '100%', gap: 'var(--cometal-primitive-spacing-25)', alignItems: 'flex-start' },
};
export const demoTabStyles = tabStyles;
export const demoTabsStyles = tabsStyles;
export const tooltipStyles = {
  ...bodyStyles,
  width: 'min(calc(var(--cometal-primitive-size-48) * 5), calc(100vw - var(--cometal-primitive-spacing-100)))',
  boxSizing: 'border-box', minHeight: 'var(--cometal-primitive-size-44)',
  padding: 'var(--cometal-primitive-spacing-75) var(--cometal-primitive-spacing-100)',
  borderRadius: 'var(--cometal-primitive-radius-100)',
  color: 'var(--cometal-semantic-color-global-text-inverse)',
  backgroundColor: 'var(--cometal-semantic-color-global-surface-inverse)',
  boxShadow: 'var(--cometal-effects-effects-elevation-floating-soft)',
};

// Prerequisites: COMETAL token CSS, Grtsk Peta font, generated chevron and icon CSS.
// Material UI owns menu, focus, keyboard, typeahead and dismissal behavior.
export const Chevron = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(function Chevron(props, ref) {
  return <ChevronDown {...props} ref={ref} />;
});

export const Field = styled(FormControl)({
  width: 'min(100%, calc(var(--cometal-primitive-size-40) * 10))',
  minWidth: 0,
  gap: 'var(--cometal-semantic-spacing-global-input-label-gap)',
  '& .MuiFormLabel-root': {
    fontFamily: 'var(--cometal-typography-caption-label-label-font-family)',
    fontSize: 'var(--cometal-typography-caption-label-label-font-size)',
    lineHeight: 'var(--cometal-typography-caption-label-label-line-height)',
    letterSpacing: 'var(--cometal-typography-caption-label-label-letter-spacing)',
    color: 'var(--cometal-component-input-label-default)',
  },
  '&:hover .MuiFormLabel-root': { color: 'var(--cometal-component-input-label-hover)' },
  '& .MuiFormLabel-root.Mui-error': { color: 'var(--cometal-component-input-label-error)' },
  '& .MuiFormLabel-root.Mui-disabled': { color: 'var(--cometal-component-input-label-disabled)' },
  '& .MuiFormHelperText-root': {
    margin: 0,
    color: 'var(--cometal-component-input-helper-default)',
    fontFamily: 'var(--cometal-typography-body-s-default-font-family)',
    fontSize: 'var(--cometal-typography-body-s-default-font-size)',
    lineHeight: 'var(--cometal-typography-body-s-default-line-height)',
    letterSpacing: 'var(--cometal-typography-body-s-default-letter-spacing)',
  },
  '&:hover .MuiFormHelperText-root': { color: 'var(--cometal-component-input-helper-hover)' },
  '& .MuiFormHelperText-root.Mui-error': { color: 'var(--cometal-component-input-helper-error)' },
  '& .MuiFormHelperText-root.Mui-disabled': { color: 'var(--cometal-component-input-helper-disabled)' },
});

export const Control = styled(InputBase)({
  height: 'var(--cometal-semantic-size-global-control-m)',
  boxSizing: 'border-box',
  border: 'var(--cometal-primitive-stroke-100) solid var(--cometal-component-input-border-default)',
  borderRadius: 'var(--cometal-semantic-radius-global-input)',
  backgroundColor: 'var(--cometal-component-input-surface-default)',
  color: 'var(--cometal-component-input-content-default)',
  fontFamily: 'var(--cometal-typography-body-m-default-font-family)',
  fontSize: 'var(--cometal-typography-body-m-default-font-size)',
  fontWeight: 'var(--cometal-typography-body-m-default-font-weight)',
  lineHeight: 'var(--cometal-typography-body-m-default-line-height)',
  letterSpacing: 'var(--cometal-typography-body-m-default-letter-spacing)',
  '&:hover': {
    borderColor: 'var(--cometal-component-input-border-hover)',
    backgroundColor: 'var(--cometal-component-input-surface-hover)',
  },
  '&:has([role="combobox"]:focus-visible)': {
    outline: 'var(--cometal-semantic-stroke-global-state-focus) solid var(--cometal-semantic-color-global-state-focus-ring)',
    outlineOffset: 'var(--cometal-primitive-spacing-25)',
  },
  '&&& .MuiSelect-select': {
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    height: 'calc(var(--cometal-semantic-size-global-control-m) - var(--cometal-primitive-stroke-100) * 2)',
    minHeight: 0,
    padding: '0 calc(var(--cometal-semantic-spacing-global-input-m-inset) + var(--cometal-primitive-size-16) + var(--cometal-semantic-spacing-global-input-gap)) 0 var(--cometal-semantic-spacing-global-input-m-inset)',
    borderRadius: 'inherit',
    '&:focus': { backgroundColor: 'transparent' },
  },
  '& .MuiSelect-icon': {
    top: 'calc(50% - var(--cometal-primitive-size-16) / 2)',
    right: 'var(--cometal-semantic-spacing-global-input-m-inset)',
    width: 'var(--cometal-primitive-size-16)',
    height: 'var(--cometal-primitive-size-16)',
    color: 'var(--cometal-component-input-icon-default)',
    '& [data-cometal-stroke-scale]': { vectorEffect: 'non-scaling-stroke' },
  },
  '&:hover .MuiSelect-icon': { color: 'var(--cometal-component-input-icon-hover)' },
  '& [data-placeholder]': { color: 'var(--cometal-component-input-placeholder-default)' },
  '&:hover [data-placeholder]': { color: 'var(--cometal-component-input-placeholder-hover)' },
  '&.Mui-error': {
    borderColor: 'var(--cometal-component-input-border-error)',
    backgroundColor: 'var(--cometal-component-input-surface-error)',
    color: 'var(--cometal-component-input-content-error)',
    '& .MuiSelect-icon': { color: 'var(--cometal-component-input-icon-error)' },
  },
  '&.Mui-disabled': {
    borderColor: 'var(--cometal-component-input-border-disabled)',
    backgroundColor: 'var(--cometal-component-input-surface-disabled)',
    color: 'var(--cometal-semantic-color-global-text-disabled)',
    '& .MuiSelect-select': { WebkitTextFillColor: 'var(--cometal-semantic-color-global-text-disabled)' },
    '& .MuiSelect-icon': { color: 'var(--cometal-component-input-icon-disabled)' },
    '& [data-placeholder]': { color: 'var(--cometal-component-input-placeholder-disabled)' },
  },
});

export const menuStyles = {
  border: 'var(--cometal-primitive-stroke-100) solid var(--cometal-semantic-color-global-border-default)',
  borderRadius: 'var(--cometal-primitive-radius-100)',
  backgroundColor: 'var(--cometal-semantic-color-global-surface-canvas)',
  boxShadow: 'var(--cometal-effects-effects-elevation-floating-soft)',
  '& .MuiList-root': {
    display: 'flex',
    flexDirection: 'column',
    padding: 'var(--cometal-primitive-spacing-50)',
    gap: 'var(--cometal-primitive-spacing-50)',
  },
  '& .MuiMenuItem-root': {
    minHeight: 'var(--cometal-semantic-size-global-control-m)',
    padding: '0 var(--cometal-primitive-spacing-75)',
    borderRadius: 'var(--cometal-primitive-radius-100)',
    fontFamily: 'var(--cometal-typography-body-s-default-font-family)',
    fontSize: 'var(--cometal-typography-body-s-default-font-size)',
    lineHeight: 'var(--cometal-typography-body-s-default-line-height)',
    letterSpacing: 'var(--cometal-typography-body-s-default-letter-spacing)',
    color: 'var(--cometal-component-option-content-default)',
    backgroundColor: 'var(--cometal-component-option-surface-default)',
    '&.Mui-focusVisible': {
      color: 'var(--cometal-component-option-content-focus)',
      backgroundColor: 'var(--cometal-component-option-surface-focus)',
    },
    '&:hover': {
      color: 'var(--cometal-component-option-content-hover)',
      backgroundColor: 'var(--cometal-component-option-surface-hover)',
    },
    '&.Mui-selected': {
      color: 'var(--cometal-component-option-content-selected)',
      backgroundColor: 'var(--cometal-component-option-surface-selected)',
    },
    '&.Mui-disabled': {
      opacity: 1,
      color: 'var(--cometal-component-option-content-disabled)',
      backgroundColor: 'var(--cometal-component-option-surface-disabled)',
    },
  },
};

// Size factories affect demo presentation only. MUI's own size union is unchanged.
export const getButtonStyles = (size: LmsSize) => ({ ...buttonStyles, ...typography('control', size), height: controlToken(size), minWidth: controlToken(size), padding: `0 calc(var(--cometal-semantic-spacing-global-button-${size}-inset-icon) + var(--cometal-semantic-spacing-global-button-content-label-inset))` });
export const getTextFieldStyles = (size: LmsSize) => ({
  ...textFieldStyles,
  '& .MuiInputBase-root': { ...textFieldStyles['& .MuiInputBase-root'], ...typography('body', size === 'l' ? 'l' : 'm'), height: controlToken(size) },
  '& .MuiInputBase-input': { ...textFieldStyles['& .MuiInputBase-input'], ...typography('body', size === 'l' ? 'l' : 'm'), padding: `0 ${fieldInset(size)}` },
});
export const getTextAreaStyles = (size: LmSize) => ({
  ...getTextFieldStyles(size),
  '& .MuiInputBase-multiline': { height: `calc(${controlToken(size)} * 3)`, padding: `${size === 'l' ? 'var(--cometal-primitive-spacing-75)' : 'var(--cometal-primitive-spacing-60)'} ${fieldInset(size)}`, alignItems: 'start' },
  // MUI 9's textarea carries MuiInputBase-input, not inputMultiline.
  // The multiline root alone owns the canonical inset.
  '&& .MuiInputBase-multiline .MuiInputBase-input': { padding: 0 },
});
export const getAutocompleteStyles = (size: LmsSize) => ({
  ...getTextFieldStyles(size),
  '&&& .MuiAutocomplete-inputRoot': { padding: `0 ${fieldInset(size)}` },
  '&&& .MuiAutocomplete-inputRoot .MuiAutocomplete-input': { padding: 0, height: controlToken(size) },
  '& [data-cometal-stroke-scale]': { vectorEffect: 'non-scaling-stroke' },
});
export const getFieldIconStyles = (size: LmsSize) => ({ width: iconTokens[size], height: iconTokens[size] });
export const getControlSizeStyles = (size: LmsSize) => ({
  ...typography('body', size === 'l' ? 'l' : 'm'), height: controlToken(size),
  '&&& .MuiSelect-select': { height: `calc(${controlToken(size)} - var(--cometal-primitive-stroke-100) * 2)`, padding: `0 calc(${fieldInset(size)} + ${iconTokens[size]} + var(--cometal-semantic-spacing-global-input-gap)) 0 ${fieldInset(size)}` },
  '& .MuiSelect-icon': { ...getFieldIconStyles(size), top: `calc(50% - ${iconTokens[size]} / 2)`, right: fieldInset(size) },
});
export const getMultiControlStyles = (size: LmSize) => {
  const styles = getControlSizeStyles(size);
  return { ...styles, height: 'auto', minHeight: controlToken(size), '&&& .MuiSelect-select': { ...styles['&&& .MuiSelect-select'], height: 'auto', minHeight: `calc(${controlToken(size)} - var(--cometal-primitive-stroke-100) * 2)`, paddingBlock: 'var(--cometal-primitive-spacing-25)' } };
};
export const getValueTagStyles = (size: LmSize) => ({ ...typography('control', 's'), maxWidth: '100%', height: `var(--cometal-semantic-size-global-field-value-tag-${size})`, borderRadius: 'var(--cometal-primitive-radius-50)', backgroundColor: 'var(--cometal-semantic-color-global-surface-subtle)', '& .MuiChip-label': { paddingInline: 'var(--cometal-primitive-spacing-50)' } });
export const getMenuStyles = (size: LmsSize) => ({ ...menuStyles, '& .MuiMenuItem-root': { ...menuStyles['& .MuiMenuItem-root'], ...typography('body', size === 'l' ? 'm' : 's'), minHeight: controlToken(size), paddingInline: size === 'l' ? 'var(--cometal-primitive-spacing-100)' : 'var(--cometal-primitive-spacing-75)' } });
export const getSelectionLabelStyles = (kind: 'checkbox' | 'radio' | 'switch', size: LmsSize) => ({
  ...(kind === 'checkbox' ? checkboxLabelStyles : kind === 'radio' ? radioLabelStyles : selectionLabelStyles),
  gap: kind === 'switch' && size !== 's' ? 'var(--cometal-primitive-spacing-75)' : 'var(--cometal-primitive-spacing-50)',
  '& .MuiFormControlLabel-label': { ...selectionLabelStyles['& .MuiFormControlLabel-label'], ...typography('body', size), width: `calc(var(--cometal-primitive-size-20) * ${{ l: 12, m: 11, s: 10 }[size]})` },
});
export const getSelectionControlStyles = (kind: 'checkbox' | 'radio', size: LmsSize) => ({
  ...selectionControlStyles,
  // Align with the first text line, even when the label wraps. No optical transform.
  marginTop: `calc((var(--cometal-typography-body-${size}-default-line-height) - ${iconTokens[size]}) / 2)`,
  '&.Mui-focusVisible [data-pilot-selection-icon]': { ...focusStyles, outlineOffset: kind === 'radio' && size === 's' ? 'calc(var(--cometal-primitive-spacing-12) + var(--cometal-primitive-stroke-100))' : 'var(--cometal-primitive-spacing-12)' },
});
export const getSwitchStyles = (size: LmsSize) => {
  const width = `var(--cometal-primitive-size-${{ l: 44, m: 36, s: 32 }[size]})`;
  const height = `var(--cometal-primitive-size-${{ l: 24, m: 20, s: 16 }[size]})`;
  return { ...switchStyles, width, height, margin: 0,
    '& .MuiSwitch-switchBase': { ...switchStyles['& .MuiSwitch-switchBase'], '&.Mui-checked': { ...switchStyles['& .MuiSwitch-switchBase']['&.Mui-checked'], transform: `translateX(calc(${width} - ${height}))` } },
    '& .MuiSwitch-thumb': { ...switchStyles['& .MuiSwitch-thumb'], width: `calc(${height} - var(--cometal-primitive-spacing-25))`, height: `calc(${height} - var(--cometal-primitive-spacing-25))` },
  };
};
export const getDemoTabStyles = (size: LmsSize) => ({ ...demoTabStyles, ...typography('control', size), minHeight: controlToken(size), height: controlToken(size), padding: `0 calc(var(--cometal-semantic-spacing-global-button-${size}-inset-icon) + var(--cometal-semantic-spacing-global-button-content-label-inset))` });
export const getDemoTabsStyles = (size: LmsSize) => ({ ...demoTabsStyles, minHeight: controlToken(size) });
export const sizeSelectorStyles = {
  '& .MuiToggleButton-root': { ...typography('control', 's'), minWidth: 'var(--cometal-semantic-size-global-control-s)', height: 'var(--cometal-semantic-size-global-control-s)', padding: '0 var(--cometal-primitive-spacing-50)', textTransform: 'none', color: 'var(--cometal-semantic-color-global-text-primary)', borderColor: 'var(--cometal-semantic-color-global-border-default)', '&.Mui-selected': { backgroundColor: 'var(--cometal-semantic-color-global-surface-active)', color: 'var(--cometal-semantic-color-global-action-brand-default)' }, '&.Mui-focusVisible': { ...focusStyles, outlineOffset: 'var(--cometal-primitive-spacing-12)' }, '&.Mui-disabled': { color: 'var(--cometal-semantic-color-global-text-disabled)' } },
};
