import { assistantResponseSchema, type AssistantResponse } from "./widgets";

type Topic = "passport" | "company" | "birth" | "unknown";

function detectTopic(question: string): Topic {
  const normalized = question.toLocaleLowerCase("fr");
  if (/passeport|voyage|renouvel/.test(normalized)) return "passport";
  if (/entreprise|sarl|commerce|business|société|societe/.test(normalized)) return "company";
  if (/naissance|état civil|etat civil|extrait/.test(normalized)) return "birth";
  return "unknown";
}

export function demoResponse(question: string): AssistantResponse {
  const topic = detectTopic(question);

  const responses: Record<Topic, AssistantResponse> = {
    passport: {
      intent: "passport.explain",
      message: "Pour demander ou renouveler un passeport ivoirien, commencez par vérifier la démarche officielle. Je peux vous aider à organiser les étapes. Les pièces et le tarif exacts dépendent de votre situation : consultez la source avant de déposer votre dossier.",
      widgets: [
        {
          type: "choice", id: "passport-kind", title: "Quelle est votre situation ?",
          options: [
            { id: "new", label: "Première demande", value: "première demande de passeport" },
            { id: "renew", label: "Renouvellement", value: "renouvellement de passeport" },
          ],
        },
        {
          type: "stepper", id: "passport-steps", title: "Votre parcours",
          steps: [
            { id: "verify", label: "Vérifier les conditions et les pièces", description: "Consultez la fiche officielle correspondant à votre situation." },
            { id: "prepare", label: "Préparer le dossier" },
            { id: "appoint", label: "Suivre la procédure indiquée par le service" },
          ],
        },
        { type: "fee", id: "passport-fee", title: "Frais de la démarche", amount: "À vérifier", note: "Le montant doit être confirmé sur la fiche officielle avant tout paiement." },
        { type: "source", id: "passport-source", title: "Demander un passeport", publisher: "Service public de Côte d’Ivoire", url: "https://servicepublic.gouv.ci/accueil/detaildemarcheparticulier/2/288/" },
        { type: "official_action", id: "passport-action", label: "Voir la démarche officielle", destinationId: "passport" },
      ],
    },
    company: {
      intent: "company.create",
      message: "Pour créer une entreprise en Côte d’Ivoire, le CEPICI présente les formalités et les documents selon la forme juridique. Choisissez votre projet, puis utilisez cette liste pour préparer vos questions avant de consulter la procédure officielle.",
      widgets: [
        {
          type: "choice", id: "company-kind", title: "Quel type de projet ?",
          options: [
            { id: "individual", label: "Entreprise individuelle", value: "entreprise individuelle" },
            { id: "sarl", label: "SARL", value: "SARL" },
            { id: "unsure", label: "Je ne sais pas encore", value: "création d’entreprise" },
          ],
        },
        {
          type: "checklist", id: "company-prep", title: "À clarifier pour votre projet",
          items: [
            { id: "activity", label: "L’activité envisagée" },
            { id: "form", label: "La forme juridique souhaitée" },
            { id: "location", label: "Le lieu d’implantation" },
          ],
        },
        { type: "source", id: "company-source", title: "Création d’entreprise", publisher: "CEPICI", url: "https://cepici.gouv.ci/creation_entreprise" },
        { type: "official_action", id: "company-action", label: "Consulter le CEPICI", destinationId: "company" },
      ],
    },
    birth: {
      intent: "birth_certificate.request",
      message: "Pour obtenir un extrait d’acte de naissance, vérifiez la procédure de l’état civil selon le lieu où l’acte a été établi. Cette démonstration vous aide à préparer la démarche ; la fiche officielle confirme les pièces à présenter.",
      widgets: [
        {
          type: "checklist", id: "birth-prep", title: "Informations à retrouver",
          items: [
            { id: "name", label: "Nom et prénoms sur l’acte" },
            { id: "birthdate", label: "Date et lieu de naissance" },
            { id: "registry", label: "Commune ou centre d’état civil concerné" },
          ],
        },
        {
          type: "stepper", id: "birth-steps", title: "Comment avancer",
          steps: [
            { id: "find", label: "Identifier le centre d’état civil" },
            { id: "check", label: "Vérifier les pièces et modalités officielles" },
            { id: "request", label: "Faire la demande auprès du service compétent" },
          ],
        },
        { type: "source", id: "birth-source", title: "Établir un extrait d’acte de naissance", publisher: "Service public de Côte d’Ivoire", url: "https://servicepublic.gouv.ci/accueil/detaildemarcheparticulier/2/480/24" },
        { type: "official_action", id: "birth-action", label: "Voir la fiche officielle", destinationId: "birth" },
      ],
    },
    unknown: {
      intent: "general.clarify",
      message: "Je peux vous aider à explorer trois démarches dans cette première démonstration. Choisissez un sujet ci-dessous. Pour toute autre démarche, nous ajouterons progressivement des sources vérifiées.",
      widgets: [
        {
          type: "choice", id: "topic-choice", title: "Que voulez-vous faire ?",
          options: [
            { id: "passport", label: "Demander un passeport", value: "passeport" },
            { id: "company", label: "Créer une entreprise", value: "création d’entreprise" },
            { id: "birth", label: "Obtenir un extrait de naissance", value: "extrait de naissance" },
          ],
        },
      ],
    },
  };

  return assistantResponseSchema.parse(responses[topic]);
}
