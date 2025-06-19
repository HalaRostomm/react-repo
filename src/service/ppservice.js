import axios from "axios";

const API_URL = "http://localhost:8080/pp"; // Your actual backend URL

class ProductService {
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
 
  updatePassword(oldPassword, newPassword) {
    return this.authAxios.put("/updatePassword", { oldPassword, newPassword });
  }

  updatePP(id,  data) {
    return this.authAxios.put(`/updatepp/${id}`, data);
  }
  

  getPPById(id) {
    return this.authAxios.get(`/getpp/${id}`);
  }

  getAllCompanies() {
    return this.authAxios.get("/getallcompanies");
  }

  getAllProducts(ppId) {
    return this.authAxios.get(`/getproducts/${ppId}`);
  }

  addNewProduct(categoryId, ppId, productData) {
    return this.authAxios.post(`/addproduct/${categoryId}/${ppId}`, productData);
  }

  getProductCategories() {
    return this.authAxios.get("/getproductcategories");
  }

  deleteProduct(productId) {
    return this.authAxios.delete(`/deleteproduct/${productId}`);
  }

  updateProduct(categoryId, productId, productData) {
    return this.authAxios.put(`/updateproduct/${categoryId}/${productId}`, productData);
  }

  getProductById(productId) {
    return this.authAxios.get(`/getproduct/${productId}`);
  }

  getOrders(ppId) {
    return this.authAxios.get(`/getorders/${ppId}`);
  }

  getOrderInfo(orderId) {
    return this.authAxios.get(`/getorderinfo/${orderId}`);
  }

  getOrderItems(orderId) {
    return this.authAxios.get(`/getorderitems/${orderId}`);
  }

  markItemAsDone(itemId) {
    return this.authAxios.put(`/markasdone/${itemId}`);
  }

  markItemAsUnDone(itemId) {
    return this.authAxios.put(`/markasundone/${itemId}`);
  }

  getOrder(orderId) {
    return this.authAxios.get(`/getorder/${orderId}`);
  }

getNotifications(ppId) {
  return this.authAxios.get(`/getnotifications/${ppId}`);
}

getUnreadCount(ppId) {
  return this.authAxios.get(`/unreadCount/${ppId}`);
}

markAsRead(notificationId) {
  return this.authAxios.put(`/markRead/${notificationId}`);
}

deleteNotification(notificationId) {
  return this.authAxios.delete(`/deletenotification/${notificationId}`);
}
inactiveProduct(id) {
  return this.authAxios.put(`/inactiveproduct/${id}`);
}
activeProduct(id) {
  return this.authAxios.put(`/activeproduct/${id}`);
}
getNumberOfProducts(ppId) {
  return this.authAxios.get(`/getnumberofproductsbypp/${ppId}`);
}

getProductAverageRating(productId) {
  return this.authAxios.get(`/productaverage/${productId}`);
}

getUsersOrder(ppId) {
  return this.authAxios.get(`/usersorder/${ppId}`);
}

getRatingsOfProduct(productId) {
  return this.authAxios.get(`/ratings/${productId}`);
}

getDailyIncome(ppId) {
  return this.authAxios.get(`/getdailyincome/${ppId}`);
}

getProductsSales(ppId) {
  return this.authAxios.get(`/getproductssales/${ppId}`);
}


}

export default new ProductService();
