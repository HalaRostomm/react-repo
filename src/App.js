import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useParams, useNavigate } from "react-router-dom";
import Login from './component/Login';
import Register from './component/Register';
import AdminProfile from './component/AdminProfile';
import DoctorProfile from './component/DoctorProfile';
import SpProfile from './component/SpProfile';
import Navbar from './component/Navbar';
import UpdateAdmin from './component/UpdateAdmin';
import UserProfile from './component/UserProfile';
import PpProfile from './component/PpProfile';

import ProductList from './component/ProductList';
import AddProduct from './component/AddProduct';
import UpdateProduct from './component/UpdateProduct';
import PetList from './component/PetList';
import AddPet from './component/AddPet';
import UpdatePet from './component/UpdatePet';
import ServiceList from './component/ServiceList';
import AddService from './component/AddService';
import UpdateService from './component/UpdateService';
import AdminDashboard from './component/AdminDashboard';
import AddUser from './component/AddUser';
import UserList from './component/UserList';
import AddPp from './component/AddPp';
import AddSp from './component/AddSp';
import SpList from './component/SpList';
import PpList from './component/PpList';
import DoctorList from './component/DoctorList';
import AddDoctor from './component/AddDoctor';
import AdminList from './component/AdminList';
import AddAdmin from './component/AddAdmin';
import AddCompany from './component/AddCompany';
import CompanyList from './component/CompanyList';
import UpdateCompany from './component/UpdateCompany';
import UpdateProfileDoctor from './component/UpdateProfileDoctor';
import UpdateProfileUser from './component/UpdateProfileUser';
import UpdateProfilePp from './component/UpdateProfilePp';
import UpdateProfileSp from './component/UpdateProfileSp';
import UpdatePassAdmin from './component/UpdatePassAdmin';
import UpdatePassUser from './component/UpdatePassUser';
import UpdatePassDr from './component/UpdatePassDr';
import UpdatePassSp from './component/UpdatePassSp';
import UpdatePassPp from './component/UpdatePassPp';
import PetCategoryList from './component/PetCategoryList';
import AddPetCategory from './component/AddPetCategory';
import UpdatePetCategory from './component/UpdatePetCategory';
import AppointmentList from './component/AppointmentList';
import AddAppointment from './component/AddAppointment';
import UpdateAppointment from './component/UpdateAppointment';
import SpeciDr from './component/SpeciDr';
import DrDetails from './component/DrDetails';
import ConfirmBooking from './component/ConfirmBooking';
import AddServiceCategory from './component/AddServiceCategory';
import AddProductCategory from './component/AddProductCategory';
import ServiceCategoryList from './component/ServiceCategoryList';
import ProductCategoryList from './component/ProductCategoryList';
import MyAppointments from './component/MyAppointments';

import DoctorAvailability from './component/DoctorAvailability';
import Vetappdtls from './component/Vetappdtls';
import CheckupAppoi from './component/CheckupAppoi';
import PassedAppDtls from './component/PassedAppDtls';
import Serviceappdtls from './component/Serviceappdtls';
import AppoiDtls from './component/AppoiDtls';
import ShopNow from './component/ShopNow';
import ProductDtls from './component/ProductDtls';
import AddToCart from './component/AddToCart';
import AppSp from './component/AppSp';
import WorkingTimesp from './component/WorkingTimesp';
import UpdateAppSp from './component/UpdateAppSp';
import AddAppsp from './component/AddAppsp';
import CardPage from './component/CardPage';
import CashPage from './component/CashPage';
import Services from './component/Services';
import SpAppoi from './component/SpAppoi';
import ConfirmSpApp from './component/ConfirmSpApp';
import RateService from './component/RateService';
import RateDoctor from './component/RateDoctor';
import Orders from './component/Orders';
import OrderInfo from './component/OrderInfo';
import MyOrders from './component/MyOrders';
import MyOrderInfo from './component/MyOrderInfo';
import AppDtlsSp from './component/AppDtlsSp';

import SpNotif from './component/SpNotif';
import Ppnotf from './component/Ppnotf';
import UserNotf from './component/UserNotf';
import DrNotf from './component/DrNotf';


import ChatRoom from './component/ChatRoom';
import UserChats from './component/UserChats';
import SpChats from './component/SpChats';
import DrChat from './component/DrChat';

import { useLocation } from 'react-router-dom';

