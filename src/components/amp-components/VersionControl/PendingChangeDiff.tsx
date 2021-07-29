import React from "react";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";
import usePendingChangeDiff, { EnumCompareType, Props } from "@hooks/usePendingChangeDiff";
import "./PendingChangeDiff.scss";

const CLASS_NAME = "pending-change-diff";

const PendingChangeDiff = ({
  change,
  compareType = EnumCompareType.Pending,
  splitView,
}: Props) => {
  
  const {
    otherValue,
    newValue,
    loadingOtherVersion,
    loadingCurrentVersion,
  } = usePendingChangeDiff(
    {
      change,
      compareType,
      splitView
    }
  );

  const defaultStyles = {
    variables: {
      light: {
        diffViewerBackground: '#fff',
        diffViewerColor: '212529',
        addedBackground: '#e6ffed',
        addedColor: '#24292e',
        removedBackground: '#ffeef0',
        removedColor: '#24292e',
        wordAddedBackground: '#acf2bd',
        wordRemovedBackground: '#fdb8c0',
        addedGutterBackground: '#cdffd8',
        removedGutterBackground: '#ffdce0',
        gutterBackground: '#f7f7f7',
        gutterBackgroundDark: '#f3f1f1',
        highlightBackground: '#fffbdd',
        highlightGutterBackground: '#fff5b1',
        codeFoldGutterBackground: '#dbedff',
        codeFoldBackground: '#f1f8ff',
        emptyLineBackground: '#fafbfc',
        gutterColor: '#212529',
        addedGutterColor: '#212529',
        removedGutterColor: '#212529',
        codeFoldContentColor: '#212529',
        diffViewerTitleBackground: '#fafbfc',
        diffViewerTitleColor: '#212529',
        diffViewerTitleBorderColor: '#eee',
      },
      dark: {
        diffViewerBackground: '#2e303c',
        diffViewerColor: '#FFF',
        addedBackground: '#044B53',
        addedColor: 'white',
        removedBackground: '#632F34',
        removedColor: 'white',
        wordAddedBackground: '#055d67',
        wordRemovedBackground: '#7d383f',
        addedGutterBackground: '#034148',
        removedGutterBackground: '#632b30',
        gutterBackground: '#2c2f3a',
        gutterBackgroundDark: '#262933',
        highlightBackground: '#2a3967',
        highlightGutterBackground: '#2d4077',
        codeFoldGutterBackground: '#21232b',
        codeFoldBackground: '#262831',
        emptyLineBackground: '#363946',
        gutterColor: '#464c67',
        addedGutterColor: '#8c8c8c',
        removedGutterColor: '#8c8c8c',
        codeFoldContentColor: '#555a7b',
        diffViewerTitleBackground: '#2f323e',
        diffViewerTitleColor: '#555a7b',
        diffViewerTitleBorderColor: '#353846',
      }
    },
    
  }

  return (
    <div className={CLASS_NAME}>
      {loadingCurrentVersion || loadingOtherVersion ? (
        "Loading..."
      ) : (
        <ReactDiffViewer
          styles={defaultStyles}
          compareMethod={DiffMethod.WORDS}
          oldValue={otherValue}
          newValue={newValue}
          leftTitle={splitView ? "This Version" : undefined}
          rightTitle="Previous Version"
          splitView={splitView}
          useDarkTheme={false}
        />
      )}
    </div>
  );
};

export default PendingChangeDiff;
