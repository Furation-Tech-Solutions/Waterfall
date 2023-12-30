
export class ScrapperModel{
    constructor(
    //    public firstName:string="",
       public lastName:string="",
       public recoNumber:number=0
    ){}
}
export class ScrapperEntity{
    constructor(
       public realtorName:string="",
       public realtorCategory:string="",
       public recoNumber:number=0,
       public status:string="",
       public expirationDate:string="",
       public brokerageName:string="",
       public brokerageTradeName:string="",
       public brokerageAddress:string="",
       public brokerageEmail:string="",
       public brokeragePhone:string="",
       public brokerageFax:string="",
       
    )
    {}
}
