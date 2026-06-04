import { projects, tasks } from "@servelect/shared";
import { Badge } from "@/components/ui/Badge";

const colors = ["bg-servelect-600", "bg-blue-600", "bg-violet-600", "bg-amber-500", "bg-red-500"];

export function GanttTimeline() {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1080px]">
        <div className="grid grid-cols-[220px_1fr] border-b border-slate-100 text-xs font-bold text-slate-500">
          <div className="px-4 py-3">Proiect</div>
          <div className="grid grid-cols-8 text-center">
            {["Săpt. 20", "Săpt. 21", "Săpt. 22", "Săpt. 23", "Săpt. 24", "Săpt. 25", "Săpt. 26", "Săpt. 27"].map((w) => <div key={w} className="border-l border-slate-100 px-3 py-3">{w}</div>)}
          </div>
        </div>
        <div className="gantt-grid relative">
          <div className="absolute left-[62%] top-0 h-full w-px bg-red-500"><span className="absolute -top-2 -translate-x-1/2 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">azi</span></div>
          {projects.map((project, index) => {
            const start = 6 + index * 9;
            const width = 32 + project.progress / 2;
            return (
              <div key={project.id} className="grid h-14 grid-cols-[220px_1fr] items-center border-b border-slate-100 last:border-0">
                <div className="px-4">
                  <div className="text-xs font-bold text-servelect-700">{project.code}</div>
                  <div className="text-xs text-slate-500">{project.clientName} · {project.location}</div>
                </div>
                <div className="relative h-full">
                  <div className={`absolute top-4 h-7 rounded-lg px-3 py-1 text-xs font-bold text-white shadow-sm ${colors[index % colors.length]}`} style={{ left: `${start}%`, width: `${Math.min(width, 72 - start)}%` }}>
                    {tasks[index]?.title ?? project.phase} <span className="float-right">{project.progress}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2 border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          <Badge tone="green">În desfășurare</Badge><Badge tone="blue">Planificat</Badge><Badge tone="red">În întârziere</Badge><Badge tone="purple">Finalizat</Badge>
        </div>
      </div>
    </div>
  );
}
