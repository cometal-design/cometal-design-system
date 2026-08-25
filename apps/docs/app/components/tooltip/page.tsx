import { Button, Tooltip } from '@cometal/react';

export default function TooltipPage() {
  return (
    <main>
      <section>
        <p>Компонент</p>
        <h1>Tooltip</h1>
        <p>
          Tooltip — это bounded overlay для короткого пояснения. В этом sync он публикуется как отдельный
          reusable React surface и как отдельная story.
        </p>
      </section>

      <section style={{ paddingTop: 32 }}>
        <Tooltip content="Подсказка для действия" defaultOpen placement="top-center">
          <Button size="m" variant="secondary">Наведи или сфокусируй</Button>
        </Tooltip>
      </section>
    </main>
  );
}
