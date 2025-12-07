import React, { useEffect, useRef } from "react";
import CodeMirror from "codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import ACTIONS from "../Actions";

function Editor({ roomId, socketRef, onCodeChange }) {
  const editorRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    editorRef.current = CodeMirror.fromTextArea(textareaRef.current, {
      mode: "javascript",
      theme: "dracula",
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineNumbers: true,
    });

    return () => editorRef.current?.toTextArea();
  }, []);

  useEffect(() => {
    if (!socketRef.current || !editorRef.current) return;

    const handleLocal = (instance, changes) => {
      const { origin } = changes;
      const code = instance.getValue();

      onCodeChange(code);

      if (origin !== "setValue") {
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
          roomId,
          code,
        });
      }
    };

    const handleRemote = ({ code }) => {
      const current = editorRef.current.getValue();
      if (code !== null && current !== code) {
        editorRef.current.setValue(code);
      }
    };

    editorRef.current.on("change", handleLocal);
    socketRef.current.on(ACTIONS.CODE_CHANGE, handleRemote);

    return () => {
      editorRef.current.off("change", handleLocal);
      socketRef.current.off(ACTIONS.CODE_CHANGE, handleRemote);
    };
  }, [socketRef.current]);

  return <textarea ref={textareaRef}></textarea>;
}

export default Editor;
