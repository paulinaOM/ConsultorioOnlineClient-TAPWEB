import Vue from "vue";
import VueRouter from "vue-router";

import "bootstrap"
import "bootstrap/dist/css/bootstrap.css"
import PatientForm from '../components/Patient/PatientForm.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import DoctorForm from '../components/Doctor/DoctorForm.vue'
import Home from '../components/Home.vue'
import RenderMap from '../components/MapCovid2/RenderMap.vue'
import TaxDataForm from '../components/Patient/TaxDataForm.vue'
import MedicalConsultationForm from '../components/Patient/MedicalConsultationForm.vue'
import DoctorsList from '../components/Patient/DoctorsList.vue'
import PriorConsultation from '../components/Patient/PriorConsultation.vue'
import ClinicHistory from '../components/Patient/ClinicHistory.vue'
import BillsHistory from '../components/Patient/BillsHistory.vue'
import CRUDDoctorService from '../components/Doctor/CRUDDoctorService.vue'
import ConsultationList from '../components/Doctor/ConsultationList.vue'
import ConsultationDetails from '../components/Doctor/ConsultationDetails.vue'
import Bill from '../components/Doctor/Bill.vue'
import TicketHistory from "@/components/Patient/TicketHistory";
import Prescription from '../components/Doctor/Prescription.vue'
import Medicines from "@/components/Patient/Medicines";
import PriorConsultationDoctor from '../components/Doctor/PriorConsultationDoctor.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: "/home",
        name: "home",
        component: Home
    },
    {
        path: "/registerPatient",
        name: "registerPatient",
        component: PatientForm
    },
    {
        path: "/registerDoctor",
        name: "registerDoctor",
        component: DoctorForm
    },
    {
        path: "/login",
        name: "login",
        component: Login
    },
    {
        path: "/register",
        name: "register",
        component: Register
    },
    {
        path: "/taxData",
        name: "taxData",
        component: TaxDataForm
    },
    {
        path: "/registerConsultation",
        name: "registerConsultation",
        component: MedicalConsultationForm
    },
    {
        path: "/doctors",
        name: "doctors",
        component: DoctorsList
    },
    {
        path: "/priorConsultation",
        name: "priorConsultation",
        component: PriorConsultation
    },
    {
        path: "/clinicHistory",
        name: "clinicHistory",
        component: ClinicHistory
    },
    {
        path: "/doctorService",
        name: "doctorService",
        component: CRUDDoctorService
    },
    {
        path: "/consultationList",
        name: "consultationList",
        component: ConsultationList
    },
    {
        path: "/consultation/:id",
        name: "consultationDetails",
        component: ConsultationDetails
    },
    {
        path: "/prescription/:id",
        name: "prescription",
        component: Prescription
    },
    {
        path: "/bill/:id",
        name: "bill",
        component: Bill
    },
    {
        path: "/billsHistory",
        name: "billsHistory",
        component: BillsHistory
    },
    {
        path: "/priorConsultationDoctor",
        name: "priorConsultationDoctor",
        component: PriorConsultationDoctor
    },
    {
        path: "/mapaCasosCOVID",
        name: "mapaCasosCOVID",
        component: RenderMap
    },
    {
        path: "/salesHistory",
        name: "salesHistory",
        component: TicketHistory
    },
    {
        path: "/store",
        name: "store",
        component: Medicines
    },



];

const router = new VueRouter({
    mode: "history",
    routes: routes
});

export default router;
