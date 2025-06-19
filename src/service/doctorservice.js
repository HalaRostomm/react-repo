import axios from "axios";

const API_URL = "http://localhost:8080/doctor"; // Your backend URL

class DoctorService {
  constructor() {
    // Create Axios Instance with the token
    this.authAxios = axios.create({
      baseURL: API_URL,
    });

    // Automatically add the token to every request
    this.authAxios.interceptors.request.use((config) => {
      const token = localStorage.getItem("jwt_token"); // Use the correct token name here
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
      const response = await this.authAxios.get("/profile"); // No need to manually add the token here
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      throw error;
    }
  }
  getDoctorById(id) {
    return this.authAxios.get(`/getdoctor/${id}`);
  }
  updateDoctor(id, doctor) {
    return this.authAxios.put(`/updatedoctor/${id}`, doctor);
  }
  addNewAppointment(id, appointmentData){
    return this.authAxios.post(`/addappointment/${id}`, appointmentData);
  }

  getAppointments(doctorId) {
    return this.authAxios.get(`/getappointments/${doctorId}`);
  }

  getWorkingTimeByDay(day, doctorId) {
    return this.authAxios.get(`/getworkingtimebyday/${day}/${doctorId}`);
  }

  updateAppointment(appointmentId, appointmentData) {
    return this.authAxios.put(`/updateappointment/${appointmentId}`, appointmentData);
  }
  
  getAllChatUsers(doctorId) {
      return this.authAxios.get(`/chats`, { params: { doctorId } });
    }
  deleteAppointment (appointmentId) {
    return this.authAxios.delete(`/deleteappointment/${appointmentId}`);
  }

  getAppointmentById (appointmentId)  {
    return this.authAxios.get(`/getappointmentbyid/${appointmentId}`);
  }
  
  getAppointment (appointmentId)  {
    return this.authAxios.get(`/getappointment/${appointmentId}`);
  }
  cancelBooking (appointmentId){
    return this.authAxios.put(`/cancelappointment/${appointmentId}`);
  }
 
  updateMissedAppointment(appointmentId) {
    return this.authAxios.put(`/updatemissedappointment/${appointmentId}`);
  }

  rescheduleAppointment(oldId, newId, userId) {
    return this.authAxios.put(`/rescheduleappointment/${oldId}/${newId}/${userId}`);
  }

  // Pet
  getPetById(id) {
    return this.authAxios.get(`/getpet/${id}`);
  }

  updateDietaryPreferencesForPet(petId, appointmentId, data) {
    return this.authAxios.put(`/updatepet/${petId}/${appointmentId}`, data);
  }

  getAllChatUsers(doctorId) {
    return this.authAxios.get(`/chats`, { params: { doctorId } });
  }

  // Set availability for a doctor (PUT with a map of day => availability string)
  setAvailability(doctorId, availability) {
    return this.authAxios.put(`/setavailability/${doctorId}`, availability);
  }

  // Get availability for a doctor
  getAvailability(doctorId) {
    return this.authAxios.get(`/getavailability/${doctorId}`);
  }

  // Get booked appointments for a doctor
  getBookedAppointments(doctorId) {
    return this.authAxios.get(`/getbookedappointments/${doctorId}`);
  }
getNotifications(doctorId) {
  return this.authAxios.get(`/getnotifications/${doctorId}`);
}

getUnreadCount(doctorId) {
  return this.authAxios.get(`/unreadCount/${doctorId}`);
}

markAsRead(notificationId) {
  return this.authAxios.put(`/markRead/${notificationId}`);
}

deleteNotification(notificationId) {
  return this.authAxios.delete(`/deletenotification/${notificationId}`);
}
getPercentageOfBookings(doctorId) {
  return this.authAxios.get(`/percentageofbookings/${doctorId}`);
}

getNumberOfDifferentUsers(doctorId) {
  return this.authAxios.get(`/nbofdifferentusers/${doctorId}`);
}

getPercentageOfAttendance(doctorId) {
  return this.authAxios.get(`/percentageofattendance/${doctorId}`);
}
}

export default new DoctorService();
