import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://ddgtoebsmmyneumolycy.supabase.co", process.argv[2]);
const { data, error } = await supabase.from("product_completion_rules").select("*");
console.log("rules:", data, "error:", error);