import UserHome from './component/UserHome';
import DrDashboard from './component/DrDashboard';
import SpDash from './component/SpDash';
import PpDash from './component/PpDash';
import AddGeneralPost from './component/AddGeneralPost';
import UpdatePost from './component/UpdatePost';
import MyPet from './component/MyPet';
import AddAdoptionPost from './component/AddAdoptionPost';
import AddLostFoundPost from './component/AddLostFoundPost';
import ListAdop from './component/ListAdop';
import ListLostFoun from './component/ListLostFoun';
import ServiceDtls from './component/ServiceDtls';
import UrgentDrList from './component/UrgentDrList';
import EmailVerification from './component/EmailVerification';
import UserDashAdmin from './component/UserDashAdmin';
import PpDashAdmin from './component/PpDashAdmin'
import SpDashAdmin from './component/SpDashAdmin'
import DrDashAdmin from './component/DrDashAdmin'
import ReschSp from './component/ReschSp';
import Reschedule from './component/Reschedule';
import UpdateProductCategory from './component/UpdateProductCategory';
import UpdateServiceCategory from './component/UpdateServiceCategory';

function App() {
    const Navigate = useNavigate();
     const location = useLocation(); // 👈 get the current path
  const hideNavbarRoutes = ['/', '/login', '/register']; 
  return (
    <>
      
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
   
    
      <Routes>
        <Route path="/login" element={<Login />} />
     
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />

<Route path="/api/:verify-code/:email/:code" element={<EmailVerification />} />


        <Route path='/pp/dashboard' element={<PpDash token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path='/sp/dashboard' element={<SpDash token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path='/doctor/dashboard' element={<DrDashboard token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path='/user/home' element={<UserHome token={localStorage.getItem("jwt_token")}/>}></Route>



        <Route path='/admin/updatepetcategory/:id' element={<UpdatePetCategory token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path='/admin/updateproductcategory/:id' element={<UpdateProductCategory token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path='/admin/updateservicecategory/:id' element={<UpdateServiceCategory token={localStorage.getItem("jwt_token")}/>}></Route>







        <Route path='/admin/addproductcategory' element={<AddProductCategory token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path='/admin/addservicecategory' element={<AddServiceCategory token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path="/admin/getproductcategories" element={<ProductCategoryList token={localStorage.getItem("jwt_token")} />} />
        <Route path="/admin/getservicecategories" element={<ServiceCategoryList token={localStorage.getItem("jwt_token")} />} />

        <Route
  path="/user/getuserappointments/:id" element={<MyAppointments token={localStorage.getItem("jwt_token")} />}
/>

<Route path="/doctor/getavailability/:doctorId" element={<DoctorAvailability token={localStorage.getItem("jwt_token")}/>}></Route>
<Route path="/user/vetappointmentdetails/:id" element={<Vetappdtls token={localStorage.getItem("jwt_token")}/>}></Route>
<Route path="/user/serviceappointmentdetails/:id" element={<Serviceappdtls token={localStorage.getItem("jwt_token")}/>}></Route>


<Route path="/sp/getavailability/:spId" element={<WorkingTimesp token={localStorage.getItem("jwt_token")}/>}></Route>
<Route path="/sp/getappointments/:serviceId" element={<AppSp token={localStorage.getItem("jwt_token")} />} />
<Route path="/sp/getservices/:spId" element={<ServiceList token={localStorage.getItem("jwt_token")} />} />
<Route path="/sp/updateappointment/:appointmentId" element={<UpdateAppSp token={localStorage.getItem("jwt_token")} />} />
<Route path='/sp/addappointment/:serviceId' element={<AddAppsp token={localStorage.getItem("jwt_token")}/>}></Route>
<Route path="/sp/addservice" element={<AddService token={localStorage.getItem("jwt_token")} />} />


<Route path="/user/getdoctorreviews/:doctorId" element={<RateDoctor token={localStorage.getItem("jwt_token")} />} />
<Route path="/user/getservicereviews/:serviceId" element={<RateService token={localStorage.getItem("jwt_token")} />} />

        <Route path="/user/updateuser/:id" element={<UpdateProfileUser token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path="/admin/admindashboard" element={<AdminDashboard token={localStorage.getItem("jwt_token")} />} />
        <Route path="/admin/getallusers" element={<UserList token={localStorage.getItem("jwt_token")} />} />
        <Route path="/admin/getallcompanies" element={<CompanyList token={localStorage.getItem("jwt_token")} />} />
        <Route path="/admin/getpetcategories" element={<PetCategoryList token={localStorage.getItem("jwt_token")} />} />
        <Route path='/admin/addpetcategory' element={<AddPetCategory token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path="/user/getserviceappointments/:serviceId" element={<SpAppoi token={localStorage.getItem("jwt_token")} />} />

        <Route path="/user/getspecializeddoctors/:specialization" element={<SpeciDr token={localStorage.getItem("jwt_token")} />} />
        <Route path="/user/getappointments/:doctorId" element={<DrDetails token={localStorage.getItem("jwt_token")} />} />
        <Route 
  path="/confirmbooking/:userId/:doctorId/:appointmentId" 
  element={<ConfirmBooking token={localStorage.getItem("jwt_token")} />} 
/>

<Route 
  path="/confirmservicebooking/:userId/:serviceId/:appointmentId" 
  element={<ConfirmSpApp token={localStorage.getItem("jwt_token")} />} 
/>

<Route path="/user/rescheduleserviceappointment/:appointmentId/:serviceId" element={<ReschSp token={localStorage.getItem("jwt_token")} />} />
<Route path="/user/rescheduleappointment/:appointmentId/:doctorId" element={<Reschedule token={localStorage.getItem("jwt_token")} />} />


<Route path="/sp/getnotifications/:spId" element={<SpNotif token={localStorage.getItem("jwt_token")} />} />
<Route path="/pp/getnotifications/:ppId" element={<Ppnotf token={localStorage.getItem("jwt_token")} />} />
<Route path="/doctor/getnotifications/:doctorId" element={<DrNotf token={localStorage.getItem("jwt_token")} />} />
<Route path="/user/getnotifications/:userId" element={<UserNotf token={localStorage.getItem("jwt_token")} />} />


<Route path="/user/geturgentdoctors" element={<UrgentDrList token={localStorage.getItem("jwt_token")} />} />


 <Route path="/" element={<Navigate to="/user/chats/:appuserid" replace />} />
        <Route path="/user/chats/:appuserid" element={<UserChats />} />
        <Route path="/doctor/chats/:doctorId" element={<DrChat />} />
        <Route path="/sp/chats/:spId" element={<SpChats />} />
<Route path="/chat/:receiverId/:senderId/:petId" element={<ChatRoom />} />


<Route path="/user/addpost/:userId" element={<AddGeneralPost token={localStorage.getItem("jwt_token")} />} />
<Route path="/user/updatepost/:postId" element={<UpdatePost token={localStorage.getItem("jwt_token")} />} />

<Route path="/user/addforadoptionpost/:userId" element={<AddAdoptionPost token={localStorage.getItem("jwt_token")} />} />
<Route path="/user/addfoundlostpost/:userId" element={<AddLostFoundPost token={localStorage.getItem("jwt_token")} />} />
<Route path="/user/getlostfoundposts/:userId" element={<ListLostFoun token={localStorage.getItem("jwt_token")} />} />
<Route path="/user/getadoptionposts/:userId" element={<ListAdop token={localStorage.getItem("jwt_token")} />} />


<Route path="/user/getservice/:id" element={<ServiceDtls token={localStorage.getItem("jwt_token")} />} />

<Route path="/user/getpet/:petId" element={<MyPet token={localStorage.getItem("jwt_token")} />} />


<Route path="/pp/getorderinfo/:orderId" element={<OrderInfo token={localStorage.getItem("jwt_token")} />} />
<Route path="/pp/getorders/:ppId" element={<Orders token={localStorage.getItem("jwt_token")} />} />

<Route path="/user/order/:userid" element={<MyOrders token={localStorage.getItem("jwt_token")} />} />

<Route path="/user/getorderitems/:orderId" element={<MyOrderInfo token={localStorage.getItem("jwt_token")} />} />

<Route path="/doctor/passedappointmentdetails/:petId/:appointmentId" element={<PassedAppDtls token={localStorage.getItem("jwt_token")} />} />
<Route path="/doctor/checkupappoi/:id" element={<CheckupAppoi token={localStorage.getItem("jwt_token")} />} />
<Route path="/user/getcart/:userId" element={<AddToCart token={localStorage.getItem("jwt_token")} />} />
<Route path="/user/pay/:userid" element={<CardPage token={localStorage.getItem("jwt_token")} />} />
<Route path="/user/cod/:userid" element={<CashPage token={localStorage.getItem("jwt_token")} />} />
<Route path="/user/getallservices/:category" element={<Services token={localStorage.getItem("jwt_token")} />} />

        <Route path="/doctor/getappointments/:doctorId" element={<AppointmentList token={localStorage.getItem("jwt_token")} />} />
        <Route path='/doctor/addappointment/:doctorId' element={<AddAppointment token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path='/doctor/updateappointment/:appointmentId' element={<UpdateAppointment token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path="/doctor/getappointmentbyid/:id" element={<AppoiDtls token={localStorage.getItem("jwt_token")} />} />
        <Route path="/sp/getappointmentbyid/:id" element={<AppDtlsSp token={localStorage.getItem("jwt_token")} />} />



        <Route path="/admin/getdoctors" element={<DoctorList token={localStorage.getItem("jwt_token")} />} />
        <Route path="/admin/getadmins" element={<AdminList token={localStorage.getItem("jwt_token")} />} />
        <Route path="/admin/getallsp" element={<SpList token={localStorage.getItem("jwt_token")} />} />
        <Route path='/admin/updatecompany/:id' element={<UpdateCompany token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path="/admin/getallpp" element={<PpList token={localStorage.getItem("jwt_token")} />} />
        <Route path='/admin/adduser' element={<AddUser token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path='/admin/addadmin' element={<AddAdmin token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path='/admin/updateadmin/:id' element={<UpdateAdmin token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path='/admin/adddoctor' element={<AddDoctor token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path='/admin/addcompany' element={<AddCompany token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path='/admin/addsp' element={<AddSp token={localStorage.getItem("jwt_token")}/>}></Route>
      

        <Route path='/user/getproducts/:category' element={<ShopNow token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path='/user/getproduct/:productId' element={<ProductDtls token={localStorage.getItem("jwt_token")}/>}></Route>


        <Route path='/admin/dashdr/:doctorId' element={<DrDashAdmin token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path='/admin/dashuser/:userId' element={<UserDashAdmin token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path='/admin/dashsp/:spId' element={<SpDashAdmin token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path='/admin/dashpp/:ppId' element={<PpDashAdmin token={localStorage.getItem("jwt_token")}/>}></Route>


        <Route path='/doctor/updatedoctor/:id' element={<UpdateProfileDoctor token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path='/admin/addpp' element={<AddPp token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path="/pp/updatePassword" element={<UpdatePassPp token={localStorage.getItem("jwt_token")} />} />
        <Route path="/sp/updatePassword" element={<UpdatePassSp token={localStorage.getItem("jwt_token")} />} />
        <Route path='/pp/updatepp/:id' element={<UpdateProfilePp token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path='/sp/updatesp/:id' element={<UpdateProfileSp token={localStorage.getItem("jwt_token")}/>}></Route>
        <Route path="/doctor/updatePassword" element={<UpdatePassDr token={localStorage.getItem("jwt_token")} />} />
        <Route path="/user/updatePassword" element={<UpdatePassUser token={localStorage.getItem("jwt_token")} />} />
        <Route path="/admin/profile" element={<AdminProfile token={localStorage.getItem("jwt_token")} />} />
        <Route path="/admin/updatePassword" element={<UpdatePassAdmin token={localStorage.getItem("jwt_token")} />} />
        <Route path="/user/profile" element={<UserProfile token={localStorage.getItem("jwt_token")} />} />
        <Route path="/doctor/profile" element={<DoctorProfile token={localStorage.getItem("jwt_token")} />} />
        <Route path="/sp/profile" element={<SpProfile token={localStorage.getItem("jwt_token")} />} />
        <Route path="/pp/profile" element={<PpProfile token={localStorage.getItem("jwt_token")} />} />
        <Route path='/pp/getallproducts' element={<ProductList token={localStorage.getItem("jwt_token")}/>}></Route>
      <Route path='/pp/addproduct' element={<AddProduct token={localStorage.getItem("jwt_token")}/>}></Route>
      <Route path="/pp/updateproduct/:categoryId/:productId" element={<UpdateProduct token={localStorage.getItem("jwt_token")}/>}></Route>
      <Route path='/user/getpets' element={<PetList token={localStorage.getItem("jwt_token")}/>}></Route>
      <Route path='/user/addpet' element={<AddPet token={localStorage.getItem("jwt_token")}/>}></Route>
      <Route path='/user/updatepet/:petId/:categoryId'  element={<UpdatePet token={localStorage.getItem("jwt_token")}/>}></Route>
      <Route path='/sp/getallservices' element={<ServiceList token={localStorage.getItem("jwt_token")}/>}></Route>
      <Route path='/sp/addservice' element={<AddService token={localStorage.getItem("jwt_token")}/>}></Route>
      <Route path='/sp/updateservice/:categoryId/:id' element={<UpdateService token={localStorage.getItem("jwt_token")}/>}></Route>



      </Routes>
    </>
  );
}

export default App;

