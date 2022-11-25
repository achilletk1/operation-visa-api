
import  sinon from 'sinon';
import  chai from 'chai';
import  sinonChai from 'sinon-chai';
import { TokenPayload, OauthToken } from '../../../models/access-token';
import config from '../../../config';
import  oauthHelper from './oauth.service.helper';
import { ImportMock } from 'ts-mock-imports';
import { before } from 'mocha';

chai.use(sinonChai);
const { expect } = chai;

describe('OauthServiceHelper', () => {

    describe('#getCurrDateSeconds()', () => {
        it('should return the current date in seconds', () => {
            // tslint:disable-next-line: no-bitwise
            expect(oauthHelper.getCurrDateSeconds()).to.equal(Date.now() / 1000 | 0);
        });
    });

    describe('#create()', () => {
        let configStub: sinon.SinonStub;
        let callStub: sinon.SinonStub;
        let generateStub: sinon.SinonStub;

        before(() => {
            callStub = sinon.stub(oauthHelper, 'getCurrDateSeconds').returns(0);

            generateStub = sinon.stub(oauthHelper, 'generateToken');
            generateStub.onCall(0).returns('fake_access_token')
            generateStub.onCall(1).returns('fake_refresh_token')

            configStub = sinon.stub(config, 'get');
            configStub.withArgs('oauthSalt').returns('Fake_salt');
            configStub.withArgs('oauthTTL').returns(3000);

        });

        after(() => {
            configStub.restore();
            callStub.restore()
            generateStub.restore()
        });

        it('should return oauth object', () => {
            // when
            const result = oauthHelper.create({ _id: 'fake_id' } as TokenPayload)

            // then
            expect(generateStub.firstCall).to.have.been.calledWith({ _id: 'fake_id', issued: 0, ttl: 3000 });
            expect(generateStub.secondCall).to.have.been.calledWith({ _id: 'fake_id' });
            expect(result).to.deep.equal({
                access_token: 'fake_access_token',
                refresh_token: 'fake_refresh_token',
                token_type: 'Bearer',
                issued: 0,
                expires_in: 3000
            });
        });
    });

    describe('#generateToken()', () => {
        let configStub: sinon.SinonStub;

        before(() => {
            configStub = sinon.stub(config, 'get');
            configStub.withArgs('oauthSalt').returns('Fake_salt');
        });

        after(() => {
            configStub.restore();
        });

        it('should return token string', () => {
            // given
            const payload: TokenPayload = {
                _id: 'id001', email: 'fake.user@gmail.com', userCode: 'USR003',
                fname: 'John', lname: 'Doe', tel: '23542722', category: 6, validationLevel: 2,
                companyId: 'id003', companyCategory: 201
            };

            // when
            const result = oauthHelper.generateToken(payload);

            // then
            expect(result).to.equal('2uVjNRhGf294TX5vX6xhqvPmC1XogTVetxikNS9cRGLtMr6sjC8dVkZdQtB2brmvUEQeuEow283KiMh7VYE4xEPfiAC6TSbpYqvLhwofLypzD56MJVs3PLp');
        });
    });

    describe('#decode()', () => {
        let configStub: sinon.SinonStub;

        before(() => {
            configStub = sinon.stub(config, 'get');
            configStub.withArgs('oauthSalt').returns('Fake_salt');
            configStub.withArgs('oauthTTL').returns(3000);
        });

        after(() => {
            configStub.restore();
        });

        it('should return initial payload', () => {
            // given
            const callStub = sinon.stub(oauthHelper, 'getCurrDateSeconds').returns(0);

            // when
            const result = oauthHelper.decode('ACoCM6pm5a4wowP9A5AG4TGDBYGRjrqYbFGoCCw9MTcqYLv1gmC7svt9ge7bDXrvaj5qrnadPLM1GS8mXZGSTvqpto9JrH995FrQZeMXdMtwHmp2duW795qkR3j7XDwBSUrtkck');

            // then
            expect(result).to.have.property('_id').equals('id001');
            expect(result).to.have.property('email').equals('fake.user@gmail.com');
            expect(result).to.have.property('userCode').equals('USR003');
            expect(result).to.have.property('fname').equals('John');
            expect(result).to.have.property('lname').equals('Doe');
            expect(result).to.have.property('tel').equals('23542722');
            expect(result).to.have.property('category').equals(6);
            expect(result).to.have.property('validationLevel').equals(2);
            expect(result).to.have.property('companyId').equals('id003');
            expect(result).to.have.property('companyCategory').equals(201);
            expect(result).to.have.property('issued').equals(1000000000);
            expect(result).to.have.property('ttl').equals(1000003000);
            callStub.restore();
        });

        it('should throw InvalidTokenSignature if bad token', (done) => {
            // given
            try {
                // when
                oauthHelper.decode('fakeToken');
                done(false);
            } catch (error) {
                // then
                expect(error.message).to.equal('InvalidTokenSignature');
                done();
            }
        });

        it('should throw MalformedToken if buffer decode error', (done) => {
            // given
            const bufferStub = sinon.stub(Buffer, 'from').throws('error');
            try {
                // when
                oauthHelper.decode('fakeToken');
                done(false);
            } catch (error) {
                // then
                expect(error.message).to.equal('MalformedToken');
                done();
            } finally {
                bufferStub.restore();
            }
        });

        it('should throw TokenExpired if ttl before now', () => {
            // given
            const callStub = sinon.stub(oauthHelper, 'getCurrDateSeconds').returns(2000000000);
            try {
                // when
                oauthHelper.decode('2NdragWFTB3hyxGxkQbjAWUXakEfz2xZfdmWwYCeceyXBFaapdyKzjXzKZbhRa7x9xm8JfgSQ6d3Ji8n1ie1D7A2Y1KwQymkw2CTUGEstyWmVPQ674Gcyo1maTWf8NwdtADjvWPkdE');
            } catch (error) {
                // then
                expect(error.message).to.equal('TokenExpired');
            } finally {
                callStub.restore();
            }
        });

    });

    describe('#refresh()', () => {
        let refreshSpy: sinon.SinonSpy;
        let thrownErr: Error;

        beforeEach(() => {
            refreshSpy = sinon.spy(oauthHelper, 'refresh');
            thrownErr = {} as Error;
        });

        afterEach(() => {
            refreshSpy.restore();
        })

        it('should throw error if decode fails', () => {
            // given
            thrownErr = new Error('FakeError');
            const decodeStub = sinon.stub(oauthHelper, 'decode').throws(thrownErr);

            // when
            try {
                oauthHelper.refresh('');
            } catch (error) {
                thrownErr = error;
            }

            // then
            expect(refreshSpy).throws(thrownErr);
            decodeStub.restore();
        });

        it('should throw payload has issued property', () => {
            // given
            const decodeStub = sinon.stub(oauthHelper, 'decode').returns({ issued: 10 } as TokenPayload);

            // when
            try {
                oauthHelper.refresh('');
            } catch (error) {
                thrownErr = error;
            }

            // then
            expect(refreshSpy).to.have.thrown();
            expect(thrownErr.message).to.equal('NotRefreshToken');
            decodeStub.restore();
        });

        it('should throw payload has ttl property', () => {
            // given
            const decodeStub = sinon.stub(oauthHelper, 'decode').returns({ ttl: 3600 } as TokenPayload);

            // when
            try {
                oauthHelper.refresh('');
            } catch (error) {
                thrownErr = error;
            }

            // then
            expect(refreshSpy).to.have.thrown();
            expect(thrownErr.message).to.equal('NotRefreshToken');
            decodeStub.restore();
        });

        it('should return created payload', () => {
            // given
            const decodeStub = sinon.stub(oauthHelper, 'decode').returns({ _id: 'fake_id' } as TokenPayload);
            const createStub = sinon.stub(oauthHelper, 'create').returns({ access_token: 'fake_access_token' } as OauthToken);

            // when
            const result = oauthHelper.refresh('');

            // then
            expect(createStub).to.have.been.calledWithExactly({ _id: 'fake_id' });
            expect(result).to.deep.equal({ access_token: 'fake_access_token' });
            decodeStub.restore();
            createStub.restore();
        });

    })

});