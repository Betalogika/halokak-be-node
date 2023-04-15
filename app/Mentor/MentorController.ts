import { MessageUtil } from "../utils/message";
import { MentorRepository } from "./MentorRepository";

export class MentorController {
    repository : MentorRepository;

    setRepo(repo: MentorRepository) {
        this.repository = repo;
      }

      async getMentorList(event: any) {
        //get query parameter
        const queryParams = event.queryStringParameters;
        //check parameter
        if(!queryParams) return MessageUtil.errorBadRequest();
        const page = parseInt(queryParams.page, 10);
        const limit = parseInt(queryParams.limit, 10);
        
        let data: Array<any>  = await this.repository.getMentorList(
          page,
          limit,
      
        );
        //formating response if needed
    //    untuk memformat data
        // const response = data.map(result => {
        //   return {
        //     "id": result._id,
        //     "Name": result.name,
        //   }
        // });
        return MessageUtil.success(data);
      }
    
    //  async updateMentorList (event: any){
    //   const queryParams = event.queryStringParameters;
    //   //check parameter
    //   if(!queryParams) return MessageUtil.errorBadRequest();
    // }

}