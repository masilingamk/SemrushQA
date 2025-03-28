import { test, expect } from '@playwright/test';

// Define the structure for your API test data
interface ApiTestData {

  type: string;
  display_filter: string;
  display_limit: number;
  export_columns: string;
  domain: string;
  display_sort: string;
  database: string;
  expectedStatus?: number;
}

// Main test suite
test.describe('API_GET', () => {

  const testData: ApiTestData[] = [
    {
      type: 'domain_organic',
      display_filter: '+|Ph|Co|seo',
      display_limit: 1,
      export_columns: "Ph,Po,Pp,Pd,Nq,Cp,Ur,Tr,Tg,Tc,Co,Nr,Td,Kd,Fp,Fk,Ts,In,Pt,Db,Dt,Dn,Or,Ot,Oc,Ad,At,Ac,Sh,Sv,Sr,Srb,St,Stb,Sc,Srn,Srl,FK0,FK1,FK11,FK51,FP0,FP1,FP11,FP51",
      domain: 'expert-help.nice.com',
      display_sort: 'tr_desc',
      database: 'us',
      expectedStatus: 200
    }
  ];

  function createDomainOrganicUrl(params: ApiTestData): string {
    const baseUrl = 'https://py9mguz0ue.execute-api.us-east-1.amazonaws.com/alpha/';

    // Convert params object to URLSearchParams
    const searchParams = new URLSearchParams();

    // Add each parameter to the URLSearchParams object
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value.toString());
    });

    // Return the full URL
    return `${baseUrl}?${searchParams.toString()}`;
  }

  for (const data of testData) {
    const params: ApiTestData = {
      type: data.type,
      //  display_filter: encodedFilter.toString(),
      display_filter: data.display_filter,
      display_limit: data.display_limit,
      export_columns: data.export_columns,
      domain: data.domain,
      display_sort: data.display_sort,
      database: data.database
    };
    test(`GET_request_Happypath_Semrush: ${data.type}`, async ({ request }) => {

      // Base API endpoint
      const baseEndpoint = createDomainOrganicUrl(params);
      console.log(baseEndpoint)

      // Make the GET request with all parameters from the CSV
      const response = await request.get(baseEndpoint, {
        headers: {
          'Accept': 'application/json'
          //     // Uncomment if you need authorization
          //     // 'Authorization': `Bearer ${process.env.API_TOKEN || 'wSti57xs9gPRXi48LgoXs48O7OhDuS37e78tPGE0'}`
        }
      });

      //Convert the CSV format response to JSON format
      function csvToJson(csv: string): object[] {
        // Split the CSV into rows
        const rows = csv.trim().split('\n');

        // Extract the header row
        const headers = rows[0].split(';');

        // Map each subsequent row to an object
        const jsonData = rows.slice(1).map(row => {
          const values = row.split(',');
          const obj: { [key: string]: string } = {};

          headers.forEach((header, index) => {
            obj[header.trim()] = values[index]?.trim() || '';
          });

          return obj;
        });

        return jsonData;
      }
      // Verify the status code matches expected      
      expect(response.status()).toBe(data.expectedStatus || 200);
      const responseData = (await response.text());
      console.log(response.status());
      console.log('Response data:');
      const csvData = (responseData);
      const jsonData = csvToJson(csvData);
      console.log(JSON.stringify(jsonData, null, 2));
      console.log('Request Parameters:',
        {
          type: data.type,
          display_filter: data.display_filter,
          display_limit: data.display_limit,
          export_columns: data.export_columns,
          domain: data.domain,
          display_sort: data.display_sort,
          database: data.database,
        });
    });
  }
});

