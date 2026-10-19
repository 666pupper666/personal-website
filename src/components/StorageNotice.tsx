import { useSiteData } from '../context/SiteDataContext';

/** 本地数据异常提示，不覆盖原始数据，只提示并提供重新读取 */
export function StorageNotice() {
  const { storageIssue, reload } = useSiteData();

  if (!storageIssue) {
    return null;
  }

  return (
    <div className="storage-notice" role="alert">
      <span className="storage-notice__icon" aria-hidden="true">
        !
      </span>
      <div className="storage-notice__body">
        <strong>本地数据提示</strong>
        <p>{storageIssue}</p>
      </div>
      <button type="button" className="btn btn--small btn--ghost" onClick={reload}>
        重新读取
      </button>
    </div>
  );
}
