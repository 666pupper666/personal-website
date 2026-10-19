import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** 危险操作会使用警示色，并默认把焦点放在取消按钮上 */
  danger?: boolean;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  const close = useCallback((result: boolean) => {
    resolver.current?.(result);
    resolver.current = null;
    setOptions(null);
  }, []);

  const confirm = useCallback<ConfirmFn>((nextOptions) => {
    return new Promise<boolean>((resolve) => {
      resolver.current?.(false);
      resolver.current = resolve;
      setOptions(nextOptions);
    });
  }, []);

  useEffect(() => {
    if (!options) {
      return;
    }

    restoreFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previouslyFocused = restoreFocus.current;
    document.body.classList.add('modal-open');

    const focusTarget = options.danger ? cancelRef.current : confirmRef.current;
    focusTarget?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close(false);
        return;
      }
      if (event.key !== 'Tab') {
        return;
      }
      const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>('[data-dialog-action]');
      if (!buttons || buttons.length === 0) {
        return;
      }
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-open');
      previouslyFocused?.focus();
      restoreFocus.current = null;
    };
  }, [options, close]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {options ? (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              close(false);
            }
          }}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            ref={dialogRef}
          >
            <h2 className="modal__title" id={titleId}>
              {options.title}
            </h2>
            <p className="modal__message" id={descId}>
              {options.message}
            </p>
            <div className="modal__actions">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => close(false)}
                ref={cancelRef}
                data-dialog-action
              >
                {options.cancelLabel ?? '取消'}
              </button>
              <button
                type="button"
                className={`btn ${options.danger ? 'btn--danger' : 'btn--primary'}`}
                onClick={() => close(true)}
                ref={confirmRef}
                data-dialog-action
              >
                {options.confirmLabel ?? '确认'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm 必须在 ConfirmProvider 内使用');
  }
  return context;
}
