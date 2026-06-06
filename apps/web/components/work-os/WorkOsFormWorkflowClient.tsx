"use client";

import { useMemo, useState } from "react";
import type { FormWorkflowEntity, WorkOsFormTemplate, WorkOsFormWorkflow } from "@/lib/enterprise/work-os-form-workflows";
import { WorkOsBadge } from "@/components/work-os/WorkOsBlocks";

type Props = {
  workflows: WorkOsFormWorkflow[];
  templates: WorkOsFormTemplate[];
};

const defaultEntity: FormWorkflowEntity = "task";

export function WorkOsFormWorkflowClient({ workflows, templates }: Props) {
  const [entity, setEntity] = useState<FormWorkflowEntity>(defaultEntity);
  const [result, setResult] = useState<string>("No preview generated yet.");

  const workflow = useMemo(() => workflows.find((item) => item.entity === entity) ?? workflows[0], [entity, workflows]);
  const template = useMemo(() => templates.find((item) => item.entity === entity) ?? templates[0], [entity, templates]);

  function generatePreview() {
    const fields = template.sections.flatMap((section) => section.fields);
    const payload = Object.fromEntries(fields.map((field) => [field.id, field.type === "number" ? 1 : `${field.label} demo`]));
    setResult(JSON.stringify({ entity, mode: workflow.writeMode, accepted: true, persisted: workflow.writeMode === "enabled", payload, audit: workflow.auditContract }, null, 2));
  }

  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-950">Interactive form workflow console</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Alege un flux operational si genereaza preview pentru audit/write gate. Formularul ramane safe pana cand write mode este enabled.</p>
        </div>
        <WorkOsBadge value={workflow.writeMode} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="space-y-2">
          {workflows.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setEntity(item.entity)}
              className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-black ring-1 ${entity === item.entity ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : "bg-slate-50 text-slate-700 ring-slate-200"}`}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xl font-black text-slate-950">{workflow.title}</div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{workflow.description}</p>
            </div>
            <button type="button" onClick={generatePreview} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm hover:bg-slate-800">
              Generate preview
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {template.sections.map((section) => (
              <div key={section.id} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <div className="font-black text-slate-950">{section.title}</div>
                <div className="mt-3 space-y-3">
                  {section.fields.map((field) => (
                    <label key={field.id} className="block">
                      <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{field.label}{field.required ? " *" : ""}</span>
                      {field.type === "select" ? (
                        <select className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                          {(field.options ?? ["Demo"]).map((option) => <option key={option}>{option}</option>)}
                        </select>
                      ) : field.type === "textarea" ? (
                        <textarea className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700" placeholder={field.placeholder ?? field.label} />
                      ) : (
                        <input className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700" type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"} placeholder={field.placeholder ?? field.label} />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <pre className="mt-5 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{result}</pre>
        </div>
      </div>
    </section>
  );
}
