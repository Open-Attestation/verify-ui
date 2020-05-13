import { Selector } from "testcafe";

fixture("Counter Game").page`http://localhost:3000`;

const Counter = Selector(".counter div").nth(0);
const Increment = Selector(".counter button").nth(0);
const Decrement = Selector(".counter button").nth(1);

test("Custom certificate is rendered correctly", async (t) => {
  await t.expect(Counter.textContent).eql("Counter: 0");
  await t.click(Increment);
  await t.click(Increment);
  await t.click(Increment);
  await t.click(Increment);
  await t.expect(Counter.textContent).eql("Counter: 4");
  await t.click(Decrement);
  await t.click(Decrement);
  await t.expect(Counter.textContent).eql("Counter: 2");
});
