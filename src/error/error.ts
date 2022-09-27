import { Service } from 'typedi';
import * as HttpStatus from 'http-status-codes';

@Service()
export class ErrorService {
  createInputValidationError(name: string): Error {
    return new Error(`${name}InputValidationError`);
  }

  createInvalidIdError(name: string): Error {
    return new Error(`Invalid${name}IdError`);
  }

  createUnauthorizedError(name: string): Error {
    return new Error(`Unauthorized${name}Error`);
  }

  createNotFoundError(name: string): Error {
    return new Error(`${name}NotFoundError`);
  }

  createNotAvailableOperationError(name: string): Error {
    return new Error(`Not Available Operation for ${name} datamodel`);
  }

  createFailedDependencyError(): Error {
    return new Error('FailedDependencyError');
  }

  sendError(res: any, errorCode: number, errText?: string): void {
    let errorText = HttpStatus.getStatusText(errorCode);

    if (errText != null) {
      errorText = errorText.concat(`: ${errText}`);
    }

    res.status(errorCode).send({ error: errorText });
  }
}
