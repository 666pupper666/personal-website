interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  maxLength?: number;
  required?: boolean;
  placeholder?: string;
  type?: 'text' | 'url' | 'date';
  autoComplete?: string;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  maxLength,
  required,
  placeholder,
  type = 'text',
  autoComplete,
}: TextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`field${error ? ' field--invalid' : ''}`}>
      <div className="field__label-row">
        <label className="field__label" htmlFor={id}>
          {label}
          {required ? (
            <span className="field__required" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
        {typeof maxLength === 'number' ? (
          <span className="field__counter" aria-hidden="true">
            {value.length}/{maxLength}
          </span>
        ) : null}
      </div>
      <input
        id={id}
        className="input"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      />
      {hint ? (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="field__error" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface TextAreaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  maxLength?: number;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  maxLength,
  required,
  placeholder,
  rows = 5,
}: TextAreaFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`field${error ? ' field--invalid' : ''}`}>
      <div className="field__label-row">
        <label className="field__label" htmlFor={id}>
          {label}
          {required ? (
            <span className="field__required" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
        {typeof maxLength === 'number' ? (
          <span className="field__counter" aria-hidden="true">
            {value.length}/{maxLength}
          </span>
        ) : null}
      </div>
      <textarea
        id={id}
        className="input textarea"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      />
      {hint ? (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="field__error" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
