import ReactMarkdown from "react-markdown";
import type { LessonBlock } from "@/lib/calice";

export function LessonBlockRenderer({ block }: { block: LessonBlock }) {
  switch (block.block_type) {
    case "text":
      return (
        <div className="prose prose-invert max-w-none leading-relaxed">
          <ReactMarkdown>{block.content.markdown ?? ""}</ReactMarkdown>
        </div>
      );
    case "video":
      return (
        <div className="aspect-video w-full overflow-hidden rounded-lg">
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
      return <img src={block.content.url} alt={block.content.alt ?? ""} className="w-full rounded-lg" />;
    default:
      return null;
  }
}
