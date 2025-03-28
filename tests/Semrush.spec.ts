import { test, expect } from '@playwright/test';

// Interface defining the structure of API test data
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

// Utility function to create a fully formed URL with query parameters
function createDomainOrganicUrl(params: ApiTestData): string {
    const baseUrl = 'https://py9mguz0ue.execute-api.us-east-1.amazonaws.com/alpha/';
    const searchParams = new URLSearchParams();

    // Convert all parameters to string and append to URL
    Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, value.toString());
    });

    return `${baseUrl}?${searchParams.toString()}`;
}

// CSV to JSON conversion utility function
function csvToJson(csv: string): object[] {
    const rows = csv.trim().split('\n');
    const headers = rows[0].split(';');

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

// Parameterized test for Semrush API
test(`GET_request_Happypath_Semrush:`, async ({ request }) => {
    // Test data moved inside the test method
    const testData: ApiTestData = {
        type: 'domain_organic',
        display_filter: '+|Ph|Co|seo',
        display_limit: 1,
        export_columns: "Ph,Po,Pp,Pd,Nq,Cp,Ur,Tr,Tg,Tc,Co,Nr,Td,Kd,Fp,Fk,Ts,In,Pt,Db,Dt,Dn,Or,Ot,Oc,Ad,At,Ac,Sh,Sv,Sr,Srb,St,Stb,Sc,Srn,Srl,FK0,FK1,FK11,FK51,FP0,FP1,FP11,FP51",
        domain: 'expert-help.nice.com',
        display_sort: 'tr_desc',
        database: 'us',
        expectedStatus: 200
    };

    // Construct full API endpoint URL
    const baseEndpoint = createDomainOrganicUrl(testData);
    console.log(baseEndpoint);

    // Perform GET request
    const response = await request.get(baseEndpoint, {
        headers: {
            'Accept': 'application/json'
        }
    });

    // Verify response status
    expect(response.status()).toBe(testData.expectedStatus || 200);

    // Process and log response data
    const responseData = (await response.text());
    console.log(response.status());
    console.log('Response data:');
    
    const csvData = (responseData);
    const jsonData = csvToJson(csvData);
    
    console.log(JSON.stringify(jsonData, null, 2));
    console.log('Request Parameters:', {
        type: testData.type,
        display_filter: testData.display_filter,
        display_limit: testData.display_limit,
        export_columns: testData.export_columns,
        domain: testData.domain,
        display_sort: testData.display_sort,
        database: testData.database,
    });
});
