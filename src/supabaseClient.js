import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cwktjjvbdvgfnsoxsvzs.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3a3RqanZiZHZnZm5zb3hzdnpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MTExOTMsImV4cCI6MjA4ODk4NzE5M30.2xyIHiePn5SflkjHjfW4b1IPi9yLtKpARZ25GmqjULU";

export const supabase = createClient(supabaseUrl, supabaseKey);
