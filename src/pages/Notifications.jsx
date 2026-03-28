import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Notifications({ user }) {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifs = async () => {
    const { data } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setNotifications(data);
  };

  const markRead = async (id) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    fetchNotifs();
  };

  useEffect(() => { fetchNotifs(); }, [user.id]);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map(n => (
          <li key={n.id} style={{ background: n.is_read ? "#f0f0f0" : "#fff" }}>
            {n.message} - {new Date(n.created_at).toLocaleString()}
            {!n.is_read && <button onClick={() => markRead(n.id)}>Mark Read</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
