import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://ddgtoebsmmyneumolycy.supabase.co", process.argv[2]);
const contactId = "b731fef1-e007-43bd-b4a8-9ce96baec30a";

await supabase.from("lesson_progress").delete().eq("contact_id", contactId);
await supabase.from("book_progress").delete().eq("contact_id", contactId);
await supabase.from("product_events").delete().eq("contact_id", contactId);
await supabase.from("product_access").update({ completed_at: null }).eq("contact_id", contactId);
console.log("progresso de teste resetado");
