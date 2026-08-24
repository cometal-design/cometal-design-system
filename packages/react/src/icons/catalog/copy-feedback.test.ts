import { describe, expect, it, vi } from 'vitest';
import { createCatalogCopyController } from './copy-feedback';

function createSink() {
  return { setFeedback: vi.fn(), setError: vi.fn() };
}

describe('IconCatalog copy feedback lifecycle', () => {
  it('survives the StrictMode setup-cleanup-setup cycle and reports copy success', async () => {
    const sink = createSink();
    const controller = createCatalogCopyController(sink);
    const firstCleanup = controller.mount();
    firstCleanup();
    const secondCleanup = controller.mount();
    const writeText = vi.fn().mockResolvedValue(undefined);

    await controller.copy('Outline/arrows/arrow-left', 'Скопировано', { writeText });

    expect(writeText).toHaveBeenCalledWith('Outline/arrows/arrow-left');
    expect(sink.setFeedback).toHaveBeenCalledWith('Скопировано');
    secondCleanup();
  });

  it('surfaces unavailable and denied Clipboard API errors while mounted', async () => {
    const sink = createSink();
    const controller = createCatalogCopyController(sink);
    controller.mount();

    await controller.copy('value', 'ignored');
    expect(sink.setError).toHaveBeenLastCalledWith(expect.stringMatching(/Clipboard API/));

    await controller.copy('value', 'ignored', { writeText: vi.fn().mockRejectedValue(new Error('denied')) });
    expect(sink.setError).toHaveBeenLastCalledWith('denied');
  });

  it('cancels the feedback timer during cleanup', async () => {
    const sink = createSink();
    const timer = {} as ReturnType<typeof setTimeout>;
    const schedule = vi.fn(() => timer);
    const cancel = vi.fn();
    const controller = createCatalogCopyController(sink, { schedule, cancel });
    const cleanup = controller.mount();

    await controller.copy('value', 'Скопировано', { writeText: vi.fn().mockResolvedValue(undefined) });
    cleanup();

    expect(schedule).toHaveBeenCalledOnce();
    expect(cancel).toHaveBeenCalledWith(timer);
  });

  it('does not update state when an in-flight copy resolves after unmount', async () => {
    const sink = createSink();
    let resolveCopy: (() => void) | undefined;
    const pendingCopy = new Promise<void>((resolve) => { resolveCopy = resolve; });
    const controller = createCatalogCopyController(sink);
    const cleanup = controller.mount();
    const operation = controller.copy('value', 'Скопировано', { writeText: () => pendingCopy });

    cleanup();
    resolveCopy?.();
    await operation;

    expect(sink.setFeedback).not.toHaveBeenCalledWith('Скопировано');
  });
});
