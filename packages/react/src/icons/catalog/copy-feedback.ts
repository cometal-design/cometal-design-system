import { copyCatalogValue } from './catalog-model';
import type { ClipboardWriter } from './catalog-model';

export interface CatalogCopyFeedbackSink {
  readonly setFeedback: (value: string) => void;
  readonly setError: (value: string) => void;
}

export interface CatalogCopyControllerOptions {
  readonly schedule?: (callback: () => void, delay: number) => number | ReturnType<typeof setTimeout>;
  readonly cancel?: (timer: number | ReturnType<typeof setTimeout>) => void;
  readonly duration?: number;
}

export function createCatalogCopyController(
  sink: CatalogCopyFeedbackSink,
  options: CatalogCopyControllerOptions = {},
) {
  const schedule = options.schedule ?? setTimeout;
  const cancel = options.cancel ?? clearTimeout;
  const duration = options.duration ?? 2400;
  let mounted = false;
  let lifecycle = 0;
  let timer: number | ReturnType<typeof setTimeout> | undefined;

  return {
    mount() {
      mounted = true;
      const activeLifecycle = ++lifecycle;
      return () => {
        if (activeLifecycle !== lifecycle) return;
        mounted = false;
        lifecycle += 1;
        if (timer !== undefined) cancel(timer);
        timer = undefined;
      };
    },
    async copy(value: string, label: string, clipboard?: ClipboardWriter) {
      const activeLifecycle = lifecycle;
      sink.setError('');
      try {
        await copyCatalogValue(value, clipboard);
        if (!mounted || activeLifecycle !== lifecycle) return;
        sink.setFeedback(label);
        if (timer !== undefined) cancel(timer);
        timer = schedule(() => {
          if (mounted && activeLifecycle === lifecycle) sink.setFeedback('');
          timer = undefined;
        }, duration);
      } catch (error) {
        if (!mounted || activeLifecycle !== lifecycle) return;
        sink.setFeedback('');
        sink.setError(error instanceof Error ? error.message : 'Не удалось скопировать. Скопируйте видимый текст вручную.');
      }
    },
  };
}
