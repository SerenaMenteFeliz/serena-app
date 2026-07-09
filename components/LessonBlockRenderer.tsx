import ReactMarkdown from "react-markdown";
import type { LessonBlock } from "@/lib/calice";

export function LessonBlockRenderer({ block }: { block: LessonBlock }) {
  switch (block.block_type) {
    case "text":
      return (
        <div className="glass-card reading-content rounded-[20px] px-6 py-6">
          <ReactMarkdown>{block.content.markdown ?? ""}</ReactMarkdown>
        </div>
      );
    case "video":
      return (
        <div className="glass-card aspect-video w-full overflow-hidden rounded-[20px] p-0">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${block.content.youtube_id}`}
            title="Vídeo da aula"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    case "image":
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={block.content.url} alt={block.content.alt ?? ""} className="w-full rounded-[20px]" />;
    default:
      return null;
  }
}
