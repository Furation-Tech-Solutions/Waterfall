import { ScrapperEntity, ScrapperModel } from "@domain/scrapping/entities/scrapper";
import { number } from "joi";
import puppeteer from "puppeteer";
import { Sequelize } from "sequelize";




// Create SupportDataSource Interface
export interface ScrapperDataSource {
    // Define methods for data operations on Support entities
  
    // Method to create a new SupportEntity
    create(scrapper: ScrapperModel): Promise<ScrapperEntity>;

}

// Support Data Source communicates with the database
export class ScrapperDataSourceImpl implements ScrapperDataSource {
    constructor(private db: Sequelize) { }
  
    // Implement the "create" method to insert a new SupportEntity
    async create(realtorData: ScrapperModel): Promise<ScrapperEntity> {
      console.log(realtorData.recoNumber,"realtorData")
      // Create a new SupportEntity record in the database
    //   const createdRecoNumber = await RecoNumber.create(recoNumber);
       // Launch a headless browser
       const browser = await puppeteer.launch();

       // Open a new page
       const page = await browser.newPage();
   
       // Navigate to the website
       const websiteData = await page.goto('https://www.reco.on.ca/RegistrantSearch/RegistrantSearch/', { timeout: 6000 });
       //    const websiteDataAfterLoad= await page.waitForSelector(webisteData);
   
       // Get the content of the page
       const pageContent = await page.content();
       // console.log(pageContent, "Page Content");
   
       // websiteDataAfterLoad)
       // Fill the form with first and last name
       await page.type('#f-name', realtorData.firstName);
       await page.type('#l-name', realtorData.lastName);
   
       // Click the submit button
       await page.click('#searchSalesperson');
   
       // Wait for navigation to complete
       await page.waitForNavigation();
   
       // Get the content of the updated page
       const updatedPageContent = await page.content();
       // console.log(updatedPageContent, "Updated Page Content");
   
     // Use the appropriate selector based on your HTML structure
     const collapse0Element = await page.waitForSelector('.collapse')

     const registrationNumberToFind:number = realtorData.recoNumber
     const matchingDivData = await page.evaluate((registrationNumberToFind) => {
      const collapseElements = document.querySelectorAll('.collapse');

      for (const collapseElement of collapseElements) {
        const registrationNumberElement = collapseElement.querySelector('.middle-text.panel-text:nth-of-type(3)');
        const registrationStatus = collapseElement.querySelector('.middle-text.panel-text:nth-of-type(4)');
            const registrationExpiry = collapseElement.querySelector('.middle-text.panel-text:nth-of-type(5)');

        if (registrationNumberElement && registrationStatus && registrationExpiry) {
          
          const registrationNumberText = registrationNumberElement.textContent?.trim();
          const numericPart = registrationNumberText?.match(/\d+/);
          if (numericPart && +numericPart[0] === registrationNumberToFind) {
            // Match found, return the div data
            const strongElement = registrationStatus.querySelector('strong');
            const registrationStatusText = strongElement?.nextSibling?.textContent?.trim() ?? "";
            
            const strongElementExpiry = registrationExpiry.querySelector('strong');
            const registrationExpiryText = strongElementExpiry?.nextSibling?.textContent?.trim() ?? "";

            return {"status":registrationStatusText,"expiryDate":registrationExpiryText,"recoNumber":+numericPart};
          }
        }
      }

      // No match found
      return null;
    }, registrationNumberToFind);
 
    let createdRecoNumber: ScrapperEntity | null = null;

    if (matchingDivData) {
      createdRecoNumber = new ScrapperEntity(
        matchingDivData.recoNumber,
        matchingDivData.status,
        matchingDivData.expiryDate
      );
     

    } else {
      console.log('No match found for registration number', registrationNumberToFind);
    }
    
   
     await browser.close();
   
    if (createdRecoNumber) {
      createdRecoNumber = new ScrapperEntity(
        matchingDivData.recoNumber,
        matchingDivData.status,
        matchingDivData.expiryDate
      );
      return createdRecoNumber;
    } else {
      // If no match is found, you may want to throw an error or handle it appropriately.
      throw new Error('No match found for registration number');
    }
    
    
    }
}