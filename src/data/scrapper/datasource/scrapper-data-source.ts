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

  //   let createdRecoNumber: ScrapperEntity | null = null;
  //   createdRecoNumber=new ScrapperEntity(
  //     5031168,
  //    "REGISTERED",
  //    "2024/01/07"
  //  )

  //  return createdRecoNumber

  //   }
  // }



      //  Launch a headless browser


       const browser = await puppeteer.launch();

       // Open a new page
       const page = await browser.newPage();
   
       // Navigate to the website
       const websiteData = await page.goto('https://registrantsearch.reco.on.ca/');
       //    const websiteDataAfterLoad= await page.waitForSelector(webisteData);
   
       // Get the content of the page
       const pageContent = await page.content();
       // console.log(pageContent, "Page Content");
   
       // websiteDataAfterLoad)
       // Fill the form with first and last name
      //  await page.type('#f-name', realtorData.firstName);
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
        const registerRealtorNameElement = collapseElement.querySelector('.middle-text.panel-text:nth-of-type(1)');
        const realtorCategoryElement = collapseElement.querySelector('.middle-text.panel-text:nth-of-type(2)');
        const registrationNumberElement = collapseElement.querySelector('.middle-text.panel-text:nth-of-type(3)');
        const registrationStatusElement = collapseElement.querySelector('.middle-text.panel-text:nth-of-type(4)');
        const registrationExpiryElement = collapseElement.querySelector('.middle-text.panel-text:nth-of-type(5)');

        const brokerageNameElement = collapseElement.querySelector('.middle-text.panel-text:nth-of-type(6)');

        const brokerageTradeNameElement = collapseElement.querySelector('.middle-text.panel-text:nth-of-type(7)');

        const brokerageAddressElement = collapseElement.querySelector('.middle-text.panel-text:nth-of-type(8)');

        const brokerageEmailElement = collapseElement.querySelector('.middle-text.panel-text:nth-of-type(9)');

            const brokeragePhoneElement = collapseElement.querySelector('.middle-text.panel-text:nth-of-type(10)');

            const brokerageFaxElement = collapseElement.querySelector('.middle-text.panel-text:nth-of-type(11)');

        if (registrationNumberElement && registrationStatusElement && registrationExpiryElement) {
          
          const registrationNumberText = registrationNumberElement.textContent?.trim();
          const numericPart = registrationNumberText?.match(/\d+/);
          if (numericPart && +numericPart[0] === registrationNumberToFind) {
            // Match found, return the div data
            const strongRegisterRealtorName = registerRealtorNameElement?.querySelector('strong');
            const registerRealtorName = strongRegisterRealtorName?.nextSibling?.textContent?.trim() ?? "";

            const strongRealtorCategory = realtorCategoryElement?.querySelector('strong');
            const realtorCategory = strongRealtorCategory?.nextSibling?.textContent?.trim() ?? "";

            const strongStutusElement = registrationStatusElement.querySelector('strong');
            const registrationStatus = strongStutusElement?.nextSibling?.textContent?.trim() ?? "";
            
            const strongElementExpiry = registrationExpiryElement.querySelector('strong');
            const registrationExpiry = strongElementExpiry?.nextSibling?.textContent?.trim() ?? "";

            const strongBrokerageName = brokerageNameElement?.querySelector('strong');
            const brokerageName= strongBrokerageName?.nextSibling?.textContent?.trim() ?? "";

            const strongBrokerageTradeName = brokerageTradeNameElement?.querySelector('strong');
            const brokerageTradeName = strongBrokerageTradeName?.nextSibling?.textContent?.trim() ?? "";

            const strongBrokerageAddress = brokerageAddressElement?.querySelector('strong');
            const brokerageAddress = strongBrokerageAddress?.nextSibling?.textContent?.trim() ?? "";

            const strongBrokerageEmail = brokerageEmailElement?.querySelector('strong');
            const brokerageEmail = strongBrokerageEmail?.nextSibling?.textContent?.trim() ?? "";

            const strongBrokeragePhone = brokeragePhoneElement?.querySelector('strong');
            const brokeragePhone = strongBrokeragePhone?.nextSibling?.textContent?.trim() ?? "";

            const strongBrokerageFax = brokerageFaxElement?.querySelector('strong');
            const brokerageFax = strongBrokerageFax?.nextSibling?.textContent?.trim() ?? "";

            return {"registerRealtorName":registerRealtorName,"realtorCategory":realtorCategory,
            "recoNumber":+numericPart,
            "status":registrationStatus,"expiryDate":registrationExpiry,
             "brokerageName":brokerageName,
             "brokerageTradeName":brokerageTradeName,
             "brokerageAddress":brokerageAddress,
             "brokerageEmail":brokerageEmail,
             "brokeragePhone":brokeragePhone,
             "brokerageFax":brokerageFax

          };
          }
        }
      }

      // No match found
      return null;
    }, registrationNumberToFind);
 
    let createdRecoNumber: ScrapperEntity | null = null;

    if (matchingDivData) {
      createdRecoNumber = new ScrapperEntity(
        matchingDivData.registerRealtorName,
        matchingDivData.realtorCategory,
        matchingDivData.recoNumber,
        matchingDivData.status,
        matchingDivData.expiryDate,
        matchingDivData.brokerageName,
        matchingDivData.brokerageTradeName,
        matchingDivData.brokerageAddress,
        matchingDivData.brokerageEmail,
        matchingDivData.brokeragePhone,
        matchingDivData.brokerageFax
      );
     

    } else {
      console.log('No match found for registration number', registrationNumberToFind);
    }
    
   
     await browser.close();
   
    if (createdRecoNumber) {
      createdRecoNumber = new ScrapperEntity(
        matchingDivData?.registerRealtorName,
        matchingDivData?.realtorCategory,
        matchingDivData?.recoNumber,
        matchingDivData?.status,
        matchingDivData?.expiryDate,
        matchingDivData?.brokerageName,
        matchingDivData?.brokerageTradeName,
        matchingDivData?.brokerageAddress,
        matchingDivData?.brokerageEmail,
        matchingDivData?.brokeragePhone,
        matchingDivData?.brokerageFax
      );
      // createdRecoNumber=new ScrapperEntity(
      //    5031168,
      //   "REGISTERED",
      //   "2024/01/07"
      // )
      return createdRecoNumber;
    } else {
      // If no match is found, you may want to throw an error or handle it appropriately.
      throw new Error('No match found for registration number');
    }
    
    
    }
}