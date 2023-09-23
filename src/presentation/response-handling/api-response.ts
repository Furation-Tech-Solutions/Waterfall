class ApiResponse {
    statusCode: number;
    message: string;
    success: boolean;
    data: any | null;
  
    constructor(statusCode: number, message: string, data: any | null = null) {
      this.statusCode = statusCode;
      this.message = message;
      this.success = statusCode >= 200 && statusCode < 300;
      this.data = data;
    }
  
    toJson() {
      const json: any = {
        status: this.statusCode,
        message: this.message,
        success: this.success,
      };
  
      if (this.data !== null) {
        json.data = this.data;
      }
      return json;
    }
  }
  
  export default ApiResponse;
  