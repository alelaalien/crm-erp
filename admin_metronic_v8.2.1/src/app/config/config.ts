import { environment } from "src/environments/environment";

export const URL_SERVICE = environment.URL_SERVICE;
export const URL_FRONTEND = environment.URL_FRONTEND;
export const URL_BACKEND = environment.URL_BACKEND;

export const SIDEBAR: any = [
  {
  name: 'Sensitive Information',
  permissions: [
 
    { name: 'View User Private Info', permission: 'view_user_private_info' },
    { name: 'View User Legal Documents', permission: 'view_user_legal_docs' }, 
  ]
  },
  {
    
    name: 'Roles',
    permissions: [
      { name: 'Create', permission: 'register_role' },
      { name: 'Edit', permission: 'edit_role' },
      { name: 'Delete', permission: 'delete_role' },
    ]
  },
  {
    name: 'Users',
    permissions: [
      { name: 'Create', permission: 'register_user' },
      { name: 'Edit', permission: 'edit_user' },
      { name: 'Delete', permission: 'delete_user' },
    ]
  },
  {
    name: 'Products',
    permissions: [
      { name: 'Create', permission: 'register_product' },
      { name: 'Edit', permission: 'edit_product' },
      { name: 'Delete', permission: 'delete_product' },
      { name: 'View Price Wallet', permission: 'show_wallet_price_product' },
      { name: 'Create New Price', permission: 'register_wallet_price_product' },
      { name: 'Edit Price', permission: 'edit_wallet_price_product' },
      { name: 'Delete Price', permission: 'delete_wallet_price_product' },
    ]
  },
  {
    name: 'Clients',
    permissions: [
      { name: 'Create', permission: 'register_clients' }, // Corregido a plural
      { name: 'Edit', permission: 'edit_clients' },       // Corregido a plural
      { name: 'Delete', permission: 'delete_clients' },   // Corregido a plural
    ]
  },
  {
    name: 'Cash Register',
    permissions: [
      { name: 'Validate Payments', permission: 'validate_payments' },
      { name: 'Cash Register Report', permission: 'cash_reports' },               // Corregido según backend
      { name: 'Processed Contracts History', permission: 'record_contract_process' }, // Corregido según backend
      { name: 'Expense (Cash Out)', permission: 'cash_outflow' },               // Corregido según backend
      { name: 'Income', permission: 'cash_inflow' },                             // Corregido según backend
      { name: 'Close Cash Register', permission: 'close_cash_register' },
    ]
  },
  {
    name: 'Proforma',
    permissions: [
      { name: 'Create', permission: 'register_proforma' },
      { name: 'Edit', permission: 'edit_proforma' },
      { name: 'Delete', permission: 'delete_proforma' },
    ]
  },
  {
    name: 'Schedule',
    permissions: [
      { name: 'Available', permission: 'schedule' }, // Corregido sin el _access
    ]
  },
  {
    name: 'Commissions',
    permissions: [
      { name: 'Available', permission: 'commissions' }, // Corregido sin el _access
    ]
  },
  {
    name: 'Purchases',
    permissions: [
      { name: 'Create', permission: 'register_purchase' },
      { name: 'Edit', permission: 'edit_purchase' },
      { name: 'Delete', permission: 'delete_purchase' },
    ]
  },
  {
    name: 'Transport',
    permissions: [
      { name: 'Create', permission: 'register_transport' },
      { name: 'Edit', permission: 'edit_transport' },
      { name: 'Delete', permission: 'delete_transport' },
    ]
  },
  {
    name: 'Dispatch',
    permissions: [
      { name: 'Available', permission: 'dispatch' }, // Corregido sin el _access
    ]
  },
  {
    name: 'Movements',
    permissions: [
      { name: 'Available', permission: 'movements' }, // Corregido sin el _access
    ]
  },
  {
    name: 'Kardex',
    permissions: [
      { name: 'Available', permission: 'inventory_kardex' }, // Corregido al nombre real del backend
    ]
  },
];