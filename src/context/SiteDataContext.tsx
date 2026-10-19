import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  clearSiteData,
  loadSiteData,
  saveSiteData,
} from '../api/siteData';
import { createDefaultData } from '../data/defaultData';
import { SITE } from '../data/limits';
import type { SiteData } from '../types';

interface SiteDataContextValue {
  data: SiteData;
  /** 本地数据异常提示；正常时为 null */
  storageIssue: string | null;
  /** 保存整份数据，失败时抛出错误，由调用方展示提示 */
  save: (next: SiteData) => void;
  /** 基于最新数据修改并保存 */
  update: (updater: (current: SiteData) => SiteData) => void;
  /** 清除本地数据并恢复示例数据 */
  resetToDefault: () => void;
  reload: () => void;
}

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

interface ProviderState {
  data: SiteData;
  storageIssue: string | null;
}

function createInitialState(): ProviderState {
  const result = loadSiteData();
  if (result.status === 'ok') {
    return { data: result.data, storageIssue: null };
  }
  return { data: createDefaultData(), storageIssue: result.message };
}

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProviderState>(createInitialState);
  const dataRef = useRef(state.data);

  useEffect(() => {
    dataRef.current = state.data;
  }, [state.data]);

  const save = useCallback((next: SiteData) => {
    const saved = saveSiteData(next);
    dataRef.current = saved;
    setState({ data: saved, storageIssue: null });
  }, []);

  const update = useCallback((updater: (current: SiteData) => SiteData) => {
    const next = updater(dataRef.current);
    const saved = saveSiteData(next);
    dataRef.current = saved;
    setState({ data: saved, storageIssue: null });
  }, []);

  const resetToDefault = useCallback(() => {
    const next = clearSiteData();
    dataRef.current = next;
    setState({ data: next, storageIssue: null });
  }, []);

  const reload = useCallback(() => {
    setState(createInitialState());
  }, []);

  // 同一浏览器的其他标签页保存后，同步更新当前页面
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== SITE.storageKey) {
        return;
      }
      const result = loadSiteData();
      if (result.status === 'ok') {
        dataRef.current = result.data;
        setState({ data: result.data, storageIssue: null });
      } else {
        setState((current) => ({ ...current, storageIssue: result.message }));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const value = useMemo<SiteDataContextValue>(
    () => ({
      data: state.data,
      storageIssue: state.storageIssue,
      save,
      update,
      resetToDefault,
      reload,
    }),
    [state, save, update, resetToDefault, reload],
  );

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData(): SiteDataContextValue {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData 必须在 SiteDataProvider 内使用');
  }
  return context;
}
