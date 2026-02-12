import {environment} from "src/environments/environment";

export const URL_SERVICE = environment.URL_SERVICE;
export const URL_FRONTEND = environment.URL_FRONTEND;
export const URL_BACKEND = environment.URL_BACKEND;

export const SIDEBAR: any = [
  {
    name: 'Roles',
    permissions: [
      { name: 'Create', permission: 'create_role' },
      { name: 'Edit', permission: 'edit_role' },
      { name: 'Delete', permission: 'delete_role' },
    ]
  },
  {
    name: 'Users',
    permissions: [
      { name: 'Create', permission: 'create_user' },
      { name: 'Edit', permission: 'edit_user' },
      { name: 'Delete', permission: 'delete_user' },
    ]
  },
  {
    name: 'Products',
    permissions: [
      { name: 'Create', permission: 'create_product' },
      { name: 'Edit', permission: 'edit_product' },
      { name: 'Delete', permission: 'delete_product' },
      { name: 'View Price Wallet', permission: 'view_price_wallet_product' },
      { name: 'Create New Price', permission: 'create_price_wallet_product' },
      { name: 'Edit Price', permission: 'edit_price_wallet_product' },
      { name: 'Delete Price', permission: 'delete_price_wallet_product' },
    ]
  },
  {
    name: 'Clients',
    permissions: [
      { name: 'Create', permission: 'create_client' },
      { name: 'Edit', permission: 'edit_client' },
      { name: 'Delete', permission: 'delete_client' },
    ]
  },
  {
    name: 'Cash Register',
    permissions: [
      { name: 'Validate Payments', permission: 'validate_payments' },
      { name: 'Cash Register Report', permission: 'cash_register_report' },
      { name: 'Processed Contracts History', permission: 'processed_contracts_history' },
      { name: 'Expense (Cash Out)', permission: 'cash_expense' },
      { name: 'Income', permission: 'cash_income' },
      { name: 'Close Cash Register', permission: 'close_cash_register' },
    ]
  },
  {
    name: 'Proforma',
    permissions: [
      { name: 'Create', permission: 'create_proforma' },
      { name: 'Edit', permission: 'edit_proforma' },
      { name: 'Delete', permission: 'delete_proforma' },
    ]
  },
  {
    name: 'Schedule',
    permissions: [
      { name: 'Available', permission: 'schedule_access' },
    ]
  },
  {
    name: 'Commissions',
    permissions: [
      { name: 'Available', permission: 'commissions_access' },
    ]
  },
  {
    name: 'Purchases',
    permissions: [
      { name: 'Create', permission: 'create_purchase' },
      { name: 'Edit', permission: 'edit_purchase' },
      { name: 'Delete', permission: 'delete_purchase' },
    ]
  },
  {
    name: 'Transport',
    permissions: [
      { name: 'Create', permission: 'create_transport' },
      { name: 'Edit', permission: 'edit_transport' },
      { name: 'Delete', permission: 'delete_transport' },
    ]
  },
  {
    name: 'Dispatch',
    permissions: [
      { name: 'Available', permission: 'dispatch_access' },
    ]
  },
  {
    name: 'Movements',
    permissions: [
      { name: 'Available', permission: 'movements_access' },
    ]
  },
  {
    name: 'Kardex',
    permissions: [
      { name: 'Available', permission: 'kardex_access' },
    ]
  },
];
