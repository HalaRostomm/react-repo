import axios from "axios";

const API_URL = "http://localhost:8080/user"; // Your actual backend URL

class UserService {
  constructor() {
    // Create Axios Instance with the token
    this.authAxios = axios.create({
      baseURL: API_URL,
    });

    // Automatically add the token to every request
    this.authAxios.interceptors.request.use((config) => {
      const token = localStorage.getItem("jwt_token"); // Ensure consistency with token name
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }
  updatePassword(oldPassword, newPassword) {
    return this.authAxios.put("/updatePassword", { oldPassword, newPassword });
  }
  // Get user profile using the Axios instance with token attached
  async getUserProfile() {
    try {
      const response = await this.authAxios.get("/profile"); // Use the instance of Axios to fetch data
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      throw error;
    }
  }
  updateUser(id, user) {
    return this.authAxios.put(`/updateuser/${id}`, user);
  }

  getAllUsers() {
    return this.authAxios.get("/getallusers");
  }
  getUserById(id) {
    return this.authAxios.get(`/getuser/${id}`);
  }
  addNewPet(id, categoryId, pet) {
    return this.authAxios.post(`/addpet/${id}/${categoryId}`, pet);
  }

  // ✅ **Update Pet (Fix: Add Correct URL Parameters)**
  updatePet(petId, categoryId, pet) {
    return this.authAxios.put(`/updatepet/${petId}/${categoryId}`, pet);
  }

  // ✅ Get All Pets for a User (Fix: Pass `id` in URL)
  getAllPets(id) {
    return this.authAxios.get(`/getpets/${id}`);
  }
  getPetById(id) {
    return this.authAxios.get(`/getpet/${id}`);
  }
  // ✅ Delete Pet
  deletePet(id) {
    return this.authAxios.delete(`/deletepet/${id}`);
  }
    // Category Methods
    findPetCategories() {
      return this.authAxios.get("/getpetcategories");
    }
  
    getCategoryById(id) {
      return this.authAxios.get(`/getcategory/${id}`);
    }
  
    // Doctor Methods
    getSpecializations() {
      return this.authAxios.get("/getspecializations");
    }
  
    getDoctorsBySpecialization(specialization) {
      return this.authAxios.get(`/getspecializeddoctors/${specialization}`);
    }
  
    getAppointmentsByDoctor (doctorId) {
      return this.authAxios.get(`/getappointments/${doctorId}`);
    }
  
    getAppointmentById(appointmentId) {
      return this.authAxios.get(`/getappointment/${appointmentId}`);
    }
  
    getPetsByCategory (userId, category) {
      return this.authAxios.get(`/getpetbycategory/${userId}/${category}`);
    }
  
    getDoctorById(doctorId)  {
      return this.authAxios.get(`/getdoctor/${doctorId}`);
    }
  
    // Get a product by ID
    getProductById(productId) {
      return this.authAxios.get(`/getproduct/${productId}`);
    }
  
    // Add a product to cart for a user with cartItem details
    addToCart(userId, productId, cartItem) {
      return this.authAxios.post(`/addtocart/${userId}/${productId}`, cartItem);
    }
  
    // Get number of items in cart for a user
    getNumberOfCartItems(userId) {
      return this.authAxios.get(`/getnumberofcartitems/${userId}`);
    }
  
    // Get all cart items for a user
    getCart(userId) {
      return this.authAxios.get(`/getcart/${userId}`);
    }
  
    // Increment quantity of a cart item by 1
    incrementItem(cartItemId) {
      return this.authAxios.put(`/incrementitem/${cartItemId}`);
    }
  
    // Decrement quantity of a cart item by 1, or delete if quantity reaches 0
    decrementItem(cartItemId) {
      return this.authAxios.put(`/decrementitem/${cartItemId}`);
    }
  
    confirmBooking (userId, doctorId, petId, appointmentId, ) {
      return this.authAxios.put(`/confirmbooking/${userId}/${doctorId}/${petId}/${appointmentId}`);
    }
  
    getUserAppointments (userId)  {
      return this.authAxios.get(`/getuserappointments/${userId}`);
    }
  
    unbookAppointment (appointmentId) {
      return this.authAxios.put(`/unbookappointment/${appointmentId}`);
    }
    rescheduleAppointment(oldId, newId, doctorId) {
      return this.authAxios.put(`/rescheduleappointment/${oldId}/${newId}/${doctorId}`);
    }
  
    // Reschedule Service Appointment
    rescheduleServiceAppointment(oldId, newId, serviceId) {
      return this.authAxios.put(`/rescheduleserviceappointment/${oldId}/${newId}/${serviceId}`);
    }
  
    // Make Fake Payment
    makeFakePayment(userid, request) {
      return this.authAxios.post(`/pay/${userid}`, request);
    }
    getAllPosts() {
      return this.authAxios.get('/getposts');
    }
  
    addFoundLostPost(userId, post) {
      return this.authAxios.post(`/addfoundlostpost/${userId}`, post);
    }
  
    markAsLost(petId) {
      return this.authAxios.put(`/markaslost/${petId}`);
    }
  
    markAsFound(petId) {
      return this.authAxios.put(`/markasfound/${petId}`);
    }
  
    deletePost(postId) {
      return this.authAxios.delete(`/deletepost/${postId}`);
    }
  
    getUserPosts(userId) {
  return this.authAxios.get(`/getuserposts/${userId}`).then(res => res.data);
}

    getPostById(postId) {
      return this.authAxios.get(`/getpost/${postId}`);
    }
  
    updatePost(postId, post) {
      return this.authAxios.put(`/updatepost/${postId}`, post);
    }
  
    addForAdoptionPost(userId, post) {
      return this.authAxios.post(`/addforadoptionpost/${userId}`, post);
    }
  
    markPetForAdoption(petId) {
      return this.authAxios.put(`/foradoption/${petId}`);
    }
  
    cancelForAdoption(petId) {
      return this.authAxios.put(`/cancelforadoption/${petId}`);
    }
  
    addNewPost(userId, post) {
      return this.authAxios.post(`/addpost/${userId}`, post);
    }
  
    getAdoptionPosts(userId) {
      return this.authAxios.get(`/getadoptionposts/${userId}`);
    }
  
    getLostFoundPosts(userId) {
      return this.authAxios.get(`/getlostfoundposts/${userId}`);
    }
  
    // CHATS
    getAllChatUsers(userId) {
      return this.authAxios.get(`/chats`, { params: { userId } });
    }
  
    // ADOPTION
    confirmAdoption(adopterId, petId) {
      return this.authAxios.put(`/confirmadoption/${adopterId}/${petId}`);
    }
  
    // REVIEWS
    rateDoctor(userId, doctorId, review) {
      return this.authAxios.post(`/ratedoctor/${userId}/${doctorId}`, review);
    }
  
    rateProduct(userId, productId, review) {
      return this.authAxios.post(`/rateproduct/${userId}/${productId}`, review);
    }
  
    rateService(userId, serviceId, review) {
      return this.authAxios.post(`/rateservice/${userId}/${serviceId}`, review);
    }
  
    getDoctorReviews(doctorId) {
      return this.authAxios.get(`/getdoctorreviews/${doctorId}`);
    }
  
    getProductReviews(productId) {
      return this.authAxios.get(`/getproductreviews/${productId}`);
    }
  
    getServiceReviews(serviceId) {
      return this.authAxios.get(`/getservicereviews/${serviceId}`);
    }
  
    getReviewById(reviewId) {
      return this.authAxios.get(`/getReview/${reviewId}`);
    }
  
    updateReview(reviewId, review) {
      return this.authAxios.put(`/updatereview/${reviewId}`, review);
    }
  
    deleteReview(reviewId) {
      return this.authAxios.delete(`/deletereview/${reviewId}`);
    }
  
    doctorOverallRatings(doctorId) {
      return this.authAxios.get(`/doctoraverage/${doctorId}`);
    }
  
    productOverallRatings(productId) {
      return this.authAxios.get(`/productaverage/${productId}`);
    }
  
    serviceOverallRatings(serviceId) {
      return this.authAxios.get(`/serviceaverage/${serviceId}`);
    }
    // Cash on Delivery Payment
    makeOrderCod(userid, request) {
      return this.authAxios.post(`/cod/${userid}`, request);
    }
  
    // Get Product Stock
    getProductStock(productId) {
      return this.authAxios.get(`/getstock/${productId}`);
    }
  
    // Get Orders by User
    getOrdersByUser(userId) {
      return this.authAxios.get(`/order/${userId}`);
    }
  
    // Get Order Items by Order ID
    getOrderItems(orderId) {
      return this.authAxios.get(`/getorderitems/${orderId}`);
    }
  
    // Get All Services
    getAllServices(category) {
      return this.authAxios.get(`/getallservices/${category}`);
    }
    confirmServiceBooking(userId, serviceId, petId, appointmentId) {
      return this.authAxios.put(`/confirmservicebooking/${userId}/${serviceId}/${petId}/${appointmentId}`);
    }
    // Get Service Appointments
    getServiceAppointments(id) {
      return this.authAxios.get(`/getserviceappointments/${id}`);
    }
  
    // Get Service by ID
    getServiceById(id) {
      return this.authAxios.get(`/getservice/${id}`);
    }
    getProductCategories() {
      return this.authAxios.get("/getproductscategories");
      
    }
     getServicesCategories() {
      return this.authAxios.get("/getservicecategories");
      
    }
    getAllProducts(category) {
      return this.authAxios.get(`/getproducts/${category}`);
    }
    getNotifications(userId) {
  return this.authAxios.get(`/getnotifications/${userId}`);
}

getUnreadCount(userId) {
  return this.authAxios.get(`/unreadCount/${userId}`);
}

markAsRead(notificationId) {
  return this.authAxios.put(`/markRead/${notificationId}`);
}

deleteNotification(notificationId) {
  return this.authAxios.delete(`/deletenotification/${notificationId}`);
}
getUrgentCasesDoctors() {
  return this.authAxios.get("/geturgentdoctors");
}


}

export default new UserService();
