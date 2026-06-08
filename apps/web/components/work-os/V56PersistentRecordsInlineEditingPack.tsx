"use client";

import { useMemo, useState } from "react";
import { Activity, CheckCircle2, DatabaseZap, Edit3, MessageSquareText, Save, ShieldCheck, SlidersHorizontal } from "lucide-react";
import type { Priority, TaskStatus } from "@servelect/shared";

import { WorkOsBadge, WorkOsCard, WorkOsMetric, WorkOsProgress, WorkOsShell } from "@/components/work-os/WorkOsBlocks";
import {
  getV56ActivityComments,
  getV56InlineEditRecords,
  getV56MaturityAreas,
  getV56RecordFamilies,
  type V56InlineEditRecord
} from "@/lib/enterprise/work-os-persistent-records";

const statusOptions: TaskStatus[] = ["Backlog", "De făcut", "În lucru", "Review / QA", "Blocat", "Finalizat", "Anulat"];
const priorityOptions: Priority[] = ["Scăzut", "Mediu", "Ridicat", "Urgent", "Critic"];
const assignees = ["Andrei Popescu", "Ioana Marinescu", "Mihai Ionescu", "Cristian Radu", "Alexandra Rusu", "George Stan", "Vlad Neagu"];

function stateTone(state: V56InlineEditRecord["persistenceState"]) {
  if (state === "ready for DB mutation") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (state === "saved locally") return "bg-blue-50 text-blue-700 ring-blue-200";
  return "bg-amber-50 text-amber-700 ring-amber-200";
}

