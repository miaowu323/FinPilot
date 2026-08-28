import React, { useMemo, useRef } from "react";
import classNames from "classnames";
import { useMsgTypes } from "./useMsgTypes";
import HTMLRenderer from "./HTMLRenderer";
import useContent from "./useContent";
import MarkdownRenderer from "./MarkdownRenderer";
import TableRenderer from "./TableRenderer";
import FileRenderer from "./FileRenderer";
import ReactJsonPretty from "react-json-pretty";
import SearchListRenderer from "./SearchListRenderer";
import { PanelItemType } from "./type";
import { PanelProvider } from ".";
import { useMemoizedFn } from "ahooks";

interface ActionPanelProps {
  taskItem?: PanelItemType;
  allowShowToolBar?: boolean;
  /** HTML 任务以源码形式展示，而不是加载网页预览。 */
  showHtmlSource?: boolean;
  className?: string;
  noPadding?: boolean;
}

const ActionPanel: GenieType.FC<ActionPanelProps> = React.memo((props) => {
  const { taskItem, className, allowShowToolBar, showHtmlSource } = props;

  const msgTypes = useMsgTypes(taskItem);
  const { markDownContent } = useContent(taskItem);

  const { resultMap, toolResult } = taskItem || {};
  const [ fileInfo ] = resultMap?.fileInfo || [];
  const htmlUrl = fileInfo?.domainUrl;
  const downloadHtmlUrl = fileInfo?.ossUrl;

  const { codeOutput } = resultMap || {};

  const panelNode = useMemo(() => {
    const renderContent = () => {
      if (!taskItem) return null;
      const { useHtml, useCode, useFile, isHtml, useExcel, useJSON, searchList, usePpt } = msgTypes || {};

      if (searchList?.length) {
        return <SearchListRenderer list={searchList} />;
      }

      if (showHtmlSource && (useHtml || (useCode && isHtml))) {
        const htmlSource = codeOutput || toolResult?.toolResult || '';
        return <MarkdownRenderer markDownContent={`\`\`\`html\n${htmlSource}\n\`\`\``} />;
      }

      if (useHtml || usePpt) {
        return (
          <HTMLRenderer
            htmlUrl={htmlUrl}
            className="h-full"
            downloadUrl={downloadHtmlUrl}
            outputCode={codeOutput}
            showToolBar={allowShowToolBar && resultMap?.isFinal}
          />
        );
      }

      if (useCode && isHtml) {
        return (
          <HTMLRenderer
            htmlUrl={`data:text/html;charset=utf-8,${encodeURIComponent(toolResult?.toolResult || '')}`}
          />
        );
      }

      if (useExcel) {
        return <TableRenderer fileUrl={fileInfo?.domainUrl} fileName={fileInfo?.fileName} />;
      }

      if (useFile) {
        return <FileRenderer fileUrl={fileInfo?.domainUrl} fileName={fileInfo?.fileName} />;
      }

      if (useJSON) {
        return (
          <ReactJsonPretty
            data={JSON.parse(toolResult?.toolResult || '{}')}
            style={{ backgroundColor: '#000' }}
          />
        );
      }

      return <MarkdownRenderer markDownContent={markDownContent} />;
    };

    return renderContent();
  }, [
    taskItem,
    msgTypes,
    markDownContent,
    htmlUrl,
    downloadHtmlUrl,
    allowShowToolBar,
    showHtmlSource,
    resultMap?.isFinal,
    toolResult?.toolResult,
    fileInfo,
    codeOutput,
  ]);

  const ref = useRef<HTMLDivElement>(null);

  const scrollToBottom = useMemoizedFn(() => {
    setTimeout(() => {
      ref.current?.scrollTo({
        top: ref.current!.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  });

  return <PanelProvider value={{
    wrapRef: ref,
    scrollToBottom,
  }}>
    <div
      className={classNames('w-full px-16', className)}
      ref={ref}
    >
      { panelNode }
    </div>
  </PanelProvider>;
});

ActionPanel.displayName = 'ActionPanel';

export default ActionPanel;
