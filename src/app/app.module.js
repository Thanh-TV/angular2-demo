"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var app_routing_1 = require("./app.routing");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var phone_number_pipe_1 = require("./pipes/phone-number/phone-number.pipe");
var base_service_1 = require("./services/base.service");
var app_component_1 = require("./app.component");
var register_component_1 = require("./components/register/register.component");
var forgot_password_component_1 = require("./components/forgot-password/forgot-password.component");
var header_component_1 = require("./components/share/header/header.component");
var left_menu_component_1 = require("./components/share/left-menu/left-menu.component");
var confirmation_component_1 = require("./components/share/confirmation/confirmation.component");
var login_component_1 = require("./components/login/login.component");
var home_component_1 = require("./components/home/home.component");
var validation_component_1 = require("./components/validation/validation.component");
var reset_password_component_1 = require("./components/reset-password/reset-password.component");
var change_password_component_1 = require("./components/change-password/change-password.component");
var dashboard_component_1 = require("./components/dashboard/dashboard.component");
var profile_component_1 = require("./components/profile/profile.component");
var asset_component_1 = require("./components/asset/asset.component");
var task_component_1 = require("./components/task/task.component");
var appointment_component_1 = require("./components/appointment/appointment.component");
var office_component_1 = require("./components/office/office.component");
var company_component_1 = require("./components/company/company.component");
var customer_component_1 = require("./components/customer/customer.component");
var ticket_component_1 = require("./components/ticket/ticket.component");
var user_component_1 = require("./components/user/user.component");
var group_component_1 = require("./components/group/group.component");
var module_component_1 = require("./components/module/module.component");
var course_component_1 = require("./components/education/course/course.component");
var student_component_1 = require("./components/education/student/student.component");
var certification_component_1 = require("./components/education/certification/certification.component");
var instructor_component_1 = require("./components/education/instructor/instructor.component");
var topic_component_1 = require("./components/education/topic/topic.component");
var course_reference_component_1 = require("./components/education/course-reference/course-reference.component");
var discipline_component_1 = require("./components/education/discipline/discipline.component");
// Financial components
var financial_register_component_1 = require("./components/financials/register/financial-register.component");
var financial_register_add_component_1 = require("./components/share/financial-register-add/financial-register-add.component");
var ledger_component_1 = require("./components/financials/ledger/ledger.component");
// Insurance components
var insurance_company_component_1 = require("./components/insurance/company/insurance-company.component");
var insurance_customer_component_1 = require("./components/insurance/customer/insurance-customer.component");
var phone_number_directive_1 = require("./directives/phone-number/phone-number.directive");
var number_only_directive_1 = require("./directives/number-only/number-only.directive");
var tag_control_directive_1 = require("./directives/tag-control/tag-control.directive");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        // Providers
        providers: [
            base_service_1.BaseService,
            phone_number_pipe_1.PhoneNumberPipe
        ],
        // Modules
        imports: [
            platform_browser_1.BrowserModule,
            http_1.HttpModule,
            app_routing_1.AppRoutesModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule
        ],
        declarations: [
            app_component_1.AppComponent,
            phone_number_directive_1.PhoneNumberFormatterDirective,
            number_only_directive_1.NumberOnlyFormatterDirective,
            tag_control_directive_1.TagControlDirective,
            phone_number_pipe_1.PhoneNumberPipe,
            register_component_1.RegisterComponent,
            forgot_password_component_1.ForgotPasswordComponent,
            header_component_1.HeaderComponent,
            login_component_1.LoginComponent,
            home_component_1.HomeComponent,
            validation_component_1.ValidationComponent,
            reset_password_component_1.ResetPasswordComponent,
            dashboard_component_1.DashboardComponent,
            profile_component_1.ProfileComponent,
            confirmation_component_1.ConfirmationComponent,
            asset_component_1.AssetComponent,
            change_password_component_1.ChangePasswordComponent,
            left_menu_component_1.LeftMenuComponent,
            task_component_1.TaskComponent,
            appointment_component_1.AppointmentComponent,
            office_component_1.OfficeComponent,
            company_component_1.CompanyComponent,
            customer_component_1.CustomerComponent,
            ticket_component_1.TicketComponent,
            user_component_1.UserComponent,
            group_component_1.GroupComponent,
            financial_register_component_1.FinancialRegisterComponent,
            financial_register_add_component_1.FinancialRegisterAddComponent,
            ledger_component_1.FinancialLedgerComponent,
            insurance_company_component_1.InsuranceCompanyComponent,
            insurance_customer_component_1.InsuranceCustomerComponent,
            course_component_1.CourseComponent,
            module_component_1.ModuleComponent,
            student_component_1.StudentComponent,
            certification_component_1.CertificationComponent,
            instructor_component_1.InstructorComponent,
            topic_component_1.TopicComponent,
            course_reference_component_1.CourseReferenceComponent,
            discipline_component_1.DisciplineComponent
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map