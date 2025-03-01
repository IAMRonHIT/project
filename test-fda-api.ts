import { searchDrugs } from '../backend/app/fda';

async function testFdaApi() {
  try {
    // Test with a common drug name
    const query = 'ibuprofen';
    console.log(`Searching for: ${query}`);
    
    const results = await searchDrugs(query);
    
    console.log('Search results:');
    console.log(JSON.stringify(results, null, 2));
    
    console.log(`Found ${results.count} results`);
    
    // Display basic info for each result
    if (results.results.length > 0) {
      console.log('\nDrug Information:');
      results.results.forEach((drug, index) => {
        console.log(`\n[${index + 1}] ${drug.name}`);
        console.log(`Dosage form: ${drug.dosage_form || 'Not specified'}`);
        console.log(`Route: ${drug.route || 'Not specified'}`);
        
        if (drug.active_ingredients?.length > 0) {
          console.log('Active ingredients:');
          drug.active_ingredients.forEach(ingredient => {
            console.log(`- ${ingredient.name}`);
          });
        }
        
        if (drug.indications_and_usage?.length > 0) {
          console.log('Indications and usage:');
          drug.indications_and_usage.forEach(indication => {
            console.log(`- ${indication.substring(0, 100)}...`);
          });
        }
      });
    }
  } catch (error) {
    console.error('Error testing FDA API:', error);
  }
}

testFdaApi();
