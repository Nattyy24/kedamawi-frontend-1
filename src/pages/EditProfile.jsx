import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const [form, setForm] = useState({
    full_name: "",
    title: "",
    bio: "",
    skills: ""
  });

  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single();

    if (data) {
      setForm({
        full_name: data.full_name || "",
        title: data.title || "",
        bio: data.bio || "",
        skills: data.skills?.join(", ") || ""
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    let avatarUrl = null;

    // 🔥 Upload avatar
    if (avatar) {
      const fileExt = avatar.name.split(".").pop();
      const fileName = `${userData.user.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatar, { upsert: true });

      if (!uploadError) {
        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

        avatarUrl = data.publicUrl;
      }
    }

    const skillsArray = form.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    await supabase.from("profiles").upsert({
      id: userData.user.id,
      full_name: form.full_name,
      title: form.title,
      bio: form.bio,
      skills: skillsArray,
      avatar_url: avatarUrl || undefined
    });

    navigate("/freelancer-profile");
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-lg font-bold mb-4">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          placeholder="Name"
          value={form.full_name}
          onChange={(e) =>
            setForm({ ...form, full_name: e.target.value })
          }
          className="w-full border p-2"
        />

        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          className="w-full border p-2"
        />

        <textarea
          placeholder="Bio"
          value={form.bio}
          onChange={(e) =>
            setForm({ ...form, bio: e.target.value })
          }
          className="w-full border p-2"
        />

        <input
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={(e) =>
            setForm({ ...form, skills: e.target.value })
          }
          className="w-full border p-2"
        />

        {/* 🔥 Avatar Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
        />

        <button className="bg-black text-white px-4 py-2">
          Save
        </button>
      </form>
    </div>
  );
}
