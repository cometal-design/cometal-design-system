type MetadataStripProps = {
  ariaLabel: string;
  items: readonly string[];
  topDivider?: boolean;
  bottomDivider?: boolean;
};

export function MetadataStrip({
  ariaLabel,
  items,
  topDivider = true,
  bottomDivider = false,
}: MetadataStripProps) {
  return (
    <section
      className="metadata-strip"
      data-top-divider={topDivider || undefined}
      data-bottom-divider={bottomDivider || undefined}
      aria-label={ariaLabel}
    >
      {items.map((item) => <span key={item}>{item}</span>)}
    </section>
  );
}
