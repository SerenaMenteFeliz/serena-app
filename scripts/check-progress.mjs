import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://ddgtoebsmmyneumolycy.supabase.co", process.argv[2]);

const { data: bp } = await supabase.from("book_progress").select("*");
console.log("book_progress:", bp);
const { data: lp } = await supabase.from("lesson_progress").select("*");
console.log("lesson_progress:", lp);
