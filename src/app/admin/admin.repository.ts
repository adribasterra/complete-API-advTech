import { Service } from 'typedi';
import { DatabaseService, DBQuery } from '../../database/src/index';
import { Admin } from './admin.model';
import { Demographics } from './stats/demographics.model';
import { Economics } from './stats/economics.model';
import { Purchases } from './stats/purchases.model';

@Service()
export class AdminRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Admin[]> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT ad.*, a.email, a.name FROM public.admin ad inner join public.auth a on ad.iduser = a.idauth',
      params: []
    };

    const admins = await this.databaseService.execQuery(queryDoc);
    return admins.rows;
  }

  async findById(idAdmin: number): Promise<Admin> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT ad.*, a.email, a.name FROM public.admin ad inner join public.auth a on ad.iduser = a.idauth WHERE ad.id = $1',
      params: [idAdmin]
    };

    const admins = await this.databaseService.execQuery(queryDoc);
    if(admins == null || admins.rows == null) return null;
    return admins.rows[0];
  }

  find(adminId: number): DBQuery {
    return {
      sql:
        'SELECT * FROM public.admin WHERE id = $1',
      params: [adminId]
    };
  }

  async findByEmail(email: string): Promise<Admin> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT ad.*, a.* FROM public.admin ad inner join public.auth a on ad.iduser = a.idauth WHERE a.email = $1',
      params: [email]
    };

    const admins = await this.databaseService.execQuery(queryDoc);
    if(admins == null || admins.rows == null) return null;
    return admins.rows[0];
  }

  create(admin: Admin): DBQuery {
    return {
      sql:
        'INSERT INTO public.admin (iduser, role) VALUES ($1, $2) RETURNING *',
      params: [admin.iduser, admin.role]
    };
  }
  
  async edit(admin: Admin): Promise<Admin> {
    const queryDoc: DBQuery = {
      sql:
        'UPDATE public.admin SET role = $1 WHERE id = $2 RETURNING *',
      params: [admin.role, admin.id]
    };

    const admins = await this.databaseService.execQuery(queryDoc);
    if (admins == null || admins.rows == null) return null;
    return admins.rows[0];
  }

  delete(idAdmin: number): DBQuery {
    return {
      sql:
      'DELETE FROM public.admin WHERE id = $1 RETURNING *',
      params: [idAdmin]
    };
  }

  async statsDemographics(): Promise<any> {

    let stats: Demographics = {
      '<18': await this.getAllCustomersPerAge(0, 18),
      '18-30': await this.getAllCustomersPerAge(18, 30),
      '40-65': await this.getAllCustomersPerAge(40, 65),
      '+65': await this.getAllCustomersPerAge(65, 150)
    }

    return stats;
  }

  async statsPurchases(): Promise<Purchases> {
    let customerNumPurchases = [];
    let maxPurchasesCustomer = [];
    let totalPurchases = 0;

    // 1. Extract all different customers
    const customers = await this.getAllCustomers();
    if (customers == null) return null;

    for (const customer of customers){
      // 2. Count all purchases per extracted customer
      const numPurchases = await this.countAllPurchasesPerCustomer(customer.idcustomer);
      if (numPurchases != null) {
        customerNumPurchases.push({ idcustomer: customer.idcustomer, numPurchases });
        maxPurchasesCustomer.push(numPurchases);
      }
    }
    // 3. Calculate max number of purchases
    const maxPurchases = Math.max(...maxPurchasesCustomer);

    // 4. Count all purchases in table history
    totalPurchases = await this.countAllHistoryRows();
    if (totalPurchases == null) return null;
    
    // 5. Calculate averagePurchases per customer
    const averagePurchases = totalPurchases / customers.length;

    let stats: Purchases = {
      customerNumPurchases,
      maxPurchases,
      averagePurchases
    }

    return stats;
  }

  async statsEconomics(): Promise<Economics> {
    let customerSumExpenses = [];
    let maxSpentCustomer = [];
    let totalSpent = 0;

    // 1. Extract all different customers
    const customers = await this.getAllCustomers();
    if (customers == null) return null;

    for (const customer of customers) {
      // 2. Count all expenses per extracted customer
      const totalSpent = await this.sumExpensesPerCustomer(customer.idcustomer);
      if (totalSpent != null) {
        customerSumExpenses.push({ idcustomer: customer.idcustomer, totalSpent });
        maxSpentCustomer.push(totalSpent);
      }
    }
    // 3. Calculate max number of expenses
    const maxSpent = Math.max(...maxSpentCustomer);

    // 4. Count all expenses in table history
    totalSpent = await this.countAllHistoryRows();
    if (totalSpent == null) return null;

    // 5. Calculate averageExpenses per customer
    const averageExpenses = totalSpent / customers.length;

    let stats: Economics = {
      customerSumExpenses,
      maxSpent,
      averageExpenses
    }

    return stats;
  }

  async getAllCustomers(): Promise<any> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT DISTINCT idcustomer FROM public.history',
      params: []
    };

    const customers = await this.databaseService.execQuery(queryDoc);
    if (customers == null || customers.rows == null) return null;
    return customers.rows;
  }

  async countAllHistoryRows(): Promise<number> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT COUNT(*) FROM public.history',
      params: []
    };

    const total = await this.databaseService.execQuery(queryDoc);
    if (total == null || total.rows == null) return null;
    return total.rows[0].count;
  }

  async countAllPurchasesPerCustomer(idcustomer: number): Promise<number> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT COUNT(*) FROM public.history WHERE idcustomer = $1',
      params: [idcustomer]
    };

    const purchases = await this.databaseService.execQuery(queryDoc);
    if (purchases == null || purchases.rows == null || purchases.rows[0].count == null) return null;
    return parseInt(purchases.rows[0].count);
  }

  async sumExpensesPerCustomer(idcustomer: number): Promise<number> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT SUM(points) FROM public.history WHERE idcustomer = $1',
      params: [idcustomer]
    };

    const expenses = await this.databaseService.execQuery(queryDoc);
    if (expenses == null || expenses.rows == null || expenses.rows[0].sum == null) return null;
    return parseInt(expenses.rows[0].sum);
  }

  async getAllCustomersPerAge(minAge: number, maxAge: number): Promise<number> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT COUNT(*) FROM public.history WHERE age > $1 AND age <= $2',
      params: [minAge, maxAge]
    };

    const customers = await this.databaseService.execQuery(queryDoc);
    if (customers == null || customers.rows == null) return null;
    return parseInt(customers.rows[0].count);
  }

}
