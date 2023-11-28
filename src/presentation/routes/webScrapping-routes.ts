import { ScrapperDataSourceImpl } from "@data/scrapper/datasource/scrapper-data-source";
import { ScrapperRepositoryImpl } from "@data/scrapper/repositories/scrapper-repository-impl";
import { GetScrapper } from "@domain/scrapping/usecases/get-scrapper";
import { WebScrapping } from "@presentation/services/web-scrapping-services";
import { Router } from "express";
import { sequelize } from "@main/sequelizeClient";
<<<<<<< HEAD
import { validateScrappingInputMiddleware } from "@presentation/middlewares/scrapper/validation-middleware";
=======
>>>>>>> 0ae9a7fc62df1c52258bcc65d124eb02613493f1


// Create an instance of the RealtorDataSourceImpl and pass the mongoose connection
const scrapperDataSource = new ScrapperDataSourceImpl(sequelize);

// Create an instance of the OutletRepositoryImpl and pass the OutletDataSourceImpl
const scrapperRepository = new ScrapperRepositoryImpl(scrapperDataSource);

// Create instances of the required use cases and pass the RealtorRepositoryImpl
const getScrapperUsecase = new GetScrapper(scrapperRepository);

// Initialize RealtorService and inject required dependencies
const scrapperService = new WebScrapping(
  getScrapperUsecase,
 
);

// Create an Express router
export const scrapperRouter = Router();

// Route handling for creating a new realtor
scrapperRouter.post("/",validateScrappingInputMiddleware(false), scrapperService.checkRecoNumber.bind(scrapperService));
