import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function FreelancerProfile() {
  const [profile, setProfile] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchProposals();
  }, []);

  async function fetchProfile() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData?.user) {
      setProfile({});
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single();

    setProfile(data || {});
    setLoading(false);
  }

  async function fetchProposals() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    const { data } = await supabase
      .from("proposals")
      .select(`id, bid_amount, status, jobs(title)`)
      .eq("freelancer_id", userData.user.id);

    setProposals(data || []);
  }

  // 🔥 Loading state
  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  // 🔥 No profile case
  if (!profile?.full_name) {
    return (
      <div className="p-6">
        <p>No profile found.</p>
        <button
          onClick={() => navigate("/edit-profile")}
          className="mt-3 bg-black text-white px-4 py-2"
        >
          Create Profile
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Profile */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <img
            src={profile.avatar_url || "/default-avatar.png"}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover"
          />

          <div>
            <h2 className="text-xl font-bold">
              {profile.full_name}
            </h2>

            <p className="text-gray-600">
              {profile.title || "No title"}
            </p>
          </div>
        </div>

        <p className="mt-3">
          {profile.bio || "No bio added"}
        </p>

        <div className="mt-3">
          {profile.skills?.length ? (
            profile.skills.map((s, i) => (
              <span key={i} style={{ marginRight: "5px" }}>
                {s}
              </span>
            ))
          ) : (
            <p className="text-gray-400">No skills</p>
          )}
        </div>

        <button
          onClick={() => navigate("/edit-profile")}
          className="mt-4 bg-black text-white px-4 py-2"
        >
          Edit Profile
        </button>
      </div>

      {/* Proposals */}
      <div>
        <h3 className="font-bold mb-3">My Proposals</h3>

        {proposals.length === 0 ? (
          <p className="text-gray-400">No proposals yet</p>
        ) : (
          proposals.map((p) => (
            <div key={p.id} className="border-b py-2">
              <p>{p.jobs?.title || "Untitled Job"}</p>
              <p>${p.bid_amount}</p>
              <p>{p.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
