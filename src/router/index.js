import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')
// Masterfiles
const Client = () => import('@/views/masterfiles/client/Client')
const Contract = () => import('@/views/masterfiles/contract/Contract')
const Login = () => import('@/views/Login')
// References
const ServiceCategory = () => import('@/views/references/service-category/ServiceCategory')
const Service = () => import('@/views/references/service/Service')
const DocumentType = () => import('@/views/references/document-type/DocumentType')
const BusinessStyle = () => import('@/views/references/business-style/BusinessStyle')
const BusinessType = () => import('@/views/references/business-type/BusinessType')
const AccountType = () => import('@/views/references/account-type/AccountType')
const AccountClass = () => import('@/views/references/account-class/AccountClass')
const AccountTitle = () => import('@/views/references/account-title/AccountTitle')
const Charge = () => import('@/views/references/charge/Charge')
const Rdo = () => import('@/views/references/rdo/Rdo')
const Location = () => import('@/views/references/location/Location')
const TaxType = () => import('@/views/references/tax-type/TaxType')
const Bank = () => import('@/views/references/bank/Bank')
const Ewallet = () => import('@/views/references/ewallet/Ewallet')
const Personnel = () => import('@/views/settings/personnel/Personnel')
const UserGroup = () => import('@/views/settings/user-group/UserGroup')

const Billing = () => import('@/views/transactions/billing/Billing')
const Approval = () => import('@/views/approvals/Approval')
const ContractApproval = () => import('@/views/approvals/Contract')
const DisbursementApproval = () => import('@/views/approvals/Disbursement')
const Payment = () => import('@/views/transactions/payment/Payment')
const CollectionApproval = () => import('@/views/approvals/Collection')
const Disbursement = () => import('@/views/transactions/disbursement/Disbursement')
const MyProfile = () => import('@/views/profile/MyProfile')

Vue.use(Router)

const router = new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})
export default router
router.beforeEach((to, from, next) => {

  // check if the route requires authentication and user is not logged in
  if (to.matched.some(route => route.meta.requiresAuth) && !store.state.isLoggedIn) {
    // redirect to login page
    next({ name: 'Login' })
    return
  }

  next()
})
function configRoutes () {
  return [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: TheContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
          meta: { requiresAuth: true }
        },
        {
          path: '/masterfiles/client',
          name: 'Client',
          component: Client,
          meta: { requiresAuth: true }
        },
        {
          path: '/masterfiles/contract',
          name: 'Contract',
          component: Contract,
          meta: { requiresAuth: true }
        },
        {
          path: '/references/service-category',
          name: 'Service Category',
          component: ServiceCategory,
          meta: { requiresAuth: true }
        },
        {
          path: '/references/service',
          name: 'Service',
          component: Service,
          meta: { requiresAuth: true }
        },
        {
          path: '/references/document-type',
          name: 'Document Type',
          component: DocumentType,
          meta: { requiresAuth: true }
        },
        {
          path: '/references/business-style',
          name: 'Business Style',
          component: BusinessStyle,
          meta: { requiresAuth: true }
        },
        {
          path: '/references/business-type',
          name: 'Business Type',
          component: BusinessType,
          meta: { requiresAuth: true }
        },
        {
          path: '/references/account-type',
          name: 'Account Type',
          component: AccountType,
          meta: { requiresAuth: true }
        },
        {
          path: '/references/account-class',
          name: 'Account Class',
          component: AccountClass,
          meta: { requiresAuth: true }
        },
        {
          path: '/references/account-title',
          name: 'Account Title',
          component: AccountTitle,
          meta: { requiresAuth: true }
        },
        {
          path: '/references/charge',
          name: 'Charge',
          component: Charge,
          meta: { requiresAuth: true }
        },
        {
          path: '/references/rdo',
          name: 'Rdo',
          component: Rdo,
          meta: { requiresAuth: true }
        },
        {
          path: '/references/location',
          name: 'Location',
          component: Location,
          meta: { requiresAuth: true }
        },
        {
          path: '/references/tax-type',
          name: 'Tax Type',
          component: TaxType,
          meta: { requiresAuth: true }
        },
        {
          path: '/references/bank',
          name: 'Bank',
          component: Bank,
          meta: { requiresAuth: true }
        },
        {
          path: '/references/ewallet',
          name: 'Ewallet',
          component: Ewallet,
          meta: { requiresAuth: true }
        },
        {
          path: '/settings/personnel',
          name: 'Personnel',
          component: Personnel,
          meta: { requiresAuth: true }
        },
        {
          path: '/settings/user-group',
          name: 'User Group',
          component: UserGroup,
          meta: { requiresAuth: true }
        },
        {
          path: '/transactions/billing',
          name: 'Billing',
          component: Billing,
          meta: { requiresAuth: true }
        },
        {
          path: '/transactions/disbursement',
          name: 'Disbursement',
          component: Disbursement,
          meta: { requiresAuth: true }
        },
        {
          path: '/approvals',
          component: Approval,
          meta: { requiresAuth: true },
          children: [
            {
              path: '/',
              redirect: 'contracts'
            },
            {
              path: 'contracts',
              component: ContractApproval,
            },
            {
              path: 'disbursements',
              component: DisbursementApproval,
            },
            {
              path: 'collections',
              component: CollectionApproval,
            }
          ]
        },
        {
          path: '/transactions/payment',
          name: 'Payment',
          component: Payment,
          meta: { requiresAuth: true }
        },
        {
          path: '/profile',
          name: 'MyProfile',
          component: MyProfile,
          meta: { requiresAuth: true }
        },
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
  ]
}

