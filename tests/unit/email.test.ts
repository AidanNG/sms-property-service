import { jest } from '@jest/globals';
import { sendPropertyEmail } from '../../src/services/email.js';
import sgMail from '@sendgrid/mail';
import { env } from '../../src/config/env.js';
import { logger } from '../../src/utils/logger.js';

// Cast default exports to Jest mocks
const sgMailMock = sgMail as unknown as { send: jest.Mock };
const loggerMock = logger as unknown as {
  info: jest.Mock;
  error: jest.Mock;
  warn: jest.Mock;
};

jest.mock('@sendgrid/mail', () => ({
  __esModule: true,
  default: { send: jest.fn() },
}));

jest.mock('../../src/utils/logger.js', () => ({
  __esModule: true,
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('sendPropertyEmail', () => {
  const mockEmail = { subject: 'Test Subject', text: 'Test Content' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send email successfully', async () => {
    await sendPropertyEmail(mockEmail);

    expect(sgMailMock.send).toHaveBeenCalledWith({
      to: env.SENDGRID_TO_EMAIL,
      from: env.SENDGRID_FROM_EMAIL,
      subject: mockEmail.subject,
      text: mockEmail.text,
    });

    expect(loggerMock.info).toHaveBeenCalledWith('Email sent successfully', {
      to: env.SENDGRID_TO_EMAIL,
      subject: mockEmail.subject,
    });
  });

  it('should handle email sending failure', async () => {
    const mockError = new Error('Send failed');
    sgMailMock.send.mockRejectedValueOnce(mockError);

    await expect(sendPropertyEmail(mockEmail)).rejects.toThrow('Send failed');

    expect(loggerMock.error).toHaveBeenCalledWith('Failed to send email', {
      error: mockError.message,
    });
  });

  it('should handle SendGrid API errors with response body', async () => {
    const mockSendGridError = {
      response: { body: { errors: [{ message: 'Invalid API key' }] } },
    };
    sgMailMock.send.mockRejectedValueOnce(mockSendGridError);

    await expect(sendPropertyEmail(mockEmail)).rejects.toThrow();

    expect(loggerMock.error).toHaveBeenCalledWith('Failed to send email', {
      error: mockSendGridError.response.body,
    });
  });
});
