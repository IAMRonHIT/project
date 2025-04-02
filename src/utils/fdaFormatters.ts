interface FormattedFDAResult {
  type: 'drug' | 'device' | 'ndc' | 'recall';
  sections: Array<{
    title: string;
    content: string;
  }>;
  meta?: {
    totalResults?: number;
    searchQuery?: string;
  };
}

const formatMarkdownList = (items: string[]): string => {
  return items.map(item => `- ${item}`).join('\n');
};

const formatMarkdownSection = (content: any): string => {
  if (!content) return '';
  
  if (Array.isArray(content)) {
    return content.join('\n\n');
  }
  
  return content.toString();
};

export const formatDrugLabelResults = async (apiResponse: any): Promise<FormattedFDAResult> => {
  const results = apiResponse.results?.[0] || {};
  
  const sections = [
    // Product Overview
    {
      title: '📋 Product Overview',
      content: `### Basic Information
**Brand Name:** ${results.openfda?.brand_name?.[0] || 'N/A'}
**Generic Name:** ${results.openfda?.generic_name?.[0] || 'N/A'}
**Manufacturer:** ${results.openfda?.manufacturer_name?.[0] || 'N/A'}
**Route:** ${results.openfda?.route?.[0] || 'N/A'}
**Product Type:** ${results.openfda?.product_type?.[0] || 'N/A'}
**Application Number:** ${results.openfda?.application_number?.[0] || 'N/A'}`
    },

    // Boxed Warning (if present)
    ...(results.boxed_warning ? [{
      title: '⚠️ BOXED WARNING',
      content: `> ${formatMarkdownSection(results.boxed_warning)}`
    }] : []),
    
    // Key Clinical Information
    {
      title: '🎯 Indications & Usage',
      content: formatMarkdownSection(results.indications_and_usage)
    },
    
    {
      title: '💊 Active Ingredients',
      content: formatMarkdownSection(results.active_ingredient)
    },
    
    {
      title: '📝 Description',
      content: formatMarkdownSection(results.description)
    },

    // Safety Information
    {
      title: '⚠️ Warnings & Precautions',
      content: `${formatMarkdownSection(results.warnings)}

${results.precautions ? `### Precautions\n${formatMarkdownSection(results.precautions)}` : ''}`
    },
    
    {
      title: '❌ Contraindications',
      content: formatMarkdownSection(results.contraindications)
    },
    
    {
      title: '⚕️ Adverse Reactions',
      content: formatMarkdownSection(results.adverse_reactions)
    },
    
    {
      title: '🔄 Drug Interactions',
      content: formatMarkdownSection(results.drug_interactions)
    },

    // Usage Information
    {
      title: '💊 Dosage & Administration',
      content: formatMarkdownSection(results.dosage_and_administration)
    },
    
    {
      title: '⚡ Overdosage',
      content: formatMarkdownSection(results.overdosage)
    },

    // Special Populations
    {
      title: '👥 Use in Specific Populations',
      content: `${results.pregnancy ? `### Pregnancy\n${formatMarkdownSection(results.pregnancy)}\n\n` : ''}${results.nursing_mothers ? `### Nursing Mothers\n${formatMarkdownSection(results.nursing_mothers)}\n\n` : ''}${results.pediatric_use ? `### Pediatric Use\n${formatMarkdownSection(results.pediatric_use)}\n\n` : ''}${results.geriatric_use ? `### Geriatric Use\n${formatMarkdownSection(results.geriatric_use)}` : ''}`
    },

    // Clinical Information
    {
      title: '🔬 Clinical Pharmacology',
      content: `${formatMarkdownSection(results.clinical_pharmacology)}

${results.mechanism_of_action ? `### Mechanism of Action\n${formatMarkdownSection(results.mechanism_of_action)}` : ''}`
    },

    // Additional Information
    {
      title: '📦 How Supplied',
      content: formatMarkdownSection(results.how_supplied)
    },
    
    {
      title: '🔍 Storage & Handling',
      content: formatMarkdownSection(results.storage_and_handling)
    },
    
    {
      title: '📋 Patient Information',
      content: formatMarkdownSection(results.information_for_patients)
    },
    
    {
      title: '📚 References',
      content: formatMarkdownSection(results.references)
    }
  ].filter(section => section.content);

  return {
    type: 'drug',
    sections,
    meta: {
      totalResults: apiResponse.meta?.results?.total,
      searchQuery: apiResponse.meta?.disclaimer
    }
  };
};

