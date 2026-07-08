import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://ddgtoebsmmyneumolycy.supabase.co", process.argv[2]);

const { data: access } = await supabase.from("product_access").select("*").eq("product", "metodo_calice");
console.log("product_access:", access);

const { data: events } = await supabase.from("product_events").select("event_type, payload, created_at").order("created_at");
console.log("eventos:", events);
