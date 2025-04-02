import axios from 'axios';
import { env } from '../config/environment';

const FDA_API_BASE = 'https://api.fda.gov/drug';
const FDA_API_KEY = env.FDA_API_KEY;

if (!FDA_API_KEY) {
  console.error('FDA_API_KEY is not defined in environment');
}

const fdaClient = axios.create({
  baseURL: FDA_API_BASE,
  params: {
    api_key: FDA_API_KEY,
  },
});

interface FDASection {
  id: string;
  title: string;
  markdown: string;
  isWarning?: boolean;
}

export const fetchAndFormatFDADrugData = async (drugName: string): Promise<{ structured: { sections: FDASection[] } }> => {
  // 1. Fetch data from FDA API
  const response = await fdaClient.get('/label.json', {
    params: {
      search: `(openfda.brand_name.exact:"${encodeURIComponent(drugName)}" OR openfda.generic_name.exact:"${encodeURIComponent(drugName)}") AND _exists_:openfda`,
      limit: 1,
    },
  });

  if (!response.data.results || response.data.results.length === 0) {
    return { structured: { sections: [] } }; // Or throw an error
  }

  const result = response.data.results[0];

  // 2. Format into sections with markdown
  const sections: FDASection[] = [];

  const addSection = (id: string, title: string, content: any, isWarning = false) => {
    if (content) {
      const markdownContent = Array.isArray(content) ? content.join('\n\n') : String(content);
      sections.push({
        id,
        title,
        markdown: markdownContent,
        isWarning,
      });
    }
  };

  // Add sections based on available data
  addSection('brand-name', '💊 Brand Name', result.openfda?.brand_name?.[0], false);
  addSection('generic-name', '🧪 Generic Name', result.openfda?.generic_name?.[0], false);
  addSection('indications', 'ℹ️ Indications & Usage', result.indications_and_usage, false);
  addSection('dosage', '📝 Dosage & Administration', result.dosage_and_administration, false);
  addSection('warnings', '⚠️ Warnings', result.warnings, true);
  addSection('boxed-warning', '⚠️ Boxed Warning', result.boxed_warning, true);
  addSection('precautions', '⚠️ Precautions', result.precautions, true);
  addSection('contraindications', '❌ Contraindications', result.contraindications, true);
  addSection('adverse', '🤕 Adverse Reactions', result.adverse_reactions, false);
  addSection('interactions', '🔄 Drug Interactions', result.drug_interactions, false);
  addSection('overdosage', '⚡ Overdosage', result.overdosage, false);
  addSection('description', '🔍 Description', result.description, false);
  addSection('clinical-pharmacology', '🔬 Clinical Pharmacology', result.clinical_pharmacology, false);
  addSection('mechanism-of-action', '⚙️ Mechanism of Action', result.mechanism_of_action, false);
  addSection('pharmacokinetics', '📊 Pharmacokinetics', result.pharmacokinetics, false);
  addSection('how-supplied', '📦 How Supplied', result.how_supplied, false);
  addSection('storage-handling', '🗄️ Storage & Handling', result.storage_and_handling, false);
  addSection('patient-info', '🧑‍⚕️ Patient Information', result.information_for_patients, false);
  addSection('references', '📚 References', result.references, false);

  return { structured: { sections } };
};
