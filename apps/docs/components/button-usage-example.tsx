import { CodeBlock } from './code-block';

const buttonImport = "import { Button } from '@cometal/react';";

export function ButtonUsageExample() {
  return <CodeBlock code={buttonImport} copyName="импорт Button" compact />;
}
