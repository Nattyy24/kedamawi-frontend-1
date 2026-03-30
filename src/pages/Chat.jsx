import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true });

    setMessages(data || []);
  }

  async function sendMessage() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    await supabase.from("messages").insert({
      sender_id: userData.user.id,
      content: text
    });

    setText("");
    loadMessages();
  }

  return (
    <div>
      <h2>Chat 💬</h2>

      <div>
        {messages.map((m) => (
          <p key={m.id}>{m.content}</p>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}