import 'reflect-metadata';
import { Container } from 'typedi';
import { Demographics } from '../stats/demographics.model';
import { Economics } from '../stats/economics.model';
import { Purchases } from '../stats/purchases.model';
import { Admin } from './../admin.model';
import { AdminRepository } from './../admin.repository';
import { AdminService } from './../admin.service';

describe('Admin service module', () => {
  let adminService: AdminService;
  let adminRepositoryMock: any;
  let admins: Admin[];
  let dataDemographics: Demographics;
  let dataPurchases: Purchases;
  let dataEconomics: Economics;

  beforeAll(() => {
    admins = [
      {
        id: 1,
        iduser: 1,
        name: 'Raul Novoa',
        email: 'rnovoa@usj.es',
        password: 'pwd',
        role: 'admin'
      },
      {
        id: 2,
        iduser: 2,
        name: 'Luis Fernandez',
        email: 'luis@usj.es',
        password: 'pwd',
        role: 'user'
      }
    ];

    dataDemographics = {
      "<18": 0,
      "18-30": 3,
      "40-65": 0,
      "+65": 0
    };

    dataPurchases = {
      customerNumPurchases: [{ idcustomer: 119, numPurchases: 3 }],
      maxPurchases: 3,
      averagePurchases: 3
    };

    dataEconomics = {
      customerSumExpenses: [{ idcustomer: 119, totalSpent: 600 }],
      maxSpent: 600,
      averageExpenses: 3
    }

    adminRepositoryMock = {
      findAll: jest.fn().mockImplementation(() => admins),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      edit: jest.fn(),
      delete: jest.fn(),
      statsDemographics: jest.fn().mockImplementation(() => dataDemographics),
      statsPurchases: jest.fn().mockImplementation(() => dataPurchases),
      statsEconomics: jest.fn().mockImplementation(() => dataEconomics)
    };
  });

  beforeAll(() => {
    Container.set(AdminRepository, adminRepositoryMock);
    adminService = Container.get(AdminService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#findAll', () => {
    let adminSpy: jest.SpyInstance;

    beforeAll(() => {
      adminSpy = jest.spyOn(adminRepositoryMock, 'findAll');
    });

    it('should get all admin of the database', () => {
      return adminService.findAll().then((_admins) => {
        expect(_admins).not.toBeNull();
        expect(_admins).toHaveLength(admins.length);
        expect(_admins).toEqual(admins);

        expect(adminSpy).toHaveBeenCalled();
      });
    });
  });

  describe('#findById', () => {
    let adminSpy: jest.SpyInstance;

    beforeAll(() => {
      adminSpy = jest.spyOn(adminRepositoryMock, 'findById');
    });

    describe('when the idAdmin is valid', () => {
      it('should call to findById method', async () => {
        await adminService.findById(1);
        expect(adminSpy).toHaveBeenCalled();
        expect(adminSpy).toHaveBeenCalledTimes(1);
        expect(adminSpy).toHaveBeenCalledWith(1);
      });
    });

    describe('when the idAdmin is not valid', () => {
      it('should throw a InvalidAdminIdError', () => {
        return expect(adminService.findById(-1)).rejects.toThrow(
          'InvalidAdminIdError'
        );
      });
    });
  });

  describe('#findByEmail', () => {
    let adminSpy: jest.SpyInstance;

    beforeAll(() => {
      adminSpy = jest.spyOn(adminRepositoryMock, 'findByEmail');
    });

    describe('when the AdminEmail is valid', () => {
      it('should call to findByEmail method', async () => {
        await adminService.findByEmail('rnovoa@usj.es');
        expect(adminSpy).toHaveBeenCalled();
        expect(adminSpy).toHaveBeenCalledTimes(1);
        expect(adminSpy).toHaveBeenCalledWith('rnovoa@usj.es');
      });
    });

    describe('when the AdminEmail is not valid', () => {
      it('should throw a InvalAdminEmailError', () => {
        return expect(adminService.findByEmail('')).rejects.toThrow(
          'InvalidAdminEmailError'
        );
      });
    });

    describe('when the AdminEmail is not valid', () => {
      it('should throw a InvalAdminEmailError', () => {
        return expect(adminService.findByEmail('usj')).rejects.toThrow(
          'InvalidAdminEmailError'
        );
      });
    });
  });

  describe('#edit', () => {
    let adminSpy: jest.SpyInstance;
    let admin: any;

    beforeAll(() => {
      adminSpy = jest.spyOn(adminRepositoryMock, 'edit');
    });

    beforeAll(() => {
      admin = {
        id: 1,
        role: 'admin'
      };
    });

    describe('when the admin is valid', () => {
      it('should call to edit method', async () => {
        await adminService.edit(admin);
        expect(adminSpy).toHaveBeenCalled();
        expect(adminSpy).toHaveBeenCalledTimes(1);
        expect(adminSpy).toHaveBeenCalledWith(admin);
      });
    });

    describe('when the admin is not valid', () => {
      beforeAll(() => {
        admin = {
          id: 1,
          role: ''
        };
      });
      it('should throw a InvalidAdminError', () => {
        return expect(adminService.edit(admin)).rejects.toThrow(
          'InvalidAdminError'
        );
      });
    });

    describe('when the admin is not valid', () => {
      beforeAll(() => {
        admin = {
          id: -1,
          role: 'admin'
        };
      });
      it('should throw a InvalidAdminError', () => {
        return expect(adminService.edit(admin)).rejects.toThrow(
          'InvalidAdminError'
        );
      });
    });
  });

  describe('#statsDemographics', () => {
    let demographicsSpy: jest.SpyInstance;

    beforeAll(() => {
      demographicsSpy = jest.spyOn(adminRepositoryMock, 'statsDemographics');
    });

    it('should call to statsDemographics method', async () => {
      await adminService.statsDemographics();
      expect(demographicsSpy).toHaveBeenCalled();
      expect(demographicsSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#statsPurchases', () => {
    let demographicsSpy: jest.SpyInstance;

    beforeAll(() => {
      demographicsSpy = jest.spyOn(adminRepositoryMock, 'statsPurchases');
    });

    it('should call to statsPurchases method', async () => {
      await adminService.statsPurchases();
      expect(demographicsSpy).toHaveBeenCalled();
      expect(demographicsSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#statsEconomics', () => {
    let demographicsSpy: jest.SpyInstance;

    beforeAll(() => {
      demographicsSpy = jest.spyOn(adminRepositoryMock, 'statsEconomics');
    });

    it('should call to statsEconomics method', async () => {
      await adminService.statsEconomics();
      expect(demographicsSpy).toHaveBeenCalled();
      expect(demographicsSpy).toHaveBeenCalledTimes(1);
    });
  });
});
