
export class ScrapperModel{
    constructor(
    //    public firstName:string="",
       public lastName:string="",
       public recoNumber:number=0
    ){}
}
export class ScrapperEntity{
    constructor(
       public recoNumber:number=0,
       public status:string="",
       public expirationDate:string=""
    )
    {}
}