export const formatDeviceLabelResults = async (apiResponse: any): Promise<FormattedFDAResult> => {
  const results = apiResponse.results?.[0] || {};
  
  const sections = [
    {
      title: 'Device Information',
      content: `### Basic Information
**Product Code:** ${results.product_code || 'N/A'}
**Device Name:** ${results.device_name || 'N/A'}`
    },
    {
      title: 'Device Description',
      content: formatMarkdownSection(results.device_description)
    },
    {
      title: 'Manufacturer Details',
      content: `**Name:** ${results.manufacturer_name || 'N/A'}
**Address:** ${results.manufacturer_address || 'N/A'}`
    },
    {
      title: 'Classification',
      content: `**Class:** ${results.device_class || 'N/A'}
**Regulation:** ${results.regulation_number || 'N/A'}`
    }
  ].filter(section => section.content);

  return {
    type: 'device',
    sections,
    meta: {
      totalResults: apiResponse.meta?.results?.total,
      searchQuery: apiResponse.meta?.disclaimer
    }
  };
};

export const formatNDCResults = async (apiResponse: any): Promise<FormattedFDAResult> => {
  const results = apiResponse.results?.[0] || {};
  
  const sections = [
    {
      title: 'Product Information',
      content: `### Basic Information
**Brand Name:** ${results.brand_name || 'N/A'}
**Generic Name:** ${results.generic_name || 'N/A'}
**Product Type:** ${results.product_type || 'N/A'}`
    },
    {
      title: 'Manufacturer Details',
      content: `**Name:** ${results.labeler_name || 'N/A'}
**NDC Labeler Code:** ${results.labeler_code || 'N/A'}`
    },
    {
      title: 'Product Identifiers',
      content: `**Product NDC:** ${results.product_ndc || 'N/A'}
**Package NDC:**
${formatMarkdownList(results.package_ndc || [])}`
    },
    {
      title: 'Active Ingredients',
      content: formatMarkdownList((results.active_ingredients || []).map((ingredient: any) => 
        `${ingredient.name || 'Unknown'} (${ingredient.strength || 'strength not specified'})`
      ))
    }
  ].filter(section => section.content);

  return {
    type: 'ndc',
    sections,
    meta: {
      totalResults: apiResponse.meta?.results?.total,
      searchQuery: apiResponse.meta?.disclaimer
    }
  };
};

export const formatRecallResults = async (apiResponse: any): Promise<FormattedFDAResult> => {
  const results = apiResponse.results?.[0] || {};
  
  const sections = [
    {
      title: '⚠️ Recall Information',
      content: `### Basic Information
**Recall Number:** ${results.recall_number || 'N/A'}
**Status:** ${results.status || 'N/A'}
**Classification:** ${results.classification || 'N/A'}`
    },
    {
      title: 'Product Details',
      content: `### Product Information
**Description:** ${results.product_description || 'N/A'}
**Quantity:** ${results.product_quantity || 'N/A'}`
    },
    {
      title: 'Reason for Recall',
      content: formatMarkdownSection(results.reason_for_recall)
    },
    {
      title: 'Recall Details',
      content: `### Additional Information
**Initiation Date:** ${results.recall_initiation_date || 'N/A'}
**Distribution Pattern:** ${results.distribution_pattern || 'N/A'}
**Recalling Firm:** ${results.recalling_firm || 'N/A'}`
    },
    {
      title: 'Action',
      content: formatMarkdownSection(results.action)
    }
  ].filter(section => section.content);

  return {
    type: 'recall',
    sections,
    meta: {
      totalResults: apiResponse.meta?.results?.total,
      searchQuery: apiResponse.meta?.disclaimer
    }
  };
};
