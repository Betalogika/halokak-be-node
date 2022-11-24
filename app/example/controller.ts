import { MessageUtil } from "../utils/message";
import { ExampleRepository } from "./repository";

export class ExampleController {
  repository: ExampleRepository;

  setRepo(repo: ExampleRepository) {
    this.repository = repo;
  }

  /**
   * dev url: ""
   * prod url: ""
   */
  async getSomething(event: any) {
    //get query parameter
    const queryParams = event.queryStringParameters;
    //check parameter
    if(!queryParams) return MessageUtil.errorBadRequest();
    const id = queryParams.id;
    if (!id) {
      return MessageUtil.errorMandatory("id");
    }
    const data = await this.repository.getSomething(id);
    return MessageUtil.success(data);
  }

  /**
   * dev url: ""
   * prod url: ""
   */
  async getSomethingList(event: any) {
    //get query parameter
    const queryParams = event.queryStringParameters;
    //check parameter
    if(!queryParams) return MessageUtil.errorBadRequest();
    const page = parseInt(queryParams.page, 10);
    const limit = parseInt(queryParams.limit, 10);
    const isAll = queryParams.isAll ? this.stringToBoolean(queryParams.isAll) : false;
    let data: Array<any>  = await this.repository.getSomethingList(
      page,
      limit,
      isAll
    );
    //formating response if needed
    const response = data.map(result => {
      return {
        "id": result._id,
        "Name": result.name,
      }
    });
    return MessageUtil.success(response);
  }

  stringToBoolean(data: string){
    switch(data.toLowerCase().trim()){
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return Boolean(data);
    }
  }
}
