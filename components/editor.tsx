"use client";
import { useState, useMemo, useCallback } from "react";
import { EditorState, ContentState, convertFromHTML, convertToRaw } from "draft-js";
import { Editor as DraftEditor } from "draft-js";
import "draft-js/dist/Draft.css"; // Import Draft.js CSS

interface EditorProps {
    onChange: (value: string) => void;
    value: string;
};

export const Editor = ({
    onChange,
    value,
}: EditorProps) => {
    const [editorState, setEditorState] = useState(() => {
        // Initialize the editor state with the current value, if any
        const contentState = value
            ? ContentState.createFromText(value)
            : ContentState.createFromText(""); // Default empty text
        return EditorState.createWithContent(contentState);
    });

    const handleEditorChange = useCallback(
        (state: EditorState) => {
            setEditorState(state);
            const currentContent = state.getCurrentContent();
            // Convert the editor content to raw text (or HTML if needed)
            onChange(currentContent.getPlainText());
        },
        [onChange]
    );

    return (
        <div className="bg-white">
            <DraftEditor
                editorState={editorState}
                onChange={handleEditorChange}
            />
        </div>
    );
};
