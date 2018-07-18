"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var register_component_1 = require("./components/register/register.component");
var forgot_password_component_1 = require("./components/forgot-password/forgot-password.component");
var login_component_1 = require("./components/login/login.component");
var home_component_1 = require("./components/home/home.component");
var dashboard_component_1 = require("./components/dashboard/dashboard.component");
var reset_password_component_1 = require("./components/reset-password/reset-password.component");
var profile_component_1 = require("./components/profile/profile.component");
var asset_component_1 = require("./components/asset/asset.component");
var task_component_1 = require("./components/task/task.component");
var appointment_component_1 = require("./components/appointment/appointment.component");
var change_password_component_1 = require("./components/change-password/change-password.component");
var office_component_1 = require("./components/office/office.component");
var company_component_1 = require("./components/company/company.component");
var customer_component_1 = require("./components/customer/customer.component");
var ticket_component_1 = require("./components/ticket/ticket.component");
var user_component_1 = require("./components/user/user.component");
var group_component_1 = require("./components/group/group.component");
var module_component_1 = require("./components/module/module.component");
var student_component_1 = require("./components/education/student/student.component");
var course_component_1 = require("./components/education/course/course.component");
var certification_component_1 = require("./components/education/certification/certification.component");
var instructor_component_1 = require("./components/education/instructor/instructor.component");
var topic_component_1 = require("./components/education/topic/topic.component");
var discipline_component_1 = require("./components/education/discipline/discipline.component");
// Financial components
var financial_register_component_1 = require("./components/financials/register/financial-register.component");
var ledger_component_1 = require("./components/financials/ledger/ledger.component");
// Insurance components
var insurance_company_component_1 = require("./components/insurance/company/insurance-company.component");
var insurance_customer_component_1 = require("./components/insurance/customer/insurance-customer.component");
var AppRoutes = [
    {
        path: '',
        component: home_component_1.HomeComponent
    }, {
        path: 'login',
        component: login_component_1.LoginComponent
    }, {
        path: 'home',
        component: home_component_1.HomeComponent
    }, {
        path: 'register',
        component: register_component_1.RegisterComponent
    }, {
        path: 'forgot-password',
        component: forgot_password_component_1.ForgotPasswordComponent
    }, {
        path: 'change-password',
        component: change_password_component_1.ChangePasswordComponent
    }, {
        path: 'Credentials/Validation',
        component: reset_password_component_1.ResetPasswordComponent
    }, {
        path: 'dashboard',
        component: dashboard_component_1.DashboardComponent
    }, {
        path: 'profile',
        component: profile_component_1.ProfileComponent
    }, {
        path: 'assets',
        component: asset_component_1.AssetComponent
    }, {
        path: 'tasks',
        component: task_component_1.TaskComponent
    }, {
        path: 'appointments',
        component: appointment_component_1.AppointmentComponent
    }, {
        path: 'offices',
        component: office_component_1.OfficeComponent
    }, {
        path: 'companies',
        component: company_component_1.CompanyComponent
    }, {
        path: 'customers',
        component: customer_component_1.CustomerComponent
    }, {
        path: 'tickets',
        component: ticket_component_1.TicketComponent
    }, {
        path: 'users',
        component: user_component_1.UserComponent
    }, {
        path: 'groups',
        component: group_component_1.GroupComponent
    }, {
        path: 'financial/register',
        component: financial_register_component_1.FinancialRegisterComponent
    }, {
        path: 'financial/ledgers',
        component: ledger_component_1.FinancialLedgerComponent
    }, {
        path: 'insurance/companies',
        component: insurance_company_component_1.InsuranceCompanyComponent
    }, {
        path: 'insurance/customers',
        component: insurance_customer_component_1.InsuranceCustomerComponent
    }, {
        path: 'modules',
        component: module_component_1.ModuleComponent
    }, {
        path: 'education/courses',
        component: course_component_1.CourseComponent
    }, {
        path: 'education/students',
        component: student_component_1.StudentComponent
    }, {
        path: 'education/certifications',
        component: certification_component_1.CertificationComponent
    }, {
        path: 'education/instructors',
        component: instructor_component_1.InstructorComponent
    }, {
        path: 'education/topics',
        component: topic_component_1.TopicComponent
    }, {
        path: 'education/disciplines',
        component: discipline_component_1.DisciplineComponent
    }
];
var AppRoutesModule = (function () {
    function AppRoutesModule() {
    }
    return AppRoutesModule;
}());
AppRoutesModule = __decorate([
    core_1.NgModule({
        imports: [
            router_1.RouterModule.forRoot(AppRoutes)
        ],
        exports: [
            router_1.RouterModule
        ]
    })
], AppRoutesModule);
exports.AppRoutesModule = AppRoutesModule;
//# sourceMappingURL=app.routing.js.map