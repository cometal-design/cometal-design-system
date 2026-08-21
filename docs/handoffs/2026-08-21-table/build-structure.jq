def source_arch($sources; $name): ($sources[]? | select(.name == $name));
def merge_arch($set; $sources):
  $set + {
    bindings: (source_arch($sources; $set.name).bindings // source_arch($sources; $set.name).directBindings // []),
    nestedComponents: (source_arch($sources; $set.name).nestedComponents // source_arch($sources; $set.name).nestedSources // []),
    iconReferences: (source_arch($sources; $set.name).iconReferences // []),
    reactionNodeCount: (source_arch($sources; $set.name).reactionNodeCount // 0)
  };

($read1[0].set + {variants: ($read1[0].variants + $read2[0].variants)}) as $readSet
| ([($otherCells[0].set + {variants: $otherCells[0].variants})] + $supportCells[0].sets) as $remainingCellSets
| ($headerVariants[0].sets) as $headerSets
| ($contentColumnVariants[0].sets + $supportColumnVariants[0].sets) as $columnSets
| ($otherCellArchitecture[0].sources) as $otherCellArch
| ($headerCoreArchitecture[0].sources + $headerFilterArchitecture[0].sources) as $headerArch
| ($contentColumnArchitecture[0].sets + $supportColumnArchitecture[0].sets) as $columnArch
| {
    schemaVersion: 1,
    generatedAt: "2026-08-21",
    extractionMode: "Live Figma Plugin API, read-only",
    approval: {
      component: "Table",
      status: "Approved for downstream handoff by Vadim",
      requestedAt: "2026-08-21"
    },
    figma: {
      fileKey: "KKNGucImxFAtQLBhPy8tLs",
      page: {id: "2353:9350", name: "Tables"},
      ownership: "Visual composition, variants and visual states"
    },
    sourceArtboards: [
      {id: "2814:8351", name: "Table / Sources", role: "Technical source umbrella", canonical: true, screenshot: "screenshots/table-sources-overview.png"},
      {id: "2353:9497", name: "Cells", role: "Cell source families", canonical: true, screenshot: "screenshots/table-source-cells.png"},
      {id: "2353:10882", name: "Paginator Source", role: "Paginator source", canonical: true, screenshot: "screenshots/table-source-paginator.png"},
      {id: "2353:10891", name: "Header Source", role: "Header, action and filter source families", canonical: true, screenshot: "screenshots/table-source-header.png"},
      {id: "2353:9820", name: "Columns", role: "Columns documentation artboard", canonical: false, screenshot: "screenshots/table-columns-overview.png"},
      {id: "2353:9824", name: "Main Components", role: "Canonical column families", canonical: true, screenshot: "screenshots/table-main-columns.png"}
    ],
    evidenceArtboards: [
      {id: "2353:9351", name: "Table / Principles", role: "Approved principles and constraints", canonical: false, screenshot: "screenshots/table-principles.png"},
      {id: "2353:10833", name: "Table / Review", role: "State and presentation evidence", canonical: false, screenshot: "screenshots/table-review.png"}
    ],
    architecture: {
      foundation: "125 live bound variables are listed in usedVariables",
      internalPrimitives: ["Read Cell", "Edit Cell", "Selection Cell", "Index Cell", "Drag Handle Cell", "Summary Cell", "File Content", "Drag Handle Icon", "Column Header", "Context Action", "Selection Header", "Index Header", "Drag Handle Header", "Filter Row", "Paginator Control"],
      compoundParts: ["Read Column", "Edit Column", "Index Column", "Selection Column", "Drag Handle Column", "Paginator"],
      finalComposition: "Figma intentionally has no single monolithic Table Component Set. Designers compose a table from column instances, keep density synchronized, and add Paginator as required. Review is evidence, not the source.",
      relatedPatterns: ["Widget + Table is a downstream pattern/dependency and is excluded from this component handoff unless an implementation change is required to consume the corrected Table API."]
    },
    counts: {
      componentSets: 16,
      standaloneComponents: 5,
      variants: 271,
      stateBearingSets: 10,
      stateOptionsAcrossSets: 42,
      usedVariables: 125,
      prototypeReactionNodes: 0
    },
    componentSets:
      ([($readSet + {
          bindings: $readBindings[0].bindingIndex,
          nestedComponents: $readNested[0].nestedComponents,
          iconReferences: $readNested[0].iconReferences,
          textStyles: $readNested[0].textStyles,
          reactionNodeCount: $readNested[0].reactionNodeCount
        })]
       + ($remainingCellSets | map(merge_arch(.; $otherCellArch)))
       + [($paginator[0].set + {
          variants: $paginator[0].variants,
          bindings: $paginator[0].bindings,
          nestedComponents: $paginator[0].nestedComponents,
          reactionNodeCount: $paginator[0].reactionNodeCount
        })]
       + ($headerSets | map(merge_arch(.; $headerArch)))
       + ($columnSets | map(merge_arch(.; $columnArch)))),
    standaloneComponents:
      ($supportCells[0].standalone
       + [$paginator[0].standalone]
       + $headerVariants[0].standalone),
    usedVariables:
      ($variables01[0].variables
       + $variables02[0].variables
       + $variables03[0].variables
       + $variables04[0].variables
       + $variables05[0].variables),
    icons: {
      fileIconSwapOptions: $fileIcons[0].found,
      exactReferencedIcons: [
        {id: "700:14528", name: "Outline/general/information-circle-contained", usage: "Read/Edit cell trailing notice"},
        {id: "700:14279", name: "Outline/arrows/chevron-down", usage: "Dropdown and paginator rows selector"},
        {id: "700:14369", name: "Outline/arrows/arrow-up-sm", usage: "Ascending sort"},
        {id: "700:14384", name: "Outline/arrows/down-arrow-sm", usage: "Descending sort"},
        {id: "700:1652", name: "Filled/general/dot-horizontal-filled", usage: "Column context action"},
        {id: "700:14705", name: "Outline/general/filter", usage: "Filter operator action"},
        {id: "700:14348", name: "Outline/arrows/arrow-left", usage: "Paginator previous"},
        {id: "700:14333", name: "Outline/arrows/arrow-right", usage: "Paginator next"},
        {id: "700:1431", name: "Filled/general/check-01-filled", usage: "Badge content in review examples"},
        {id: "2778:8288", name: "Drag Handle Icon", usage: "Row reorder handle"}
      ]
    },
    evidence: $reviewEvidence[0],
    screenshots: [
      "screenshots/table-sources-overview.png",
      "screenshots/table-source-cells.png",
      "screenshots/table-source-paginator.png",
      "screenshots/table-source-header.png",
      "screenshots/table-columns-overview.png",
      "screenshots/table-main-columns.png",
      "screenshots/table-principles.png",
      "screenshots/table-review.png"
    ]
  }
