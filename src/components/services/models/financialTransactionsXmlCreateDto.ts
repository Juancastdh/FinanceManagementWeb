class FinancialTransactionsXmlCreateDto {
  xmlBase64File: string

  constructor(xmlBase64File: string | null| undefined) {
    if(xmlBase64File != null){
      this.xmlBase64File = xmlBase64File;
    }
    else{
      this.xmlBase64File = "";
    }
    
  }
}

export { FinancialTransactionsXmlCreateDto }
