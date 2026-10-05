"use client";

import { ArrowRight, ArrowUpRight, Check, ExternalLink, FileText, ListChecks, Wallet } from "lucide-react";
import { officialDestinations, type Widget } from "@/lib/widgets";

type Props = {
  widget: Widget;
  state: Record<string, unknown>;
  onStateChange: (id: string, value: unknown) => void;
  onChoice: (value: string) => void;
};

export function WidgetRenderer({ widget, state, onStateChange, onChoice }: Props) {
  switch (widget.type) {
    case "choice":
      return <div className="widget choice-widget"><h3>{widget.title}</h3><div className="choice-options">{widget.options.map((option) => <button key={option.id} type="button" onClick={() => onChoice(option.value)}>{option.label}<ArrowRight size={16} /></button>)}</div></div>;
    case "checklist": {
      const values = typeof state[widget.id] === "object" && state[widget.id] !== null ? state[widget.id] as Record<string, boolean> : {};
      const completed = widget.items.filter((item) => values[item.id]).length;
      return <div className="widget checklist-widget"><div className="widget-heading"><div className="widget-icon"><ListChecks size={20} /></div><div><h3>{widget.title}</h3><p>{completed} sur {widget.items.length} prêts</p></div></div><div className="checklist-items">{widget.items.map((item) => <label key={item.id} className={values[item.id] ? "checked" : ""}><input type="checkbox" checked={Boolean(values[item.id])} onChange={(event) => onStateChange(widget.id, { ...values, [item.id]: event.target.checked })} /><span className="custom-check"><Check size={14} /></span><span>{item.label}</span></label>)}</div></div>;
    }
    case "stepper": {
      const current = typeof state[widget.id] === "number" ? Math.min(state[widget.id] as number, widget.steps.length - 1) : 0;
      return <div className="widget stepper-widget"><h3>{widget.title}</h3><div className="steps">{widget.steps.map((step, index) => <button type="button" key={step.id} className={`step ${index <= current ? "active" : ""}`} onClick={() => onStateChange(widget.id, index)} aria-label={`Étape ${index + 1} : ${step.label}`}><span className="step-number">{index < current ? <Check size={15} /> : String(index + 1).padStart(2, "0")}</span><span className="step-copy"><strong>{step.label}</strong>{step.description && <small>{step.description}</small>}</span></button>)}</div></div>;
    }
    case "fee":
      return <div className="widget fee-widget"><Wallet size={21} /><div><h3>{widget.title}</h3><strong>{widget.amount}</strong><p>{widget.note}</p></div></div>;
    case "source":
      return <a className="widget source-widget" href={widget.url} target="_blank" rel="noopener noreferrer"><div className="widget-icon"><FileText size={20} /></div><div><span>Source officielle</span><h3>{widget.title}</h3><p>{widget.publisher}</p></div><ExternalLink className="source-arrow" size={18} /></a>;
    case "official_action":
      return <a className="official-action" href={officialDestinations[widget.destinationId]} target="_blank" rel="noopener noreferrer">{widget.label}<ArrowUpRight size={18} /></a>;
  }
}
