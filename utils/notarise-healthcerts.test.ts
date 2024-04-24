import { isDecommTime } from "./notarise-healthcerts";

const setJestSystemTime = (mockedDate: Date) => {
  jest.useFakeTimers();
  jest.setSystemTime(mockedDate);
};

describe("test isDecommTime", () => {
  afterAll(() => {
    jest.useRealTimers();
  });

  it("should return false if current date is before the 1st May", () => {
    const mockedDate = new Date("04-30-2024 23:59:59 GMT+0800");
    setJestSystemTime(mockedDate);
    expect(isDecommTime()).toBe(false);
  });

  it("should return true if current date is equal to 1st May", () => {
    const mockedDate = new Date("05-01-2024 00:00:00 GMT+0800");
    setJestSystemTime(mockedDate);
    expect(isDecommTime()).toBe(true);
  });

  it("should return true if current date is 1 second after the 1st May", () => {
    const mockedDate = new Date("05-02-2024 00:00:01 GMT+0800");
    setJestSystemTime(mockedDate);
    expect(isDecommTime()).toBe(true);
  });

  it("should return true if current date is one day after the 1st May", () => {
    const mockedDate = new Date("05-02-2024 00:00:00 GMT+0800");
    setJestSystemTime(mockedDate);
    expect(isDecommTime()).toBe(true);
  });
});
