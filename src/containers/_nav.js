import {
  ApprovalPermissions,
  BillingPermissions,
  PaymentPermissions,
  DisbursementPermissions,
  ClientPermissions,
  ContractPermissions,
  ServiceCategoryPermissions,
  ServicePermissions,
  DocumentTypePermissions,
  BusinessStylePermissions,
  BusinessTypePermissions,
  AccountClassPermissions,
  AccountTitlePermissions,
  ChargePermissions,
  RDOPermissions,
  LocationPermissions,
  TaxTypePermissions,
  AccountTypePermissions,
  PersonnelPermissions,
  UserGroupPermissions,
  BankPermissions,
  EwalletPermissions
} from '../helpers/enum'
export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavItem',
        name: 'Dashboard',
        to: '/dashboard',
        icon: 'cil-speedometer',
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Approvals',
        to: '/approvals',
        icon: 'cil-puzzle',
        permissionIds: [
          ...ApprovalPermissions.getIds()
        ]
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Transactions',
        route: '/transactions',
        icon: 'cil-puzzle',
        permissionIds: [
          ...BillingPermissions.getIds(),
          ...PaymentPermissions.getIds(),
          ...DisbursementPermissions.getIds()
        ],
        items: [
          {
            name: 'Billings',
            to: '/transactions/billing',
            permissionIds: [
              ...BillingPermissions.getIds()
            ],
          },
          {
            name: 'Payments',
            to: '/transactions/payment',
            permissionIds: [
              ...PaymentPermissions.getIds()
            ],
          },
          {
            name: 'Disbursement',
            to: '/transactions/disbursement',
            permissionIds: [
              ...DisbursementPermissions.getIds()
            ],
          },
        ]
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Masterfiles',
        route: '/masterfiles',
        icon: 'cil-puzzle',
        permissionIds: [
          ...ClientPermissions.getIds(),
          ...ContractPermissions.getIds(),
        ],
        items: [
          {
            name: 'Clients',
            to: '/masterfiles/client',
            permissionIds: [
              ...ClientPermissions.getIds()
            ]
          },
          {
            name: 'Contracts',
            to: '/masterfiles/contract',
            permissionIds: [
              ...ContractPermissions.getIds()
            ]
          },
        ]
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'References',
        route: '/references',
        icon: 'cil-puzzle',
        permissionIds: [
          ...ServiceCategoryPermissions.getIds(),
          ...ServicePermissions.getIds(),
          ...DocumentTypePermissions.getIds(),
          ...BusinessStylePermissions.getIds(),
          ...BusinessTypePermissions.getIds(),
          ...AccountClassPermissions.getIds(),
          ...AccountTitlePermissions.getIds(),
          ...ChargePermissions.getIds(),
          ...RDOPermissions.getIds(),
          ...LocationPermissions.getIds(),
          ...TaxTypePermissions.getIds(),
        ],
        items: [
          {
            name: 'Service Categories',
            to: '/references/service-category',
            permissionIds: [
              ...ServiceCategoryPermissions.getIds()
            ]
          },
          {
            name: 'Services',
            to: '/references/service',
            permissionIds: [
              ...ServicePermissions.getIds()
            ]
          },
          {
            name: 'Document Types',
            to: '/references/document-type',
            permissionIds: [
              ...DocumentTypePermissions.getIds()
            ]
          },
          {
            name: 'Business Styles',
            to: '/references/business-style',
            permissionIds: [
              ...BusinessStylePermissions.getIds()
            ]
          },
          {
            name: 'Business Type',
            to: '/references/business-type',
            permissionIds: [
              ...BusinessTypePermissions.getIds()
            ]
          },
          {
            name: 'Account Types',
            to: '/references/account-type',
            permissionIds: [
              ...AccountTypePermissions.getIds()
            ]
          },
          {
            name: 'Account Classes',
            to: '/references/account-class',
            permissionIds: [
              ...AccountClassPermissions.getIds()
            ]
          },
          {
            name: 'Account Titles',
            to: '/references/account-title',
            permissionIds: [
              ...AccountTitlePermissions.getIds()
            ]
          },
          {
            name: 'Charges',
            to: '/references/charge',
            permissionIds: [
              ...ChargePermissions.getIds()
            ]
          },
          {
            name: 'RDO',
            to: '/references/rdo',
            permissionIds: [
              ...RDOPermissions.getIds()
            ]
          },
          {
            name: 'Locations',
            to: '/references/location',
            permissionIds: [
              ...LocationPermissions.getIds()
            ]
          },
          {
            name: 'Tax Types',
            to: '/references/tax-type',
            permissionIds: [
              ...TaxTypePermissions.getIds()
            ]
          },
          {
            name: 'Banks',
            to: '/references/bank',
            permissionIds: [
              ...BankPermissions.getIds()
            ]
          },
          {
            name: 'E-Wallet',
            to: '/references/ewallet',
            permissionIds: [
              ...EwalletPermissions.getIds()
            ]
          },
        ]
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Settings',
        route: '/settings',
        icon: 'cil-puzzle',
        permissionIds: [
          ...PersonnelPermissions.getIds(),
          ...UserGroupPermissions.getIds()
        ],
        items: [
          {
            name: 'Personnels',
            to: '/settings/personnel',
            permissionIds: [
              ...PersonnelPermissions.getIds(),
            ],
          },
          {
            name: 'User Groups',
            to: '/settings/user-group',
            permissionIds: [
              ...UserGroupPermissions.getIds()
            ],
          },
        ]
      }
    ]
  }
]