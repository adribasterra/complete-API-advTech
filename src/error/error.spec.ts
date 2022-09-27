import 'reflect-metadata';

import { Container } from 'typedi';

import { ErrorService } from './error';

describe('Error module', () => {
  let errorService: ErrorService;

  beforeAll(() => {
    errorService = Container.get(ErrorService);
  });

  describe('#createInputValidationError', () => {
    it('should return a ErrorInputValidationError', () => {
      const err = errorService.createInputValidationError('Error');
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('ErrorInputValidationError');
    });
  });

  describe('#createInvalidIdError', () => {
    it('should return a InvalidErrorIdError', () => {
      const err = errorService.createInvalidIdError('Error');
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('InvalidErrorIdError');
    });
  });

  describe('#createUnauthorizedError', () => {
    it('should return a UnauthorizedErrorError', () => {
      const err = errorService.createUnauthorizedError('Error');
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('UnauthorizedErrorError');
    });
  });

  describe('#createNotFoundError', () => {
    it('should return a ErrorNotFoundError', () => {
      const err = errorService.createNotFoundError('Error');
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('ErrorNotFoundError');
    });
  });

  describe('#createNotAvailableOperationError', () => {
    it('should return a NotAvailableOperationError', () => {
      const err = errorService.createNotAvailableOperationError('Error');
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('Not Available Operation for Error datamodel');
    });
  });

  describe('#createFailedDependencyError', () => {
    it('should return a FailedDependencyError', () => {
      const err = errorService.createFailedDependencyError();
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('FailedDependencyError');
    });
  });
});
