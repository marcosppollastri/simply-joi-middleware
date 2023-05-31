import * as express from 'express';
import * as request from 'supertest';
import * as Joi from 'joi';
import { validate, Targets } from '@src/index';
import { HttpCodes } from '@src/interfaces';

const app = express();
app.use(express.json());

const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
});

app.post('/testNextOnError', validate(schema, Targets.BODY, undefined, { nextOnError: true }), (req, res) => {
    res.json({ message: 'Success' });
});


app.post('/test', validate(schema, Targets.BODY), (req, res) => {
    res.json({ message: 'Success' });
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status || 500);
    res.json({ message: err.message });
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

describe('POST /testNextOnError', () => {
    it('should return 400 if the body is invalid and nextOnError is true', async () => {
        const res = await request(app)
            .post('/testNextOnError')
            .send({ name: 'John Doe' }); // no email, so it should fail

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/.*email.* is required/);
    });

    it('should return 200 if the body is valid and nextOnError is true', async () => {
        const res = await request(app)
            .post('/testNextOnError')
            .send({ name: 'John Doe', email: 'john.doe@example.com' });

        expect(res.status).toBe(200);
        expect(res.body.message).toEqual('Success');
    });
});
