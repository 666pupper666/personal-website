/** 把错误对象转换成可以直接展示的中文提示 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return '操作失败，请稍后重试。';
}
