const should = require("should");
const sinon = require("sinon");
const { signIn } = require("./user.controller");
const userModel = require("./user.model");
const { UnauthorizedError } = require("../helpers/errors.constructor");

describe("#signIn", () => {
  let sandbox;
  let findUserByEmailStub;
  let actualResult;

  const email = "kyluk5@gmail.com";

  before(async () => {
    sandbox = sinon.createSandbox();
    findUserByEmailStub = sandbox.stub(userModel, "findUserByEmail");

    try {
      await signIn(email);
    } catch (error) {
      actualResult = error;
    }
  });

  after(() => {
    sandbox.restore();
  });

  it("should call findUserByEmail", () => {
    sinon.assert.calledOnce(findUserByEmailStub);
    sinon.assert.calledOnceWithExactly(findUserByEmailStub, email);
  });

  it("should throw error", () => {
    should.exists(actualResult instanceOf UnauthorizedError);
  });
});
