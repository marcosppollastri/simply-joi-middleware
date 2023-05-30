import * as express from 'express';
import * as request from 'supertest';
import * as Joi from 'joi';
import { HttpCodes, validate, Targets } from '@src/validate';

const app = express();
app.use(express.json());

const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
});

app.post('/test', validate(schema, Targets.BODY), (req, res) => {
    res.json({ message: 'Success' });
});

describe('POST /test', () => {
    it('should return 400 if the body is invalid', async () => {
        const res = await request(app)
            .post('/test')
            .send({ name: 'John Doe' }); // no email, so it should fail

        expect(res.status).toBe(400);
        expect(res.body.code).toEqual(HttpCodes.BAD_REQUEST);
        expect(res.body.message).toMatch(/.*email.* is required/);
    });

    it('should return 200 if the body is valid', async () => {
        const res = await request(app)
            .post('/test')
            .send({ name: 'John Doe', email: 'john.doe@example.com' });

        expect(res.status).toBe(200);
        expect(res.body.message).toEqual('Success');
    });
});
