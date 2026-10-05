import { z } from "zod";

const choice = z.object({
  type: z.literal("choice"),
  id: z.string(),
  title: z.string(),
  options: z.array(z.object({ id: z.string(), label: z.string(), value: z.string() })),
});

const checklist = z.object({
  type: z.literal("checklist"),
  id: z.string(),
  title: z.string(),
  items: z.array(z.object({ id: z.string(), label: z.string() })),
});

const stepper = z.object({
  type: z.literal("stepper"),
  id: z.string(),
  title: z.string(),
  steps: z.array(z.object({ id: z.string(), label: z.string(), description: z.string().optional() })),
});

const fee = z.object({
  type: z.literal("fee"),
  id: z.string(),
  title: z.string(),
  amount: z.string(),
  note: z.string(),
});

const source = z.object({
  type: z.literal("source"),
  id: z.string(),
  title: z.string(),
  publisher: z.string(),
  url: z.url().refine((url) => {
    const host = new URL(url).hostname;
    return host === "servicepublic.gouv.ci" || host === "cepici.gouv.ci";
  }, "Source non autorisée"),
});

const officialAction = z.object({
  type: z.literal("official_action"),
  id: z.string(),
  label: z.string(),
  destinationId: z.enum(["passport", "company", "birth"]),
});

export const widgetSchema = z.discriminatedUnion("type", [
  choice,
  checklist,
  stepper,
  fee,
  source,
  officialAction,
]);

export const assistantResponseSchema = z.object({
  message: z.string(),
  intent: z.string(),
  widgets: z.array(widgetSchema),
});

export type Widget = z.infer<typeof widgetSchema>;
export type AssistantResponse = z.infer<typeof assistantResponseSchema>;

export const officialDestinations = {
  passport: "https://servicepublic.gouv.ci/accueil/detaildemarcheparticulier/2/288/",
  company: "https://cepici.gouv.ci/creation_entreprise",
  birth: "https://servicepublic.gouv.ci/accueil/detaildemarcheparticulier/2/480/24",
} as const;
