import { Campaign } from './campaignService';
import { TestResults, CampaignMetrics, SavedTest } from '../components/views/ABTesting/interfaces/testResults';

const LOCAL_STORAGE_KEY = 'email_marketing_ab_tests';

/**
 * Genera resultados simulados de pruebas A/B para dos campañas
 */
export const generateTestResults = (
  campaignA: Campaign,
  campaignB: Campaign,
  testName: string
): TestResults => {
  // Generar métricas aleatorias para ambas campañas
  const generateMetrics = (): CampaignMetrics => {
    return {
      openRate: Math.random() * 0.4 + 0.4, // Entre 40% y 80%
      clickRate: Math.random() * 0.3 + 0.1, // Entre 10% y 40%
      conversionRate: Math.random() * 0.1 + 0.05, // Entre 5% y 15%
      bounceRate: Math.random() * 0.1, // Entre 0% y 10%
      unsubscribeRate: Math.random() * 0.02 // Entre 0% y 2%
    };
  };

  const metricsA = generateMetrics();
  const metricsB = generateMetrics();

  // Determinar ganador basado en promedios de métricas principales
  const avgA = (metricsA.openRate + metricsA.clickRate + metricsA.conversionRate) / 3;
  const avgB = (metricsB.openRate + metricsB.clickRate + metricsB.conversionRate) / 3;
  
  const winner: 'A' | 'B' | 'tie' = avgA > avgB ? 'A' : (avgB > avgA ? 'B' : 'tie');
  
  // Generar recomendación
  const winnerCampaign = winner === 'A' ? campaignA : campaignB;
  let recommendation = '';
  
  if (winner === 'tie') {
    recommendation = 'Ambas campañas muestran rendimientos similares. Recomendamos realizar más pruebas o considerar otros factores para tomar una decisión.';
  } else {
    recommendation = `La campaña "${winnerCampaign.nombre}" muestra un mejor rendimiento general y debería considerarse como la opción preferida para futuras comunicaciones similares.`;
  }

  return {
    testId: `test-${Date.now()}`,
    testName,
    dateCreated: new Date().toISOString(),
    campaignA: metricsA,
    campaignB: metricsB,
    winner,
    recommendation
  };
};

/**
 * Guarda una prueba A/B en localStorage
 */
export const saveABTest = (
  testName: string,
  campaignA: Campaign,
  campaignB: Campaign,
  results: TestResults
): SavedTest => {
  // Crea el objeto de prueba guardada
  const savedTest: SavedTest = {
    id: results.testId,
    name: testName,
    dateCreated: results.dateCreated,
    campaignAId: campaignA.id,
    campaignBId: campaignB.id,
    campaignAName: campaignA.nombre,
    campaignBName: campaignB.nombre,
    results
  };

  // Obtiene las pruebas existentes
  const existingTests = getSavedTests();
  
  // Guarda la nueva prueba
  localStorage.setItem(
    LOCAL_STORAGE_KEY, 
    JSON.stringify([...existingTests, savedTest])
  );

  return savedTest;
};

/**
 * Obtiene todas las pruebas A/B guardadas
 */
export const getSavedTests = (): SavedTest[] => {
  const testsJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
  return testsJSON ? JSON.parse(testsJSON) : [];
};

/**
 * Obtiene una prueba A/B por su ID
 */
export const getTestById = (testId: string): SavedTest | null => {
  const allTests = getSavedTests();
  return allTests.find(test => test.id === testId) || null;
};

/**
 * Elimina una prueba A/B
 */
export const deleteTest = (testId: string): boolean => {
  const allTests = getSavedTests();
  const filteredTests = allTests.filter(test => test.id !== testId);
  
  if (filteredTests.length < allTests.length) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredTests));
    return true;
  }
  
  return false;
};

// Otras funciones útiles que podrían añadirse en el futuro:
// - updateTest: para actualizar una prueba existente
// - exportTestsToCsv: para exportar los resultados a CSV
// - getTestsForCampaign: para obtener pruebas relacionadas con una campaña específica
