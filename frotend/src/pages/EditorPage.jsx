import React, { useEffect, useRef, useState } from "react";
import Client from "./Client.jsx";
import Editor from "./Editor.jsx";
import { initSocket } from "../../socket.js";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ACTIONS from "../Actions";
import toast from "react-hot-toast";

function EditorPage() {
  const coderef = useRef("");
  const socketRef = useRef(null);
  const isMounted = useRef(false);

  const [clients, setClients] = useState([]);
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;

    const init = async () => {
      socketRef.current = await initSocket();

      const handleError = () => {
        toast.error("Socket connection failed");
        navigate("/");
      };

      socketRef.current.on("connect_error", handleError);
      socketRef.current.on("connect_failed", handleError);

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined`);
        }

        setClients(clients);

        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          socketId,
          code: coderef.current,
        });
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left`);
        setClients((prev) =>
          prev.filter((client) => client.socketId !== socketId)
        );
      });
    };

    init();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const copyRoomId = async () => {
    await navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied");
  };

  const leaveRoom = () => {
    socketRef.current.disconnect();
    navigate("/");
  };

  return (
    <div className="mainwrap">
      <div className="aside">
        <div className="asideinner">
          <div className="logo">
            <img className="editorpagelogo" src="/code-sync.png" alt="logo" />
          </div>

          <h3>Connected</h3>

          <div className="clientslist">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>

        <button className="btn copybtn" onClick={copyRoomId}>
          Copy RoomId
        </button>

        <button className="btn leavebtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>

      <div className="editorwrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => (coderef.current = code)}
        />
      </div>
    </div>
  );
}

export default EditorPage;
