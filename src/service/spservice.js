import axios from 'axios';

const API_URL = 'http://localhost:8080/sp'; 

class SpService {
  constructor() {
    // Create Axios Instance with the token
    this.authAxios = axios.create({
      baseURL: API_URL,
    });

    // Automatically add the token to every request
    this.authAxios.interceptors.request.use((config) => {
      const token = localStorage.getItem("jwt_token"); // Consistent token name
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Non-static method to fetch user profile using Axios instance
  async getUserProfile() {
    try {
      const response = await this.authAxios.get('/profile'); // Use the Axios instance
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }

  updatePassword(oldPassword, newPassword) {
    return this.authAxios.put("/updatePassword", { oldPassword, newPassword });
  }
  updateSp(id, data) {
    return this.authAxios.put(`/updatesp/${id}`, data);
  }

  getAllCompanies() {
    return this.authAxios.get("/getallcompanies");
  }

  setAvailability(spid, availability) {
    return this.authAxios.put(`/setavailability/${spid}`, availability);
  }

  getAvailability(spid) {
    return this.authAxios.get(`/getavailability/${spid}`);
  }

  getSpById(id) {
    return this.authAxios.get(`/getsp/${id}`);
  }

  getAllServices(spId) {
    return this.authAxios.get(`/getservices/${spId}`);
  }

  getServiceCategories() {
    return this.authAxios.get("/getservicecategories");
  }
  getServiceCategoriesById(id) {
    return this.authAxios.get(`/getselectedservicescategories/${id}`);
  }
  

  addNewService(categoryId, spId, serviceData) {
    return this.authAxios.post(`/addservice/${categoryId}/${spId}`, serviceData);
  }

  deleteService(serviceId) {
    return this.authAxios.delete(`/deleteservice/${serviceId}`);
  }

  getServiceById(serviceId) {
    return this.authAxios.get(`/getservice/${serviceId}`);
  }

  updateService(categoryId, serviceId, serviceData) {
    return this.authAxios.put(`/updateservice/${categoryId}/${serviceId}`, serviceData);
  }

  addNewAppointment(serviceId, appointmentData) {
    return this.authAxios.post(`/addappointment/${serviceId}`, appointmentData);
  }

  getAppointments(serviceId) {
    return this.authAxios.get(`/getappointments/${serviceId}`);
  }

  updateAppointment(appointmentId, appointmentData) {
    return this.authAxios.put(`/updateappointment/${appointmentId}`, appointmentData);
  }

  deleteAppointment(id) {
    return this.authAxios.delete(`/deleteappointment/${id}`);
  }

  getWorkingTime(day, spId) {
    return this.authAxios.get(`/getworkingtimebyday/${day}/${spId}`);
  }

  getAppointmentById(appointmentId) {
    return this.authAxios.get(`/getappointmentbyid/${appointmentId}`);
  }

  rescheduleAppointment(oldId, newId, userId) {
    return this.authAxios.put(`/rescheduleappointment/${oldId}/${newId}/${userId}`);
  }

  cancelAppointment(id) {
    return this.authAxios.put(`/cancelappointment/${id}`);
  }

  getPetById(petId) {
    return this.authAxios.get(`/getpet/${petId}`);
  }
  getAllChatUsers(spId) {
      return this.authAxios.get(`/chats`, { params: { spId } });
    }
  markAsMissed(id) {
    return this.authAxios.put(`/updatemissedappointment/${id}`);
  }

  markAsAttended(id) {
    return this.authAxios.put(`/updateattendedappointment/${id}`);
  }
  getBookedAppointments(spId) {
    return this.authAxios.get(`/getbookedappointments/${spId}`);
  }


  getNotifications(spId) {
  return this.authAxios.get(`/getnotifications/${spId}`);
}

getUnreadCount(spId) {
  return this.authAxios.get(`/unreadCount/${spId}`);
}

markAsRead(notificationId) {
  return this.authAxios.put(`/markRead/${notificationId}`);
}

deleteNotification(notificationId) {
  return this.authAxios.delete(`/deletenotification/${notificationId}`);
}






getserviceOverAllRatings(serviceId) {
  return this.authAxios.get(`/serviceaverage/${serviceId}`);
}

getSelectedServiceCategories(spId) {
  return this.authAxios.get(`/getselectedservicescategories/${spId}`);
}

getratingsOfServiceByName(serviceId) {
  return this.authAxios.get(`/ratings/${serviceId}`);
}
getAppointmentsBySp(spId) {
  return this.authAxios.get(`/getcalendarappointments/${spId}`);
}
getCountServicesBySp(spId) {
  return this.authAxios.get(`/countservices/${spId}`);
}

getAppointmentsPerServiceBySp(spId) {
  return this.authAxios.get(`/appointmentsperservice/${spId}`);
}


}

export default new SpService();
