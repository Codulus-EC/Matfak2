/**
 * Документы школьного раздела.
 *
 * Локальные файлы из /public/docs открываются напрямую.
 * Старые внешние ссылки (если когда-нибудь снова появятся в данных)
 * продолжают работать через резервный серверный route.
 */
export function schoolDocumentHref(source: string): string {
  if (source.startsWith("/")) return source;
  return `/api/document?source=${encodeURIComponent(source)}`;
}