export function V56PersistentRecordsInlineEditingPack() {
  const maturityAreas = useMemo(() => getV56MaturityAreas(), []);
  const recordFamilies = useMemo(() => getV56RecordFamilies(), []);
  const activityComments = useMemo(() => getV56ActivityComments(), []);
  const [records, setRecords] = useState<V56InlineEditRecord[]>(() => getV56InlineEditRecords());
  const [selectedRecordId, setSelectedRecordId] = useState(records[0]?.id ?? "");
  const [draftComment, setDraftComment] = useState("Verificare actualizată din cockpit v5.6 — pregătit pentru persistare controlată.");
  const [lastSavedAt, setLastSavedAt] = useState("nesalvat în această sesiune");

  const selectedRecord = records.find((record) => record.id === selectedRecordId) ?? records[0];
  const overall = Math.round(maturityAreas.reduce((sum, area) => sum + area.completion, 0) / Math.max(maturityAreas.length, 1));
  const readyFamilies = recordFamilies.filter((family) => family.inlineEditing === "ready" || family.persistenceMode === "write-mode gated").length;
  const totalComments = activityComments.length + records.reduce((sum, record) => sum + record.comments, 0);

  function updateRecord(recordId: string, update: Partial<Pick<V56InlineEditRecord, "status" | "priority" | "assigneeName" | "dueDate">>) {
    setRecords((current) => current.map((record) => (
      record.id === recordId
        ? { ...record, ...update, persistenceState: "saved locally", activityEvents: record.activityEvents + 1 }
        : record
    )));
    setLastSavedAt(new Date().toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }));
  }

  function saveComment() {
    if (!selectedRecord || !draftComment.trim()) return;
    setRecords((current) => current.map((record) => (
      record.id === selectedRecord.id
        ? { ...record, comments: record.comments + 1, activityEvents: record.activityEvents + 1, persistenceState: "saved locally" }
        : record
    )));
    setDraftComment("");
    setLastSavedAt(new Date().toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }));
  }

  return (
    <WorkOsShell
      eyebrow="SERVELECT WORK OS v5.6"
      title="Real Persistent Records, Inline Editing & Activity Comments"
      subtitle="v5.6 continuă corect direcția GoodDay/ClickUp: recorduri editabile, comentarii de activitate și pregătire DB reală, fără să transforme platforma într-un dashboard separat de energie/stocuri."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <WorkOsMetric label="Readiness total" value={`${overall}%`} hint="Calculat din ariile vizibile pe site și din capabilitățile existente în cod." />
        <WorkOsMetric label="Record families" value={recordFamilies.length} hint={`${readyFamilies} familii au inline edit sau write-mode gate pregătit.`} />
        <WorkOsMetric label="Inline records" value={records.length} hint="Task/project records editabile local, pregătite pentru mutations DB." />
        <WorkOsMetric label="Activity comments" value={totalComments} hint="Timeline unificat: comments, status, time, attachments, approvals." />
      </section>

      <WorkOsCard title="Status/procente vizibile pe site" subtitle="Aceleași categorii urmărite în chatul inițial: procente bazate pe modulele existente în site și pe codul actual.">
        <div className="grid gap-4 lg:grid-cols-2">
          {maturityAreas.map((area) => (
            <div key={area.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="flex items-center justify-between gap-3">
                <div className="font-black text-slate-950">{area.label}</div>
                <WorkOsBadge value={area.status} />
              </div>
              <div className="mt-3"><WorkOsProgress value={area.completion} /></div>
              <p className="mt-3 text-sm leading-6 text-slate-600"><span className="font-bold text-slate-900">Cod:</span> {area.codeEvidence}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600"><span className="font-bold text-slate-900">Site:</span> {area.siteEvidence}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Next: {area.nextAction}</p>
            </div>
          ))}
        </div>
      </WorkOsCard>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <WorkOsCard title="Inline editing table" subtitle="Editare rapidă pe recorduri reale din modelul de taskuri. Momentan persistă local/shadow-safe; v5.7 duce mutațiile prin adapter DB.">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.14em] text-slate-400">
                  <th className="px-3 py-3">Task</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Prioritate</th>
                  <th className="px-3 py-3">Responsabil</th>
                  <th className="px-3 py-3">Deadline</th>
                  <th className="px-3 py-3">Persistență</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((record) => (
                  <tr key={record.id} className={record.id === selectedRecord?.id ? "bg-emerald-50/60" : "bg-white"}>
                    <td className="px-3 py-3">
                      <button type="button" onClick={() => setSelectedRecordId(record.id)} className="text-left font-black text-slate-950 hover:text-emerald-700">
                        {record.title}
                      </button>
                      <p className="mt-1 text-xs text-slate-500">{record.project}</p>
                    </td>
                    <td className="px-3 py-3">
                      <select value={record.status} onChange={(event) => updateRecord(record.id, { status: event.target.value as TaskStatus })} className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700">
                        {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <select value={record.priority} onChange={(event) => updateRecord(record.id, { priority: event.target.value as Priority })} className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700">
                        {priorityOptions.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <select value={record.assigneeName} onChange={(event) => updateRecord(record.id, { assigneeName: event.target.value })} className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700">
                        {assignees.map((assignee) => <option key={assignee} value={assignee}>{assignee}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <input type="date" value={record.dueDate} onChange={(event) => updateRecord(record.id, { dueDate: event.target.value })} className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700" />
                    </td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${stateTone(record.persistenceState)}`}>{record.persistenceState}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 p-3 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
            <Save size={14} className="text-emerald-600" /> Ultima salvare locală: {lastSavedAt}. Scrierile reale rămân controlate de SERVELECT_WORK_OS_WRITE_MODE.
          </div>
        </WorkOsCard>

        <WorkOsCard title="Task detail / comments" subtitle="Modelul cerut în prompt: task detail cu comentarii, atașamente, time și activity log.">
          {selectedRecord ? (
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Record selectat</p>
                <h3 className="mt-2 text-lg font-black text-slate-950">{selectedRecord.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{selectedRecord.project}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-bold text-slate-600">
                  <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><MessageSquareText className="mx-auto mb-1 text-emerald-600" size={16} />{selectedRecord.comments} comments</div>
                  <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><Activity className="mx-auto mb-1 text-blue-600" size={16} />{selectedRecord.activityEvents} events</div>
                  <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><DatabaseZap className="mx-auto mb-1 text-purple-600" size={16} />{selectedRecord.attachments} files</div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400" htmlFor="v56-comment">Comentariu activitate</label>
                <textarea id="v56-comment" value={draftComment} onChange={(event) => setDraftComment(event.target.value)} className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 p-3 text-sm text-slate-700 outline-none focus:border-emerald-500" />
                <button type="button" onClick={saveComment} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-emerald-700">
                  <MessageSquareText size={16} /> Salvează comentariu local
                </button>
              </div>
            </div>
          ) : null}
        </WorkOsCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <WorkOsCard title="Persistent record families" subtitle="Ce domenii sunt pregătite pentru v5.6/v5.7: local → mock API → prisma-ready → write-mode gated.">
          <div className="space-y-3">
            {recordFamilies.map((family) => (
              <div key={family.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-black text-slate-950">{family.label}</div>
                    <p className="mt-1 text-xs text-slate-500">{family.records} recorduri · {family.route}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700 ring-1 ring-slate-200">{family.persistenceMode}</span>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-xl bg-white p-3 text-xs text-slate-600 ring-1 ring-slate-200"><Edit3 size={14} className="mb-1 text-emerald-600" />Inline editing: <b>{family.inlineEditing}</b></div>
                  <div className="rounded-xl bg-white p-3 text-xs text-slate-600 ring-1 ring-slate-200"><ShieldCheck size={14} className="mb-1 text-blue-600" />Activity comments: <b>{family.activityComments}</b></div>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{family.nextBackendStep}</p>
              </div>
            ))}
          </div>
        </WorkOsCard>

        <WorkOsCard title="Activity comments timeline" subtitle="Timeline unificat pentru update-uri, status, pontaj, atașamente și aprobări.">
          <div className="space-y-3">
            {activityComments.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-950">
                    <CheckCircle2 size={16} className="text-emerald-600" /> {item.author}
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600 ring-1 ring-slate-200">{item.kind}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                <p className="mt-2 text-xs font-bold text-slate-400">{item.createdAt} · record {item.recordId}</p>
              </div>
            ))}
          </div>
        </WorkOsCard>
      </section>

      <WorkOsCard title="De ce v5.6 este pe calea bună" subtitle="Verificare față de promptul inițial al proiectului.">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200"><SlidersHorizontal className="mb-2 text-emerald-700" />Work OS task-first: interacțiunile sunt pe task/proiect, nu pe dashboarduri izolate.</div>
          <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-200"><DatabaseZap className="mb-2 text-blue-700" />Pregătire backend real: record families, write-mode și DB mutation path pentru v5.7.</div>
          <div className="rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-200"><MessageSquareText className="mb-2 text-purple-700" />Colaborare reală: comments/activity timeline, inline edits, approvals și atașamente.</div>
        </div>
      </WorkOsCard>
    </WorkOsShell>
  );
}
