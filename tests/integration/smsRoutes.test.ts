import {jest} from '@jest/globals';
import request from 'supertest';
import express from 'express';
import smsRoutes from '../../src/routes/smsRoutes.js';
import { geocodeAddress } from '../../src/services/geocode.js';
import { getPropertyData } from '../../src/services/property.js';
import { sendPropertyEmail } from '../../src/services/email.js';

/// <reference types="jest" />
jest.mock('../../src/services/geocode.js');
jest.mock('../../src/services/property.js');
jest.mock('../../src/services/email.js');

const app = express();
app.use(express.json());
app.use('/sms', smsRoutes);

describe('SMS Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /sms/incoming', () => {
        it('should return 400 if no SMS body provided', async () => {
            const response = await request(app)
                .post('/sms/incoming')
                .send({});

            expect(response.status).toBe(400);
        });

        it('should return 400 if SMS body is empty', async () => {
            const response = await request(app)
                .post('/sms/incoming')
                .send({ Body: '', From: '+1234567890' });

            expect(response.status).toBe(400);
        });

        it('should handle valid address lookup successfully', async () => {
            const mockGeo = { lat: 123, lon: 456, display_name: '123 Test St' };
            const mockProperty = { address: '123 Test St', value: 500000 };
            
            (geocodeAddress as jest.Mock).mockResolvedValue(mockGeo);
            (getPropertyData as jest.Mock).mockResolvedValue(mockProperty);
            (sendPropertyEmail as jest.Mock).mockResolvedValue(undefined);

            const response = await request(app)
                .post('/sms/incoming')
                .send({ Body: '123 Test St', From: '+1234567890' });

            expect(response.status).toBe(200);
            expect(response.type).toBe('text/xml');
            expect(response.text).toContain('Your property info has been sent to your email');
        });

        it('should handle address not found', async () => {
            (geocodeAddress as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .post('/sms/incoming')
                .send({ Body: 'Invalid Address', From: '+1234567890' });

            expect(response.status).toBe(404);
        });

        it('should handle property not found', async () => {
            const mockGeo = { lat: 123, lon: 456, display_name: '123 Test St' };
            
            (geocodeAddress as jest.Mock).mockResolvedValue(mockGeo);
            (getPropertyData as jest.Mock).mockResolvedValue(null);
            (sendPropertyEmail as jest.Mock).mockResolvedValue(undefined);

            const response = await request(app)
                .post('/sms/incoming')
                .send({ Body: '123 Test St', From: '+1234567890' });

            expect(response.status).toBe(200);
            expect(response.text).toContain('Check your email for the property info');
        });

        it('should handle service errors', async () => {
            (geocodeAddress as jest.Mock).mockRejectedValue(new Error('Service error'));

            const response = await request(app)
                .post('/sms/incoming')
                .send({ Body: '123 Test St', From: '+1234567890' });

            expect(response.status).toBe(500);
        });
    });
});