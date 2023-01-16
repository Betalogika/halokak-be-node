export class MentorRepository {

    async getMentorList(
        page?: number,
        limit?: number,) {
    return [
            {       
            name :"Mentor 1",
            title : "Master of phisycs Science"
            }, 
            {
                name :"Mentor 2",
                title : "Master of Chemistry Science"  
            }
         ];
    }

   async getMentorDetail
   (name?:String) {
        if (name=== "Mentor 1") {
    return {       
            name :"Mentor 1",
            title : "Master of phisycs Science"
            };
        }
        else {
            return{
                name :"Mentor 2",
                title : "Master of Chemistry Science"
            }
        }
   }

//    async updateMentor
//     ( id?:number) {

//         return {
//             id :1,
//             name: "mentor 1",
//             title:"Master of phisycs Science"
//         }


//    }

}