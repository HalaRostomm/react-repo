import axios from "axios";

const API_URL = "http://localhost:8080/admin";

class AdminService {
  constructor() {
    this.authAxios = axios.create({
      baseURL: API_URL,
      withCredentials: true, 
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.authAxios.interceptors.request.use((config) => {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getUserProfile() {
    try {
      const response = await this.authAxios.get("/profile");
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }
  updatePassword(oldPassword, newPassword) {
    return this.authAxios.put("/updatePassword", { oldPassword, newPassword });
  }


  addNewDoctor(doctor) {
    return this.authAxios.post("/adddoctor", doctor);
  }

  getAllDoctors() {
    return this.authAxios.get("/getdoctors");
  }

  getDoctorById(id) {
    return this.authAxios.get(`/getdoctor/${id}`);
  }

  deleteDoctor(id) {
    return this.authAxios.delete(`/deletedoctor/${id}`);
  }

  updateDoctor(id, doctor) {
    return this.authAxios.put(`/updatedoctor/${id}`, doctor);
  }

  addNewAdmin(admin) {
    return this.authAxios.post("/addadmin", admin);
  }

  updateAdmin(id, admin) {
    return this.authAxios.put(`/updateadmin/${id}`, admin);
  }

  getAdminById(id) {
    return this.authAxios.get(`/getadmin/${id}`);
  }

  deleteAdmin(id) {
    return this.authAxios.delete(`/deleteadmin/${id}`);
  }

  getAllAdmins() {
    return this.authAxios.get("/getadmins");
  }

   addNewPetCategory(category) {
    return this.authAxios.post("/addpetcategory", category);
  }
  addNewServiceCategory(category) {
    return this.authAxios.post("/addservicecategory", category);
  }
 
  addNewProductCategory(category, categoryName) {
    return this.authAxios.post(`/addproductcategory?categoryName=${categoryName}`, category);
  }

  // ✅ Update Category
  updateCategory(id, category) {
    return this.authAxios.put(`/updatecategory/${id}`, category);
  }

  // ✅ Get Category by ID
  getCategoryById(id) {
    return this.authAxios.get(`/getcategory/${id}`);
  }

  // ✅ Get All Pet Categories
  getPetCategories() {
    return this.authAxios.get("/getpetcategories");
  }
  getProductCategories() {
    return this.authAxios.get("/getproductcategories");
  }
  getServiceCategories() {
    return this.authAxios.get("/getservicecategories");
  }
  // ✅ Delete Category
  deleteCategory(id) {
    return this.authAxios.delete(`/deletecategory/${id}`);
  }



  // ✅ Manage users
  addNewUser(user) {
    return this.authAxios.post("/adduser", user);
  }

  updateUser(id, user) {
    return this.authAxios.put(`/updateuser/${id}`, user);
  }

  getUserById(id) {
    return this.authAxios.get(`/getuser/${id}`);
  }

  getAllUsers() {
    return this.authAxios.get("/getallusers");
  }

  deleteUser(id) {
    return this.authAxios.delete(`/deleteuser/${id}`);
  }

  addNewSP( companyId,serviceProvider ){
    return this.authAxios.post(`/addsp/${companyId}`, serviceProvider);
  }

  updateSP(id, serviceProvider) {
    return this.authAxios.put(`/updatesp/${id}`, serviceProvider);
  }

  getSpById(id) {
    return this.authAxios.get(`/getsp/${id}`);
  }

  getAllSP() {
    return this.authAxios.get("/getallsp");
  }

  deleteSP(id) {
    return this.authAxios.delete(`/deletesp/${id}`);
  }

  addNewPP(companyId, productProvider) {
    return this.authAxios.post(`/addpp/${companyId}`, productProvider);
  }
  

  updatePP(id, productProvider) {
    return this.authAxios.put(`/updatepp/${id}`, productProvider);
  }

  getPPById(id) {
    return this.authAxios.get(`/getpp/${id}`);
  }

  getAllPP() {
    return this.authAxios.get("/getallpp");
  }

  deletePP(id) {
    return this.authAxios.delete(`/deletepp/${id}`);
  }

  addNewCompany(company) {
    return this.authAxios.post("/addcompany", company);
  }

  deleteCompany(id) {
    return this.authAxios.delete(`/deletecompany/${id}`);
  }

  updateCompany(id, company) {
    return this.authAxios.put(`/updatecompany/${id}`, company);
  }

  getAllCompanies() {
    return this.authAxios.get("/getallcompanies");
  }

  getCompanyById(id) {
    return this.authAxios.get(`/getcompany/${id}`);
  }
/////////////////////////////////////////////

  getProductRatings(ppId) {
    return this.authAxios.get(`/productsratings/${ppId}`);
  }

  getDailyIncome(ppId) {
    return this.authAxios.get(`/getdailyincome/${ppId}`);
  }

  getProductSales(ppId) {
    return this.authAxios.get(`/getproductssales/${ppId}`);
  }

  countServices(userId) {
    return this.authAxios.get(`/countservices/${userId}`);
  }

  getAppointmentsPerService(userId) {
    return this.authAxios.get(`/appointmentsperservice/${userId}`);
  }

  getServiceRatings(userId) {
    return this.authAxios.get(`/servicesratings/${userId}`);
  }

  getBookedAppointmentsInsights(userId) {
    return this.authAxios.get(`/bookedinsights/${userId}`);
  }

  getBookedAppointmentsPerDate(userId) {
    return this.authAxios.get(`/bookedappointmentsperdate/${userId}`);
  }

  getBookingPercentage(userId) {
    return this.authAxios.get(`/percentageofbookings/${userId}`);
  }

  getNumberOfDifferentUsers(userId) {
    return this.authAxios.get(`/nbofdifferentusers/${userId}`);
  }

  getAttendancePercentage(userId) {
    return this.authAxios.get(`/percentageofattendance/${userId}`);
  }

  getNumberOfPets(userId) {
    return this.authAxios.get(`/getnumberofpets/${userId}`);
  }

  getNumberOfPosts(userId) {
    return this.authAxios.get(`/getnumberofposts/${userId}`);
  }

  getPurchases(userId) {
    return this.authAxios.get(`/getpurchasesforuser/${userId}`);
  }

  getBookedAppointmentsByType(userId) {
    return this.authAxios.get(`/bookedappointmentsbytype/${userId}`);
  }
  /////////
  
  getTotalVetAppointments() {
    return this.authAxios.get('/totalvetappointments');
  }

  getTotalServiceAppointments() {
    return this.authAxios.get('/totalserviceappointments');
  }

  getTotalUsers() {
    return this.authAxios.get('/totalusers');
  }
getUsersOrder(ppId) {
  return this.authAxios.get(`/usersorder/${ppId}`);
}
  getTotalSps() {
    return this.authAxios.get('/totalsps');
  }

  getTotalPps() {
    return this.authAxios.get('/totalpps');
  }

  getTotalDoctors() {
    return this.authAxios.get('/totaldoctors');
  }

  getTotalProducts() {
    return this.authAxios.get('/totalproducts');
  }

  getTotalPosts() {
    return this.authAxios.get('/totalposts');
  }

  getTotalPets() {
    return this.authAxios.get('/totalpets');
  }

  getTotalServices() {
    return this.authAxios.get('/totalservices');
  }


}

export default new AdminService();
