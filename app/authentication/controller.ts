import { MessageUtil } from "../utils/message";
import { AuthenticationRepository } from "./repository";

export class AuthenticationController {
  repository: AuthenticationRepository;

  setRepo(repo: AuthenticationRepository) {
    this.repository = repo;
  }

  /**
   * dev url: ""
   * prod url: ""
   */
  async register(event: any) {
    //get body parameter
    const params = JSON.parse(event.body);
    //check parameter
    if(!params) return MessageUtil.errorBadRequest();
    const email = params.email;
    const password = params.password;
    const name = params.name;
    if (!email) {
      return MessageUtil.errorMandatory("email")
    }
    if (!password) {
      return MessageUtil.errorMandatory("password")
    }
    if (!name) {
      return MessageUtil.errorMandatory("name")
    }
    const isAnyDataMatch = await this.repository.getUser(email)
    if (isAnyDataMatch) {
      return MessageUtil.errorUnprocessable("Email telah terdaftar")
    }
    await this.repository.register(email, password, name)
    const data = await this.repository.getUser(email)
    delete data["password"]
    return MessageUtil.success(data);
  }

  /**
   * dev url: ""
   * prod url: ""
   */
  async login(event: any) {
    //get body parameter
    const params = JSON.parse(event.body);
    //check parameter
    if(!params) return MessageUtil.errorBadRequest();
    const email = params.email;
    const password = params.password;
    if (!email) {
      return MessageUtil.errorMandatory("email");
    }
    if (!password) {
      return MessageUtil.errorMandatory("password");
    }
    const userData = await this.repository.getUser(email);
    if (!userData) {
      return MessageUtil.errorUnprocessable("Akun tidak ditemukan");
    }
    const isPasswordMatch = await this.repository.isPasswordMatch(password, userData.password);
    if (!isPasswordMatch) {
      return MessageUtil.errorUnprocessable("Password salah");
    }
    const data = await this.repository.generateToken(userData._id);
    if (!data) {
      return MessageUtil.errorUnprocessable("Generate Token tidak berhasil")
    }
    const access_token = await this.repository.getToken(userData._id);
    userData["token"] = access_token.token
    delete userData['password']
    return MessageUtil.success(userData)
  }

  /**
   * dev url: ""
   * prod url: ""
   */
  async logout(event: any) {
    //get body parameter
    const token = event.headers.token
    //check parameter
    if (!token) {
      return MessageUtil.errorMandatory("token");
    }
    const data = await this.repository.logout(token);
    if (!data) {
      return MessageUtil.errorUnprocessable("Remove Token tidak berhasil")
    }
    return MessageUtil.success(null)
  }

  stringToBoolean(data: string){
    switch(data.toLowerCase().trim()){
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return Boolean(data);
    }
  }
}
