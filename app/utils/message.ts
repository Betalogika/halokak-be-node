import { ResponseVO } from './response';
import { Page } from 'objection'
enum StatusCode {
  success = 200,
  badRequest = 400,
  unprocessable = 422
}

class Result {
  protected statusCode: number;
  protected code: number;
  protected message: string;
  protected data?: any;

  constructor(statusCode: number, code: number, message: string, data?: any) {
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
    this.data = data;
  }

  /**
   * Serverless: According to the API Gateway specs, the body content must be stringified
   */
  bodyToString () {
    return {
      statusCode: this.statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Origin, api_key, API_KEY, Content-Type, Accept, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token, X-Amz-User-Agent'
      },
      body: JSON.stringify({
        code: this.code,
        message: this.message,
        data: this.data,
      }),
    };
  }
}

class ResultBodyPagination extends Result {
  declare protected data: Page<any>;
  constructor(statusCode: number, code: number, message: string, data?: Page<any>) {
    super(statusCode, code, message, data)
  }

  bodyToStringPagination (page: number = 1, limit:number = 10) {
    return {
      statusCode: this.statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Origin, api_key, API_KEY, Content-Type, Accept, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token, X-Amz-User-Agent'
      },
      body: JSON.stringify({
        data: this.data.results,
        page: page,
        pages: Math.ceil(this.data.total / limit),
        limit: limit,
        count: this.data.results.length,
        total: this.data.total,
      })
    };
  }
}

export class MessageUtil {
  static pagination(data: Page<any>, page: number = 1, limit:number = 10): ResponseVO {
    const result = new ResultBodyPagination(StatusCode.success, 0, 'success', data);
    return result.bodyToStringPagination(page, limit);
  }

  static success(data: object): ResponseVO {
    const result = new Result(StatusCode.success, 0, 'success', data);
    return result.bodyToString();
  }

  static error(code: number = 1000, message: string, statusCode: number = StatusCode.success) {
    const result = new Result(statusCode, code, message);
    return result.bodyToString();
  }

  static errorBadRequest() {
    const result = new Result(StatusCode.badRequest, StatusCode.badRequest, "body/parameter/query is not found");
    return result.bodyToString();
  }

  static errorUnprocessable(message: string) {
    const result = new Result(StatusCode.unprocessable, StatusCode.unprocessable, message);
    return result.bodyToString();
  }

  static errorMandatory(parameter: string) {
    const result = new Result(StatusCode.unprocessable, StatusCode.unprocessable, parameter + " is mandatory");
    return result.bodyToString();
  }
}
