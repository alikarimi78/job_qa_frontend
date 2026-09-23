/** Sets the browser tab title to the page name followed by the app name, or the app name alone when the page has no title. */
import { useEffect } from "react";
import { APP_TITLE } from "@constants/appInfo";

export default function useDocumentTitle(pageTitle) {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} - ${APP_TITLE}` : APP_TITLE;
  }, [pageTitle]);
}
