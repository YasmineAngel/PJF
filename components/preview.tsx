"use client";

import { EditorState, ContentState } from "draft-js";
import { Editor } from "draft-js";
import { useMemo, useState, useEffect } from "react";

interface PreviewProps {
  value: string;
};

export const Preview = ({ value }: PreviewProps) => {
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());

  useEffect(() => {
    const contentState = ContentState.createFromText(value);
    const newEditorState = EditorState.createWithContent(contentState);
    setEditorState(newEditorState);
  }, [value]);

  return (
    <div className="bg-white">
      <Editor
        editorState={editorState}
        readOnly={true}
        onChange={() => {}}
      />
    </div>
  );
};
